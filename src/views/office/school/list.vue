<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文件名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布者" prop="publisher">
        <el-input
          v-model="queryParams.publisher"
          placeholder="请输入发布者(用户)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.publishTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入状态："
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          :disabled="multiple"
          @click="handleCollect"
        >归档</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['document:receive:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="documentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件名称" align="center" >
        <template slot-scope="scope">
          <router-link
            @click="pauseAudio"
            style="color:#1697ee"
            :to="{path:`sch/detail/${scope.row.id}`}"
          >
            {{ scope.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="发布者" align="center" prop="publisher" />
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isReceived===1">已查看</el-tag>
          <el-tag type="warning" v-else>未查看</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            style="color: #b8c2c2"
            v-if="scope.row.isCollected===1"
            icon="el-icon-plus"
          >已归档</el-button>
          <el-button
            size="mini"
            v-else
            type="text"
            icon="el-icon-plus"
            @click="handleCollect(scope.row)"
          >未归档</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <audio loop="loop" id="audio" src="../../../assets/voice.wav"/>
  </div>
</template>

<script>
  import { listDocument, checkDetail, getDocument,exportDocument,isCollected} from "@/api/school/document";

  export default {
    name: "list",
    data() {
      return {
        openout:false,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 文件表格数据
        documentList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          publisher: null,
          publishTime: null,
          state: null
        },
        // 表单参数
        form: {},
        myInterval:'',
        myInterval1:'',
      };
    },
    created() {
      this.getList();
    },

    methods: {
      pauseAudio(){
        const audio = document.getElementById('audio')
        audio.pause()
      },
      polling(){
        let first_size ;
        let second_size ;
        this.myInterval = window.setInterval(() => {
          setTimeout(() => {
            listDocument(this.queryParams).then(response => {
              this.documentList = response.rows;
              first_size = response.rows.length;
              this.documentList.forEach((item,index)=>{
                if (item.isReceived === 0) {
                  this.aplayAudio()
                  this.$notify.info({
                    title: '新文件',
                    message: `来了一条新文件：【${ response.rows[index].title}】`,
                    duration: 3000
                  });
                }
              })
              // if ((first_size !== second_size)&&(first_size > second_size)) {
              //
              // }
              second_size = response.rows.length;
            });
          }, 1)
        }, 2000);
      },
      aplayAudio () {
        const audio = document.getElementById('audio')
        audio.play()
      },
      /** 查询文件列表 */
      getList() {
        this.loading = true;
        listDocument(this.queryParams).then(response => {
          this.documentList = response.rows;
          this.total = response.total;
          this.loading = false;
          this.polling()
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          title: null,
          content: null,
          publisher: null,
          updateTime: null,
          publishTime: null,
          createTime: null,
          state: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },

      /** 归档按钮操作 */
      handleCollect(row) {
        const ids = row.id || this.ids;
        let arr = [];
        if (ids.length > 1) {
          ids.forEach(item=>{
            arr.push(item)
          })
        }else {
          arr.push(ids)
        }
        this.$confirm('是否确认归档该文件?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
          isCollected(arr).then(res=>{
            if (res.code === 200) {
              this.getList();
              this.msgSuccess("归档成功");
            }
          })
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有文件数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDocument(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    },
    beforeDestroy() {
      clearInterval(this.myInterval)
    }
  };
</script>
