import C from "./com.js"
var websocket = {
	// ipaddress: '10.192.125.58',//消息服务器地址
	ipaddress: '10.194.72.11',//消息服务器地址
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
		   url: "http://10.192.34.79/TRDM/APPGeneralProServlet",
		   success: (msg)=>{
			// OR+本机IP+页面名称
			var nameList = window.location.href.split("?")[0].split("/");
			var name = nameList[nameList.length - 1].replace(/\.html/,"");
			websocket.username = "OR"+(msg.replace(/\./g,""))+name;
			this.openMessage(opt);//初始化消息
		   }
		});
	},
	openMessage(opt){
		const ipaddress = websocket.ipaddress;
		const port = websocket.port;
		const username = websocket.username;
		const password = websocket.password;
		const groupId = websocket.groupId;
		const groupName = websocket.groupName;
		const websocketUrl = "ws:" + ipaddress + ":" + port + "?username=" + username + "&password=" + password + "&groupId=" +
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
		   console.warn("消息服务器已链接:"+websocket.username)
		};
		//添加监听消息的方法
		this.socket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			// const data = e.data;
			if(!data.data){
				return;
			}
			const rsObj = JSON.parse(data.data.content);
			if (rsObj.messageTag==="Tag_Kydp_TdcsRunTrainK") {
				//是发给自己的消息
				const train = rsObj.messageData;
				// console.log("收到列车状态消息webSocket:",train)
				opt.onmessage.call(null,train);
			}
			
			// {
			//     "messageTag": "Tag_Kydp_TdcsRunTrainK", //消息标签
			//     "messageData": { //消息内容
			//         "LJ_DBM": "W",
			//         "TRAIN_ID": "119261566",
			//         "TRAIN_TYPE": "K",
			//         "CURRNAME": "蓬溪",
			//         "END_DATE": "2021-10-12 18:43:00",
			//         "BUREAU": "成都局",
			//         "START_DATE": "2021-10-12 16:08:00",
			//         "LON": "105.70224210018574",
			//         "ENDNAME": "",
			//         "TRAIN": "0Y406",
			//         "EDTIME": "0",
			//         "STARTNAME": "",
			//         "TRAIN_LEVEL": "K",
			//         "LOCAL_FLAG": "0",
			//         "PASSENGER": "",
			//         "LAT": "30.681804000127652"
			//     }
			// }
		};
		// 添加监听断开连接的方法
		this.socket.onclose = function(event){
			// 如没有业务需要,可以不写这个关闭监听的方法
			// 业务需求,如:聊聊天室,当有人退出时,会提示:xxx退出了
		}
	},
	sendMessage(){
		this.socket.send("前台发送的消息");
	}
}