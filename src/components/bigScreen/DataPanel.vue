
<template>
	<div class="out-div" :style="outStyle">
		<template v-if="type==='line'">
			<el-button v-if="more" class="btn_see_more" size="mini" @click="()=>this.$emit('moreClick','more'+this.title)">更多></el-button>
			<div class="title-line" @click="()=>this.$emit('titleClick',this.title)">
				<div>{{title}}</div>
				<!-- <div style="color: #919BC0;font-size: 10px">{{subTitle}}</div> -->
			</div>
			<div class="content-line">
				<div class="line"></div>
				<slot></slot>
			</div>
		</template>
		<div v-else class="blue-border">
			<div class="top-left-icon"/>
			<div class="top-center-icon"/>
			<div class="top-right-icon"/>
			<div class="bottom-left-icon"/>
			<div class="bottom-right-icon"/>
			<div class="title-pic" :style="{textAlign:titleAlign}" @click="()=>this.$emit('titleClick',this.title)">{{title}}</div>
			<div class="content-pic">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		data() {
			return {
			}
		},
		props: {
			title: {
				type: String,
				required: true
			},
			subTitle: String, //副标题，英文
			type: String,
			width: String, //默认100%，可传入百分比或具体px
			height: String, //默认100%，可传入百分比或具体px
			more: [Boolean, String], //是否需要更多按钮
			titleAlign:{type:String,default:'center'},//标题位置
		},
		// 组件挂载完毕
		mounted() {
		},
		// 方法
		methods: {
			/**-------------------------响应事件-------------------------------*/
			/**-------------------------数据展示-------------------------------*/
			/**-------------------------获取数据-------------------------------*/
		},
		// 监视属性
		watch: {
		},
		// 计算属性
		computed: {
			outStyle: function() {
				const width = this.width ? this.width : "100%";
				const height = this.height ? this.height : "100%";
				const style = {
					width,
					height
				};
				return style;
			}
		},
		// 组件
		components: {
		},
	}
</script>

<style scoped>
	/*外边距*/
	.out-div {
		height: 100%;
		width: 100%;
		padding: 16px 16px 16px 16px;
		font-family: "Source Han Sans CN";
	}
	.btn_see_more {
		color: #09BDF7;
		font-weight: bold;
		font-size: 14px;
		position: absolute;
		float: right;
		top: 20px;
		right: 20px;
		background: transparent;
		border: none;
	}
	/*标题*/
	.title-line {
		height: 22px;
		width: 100%;
		margin-left: 6px;
		font-size: 14px;
		font-weight: bold;
		border-left: 4px solid #09BDF7;
		margin-bottom: 4px;
		padding-left: 8px;
		text-shadow: 0px 0px 3px black;
		color: #e6e6e6;
		cursor: pointer;
	}
	
	/*正式框体*/
	.content-line {
		width: 100%;
		height: calc(100% - 10px);
		position: relative;
		background-color: rgba(3, 22, 71, 0.62);
		padding: 8px;
		border-radius: 3px 3px 3px 3px;
		border: 2px solid #053159;
	}
	
	.line {
		position: absolute;
		top: -3px;
		left: 0;
		height: 3px;
		width: 100%;
		border-bottom: 2px transparent solid;
		border-image: linear-gradient(to right, #09BDF7, #054470) 1 10;
	}
	
	/* 图片边框 */
	/*正式框体*/
	.blue-border {
	    width: 100%;
	    height: 100%;
	    position: relative;
	    background-color: rgba(255, 255, 255, 0.05);
	    padding: 8px;
	    border-radius: 18px 3px 3px 3px;
	    border-bottom: 2px solid #406BB0;
	}
	
	/*标题*/
	.title-pic {
	    position: absolute;
	    top: -24px;
	    height: 40px;
	    width: 100%;
	    text-align: center;
	    color: #fff;
	    font-size: 16px;
	    font-weight: bold;
		cursor: pointer;
	}
	
	/*内容区域*/
	.content-pic {
	    height: 100%;
	    width: 100%;
	}
	
	/*边框图片相关Start*/
	.top-left-icon {
	    position: absolute;
	    top: 0;
	    left: 0;
	    background-image: url("../../assets/imgs/bigScreen/top-left.png");
	}
	
	.top-left-icon {
	    position: absolute;
	    top: 0;
	    left: 0;
	    height: 50px;
	    width: 50px;
	    background: url("../../assets/imgs/bigScreen/top-left.png") no-repeat;
	}
	
	.top-center-icon {
	    position: absolute;
	    top: 0;
	    left: 30%;
	    height: 5px;
	    width: 40%;
	    background: url("../../assets/imgs/bigScreen/top-center.png") no-repeat;
	    background-size: cover;
	}
	
	.top-right-icon {
	    position: absolute;
	    top: 0;
	    right: 0;
	    height: 3px;
	    width: 86px;
	    background: url("../../assets/imgs/bigScreen/top-right.png") no-repeat;
	}
	
	.bottom-left-icon {
	    position: absolute;
	    bottom: 0;
	    left: 0;
	    height: 58px;
	    width: 2px;
	    background: url("../../assets/imgs/bigScreen/bottom-left.png") no-repeat;
	}
	
	.bottom-right-icon {
	    position: absolute;
	    bottom: 0;
	    right: 0;
	    height: 58px;
	    width: 2px;
	    background: url("../../assets/imgs/bigScreen/bottom-left.png") no-repeat;
	}
	
</style>