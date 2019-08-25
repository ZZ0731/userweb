<template>
<section>
    
 <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"   class="demo-ruleForm" >
    <el-form-item label="账号" prop="code">
    <el-input v-model="ruleForm.code" />
  </el-form-item>
   <el-form-item label="姓名" prop="name">
    <el-input v-model="ruleForm.name" />
  </el-form-item>
  <el-form-item label="地址" prop="address">
    <el-input v-model="ruleForm.address" />
  </el-form-item>
  <el-form-item label="密码"  prop="pass" center="true">
    <el-input type="password"  v-model="ruleForm.pass" ></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass" center="true">
    <el-input type="password"   v-model="ruleForm.checkPass" ></el-input>
  </el-form-item>
  <el-form-item label="年龄" prop="age">
    <el-input v-model.number="ruleForm.age"></el-input>
  </el-form-item>
  <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
  <el-form-item>
     <el-button @click="cancel">取消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>

</section>
</template>
<script>
         
 export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {       
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        path:"",
        params:{},
        ruleForm: {
          code:'',
          name:'',
          address:'',
          pass: '',
          checkPass: '',
          age: '',
          sex:'',
          id:''
        },
        rules: {
           address: [{
                required: true,
                message: '请输入地址!',
                trigger: 'blur'
                   }],
          name: [{
                required: true,
                message: '请输入姓名!',
                trigger: 'blur'
                   }],
          code: [{
                required: true,
                message: '请输入账号!',
                trigger: 'blur'
                   }],
          pass: [
              { min: 6, max: 12, message: '长度在6到12位字符', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
             { min: 6, max: 12, message: '长度在6到12位字符', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ],
           sex: [{
                required: true,
                message: '请选择性别!',
                trigger: 'blur'
                   }]
        }
      };
    },
    methods: {
          
      submitForm(formName) {       
        this.$refs[formName].validate(valid => {
          if (!valid)
          return
          //调用http协议
          //将提交的数据进行封装
          this.params = this.$qs.stringify({
            code: this.ruleForm.code,
            name: this.ruleForm.name,
            address: this.ruleForm.address,
            pass:  this.ruleForm.pass,        
            age: this.ruleForm.age,
            sex:this.ruleForm.sex==='1' ?'男' :'女',
            creator:sessionStorage.getItem("access-token"),
            id:this.ruleForm.id           
            }); 
            let _this=this;
            var url="/api/add";
            if('/main/update'==this.$route.path){
                url='/api/update'
            }
            this.$axios.post(url, this.params).then(res => {    
            if ('500'==res.data.msgCode) {
            this.$message({
                  showClose: true,
                  message: '保存失败！',
                  type: 'error'
                });
        return
      }else{
        this.$message({
        type: 'success',
        message: '保存成功!'
      })
       this.$router.push({ path:'/main/data'  })
      }           
      }).catch(e => this.$message({
                  showClose: true,
                  message: '保存失败！',
                  type: 'error'
                }))
    })  
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      cancel(){
       this.$router.push({ path:'/main/data'  })
      }
    },
    mounted: function() {
  var path= this.$route.path;
    if('/main/update'==path){
     var json= this.$route.params
     this.ruleForm.code=this.$route.params.code;
     this.ruleForm.name=this.$route.params.name;
     this.ruleForm.age=Number(this.$route.params.age);
     this.ruleForm.address=this.$route.params.address;
     this.ruleForm.pass=this.$route.params.password;
     this.ruleForm.checkPass=this.$route.params.password;
     this.ruleForm.id=this.$route.params.id;
      if('男'==this.$route.params.sex){
        this.ruleForm.sex=1
      }else{
        this.ruleForm.sex=2
      }
        }
  }
 }
</script>

