<template>
  <div class="app-container">
    <el-form :model="otdForm" ref="otdForm" label-width="68px">
      <el-form-item label="标题">
        {{otdForm.title}}
      </el-form-item>
      <el-form-item label="发布人">
        {{otdForm.publisher}}
      </el-form-item>
      <el-form-item label="创建时间">
        {{otdForm.createTime}}
      </el-form-item>
      <el-form-item label="发布时间">
        {{otdForm.publishTime}}
      </el-form-item>
      <el-form-item label="查看学校">
        <el-table :data="schoolData">
          <el-table-column label="文件名称" prop="title" />
          <el-table-column label="学校名称" prop="schoolName" />
          <el-table-column label="查看状态" prop="state">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isReceived===0" type="warning" >
                未查看
              </el-tag>
              <el-tag v-else type="success" >
                已查看
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="footer-fj">

    </div>
  </div>
</template>

<script>
  import {checkDetail} from '@/api/office/document'
  export default {
    name: "detail",
    data() {
      return {
        otdForm:{
          content: '2321312',
          title:'22',
          publisher:'33',
          createTime:'2020-2-10',
          publishTime:'2020-3-12'
        },
        schoolData:[],
        id:undefined,
      }
    },
    created(){
      this.id = this.$route.params.id
    },
    mounted(){
      this.getOtdForm()
    },
    methods:{
      getOtdForm(){
        checkDetail(this.id).then(res=>{
          this.schoolData = res.schools
          this.otdForm = res.document
        })
      }
    }
  }
</script>

<style scoped>

</style>
