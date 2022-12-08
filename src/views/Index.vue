<template>
	<el-container style="width:100%;height:100%;">
		<el-header style="height:40px;padding:0;border-botom:1px solid #ddd;background:#B3C0D1;">
			<h1 style="text-align:center;font-size:20px;padding:5px;margin:0;">欢迎使用 客运管理系统 MAP版本</h1>
		</el-header>
		<el-main style="background:#e9eef3;padding:10px;">
			<div>
				<el-switch v-model="isSsoa" active-text="SSOA模式" inactive-text="普通模式"></el-switch>
			</div>
			<div v-for="item in links">
				<h2 style="padding:5px;margin: 10px 0 0;">{{item.text}}</h2>
				<template v-for="link in item.children">
					<el-button type="primary" size="mini" @click="openPage(link)" style="margin: 5px;">{{link.text}}</el-button>
				</template>
			</div>
			<!-- <div v-show="isSsoa===false" v-for="item in links">
				<h2 style="padding:5px;margin: 10px 0 0;">{{item.text}}</h2>
				<template v-for="link in item.children" >
					<router-link :to="link.path" target="_blank" style="display: inline-block;margin: 5px;">
						<el-button type="primary" size="mini">{{link.text}}</el-button>
					</router-link>
				</template>
			</div> -->
		</el-main>
	</el-container>
</template>

<script>
	import C from "../assets/com.js"
	import menu from '../router/index.js'
	export default {
		data() {
			return {
				isSsoa: false,
				links: []
			};
		},
		components: {},
		mounted() {
			const realLinks = [];
			let tempJson = {};
			let tempIndex = 0;
			menu.options.routes.forEach(item => {
				if (item.meta.isMenu) {
					const newItem = {
						text: item.t,
						path: "#" + item.path + "?" + item.meta.params,
						ssoaPath: "#" + item.path + "?SSOA=",
						params: item.meta.params
					};
					// 其它项目页面
					if(item.name==="otherWeb"){
						newItem.path = item.path + "?" + item.meta.params;
						newItem.ssoaPath =  item.path + "?SSOA=";
					}
					if (typeof(tempJson[item.g]) === "undefined") {
						realLinks.push({
							text: item.g,
							children: [newItem]
						});
						tempJson[item.g] = tempIndex++;
					} else {
						realLinks[tempJson[item.g]].children.push(newItem);
					}
				}
			});
			this.links = realLinks;
		},
		methods: {
			openPage(page) {
				if (this.isSsoa) {
					const order = this.getParamsObj(page.params);
					order.self = "自定义参数";
					// window.open("#" + page.oldPath + "?SSOA=123");
					C.getData({
						c: "kydp_zxy8022",
						a: "OA加密",
						s: ["0000000000"],
						w: ["0000000000"],
						url:"https://10.192.34.79/ky203/GeneralProServlet",
						o: [order],
						async: false,
						a: "获取SSOA"
					}, (rs) => {
						const data = JSON.parse(rs.data);
						window.open(page.ssoaPath + data.ssoa);
					});
				} else {
					window.open(page.path);
				}
			},
			getParamsObj(p) {
				const rs = {};
				const pa = p.split("&");
				pa.forEach(item => {
					const kv = item.split("=");
					rs[kv[0]] = kv[1];
				});
				return rs;
			}
		}
	};
</script>
<style scoped="scoped">

</style>
