<!-- 
 * @created：	2021年2月25日
 * @author：	ch
 * @version:	v1.0
 * @desc:		客运段大屏
 -->
<template>
	<div style="width:100%;height:100%;">
		<div ref="map" class="map-con"></div>
	</div>
</template>

<script>
	import mt from "../../../assets/map/tools.js"
	export default {
		data() {
			return {

			}
		},
		created() {},
		mounted() {
			mt.setVue(this);
			mt.initMap({
				el: this.$refs.map
			});
		},
		components: {},
		methods: {}
	}
</script>

<style scoped="scoped">
	.map-con {
		width: 100%;
		height: 100%;
		display: inline-block;
		background-color: rgba(255, 255, 255, 0);
	}
</style>
