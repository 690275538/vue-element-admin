<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.CustomerAccount"
        placeholder="客户账号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.CustomerAddress"
        placeholder="客户地址"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.DateTimeRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
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
      <el-table-column label="客户账号" prop="CustomerAccount" />
      <el-table-column label="创建时间" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.CreateDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="ProductName" />
      <el-table-column label="合作商" prop="PartnerName" />
      <el-table-column label="合作商地址" prop="PartnerAddress" />
      <el-table-column label="合作商聊天工具" prop="PartnerChatTool" width="120">
        <template slot-scope="{row}">
          <span>{{ row.PartnerChatTool | chatToolFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售金额" prop="SellingPrice" align="center" width="80" />
      <el-table-column label="转出金额" prop="DistractPrice" align="center" width="80" />
      <el-table-column label="盈利金额" prop="ProfitPrice" align="center" width="80" />
      <el-table-column label="自付金额" prop="SelfPay" align="center" width="80" />
      <el-table-column label="备注" width="50px" align="left">
        <template slot-scope="{row}">
          <remark :remark="row.Remark" @saveRemark="saveRemark($event,row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :inline="true"
        :model="formTemp"
        label-width="150px"
        width="50%"
      >
        <el-form-item label="创建日期" prop="CreateDate">
          <el-date-picker
            v-model="formTemp.CreateDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="创建日期"
            style="width: 185px;"
          />
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
          <el-select
            v-model="formTemp.PartnerChatTool"
            class="filter-item"
            placeholder="请选择聊天工具"
            style="width: 185px;"
          >
            <el-option label="请选择聊天工具" :value="0" />
            <el-option
              v-for="item in chatToolOptions"
              :key="item.Key"
              :label="item.Value"
              :value="item.Key"
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
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="formTemp.Remark" type="textarea" :rows="2" />
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
import { add, edit, list, del, updateRemark, single } from '@/api/flowerOrder'
import Remark from '@/views/components/remark'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const pickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}

const chatToolOptions = [
  {
    Key: 1,
    Value: 'QQ'
  },
  {
    Key: 2,
    Value: 'Wechat'
  }
]

export default {
  name: 'FlowerOrder',
  components: { Pagination, Remark },
  directives: { waves },
  filters: {
    chatToolFilter(key) {
      const item = chatToolOptions.find(d => d.Key == key)
      if (item) return item.Value
      return ''
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      pickerOptions,
      chatToolOptions,
      listQuery: {
        StartDateTime: undefined,
        EndDateTime: undefined,
        DateTimeRange: [],
        PageModel: {
          PageIndex: 0,
          PageSize: 10,
          PageCount: 0
        },
        CustomerAccount: '',
        CustomerAddress: '',

        SortFileds: 'Id',
        IsAsc: true
      },
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
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
          Remark: ''
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      crtRemark: '',
      crtRow: undefined,
      textMap: {
        update: '编辑',
        create: '添加'
      },
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
        CustomerAccount: '',
        CustomerAddress: undefined,

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
        Remark: ''
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
    saveRemark(event, row) {
      // event 是 自定义 remark 事件传过来的
      updateRemark(row.Id, event.crtRemark).then(response => {
        if (response.Code == 0) {
          this.$message.success(response.Message)
          row.Remark = response.Data
        } else {
          this.$message.error(response.Message)
        }
        event.dialogVisible = false;
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
    }
  }
}
</script>
