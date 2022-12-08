<!-- 
 * @created：	2021年11月9日
 * @author：	ch
 * @version:	v1.0
 * @desc:		列车上的所有电话列表
 -->
<template>
	<div class="list">
		<table class="list-per blue" cellpadding="0" cellspacing="0">
			<tbody v-if="data_sc.length>0">
				<tr v-for="per in data_sc">
					<td>
						<div>{{per.E_Name}}（{{per.KYD}}）</div>
						<label class="tel" title="应急呼叫" @click="openWin(per,'phone')">{{per.E_Phone}}</label>
						<div class="vidio" @click="openWin(per,'phone')" title="应急呼叫" >
							<img  :src="phoneImg"/>
						</div>
						<div class="vidio" @click="openWin(per,'xiaoyu')" title="音视频对讲" >
							<img  :src="callImg"/>
						</div>
						<div class="vidio" @click="openWin(per,'msg')" title="发送消息" >
							<img  :src="msgImg"/>
						</div>
					</td>
				</tr>
			</tbody>
			<tbody v-else>
				<tr><td>未查询到列车长信息</td></tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../../assets/com.js"
	// import InterFace from "../../service/index.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				phoneImg: require('./images/call.png'),
				callImg: require('./images/vidio.png'),
				msgImg: require('./images/sendMsg.png'), //发送消息
				data_sc: []
			}
		},
		// 属性
		props: {
			cc: String
		},
		// 组件挂载完毕
		mounted() {
			this.getData()
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			openWin(per,ty) {
				this.$emit("callPer", per,ty);
			},

			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			getData() {
				//	[车次（客运车次），开行日期/始发日期（2020-01-10）]
				var now = new Date();
				now = now.Format("yyyy-MM-dd");
				C.getData({
					c: "kydp_zxy8024",
					url: C.kydUrl,
					s: [this.cc, now],
					a: "【kydp_zxy8024】获取三乘信息"
				}, (r) => {
					if (r !== "null") {
						// 第一次取数据
						var real = [];
						C.$.each(r, function(i, v) {
							if (v.ZhiWei === "列车长") {
								real.push(v);
							}
						});
						this.data_sc = real;
					} else {

					}
				});

			}
		},
		// 监视属性
		watch: {
			"cc"() {
				this.getData()
			}
		},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.list {
		position: fixed;
		width: 230px;
		min-height: 100px;
		padding: 10px;
		border: 1px solid #E6E1DC;
		background: #192553;
		border-radius: 5px;
		box-shadow: 3px 5px 10px #878581;
		z-index: 9990;
		overflow: auto;
	}

	.list-per {
		list-style: none;
		font-size: 12px;
		width: 100%;
	}

	.list-per td {
		padding: 3px 0px 2px 0;
	}

	.list-per .tit {
		text-align: left;
		color: #B0B9BC;
	}

	.list-per .per {
		width: 100%;
	}

	.list-per .per>span {
		line-height: 20px;
	}

	.list-per .vidio{
		display: inline-block;
		vertical-align: middle;
		width: 30px;
		height: 30px;
		cursor: pointer;
		margin-right:10px;
	}
	.list-per .vidio>img{
		width: 30px;
		height: 30px;
	}
	
	.list-per .tel {
		text-decoration: underline;
		color: #00aaff;
		margin-right: 10px;
	}

	.list-per .tel:hover {
		text-decoration: underline;
		color: #45b8ff;
		cursor: pointer;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
