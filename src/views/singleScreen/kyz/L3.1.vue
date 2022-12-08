<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		设备管控
 -->
<template>
	<div ref="con" style="width: 100%;height: calc(100% - 30px);padding: 10px;color: #aec0f2;font-weight: bold;">
		<div style="font-size: 14px;text-align: center;padding-top: 10px;">
			<span>设备总量</span>
			<span style="font-size: 30px;color: #f2c7aa;padding-left: 20px;padding-right: 10px;">122</span>
			<span style="font-size: 20px;">个</span>
		</div>
		<div style="font-size: 14px;padding: 10px 20px;">
			<span>未修复</span><span style="float: right;">正常设备</span>
		</div>
		<div style="width: 100%;padding:5px 10px;border: 1px solid #2F3259;border-radius: 6px;">
			<div style="height: 10px;background: #156BF6;">
				<div style="background: #A5480A;height: 100%;width: 30%;border-right: 2px solid #070D26;"></div>
			</div>
			<div style="width: 100%;height: 4px;background: #60667A;margin-top:3px;"></div>
			<div class="percent">
				<template v-for="item in rows">
					<div :style="{width:(item.t/total)*100+'%'}">
						<span></span>
						<img :src="icons[item.k+'0']" />
					</div>
				</template>
			</div>
		</div>
		<el-carousel indicator-position="bottom" direction="horizontal" :height="carouselHeight" :autoplay="true" :interval="3000"
		 arrow="never">
			<el-carousel-item>
				<div class="list">
					<template v-for="item in rows1">
						<div class="list-item">
							<img :src="icons[item.k]" />
							<div class="info">
								<div>{{icons[item.k+'_n']}}:{{item.t}}个&nbsp;{{item.p1}}%</div>
								<div class="ps one">
									<div :style="{width:item.p1+'%'}"></div>
								</div>
								<div class="ps two">
									<div :style="{width:item.p2+'%'}"></div>
								</div>
							</div>
						</div>
					</template>
				</div>
			</el-carousel-item>
			<el-carousel-item>
				<div class="list">
					<template v-for="item in rows2">
						<div class="list-item">
							<img :src="icons[item.k]"/>
							<div class="info">
								<div>{{icons[item.k+'_n']}}:{{item.t}}个&nbsp;{{item.p1}}%</div>
								<div class="ps one">
									<div :style="{width:item.p1+'%'}"></div>
								</div>
								<div class="ps two">
									<div :style="{width:item.p2+'%'}"></div>
								</div>
							</div>
						</div>
					</template>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	// 这里引用各种资源
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				icons: {
					anjian_n: "安检系统",
					baojie_n: "保洁系统",
					dianti_n: "电梯系统",
					xingbao_n: "行包系统",
					jidian_n: "机电系统",
					kepiao_n: "客票系统",
					nvfu_n: "旅服系统",
					luantong_n: "暖通系统",
					qita_n: "其它设备",
					shangshui_n: "上水系统",
					xiwu_n: "吸污设备",
					xunshi_n: "巡视系统",
					zhantai_n: "站台系统",
					// 小图标
					anjian0: require("./img/icon_anjian0.png"), //安检系统
					baojie0: require("./img/icon_baojie0.png"), //保洁系统
					dianti0: require("./img/icon_dianti0.png"), //电梯系统
					xingbao0: require("./img/icon_xingbao0.png"), //行包系统
					jidian0: require("./img/icon_jidian0.png"), //机电系统
					kepiao0: require("./img/icon_kepiao0.png"), //客票系统
					nvfu0: require("./img/icon_nvfu0.png"), //旅服系统
					luantong0: require("./img/icon_luantong0.png"), //暖通系统
					qita0: require("./img/icon_qita0.png"), //其它设备
					shangshui0: require("./img/icon_shangshui0.png"), //上水系统
					xiwu0: require("./img/icon_xiwu0.png"), //吸污设备
					xunshi0: require("./img/icon_xunshi0.png"), //巡视系统
					zhantai0: require("./img/icon_zhantai0.png"), //站台系统
					// 大图标
					anjian: require("./img/icon_anjian.png"), //安检系统
					baojie: require("./img/icon_baojie.png"), //保洁系统
					dianti: require("./img/icon_dianti.png"), //电梯系统
					xingbao: require("./img/icon_xingbao.png"), //行包系统
					jidian: require("./img/icon_jidian.png"), //机电系统
					kepiao: require("./img/icon_kepiao.png"), //客票系统
					nvfu: require("./img/icon_nvfu.png"), //旅服系统
					luantong: require("./img/icon_luantong.png"), //暖通系统
					qita: require("./img/icon_qita.png"), //其它设备
					shangshui: require("./img/icon_shangshui.png"), //上水系统
					xiwu: require("./img/icon_xiwu.png"), //吸污设备
					xunshi: require("./img/icon_xunshi.png"), //巡视系统
					zhantai: require("./img/icon_zhantai.png"), //站台系统
				},
				carouselHeight:"200px",
				total: 100,
				rows: [],
				rows1: [],
				rows2: []
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			//document.querySelector("title").innerHTML = "";//页面名称
			const h = this.$refs.con.offsetHeight - 150;
			this.carouselHeight = h + "px";
			const data = [{
				k: "anjian",
				n1: 5,
				n2: 10
			}, {
				k: "baojie",
				n1: 6,
				n2: 18
			}, {
				k: "dianti",
				n1: 3,
				n2: 12
			}, {
				k: "xingbao",
				n1: 6,
				n2: 15
			}, {
				k: "jidian",
				n1: 2,
				n2: 10
			}, {
				k: "kepiao",
				n1: 1,
				n2: 7
			}, {
				k: "nvfu",
				n1: 5,
				n2: 20
			}, {
				k: "luantong",
				n1: 2,
				n2: 10
			}, {
				k: "qita",
				n1: 5,
				n2: 10
			}, {
				k: "shangshui",
				n1: 8,
				n2: 13
			}, {
				k: "xiwu",
				n1: 9,
				n2: 16
			}, {
				k: "xunshi",
				n1: 4,
				n2: 12
			}, {
				k: "zhantai",
				n1: 7,
				n2: 11
			}];
			let total = 0;
			data.forEach(item => {
				item.t = item.n1 + item.n2;
				total += item.t;
				item.p1 = parseInt((item.n1 / item.t) * 100);
				item.p2 = parseInt((item.n2 / item.t) * 100);
			});
			this.total = total;
			this.rows = data;
			this.rows1 = data.slice(0, 8);
			this.rows2 = data.slice(8);

		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			// 获取数据
			getData() {

			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.percent {
		display: flex;
		justify-content: space-between;
	}

	.percent>div {
		display: inline-block;
		text-align: center;
	}

	.percent>div>span {
		display: inline-block;
		width: 100%;
		height: 10px;
		background: #0C2E6F;
		border-right: 2px solid #070D27;
	}

	.percent>div:last-child>span {
		border-right: none;
	}

	.list {
		width: 100%;
		font-size: 12px;
	}

	.list-item {
		display: inline-block;
		vertical-align: middle;
		width: 50%;
		padding-top: 15px;
	}

	.list-item>img,
	.list-item>.info {
		display: inline-block;
		vertical-align: top;
	}

	.list-item>.info {
		padding-left: 10px;
	}

	.list-item>.info>.ps {
		width: 100%;
		height: 3px;
	}

	.list-item>.info>.ps.one {
		background: #082B7B;
	}

	.list-item>.info>.ps.one>div {
		height: 100%;
		background: #0E4CD9;
	}

	.list-item>.info>.ps.two {
		background: #2A1F2B;
	}

	.list-item>.info>.ps.two>div {
		height: 100%;
		background: #AF4D0B;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
