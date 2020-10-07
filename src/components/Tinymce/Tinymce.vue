<template>
  <Editor v-model="data" :init="init" :disabled="disabled"/>
</template>
<script>
  import tinymce from "tinymce/tinymce";
  import Editor from "@tinymce/tinymce-vue";
  import "tinymce/themes/silver/theme";
  import "tinymce/icons/default/icons";
  import "tinymce/plugins/image";
  import "tinymce/plugins/media";
  import "tinymce/plugins/table";
  import "tinymce/plugins/lists";
  import "tinymce/plugins/contextmenu";
  import "tinymce/plugins/wordcount";
  import "tinymce/plugins/colorpicker";
  import "tinymce/plugins/textcolor";
  import "tinymce/plugins/preview";
  import "tinymce/plugins/code";
  import "tinymce/plugins/link";
  import "tinymce/plugins/advlist";
  import "tinymce/plugins/codesample";
  import "tinymce/plugins/hr";
  import "tinymce/plugins/fullscreen";
  import "tinymce/plugins/textpattern";
  import "tinymce/plugins/searchreplace";
  import "tinymce/plugins/autolink";
  import "tinymce/plugins/directionality";
  import "tinymce/plugins/visualblocks";
  import "tinymce/plugins/visualchars";
  import "tinymce/plugins/template";
  import "tinymce/plugins/charmap";
  import "tinymce/plugins/nonbreaking";
  import "tinymce/plugins/insertdatetime";
  import "tinymce/plugins/imagetools";
  import "tinymce/plugins/autosave";
  import "tinymce/plugins/autoresize";
  import toolbar from "./toobar.js";
  export default {
    name: "tinymce",
    components: {
      Editor
    },
    props: {
      value: { type: String, required: true }, // 编辑内容
      option: { type: Object, default: undefined }, // 配置参数
      disabled: { type: Boolean, default: false },
      menubar: {
        type: String,
        default: "file edit insert view format table"
      }
    },
    data() {
      return {
        data: this.value,
        init: {
          menubar: false, // 禁用菜单栏
          branding: false, // 隐藏右下角技术支持
          elementpath: false, // 隐藏底栏的元素路径
          paste_data_images: true,
          font_formats:
            "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif",
          fontsize_formats:
            "12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px 50px 60px 70px 80px 90px 100px 120px 140px 160px 180px 200px",
          language_url: "/static/tinymce/langs/zh_CN.js",
          language: "zh_CN",
          skin_url: "/static/tinymce/skins/ui/oxide",
          content_css: "/static/tinymce/skins/content/content.css",
          plugins:  ['advlist autolink autosave code codesample colorpicker colorpicker contextmenu directionality fullscreen hr image imagetools  insertdatetime link lists media nonbreaking paste preview searchreplace table template textcolor textpattern visualblocks visualchars wordcount'],
          toolbar: toolbar,
          menubar: this.menubar,
          contextmenu: false, // 禁用富文本的右键菜单，使用浏览器自带的右键菜单
          height: 500,
          ...this.option
        }
      };
    },
    mounted() {
      tinymce.init({
        paste_data_images: true, // 设置为“true”即允许粘贴图像，而将其设置为“false”则不允许粘贴图像。
        images_upload_handler: function (blobInfo, success, failure) {
          let formData = new FormData()
          console.log(blobInfo.filename())
          formData.append('img', blobInfo.blob())
          self.$axios.post('http://127.0.0.1:8000/upload/', formData)
            .then(response => {
              console.log(response.data['url'])
              if (response.data['code'] == 200) {
                success(response.data['url'])
              } else {
                failure('上传失败！')
              }
            })
        }
      });
    },
    methods: {

    },
    watch: {
      value (newValue) {
        this.data = newValue
      },
      data (newValue) {
        this.$emit('input', newValue)
      }
    }

  };
</script>
