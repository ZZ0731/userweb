
<template>
    <!--<div id="login">
        
        <h1> {{msg}}</h1>
    </div>-->
    <el-form ref='AccountFrom' :model='account' :rules='rules' lable-position='left' lable-width='0px' class='demo-ruleForm login-container'>
        <h3 class="title">登录系统</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
            <el-input type="password" v-model="account.pwd"   @keyup.enter.native='handleLogin' auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
         
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent='handleLogin' :loading= 'logining'>登录</el-button>
        </el-form-item>

    </el-form>

</template>

<script>
   
    export default {
       
        data() {
            return {
                logining: false,
                account: {
                    username: '',
                    pwd: ''
                },
                rules: {
                    username: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],
                    pwd: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }]
                },
                
            }
        },
        methods:{
            handleLogin(){
                this.$refs.AccountFrom.validate((valid)=>{
                    
                    if(valid){
                        //验证通过 可以提交
                        this.logining = true;
                        //将提交的数据进行封装
                        let postData = this.$qs.stringify({
                             cUsername : this.account.username,
                             cPwd:this.account.pwd
                            });
                        
                        
                        //调用函数  传递参数 获取结果
                        this.$axios.post('/api/user/login',postData).then(data=>{
                            
                            this.logining = false;
                            
                            if(data.data.code == '200'){
                                //登录成功
                                sessionStorage.setItem('access-token',data.data.token);
                                sessionStorage.setItem('userId',data.data.userid);
                                //用vue路由跳转到后台主界面
                                this.$router.push({path:'/main'});
                            }else{
                                this.$message({
                                    message:data.data.msg,
                                    type:'error'
                                });
                            }
                        })
                      
                    }else{
                        console.log('error submit');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    body {
        background: #DFE9FB;
        
    }
    
    .login-container {
        width: 350px;
        margin-left: 40%;
        margin-top: 10%;
    }
</style>