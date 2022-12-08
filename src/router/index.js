import Vue from 'vue'
import VueRouter from 'vue-router'

//引用组件 1 按需加载,会生成对应js
//const a = resolve=>{require(['../views/Component.vue'],resolve)};
//引用组件 2 直接导入,生成到一个js
//import a from "../views/Component.vue";

//引用页面
import Index from '../views/Index.vue'

// 超大屏页面
const bigScreenTemp = resolve=>{require(['../views/bigScreen/temp/Temp.vue'],resolve)};//带鱼屏界面框架-集装箱版
const bigScreenTemp2 = resolve=>{require(['../views/bigScreen/temp/Temp2.vue'],resolve)};//带鱼屏界面框架-客运站版本
const bsKyd = resolve=>{require(['../views/bigScreen/kyd/Index.vue'],resolve)};//客运段大屏
const bsKyz = resolve=>{require(['../views/bigScreen/kyz/Index.vue'],resolve)};//客运站大屏
const bsKyd2 = resolve=>{require(['../views/bigScreen/kyd2/Index.vue'],resolve)};//客运段大屏2.0
const zycwdjsc = resolve=>{require(['../views/bigScreen/zycwd/Index.vue'],resolve)};//遵义车务段客运数据驾驶舱

// const GDZY  = resolve=>{require(['../views/bigScreen/kyd2/GDZY.vue'],resolve)};//股道占用
const GXQYSZ  = resolve=>{require(['../views/mapTools/gjwhzd/areaSelect.vue'],resolve)};//管辖区域设置
const GXQYSZCS  = resolve=>{require(['../views/mapTools/gjwhcs/areaSelect.vue'],resolve)};//管辖区域设置
const JiaoTongLine  = resolve=>{require(['../views/mapTools/JiaoTongLine.vue'],resolve)};//交通线路维护
const RailWayLine  = resolve=>{require(['../views/mapTools/RailWayLine.vue'],resolve)};//铁路线段维护
const PoliceData  = resolve=>{require(['../views/singleScreen/police/PoliceData.vue'],resolve)};//公安数据维护

// 单屏大数据
const single_kyz = resolve=>{require(['../views/singleScreen/kyz/Index.vue'],resolve)};//客运站生产指挥中心

const single_kyd = resolve=>{require(['../views/singleScreen/kyd/home1.vue'],resolve)};//客运段生产指挥中心

const xx = resolve=>{require(['../views/singleScreen/ajsgdjc/dongdialog.vue'],resolve)};

// 地图
const MapKY = resolve=>{require(['../assets/map/MapKY.vue'],resolve)};//客运地图mapTest
const mapTest = resolve=>{require(['../assets/map/mapTest.vue'],resolve)};//客运地图mapTest
const MapWxICW = resolve=>{require(['../assets/map/MapWxICW.vue'],resolve)};//成都东卫星图
const test = resolve=>{require(['../components/map/test.vue'],resolve)};//地图mapTest

const cdjl = resolve=>{require(['../views/cdjl/cdjl'], resolve)}
const reports = resolve=>{require(['../views/reports/reports'], resolve)}

const earthquake  = resolve=>{require(['../views/earthquake/Index.vue'],resolve)};//地震管理
const kygl  = resolve=>{require(['../views/singleScreen/kygl/Index.vue'],resolve)};//公安(铁路网)
const police  = resolve=>{require(['../views/singleScreen/police/Index.vue'],resolve)};//公安(公安网)
const ajsgdjc  = resolve=>{require(['../views/singleScreen/ajsgdjc/Index.vue'],resolve)};//安监室对轨道检测数据
const yjzbryxx  = resolve=>{require(['../views/singleScreen/yjzby/IndexMini.vue'],resolve)};//应急值班人员信息
const yjddInfo = resolve=>{require(['../views/singleScreen/yjddInfo/IndexMini.vue'],resolve)};
const dfyjInfo = resolve=>{require(['../views/singleScreen/dfyj/Index.vue'],resolve)};

const exportReport = resolve=>{require(['../views/exportReport/index.vue'],resolve)}

const pxt = resolve=>{require(['../views/gwPxt/index.vue'],resolve)};
// 公共组件
const FutureWeather  = resolve=>{require(['../components/map/components/FutureWeather.vue'],resolve)};////未来天气
const QiaoSuiInfo  = resolve=>{require(['../components/map/components/QiaoSuiInfo.vue'],resolve)};////桥隧
const TrainTravelInfo  = resolve=>{require(['../components/map/components/TrainTravelInfo.vue'],resolve)};////列车信息
const TrainJLInfo  = resolve=>{require(['../components/map/components/TrainJlLine.vue'],resolve)};////交路信息
const EarthquakeEffectDiagram = resolve=>{require(['../views/EarthquakeEffectDiagram/Index.vue'],resolve)};

const MapConfig  = resolve=>{require(['../views/MapConfig.vue'],resolve)};//聚合地图配置
const ajsConfig = resolve=>{require(['../views/singleScreen/ajsgdjc/config.vue'],resolve)};//安监室数据大屏配置
// const policeMainData = resolve=>{require(['../views/singleScreen/police/components/policeMainData.vue'],resolve)};

const showUploadPics = resolve=>{require(['../views/showUploadPics/index.vue'],resolve)}

Vue.use(VueRouter);

// 信息技术所
const params_xxs = "UserName=测试员&UserEncode=ue123&UserPID=10000000000000000X&Oid=99990002001499A50004&Oname=信息技术所&DepId=23012134BF4A1580E053BC04C00A22C4&DepName=软件开发一科&StnCode=";
const params_xxs1 = "UserName=测试员&UserEncode=ue123&UserPID=10000000000000000X&Oid=19B8C3534E125665E0539106C00A58FD&Oname=成都车站&StnCode=ICW";
const params_xxs3 = "UserEncode=AC0536179C8A0665E0534720C00A107E&UserName=王余阳&UserPID=500243199602281736&Oid=99990002001499A50004&Oname=信息技术所&DepId=99990002001499A50004&DepName=研发一室&UserMType=客运段管理员&Olevel=3&Deptype=4";
const params_xxs4 = "UserName=测试员&UserEncode=ue123&UserPID=10000000000000000X&Oid=99990002001499A50004&Oname=信息技术所&DepId=99990002001499A50004000A&DepName=研发一室&StnCode=";

const routes = [
	// {g:"",t:"",path: '/',name: 'Index',component: Index,meta:{flag:false,isMenu:false,params:""}},
	// {g:"其他",t:"股道占用",path: '/GDZY',name: 'GDZY',component: GDZY,meta:{flag:false,isMenu:true,params:params_xxs}},
	{g:"工具",t:"管界维护",path: '/GXQYSZ',name: 'GXQYSZ',component: GXQYSZ,meta:{flag:false,isMenu:true,params:params_xxs}},
	{g:"工具",t:"客运管界维护",path: '/GXQYSZCS',name: 'GXQYSZCS',component: GXQYSZCS,meta:{flag:false,isMenu:true,params:params_xxs4}},
	{g:"工具",t:"交通线路维护",path: '/JiaoTongLine',name: 'JiaoTongLine',component: JiaoTongLine,meta:{flag:false,isMenu:true,params:""}},
	{g:"工具",t:"铁路线段维护",path: '/RailWayLine',name: 'RailWayLine',component: RailWayLine,meta:{flag:false,isMenu:true,params:""}},
	{g:"工具",t:"公安数据维护",path: '/PoliceData',name: 'PoliceData',component: PoliceData,meta:{flag:false,isMenu:true,params:"Oid=99990002001499A50004&Oname=信息技术所"}},
    {g:"",t:"",path: '/pageList',name: 'pageList',component: Index,meta:{flag:false,isMenu:false,params:""}},

	{g:"带鱼屏",t:"带鱼屏框架(集装箱版)",path: '/bigScreenTemp',name: 'bigScreenTemp',component: bigScreenTemp,meta:{flag:false,isMenu:true,params:params_xxs}},
	{g:"带鱼屏",t:"带鱼屏框架(站运站版)",path: '/bigScreenTemp2',name: 'bigScreenTemp2',component: bigScreenTemp2,meta:{flag:false,isMenu:true,params:params_xxs}},
	{g:"带鱼屏",t:"客运段大屏",path: '/bsKyd',name: 'bsKyd',component: bsKyd,meta:{flag:true,isMenu:true,params:""}},
	{g:"带鱼屏",t:"客运站大屏",path: '/bsKyz',name: 'bsKyz',component: bsKyz,meta:{flag:true,isMenu:true,params:params_xxs}},
	{g:"带鱼屏",t:"客运段大屏2.0",path: '/bsKyd2',name: 'bsKyd2',component: bsKyd2,meta:{flag:true,isMenu:true,params:params_xxs}},


	// {g:"生产指挥中心大屏",t:"客运段生产指挥中心",path: 'http://10.192.34.58:8080/PDMS_V/dist/#/homeX',name: 'otherWeb',meta:{flag:true,isMenu:true,params:params_xxs3}},
	{g:"生产指挥中心大屏",t:"客运段生产指挥中心",path: '/single_kyd',name: 'single_kyd',component: single_kyd,meta:{flag:true,isMenu:true,params:params_xxs3}},
	{g:"生产指挥中心大屏",t:"客运站生产指挥中心(成都车站)",path: '/single_kyz',name: 'single_kyz',component: single_kyz,meta:{flag:true,isMenu:true,params:params_xxs1}},
	{g:"生产指挥中心大屏",t:"客运站生产指挥中心(信息所)",path: '/single_kyz2',name: 'single_kyz2',component: single_kyz,meta:{flag:true,isMenu:true,params:params_xxs3}},
	{g:"生产指挥中心大屏",t:"遵义车务段客运数据驾驶舱",path: '/zycwdjsc',name: 'zycwdjsc',component: zycwdjsc,meta:{flag:true,isMenu:true,params:""}},
	{g:"生产指挥中心大屏",t:"地震应急管理",path: '/earthquake',name: 'earthquake',component: earthquake,meta:{flag:true,isMenu:true,params:params_xxs3}},
	{g:"生产指挥中心大屏",t:"警用地理信息系统(路网)",path: '/kygl',name: 'kygl',component: kygl,meta:{flag:true,isMenu:true,params:params_xxs3}},
	{g:"生产指挥中心大屏",t:"警用地理信息系统(安网)",path: '/police',name: 'police',component: police,meta:{flag:true,isMenu:true,params:params_xxs3}},
	{g:"生产指挥中心大屏",t:"车底交路图",path: '/cdjl', name: 'cdjl', component: cdjl, meta: {flag: true, isMenu: true,params: params_xxs3}},
	{g:"生产指挥中心大屏",t:"安监室对轨道检测数据",path: '/ajsgdjc', name: 'ajsgdjc', component: ajsgdjc, meta: {flag: true, isMenu: true,params: params_xxs3}},
	{g:"生产指挥中心大屏",t:"安监室对轨道检测数据配置",path: '/ajsConfig', name: 'ajsConfig', component: ajsConfig, meta: {flag: true, isMenu: true,params: params_xxs3}},
	{g:"生产指挥中心大屏",t:"应急值班人员信息",path: '/yjzbryxx', name: 'yjzbryxx', component: yjzbryxx, meta: {flag: true, isMenu: true,params: params_xxs3}},
	{g:"生产指挥中心大屏",t:"应急调度信息",path: '/yjddinfo', name: 'yjddinfo', component: yjddInfo, meta: {flag: true, isMenu: true, params: params_xxs3}},
	{g:"生产指挥中心大屏",t:"地方应急人员通讯录",path: '/dfyjinfo', name: 'dfyjinfo', component: dfyjInfo, meta: {flag: true, isMenu: true, params: params_xxs3}},
	// {g:"生产指挥中心大屏",t:"警方主要数据",path: '/policeMainData', name: 'policeMainData', component: policeMainData, meta: {flag: true, isMenu: true, params: params_xxs3}},
	//
	{g:"地图",t:"地图测试页面",path: '/xx',name: 'xx',component: xx,meta:{flag:true,isMenu:true,params:params_xxs}},
	{g:"地图",t:"地图测试页面",path: '/MapKY',name: 'MapKY',component: MapKY,meta:{flag:true,isMenu:true,params:params_xxs}},
	{g:"地图",t:"地图测试页面",path: '/mapTest',name: 'mapTest',component: mapTest,meta:{flag:true,isMenu:true,params:params_xxs}},
	{g:"地图",t:"地图测试页面",path: '/test',name: 'test',component: test,meta:{flag:true,isMenu:true,params:params_xxs}},
	{g:"地图",t:"聚合地图配置(信息所)",path: '/MapConfig',name: 'MapConfig',component: MapConfig,meta:{flag:true,isMenu:true,params:"Oid=99990002001499A50004&Oname=信息技术所"}},
	{g:"地图",t:"聚合地图配置(成都车站)",path: '/MapConfig2',name: 'MapConfig2',component: MapConfig,meta:{flag:true,isMenu:true,params:"Oid=19B8C3534E125665E0539106C00A58FD&Oname=成都车站"}},
	{g:"地图",t:"聚合地图配置(调度所应急)",path: '/MapConfig3',name: 'MapConfig3',component: MapConfig,meta:{flag:true,isMenu:true,params:"Oid=99990002001499A50004&Oname=信息技术所&sys=yjxy"}},
	{g:"地图",t:"聚合地图配置(公安)",path: '/MapConfig4',name: 'MapConfig4',component: MapConfig,meta:{flag:true,isMenu:true,params:"Oid=99990002001499A50004&Oname=信息技术所&sys=police"}},
	{g:"地图",t:"卫星地图(成都东)",path: '/MapWxICW',name: 'MapWxICW',component: MapWxICW,meta:{flag:true,isMenu:true,params:""}},
	{g:"生产指挥中心大屏",t:"应急速报导出",path: '/ExportReport',name: 'exportReport',component: exportReport,meta:{flag:true,isMenu:true,params:""}},

	{g:"其它",t:"未来天气",path: '/FutureWeather',name: 'FutureWeather',component: FutureWeather,meta:{flag:true,isMenu:true,params:""}},
	{g:"其它",t:"桥隧信息",path: '/QiaoSuiInfo',name: 'QiaoSuiInfo',component: QiaoSuiInfo,meta:{flag:true,isMenu:true,params:""}},
	{g:"其它",t:"列车信息",path: '/TrainTravelInfo',name: 'TrainTravelInfo',component: TrainTravelInfo,meta:{flag:true,isMenu:true,params:""}},
	{g:"其它",t:"交路信息",path: '/TrainJLInfo',name: 'TrainJLInfo',component: TrainJLInfo,meta:{flag:true,isMenu:true,params:"jlcid=110246467&whiteFlag=1"}},
	{g:"其它",t:"报表",path: '/Reports',name: 'Reports',component: reports,meta:{flag:true,isMenu:true,params:""}},
	{g:"其它",t:"地震影响范围示意图",path: '/EarthquakeEffectDiagram',name: 'EarthquakeEffectDiagram',component: EarthquakeEffectDiagram,meta:{flag:true,isMenu:true,params:""}},
	{g:"其它",t:"上传图片查看",path: '/ShowUploadPics',name: 'ShowUploadPics',component: showUploadPics,meta:{flag:true,isMenu:true,params:params_xxs3}},
	{g:"其它",t:"查看管辖范围图",path: "/pxt", name: 'pxt', component: pxt, meta:{flag: true, isMenu: false, params: params_xxs1}},

	{g:"生产指挥中心大屏",t:"应急速报导出",path: '/ExportReport',name: 'exportReport',component: exportReport,meta:{flag:true,isMenu:true,params:""}},

]

const router = new VueRouter({
	routes
});

export default router
