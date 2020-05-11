<template>
  <div>
    <el-table :data="list" fit >
      <el-table-column label="账号">
        <template slot-scope="scope">{{ scope.row.customerAccount }}</template>
      </el-table-column>
      <el-table-column label="订单总数" align="center">
        <template slot-scope="scope">{{ scope.row.orderSum }}</template>
      </el-table-column>
      <el-table-column label="销售总价" align="center">
        <template slot-scope="{row}">¥{{row.sumSellingPrice}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { rankData } from '@/api/dashboard'
const testData = [{}]

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: testData
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      rankData().then(response => {
        if (response.Code == 0) {
          this.list = response.Data
        }
      })
    }
  }
}
</script>
