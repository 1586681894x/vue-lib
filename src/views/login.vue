<template>
    <div class="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login_form" action="#">
            <div class="login_form_box">
                <h3 class="title fl-center"><img src="../assets/logo/logo.png"/>{{title}}</h3>
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            v-model="loginForm.password"
                            :type="['password','text'][iconEye]"
                            auto-complete="off"
                            placeholder="密码"
                            @keyup.enter.native="handleLogin"
                    >
                        <template slot="suffix">
                            <i :class="`iconfont ${['iconbukejian','iconkejian'][iconEye]}`" style="font-size:1.2rem;" @click="handleEye"/>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code" v-show="loginForm.uuid">
                    <el-input
                            v-model="loginForm.code"
                            auto-complete="off"
                            placeholder="验证码"
                            @keyup.enter.native="handleLogin"
                    >
                    </el-input>
                    <div class="login_code" @click="getCode">
                        <img :src="codeUrl" class="login-code-img"/>
                    </div>
                </el-form-item>
                <el-checkbox v-model="loginForm.rememberMe" class="check_box">记住密码</el-checkbox>
            </div>
            <el-form-item class="buttons">
                <el-button
                        :loading="loading"
                        size="medium"
                        type="primary"
                        style="width:100%;"
                        @click.native.prevent="handleLogin"
                >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>Copyright © 2020-2025 rblianyin All Rights Reserved.</span>
        </div>
    </div>
</template>

<script>
    import Cookies from "js-cookie";
    import { encrypt, decrypt } from '@/utils/jsencrypt'

    export default {
        name: "Login",
        data() {
            return {
                title:process.env.VUE_APP_TITLE,
                iconEye:0,
                codeUrl: "",
                cookiePassword: "",
                loginForm: {
                    username: "",
                    password: "",
                    rememberMe: false,
                    code: "1234",
                    uuid: ""
                },
                loginRules: {
                    username: [
                        { required: true, trigger: "blur", message: "用户名不能为空" }
                    ],
                    password: [
                        { required: true, trigger: "blur", message: "密码不能为空" }
                    ],
                    code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
                },
                loading: false,
                redirect: undefined
            };
        },
        watch: {
            $route: {
                handler: function(route) {
                    this.redirect = route.query && route.query.redirect;
                },
                immediate: true
            }
        },
        created() {window.ss = this;
            //this.getCode();
            this.getCookie();
        },
        methods: {
            getCode() {
                this.loginForm.code = '';
                this.api('config.code','',{
                    onComplete:res => {
                        this.codeUrl = `data:imge/png;base64,${res.data}`;
                    }
                })
            },
            getCookie() {
                const username = Cookies.get("username");
                const password = Cookies.get("password");
                const rememberMe = Cookies.get('rememberMe')
                _.extend(this.loginForm,{
                    username,
                    password: password ? decrypt(password) : '',
                    rememberMe
                })
            },
            handleEye(){
                this.iconEye = this.iconEye>0 ? '0' : '1';
            },
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        if (this.loginForm.rememberMe) {
                            Cookies.set("username", this.loginForm.username, { expires: 30 });
                            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
                            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
                        } else {
                            Cookies.remove("username");
                            Cookies.remove("password");
                            Cookies.remove('rememberMe');
                        }
                        this.$store
                            .dispatch("Login", this.loginForm)
                            .then((url) => {
                                this.loading = false;
                                this.$router.push({ path: url || this.redirect || "/" });
                            })
                            .catch((e) => {
                                this.loginForm.uuid = '1';
                                this.loading = false;
                                this.getCode();
                            });
                    }
                });
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .login{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-image: url("../assets/image/login_back.gif");
        background-size: cover;
        background-position: center;
        font-family: Source Han Sans SC;
    }

    .login_form{
        width:20rem;
        letter-spacing: .1rem;
        position:relative;

        .login_form_box{
            background: #124773;
            opacity: 0.8;
            padding: 1rem 1.5rem;
            border-radius: .6rem;
            box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.35);
            padding-bottom:6rem;
        }

        .title{
            margin-bottom:2rem;
            font-size: 1rem;
            font-weight: 400;
            color: #ffffff;
            text-align:center;

            img{
                height:1.4rem;
                margin-right:.6rem;
            }
        }
        .buttons{
            width:100%;
            margin-top:2.4rem;
            padding:0 1rem;
            position: absolute;
            bottom:0;
        }
        .icon_eye{
            cursor: pointer;
            &:hover{
                color:#666;
            }
        }
        .el-button--primary{
            background-color: #197AFF;
            border-color: #197AFF;
        }
        .el-form-item__content{
            margin-bottom:.5rem;
        }
        .el-input__inner{
            border-width: 0;
            border-bottom-width: 1px;
            border-radius: 0;
            padding:0;
            color:#ffffff;
            background-color:rgba(0,0,0,0);
        }
        .el-input__inner:focus{
            color:#B3DEFF;
            border-color:#B3DEFF;
        }
        .check_box .el-checkbox__label{
            font-size:.84rem;
            font-weight: 400;
            color:#ffffff;
        }
    }

    .login_code {
        width: 33%;
        height: 2rem;
        position: absolute;
        top: -6px;
        right: 0;
        text-align: right;

        img {
            height:100%;
            cursor: pointer;
            vertical-align: middle;
        }
    }

    .el-login-footer {
        height: 40px;
        line-height: 40px;
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        font-family: Arial;
        font-size: 12px;
        letter-spacing: 1px;
    }
</style>
