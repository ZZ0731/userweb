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
  <el-table :data="rows" style="width: 100%" stripe border v-loading="pageLoading">
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

</section>
</template>

<script>

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
    
   

  }
}
//添加
let handleAdd = function() {
   this.$router.push({ path:'/main/add'  })
}
//修改
let handleEdit = function(index, row) {
  this.$router.push({ 
    path:'/main/update',
    name:'update',
    params:{
        name:row.name,
        code:row.code,
        password:row.password,
        age:row.age,
        sex:row.sex,
        password:row.password,
        address:row.address,
        id:row.id

  }  })
}

//删除用户
  let handleDelete = function(index, row) {
    if (this.pageLoading)
    return
    if(row.id==sessionStorage.getItem("userId")){
        this.$message({
        type: 'error',
        message: '此用户为登录用户不能删除!'
      })
      return
    }
  this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    this.pageLoading = true
    this.$axios.get('/api/user/delete?id=' + row.id).then(res => {
      this.pageLoading = false
      if ('500'==res.data.msgCode) {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
        return
      }else if('200'==res.data.msgCode){
          this.$message({
          type: 'success',
          message: '删除成功!'
      })
      }
      this.page = 1
      this.getRows()
    }).catch(e => this.pageLoading = false)
  }).catch(e => {})
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
  this.$axios.post('/api/user/queryUserPage', this.params).then(res=>{
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
    getRows  
       
  },
  mounted: function() {
    this.getRows()
  }
}
</script>