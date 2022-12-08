<template>
	<div style="width:100%;height: 100%;padding: 5px;overflow: hidden;">
		<!-- <el-image :src="bg"></el-image> -->
		<div class="content">
			<div class="top-panel">
				<div class="left box">
					<div class="memo">
						<span>
							<el-image class="trainImg" :src="trainImg"></el-image>
							<label class="cc">{{a.TRAIN}}</label>
						</span>
						<span>
							<label class="sfzd">{{a.START_STN}} - {{a.END_STN}}</label>
							<label class="kyd">{{b.DEPART}}</label>
						</span>
					</div>
					<div class="space"></div>
					<div class="detail">
						<span><label>始发时间：</label><label class="time">{{a.START_DATE}}</label></span>
						<span><label>运行区间：</label><label class="qj">-</label></span>
						<span v-if="parseInt(a.EDTIME)>0"><label>运行状态：</label><label class="wd">{{'晚点'+a.EDTIME+'分钟'}}</label></span>
						<span v-else-if="parseInt(a.EDTIME)==0"><label>运行状态：</label><label class="zc">正常运行</label></span>
						<span v-else><label>运行状态：</label><label class="zc">-</label></span>
						<span><label>列车长：</label><label>{{b.STEWARD_NAME}}</label></span>
						<span v-if="b.PHONE"><label class="el-icon-phone">{{b.PHONE}}</label><label class="el-icon-phone">{{b.GSM_R}}</label></span>
					</div>
				</div>
				<div class="right box">
					<ul ref="timeline" class="timeline">
						<li v-for="(item,index) in c" class="timeline-item">
							<div class="content">{{item.TASK_NAME}}</div>
							<template v-if="item.STATUS==='0'">
								<div v-if="item.TIMEOUT>0" class="node time el-icon-check"></div>
								<div v-else class="node undo el-icon-check"></div>
							</template>
							<div v-else class="node done el-icon-check"></div>
							<div class="line"></div>
							<div class="timestamp">{{formatTime(item.S_TIME)}}</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="middle">
				<div class="box">
					<label class="sec-title">保洁打分</label>
					<el-table style="width:100%;" height="300" size="mini" :data="d" :border="false" :highlight-current-row="false">
						<el-table-column label="车号" align="center" prop="TRAIN_UNDER"></el-table-column>
						<el-table-column label="车次" align="center" prop="CC"></el-table-column>
						<el-table-column label="保洁类型" align="center" prop="TYPE"></el-table-column>
						<el-table-column label="考核扣分" align="center" prop="SCORE"></el-table-column>
						<el-table-column label="班组" align="center" prop="CLASS_NAME"></el-table-column>
						<el-table-column label="时间" align="center" prop="CREATE_TIME"></el-table-column>
					</el-table>
				</div>
				<div class="box">
					<label class="sec-title">保洁打分</label>
					<el-table style="width:100%;" height="300" size="mini" :data="e" :border="false" :highlight-current-row="false">
						<el-table-column label="车型" align="center" prop="TRAIN_MODEL"></el-table-column>
						<el-table-column label="车队" align="center" prop="TRAIN_TEAM"></el-table-column>
						<el-table-column label="班组" align="center" prop="CLASS_NUM"></el-table-column>
						<el-table-column label="车次" align="center" prop="TRAIN_NUM"></el-table-column>
						<el-table-column label="签收人" align="center" prop="PROPOSER"></el-table-column>
						<el-table-column label="签收状态" align="center" prop="statu">
							<template slot-scope="{row}">
								<span style="color: darkred;">签收成功</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="bottom">
				<div class="bz box">
					<label class="sec-title">编组</label>
					<el-table style="width:100%;" height="300" size="mini" :data="bz" :border="false" :highlight-current-row="false">
						<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
						<el-table-column label="车厢类型" align="center" prop="CZ"></el-table-column>
						<el-table-column label="车厢编号" align="center" prop="CLH"></el-table-column>
						<el-table-column label="定员" align="center" prop="DY"></el-table-column>
						<!-- <el-table-column label="职乘人员" align="center" prop="zcry"></el-table-column> -->
						<el-table-column label="车型" align="center" prop="CX"></el-table-column>
					</el-table>
				</div>
				<div class="cs box">
					<label class="sec-title">餐售</label>
					<div id="cs-charts" style="width:100%;height:300px;"></div>
				</div>
				<div class="klfx box">
					<label class="sec-title">客流分析</label>
					<div id="klfx-charts" style="width:100%;height:300px"></div>
				</div>
			</div>
		</div>
		<el-dialog
		  :title="titleOfCS"
		  :visible.sync="dialogVisible"
		  width="600px" :append-to-body="true">
		  <el-table style="width:100%;" height="400" size="mini" :data="detailCS" :border="false" :highlight-current-row="false">
		  	<el-table-column label="订单时间" align="center" prop="C_TIME"></el-table-column>
		  	<el-table-column label="商品类型" align="center" prop="MAT_NAME"></el-table-column>
		  	<el-table-column label="数量" align="center" prop="MAT_QTY"></el-table-column>
		  	<el-table-column label="金额(元)" align="center" prop="AMOUNT"></el-table-column>
		  </el-table>
		</el-dialog>
	</div>
</template>
<style scoped="scoped">
	.box{
		border: 10px solid rgba(28,36,59, .7);
		background-color: #2C324C;
	}
	
	.content{
		color:#f0f0f0;
	}
	.content .top-panel{
		display: flex;
		width: 100%;
	}
	.content .top-panel .left{
		width:30%;
		min-width: 500px;
		display: flex;
		flex-direction: row;
		/* justify-content: space-around; */
		align-items: center;
		padding:10px;
	}
	.content .top-panel .left .memo{
		display: flex;
		flex-direction: row;
	}
	.content .top-panel .left .memo>span{
		/* width: 100%; */
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.content .top-panel .left .memo>span:nth-child(1){
		width: 70px;
		height: 80px;
	}
	.content .top-panel .left .memo>span:nth-child(2){
		width:140px;
	}
	.content .top-panel .left .memo>span>label{
		white-space: nowrap;
	}
	
	.content .top-panel .left .memo>span .trainImg{
		width:50px;
		height:50px;
	}
	.content .top-panel .left .memo>span .cc{
		font-size: 16px;
		line-height: 24px;
		flex: 1;
	}
	.content .top-panel .left .memo>span .sfzd{
		font-size:18px;
	}
	.content .top-panel .left .memo>span .kyd{
		font-size:16px;
	}
	.content .top-panel .left .detail{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}
	.content .top-panel .left .detail>span{
		width:100%;
		display: flex;
		flex-direction: row;
	}
	.content .top-panel .left .detail>span>label:nth-child(1){
		min-width: 75px;
		text-align: right;
	}
	.content .top-panel .left .detail>span:last-child>label{
		line-height: 21px;
	}
	.content .top-panel .left .detail .time{
		color:#66a0f6;
	}
	.content .top-panel .left .detail .qj{
		color:#ec9c2e;
	}
	.content .top-panel .left .detail .wd{
		color:#e9757f;
	}
	.content .top-panel .left .detail .zc{
		color:#7cffb3;
	}
	.content .top-panel .right{
		width:100%;
		margin-top: 2px;
		overflow-x: auto;
		display: flex;
		align-items: center;
	}
	.content .top-panel .right .timeline{
		white-space: nowrap;
	}
	.content .top-panel .right .timeline .timeline-item{
		height: 60px;
		display: inline-table;
	}
	.content .top-panel .right .timeline .timeline-item .node{
		box-sizing: border-box;
		border-radius: 50%;
		cursor: pointer;
		width: 14px;
		height:14px;	
		display: inline-block;
	}
	.content .top-panel .right .timeline .timeline-item .undo{
		background: #e4e7ed;
	}
	
	.content .top-panel .right .timeline .timeline-item .time{
		background: #FF5F5F;
	}
	.content .top-panel .right .timeline .timeline-item .done{
		background: rgb(0, 170, 255);
	}
	
	.content .top-panel .right .timeline .timeline-item .line{
		width: 100%;
		height:2px;
		margin:-10px 0 0 10px;
		background:#e4e7ed;
	}
	.content .top-panel .right .timeline .timeline-item .timestamp{
		margin:10px 0 0 5px;
		transform: rotate(10deg);
		width: 80px;
		height: 30px;
	}
	.content .top-panel .right .timeline .timeline-item .content{
		
	}
	
	.space{
		width: 1px;
		height:80px;
		background:#222222;
		margin:0 5px;
	}
	>>>.el-table thead.is-group th{
		background: none;
	}
	>>>.el-table--border, .el-table--group{
		border:0;
	}
	>>>.el-table--border td{
		border-right:0;
	}
	>>>.el-table--border th, .el-table__fixed-right-patch{
		border:0;
	}
	
	.content .middle{
		display: flex;
		flex-direction: row;
	}
	
	.content .middle>div{
		width: 50%;
	}
	
	.content .bottom{
		display: flex;
		flex-direction: row;
	}
	.content .bottom .bz{
		width:400px;
	}
	.content .bottom .cs{
		width:660px;
	}
	.content .bottom .klfx{
		width:100%;
		flex:1
	}
	.sec-title{
		font-size: 18px;
		font-weight: 600;
		padding: 5px 10px;
		display: block;
	}
</style>
<script>
	import home from '../../service/home.js'
	// 这里引用各种资源
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				titleOfCS:"",
				dialogVisible:false,
				detailCS:[],
				data:{},//过度数据
				a:{},//始发终到晚点信息
				b:{},//列车长信息
				c:null,//任务列表
				d :[],//保洁打分
				e :[],//备品签收情况
				f :[],//客流分析
				g1:[],//餐售-渠道
				g1:[],//餐售-类型
				trainImg:require('../components/images/logo.png'),
				bg:require('../components/images/detail.png'),
				bz:[
					
				],
				klfx:{
					xAxis:[],
					dy:[],
					down:[],
					up:[],
					left:[]
				}
			}
		},
		// 属性
		props: {
			datasource:Object,
			detailSql:Array
		},
		// 组件挂载完毕
		mounted() {
			this.loading = this.$loading({
				lock: true,
				text: '正在获取数据...',
				spinner: 'el-icon-loading',
				background: 'rgba(0,0,0,0.7)',
				customClass: 'loading1'
			});
			let t = this
			this.data = this.datasource
			if(this.data){
				this.init()
			}
		},			
		// 方法
		methods: {
			init(){
				this.a = this.datasource["1"][0]||{}//始发终到
				this.b = this.datasource["2"][0]||{}//列车长
				this.c = this.datasource["3"]//任务列表
				this.d = this.datasource["4"]//保洁打分
				this.e = this.datasource["5"]//备品签收情况
				this.f = this.datasource["6"]//客流分析
				this.g1 = this.datasource["7"]//餐售-渠道
				this.g2 = this.datasource["8"]//餐售-类型
				
				this.$nextTick(()=>{
					// this.loading.setText("正在加载列车数据...")
					this.getBz();//编组
					
					this.initCs();//餐售
					
					this.createKlfxData(this.f);//客流分析数据
					this.initKlfx();//客流分析图表
					this.loading.close()
				})
			},
			
			//餐售
			initCs(){
				let t = this
				const colors = ['#4a92ff','#7cffb3','#fcdd60','#ff6e75'];
				var o = {
					title:[
						{
							text:'餐售渠道分布',
							left:'17%',
							top:'bottom',
							textStyle:{color:'#f0f0f0'}
						},
						{
							text:'商品销售分布',
							left:'67%',
							top:'bottom',
							textStyle:{color:'#f0f0f0'}
						}
					],
					legend:[
						{
							left:'left',
							// top:'top',
							textStyle:{
								color:'#f0f0f0'
							},
							data:this.g1.map(item=>item.CS_TYPE)
						},{
							left:'right',
							// top:'top',
							textStyle:{
								color:'#f0f0f0'
							},
							data:this.g2.map(item=>item.MAT_CATE)
						}
					],
					grid:[
						{
							width:300
						}
					],					
					series:[
						{
							type:'pie',
							radius:['40%','70%'],
							center:['25%','50%'],
							label:{
								normal:{
									formatter:'{d}%'
								}								
							},
							data:this.g1.map((item,index)=>{
								return {
									ty:"渠道",
									meta:item,
									name:item.CS_TYPE,
									value:parseInt(item.AMOUNT),
									itemStyle:{normal:{color:colors[index]}}
								}
							})
						},
						{
							type:'pie',
							radius:['40%','70%'],
							center:['75%','50%'],
							label:{
								normal:{
									formatter:'{d}%'
								}								
							},
							data:this.g2.map((item,index)=>{
								return {
									ty:"类型",
									meta:item,
									name:item.MAT_CATE,
									value:parseInt(item.AMOUNT),
									itemStyle:{normal:{color:colors[index]}}
								}
							})
						}
					]
				}
				
				var c = echarts.init(document.getElementById('cs-charts'))
				c.on("click",(params)=>{
					this.getDetailOfCS(params)
				})
				c.setOption(o)
			},
			getDetailOfCS(p){
				this.loading = this.$loading({
					lock: true,
					text: '正在获取数据...',
					spinner: 'el-icon-loading',
					background: 'rgba(0,0,0,0.7)',
					customClass: 'loading1'
				});
				// ["车次","开行日期(yyyy/mm/dd)","渠道名称"]
				// ["车次","开行日期(yyyy/mm/dd)","商品大类","商品小类"]
				this.titleOfCS = p.name;
				if(p.data.ty==="渠道"){
					home.getDetailByQD({
						s:[this.a.TRAIN,echarts.format.formatTime('yyyy/MM/dd',new Date(this.a.START_DATE).getTime()),p.name]
					}).then((r)=>{
						this.detailCS = JSON.parse(r);
						this.dialogVisible = true;
						this.loading.close();
					},error =>{
						t.$notify.error({
							title: '提示',
							message: '获取销售详情信息异常'
						});
						this.loading.close();
					});
				}else{
					home.getDetailByLX({
						s:[this.a.TRAIN,echarts.format.formatTime('yyyy/MM/dd',new Date(this.a.START_DATE).getTime()),p.data.meta.MAT_KIND,p.data.meta.MAT_CATE]
					}).then((r)=>{
						this.detailCS = JSON.parse(r);
						this.dialogVisible = true;
						this.loading.close();
					},error =>{
						t.$notify.error({
							title: '提示',
							message: '获取销售详情信息异常'
						});
						this.loading.close();
					});
				}
				
			},
			//客流分析
			initKlfx(){
				let t = this
				var o = {
					title:{
						
					},
					grid:{
						bottom:30
					},
					legend:{
						textStyle:{
							color:'#f0f0f0'
						},
						data:['上车人数','下车人数','定员数','车内总人数']
					},
					tooltip:{
						show:true
					},
					xAxis:{
						type:'category',
						data:t.klfx.xAxis,
						axisLabel:{
							textStyle:{color:'#f0f0f0'}
						},
						axisLine:{
							lineStyle:{color:'#f0f0f0'}
						},
						axisTick:{show:false}
					},
					yAxis:{
						type:'value',
						name:'(人)',
						min:0,
						// max:10000,
						// interval:1000,
						axisLabel:{
							textStyle:{color:'#f0f0f0'}
						},
						axisLine:{
							lineStyle:{color:'#f0f0f0'}
						},
						axisTick:{show:false}
					},
					series:[
						{
							name:'上车人数',
							type:'bar',
							barMaxWidth:40,
							itemStyle:{normal:{color:'#3292ff'}},
							data:t.klfx.up
						},
						{
							name:'下车人数',
							type:'bar',
							barMaxWidth:40,
							itemStyle:{normal:{color:'#ff5f5f'}},
							data:t.klfx.down
						},
						{
							name:'定员数',
							type:'line',
							itemStyle:{normal:{color:'#e26dff'}},
							data:t.klfx.dy
						},
						{
							name:'车内总人数',
							type:'line',
							itemStyle:{normal:{color:'#8afec4'}},
							data:t.klfx.left
						}
					]
				}
				
				var c = echarts.init(document.getElementById('klfx-charts'))
				c.setOption(o)
			},
			formatTime(str){
				return str?echarts.format.formatTime('MM-dd hh:mm',new Date(str).getTime()):str
			},
			createKlfxData(data){
				let t = this
				data&&data.forEach((o,i)=>{
					t.klfx.xAxis.push(o.STN_NAME1)
					t.klfx.dy.push(o.DY)
					t.klfx.up.push(o.SD_UP_COUNT)
					t.klfx.down.push(o.SD_DOWN_COUNT)
					t.klfx.left.push(o.SD_LEFT_COUNT)
				})
			},
			getBz(){
				let t = this
				home.getBz({
					// s:[[t.a.TRAIN,echarts.format.formatTime('yyyyMMdd',new Date(t.a.START_DATE).getTime())]]
					s:[this.detailSql]
				}).then((r)=>{
					if(r){
						t.bz = r["1"]
					}else{
						t.$message({
							type: 'error',
							message: '接口异常'
						})
					}
				},error =>{
					t.$notify.error({
						title: '提示',
						message: '获取班组信息异常'
					})
				})
			}
		},
		// 监视属性
		watch: {
			datasource:function(n,o){
				this.datasource = n
				this.init()
			}
		},
		// 计算属性
		computed: {},
	}
</script>


<style scoped="scoped">
	>>>.el-table--border th.gutter:last-of-type{
		border-bottom:0;
	}
</style>
