<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        class="filter-item"
        v-model="listQuery.Id"
        placeholder="Id"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-input
        class="filter-item"
        v-model="listQuery.Value"
        placeholder="值"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-input
        class="filter-item"
        v-model="listQuery.Label"
        placeholder="文本"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
        clearable
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="Id" prop="Id" />
      <el-table-column label="值" prop="Value" />
      <el-table-column label="文本" prop="Label" />
      <el-table-column label="排序" prop="Sort" />
      <el-table-column label="是否禁用" prop="Disabled" width="120">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.Disabled"
            active-color="#ff4949"
            inactive-color="#13ce66"
            @change="handleDisabledStatus($event,row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">添加</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="listQuery.PageModel.PageCount>0"
      :total="listQuery.PageModel.PageCount"
      :page.sync="listQuery.PageModel.PageIndex"
      :limit.sync="listQuery.PageModel.PageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :rules="rules" :model="formTemp" label-width="150px" width="50%">
        <el-form-item label="值">
          <el-input v-model="formTemp.Value" />
        </el-form-item>
        <el-form-item label="文本" prop="Label">
          <el-input v-model="formTemp.Label" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model.number="formTemp.Sort" />
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch v-model="formTemp.Disabled" active-color="#ff4949" inactive-color="#13ce66"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, edit, list, del, single, updateDisabledStatus } from '@/api/dataDictionary'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DataDictionary',
  components: { Pagination },
  directives: { waves },
  filters: {
    chatToolFilter(key) {
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        StartDateTime: undefined,
        EndDateTime: undefined,
        DateTimeRange: [],
        PageModel: {
          PageIndex: 0,
          PageSize: 10,
          PageCount: 0
        },
        Id: '',
        Value: '',
        Label: '',

        SortFileds: 'Id',
        IsAsc: true
      },
      formTemp: {
        Value: '',
        Label: '',
        Sort: 0,
        Disabled: false,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        Label: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],

      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (
        this.listQuery.DateTimeRange &&
        this.listQuery.DateTimeRange.length == 2
      ) {
        this.listQuery.StartDateTime = this.listQuery.DateTimeRange[0]
        this.listQuery.EndDateTime = this.listQuery.DateTimeRange[1]
      } else {
        this.listQuery.StartDateTime = undefined
        this.listQuery.EndDateTime = undefined
      }
      list(this.listQuery).then(response => {
        this.list = response.Data.DataList
        this.listQuery.PageModel.PageCount = response.Data.PageModel.PageCount

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.PageModel.PageIndex = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order == 'ascending') {
        this.listQuery.OrderByType = true
      } else {
        this.listQuery.OrderByType = false
      }
      this.listQuery.SortFileds = prop
      this.handleFilter()
    },
    resetForm() {
      this.formTemp = {
        Value: '',
        Label: '',
        Sort: 0,
        Disabled: false,
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          add(this.formTemp).then(response => {
            if (response.Code == 0) {
              this.$message.success(response.Message)
            } else {
              this.$message.error(response.Message)
            }
            this.dialogFormVisible = false
            this.handleFilter()
          })
        }
      })
    },
    handleUpdate(row) {
      this.formTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.formTemp)
          edit(tempData).then(response => {
            if (response.Code == 0) {
              this.$message.success(response.Message)
            } else {
              this.$message.error(response.Message)
            }
            this.dialogFormVisible = false
            this.handleFilter()
          })
        }
      })
    },
    handleDelete(row) {
      del(row.Id).then(response => {
        if (response.Code == 0) {
          this.$message.success(response.Message)
        } else {
          this.$message.error(response.Message)
        }
        this.handleFilter()
      })
    },
    handleDisabledStatus(event, row) {
      updateDisabledStatus(row.Id, event).then(response => {
        if (response.Code == 0) {
          this.$message.success(response.Message)
        } else {
          this.$message.error(response.Message)
        }
        this.handleFilter()
      })
    }
  }
}
</script>
