/**
 * 在途车消息
 */
import C from "../../../assets/com.js";
var websocket = {
	ipaddress: '10.192.126.174',//消息服务器地址
	port: '8888',//端口
	username: "STODO",
	password: "123", //随便
	// groupId: "8682",
	groupId: "8688",
	groupName: "客运段指挥中心消息",
};
export default{
	socket:null,
	init(opt){
		//页面刷新或者关闭时候加载的事件
		window.onbeforeunload = () => {
			if (this.socket) { //消息服务器打状态为打开
				try {
					this.socket.close();
				} catch (e) {
					window.console.error(e);
				}
			}
		};
		C.$.ajax({
		   url: C.ADDS.url_34_79+"/TRDM/APPGeneralProServlet",
		   success: (msg)=>{
			// OR+本机IP+页面名称
			var nameList = window.location.href.split("?")[0].split("/");
			var name = nameList[nameList.length - 1].replace(/\.html/,"");
			websocket.username = "ORMAP"+(msg.replace(/\./g,""))+name;
			this.openMessage(opt);//初始化消息
		   }
		});
	},
	openMessage(opt){
		const ipaddress = websocket.ipaddress;
		const port = window.location.protocol==="http:"?websocket.port:"9888";
		const username = websocket.username;
		const password = websocket.password;
		const groupId = websocket.groupId;
		const groupName = websocket.groupName;
		const prev = window.location.protocol==="http:"?"ws:":"wss:";
		const websocketUrl = prev + ipaddress + ":" + port + "?username=" + username + "&password=" + password + "&groupId=" +
			groupId + "&groupName=" + groupName;
		//绑定socket实例
		if("WebSocket" in window){
			this.socket = new WebSocket(websocketUrl);
		}else if("MozWebSocket" in window){
			this.socket = MozWebSocket(websocketUrl);
		}else{
			window.alert("浏览器不支持WebSocket");
		}
		// 添加监听连接成功的方法
		this.socket.onopen = function(e) {
			opt.onopen.call(null);
		   console.warn("消息服务器已链接:"+websocket.username)
		};
		//添加监听消息的方法
		this.socket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			// const data = e.data;
			// 防止登录消息
			if(!data.data){
				return;
			}
			const rsObj = JSON.parse(data.data.content);
			// console.log(rsObj)
			// 在途车消息
			if (rsObj.messageTag==="Tag_Kydp_TdcsRunTrainK") {
				//是发给自己的消息
				const train = rsObj.messageData;
				opt.onmessage.call(null,"train",train);
			}
			// 地震消息 EQEH_ADDQUAKE 添加地震消息tag EQEH_UPDATEQUAKE 更新地震消息tag
			if(rsObj.messageTag==="EQEH_ADDQUAKE"||rsObj.messageTag==="EQEH_UPDATEQUAKE"||rsObj.messageTag==="Tag_Earthquake"){
				opt.onmessage.call(null,"earthquake",rsObj.messageData);
			}
			// 手机定位消息
			if(rsObj.messageTag==="Tag_Eqeh_Phone_Location") {
				console.log('接收手机定位消息', rsObj)
				opt.onmessage.call(null, "earthquake_phone", rsObj)
			}
			if(rsObj.messageTag==="Tag_Eqeh_Phone_Call") {
				console.log('接收手机呼入消息', rsObj)
				opt.onmessage.call(null, "earthquake_phone_callin", rsObj)
			}
			if(rsObj.messageTag==="EQEH_URGE_MESSAGE") {
				console.log('接收到应急响应推送', rsObj)
				opt.onmessage.call(null, "yj_event_push", rsObj)
			}
			if(rsObj.messageTag==="Tag_Statis_Update") {
				// console.log('接收到地震大屏数据更新消息', rsObj)
				opt.onmessage.call(null, "earthquake_update", rsObj)
			}
			if(rsObj.messageTag==="Tag_Urge_Plan") {
				console.log('接收到巡线计划更新消息')
				opt.onmessage.call(null, "earthquake_line_train_update", rsObj)
			}
			if(rsObj.messageTag==="Tag_Eqeh_Quick_Report") {
				opt.onmessage.call(null, "earthquake_report_update", rsObj)
			}
		};
		// 添加监听断开连接的方法
		this.socket.onclose = function(event){
			// 如没有业务需要,可以不写这个关闭监听的方法
			// 业务需求,如:聊聊天室,当有人退出时,会提示:xxx退出了
			opt.onclose.call(null);
			console.log("消息已断开",new Date())
		}
	},
	sendMessage(){
		this.socket.send("前台发送的消息");
	}
}
