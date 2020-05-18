<template>
  <div class="mixin-components-container">
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Material Design 的 input</span>
          </div>
          <div class="component-item">
            <el-upload
              class="upload-demo"
              drag
              :action="url"
              :headers="headers"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
import Dropzone from '@/components/Dropzone' //拖拽上传
import { importCity, importHistoryOrder } from '@/api/common'
import { getToken } from '@/utils/auth'
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
      url: dropzoneImportCityOptions.url,
      headers: dropzoneImportCityOptions.headers,
      demo: {
        title: ''
      }
    }
  },
  mounted() {},
  methods: {
    handleUploadSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    handleUploadError(response, file, fileList) {
      console.log(response)
      this.$message.error(response.message)
    },
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 20px;
  min-height: calc(100vh - 84px);
}
.component-item {
  height: 200px;
}
</style>
