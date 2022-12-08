import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import COM from '../assets/com.js';
//引入各个store
import userM from './user.js'
import msgM from './msg'
import KPUserM from './KPUser.js'
import kyythM from './kyyth.js'
import lkcjzyM from './lkcjzy.js'//旅客乘降作业专用
import yjEventPush from "./yjEventPush.js";
import earthquake from "@/store/earthquake";
import ajs from "./ajs.js";
import dianwu from './dianwu'

export default new Vuex.Store({
	state: {
		url:"http://10.192.6.177:9090/TRDM/GeneralProServlet",
		globalName: "系统名称",
		//url参数信息
		params: {
			Oid:"111",//			单位---ID
			Oname:"",//			单位---名称
			OnameFull:"",//		单位---全称
			Olevel:"",//		单位---级别
			DepId:"",//			部门---ID
			DepName:"",//		部门---名称
			Deptype:"",//		部门---类型
			StnCode:"",//		站名---略码
			UserEncode:"",//	人员---编码
			UserName:"",//		人员---姓名
			UserPID:"",//		人员---身份证
			UserPosition:"",//	人员---职务
			Positionlevel:"",//	人员---职务等级
			UserMType:"",//		人员---身份
			UserGW:"",//		人员---岗位
			UserID:"",//		人员---ID
			UserTel:"",//		人员---手机
			UserType:"",//		人员---类型
			Control:"",//		其它---控制参数
			CWCode:"",//		其它---财务编码
			ZJCode:"",//		其它---职教代码
			ManagerType:"",//	其它---管理员标志
			MessageID:"",//		其它---管理员ID
			Org_id:"",//		其它---组织机构ID
			Osystem:"",//		其它---系统
			Otype:"",//			其它---机构类型
			// idCard:"",//人员身份证
			// idCardString:"",//人员身份证
			// userpid:"",//人员身份证
		},
		// 全国车站字典
		dicAllStation:[],
		// 全国车站坐标geo
		dicAllStationGEO:{}
	},
	modules: {
		user: userM,
		msg: msgM,
		KPUser:KPUserM,
		kyyth:kyythM,
		lkcjzy:lkcjzyM,
		yjEventPush: yjEventPush,
		earthquake: earthquake,
		ajs: ajs,
		dianwu: dianwu
	},
	mutations: {
		//更新url参数信息
		updateParams(state, payload) {
			state.params = Object.assign(state.params, payload);
		},
		//更新全国客运车站字典
		updateDicAllStation(state, payload) {
			state.dicAllStation = payload;
			const geo = {};
			payload.forEach(item=>{
				geo[item.STN_NAME] = [parseFloat(item.GPS_POINT_X),parseFloat(item.GPS_POINT_Y)];
			});
			state.dicAllStationGEO = geo;
		}
	},
    actions: {
       getDic_gd({commit}, payload){

	   }
    }
})
