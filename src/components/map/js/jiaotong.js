import moment from "moment";
import C from "../../../assets/com.js";
let $vm = null;
export default {
	data: {
        layerDic:{
            danche:null,
            gongjiao:null,
            chuzuche:null,
            ditie:null,
            tingchechang:null,
            wangyueche:null
        },
		jiaotongLayerVisibility: {
            danche:false,//共享单车
			gongjiao: false, //可见性---公交
			chuzuche: false, //可见性---出租车
			ditie: false, //可见性---地铁
			tingchechang: false, //可见性---停车场
            wangyueche:false,//网约车
        },
        iconURL:{
            chuzuche:require("../img/jiaotong/taxi.png"),//出租车
            danche:require("../img/jiaotong/bike.png"),//共享单车
            gongjiao:require("../img/jiaotong/bus.png"),
            ditie:require("../img/jiaotong/metro.png"),
            tingchechang:require("../img/jiaotong/parking.png"),
            wangyueche:require("../img/jiaotong/e-taxi.png"),//网约车
        },
        testDate:{
            chuzuche:["2021-11-14","2021-11-15"],
            ditie:["2022-1-26","2022-1-27"],
            tingchechang:["2022-1-26","2022-1-27"],
            wangyueche:["2021-11-14","2021-11-15"],
            danche:["2022-1-26","2022-1-27"],//共享单车
        },
        iconSize:{
            chuzuche:[27,66],
            gongjiao:[27,66],
            danche:[27,66],
            ditie:[74,33],
            tingchechang:[100,33],
            wangyueche:[27,66],
        },
        latlonField:{
            chuzuche:["lat","lng"],
            ditie:["latitude","longitude"],
            tingchechang:["park_latitude","park_longitude"],
            wangyueche:["latitude","longitude"],
        },
        //数据请求参数，
        //数组下标对应数据类型分别为
        //公交，出租车，地铁，停车场
        dataRequestParameters:{
            //共享单车车辆位置信息
            danche:["0dadebbf741b4403a08feab0c55845b7","ee468103fa3a4136876db7dff281c049","YYYYMMDD","START_pt","END_pt "],
            //公交ETA城市线路
            gongjiao:["0c1a9f6156c44efa920471fb9e4a6a4c","69c45641691b455bb6aa4b00714a79e9","YYYY-MM-DD HH:mm:SS","START_update_time","END_update_time"],
            //出租车定位数据
            chuzuche:["b7a46f51ae014c42ae6b60328945087a","1803f78877c9456a86ca8639ea1f1750","YYYYMMDD","START_pt","END_pt"],
            //地铁站点基础信息
            ditie:["53c3060f6f5640a9a16ad99a223d0202","5578dfe1246f4dd1b524956eae550b78","YYYYMMDD","START_dt_date","END_dt_date"],
            //停车场基础信息
            tingchechang:["4714329b97024fb789c185790be3e1ae","c3cf0939cb7b46e5806f0302e772585f","YYYY-MM-DD HH:mm:SS","START_create_time","END_create_time"],
            //网约车定位数据
            wangyueche:["d3bb90cea36640ff963dfd6c6f6d4d83","fd2186c280df488caf380898530cd351","YYYYMMDD","START_pt","END_pt"],
        },

        keyList:[
            // "gongjiao",
            "chuzuche",
            "ditie",
            "tingchechang",
            "danche",
            "wangyueche"
        ],

        markerIcon:[]
	},
	init(vmParam) {
		if ($vm === null) {
			$vm = vmParam;
		}
		// 供电——设备设施		供电——范围		供电——轨道车
		if (!$vm.config.jiaotong.register) {
			return;
		}
		// 设置默认值
		this.data.jiaotongLayerVisibility.gongjiao = $vm.config.jiaotong.gongjiao;
		this.data.jiaotongLayerVisibility.chuzuche = $vm.config.jiaotong.chuzuche;
		this.data.jiaotongLayerVisibility.ditie = $vm.config.jiaotong.ditie;
		this.data.jiaotongLayerVisibility.tingchechang = $vm.config.jiaotong.tingchechang;
		this.data.jiaotongLayerVisibility.danche = $vm.config.jiaotong.danche;
		this.data.jiaotongLayerVisibility.wangyueche = $vm.config.jiaotong.wangyueche;

		this.getDataList();
	},
	// 地图点击事件
	handleMapClick(e) {

	},
	// 过滤图层元素
	filterLayer(ty) {
        let visibility = false;
        let layerObj = null;
        switch(ty) {
            case "公交":
                visibility = this.data.jiaotongLayerVisibility.gongjiao
                layerObj = this.data.layerDic.gongjiao
                break;
            case "出租车":
                visibility = this.data.jiaotongLayerVisibility.chuzuche
                layerObj = this.data.layerDic.chuzuche
                break;
            case "地铁":
                visibility = this.data.jiaotongLayerVisibility.ditie
                layerObj = this.data.layerDic.ditie
                break;
            case "停车场":
                visibility = this.data.jiaotongLayerVisibility.tingchechang
                layerObj = this.data.layerDic.tingchechang
                break;
            case "共享单车":
                visibility = this.data.jiaotongLayerVisibility.danche
                layerObj = this.data.layerDic.danche
                break;
            case "网约车":
                visibility = this.data.jiaotongLayerVisibility.wangyueche
                layerObj = this.data.layerDic.wangyueche
                break;
        }
        if(layerObj !== null) {
            if(visibility) $vm.map.addLayer(layerObj);
            else $vm.map.removeLayer(layerObj);
        }
	},
	// 创建marker 供电臂

    placeMarker:function(type,data) {
        try {
                if(typeof this.data.layerDic[type] === "undefined") return
                //由于刚刚初始化的图层信息可能为空，因此在这里初始化图标图层
                if(this.data.layerDic[type] === null) {
                    this.data.layerDic[type] = L.layerGroup();
                }
                
                for(let i = 0; i < data.list.length;i++) {
                    let item = data.list[i]

                    let icon = null
                    if(type === "ditie") {
                        icon = L.divIcon({
                            className:"jiaotong-icon-container",
                            data: item,
                            html:`
                            <div style="height:33px;width:auto;position:relative">
                                <div class="jiaotong-marker marker-ditie">
                                    <div class="marker-ditie-text">
                                        ${item.station_name}
                                    </div>
                                </div>
                                <div class="marker-ditie-arrow">
                                </div>
                            </div>
                            `,
                        })
                    }
                    else {
                        icon = L.icon({
                            iconUrl:this.data.iconURL[type],
                            iconSize:this.data.iconSize[type],
                            iconAnchor:[this.data.iconSize[type][0] / 2,this.data.iconSize[type][1]],
                            data: item,
                        })
                    }

                    let marker = L.marker({
                        lon: item[this.data.latlonField[type][1]],
                        lat: item[this.data.latlonField[type][0]]
                    }, {icon:icon});
                    marker.addTo(this.data.layerDic[type]);
            }
        }
        catch(e) {
            console.error(e);
        }
    },

	// 请求交通数据
	getDataList() {
        let requests = this.data.keyList.map((item) => {
            let param = this.data.dataRequestParameters[item]
            let startTime = moment(this.data.testDate[item][0]).format(param[2]) 
            let endTime = moment(this.data.testDate[item][1]).format(param[2])
            return this.requestTTOCData(param[0],param[1],startTime,endTime,param[3],param[4]) 
        })

        //由于TTOC接口的可用性未知，
        //有可能部分接口可用部分不可用，
        //因此这里必须使用allSettled来调用
        //请注意低版本浏览器支持
        //yinwaluo 20220217
        Promise.allSettled(requests)
        .then((r) => {
            // this.data.gongjiaoData = r[0]
            // this.data.cuzucheData = r[1]
            // this.data.ditieData = r[2]
            // this.data.tingchechangData = r[3]
            // this.data.dancheData = r[4]

            r.forEach((result,index) => {
                if(result.status === "fulfilled") {
                    this.placeMarker(this.data.keyList[index],result.value)
                }

                this.filterLayer("公交");
                this.filterLayer("出租车");
                this.filterLayer("共享单车");
                this.filterLayer("网约车");
                this.filterLayer("地铁");
                this.filterLayer("停车场");
            })
        })
        .catch(e => {
            console.log(e);
            // this.$notify.error({
            //     title: '提示',
            //     message: "获取TTOC交通数据失败"
            // });
        })
    },
    
    requestTTOCData:function(whereInfo,orderInfo,startTime,endTime,conditionFieldName1,conditionFieldName2) {
        let condition = {};
        condition[conditionFieldName1] = startTime
        condition[conditionFieldName2] = endTime
        let sqlInfo = {
            uuid:whereInfo,
            condition:condition,
            pageNumber: 1, //页数
            pageSize: 500 //条数
        }

        return new Promise((resolve,reject) => {
            C.getDataP123WithNoStringify({
                c: "kydp_zxy9005",
                s:sqlInfo,
                w:whereInfo,
                o:orderInfo,
                a: "获取TTOC数据",
                url: "https://10.192.126.203/GeneralProServlet", //接口地址
            }, (r) => {
                if (r) {
                    resolve(r)
                } else {
                    reject()
                }
            });
        })
    },
    //请求公交车

    //请求出租车


    //请求地铁站
    //请求停车场
}
