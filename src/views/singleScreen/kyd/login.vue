<template>
	<div class="content">
		<section class="loginBox">
			<p class="login-links"></p>
			<article class="loginBox_ctn">
				<h3 class="white">客运段指挥中心管控平台</h3>
				<div class="loginInpts autohei">
					<el-form ref="form" @submit.native.prevent id="loginForm" novalidate="novalidate">
						<input id="redirectUrl" type="hidden" name="redirectURL" value="">
						<input type="hidden" value="0" name="hiImage" id="hiImage">
						<input type="hidden" value="ARSG9BAZ" name="pCode" id="pCode">
						<div class="loginInpt fl">
							<div class="inpt inpt02">
								<input name="loginName" id="loginName" type="text" tabindex="1" maxlength="11" placeholder="帐号" autocomplete="off">
								<div class="tips05" style="display: none;">请输入11位手机号码</div>
							</div>
							<div class="tip-login-error">
								<div class="errorMsg"></div>
							</div>
						</div>
						<div class="loginInpt fl">
							<div class="inpt inpt02">
								<input name="password" maxlength="16" type="password" id="password" tabindex="2" placeholder="密码" autocomplete="off">
								<div class="tips05" style="display: none;">6-16位字母、数字或标点，分大小写</div>
							</div>
							<div class="tip-login-error">
								<div class="errorMsg"></div>
							</div>
						</div>
						<div class="loginBtn fl">
							<a @click="clickSubmit" name="loginbtn" id="loginbtn" tabindex="4" class="btn btn01">登录</a>
						</div>
						<div class="login_ch fr">
							<div class="login_r login_r_n remember" num="0">
								<input type="checkbox" id="keepName" name="keepName" value="0">
							</div>
							<span><label for="keepName">记住账号</label></span>
						</div>
					</el-form>
				</div>
			</article>
		</section>
	</div>
</template>

<script>
	import config from "../../assets/config.js"
	import COM from "../../../assets/com.js"
	import CryptoJS from 'crypto-js'
	var clickSubmitButton = true
	export default {
		data() {
			return {
				pCode: config.key,
			}
		},
		created() {
			// var user = this.$Cookie.get('LOGIN_USER', {
			// 	path: '/'
			// })
			// try {
			// 	user = user == null ? {} : JSON.parse(user);
			// } catch (e) {
			// 	user = {};
			// }
			// var cur = user['token'];
			// if (typeof(cur) != "undefined") {
			// 	window.top.location.href = location.origin + '/#/home'
			// }
		},
		mounted() {
			$(".loginInpts").on("focus", ".loginInpt .inpt02 input", function() {
				$(this).parents(".inpt02").find(".tips05").fadeIn();
			}).on("blur", ".loginInpt .inpt02 input", function() {
				$(this).parents(".inpt02").find(".tips05").fadeOut();
			});
			// remember name
			jQuery(".login_r").click(function() {
				var pNum = parseInt(jQuery(this).attr("num"));
				if (pNum == 1) {
					jQuery(this).attr("num", 0);
					jQuery(this).addClass("login_r_n");
				} else {
					jQuery(this).attr("num", 1);
					jQuery(this).removeClass("login_r_n");
				}
			});

			this.recoverName();
			// this.init();
		},
		methods: {
			clickSubmit() {
				console.log("do login")
				if (this.checkPhone() && this.checkPassword()) {
					if (clickSubmitButton) {
						this.doLogin()
					}

				}
			},
			checkPhone() {
				var phone = $("input[name='loginName']").val();
				//手机
				var tempvalue = $.trim(phone);
				var length = tempvalue.length;
				//    var mobile = /^[1][3-8]\d{9}$/;
				var mobile = /^(((13[0-9]{1})|(14[5,7]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[9]))\d{8})$/;
				var mobile2 = /^[１][３,４,５,６,７,８][０,１,２,３,４,５,６,７,８,９]{9}$/;
				var errorMsg = $("input[name='loginName']").parent("div").next("div").children("div.errorMsg");
				if (length != 11 || (!mobile.test(tempvalue) && !mobile2.test(tempvalue))) {
					errorMsg.html("请输入正确的手机号！");
					$("input[name='loginName']").val("");
					$("input[name='loginName']").focus();
					clickSubmitButton = true;
					return false;
				}
				errorMsg.empty().html("");
				return true;
			},
			checkPassword() {
				var password = $("input[name='password']").val();
				var tempvalue = $.trim(password);
				var length = tempvalue.length;
				var passwordExl = /^[A-Za-z0-9-_\~!:;|,·`@#\$\^&\*\.\(\)\[\]\{\}<>\\\/\'\"]{6,16}$/;
				var errorMsg = $("input[name='password']").parent("div").next("div").children("div.errorMsg");
				if (length < 6) {
					errorMsg.empty().html("密码长度不能少于6");
					$("input[name='password']").val("");
					$("input[name='password']").focus();
					clickSubmitButton = true;
					return false;
				}
				if (!(passwordExl.test(tempvalue))) {
					$("input[name='password']").parent("div").next("div").children("div.errorMsg").html("密码不能包括%号，由数字、字母、符号组成");
					$("input[name='password']").val("");
					$("input[name='password']").focus();
					clickSubmitButton = true;
					return false;
				}
				return true;
			},
			changeImg() {
				var myiframe = document.getElementById("changeImgCode");
				myiframe.src = myiframe.src + Math.random(1000);
				$("input[name='imgCode']").focus().val('');
			},
			encrypt(message, pCode) {
				var keyHex = CryptoJS.enc.Utf8.parse(pCode);
				var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
					mode: CryptoJS.mode.ECB,
					padding: CryptoJS.pad.Pkcs7
				});
				return encrypted.toString();
			},


			doLogin() {
				let t = this
				clickSubmitButton = false;
				var checkNum = parseInt(jQuery('#keepName').parent().attr('num'));
				t.keepName((checkNum == 1 ? true : false));

				var param = {};
				param.code = $("#loginName").val();
				param.pwd = t.encrypt($("#password").val(), t.pCode);
				// param.sign = t.$md5(param.code + param.pwd + t.pCode)
				$(".loginInpts .errorMsg").empty().html("");
				$('#loginbtn').html("登录中...");
				
				setTimeout(()=>{
					t.$Cookie.set('LOGIN_USER', JSON.stringify({uName:'大飞',token:new Date().getTime()}))
					window.top.location.href = location.origin + location.pathname + '#/index'
				},1000)
			},

			//load name
			recoverName() {
				var loginUser = this.$Cookie.get('LOGINNAME_ECSS', {
					path: '/'
				});
				try {
					loginUser = loginUser == null ? {} : JSON.parse(loginUser);
				} catch (e) {
					loginUser = {};
				}
				var cur = loginUser['flag'];
				if (typeof(cur) != "undefined") {
					jQuery('#loginName').val(decodeURIComponent(loginUser['loginName']));
					jQuery('#password').focus();
					this.setKeepNameCheckClass(true);
				}
			},

			//remember class
			setKeepNameCheckClass(chk) {
				var chkDiv = jQuery('.remember');
				if (!chk) {
					chkDiv.attr("num", 0);
					chkDiv.addClass("login_r_n");
				} else {
					chkDiv.attr("num", 1);
					chkDiv.removeClass("login_r_n");
				}
			},

			//remember name
			keepName(isKeep) {
				if (isKeep) {
					var loginUser = {};
					loginUser['flag'] = 0;

					loginUser['loginName'] = encodeURIComponent($("#loginName")
						.val());
					this.$Cookie.set('LOGINNAME_ECSS', JSON.stringify(loginUser), {
						expires: 30,
						path: '/'
					});
				} else {
					this.$Cookie.set('LOGINNAME_ECSS', '{}', {
						path: '/'
					});
				}
			}
		}
	}
</script>

<style scoped>
	.content {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: url('../../images/loginBg.jpg') no-repeat;
	}

	@import url("../../common/login.css");
	@import url("../../common/common.css");
</style>
