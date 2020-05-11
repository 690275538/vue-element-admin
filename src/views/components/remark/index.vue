<template>
  <div>
    <el-tooltip :disabled="crtRemark==null||crtRemark==''" placement="top">
      <div slot="content">{{ crtRemark }}</div>
      <el-button
        :type="crtRemark?'danger':'primary'"
        style="padding: 5px 7px;"
        size="mini"
        @click="edit_remark()"
      >
        <template v-if="title&&title.length">{{title}}</template>
        <template v-else>注</template>
      </el-button>
    </el-tooltip>

    <el-dialog :visible.sync="dialogVisible" title="修改备注" width="30%">
      <el-input v-model="crtRemark" type="textarea" :rows="2" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRemark()">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Remark',
  props: [
    'title',
    'remark',
  ],
  data() {
    return {
      crtRemark: this.remark,
      dialogVisible: false
    }
  },
  created() {

  },
  methods: {
    edit_remark() {
      this.dialogVisible = true
    },
    resetRemark() {
      this.crtRemark = ''
      this.dialogVisible = false
    },
    saveRemark() {
      this.$emit('saveRemark', this)
    },
  },
}
</script>

<style>
</style>
