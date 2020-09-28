<template>
    <div class="app-container">
      <el-form  :model="otdForm" :rules="rules" ref="otdForm" label-width="100px">
        <el-form-item label="标题" prop="name">
          <el-input style="width: 45%" v-model="otdForm.name"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="name">
          <el-input style="width: 45%" v-model="otdForm.creator"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="name">
          <Tinymce v-model="otdForm.content" />
        </el-form-item>

      </el-form>
    </div>
</template>

<script>
    import Tinymce from "../../components/Tinymce/index";
    export default {
        name: "create",
      components: {
        Tinymce
      },
      data(){
          return{
            otdForm: {
              title: '',
              creator:'',
              content:''
            },
            rules: {
              name: [
                {required: true, message: '请输入活动名称', trigger: 'blur'},
                {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
              ],
            }
          }
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped>

</style>
