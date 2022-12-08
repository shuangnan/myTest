<template>
	<div style="width: 100%;height:100%;overflow: hidden;padding:0;margin:0;">
		<el-container style="height:100%;">
			<el-header style="height:60px;padding:0;display: flex;flex-direction: row;">
				<div class="logo">
					<el-image :src="logo"></el-image>
					<label>客运段指挥中心管控平台</label>
				</div>

				<el-menu :default-active="pid" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#2e3d67"
				 text-color="#fff" active-text-color="#ffd04b" style="width: 100%;flex:1;">

					<template v-for="(item,idx) in datasource">

						<template v-if="typeof(item.children)!='undefined'">
							<el-submenu :index="(idx+1)+''">
								<template slot="title">{{item.fName}}</template>
								<el-menu-item :index="idx+'-'+i" v-for="(c,i) in item.children">{{c.fName}}</el-menu-item>
							</el-submenu>
						</template>
						<el-menu-item v-else :index="idx+''" :class="item.comm1">{{item.fName}}</el-menu-item>
					</template>
					<el-submenu index="9" style="float:right;">
						<template slot="title"><span class="login-state"><label>欢迎回来,{{userName}}</label><label>{{curTime}}</label></span></template>
						<el-menu-item @click="logout">注销</el-menu-item>
						<!-- <el-menu-item index="4-2">设置</el-menu-item>
						<el-menu-item index="4-3">个人信息</el-menu-item> -->
					</el-submenu>
				</el-menu>

			</el-header>
			<el-main style="height:calc(100vh - 60px);overflow: hidden;padding:0;">
				<el-col :span="24" style="height: 100%;">
					<div style="margin-top:0px;height: 100%;">
						<router-view :link="link"></router-view>
					</div>
				</el-col>
			</el-main>
		</el-container>
	</div>
</template>
<script>
	import Cookie from 'js-cookie'
	import menu from './menu.js'
	export default {
		data() {
			return {
				userName: "",
				curTime: echarts.format.formatTime('yyyy/MM/dd hh:mm', new Date().getTime()),
				pid: "0",
				logo: require('./components/images/logo.png'),
				link: '',
				opts: {
					p: "",
					s: ""
				},
				select: [{
					label: '车次',
					value: 0
				}],
				datasource: null,
			}
		},
		created() {
			
			//获取用户权限
			let t = this
			t.datasource = menu.data
			var user = Cookie.get('LOGIN_USER', {
				path: '/'
			})
			try {
				user = user == null ? {} : JSON.parse(user);
			} catch (e) {
				user = {};
			}
			var cur = user['token'];
			if (typeof(cur) == "undefined") {
				window.top.location.href = location.origin + location.pathname + '#/login'
			} else {
				// var func = user.func
				var _r = t.$route.path
				t.userName = user.uName
				// t.datasource = func
				try {
					if (_r.indexOf("index") > -1) {
						t.$router.push(t.datasource[t.pid].fUrl);
					} else {
						t.datasource.forEach((item, i) => {
							if (item.children) {
								item.children.forEach((c, idx) => {
									if (_r.indexOf(c.fUrl) > -1 && c.fUrl != '') {
										t.pid = i + '-' + idx
										throw new ''
									}
								})
							}
							if (_r.indexOf(item.fUrl) > -1) {
								t.pid = (i) + ''
								throw new ''
							}
						})
					}
				} catch (e) {}
			}

		},
		methods: {
			handleSelect(index) {
				if (index && this.index != index) {
					var hasChildren = false,
						pid = null,
						idx = null
					if (index.indexOf('-') > -1) {
						hasChildren = true
						pid = index.split('-')[0]
						idx = index.split('-')[1]
					} else {
						pid = index
						idx = null
					}
					this.pid = index
					var link = null,
						url = null
					if (hasChildren) {
						link = this.datasource[pid].children[idx].link
						url = this.datasource[pid].children[idx].fUrl
						if (typeof(link) != 'undefined') {
							this.link = link
						}
					} else {
						link = this.datasource[pid].link
						url = this.datasource[pid].fUrl
						if (typeof(link) != 'undefined') {
							this.link = link
						}
					}
					this.$router.push({
						path: url,
						query: {
							link: link
						}
					})
				}
			},
			returnIdx(idx) {
				return idx + ''
			},
			logout() {
				Cookie.set('LOGIN_USER', {})
				window.top.location.href = location.origin + location.pathname + '#/login'
			}
		}
	}
</script>

<style scoped="scoped">
	.el-menu.el-menu--horizontal {
		border: 0;
	}

	.logo {
		display: flex;
		justify-content: space-around;
		flex-direction: row;
		align-items: center;
		width: 280px;
		font-size: 20px;
		color: #f0f0f0;
		background: #2d47b1;
	}

	.login-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 30px;
	}

	>>>.el-menu--horizontal>.el-submenu .el-submenu__title {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
