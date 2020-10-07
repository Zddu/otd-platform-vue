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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['document:document:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['document:document:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['document:document:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['document:document:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="documentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="文件名称" align="center">
        <template slot-scope="scope">
          <router-link
            style="color:#1697ee"
            :to="{path:`detail/${scope.row.id}`}"
          >
            {{ scope.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="发布者" align="center" prop="publisher"/>
      <el-table-column label="创建时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.state===1">已发布</el-tag>
          <el-tag type="warning" v-else>未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-top"
            @click="handleOut(scope.row)"
          >发布
          </el-button>
          <el-button
            v-if="scope.row.state!==0"
            size="mini"
            type="text"
            icon="el-icon-bottom-right"
            @click="handleWithdraw(scope.row)"
          >撤回
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['document:document:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['document:document:remove']"
          >删除
          </el-button>
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
    <!--    发布-->
    <el-dialog title="发布" :visible.sync="openout" width="400px" append-to-body>
      <el-form ref="formOut" label-width="80px">
        <el-form-item label="搜索">
          <el-input
            size="small"
            placeholder="输入学校名进行过滤"
            v-model="filterText">
          </el-input>
        </el-form-item>
        <el-form-item label="发送学校">
          <el-tree
            ref="tree"
            :data="schoolData"
            :default-checked-keys="checkedData"
            show-checkbox
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
        <el-button @click="openout = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改文件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入文件名称"/>
        </el-form-item>
        <el-form-item label="文件内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            :key="2"
            :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport"
            :disabled="upload.isUploading"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
            multiple
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    deleteFj,
    withdrawDocument,
    checkedSchools,
    outSchools,
    listDepts,
    listDocument,
    getDocument,
    delDocument,
    addDocument,
    updateDocument,
    exportDocument
  } from "@/api/office/document";
  import Editor from '@/components/Editor';
  import {getToken} from "@/utils/auth";

  export default {
    name: "list",
    components: {Editor},
    data() {
      return {
        myInterval: '',
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
        fjData: [],
        checkedData: [],
        filterText: '',
        schoolData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        outData: {
          documentId: undefined,
          schoolIds: []
        },
        openout: false,
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
        // 表单校验
        rules: {},
        fileList: []
      };
    },
    created() {
      this.getListDepts();
      this.getList();
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        console.log(response);
        this.form.odFiles.push(response)
        this.upload.isUploading = false;
        this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        let arr = [];
        if (this.form.odFiles) {
          this.form.odFiles.splice(this.form.odFiles.findIndex(item => item.id === file.id), 1);
        }
        console.log(this.form.odFiles);
        arr.push(file.id);
        deleteFj(arr).then(res => {
          if (res.code === 200) {
            this.msgSuccess("删除成功");
          }
        })
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleWithdraw(row) {
        this.checkedData = []
        this.$confirm('是否确认撤回该文件?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          withdrawDocument(row.id).then(res => {
            if (res.code === 200) {
              this.msgSuccess("撤回成功")
              this.getList()
            }
          })
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getCheckedNodes() {
        this.outData.schoolIds = []
        let arr = this.$refs.tree.getCheckedNodes(true)
        arr.forEach(item => {
          this.outData.schoolIds.push(item.id)
        })
        if (this.outData.schoolIds.length > 0) {
          outSchools(this.outData).then(res => {
            if (res.code === 200) {
              this.msgSuccess("发布成功")
              this.openout = false
              this.getList()
            }
          })
        } else {
          this.msgError("未勾选任何学校！")
        }

      },
      handleOut(row) {
        this.openout = true
        this.outData.documentId = row.id
        checkedSchools(row.id).then(res => {
          this.checkedData = res.data
        })
      },
      getListDepts() {
        listDepts().then(res => {
          this.schoolData = res.data
        })
      },
      /** 查询文件列表 */
      getList() {
        this.loading = true;
        listDocument(this.queryParams).then(response => {
          this.documentList = response.rows;
          this.total = response.total;
          this.loading = false;
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
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加文件";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.fileList = []
        const id = row.id || this.ids
        getDocument(id).then(response => {
          this.form = response.data;
          let arr = response.data.odFiles;
          console.log(arr);
          if (arr.length > 0) {
            arr.forEach(item => {
              let urlData = {}
              urlData.name = item.originalName
              urlData.id = item.id
              urlData.url = item.path
              this.fileList.push(urlData)
            })
          }
          this.open = true;
          this.title = "修改文件";
        });
      },
      /** 提交按钮 */
      submitForm() {
        console.log(this.form);
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateDocument(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addDocument(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除文件编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDocument(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有文件数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportDocument(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function () {
        });
      }
    },

  };
</script>
