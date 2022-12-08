<!-- 
 * @created：	2021年8月24日
 * @author：	ch
 * @version:	v1.0
 * @desc:		客运地图模板
 -->
<template>
  <div style="width: 100%;height: 100%;">
    <!-- <div
      style="position: fixed;top:0;left:0;border: 1px solid #ddd;background: #EEEEEE;z-index: 500;"
    > -->
      <!-- <el-button @click="geoBufferAnalystProcess">测试</el-button> -->
	  
    <!-- </div> -->
    <div ref="map" id="home-map" class="map-con"></div>
	

	
	<div style="position: absolute;top:80px;left:50%;margin-left:-400px;width: 800px;z-index: 410;">
		
		<!-- <div style="text-align: center;float: left;padding-left: 50px;" @click="changetype(1)">
			<el-button class="button1-1" :class=" type===1?'button1-2':'' "  ></el-button><br/>
			<i style="color:#0194cb; font-style: normal;">工务</i>
		</div>
		<div style="text-align: center;float: left;padding-left: 50px;" @click="changetype(2)">
			<el-button class="button2-1" :class=" type===2?'button2-2':'' "></el-button><br/>
			<i style="color:#0194cb; font-style: normal;">电务</i>
		</div>
		<div style="text-align: center;float: left;padding-left: 50px;" @click="changetype(3)">
			<el-button class="button3-1" :class=" type===3?'button3-2':'' "></el-button><br/>
			<i style="color:#0194cb; font-style: normal;">供电</i>
		</div>
		<div style="text-align: center;float: left;padding-left: 50px;"@click="changetype(4)">
			<el-button class="button4-1" :class=" type===4?'button4-2':'' "></el-button><br/>
			<i style="color:#0194cb; font-style: normal;">机务</i>
		</div>
		<div style="text-align: center;float: left;padding-left: 50px;"@click="changetype(5)">
			<el-button class="button5-1" :class=" type===5?'button5-2':'' "></el-button><br/>
			<i style="color:#0194cb; font-style: normal;">物资</i>
		</div>
		<div style="text-align: center;float: left;padding-left: 50px;"@click="changetype(6)">
			<el-button class="button6-1" :class=" type===6?'button6-2':'' "></el-button><br/>
			<i style="color:#0194cb; font-style: normal;">施工</i>
		</div> -->
		
	</div>
  </div>
</template>

<script>
// 这里引用各种资源
import C from "../com.js";
import html2canvas from "html2canvas";
import elDragDialog from "@/directive/el-dragDialog";
import mapUtil from "../../components/map/js/mapUtil.js";
import config from "../../components/map/js/config.js";
import stations from "../../components/map/js/stations.js"; //车站
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import "echarts/lib/chart/line";
import "echarts/lib/chart/scatter";
import ecStat from "echarts-stat";
import wicon from "../../components/map/img/病害红.png"
import point from "../../views/singleScreen/kyz/icons/filters/1.png"
import sgt from "../../views/singleScreen/ajsgdjc/img2/审批模型-施工.png"
import backkk from "../imgs/bigScreen/phone-card.png"
import face from "../imgs/h-speedRailway/ybb.png"
import configs from '../../components/map/js/config.js'
import alldialog from '../../views/singleScreen/ajsgdjc/js/dialog.js'
import dongdialog from '../../views/singleScreen/ajsgdjc/dongdialog.vue'
import dialog2 from '../../views/singleScreen/ajsgdjc/dialog2.vue'
export default {
	// import defaultMark from '../imgs/bigScreen/arrow-lef.png'
  // 组件
  components: {
	  alldialog,
  },
  // 数据仓库

  data() {
    return {
	  type: 1,//1为默认值工务，2电务，3供电，4机务，5物资，6施工
      map: null,
	  gw:[],
	  dw:[],
	  gd:[],
	  jw:[],
	  wz:[],
	  sg:[],
	  shigongnum:'',
	  sg1:[],
	  sg2:[],
	  sg3:[],
	  sg4:[],
	  sg5:[],
	  sg6:[],
	  type1:'',
	  unit:'',
	  GRADE:'',
	  LENGTH:'',
	  sgdetail:[],
	  numdata:[
		  1153,
		  4385,
		  3446,
		  4762,
		  1238,
		  4463,
		  2154,
		  954,
	  ],
	  
	  baseLayerVisible:1,
	  // 夜间成都城市地图---带公路
	  sccqUrlNight_gl: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-cdCity/rest/maps/cdCity",
	  // 夜间成都城市地图
	  // sccqUrlNight: "https://10.192.125.55:8443/iserver/services/map-ugcv5-cdCity2/rest/maps/cdCity",
	  // sccqUrlNight: "https://10.192.125.55:8443/iserver/services/map-map_detail/rest/maps/cdCity",
	  // sccqUrlNight: "https://10.192.125.55:8443/iserver/services/map-ugcv5-cdCity/rest/maps/cdCity",
	  sccqUrlNight: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaCityb/rest/maps/ChinaCity_b",
	  // sccqUrlNight:"https://10.192.125.55:8443/iserver/services/map-ugcv5-ChengDuDongWeiXing/rest/maps/成都东卫星",
	  // 日间成都城市地图
	  // sccqUrlDay: '',
	  // sccqUrlDay: "https://10.192.125.55:8443/iserver/services/map-ugcv5-cdCity2/rest/maps/cdCity2",
	  // sccqUrlDay: "https://10.192.125.55:8443/iserver/services/map-ugcv5-cdCity3/rest/maps/cdCity3",
	  // qgUrlDay: "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaCity/rest/maps/ChinaCity",
	  sccqUrlDay: 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaCityq/rest/maps/ChinaCity_q',
	  qgUrlDay: 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaCity/rest/maps/ChinaCity',
	  // qgUrlDay: "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaCity/rest/maps/ChinaCity.leaflet",
	  // qgUrlNight: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaCityb/rest/maps/ChinaCity_b",
	  // https://10.192.125.55:8443/iserver/services/map-map_detail/rest/maps/cdCity2.leaflet
	  qgUrlNight: 'https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaCityc/rest/maps/ChinaCity_c',
	  mapUrl: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3", //地图服务
	  sccqLayer: null,
	  baseLayer: null,
	  roadQgLayer: null,
	  roadSccqLayer: null,
	  baseLayerVisible:1,
	  
	  	dialogIsVisible:false,
	  ////
	  
	  config: config,
	  detailMarker: null, //地图pop弹窗层
      // 天地图地址
      baseLayersUrl:
        // "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
		"https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaCityb/rest/maps/ChinaCity_b",
      // baseLayersUrl: "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3",
      // 铁路线图地址
      lineLayerUrl:
        "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine",
      // 四川重庆详细地图地址
      sccqUrl:
        "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-MapClip/rest/maps",
      // 天地图中心点
      // mapCenterPoint: [29.87600725249192, 107.5441221573846], //成都
      mapCenterPoint: [29.9532539232503, 104.449862462555], //成都
      // 可缩放比例尺
      scaleDenominators: [
        36978669,
        18489335,
        9244667,
        4622334,
        3081556,
        2311167,
        1540778,
        1155583,
        770389,
        577792,
        288896,
        144448,
        72224,
        36112,
        18056,
        9028
      ],
      zoom: 8, //默认缩放倍数
      maxZoom: 11, //最大缩放16
      minZoom: 1, //最小缩放，

      // 所有图层
      layers: {
        qiaoLiang: null, //桥梁
        suiDao: null ,//遂道
		stationLayer:null,
		tanchang:null,
      },
      // 当前点击对象
      curClickObj: {
        qiaoSuiId: "" //桥遂id
      },
      // 详细信息popup层
      popups: {
        qiaoSui: null
      }
    };
	// stations.data,
  },
  // 属性
  props: {
    // 全国铁路线路图
    roalLayer: {
      type: Boolean,
      default: true
    },
    //四川重庆详细地图
    sccqLayer: {
      type: Boolean,
      default: true
    }
  },
  directives:{
	focus:{
		inserted:function(el){
			el.focus();
		}
	}  
  },
  // 组件挂载完毕
  mounted() {
    document.querySelector("title").innerHTML = "数据可视化展示平台";
	this.config.station.ck_boundAll = true
	this.config.station.register = true
	// console.log("@@@@")
	// console.log(this.config.station)
	// this.getData_jh_sg()
    this.initMap();
	this.initmarker(this.type);
	// this.injectionScript();
	// stations.filterLayer(true);
  },
  // 方法
  methods: {
	  // getData_jh_sg () {
	  // 	C.getData({
	  // 	  url: "https://10.192.126.203/GeneralProServlet",
	  // 	  c: 'tyzd_ggy2061',
	  // 	}, res => {
	  // 	  console.log("全部通报")
	  // 	  console.log(res)
		 //  this.sg1=res.data['1']
		 //  console.log(this.sg1)
		  
	  // 	  // this.tableList1 = res.data['1']
	  // 	});
	  		
	  // },
	 
	  
	  shigongmarker(name1,grap){
		 // for(let i=0;i<this.gw.length;i++){
		 // 			  this.map.removeLayer(this.gw[i])
		 // }
		 // this.gw=[]
		 // for(let i=0;i<this.dw.length;i++){
		 // 			  this.map.removeLayer(this.dw[i])
		 // }
		 // this.dw=[]
		 // for(let i=0;i<this.gd.length;i++){
		 // 			  this.map.removeLayer(this.gd[i])
		 // }
		 // this.gd=[]
		 // for(let i=0;i<this.jw.length;i++){
		 // 			  this.map.removeLayer(this.jw[i])
		 // }
		 // this.jw=[]
		 // for(let i=0;i<this.wz.length;i++){
		 // 			  this.map.removeLayer(this.wz[i])
		 // }
		 // this.wz=[]
		 // for(let i=0;i<this.sg.length;i++){
		 // 			  this.map.removeLayer(this.sg[i])
		 // }
		 
		 // this.sg=this.sg1
		 //  for(let i=0;i<this.sg.length;i++){
			 
			//   this.initsgmarker(this.sg[i].PK_ID)
			name1=name1.substring(0,name1.length-1)
			console.log(name1)
		 //  }
		 // this.sg1=[]
		 
		 C.getData({
		 	  url: "https://10.192.126.203/GeneralProServlet",
		 	  c: 'tyzd_zhaoyue2001',
			  s:[[name1,grap]]
		 	}, res => {
		 	  console.log("全部通报")
		 	  console.log(res)
			  console.log(res.data['1'].length)
		 		  this.sg1=res.data['1']
		 		  console.log(this.sg1)
				  
				  
				  this.initsgmarker()
		 		  
		 	  // this.tableList1 = res.data['1']
		 	});
			for(let i=0;i<this.gw.length;i++){
						  this.map.removeLayer(this.gw[i])
			}
			this.gw=[]
			for(let i=0;i<this.dw.length;i++){
						  this.map.removeLayer(this.dw[i])
			}
			this.dw=[]
			for(let i=0;i<this.gd.length;i++){
						  this.map.removeLayer(this.gd[i])
			}
			this.gd=[]
			for(let i=0;i<this.jw.length;i++){
						  this.map.removeLayer(this.jw[i])
			}
			this.jw=[]
			for(let i=0;i<this.wz.length;i++){
						  this.map.removeLayer(this.wz[i])
			}
			this.wz=[]
			for(let i=0;i<this.sg.length;i++){
						  this.map.removeLayer(this.sg[i])
			}
			this.sg=[]	
			
			setTimeout(()=>{
				
			},200)
		  
			  
		  
		  // console.log("sg1==")
		  // console.log(this.sg)
	  },
	  setmarker(p,PK_ID){
	
		  C.getData({
		  	    url: "https://10.192.126.203/GeneralProServlet",
		  	    c: 'tyzd_ggy2062',
		  	  			s:[[PK_ID]]
		  	  }, res => {
		  	    console.log("详情")
		  	    console.log(res)
		  		
		  	    this.sgdetail=res.data['1']
		  		// this.type1=res.data['1'][0].TYPE
		  		// this.unit=res.data['1'][0].DO_UNIT
		  		// this.GRADE=res.data['1'][0].GRADE
		  		// this.LENGTH=res.data['1'][0].LENGTH
				let type= this.sgdetail[0].TYPE
						 let unit =this.sgdetail[0].DO_UNIT
						 let GRADE =this.sgdetail[0].GRADE
						 let LENGTH =this.sgdetail[0].LENGTH
						 let content = `	<div style="width:280px;height:110px;position: absolute;margin-top: -6px;margin-left: -6px;">
						 	<div style="display: flex;">
						 		<div style="color: #FFFFFF;font-size: 16px;width:70px">施工项目:</div>
						 		<div title="${type}" style="cursor: pointer;color: #ffc335;font-size: 16px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${type}</div>
						 	</div>
						 	<div style="display: flex;padding-top: 5px;">
						 		<div style="color: #FFFFFF;font-size: 16px;width:65px">单位:</div>
						 		<div title="${unit}" style="cursor: pointer;color: #ffc335;font-size: 16px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${unit}</div>
						 	</div>
						 	<div style="display: flex;padding-top: 5px;">
						 		<div style="color: #FFFFFF;font-size: 16px;width:70px">施工等级:</div>
						 		<div title="${GRADE}" style="cursor: pointer;color: #ffc335;font-size: 16px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${GRADE}</div>
						 	</div>
						 	<div style="display: flex;padding-top: 5px;">
						 		<div style="color: #FFFFFF;font-size: 16px;width:65px" @click=change>公里标：</div>
						 		<div title="${LENGTH}" style="cursor: pointer;color: #ffc335;font-size: 16px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${LENGTH}</div>
						 	</div>
						 </div>`
						 L.popup({minWidth : 350,className:'mypopup2'})
						 .setLatLng([p.latlng.lat, p.latlng.lng])
						 .setContent(content)
						 .openOn(this.map);
		  	  });
			  
					 		 // console.log(type)
					 		 // console.log(DO_UNIT)
					 		 // console.log(GRADE)
					 		 // console.log(LENGTH)
		
		    
	  },
	  initsgmarker(PK_ID){
		  
				   
		  console.log("546546")
		  console.log(this.sg1)
		  for(let i=0;i<this.sg1.length;i++){
			  var marker = L.marker([this.sg1[i].GPSY, this.sg1[i].GPSX],{icon:L.icon( {
			  		  iconSize: [30, 30],
			  		  // html:"hahaha",
			  		  iconUrl:sgt,
			  				data: {
			  					// num:3773,
			  				},
			  			} )}).addTo(
			     this.map//贵阳
			   );
			   this.sg.push(marker)
			   marker.on( "click", ( p ) => {
			   		 	// this.setStationMarkerClick(p)
			   				console.log("贵阳")
							console.log(p)
							this.setmarker(p,this.sg1[i].PK_ID)
			   				// this.getconcreteData(this.sg1[i].PK_ID)
			   		 } );
		  }
		  
		  		
		  
	// 	  C.getData({
	// 	    url: "https://10.192.126.203/GeneralProServlet",
	// 	    c: 'tyzd_ggy2062',
	// 	  			s:[[PK_ID]]
	// 	  }, res => {
	// 	    // console.log("详情")
	// 	    // console.log(res)
			
	// 	    this.sgdetail=res.data['1']
	// 		// console.log(this.sgdetail)
	// 	    // this.tableList1 = res.data['1']
	// 		var marker = L.marker([this.sgdetail[0].GPSY, this.sgdetail[0].GPSX],{icon:L.icon( {
	// 				  iconSize: [30, 30],
	// 				  // html:"hahaha",
	// 				  iconUrl:sgt,
	// 						data: {
	// 							// num:3773,
	// 						},
	// 					} )}).addTo(
	// 		   this.map//贵阳
	// 		 );
	// 		 this.sg.push(marker)
	// 		 // let PK_ID = this.sgdetail[0].PK_ID
	// 		 // console.log("全部参数")
	// 		 // let type= this.sgdetail[0].TYPE
	// 		 // let unit =this.sgdetail[0].DO_UNIT
	// 		 // let GRADE =this.sgdetail[0].GRADE
	// 		 // let LENGTH =this.sgdetail[0].LENGTH
	// 		 // console.log(type)
	// 		 // console.log(DO_UNIT)
	// 		 // console.log(GRADE)
	// 		 // console.log(LENGTH)
	// 		 marker.bindPopup(`	<div style="width:280px;height:110px;position: absolute;margin-top: -6px;margin-left: -6px;">
	// 	<div style="display: flex;">
	// 		<div style="color: #FFFFFF;font-size: 14px;width:65px">施工项目:</div>
	// 		<div title="${type}" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${type}</div>
	// 	</div>
	// 	<div style="display: flex;padding-top: 5px;">
	// 		<div style="color: #FFFFFF;font-size: 14px;width:65px">单位:</div>
	// 		<div title="${unit}" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${unit}</div>
	// 	</div>
	// 	<div style="display: flex;padding-top: 5px;">
	// 		<div style="color: #FFFFFF;font-size: 14px;width:65px">施工等级:</div>
	// 		<div title="${GRADE}" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${GRADE}</div>
	// 	</div>
	// 	<div style="display: flex;padding-top: 5px;">
	// 		<div style="color: #FFFFFF;font-size: 14px;width:65px" @click=change>公里标：</div>
	// 		<div title="${LENGTH}" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${LENGTH}</div>
	// 	</div>
	// </div>`,{className:'mypopup2'})
	// 		 // 
	// 		 marker.on( "click", ( p ) => {
	// 		//  	this.setStationMarkerClick(p)
	// 				console.log("贵阳")
					
	// 		 } );
	// 	  });
		  
			  
	  },
	  getconcreteData(PK_ID){
		  C.getData({
		  	    url: "https://10.192.126.203/GeneralProServlet",
		  	    c: 'tyzd_ggy2062',
		  	  			s:[[PK_ID]]
		  	  }, res => {
		  	    console.log("详情")
		  	    console.log(res)
		  		
		  	    // this.sgdetail=res.data['1']
		  		this.type1=res.data['1'][0].TYPE
		  		this.unit=res.data['1'][0].DO_UNIT
		  		this.GRADE=res.data['1'][0].GRADE
		  		this.LENGTH=res.data['1'][0].LENGTH
		  	  });
	  },
	  changetype(type){
		  this.type=type
		  // console.log(type)
		  // console.log(type!=1)
		  if(type!=1){
			  for(let i=0;i<this.gw.length;i++){
			  			  this.map.removeLayer(this.gw[i])
			  }
			  this.gw=[]
			  
		  }
		  if(type!=2){
		  			  for(let i=0;i<this.dw.length;i++){
		  			  			  this.map.removeLayer(this.dw[i])
		  			  }
					  this.dw=[]
		  }
		  if(type!=3){
			  for(let i=0;i<this.gd.length;i++){
			  			  this.map.removeLayer(this.gd[i])
			  }
			  this.gd=[]
		  }
		  if(type!=4){
		  			  for(let i=0;i<this.jw.length;i++){
		  			  			  this.map.removeLayer(this.jw[i])
		  			  }
					  this.jw=[]
		  }
		  if(type!=5){
		  			  for(let i=0;i<this.wz.length;i++){
		  			  			  this.map.removeLayer(this.wz[i])
		  			  }
					  this.wz=[]
		  }
		  
		  for(let i=0;i<this.sg.length;i++){
		  			  this.map.removeLayer(this.sg[i])
		  }
		  this.sg=[]			 
		  
		 
			  
			  this.initmarker(type)
		  
		  console.log("!!!")
		  console.log(this.type!=type)
		  // this.initMap()
	  },
	  setStationMarkerClick () {
		  console.log(p)
	  },
	  initYjEvents () {
	    C.getDataP123( {
	      c: 'eqeh_zxy2049',
	      url: C.ADDS.servGS, //接口地址
	    }, ( res ) => {
	      console.log( '获取进行中的应急响应', res['1'] )
	      this.$store.commit( 'yjEventPush/initEvents', res['1'] )
	    } )
	  },
	  injectionScript() {
		  stations.init(this);
		  
		  
	  },
	  filterLayers(){
		  stations.filterLayer(true);
	  },
	  
	  initmarker(type){
		  this.type=type
		if(this.type===1){
			var marker = L.marker([26.556677134123664, 106.70537789151476],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//贵阳
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="贵阳高铁工务段"></dong-dialog>`,{className:'mypopup'})
			 // 
			 marker.on( "click", ( p ) => {
			//  	this.setStationMarkerClick(p)
					console.log("贵阳")
					
			 } );
			 
			 
			 var marker = L.marker([29.55875858996766, 106.46076030652625],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//重庆
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="重庆工务段"></dong-dialog>`,{className:'mypopup'})
			 marker.on( "click", ( p ) => {
			 	console.log("重庆")
			 } );
			 
			 var marker = L.marker([30.625144160042613, 104.14247224668789],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//成都
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="成都高铁工务段"></dong-dialog>`,{className:'mypopup'})
			 // this.map.on("popupopen",function(e){
				//  document.getElementById("detail").onclick=function(){
					 
				//  }
			 // })
			 marker.on( "click", ( p ) => {
			 	console.log("成都")
			 } );
			 
			 var marker = L.marker([29.77563347339389, 107.2708368239774],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//涪陵
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="涪陵工务段"></dong-dialog>`,{className:'mypopup'})
			 marker.on( "click", ( p ) => {
			 	console.log("涪陵")
			 } );
			 
			 var marker = L.marker([30.53152996056404,105.54959888418578],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//遂宁
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="遂宁工务段"></dong-dialog>`,{className:'mypopup'})
			 marker.on( "click", ( p ) => {
			 	console.log("遂宁")
			 } );
			 
			 var marker = L.marker([29.61309393767984,105.08936295026943],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//内江
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="内江工务段"></dong-dialog>`,{className:'mypopup'})
			 marker.on( "click", ( p ) => {
			 	console.log("内江")
			 } );
			 
			 var marker = L.marker([31.254310562150874, 107.47586854921576],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//达州
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="达州工务段"></dong-dialog>`,{className:'mypopup'})
			 marker.on( "click", ( p ) => {
			 	console.log("达州")
			 } );
			 
			 var marker = L.marker([ 27.900616263470827, 102.2239898073726],{icon:L.icon( {
					  iconSize: [30, 30],
					  // html:"hahaha",
					  iconUrl:wicon,
							data: {
								num:3773,
							},
						} )}).addTo(
			   this.map//西昌
			 );
			 this.gw.push(marker)
			 marker.bindPopup(`<dong-dialog type="西昌工务段"></dong-dialog>`,{className:'mypopup'})
			 // marker.bindPopup(marker.options.icon.options.data.num)
			 marker.on( "click", ( p ) => {
			 	console.log("西昌")
			 } );
			 
			 
			 	var marker = L.marker([29.510962546002613, 106.44411521744784],{icon:L.icon( {
			 						  iconSize: [30, 30],
			 						  // html:"hahaha",
			 						  iconUrl:wicon,
			 								data: {
			 									num:3773,
			 								},
			 							} )}).addTo(
			 	  this.map//重庆工电段
			 	);
			 	this.gw.push(marker)
			 	marker.bindPopup(`<dong-dialog type="重庆工电段"></dong-dialog>`,{className:'mypopup'})
			 	// marker.bindPopup(marker.options.icon.options.data.num)
			 	marker.on( "click", ( p ) => {
			 		console.log("眉山东")
			 	} );
				
				var marker = L.marker([31.462547528530173, 104.7174828677313],{icon:L.icon( {
									  iconSize: [30, 30],
									  // html:"hahaha",
									  iconUrl:wicon,
											data: {
												num:3773,
											},
										} )}).addTo(
				  this.map//绵阳
				);
				this.gw.push(marker)
				marker.bindPopup(`<dong-dialog type="绵阳工务段"></dong-dialog>`,{className:'mypopup'})
				// marker.bindPopup(marker.options.icon.options.data.num)
				marker.on( "click", ( p ) => {
					console.log("绵阳")
				} );
				
				var marker = L.marker([28.768480975583408, 104.61942303833482],{icon:L.icon( {
									  iconSize: [30, 30],
									  // html:"hahaha",
									  iconUrl:wicon,
											data: {
												num:3773,
											},
										} )}).addTo(
				  this.map//峨眉山
				);
				this.gw.push(marker)
				marker.bindPopup(`<dong-dialog type="宜宾工电段"></dong-dialog>`,{className:'mypopup'})
				marker.on( "click", ( p ) => {
					console.log("峨眉山")
				} );
				
				var marker = L.marker([30.60682301407449, 104.07038050501208],{icon:L.icon( {
									  iconSize: [30, 30],
									  // html:"hahaha",
									  iconUrl:wicon,
											data: {
												num:3773,
											},
										} )}).addTo(
				  this.map//成都工务段
				);
				this.gw.push(marker)
				marker.bindPopup(`<dong-dialog type="成都工务段"></dong-dialog>`,{className:'mypopup'})
				marker.on( "click", ( p ) => {
					console.log("广汉")
				} );
				
				var marker = L.marker([26.649933096936767, 106.69950130779684],{icon:L.icon( {
									  iconSize: [30, 30],
									  // html:"hahaha",
									  iconUrl:wicon,
											data: {
												num:3773,
											},
										} )}).addTo(
				  this.map//贵阳工务段
				);
				this.gw.push(marker)
				marker.bindPopup(`<dong-dialog type="贵阳工务段"></dong-dialog>`,{className:'mypopup'})
				marker.on( "click", ( p ) => {
					console.log("贵阳工务段")
				} );
				
				var marker = L.marker([26.594288194538994, 104.8456036725967],{icon:L.icon( {
									  iconSize: [30, 30],
									  // html:"hahaha",
									  iconUrl:wicon,
											data: {
												num:3773,
											},
										} )}).addTo(
				  this.map//六盘水南
				);
				this.gw.push(marker)
				marker.bindPopup(`<dong-dialog type="六盘水工电段"></dong-dialog>`,{className:'mypopup'})
				marker.on( "click", ( p ) => {
					console.log("六盘水南")
				} );
				
				var marker = L.marker([26.62375630014157, 107.97945534385988],{icon:L.icon( {
									  iconSize: [30, 30],
									  // html:"hahaha",
									  iconUrl:wicon,
											data: {
												num:3773,
											},
										} )}).addTo(
				  this.map//凯里
				);
				this.gw.push(marker)
				marker.bindPopup(`<dong-dialog type="凯里工务段"></dong-dialog>`,{className:'mypopup'})
				marker.on( "click", ( p ) => {
					console.log("凯里")
				} );
				
		}  
		if(this.type===2){
			var marker = L.marker([30.068037850015894, 103.82037072266131],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//眉山东
			);
			this.dw.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>1153条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			// marker.bindPopup(marker.options.icon.options.data.num)
			marker.on( "click", ( p ) => {
				console.log("眉山东")
			} );
			
			var marker = L.marker([31.462547528530173, 104.7174828677313],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//绵阳
			);
			this.dw.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>1153条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			// marker.bindPopup(marker.options.icon.options.data.num)
			marker.on( "click", ( p ) => {
				console.log("绵阳")
			} );
			
			var marker = L.marker([29.55875858996766, 106.46076030652625],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//重庆
			);
			this.dw.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>3446条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			marker.on( "click", ( p ) => {
				console.log("重庆")
			} );
		}
		if(this.type===3){
			var marker = L.marker([29.577805811925476, 103.46676844965299],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//峨眉山
			);
			this.gd.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>3446条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			marker.on( "click", ( p ) => {
				console.log("峨眉山")
			} );
			
			var marker = L.marker([30.977817546522626, 104.26155667673454],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//广汉
			);
			this.gd.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>3446条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			marker.on( "click", ( p ) => {
				console.log("广汉")
			} );
			
			var marker = L.marker([30.84514474110443, 106.17127589563118],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//南充东
			);
			this.gd.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>3446条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			marker.on( "click", ( p ) => {
				console.log("南充东")
			} );
		}
		if(this.type===4){
			var marker = L.marker([30.068037850015894, 103.82037072266131],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//眉山东
			);
			this.jw.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>1153条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			// marker.bindPopup(marker.options.icon.options.data.num)
			marker.on( "click", ( p ) => {
				console.log("眉山东")
			} );
			var marker = L.marker([30.121153138925596,104.64281496813119],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//资阳
			);
			this.jw.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>2154条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			marker.on( "click", ( p ) => {
				console.log("资阳")
			} );
		}
		if(this.type===5){
			var marker = L.marker([29.577805811925476, 103.46676844965299],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//峨眉山
			);
			this.wz.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>3446条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			marker.on( "click", ( p ) => {
				console.log("峨眉山")
			} );
			
			var marker = L.marker([31.462547528530173, 104.7174828677313],{icon:L.icon( {
								  iconSize: [30, 30],
								  // html:"hahaha",
								  iconUrl:wicon,
										data: {
											num:3773,
										},
									} )}).addTo(
			  this.map//绵阳
			);
			this.wz.push(marker)
			marker.bindPopup(`<div style="color:#0194cb; text-align:center" class="zh-size"><h2>1153条</h2></div><div style="color:#f4f4f4; text-align:center">施工条目数(二级)</div>`,{className:'mypopup'})
			// marker.bindPopup(marker.options.icon.options.data.num)
			marker.on( "click", ( p ) => {
				console.log("绵阳")
			} );
		}
		
	  },
	  
	  
	  
    /* @info  事件处理区-----------------------------------*/
   //  initMap() {
   //    const crs = L.Proj.CRS("EPSG:3857", {
   //      origin: this.mapCenterPoint,
   //      scaleDenominators: this.scaleDenominators
   //    });
   //    //边界
   //    const cornerLeftUp = L.latLng(70, 30);
   //    const cornerRightDown = L.latLng(-10, 175);
   //    const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown);
   //    this.map = L.map(this.$refs.map, {
   //      crs: crs,
   //      center: this.mapCenterPoint, //中心点
   //      maxZoom: this.maxZoom, //最大缩放
   //      minZoom: this.minZoom, //最小缩放
   //      zoom: this.zoom, //默认缩放
   //      maxBounds: bounds, //区域
   //      zoomControl: false, //显示缩放按钮
   //      logoControl: false, //supermap水印
   //      attributionControl: false //水印文本,可以传字符串进行自定义
   //    });
   //    // 载入天地图
   //    L.supermap
   //      .tiledMapLayer(this.baseLayersUrl, {
   //        transparent: true
   //      })
   //      .addTo(this.map);
   //    // 载入四川重庆详细地图
   //    if (this.sccqLayer) {
   //      L.supermap
   //        .tiledMapLayer(this.sccqUrl, {
   //          transparent: true
   //        })
   //        .addTo(this.map);
   //    }
   //    // 载入全国铁路线
   //    if (this.roalLayer) {
   //      L.supermap
   //        .tiledMapLayer(this.lineLayerUrl, {
   //          transparent: true
   //        })
   //        .addTo(this.map);
   //    }
   //    // 地图缩放事件
   //    this.map.on("zoomend", this.onMapZoom);
   //    this.map.on("click", (e) => {
		 //  console.log("@@@")
   //    	console.log(e.latlng)
   //    	// this.geoBufferAnalystProcess(e)
   //    });
	  // // this.geoBufferAnalystProcess()
   //  },
   
   setMarkerClick() {
   	   console.log("1111")
   },
   initMap() {
	   
	   
   	const trainLineUrl = "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine3/rest/maps/RoadLine3"; //铁路线服务
   	// const trainLineUrl = "https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine"; //铁路线服务
   	// const sccqUrl = this.sccqUrlNight; //四川重庆详细地图服务
   	let sccqUrl = ''
   	let isLight = false
   	if (configs.superMap.lightMode === undefined) {
   		isLight = false
   	} else {
   		isLight = configs.superMap.lightMode
   	}
   	if (isLight) {
   		sccqUrl = this.sccqUrlDay
   	} else {
   		sccqUrl = this.sccqUrlNight
   	}
   	// const sccqUrl = configs.superMap.darkMode ? this.sccqUrlNight : this.sccqUrlDay
   	// 第一种方式
   	if (1 === 1) {
   		const mapCenterPoint = this.config.superMap.center || [30.629280172126524, 104.13989732474064]; //成都东
   		// const scaleDenominators = [36978669, 18489335, 9244668, 4622334, 3081556, 2311167, 1540778, 1155583, 770389, 577792,
   		// 	288896, 144448, 72224, 36112, 18056, 9028, 4514, 2257, 1129
   		// ]
   		const scaleDenominators = [36978669, 18489335, 9244668, 4622334, 3081556, 2311167, 1540778, 1155583, 770389, 577792,
   			288896, 144448, 72224, 36112, 18056, 9028, 1129
   		]
   		//自定义坐标系
   		const crs = L.Proj.CRS("EPSG:3857", {
   			origin: mapCenterPoint,
   			scaleDenominators: scaleDenominators,
   		});
   		//边界
   		const cornerLeftUp = L.latLng(70, 30);
   		const cornerRightDown = L.latLng(-10, 175);
   		const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown);
   		this.map = L.map('home-map', {
   			// crs : L.CRS.EPSG4326,//坐标系
   			// crs : L.CRS.EPSG3857,//坐标系
   			crs: crs,
   			center: mapCenterPoint, //中心点
   			minZoom: this.config.superMap.zoomMmin || 1, //最小缩放
   			maxZoom: this.config.superMap.zoomMax || 19, //最大缩放15
   			// zoom: this.config.superMap.zoom || 1, //默认缩放
			zoom:2,
   			maxBounds: this.localBounds || bounds, //边界
   			zoomControl: false, //不显示缩放按钮
   			logoControl: false, //supermap水印
   			attributionControl: false, //水印文本,可以传字符串进行自定义
   		});
   	} else {
   		const mapCenterPoint = this.config.superMap.center || [30.629280172126524, 104.13989732474064]; //成都东
   		const res = [9783.939506249999, 4891.969753124999, 2445.9848765624997, 1222.9924382812499, 815.3282921874999,
   			611.4962191406249, 407.66414609374993, 305.74810957031247, 203.83207304687497,
   			152.87405478515623, 76.43702739257812, 38.21851369628906, 19.10925684814453, 9.554628424072265, 4.777314212036132,
   			2.388657106018066, 1.194328553009033, 0.5971642765045165
   		]
   		const cornerLeftUp = L.latLng(100.8883953, 27.989986699999992);
   		const cornerRightDown = L.latLng(109.76743, 32.339292);
   		const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown);
   		const wmts = L.supermap.wmtsLayer("http://10.192.125.55:8090/iserver/services/map-ugcv5-cdCity3/wmts100", {
   			layer: "cdCity",
   			style: "default",
   			tilematrixSet: "Custom_cdCity",
   			format: "image/png",
   			requestEncodeing: "REST",
   			attribution: ""
   		})
   		// const wmts = L.supermap.wmtsLayer("https://10.192.125.55:8443/iserver/services/map-ugcv5-cdCity2/rest/maps/cdCity2", {
   		// 	layer: "cdCity",
   		// 	style: "default",
   		// 	tilematrixSet: "Custom_cdCity",
   		// 	format: "image/png",
   		// 	requestEncodeing: "REST",
   		// 	attribution: ""
   		// })
   		const crs = L.Proj.CRS("EPSG:3857", {
   			origin: mapCenterPoint,
   			resolutions: res,
   			bounds: this.localBounds || bounds, //边界
   		});
   		this.map = L.map("home-map", {
   			center: mapCenterPoint, //中心点
   			minZoom: this.config.superMap.zoomMmin || 1, //最小缩放
   			maxZoom: this.config.superMap.zoomMax || 15, //最大缩放15
   			// zoom: this.config.superMap.zoom || 6, //默认缩放
			zoom:6,
   			zoomControl: false, //不显示缩放按钮
   			logoControl: false, //supermap水印
   			attributionControl: false, //水印文本,可以传字符串进行自定义
   		});
   	}
   	//注册地图的缩放事件
   this.map.on("zoomend", (e) => {
   		const oldZoom = this.config.superMap.zoom;
   		const newZoom = e.target._zoom;
   		console.log("地图缩放事件:" + oldZoom + " → " + newZoom);
   		if (this.config.superMap.sccq && this.baseLayerVisible == 1) {
   			if (newZoom >= 5) {
   				this.sccqLayer.setOpacity(1);
   
   			} else {
   				this.sccqLayer.setOpacity(0);
   
   			}
   			if (newZoom >= 5) {
   				this.roadSccqLayer.setOpacity(1)
   			} else {
   				this.roadSccqLayer.setOpacity(0)
   			}
   			if (newZoom >= 10) {
   				$('.station-icon-station-name').show()
   			} else {
   				$('.station-icon-station-name').hide()
   			}
   		}
   		this.onMapZoomend(newZoom, oldZoom, e);
   	});
   	// 地图点击事件
   	this.map.on("click", (e) => {
   		console.log("点击坐标", e.latlng)
   		this.handleMapClick(e); //外部调用
   	});
   	// 地图双击事件
   	this.map.on("dblclick", (e) => {});
   	// 地图鼠标移动事件
   	this.map.on("mousemove", (e) => {});
   	// 加载天地图
   	let tdtUrl = ''
   	if (isLight) {
   		tdtUrl = this.qgUrlDay
   	} else {
   		tdtUrl = this.mapUrl
   	}
   	this.baseLayer = L.supermap.tiledMapLayer(this.mapUrl || tdtUrl, {
   		opacity: this.config.superMap.zoom >= 5 ? 0 : 1,
   		transparent: true
   	}).addTo(this.map);
   	// 加载四川重庆详细地图
   	if (this.config.superMap.sccq) {
   		this.sccqLayer = L.supermap.tiledMapLayer(sccqUrl, {
   			opacity: this.config.superMap.zoom >= 5 ? 1 : 0,
   			transparent: true
   		}).addTo(this.map);
   	}
   
   	let tlUrl = ''
   	let tlSccqUrl = ''
   	if (isLight) {
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine4kfknew/rest/maps/RoadLine4@kfknew'
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine5/rest/maps/RoadLine5'
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine3c/rest/maps/RoadLine3c'
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7/rest/maps/RoadLine7'
   		tlUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7a/rest/maps/RoadLine7a'
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7bq2/rest/maps/RoadLine7bq2'
   		// tlSccqUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7b2/rest/maps/RoadLine7b2'
   		tlSccqUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7ac/rest/maps/RoadLine7ac'
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7a/rest/maps/RoadLine7a'
   	} else {
   		// tlUrl = trainLineUrl
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine3c/rest/maps/RoadLine3c'
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7/rest/maps/RoadLine7'
   		// tlSccqUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7b/rest/maps/RoadLine7b'
   		// tlUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7bq1/rest/maps/RoadLine7bq1'
   		tlUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7bq3/rest/maps/RoadLine7bq3'
   		//tlUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7bq2/rest/maps/RoadLine7bq2'
   		// tlSccqUrl = 'https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7bq22/rest/maps/RoadLine7bq2'
   		tlSccqUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7bq22/rest/maps/RoadLine7bq2'
   		// tlSccqUrl = 'https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine7b2/rest/maps/RoadLine7bq2'
   	}
   	// 加载铁路线
   	this.roadQgLayer = L.supermap.tiledMapLayer(this.trainLineUrl || tlUrl, {
   		opacity: this.config.superMap.zoom >= 5 ? 0 : 1,//$vm.config.superMap.zoom >= 5 ? 0 : 1,
   		transparent: true
   	}).addTo(this.map);
   	this.roadSccqLayer = L.supermap.tiledMapLayer(this.trainLineUrl || tlSccqUrl, {
   		opacity: this.config.superMap.zoom >= 5 ? 1 : 0,
   		transparent: true
   	}).addTo(this.map);
   },
   
   
   
    // 地图缩放事件
    onMapZoom(e) {
      const newZoom = e.target._zoom;
      const val = newZoom / 5;
      // const oldCss = C.$(".qiao-sui-other-con").css("transform", "scale(" + val + ")")
    },
    /* @info  数据处理区-----------------------------------*/
    geoBufferAnalystProcess(e) {
      // var point = new SuperMap.LonLat(e.latlng.lng, e.latlng.lat);
      // console.log("latlng", point)
      // // var point = new SuperMap.LonLat(-71.147,42.472);
      // point.transform("EPSG:4326", "EPSG:3857")

      var bufferAnalystService,
        geoBufferAnalystParams,
        resultLayer,
        queryService,
        queryByGeometryParameters,
        resultLayer1;
      var serviceUrl =
        "http://10.194.72.181:8090/iserver/services/spatialAnalysis-TieLuTu-2/restjsr/spatialanalyst";
		 
      bufferAnalystService = L.supermap.spatialAnalystService(serviceUrl);
     
    },
   
   
   
	
	setStationMarkerClick ( param ) {
		
		let stn = param.target.options.icon.options.data;
		console.log( "当前点击站:", stn );
		// this.detailMarker && this.detailMarker.remove(); //删除
		// this.centerMaker( param.latlng, 260, () => {
			let nameDivIcon = L.divIcon( {
				className: 'mypopup2',
				iconSize: [10, 10],
				popupAnchor: [10, 0],
				html: `	<div style="width:280px;height:110px;position: absolute;margin-top: -6px;margin-left: -6px;">
		  	<div style="display: flex;">
		  		<div style="color: #FFFFFF;font-size: 14px;width:65px">施工项目:</div>
		  		<div title="4" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">1</div>
		  	</div>
		  	<div style="display: flex;padding-top: 5px;">
		  		<div style="color: #FFFFFF;font-size: 14px;width:65px">单位:</div>
		  		<div title="3" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">2</div>
		  	</div>
		  	<div style="display: flex;padding-top: 5px;">
		  		<div style="color: #FFFFFF;font-size: 14px;width:65px">施工等级:</div>
		  		<div title="2" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">3</div>
		  	</div>
		  	<div style="display: flex;padding-top: 5px;">
		  		<div style="color: #FFFFFF;font-size: 14px;width:65px" @click=change>公里标：</div>
		  		<div title="1" style="cursor: pointer;color: #ffc335;font-size: 14px;margin-left: 5px;width:200px;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">4</div>
		  	</div>
		  </div>`
			} );
			this.detailMarker = L.marker( param.latlng, {
				icon: mypopup2
			} ).addTo( this.map );
			
			
		// } );
	},
    processFailed(processFailedArgs) {
      console.log("错误", processFailedArgs);
    },
	centerMaker(latlng, diff, cb) {
	  this.map.setView(latlng);
	  setTimeout(() => {
	    let transform = $(".leaflet-pane.leaflet-map-pane")
	      .css("transform")
	      .split(",");
	    transform[5] = parseInt(transform[5].split(")")[0]) + diff + ")";
	    transform = transform.join(",");
	    $(".leaflet-pane.leaflet-map-pane").css("transform", transform);
	    cb();
	  }, 400);
	},
	saveCanvas() {
	  let a = document.createElement("a");
	  const opts = {
	    trainttest: true,
	    useCORS: true
	  };
	  html2canvas(document.body, opts).then(canvas => {
	    let dom = document.body.appendChild(canvas);
	    // dom.style.diaplay = "none";
	    a.style.diaplay = "none";
	    // document.body.removeChild(dom);
	  });
	},
    /* @info  数据交互区-----------------------------------*/
  },
  // 监视属性
  watch: {},
  // 计算属性
  computed: {}
};
</script>

<!-- 私有样式 -->
<style scoped="scoped">
.map-con {
  position: relative;
  width: 100%;
  height: 100%;
  display: inline-block;
  background: #01081b;
}
/* 公共iframe 弹窗口 */
.p-dialog {
  background: #0f1542;
  left: 50%;
  padding-top: 30px;
  position: absolute;
  top: 50%;
  z-index: 800;
}
.el-buttons{
	background: #22415d;
	background-image: url(../imgs/h-speedRailway/ybb.png);
	color: #b9c4d3;
	border:1px solid #126ca0;
	opacity: 1;
	border-radius: 40px;
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}

.button1-1{
	background: #22415d;
	background-image: url(../imgs/h-speedRailway/ybb.png);
	color: #b9c4d3;
	border:1px solid #126ca0;
	opacity: 1;
	border-radius: 40px;
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}
.button1-2{
	background: #126c9e ;
	color: white ;
	font-weight: bold;
	border-radius: 40px;
	opacity: 1;
	border-color: #01a8f9 ;
	background-image: url(../../views/singleScreen/kyz/icons/filters/1.png);
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}

.button2-1{
	background: #22415d;
	background-image: url(../imgs/h-speedRailway/ybb.png);
	color: #b9c4d3;
	border:1px solid #126ca0;
	opacity: 1;
	border-radius: 40px;
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}
.button2-2{
	background: #126c9e ;
	color: white ;
	font-weight: bold;
	border-radius: 40px;
	opacity: 1;
	border-color: #01a8f9 ;
	background-image: url(../../views/singleScreen/kyz/icons/filters/1.png);
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}

.button3-1{
	background: #22415d;
	background-image: url(../imgs/h-speedRailway/ybb.png);
	color: #b9c4d3;
	border:1px solid #126ca0;
	opacity: 1;
	border-radius: 40px;
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}
.button3-2{
	background: #126c9e ;
	color: white ;
	font-weight: bold;
	border-radius: 40px;
	opacity: 1;
	border-color: #01a8f9 ;
	background-image: url(../../views/singleScreen/kyz/icons/filters/1.png);
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}

.button4-1{
	background: #22415d;
	background-image: url(../imgs/h-speedRailway/ybb.png);
	color: #b9c4d3;
	border:1px solid #126ca0;
	opacity: 1;
	border-radius: 40px;
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}
.button4-2{
	background: #126c9e ;
	color: white ;
	font-weight: bold;
	border-radius: 40px;
	opacity: 1;
	border-color: #01a8f9 ;
	background-image: url(../../views/singleScreen/kyz/icons/filters/1.png);
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}

.button5-1{
	background: #22415d;
	background-image: url(../imgs/h-speedRailway/ybb.png);
	color: #b9c4d3;
	border:1px solid #126ca0;
	opacity: 1;
	border-radius: 40px;
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}
.button5-2{
	background: #126c9e ;
	color: white ;
	font-weight: bold;
	border-radius: 40px;
	opacity: 1;
	border-color: #01a8f9 ;
	background-image: url(../../views/singleScreen/kyz/icons/filters/1.png);
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}

.button6-1{
	background: #22415d;
	background-image: url(../imgs/h-speedRailway/ybb.png);
	color: #b9c4d3;
	border:1px solid #126ca0;
	opacity: 1;
	border-radius: 40px;
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}
.button6-2{
	background: #126c9e ;
	color: white ;
	font-weight: bold;
	border-radius: 40px;
	opacity: 1;
	border-color: #01a8f9 ;
	background-image: url(../../views/singleScreen/kyz/icons/filters/1.png);
	background-repeat: no-repeat;
	background-size: cover;
	width: 60px;
	height: 60px;
}


</style>
<!-- 公有样式（会影响全局） -->
<style>
.qiao-sui-other-con {
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  transform-origin: center;
}

.zh-size{
	/* background-color: #0194cb; */
	padding-top: 0px;
	padding-left: 0px;
	white-space: nowrap;
	overflow: hidden;
}
.mypopup2{
	width: 300px;
	height: 130px;
	background-color: #5b3fcc;
	/* bottom: 10px !important; */
	/* offset: -100px -20px; */
	bottom: 10px !important;
	border-radius: 10px;
	/* left: -220px !important; */
/* 	width: 210px;
	height: 105px; */
	/* background: url(../imgs/bigScreen/phone-card.png)no-repeat ; */
	/* background: url(../../views/singleScreen/ajsgdjc/img2/pop2.png)no-repeat; */
	background-size: 100% 100%;
}
.mypopup2 .leaflet-popup-content-wrapper{
	width: 300px;
	height: 130px;
	/* background-color: #880322; */
	
	background: transparent;
	border-radius: 0px;
	box-shadow: none;
}
.mypopup2 .leaflet-popup-tip{
	/* background-color: #5b3fcc; */
	display: none;
	/* margin-top: -10px; */
	/* top: auto; */
}
.mypopup2 .leaflet-popup-content{
	margin-top: 20px;
}

.mypopup{
/* 	width: 150px;
	height: 100px; */
	/* background-color: #0000CC; */
	/* bottom: 10px !important; */
	/* offset: -100px -20px; */
	bottom: -75px !important;
	left: -260px !important;
/* 	width: 210px;
	height: 105px; */
	/* background-image: url(../imgs/bigScreen/phone-card.png); */
	background: url(../../views/singleScreen/ajsgdjc/img2/pop2.png)no-repeat;
	background-size: 250px 140px;
	/* background-size: 100% 100%; */
}
.mypopup .leaflet-popup-content-wrapper{
	width: 250px;
	height: 140px;
	/* background-color: #880322; */
	
	background: transparent;
	border-radius: 0px;
	box-shadow: none;
}
.mypopup .leaflet-popup-content{
	margin-top: 20px;
}
.mypopup .leaflet-popup-close-button{
	margin-right: 15px;
}
.mypopup .leaflet-popup-tip{
	/* background-color: #002a88; */
	display: none;
}

.el-button:active {
    background: #126c9e !important;
    font-weight: bold;
  }
/*按钮悬浮*/
/*  .el-button:hover {
    background: #126c9e !important;
    color: white !important;
    font-weight: bold;
    border-color: #01a8f9 !important;
  } */
  /*按钮点击*/
/* .el-button:focus {
    background: #126c9e ;
    color: white ;
    font-weight: bold;
	opacity: 1;
    border-color: #01a8f9 ;
	background-image: url(../../views/singleScreen/kyz/icons/filters/1.png);
	background-repeat: no-repeat;
	background-size: cover;
  } */

</style>
<style src="../../components/map/css/station.css"></style><!-- 车站 -->
<!-- iconAnchor: i === 0 ? (p2Flag?[0, 13]:[12, 13]) :(p2Flag? [12, 13]:[0, 13]), -->
