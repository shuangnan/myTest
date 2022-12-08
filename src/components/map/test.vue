<template>
	<div class="leaflet-popup leaflet-zoom-animated" style="opacity: 1; transform: translate3d(5px, 0px, 0px); bottom: 0px; left:-265px;">
						<a class ="leaflet-popup-close-button" style="z-index:10;" href="javaScript:void(0)" onclick="$('.leaflet-popup').remove();">x</a>
						<div class="leaflet-popup-content-wrapper blue" style="background:rgba(24,36,71,.7)">
							<div id="popupLoading" style="position:absolute;text-align:center;width:100%;height:100%;left:0;top:0;z-index:10;padding:250px 0;background: rgba(20,20,20,.4);">加载中,请稍候...</div>
							<div class="leaflet-popup-content no-padding marker-station-info" style="position:relative;width:530px;height: 530px;">
								<div class="top">
									<div class="top-left">
										<div class="pic"></div>
										<div class="text"><h3>${ stn.STN_NAME }</h3>${ stn.GIS_GRADE }站</div>
									</div>
									<div class="top-right">
										<div class="btns"></div>
									</div>
								</div>
								<div class="chart" id="stationInfoChartCon"></div>
								<div class="bottom">
									<div class="bottom-left">
										<div class="tit-con">晚点情况</div>
									</div>
									<div class="bottom-right">
										<div class="tit-con">人员安排情况<label>当前工作人数:-人</label></div>
									</div>
								</div>
							</div>
						</div>
						<div class="leaflet-popup-tip-container" style="margin-top: 0px;">
						<div class="leaflet-popup-tip blue"></div></div>
	</div>
</template>

<script>
</script>

<style>
	
</style>
<style src="./css/station.css"></style>