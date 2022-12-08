<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		旅客发送分析
 -->
<template>
	<div ref="con" class="temp">
		<!-- <div class="shadow-txt srtitle">旅客发送分析</div> -->
		<el-carousel indicator-position="none" :interval="5000" :height="carouselHeight" arrow="hover" trigger="click">
			<el-carousel-item>
				<CL3Chart :data-source="data1" :station-name="snames[0]"> </CL3Chart>
			</el-carousel-item>
			<el-carousel-item>
				<CL3Chart :data-source="data2" :station-name="snames[1]"> </CL3Chart>
			</el-carousel-item>
			<!-- <el-carousel-item>
				<CL3Chart :data-source="data3" :station-name="snames[2]"> </CL3Chart>
			</el-carousel-item> -->
			<el-carousel-item>
				<CL3Chart :data-source="data4" :station-name="snames[3]"> </CL3Chart>
			</el-carousel-item>
			<el-carousel-item>
				<CL3Chart :data-source="data5" :station-name="snames[4]"> </CL3Chart>
			</el-carousel-item>
			<el-carousel-item>
				<CL3Chart :data-source="data6" :station-name="snames[5]"> </CL3Chart>
			</el-carousel-item>
			<!-- <el-carousel-item>
				<CL3Chart :data-source="data7" :station-name="snames[6]"> </CL3Chart>
			</el-carousel-item> -->
		</el-carousel>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../assets/com.js";
	import CL3Chart from "./CL3Chart.vue";
	export default {
		// 组件
		components: {
			CL3Chart
		},
		// 数据仓库
		data() {
			return {
				urlP: this.$store.state.params,
				carouselHeight: "300px",
				snames: ["遵义", "遵义南", "息烽", "桐梓北", "桐梓东", "娄山关南", "修文县"],
				stns:["ZYE", "ZNE", "XFW", "TBE", "TDE", "LSE", "XWE"],
				data1: [],
				data2: [],
				data3: [],
				data4: [],
				data5: [],
				data6: [],
				data7: [],
			}
		},
		// 属性
		props: {

		},
		// 组件挂载完毕
		mounted() {
			const h = this.$refs.con.offsetHeight - 50;
			this.carouselHeight = h + "px";
			this.getData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/


			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
			getData() {
				const dayFirst = C.formatDate('', 'yyyyMM01');
				const curDay = C.formatDate('', 'yyyyMMdd');
				// 遵义车务段管辖站：	["遵义","遵义南","息烽","桐梓北","桐梓东","娄山关南","修文县"]
				// 					["ZYE","ZNE","XFW","TBE","TDE","LSE","XW0"]
				this.stns.forEach((stn, index) => {
					C.getData({
						url:this.$store.state.url,
						c: "trdm_ys_269",
						s: [stn, dayFirst, curDay]
					}, (r) => {
						r.sort((a,b)=>{
							return a.RS-b.RS>=0?1:-1;
						});
						r = r.splice(0,8);
						console.log("【trdm_ys_269】旅客发送分析>>>"+this.snames[index],r);
						this["data" + (index + 1)] = r;
					});
				});
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
	.temp {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.srtitle {
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
