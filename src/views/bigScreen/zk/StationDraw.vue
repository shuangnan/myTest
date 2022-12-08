<!-- 
 * @created：	2021年3月1日
 * @author：	ch
 * @version:	v1.0
 * @desc:		站场图
 -->
<template>
	<div class="lay">
		<div ref="scrollCon" class="main">
			<div ref="canvasCon" :style="{width:curMap.mapWidth+'px',height:curMap.mapHeight+'px'}">请选择站场图</div>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	import DT from "../../../assets/zrender/DrawTools.js";
	import C from "../../../assets/com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				// zrender对象
				zr: null,
				// 图层组
				groupDraw: null,
				// 当前站场图
				curMap: {
					zmlm: "ICW",
					mapWidth: 1900,
					mapHeight: 1080
				},
				pointsData: []
			}
		},
		// 属性
		props: {
			stnCode: String
		},
		// 组件挂载完毕
		mounted() {
			// this.curMap.zmlm = this.stnCode;
			// document.querySelector("title").innerHTML = "站场图工具";
			DT.dragScroll(this.$refs.scrollCon, this.$refs.canvasCon);
			// 初始化VUE
			DT.setVue(this);
			DT.initCanvas({
				el: this.$refs.canvasCon,
				done: () => {
					// this.getMapPoints();
					if (this.curMap.mapPic) {
					const obj = DT.getDrawImage({
						style: this.curMap.mapPic,
						typeText: "底图",
					}, true);
					this.groupDraw.add(obj);
				}
				},
				elClick: (obj) => {
					alert()
				}
			});
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			/* @info  数据处理区-----------------------------------*/
			drawAllEl(data) {
				// 绘制底图
				if (this.curMap.mapPic) {
					const obj = DT.getDrawImage({
						style: this.curMap.mapPic,
						typeText: "底图",
					}, true);
					this.groupDraw.add(obj);
				}
				// 绘制图层上的元素
				data.forEach(v => {
					v.type = v.TYPE;
					v.typeText = v.TEXT;
					v.zrdata = JSON.parse(v.CODE);
					let obj = null;
					switch (v.type) {
						case "line":
							obj = DT.getDrawLine({
								z:v.zrdata.z,
								shape: v.zrdata,
								lineWidth: v.zrdata.lineWidth,
								stroke: v.zrdata.stroke,
								typeText: v.typeText,
							});
							break;
						case "circle":
							obj = DT.getDrawCircle({
								z:v.zrdata.z,
								shape: v.zrdata,
								typeText: v.typeText,
								stroke: v.zrdata.stroke,
								fill: v.zrdata.fill,
							});
							break;
						case "image":
							obj = DT.getDrawImage({
								z:v.zrdata.z,
								style: v.zrdata,
								typeText: v.typeText,
							});
							break;
						case "text":
							obj = DT.getDrawText({
								z:v.zrdata.z,
								position: [v.zrdata.x, v.zrdata.y],
								typeText: v.typeText,
								text: v.zrdata.text,
								textFill: v.zrdata.textFill,
								fontSize: v.zrdata.fontSize,
								// textBorderRadius: v.zrdata.textBorderRadius,
								fontWeight: v.zrdata.fontWeight,
								// textBackgroundColor: v.zrdata.textBackgroundColor,
								// textPadding: v.zrdata.textPadding,
							});
							break;
						case "rect":
							obj = DT.getDrawRect({
								z:v.zrdata.z,
								shape: v.zrdata,
								typeText: v.typeText,
								fill: v.zrdata.fill,
								text: v.zrdata.text,
								textFill: v.zrdata.textFill,
								fontSize: v.zrdata.fontSize,
								fontWeight: v.zrdata.fontWeight,
								textPadding: v.zrdata.textPadding,
								drag: true,
							});
							break;
					}
					this.groupDraw.add(obj);
				});
			},
			/* @info  数据交互区-----------------------------------*/
			// 选择站场图
			getMapPoints() {
				C.getData({
					c: "trdm_lv_410",
					s: [this.curMap.zmlm],
					a: "获取图层所有元素数据"
				}, (r) => {
					const dicType = ["line", "circle", "rect", "text"];
					const data = r.filter((item) => {
						return dicType.indexOf(item.TYPE) > -1;
					});
					console.log(data);
					this.drawAllEl(data);
				});
			}
		},
		// 监视属性
		watch: {
			"stnCode"(v) {
				this.getMapPoints(v);
			}
		},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.lay {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 0px;
		/* background: #fafafa; */
	}

	.main {
		width: 100%;
		height: 100%;
		/* background: #fff; */
		overflow: auto;
		/* border: 1px solid #dddddd; */
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
