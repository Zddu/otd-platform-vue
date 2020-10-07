<template>
  <div class="app-container">
    <el-form :model="otdForm" ref="otdForm" label-width="68px">
      <el-form-item label="标题">
        {{otdForm.title?otdForm.title:""}}
      </el-form-item>
      <el-form-item label="发布人">
        {{otdForm.publisher?otdForm.publisher:""}}
      </el-form-item>
      <el-form-item label="发布时间">
        {{otdForm.publishTime?otdForm.publishTime:""}}
      </el-form-item>
      <el-form-item label="内容">
        <div style="line-height: 0;" v-html="otdForm.content"></div>
      </el-form-item>
    </el-form>
    <div class="footer-fj">
      <div style="font-size: 12px" v-for="item in odFiles">
        附件下载: [
        <el-button style="font-size: 12px" type="text" @click="downloadByUser(item.id)">{{item.originalName}}</el-button>
        ]
      </div>
    </div>
  </div>
</template>

<script>
  import {checkDetail} from '@/api/school/document'

  export default {
    name: "detail",
    data() {
      return {
        otdForm: {
          content: '',
          title: '',
          publisher: '',
          publishTime: '',
        },
        base_url: process.env.VUE_APP_BASE_API,
        odFiles: [],
        id: undefined,
      }
    },
    created() {
      this.id = this.$route.params.id
    },
    mounted() {
      this.getOtdForm()
    },
    methods: {
      downloadByUser(id) {
        window.open(`${this.base_url}document/document/download?id=` + encodeURI(`${id}`))
      },
      getOtdForm() {
        checkDetail(this.id).then(res => {
          this.otdForm = res.data
          this.odFiles = res.data.odFiles
          console.log(this.odFiles);
        })
      }
    }
  }
</script>

<style scoped>
  .footer-fj {
    margin-top: 30px;
    margin-left: 15px;
  }
</style>
