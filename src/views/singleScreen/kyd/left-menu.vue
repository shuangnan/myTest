<template>
	<div class="leftMenu">
		<a v-for="(m,i) in datasource" href="javascript:void()" target="_self" @click="redirect(m.fUrl,m.link)" class="btn-bg">{{m.fName}}</a>
	</div>
</template>
	
<script>
	import menu from './menu.js'
	export default{
		data(){
			return {
				datasource:null
			}
		},	
		mounted() {
			let data = menu.data
			var d = []
			data.forEach((item,i)=>{
				if(item.children){
					item.children.forEach((c,idx)=>{
						d.push(c)
					})
				}else{
					d.push(item)
				}
			})
			this.datasource = d
			console.log(d)
		},
		methods:{
			redirect(url,link){
				window.top.location.href = location.origin+location.pathname+"#/"+url+(link?"?link="+link:'')	
			}
		}
	}
</script>

<style scoped="scoped">
	.leftMenu{
		position: absolute;
		left:-50px;
		top:100px;
		z-index: 1000;
	}
	.btn-bg{
		width:120px;
		height:34px;
		line-height: 34px;
		color: #ffffff;
		text-decoration: none;
		background: url(../../images/btn-bg.png) no-repeat;
		display: block;	
		text-align: center;
		transition: 0.4s;
	}
	.btn-bg:hover{
		transform: translateX(50px);
		transition: 0.4s;
	}
</style>
