<template>
<section>
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.query" placeholder="姓名/账号/地址" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="getRows" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="handleAdd" icon="el-icon-plus">添加</el-button>
      </el-form-item>
    </el-form>
  </el-col>
  <el-table :data="rows" style="width: 100%" stripe border>
    <el-table-column label="注册日期" width="180">
      <template slot-scope="scope">
       <i class="el-icon-time"></i>
       <span style="margin-left: 10px">{{ scope.row.create_date }}</span>
     </template>
    </el-table-column>
    <el-table-column label="姓名" width="180" :show-overflow-tooltip="true">
      <template slot-scope="scope">
       <el-popover trigger="hover" placement="top">
         <p>姓名: {{ scope.row.name }}</p>
         <p>住址: {{ scope.row.address }}</p>
         <div slot="reference" class="name-wrapper">
           <el-tag size="medium">{{ scope.row.name }}</el-tag>
         </div>
       </el-popover>
     </template>
    </el-table-column>
     <el-table-column prop="code" label="账号" width="100" align="center" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        {{scope.row.code}}
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别" width="100" align="center" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        {{scope.row.sex}}
      </template>
    </el-table-column>
     <el-table-column label="年龄" width="80">
      <template slot-scope="scope">     
       <span style="margin-left: 10px">{{ scope.row.age }}</span>
     </template>
    </el-table-column>
       <el-table-column label="地址" width="180">
      <template slot-scope="scope">
      
       <span style="margin-left: 10px">{{ scope.row.address }}</span>
     </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
       <el-button
         size="mini"
         type="primary"
         @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
       <el-button
         size="mini"
         type="danger"
         @click="handleDelete(scope.$index, scope.row)">删除</el-button>
     </template>
    </el-table-column>
  </el-table>
   <!--分页-->
  <el-col :span="24" class="toolbar">
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=page
      :page-sizes="[1,2,5,10,20,30]"
      :page-size=size
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
    </el-pagination>
  </el-col>
<!--对话框-->
 <el-dialog :title="form && form.id ? '编辑' : '新增' " :visible.sync="formVisible" :close-on-click-modal="false">
    <el-form :model="form" label-width="100px" :rules="rules" ref="form"  :visible.sync="formVisible">
      <el-form-item label="密码" prop="pass">
      <el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="form.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
          </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="formVisible = false">取消</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
      <el-button type="primary" @click.native="handleSubmit" :loading="formLoading">提交</el-button>
    </div>
  </el-dialog>
</section>
</template>

<script>
const rules = {
    
  pass: [{
    required: true,
    message: '请输入密码!',
    trigger: 'blur'
  },
  { validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
      } else {
         if (this.form&&this.form.checkPass !== "") {
           this.$ref.form.validateField("checkPass");
         }
        callback()
      }
    }, 
  trigger: 'change' }
  ],
  checkPass: [{
    required: true,
    message: '请输入确认密码!',
    trigger: 'blur'
  },{ validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }, trigger: 'change' }],
  name: [{
    required: true,
    message: '请输入姓名',
    trigger: 'blur'
  }],
  sex: [{
    required: true,
    message: '请选择性别',
    trigger: 'change'
  }]
}
let data = () => {
 
  return {
    //页码
    page: 1,
    //每页数量
    size: 2,
    //总数
    total: 0,
    //查询条件
    filters: {},
    //页面数据
    rows: [],
    //页面载入状态
    pageLoading: false,
    //列表高度
    clientHeight: '100%',
    //对话框隐藏状态
    formVisible: false,
    //表单提交状态
    formLoading: false,
    //参数
    params:{},
    //表单数据
    form: {
        pass: "",
        checkPass: "",
        name: "",
        sex: "1"
    },
    //验证规则
    rules: rules

  }
}
//添加
let handleAdd = function() {
   this.$router.push({ path:'/main/add'  })
}
let handleSubmit= function() {
       if (this.formLoading)
    return

  this.$refs.form.validate(valid => {
    if (!valid)
      return

    this.formLoading = true

    //调用http协议
    this.$axios.post('/api/member/save', this.form).then(res => {
      this.formLoading = false
      if (!res.data.success) {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'error'
        });
        return
      }
      this.$message({
        type: 'success',
        message: '保存成功!'
      })

      //重新载入数据
      this.page = 1
      this.getRows()
      this.formVisible = false
    }).catch(e => this.formLoading = false)
  })  
      }
      let resetForm= function(formName) {
        this.$refs[formName].resetFields();
      }
let handleEdit = function(index, row) {
  this.form = Object.assign({}, row)
  this.formVisible = true
}

let handleDelete = function(index, row) {
  console.log(index, row);
}

let getRows = function() {
if (this.pageLoading)
    return
  this.pageLoading = true
//将提交的数据进行封装
 this.params = this.$qs.stringify({
  pageNum : this.page,
  pageSize : this.size,
  queryParameter:this.filters.query?this.filters.query:""
    });  
  //调用post请求
  let _this=this;
  this.$axios.post('/api/queryUserPage', this.params).then(res=>{
    _this.pageLoading = false
    if (!res.data || ! res.data.userPageData)
      return
    //总数赋值
    _this.total = res.data.userTotal;
   // _this.page++;
    //页面元素赋值
    _this.rows = res.data.userPageData;
  }).catch(e => _this.pageLoading = false)
}
let handleQuery = function() {
  this.page = 1
  this.getRows()
}
              //每页显示数据量变更
let  handleSizeChange=function(val) {
		  this.size = val
		  this.getRows()
		  }
		        
		      //页码变更
let handleCurrentChange=function(val) {
		          this.page = val
		          this.getRows()
		      }     



export default {
   data: data,
  methods: {
    
 	//查询
    handleQuery,
    //添加
    handleAdd,
    //修改
    handleEdit,
    //删除
    handleDelete,
    //显示数量变更
    handleSizeChange,
	//页数改变
    handleCurrentChange,
    //获取分页
    getRows,
    resetForm,
    handleSubmit   
  },
  mounted: function() {
    this.getRows()
  }
}
</script>

<style scoped>
</style>