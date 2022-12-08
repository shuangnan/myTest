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
	import flyBlLayerUtil from "../../../assets/map/flyBlLayerUtil.js"
	export default {
		data() {
			return {
				// 铁路线图
				lineLayers:null,
				// 铁路线图地址
				lineLayerUrl:"http://10.192.125.55:8090/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine"
			}
		},
		created() {},
		mounted() {
			mt.setVue(this);
			mt.initMap({
				el: this.$refs.map,
				zoom:1,
				// minZoom:2,
				// 中心点
				mapCenterPoint:[27.536233,106.807438],//遵义
				// 可缩放比例尺
				scaleDenominators:[4622334,6081556,2311167,1540778,1155583,770389,577792,288896,144448],
				// 天地图
				baseLayersUrl:"http://10.192.125.55:8090/iserver/services/map-ugcv5-chinamap/rest/maps/china_map",
			});
			if (this.lineLayers === null) {
				this.baseLayers = L.supermap.tiledMapLayer(this.lineLayerUrl, {
					transparent: true
				}).addTo(mt.map);
			}
			// const option = flyBlLayerUtil.getOption();
			// L.supermap.echartsLayer(option).addTo(mt.map);
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
		/* background: transparent; */
		background-color: rgba(255,255,255,0);
	}
</style>
