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
				el: this.$refs.map,
				baseLayersUrl:"http://10.192.125.55:8090/iserver/services/map-ugcv5-chinarail/rest/maps/china_rail"
				// baseLayersUrl:"http://10.192.125.55:8090/iserver/services/map-ugcv5-ChinaMap/rest/maps/ChinaMap"
				// baseLayersUrl:"http://10.192.125.55:8090/iserver/services/map-ugcv5-ChinaMapzy/rest/maps/ChinaMap_zy"
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
		background-color: transparent;
	}
</style>
