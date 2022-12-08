import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'

import Element from 'element-ui'
import * as echarts from "echarts/lib/echarts";
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont/iconfont.css'

import vuePlugins from "vue-plugins";
import 'vue-plugins/lib/ch.css'

import defaultes from './assets/defaultes.js';//设置一些默认值
// import messageTools from './assets/message.js';//消息
import KPUser from './assets/KPUser';
import webParams from "./assets/webParams";

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import VueKonva from 'vue-konva'

// 自己写的表格打印及导出
import printAndExport from './plugins/printAndExport.js';
import { polyfill } from './assets/polyfill';

import VueTinymce from '@packy-tang/vue-tinymce'
// import tinymce from 'tinymce'
Vue.use(VueTinymce)

// import warp from '@vue/web-component-wrapper'
// import Test from './components/map/js/testWebComponent'
//
// const ele = warp(Vue, Test)
//
// window.customElements.define('ttt-comp', ele)
import webComponentLoader from "@/plugins/webComponentLoader";
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'
webComponentLoader.init()

//兼容低版本浏览器的Promise.allSettled实现。
polyfill();
dayjs.extend(duration)
Vue.use(printAndExport);
Vue.use(Element)
Vue.use(vuePlugins)
Vue.use(VueKonva)
Vue.use(VXETable)
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;
defaultes.init();//设置一些默认值
KPUser.init();//根据登录信息获取用户信息并保存到store
webParams.init().then(() => {
  router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.flag) {//需要登录验证
      // if (to.name === "KPIndex"||to.name==="KPLogin"||to.name==="zk3") {//拦截 客运生产管理系统首页 的直接访问
      //   var KPloginUser = window.sessionStorage.getItem("KPloginUser");
      //   KPloginUser = KPloginUser ? JSON.parse(KPloginUser) : { logined: false };
      //   if (KPloginUser.logined) {//已经登录
      //     if (to.name == "KPLogin") {//目标为登录页面,则跳转到首页
      //       next({ path: '/KPIndex' });
      //     } else {
      //       next();//直接访问
      //     }
      //   } else {
      //     if (to.name == "KPLogin") {//目标为登录页面
      //       next();//直接访问
      //     }else{
      //       var toPath = window.location.hash.split(to.name);
      //       toPath = toPath.length == 1 ? "" : toPath[1].replace("?", "&");//目标有带有参数
      //       router.push('/KPLogin?redirectUrl=' + to.name + toPath);
      //     }
      //   }
      // }else{
      //   next();//直接访问
      // }
      // //取出session
      // var loginUser = window.sessionStorage.getItem("loginUser");
      // loginUser = loginUser?JSON.parse(loginUser):{logined:false};
      // //更新store中的user数据
      // store.dispatch("user/updateUser",loginUser);
      // if(loginUser.logined){//已经登录
      // 	if(to.name=="login"){//目标为登录页面,则跳转到首页
      // 		next({path: '/home'});
      // 	}else{
      // 		next();//直接访问
      // 	}
      // }else{//未登录,则跳转到登录页面
      // 	var toPath = window.location.hash.split(to.name);
      // 	toPath = toPath.length==1?"":toPath[1].replace("?","&");//目标有带有参数
      // 	router.push('/Login?redirectUrl='+to.name+toPath);
      // }
      next();//直接访问
    } else {
      next();//直接访问
    }
  })
});//处理地址栏参数
// messageTools.init();//实例化消息

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
