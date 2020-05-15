<template>
  <div class="mixin-components-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Material Design 的input</span>
          </div>
          <div style="height:100px;">
            <dropzone
              id="myVueDropzone"
              :options="dropzoneImportCityOptions"
              @dropzone-removedFile="dropzoneR"
              @dropzone-success="dropzoneS"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>水波纹 waves v-directive</span>
          </div>
          <div class="component-item">
            <el-button v-waves type="primary">水波纹效果</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>水波纹 waves v-directive</span>
          </div>
          <div class="component-item">
            <el-button v-waves type="primary">水波纹效果</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>水波纹 waves v-directive</span>
          </div>
          <div class="component-item">
            <el-button v-waves type="primary">水波纹效果</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
import Dropzone from '@/components/Dropzone'//拖拽上传
import { importCity, importHistoryOrder } from '@/api/common'
import {
  getToken
} from '@/utils/auth'
import defaultSettings from '@/settings'

const dropzoneImportCityOptions = {
  url: importCity(),
  headers: { [defaultSettings.tokenName]: getToken() }
}

export default {
  name: 'ComponentMixinDemo',
  components: {
    Dropzone
  },
  directives: {
    waves
  },
  data() {
    return {
      dropzoneImportCityOptions,
      demo: {
        title: ''
      },
    }
  },
  mounted() {
  },
  methods: {
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    }
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item {
  min-height: 100px;
}
</style>
