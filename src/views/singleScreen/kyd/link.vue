<template>
	<div style="width: 100%;height:calc(100vh - 60px)">
		<iframe id="iframe" src="" width="100%" style="border: 0;" height="100%"></iframe>
	</div>
</template>

<script>
	export default{
		data(){
			return {				
			}
		},
		props:{
			targetUrl:String
		},
		created() {
			
		},
		mounted() {
			var link = this.$route.query.link||this.targetUrl
			iframe.src = link
		}
	}
</script>

<style>
</style>
