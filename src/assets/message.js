import $ from "jquery";
let ms = {
	linkCount: 1, //消息链接次数
	hostPortIndex: 0,
	client: null,
	isLink: false,
	hostPortS: [{
		host: "10.192.126.174",
		port: "63167", //10.192.34.167-169
	}],
	path: "/mqtt",
	clientId: "ZBS2001008689", //客户端id
	topic: "", //对应广播队列 用逗号分隔
	useSSL: false,
	msgTipInterval: null,
	msgTipTime: 1
};
if (process.env.NODE_ENV == "development") { //开发环境
	// ms.hostPort = [{
	// 	host: "10.192.34.225",
	// 	port: "61614"
	// }];
	ms.hostPort = [{
		host: "10.192.34.167",
		port: "61614"
	}, {
		host: "10.192.34.168",
		port: "61614"
	}, {
		host: "10.192.34.169",
		port: "61614"
	}];
} else {
	ms.hostPort = [{
		host: "10.192.34.167",
		port: "61614"
	}, {
		host: "10.192.34.168",
		port: "61614"
	}, {
		host: "10.192.34.169",
		port: "61614"
	}];
	if (window.location.host.includes("6.155") || window.location.host.includes("6.110")) {
		ms.hostPort = [{
			host: "10.192.34.225",
			port: "61614"
		}];
	}

}
// window.console.log("消息地址", ms.hostPort);
let _temp = null,_tempOpt=null;
export default {
	init(opt) {
		ms.topic = opt.topic;
		_tempOpt=opt;
		_temp = this;
		//页面刷新或者关闭时候加载的事件
		window.onbeforeunload = () => {
			if (ms.isLink) { //消息服务器打状态为打开
				try {
					this.breakMQ(); //关闭消息接口
				} catch (e) {
					window.console.error(e);
				}
			}
		};
		var nameList = window.location.href.split("?")[0].split("/");
		var name = nameList[nameList.length - 1].replace(/\.html/, "");
		var host = window.location.host;
		let origin = window.location.origin;
		var url = origin + "/TRDM/APPGeneralProServlet";
		if (origin.includes("https")) {
			ms.useSSL = true;
			ms.hostPort = ms.hostPortS;
		}
		if (process.env.NODE_ENV == "development") {
			url = "https://10.192.6.179/TRDM/APPGeneralProServlet";
		}
		$.ajax({
			type: "post",
			url: url,
			async: true, //异步的:默认：false（同步）(按顺序执行，等待此方法调用完成以后才执行之后的程序)
			success: function(r) {
				r = r.replace(/\./g, "");
				ms.clientId = "JFLCMSMAP_" + r + name;
				window.console.log("消息连接客户端id", ms.clientId);
				_temp.initPageMsg();
			},
			error: function() {

			}
		});
	},
	initPageMsg() {
		//循环判断是否已经加载消息服务器 否则 3S 重连
		var _this = this;
		// setInterval(function () {
		if (!ms.isLink) { //消息未链接
			if (ms.linkCount <= 1) { //自动重连3次
				window.console.warn("消息已断开，正在第 " + ms.linkCount + " 次尝试链接" + ms.hostPort[ms.hostPortIndex].host + " " + Number(ms.hostPort[
					ms.hostPortIndex].port))
				ms.linkCount++;
				_this.doOpenMQ();
			} else {
				ms.hostPortIndex++; //更换服务地址与端口
				ms.linkCount = 1; //更换服务地址时重置链接次数
				if (ms.hostPortIndex == ms.hostPort.length) {
					ms.hostPortIndex = 0;
					if (!ms.msgTipInterval) {
						_this.msg_tipDialog();
					}
				}
				_this.initPageMsg();
			}
		} else {
			ms.linkCount = 1;
		}
	},
	breakMQ() {
		ms.client.disconnect();
	},
	//连接消息服务器
	doOpenMQ() {
		var Paho = window.Paho;
		ms.client = new Paho.MQTT.Client(ms.hostPort[ms.hostPortIndex].host, Number(ms.hostPort[ms.hostPortIndex].port), ms.path,
			ms.clientId);
		ms.client.startTrace();
		ms.client.onConnectionLost = this.onConnectionLost;
		ms.client.onMessageArrived = (msgObj)=>{
			try{
				var msg = JSON.parse(msgObj.payloadString);
				_tempOpt.onmessage.call(null,msg,msgObj.destinationName);
			}catch(e){
				console.error("消息处理错误:",e);
			}
		}
		// connect the client
		ms.client.connect({
			useSSL: ms.useSSL, //https 用wss连接
			onSuccess: () => this.onConnect(this),
			onFailure: this.onFailure,
			keepAliveInterval: 30,
		});
	},
	//连接成功
	onConnect() {
		this.doSubscribe(); //订阅
		ms.isLink = true;
		window.console.warn("消息服务器已连接！" + ms.hostPort[ms.hostPortIndex].host + ":" + ms.hostPort[ms.hostPortIndex].port);
		clearTimeout(ms.msgTipInterval);
		ms.msgTipInterval = null;
	},
	//连接丢失
	onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			ms.isLink = false;
			window.console.error("消息服务器已断开！");
			_temp.initPageMsg();
		}
	},
	//连接失败
	onFailure() {
		ms.isLink = false;
		_temp.initPageMsg();
	},
	doSubscribe() {
		ms.client.subscribe(ms.topic, {
			qos: 0,
			onSuccess: this.onSubscribeSuccess,
			onFailure: this.onSubscribeFail
		});
	},
	// 订阅成功
	onSubscribeSuccess() {},
	// 订阅失败
	onSubscribeFail() {
		window.console.log("Fail to Subscribe topic.");
	},
	msg_tipDialog() {
		if (!ms.isLink) {
			$("body").append(
				'<div id="msgTipDialogRT" style="z-index:999999;position:absolute;right:10px;top:10px;padding:20px 40px;background:#000000bd;color:#f0945f">消息连接异常！请确认网络情况 以及 当前页面是否打开多个</div>'
			)
			setTimeout(() => {
				$("#msgTipDialogRT").remove();
			}, 7000);
			ms.msgTipInterval = setTimeout(() => {
				this.msg_tipDialog();
			}, ms.msgTipTime * 1000 * 60);
		}
	}
}
