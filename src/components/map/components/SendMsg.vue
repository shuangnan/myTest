<!-- 
 * @created：	2021年9月15日
 * @author：	
 * @version:	v1.0
 * @desc:		发送消息
 -->
<template>
	<div class="main">
		<div class="left">
			<span class="opt">
				<el-input size="mini" suffix-icon="el-icon-search" placeholder="搜索联系人" v-model="filterTxt"></el-input>
			<!-- 	<el-tooltip content="发起语音对讲" effect="light" style="margin-left:5px;">
					<el-button size="mini" type="primary" class="el-icon-chat-dot-round" @click="initVoice"></el-button>
				</el-tooltip>
				<el-tooltip content="发起视频对讲" effect="light">
					<el-button size="mini" type="primary" class="el-icon-video-play" @click="initVideo"></el-button>
				</el-tooltip> -->
			</span>
			<div class="items">
				<!-- <el-tree ref="popTree" node-key="id" :data="data" @check-change="checkChange" :filter-node-method="filterNode" show-checkbox></el-tree> -->
				
					<ul class="data-list" ref="userRef">
						<template v-for="(item,index) in userData">
							<li> 
							  <div style="display: flex;">
								 <div @click="userCheck(index);">
										 <img  v-if="item.isCheck"  src="../img/checked.png"/>
										 <img  v-else  src="../img/no_check.png"/>
								 </div>
                                 <div @click="userChat(index);" style="margin-left: 30px;" :style="item.nowChat?'color:#409EFF':''">
									 <span style="display: inline-block;width: 80px;">{{item.CC}}</span>
									 <span>{{item.STEWARD_NAME}}</span>
								 </div>
							  </div>
							 </li>
						</template>
					</ul>
				
			</div>
			<!-- <div class="checked-item">
				<el-tag class="tags" size="medium" effect="dark" type="primary" @close="clearChecked(item.id)" closable v-if="!item.children" v-for="(item,i) in checkedItem">{{item.label}}</el-tag>
			</div> -->
		</div>
	<!-- 	<div class="middle" v-if="videoLink">
			<div class="content"></div>
			<div class="opt">
				<el-button type="danger" size="mini" class="el-icon-switch-button" @click="close" round>挂断</el-button>
			</div>			
		</div> -->
		<div class="right">
			<!-- <div class="title">云聊天室<label v-if="checkedItem&&checkedItem.length>0">-{{checkedItem.filter((data)=>typeof data.children=='undefined').length}}人</label></div> -->
			<div ref="msgContent" class="content">
			<div v-for="(item,index) in mgsData.listData" class="msg-d">
				<div v-if="item.msgType==0">
					<div class="d-send-data">
						<div>
							<img src="../img/user-d.png" />
						</div>
						<div class="d-send-user-data"><span>{{item.SEND_NAME}}</span><span class="send-time">{{item.SEND_TIME}}</span>
						</div>
							
					</div>
					<div class="d-msg-info">
						<div class="d-msg-content">
								{{item.CONTENT}}
						</div>
					</div>
					
				</div>
				
				
				<div v-else>
					
					<div class="my-msg-send">
						<div class="my-send-user-data"><span>{{item.SEND_NAME}}</span><span class="send-time">{{item.SEND_TIME}}</span>
						</div>
						<div>
							<img src="../img/user-my.png" />
						</div>
					</div>
					
					<div class="my-msg-content">
						<div class="my-msg-send">
								{{item.CONTENT}}
						</div>
					</div>
					
				</div>
				
			</div>
			
			</div>
			<div class="message">
				
				<el-input type="textarea" v-model="mgsData.msgContent" resize="none" rows="10" @keypress.enter.native="enter"  class="textarea-info"></el-input>
				<el-button class="send" size="mini" type="primary" @click="sendMsg();">发送消息</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	// 这里引用各种资源
	// import InterFace from "../../service/index.js";
	const home = {};
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				
				//所有的数据  当显示用的 TRAIN
				allUserData:[
				],
				
				//用户数据 0 表示对方的信息  1 表示自己的信息
				userData:[
						 // {// 	isCheck:false, 复选 true表示选择了  noName true 表示车次无列车长  msgType 0 对方 1 自己
					// 	nowChat:false, 当前选择的对话框  "CC":"C6116","STEWARD_ID":"2109260818141083627","RUNDATE":"20211026","STEWARD_NAME":"王凌颖"},
				],
				
				mgsData:{
					userIndex:"-1",//聊天序号
					nowUserId:"",//当前选择的用户id
					nowUserName:"",//当前用户名
					msgContent:"",
					listData:[
					]
				},
				
				//当前登录用户信息
				nowUser:{
					userId:"",
					userName:""
				},
				
                filterTxt:'',
				
				socket:null,
				ruleForm:{
					ipaddress:"10.192.125.58",
					port:"8888",
					username:"123456",
					password:"123456",
					groupId:"8688",
					groupName:"客运段调度系统消息发送",
				},
			}
		},
		// 属性
		props:{
			trainList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			selectedTrains: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		// 组件挂载完毕
		mounted() {
			
			// this.initData();
			this.initWebSocket();
			
			
		},
		// 方法
		methods: {
			//选择当前用户
			userCheck(index){
				
				if(this.userData[index].noName){
					this.$message('该车次无列车长用户');
					return ;
				}
				this.userData[index].isCheck=!this.userData[index].isCheck;
			},
			//选择对话聊天
			userChat(index){
				
				if(this.userData[index].noName){
					this.$message('该车次无列车长用户');
					return ;
				}
				this.userData.forEach(function(d,i){
					d.nowChat=false;
					if(index==i){
						d.nowChat=true;
					}
				});
				this.mgsData.userIndex=index;
				
				this.mgsData.nowUserId=this.userData[index].STEWARD_ID;//对话人id
				this.mgsData.nowUserName=this.userData[index].STEWARD_NAME;//对话人name
				
				this.findChatMsg();
				
			},
			
			//查询出双方的聊天记录信息
			findChatMsg(){
				var t=this;
				home.findChatMsg({
					
					// "[['发送方id','接收方id']]"  接收方是自己
					s:[[t.mgsData.nowUserId,t.nowUser.userId]]
				}).then(r => {
					console.log("cahtMsg result："+JSON.stringify(r));
					if (r) {
						var chatData=r[1];
						chatData.forEach(function(d){
							if(d.RECEIVE_ID==t.nowUser.userId){//表示对方发送的消息
								d.msgType="0"
							}else{
								d.msgType="1";
							}
							// {"QUEUE_TAG":"Tag_Kydp_Message","IS_READ":"0","RECEIVE_ID":"2109241426021075865","QUEUE_TOPIC":"KYDP_MESSAGE_TOPIC",
							// "SEND_TIME":"2021-10-27 16:13:14","RECEIVE_NAME":"张晓言","ID":"1453273644410200066",
							// "CONTENT":"测试","RET_FLAG":"0",
							// "SEND_ID":"123","SEND_NAME":"123"
						});
						t.mgsData.listData=chatData;
						t.$nextTick(()=>{
							t.$refs.msgContent.scrollTop = t.$refs.msgContent.scrollHeight;
						});
						
						console.log("xiaoxi:"+t.mgsData.listData);
					} else {
						t.$message('接口错误')
					}
				}, error => {
					t.$message('接口错误aaasas');
					t.$notify.error({
						title: '提示',
						message: '获取聊天对话内容异常'
					})
				});
			},
			//发送消息
			sendMsg(){
				var _this=this;
				
				var nowUser=this.userData[this.mgsData.userIndex].userName;
				var nowUserIndex=this.mgsData.userIndex;
				var msgInfo={
					SEND_NAME:_this.nowUser.userName,
					SEND_TIME:echarts.format.formatTime('yyyy-MM-dd hh:mm:ss',new Date().getTime()),
					msgType:"1",
					CONTENT:this.mgsData.msgContent
				};
				this.mgsData.listData.push(msgInfo);
				
				var  msgContent=this.mgsData.msgContent;
				this.sendMsgData(msgContent,nowUserIndex);
				
				this.mgsData.msgContent="";
				this.$nextTick(()=>{
					this.$refs.msgContent.scrollTop = this.$refs.msgContent.scrollHeight
				});
				
				//循环查找 是否有需要 群发的内容
				this.userData.forEach(function(item,i){
					
					console.log("item:"+JSON.stringify(item));
					if(item.isCheck&&i!=nowUserIndex){
					  //需要群发消息
					   _this.sendMsgData(msgContent,i);
					}
				});
			},
			
			
			//调用接口 
			sendMsgData(msgContent,index){
				var t=this;
				home.sendMsg({
					// "[[发送人id，发送人姓名，内容, 接收人id，接收人姓名 ]]"
					s:[[this.nowUser.userId,this.nowUser.userName,msgContent,this.userData[index].STEWARD_ID,this.userData[index].STEWARD_NAME]]
				}).then(r => {
					if (r) {
					} else {
						this.$message('接口错误')
					}
				}, error => {
					t.$notify.error({
						title: '提示',
						message: '消息发送数据异常'
					})
				});
			},
			
			//初始化websocket信息
			initWebSocket(){
				var t = this,
					socket = this.socket;
				// const ip = t.ruleForm.ipaddress,
				// 	port = t.ruleForm.port,
				// 	username = t.ruleForm.username,
				// 	password = t.ruleForm.password,
				// 	groupId = t.ruleForm.groupId,
				// 	groupName = t.ruleForm.groupName;
					
					
					var ip="10.192.125.58";
					// var ip="10.194.72.11";
					var port="8888";
					var username=new Date().getTime();
					var password="123";
					var groupId="8688";
					var groupName="客运段调度系统";
					
				    socket = new WebSocket("ws:" + ip + ":" + port + "?username=" + username + "&password=" + password + "&groupId=" +
					groupId + "&groupName=" + groupName);
					
					
				    socket.onmessage = function(e) {
					    console.log("接受的消息:"+e.data);
						
						var msgJson=JSON.parse(event.data);
						
						
						try{
							  var msgCon=msgJson.data.content;
							  var receiveId=JSON.parse(msgCon).receiveId;
							  var sendId=JSON.parse(msgCon).sendId;
							  if(receiveId!=undefined&&receiveId==t.nowUser.userId&&t.mgsData.nowUserId==sendId){//收到真实的消息了
							  
							    var msgInfo=JSON.parse(msgCon).content;
								var msgData={
									"SEND_NAME":t.mgsData.nowUserName,
									"CONTENT":msgInfo,
									"msgType":"0",//1表示自己 0 表示对方
									"SEND_TIME":new Date(msgJson.data.createTime).Format("yyyy-MM-dd hh:mm:ss")
								};
								t.mgsData.listData.push(msgData);
								
								t.$nextTick(()=>{
									t.$refs.msgContent.scrollTop = t.$refs.msgContent.scrollHeight;
								});
							  }
							}catch(err){
								console.log("123131"+err);
							}
						
						// "command":11,"data":{"chatType":1,"cmd":11,"content":"{\"is_read\":0,\"queueTopic\":\"KYDP_MESSAGE_TOPIC\",
						// \"ret_flag\":0,\"receiveName\":\"王余阳\",\"sendId\":\"2109241426021075841\",\"sendName\":\"唐健雄\",\"content\":\"好\",
						// \"queueTag\":\"Tag_Kydp_Message\",\"receiveId\":\"2109241426021075853\"}",
						// "createTime":1635409645815,"from":"KydpOneManger","groupId":"8688","id":"262e676158b448b9852f03db84a7884e","msgType":0}}
					}
								
					//连接成功建立的回调方法
					socket.onopen = function () {
						console.log("成功了")
					}

				
			},
			//初始化 页面数据
			initData(){
				var _this=this;
				
				//当前用户信息
				_this.nowUser.userId=this.$store.state.user.STEWARD_ID;
				_this.nowUser.userName=this.$store.state.user.STEWARD_NAME;
				
				
				if(this.selectedTrains.length==0){
					this.$message("请先框选列车信息");
					return ;
				}
				
				var trainDataArray=[];
				_this.selectedTrains.forEach(function(d){
					trainDataArray.push([d.TRAIN,(new Date(d.START_DATE).Format("yyyyMMdd"))]);
					// "LJ_DBM":"W","TRAIN_ID":"119337806","TRAIN_TYPE":"K","CURRNAME":"朝阳湖城际场",
					// "END_DATE":"2021-10-29 09:35:00","BUREAU":"成都局","DDT_DID":"CPT_400068262","START_DATE":"2021-10-29 08:23:00",
					// "LON":"103.44349600003565","ENDNAME":"雅安","TRAIN":"C6607","EDTIME":"1",
					// "STARTNAME":"成都西","TRAIN_LEVEL":"D","LOCAL_FLAG":"1","PASSENGER":"","LAT":"30.169556999877685"},
					// _this.allUserData.push({"trainCc":d.TRAIN,"userName":"列车长","isCheck":false,"nowChat":false,"msgData":[]});
				});
				
				home.findUserByCc({
					//设置参数
					// [[车次，车次开行日期],[车次，车次开行日期]]
					// s:[["C6116","20211026"],["G307","20211027"]],
					s:trainDataArray,
				}).then(r => {
					console.log("查询出结果:"+JSON.stringify(r));
					if (r) {
						r.forEach(function(tu){
							tu.isCheck=false;
							tu.nowChat=false;
							if(tu.STEWARD_ID==undefined){//无列车用户
							    tu.noName=true;	
							}else{
								tu.noName=false;
							}
							 // {"CC":"C6116","STEWARD_ID":"2109260818141083627","RUNDATE":"20211026","STEWARD_NAME":"王凌颖"},
						});
						_this.allUserData=r;
						_this.userData=_this.allUserData;
					} else {
						_this.$message('根据车次获取用户出错');
					}
				}, error => {
					_this.$notify.error({
						title: '提示',
						message: '根据车次获取用户出错'
					});
				});
				
				// {"CC":"C6116","STEWARD_ID":"2109260818141083627","RUNDATE":"20211026","STEWARD_NAME":"王凌颖"},
				// {"CC":"C6116","STEWARD_ID":"2109260817201077213","RUNDATE":"20211026","STEWARD_NAME":"袁乐平"},
				// {"CC":"G310","RUNDATE":"20211026"}]
			},
			
			enter(e){
				e.preventDefault()
				if(this.mgsData.msgContent.length==0){
					return false;
				}else{
					this.sendMsg();
				}
			},
		},
		// 监视属性
		watch: {
			filterTxt(n){
				var resultArray=[];
				this.allUserData.map(function(item){
					if(item.CC.indexOf(n)>-1||(!item.noName&& item.STEWARD_NAME.indexOf(n)>-1)){
						item.isCheck=false;
						item.nowChat=false;
						resultArray.push(item);
					}
				});
				this.mgsData.userIndex="-1";
				this.mgsData.listData=[];
				this.userData=resultArray;
				return resultArray;
			},
			"selectedTrains":{
				handler(val,oldVal){
					this.initData();
				},
				immediate:true
			},
		},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.main{
		width: 100%;
		height:100%;
		overflow: hidden;
		display: flex;
		flex-direction: row;
	}
	
	.main .left{
		width:220px;
		display: flex;
		flex-direction: column;
	}
	.main .left .opt,.main .left .items,.main .left .checked-item{
		background:#2d3a48;
	}
	.main .left .opt{
		display: flex;
		flex-direction: row;
		padding:5px;
	}
	.main .left .items{
		height:100%;
		overflow: auto;
	}
	
	
	.data-list,
	.data-list>li {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.data-list>li {
		padding: 5px 10px;
		color: white;
		border: 1px solid transparent;
	}
	
	.data-list>li:hover,
	.info:hover {
		cursor: pointer;
		background: #354161;
	}
	
	.data-list>li.active,
	.info.active {
		background: #354161;
		border-color: #409EFF;
	}
	
	.main .left .checked-item{
		height: 300px;
		overflow: auto;
		margin-top:5px;
		padding-bottom: 15px;
	}
	.main .left .checked-item .tags:nth-child(1){
		margin-left:15px;
	}
	.main .left .checked-item .tags+.tags{
		margin:15px 0 0 15px;
	}
	/*middle*/
	.main .middle{
		width: 45%;
		margin-left:5px;
		background:#191d28;
		display: flex;
		flex-direction: column;
	}
	.main .middle .content{
		height: 100%;
		overflow: auto;
		padding:15px;
	}
	.main .middle .opt{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		height: 60px;
		padding:5px;
	}
	
	/*right*/
	.main .right{		
		display: flex;
		flex-direction: column;
		margin-left:5px;
		flex: 1;
	}
	.main .right .title,.main .right .content,.main .right .message{
		background:#2d3a48;
	}
	.main .right .title{
		width: 100%;
		height:48px;
		line-height: 48px;
		text-align: center;
	}
	.main .right .content{
		height:100%;
		overflow: auto;
		margin:0 0 5px 0;
		padding:0 15px;
	}
	
	
	
	.content .msg-d{
		margin-top: 10px;
		margin-bottom: 5px;
	}
	.content .msg-d  .d-send-data{
	   display: flex;
	}
	.content .msg-d  .d-send-data .d-send-user-data{
		margin-left: 10px;
		color: #FFFFFF;
	}
	.content .msg-d  .d-send-data .d-send-user-data .send-time{
		margin-left: 5px;
	}
	.content .msg-d .d-msg-info{
	  display: flex;
	  margin-top: -10px;
	}
	.content .msg-d .d-msg-info .d-msg-content{
	   margin-top: 1px;
	   margin-left: 40px;
	   margin-right: 50px;
	   background-color: #FFFFFF;
	   padding: 3px 5px;
	   overflow: auto;
	}
	
	.content .msg-d .my-msg-send{
	  display: flex;
	  justify-content: flex-end;	
	}
	
	.content .msg-d .my-msg-send .my-send-user-data{
		color: #FFFFFF;
		margin-right: 10px;
	}
	.content .msg-d .my-msg-send .my-send-user-data .send-time{
		margin-left: 5px;
	}
	
	.content .msg-d .my-msg-content{
		display: flex;
		margin-top: -10px;
		justify-content: flex-end;
	}
	
	.content .msg-d .my-msg-content  .my-msg-send{
		margin-top: 1px;
		margin-right: 40px;
		background-color: #FFFFFF;
		padding: 3px 5px;
		overflow: auto;
	}
	
	
	.main .right .message{
		height:200px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding:15px;
	}
	.main .right .content .record{
		display: flex;
		flex-direction: column;
	}
	.main .right .content .record .txt{
		display: flex;
		flex-direction: row;
		align-items: center;
		height:24px;
		line-height: 24px;
	}
	.main .right .content .record .txt .time{
		margin-left:15px;
	}
	.main .right .content .record .msg{
		margin:5px 0 15px 5px;
	}
	>>>.textarea-info textarea{
	  height: 100px !important;
	 }
	.main .right .message .send{
		margin: 15px 0 0 0;
		width: 80px;
	}
	.u-self{
		color:#28ffe3;
	}
	.u-other{
		color:#3388ff;
	}
</style>
<!-- 公有样式（会影响全局） -->

