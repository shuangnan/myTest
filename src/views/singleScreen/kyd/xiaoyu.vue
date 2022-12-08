<template>
	<div style="width: 100%;height:100%">
		<iframe id="iframe" :src="targetUrl" width="100%" style="border: 0;" allow="microphone;camera;midi;encrypted-media;" height="100%"></iframe>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				iframeSrc:"",				
			}
		},
		props:{
			targetUrl:String
		},
		created() {
			
		},
		mounted() {
			var link = this.$route.query.link||this.targetUrl
			this.iframeSrc="";
			setTimeout(() => {
				this.iframeSrc=link;
			}, 10);
			// iframe.src = link
		}
	}
</script>

<style>
</style>
