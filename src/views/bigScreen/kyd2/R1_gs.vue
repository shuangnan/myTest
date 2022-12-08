<!-- 
 * @created：	
 * @author：	
 * @version:	v1.0
 * @desc:		人员安排-工时排行
 -->
<template>
	<div class="box">
		<i class="arrow" :class="'seq'+seq"></i>
		<div class="content">
			<div class="tit">工时排行榜（{{tit}}）</div>
			<ul class="list">
				<li class="cw">
					<div>乘务人员：1232人&nbsp;12%</div>
					<div class="porogress blue"><i :style="{'width':ps_cw1}"></i></div>
					<div class="porogress green"><i :style="{'width':ps_cw1}"></i></div>
				</li>
				<li class="qj">
					<div>清洁人员：1232人&nbsp;12%</div>
					<div class="porogress blue"><i :style="{'width':ps_qj1}"></i></div>
					<div class="porogress green"><i :style="{'width':ps_qj1}"></i></div>
				</li>
				<li class="cy">
					<div>餐饮人员：1232人&nbsp;12%</div>
					<div class="porogress blue"><i :style="{'width':ps_cy1}"></i></div>
					<div class="porogress green"><i :style="{'width':ps_cy1}"></i></div>
				</li>
				<li class="jx">
					<div>检修人员：1232人&nbsp;12%</div>
					<div class="porogress blue"><i :style="{'width':ps_jw1}"></i></div>
					<div class="porogress green"><i :style="{'width':ps_jw1}"></i></div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				ps_cw1: "0%",
				ps_qj1: "0%",
				ps_cy1: "0%",
				ps_jw1: "0%",
			}
		},
		// 属性
		props: {
			seq: String,
			tit: String
		},
		// 组件挂载完毕
		mounted() {
			setTimeout(() => {
				this.ps_cw1 = "60%";
				this.ps_qj1 = "30%";
				this.ps_cy1 = "40%";
				this.ps_jw1 = "70%";
			}, 200)
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/

			/* @info  数据处理区-----------------------------------*/


			/* @info  数据交互区-----------------------------------*/
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.box {
		position: relative;
		width: 100%;
		height: 100%;
		font-size: 12px;
		color: #aec0f2;
		padding-top: 10px;
	}
	.box>.arrow {
		position: absolute;
		top: -10px;
		width: 0px;
		height: 0px;
		border: 10px solid transparent;
		border-bottom: 10px solid #0E2D6F;
	}
	.box>.arrow.seq1{
		left:50px;
	}
	.box>.arrow.seq2{
		left:154px;
	}
	.box>.arrow.seq3{
		left:254px;
	}
	.box>.arrow.seq4{
		left:350px;
	}
	
	.content{
		width: 100%;
		height: 100%;
		padding:0 10px;
		border-radius: 10px;
		background: rgba(11, 11, 11, 1);
	}

	.tit {
		padding: 5px;
		text-align: center;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.list>li {
		float: left;
		height: 40px;
		width: 50%;
		padding: 5px 20px 5px 35px;
		background-size: 30px 30px;
	}

	.list>li.cw {
		background: url(img/gsph_ry.png)no-repeat;
		background-position: 0px 5px;
	}

	.list>li.qj {
		background: url(img/gsph_qj.png)no-repeat;
		background-position: 0px 5px;
	}

	.list>li.cy {
		background: url(img/gsph_cy.png)no-repeat;
		background-position: 0px 5px;
	}

	.list>li.jx {
		background: url(img/gsph_wx.png)no-repeat;
		background-position: 0px 5px;
	}

	.porogress {
		position: relative;
		width: 100%;
		height: 2px;
		margin: 5px 0;
	}

	.porogress>i {
		position: absolute;
		display: inline-block;
		height: 2px;
		transition: width .6s;
	}

	.porogress.blue {
		background: #051948;
	}

	.porogress.blue>i {
		background: #08318C;
	}

	.porogress.green {
		background: #033519;
	}

	.porogress.green>i {
		background: #0AA54E;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
