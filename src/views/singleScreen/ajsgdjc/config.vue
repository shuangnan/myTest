<template>
	<div>
	<div class="kk1">
		<div class="name">右一模块选择</div>
			<el-radio v-model="you1" label="1">病害情况</el-radio>
			  <el-radio v-model="you1" label="2">预警与提示(详细)</el-radio>
			  <el-radio v-model="you1" label="3">预警与提示(总数)</el-radio>
			  <el-radio v-model="you1" label="4">重点薄弱设备</el-radio>
			  <el-radio v-model="you1" label="5">施工计划统计</el-radio>
			  <el-radio v-model="you1" label="6">2.5级病害统计</el-radio>
			  <el-radio v-model="you1" label="7">TQI变化趋势</el-radio>
			  <el-radio v-model="you1" label="8">TQI质量增幅排行</el-radio>
			  <el-radio v-model="you1" label="9">TQI质量降幅排行</el-radio>
	</div>
	<div class="kk2">
		<div class="name">右二模块选择</div>
			<el-radio v-model="you2" label="1">病害情况</el-radio>
			  <el-radio v-model="you2" label="2">预警与提示(详细)</el-radio>
			  <el-radio v-model="you2" label="3">预警与提示(总数)</el-radio>
			  <el-radio v-model="you2" label="4">重点薄弱设备</el-radio>
			  <el-radio v-model="you2" label="5">施工计划统计</el-radio>
			  <el-radio v-model="you2" label="6">2.5级病害统计</el-radio>
			  <el-radio v-model="you2" label="7">TQI变化趋势</el-radio>
			  <el-radio v-model="you2" label="8">TQI质量增幅排行</el-radio>
			  <el-radio v-model="you2" label="9">TQI质量降幅排行</el-radio>
	</div>
	
	<div class="kk3">
		<div class="name">右三模块选择</div>
			<el-radio v-model="you3" label="1">病害情况</el-radio>
			  <el-radio v-model="you3" label="2">预警与提示(详细)</el-radio>
			  <el-radio v-model="you3" label="3">预警与提示(总数)</el-radio>
			  <el-radio v-model="you3" label="4">重点薄弱设备</el-radio>
			  <el-radio v-model="you3" label="5">施工计划统计</el-radio>
			  <el-radio v-model="you3" label="6">2.5级病害统计</el-radio>
			  <el-radio v-model="you3" label="7">TQI变化趋势</el-radio>
			  <el-radio v-model="you3" label="8">TQI质量增幅排行</el-radio>
			  <el-radio v-model="you3" label="9">TQI质量降幅排行</el-radio>
	</div>
	<Index ref="myindex" v-show='false'></Index>
		
	</div>
</template>

<script>
	import Index from "./Index.vue";
	import Utils from "./js/util.js"
	 export default {
	    data () {
	      return {
	        radio: '1',
			you1:'1',
			you2:'1',
			you3:'1',
	      };
	    },
		components: {
			Index
		},
		watch:{
			you1:{
				handler(newValue,oldValue){
					// console.log(newValue)
					// console.log(oldValue)
					// this.change()
					
					this.$store.commit('ajs/setyou1',this.you1)
					console.log(this.$store.state)
				}
			},
			you2:{
				handler(newValue,oldValue){
					// console.log(newValue)
					// console.log(oldValue)
					this.$store.commit('ajs/setyou2',this.you2)
				}
			},
			you3:{
				handler(newValue,oldValue){
					// console.log(newValue)
					// console.log(oldValue)
					this.$store.commit('ajs/setyou3',this.you3)
				}
			},
		},
		created() {
			// if(window.localStorage.getItem("you1")){
			// 	// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
			// 	this.$store.commit('ajs/setyou1',JSON.parse(window.localStorage.getItem("you1")))
			// 	console.log("wjj")
			// }
			// if(window.localStorage.getItem("you2")){
			// 	// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
			// 	this.$store.commit('ajs/setyou2',JSON.parse(window.localStorage.getItem("you2")))
			// 	console.log("wjj")
			// }
			// if(window.localStorage.getItem("you3")){
			// 	// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
			// 	this.$store.commit('ajs/setyou3',JSON.parse(window.localStorage.getItem("you3")))
			// 	console.log("wjj")
			// }
			// this.you1=this.$store.state.ajs.you1
			// this.you2=this.$store.state.ajs.you2
			// this.you3=this.$store.state.ajs.you3
			
			if(window.localStorage.getItem("you1")){
				// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
				this.$store.commit('ajs/setyou1',JSON.parse(window.localStorage.getItem("you1")))
				// console.log("wjj")
				this.you1=this.$store.state.ajs.you1
			}else{
				this.you1='1'
			}
			if(window.localStorage.getItem("you2")){
				// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
				this.$store.commit('ajs/setyou2',JSON.parse(window.localStorage.getItem("you2")))
				// console.log("wjj")
				this.you2=this.$store.state.ajs.you2
			}else{
				this.you2='2'
			}
			if(window.localStorage.getItem("you3")){
				// this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(window.localStorage.getItem("you1"))))
				this.$store.commit('ajs/setyou3',JSON.parse(window.localStorage.getItem("you3")))
				// console.log("wjj")
				this.you3=this.$store.state.ajs.you3
			}else{
				this.you3='5'
			}
		},
		mounted() {
			console.log(this.$store.state.ajs)
			document.querySelector("title").innerHTML = "数据可视化展示平台配置页面";
		},
		methods:{
			change(){
				Utils.$emit('you1',this.you1);
			}
		},
	  }
</script>

<style scoped="scoped">
	.kk1{
		position: absolute;
		top: 60px;
		left: 60px;
		right: 0px;
		bottom: 0px;
		z-index: 0;
		border: 10px #cc0b35;
		border-radius: 15px;
		border:5px solid #548ae8;
		width: 20%;
		height: 40%;
		background-color: #8fd7da;
		font-size: 25px;
	}
	.kk1>.el-radio{
		padding-top: 10px;
		/* text-align: center; */
		padding-left: 30px;
		font-size: 25px;
	}
	.name{
		color:#548ae8 ;
		/* padding-left: 50px; */
		text-align: center;
	}
	
	.kk2{
		position: absolute;
		top: 60px;
		left: 500px;
		right: 0px;
		bottom: 0px;
		z-index: 0;
		border: 10px #cc0b35;
		border-radius: 15px;
		border:5px solid #548ae8;
		width: 20%;
		height: 40%;
		background-color: #8fd7da;
		font-size: 25px;
	}
	.kk2>.el-radio{
		padding-top: 10px;
		/* text-align: center; */
		padding-left: 30px;
		font-size: 25px;
	}
	
	.kk3{
		position: absolute;
		top: 60px;
		left: 940px;
		right: 0px;
		bottom: 0px;
		z-index: 0;
		border: 10px #cc0b35;
		border-radius: 15px;
		border:5px solid #548ae8;
		width: 20%;
		height: 40%;
		background-color: #8fd7da;
		font-size: 25px;
	}
	.kk3>.el-radio{
		padding-top: 10px;
		/* text-align: center; */
		padding-left: 30px;
		font-size: 25px;
	}
</style>
