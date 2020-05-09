<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        placeholder="Imp"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="Type"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
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
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.CreateDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户账号" prop="CustomerId" />
      <el-table-column label="产品id" prop="ProductId" />
      <el-table-column label="配送地址" prop="DeliveryAddress" />
      <el-table-column label="合作商id" prop="PartnerId" />
      <el-table-column label="销售金额" prop="SellingPrice" />
      <el-table-column label="转出金额" prop="DistractPrice" />
      <el-table-column label="盈利金额" prop="ProfitPrice" />
      <el-table-column label="自付金额" prop="SelfPay" />
      <el-table-column label="备注" prop="Remak" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formTemp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="创建日期" prop="CreateDate">
          <el-date-picker v-model="formTemp.CreateDate" type="datetime" placeholder="创建日期" />
        </el-form-item>
        <el-form-item label="客户账号" prop="CustomerAccount">
          <el-input v-model="formTemp.CustomerAccount" />
        </el-form-item>
        <el-form-item label="商品名称" prop="ProductName">
          <el-input v-model="formTemp.ProductName" />
        </el-form-item>
        <el-form-item label="合作商名称" prop="PartnerName">
          <el-input v-model="formTemp.PartnerName" />
        </el-form-item>
        <el-form-item label="合作商地址" prop="PartnerAddress">
          <el-input v-model="formTemp.PartnerAddress" />
        </el-form-item>
        <el-form-item label="与合作商聊天工具" prop="PartnerChatTool">
          <el-select v-model="formTemp.PartnerChatTool" class="filter-item" placeholder="请选择聊天工具">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售价格" prop="SellingPrice">
          <el-input v-model="formTemp.SellingPrice" />
        </el-form-item>
        <el-form-item label="转出金额" prop="DistractPrice">
          <el-input v-model="formTemp.DistractPrice" />
        </el-form-item>
        <el-form-item label="盈利金额" prop="ProfitPrice">
          <el-input v-model="formTemp.ProfitPrice" />
        </el-form-item>
        <el-form-item label="自付金额" prop="SelfPay">
          <el-input v-model="formTemp.SelfPay" />
        </el-form-item>
        <el-table-column label="备注" width="120px" align="left">
          <template slot-scope="scope">
            <el-tooltip :disabled="scope.row.Remarks==null||scope.row.Remarks==''" placement="top">
              <div slot="content">{{ scope.row.Remarks }}</div>
              <el-button
                :type="scope.row.Remarks?'danger':'primary'"
                style="padding: 5px 7px;"
                size="mini"
                @click="edit_remark(scope.row,scope.row.Remarks)"
              >注</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import flowerOrder from '@/api/flowerOrder'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'FlowerOrder',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      formTemp: {
        Order: {
          CustomerAccount: '',
          CustomerAddress: '',

          ProductName: '',

          PartnerName: '',
          PartnerAddress: '',
          PartnerChatTool: 0,

          CreateDate: new Date(),
          DeliveryAddress: '',
          SellingPrice: 0,
          DistractPrice: 0,
          ProfitPrice: 0,
          SelfPay: 0,
          Remak: ''
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetOrder() {
      this.formTemp = {
        CustomerAccount: '',
        CustomerAddress: '',

        ProductName: '',

        PartnerName: '',
        PartnerAddress: '',
        PartnerChatTool: 0,

        CreateDate: new Date(),
        DeliveryAddress: '',
        SellingPrice: 0,
        DistractPrice: 0,
        ProfitPrice: 0,
        SelfPay: 0,
        Remak: ''
      }
    },
    handleCreate() {
      this.resetOrder()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    edit_remark(row, remark) {
      this.isCancelOrder = false
      this.dialogRemarksFormTitle = '修改备注'
      this.crtRow = row
      this.crtRemark = remark
      this.dialogRemarksFormVisible = true
    },
    resetRemark() {
      this.crtRemark = ''
      this.dialogRemarksFormVisible = false
    },
    saveRemark() {
      if (this.isCancelOrder) {
        check_in_cancel_order(this.crtRow.Id, this.crtRemark).then(response => {
          if (response.data.Status == true) {
            this.$message.success(response.data.Message)
            this.crtRow.Remarks = response.data.Result.Remarks
            this.inquire()
          } else {
            this.$message.error(response.data.Message)
          }
        })
      } else {
        check_in_edit_remark(this.crtRow.Id, this.crtRemark).then(response => {
          if (response.data.Status == true) {
            this.$message.success(response.data.Message)
            this.crtRow.Remarks = response.data.Result.Remarks
          } else {
            this.$message.error(response.data.Message)
          }
        })
      }

      this.dialogRemarksFormVisible = false
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.formTemp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.formTemp.author = 'vue-element-admin'
          createArticle(this.formTemp).then(() => {
            this.list.unshift(this.formTemp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.formTemp = Object.assign({}, row) // copy obj
      this.formTemp.timestamp = new Date(this.formTemp.timestamp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.formTemp.id)
            this.list.splice(index, 1, this.formTemp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
