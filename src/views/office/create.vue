<template>
  <div class="app-container">
    <el-form :model="otdForm" :rules="rules" ref="otdForm" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input style="width: 45%" v-model="otdForm.title"></el-input>
      </el-form-item>
      <el-form-item label="文件编号" prop="fileCode">
        <el-input style="width: 45%" v-model="otdForm.fileCode"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <Editor :height="320" v-model="otdForm.content"/>
      </el-form-item>
      <el-form-item>
        <el-upload style="display: inline-block;margin-right: 10px;" ref="upload" :limit="1" :show-file-list="false" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" >
          <el-button type="success" icon="el-icon-plus">{{uploadText}}</el-button>
        </el-upload>
        <el-button type="primary" @click="submitForm('otdForm')">立即创建</el-button>
        <el-button @click="resetForm('otdForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {attachment} from '@/api/office/create'
  import Tinymce from "../../components/Tinymce/Tinymce";
  import { getToken } from "@/utils/auth";
  import Editor from "../../components/Editor/index";
  export default {
    name: "create",
    components: {Editor, Tinymce},
    data() {
      return {
        uploadText:'上传附件',
        upload: {
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/document/document/upload",
        },
        otdForm: {
          title: '',
          fileCode: '',
          content: '',
          odFiles: []
        },
        rules: {
          title: [
            {required: true, message: '请输入文件标题', trigger: 'blur'},
          ],
          publisher: [
            {required: true, message: '请输入发布人', trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.otdForm);
            attachment(JSON.stringify(this.otdForm)).then(res=>{
              if (res.code === 200) {
                this.msgSuccess("创建成功")
                this.$router.push({path:'list'})
              }
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.uploadText = '正在上传中...'
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.otdForm.odFiles.push(response)
        this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
        this.uploadText='上传附件'
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
    }
  }
</script>

<style scoped>
</style>
