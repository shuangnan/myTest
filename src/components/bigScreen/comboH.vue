<!-- 
 * @created：	2021年4月26日
 * @author：	ch
 * @version:	v1.0
 * @desc:		横向选择框
 -->
<template>
	<div class="combo-h">
		<div class="tit">
			<span v-show="showCur" class="shadow-txt">{{cur}}</span>
		</div>
		<transition name="bounce">
			<div v-show="cur===dataSource[0]" class="item shadow-txt" @click="chooseItem(dataSource[1])">{{dataSource[1]}}</div>
		</transition>
		<transition name="bounce">
			<div v-show="cur===dataSource[1]" class="item shadow-txt" @click="chooseItem(dataSource[0])">{{dataSource[0]}}</div>
		</transition>
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
				showCur:true,
				// 当前选中
				cur: "今日开行",
				timer:null
			}
		},
		// 属性
		props: {
			// 是否自动切换，数字为秒
			auto:{
				type:String,
				default:"0",
			},
			// 数据
			dataSource: {
				type: Array,
				default: function() {
					return ["tab1", "tab2"];
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			this.cur = this.dataSource[0];
			if(this.auto&&this.auto!=="0"){
				this.timer && clearInterval(this.timer);
				this.timer = setInterval(()=>{
					const ty = this.cur===this.dataSource[0]?this.dataSource[1]:this.dataSource[0];
					this.chooseItem(ty);
				},1000*this.auto);
			}
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			chooseItem(ty) {
				this.showCur = false;
				setTimeout(()=>{
					this.showCur = true;
				},500);
				this.cur = ty;
				this.$emit("select", ty);
			}

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
	.combo-h {
		letter-spacing: 1px;
		width: 250px;
		height: 60px;
	}

	.combo-h>.tit {
		width: 150px;
		height: 100%;
		font-size: 24px;
		text-align: center;
		line-height: 55px;
		border: 2px solid #908596;
		border-radius: 6px;
		background: rgba(7, 13, 34, .8);
	}

	.combo-h>.item {
		position: absolute;
		right: 0px;
		bottom: 0px;
		width: 80px;
		text-align: center;
		cursor: pointer;
	}
	
	.bounce-enter-active {
		animation: bounce-in .5s;
	}
	
	.bounce-leave-active {
		animation: bounce-in .5s reverse;
	}
	
	@keyframes bounce-in {
		from {
			transform: translate3d(-130px, -20px, 10px) scale(2);
		}
	
		to {
			/* transform: translate3d(-150px, -20px, 10px) scale(2); */
		}
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
	
</style>
