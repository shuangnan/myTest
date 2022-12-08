<template>
	<div v-loading="loading" 
		element-loading-text="正在获取数据..."
	    element-loading-spinner="el-icon-loading"
	    element-loading-background="rgba(0, 0, 0, 0.7)"
	style="width:100%;height: 100%;padding: 5px;overflow: hidden;">
		<table class="table-lay" border="0" cellpadding="0" cellspacing="0">
			<tbody>
				<tr>
					<td rowspan="2" style="width: 350px;" valign="top">
						<!-- {{a}} -->
						<div class="box" style="width: 350px;padding-top: 10px;">
							<div style="padding-bottom: 10px;text-align: center;border-bottom: 2px solid #1c243b;">
								<el-image style="display: inline-block;vertical-align: middle;" :src="trainImg"></el-image>
								<div style="display: inline-block;vertical-align: middle;text-align: left;padding-left: 10px;font-size: 20px;">
									<div style="color: #69c1ff;">{{a.TRAIN}}</div>
									<div>{{a.START_STN}} - {{a.END_STN}}</div>
								</div>
							</div>
							<div class="train-info" style="padding: 10px 0;line-height: 20px;border-bottom: 2px solid #1c243b;">
								<div><label>始发时间：</label><label>{{a.START_DATE}}</label></div>
								<div><label>运行区间：</label><label v-if="b.LOCAL_FLAG==='0'">{{b.CURRNAME}}</label><label v-else>{{b.CURRNAME}} -
										{{b.NEXTNAME}}</label></div>

								<div v-if="parseInt(a.EDTIME)>0"><label>运行状态：</label><label class="wd">{{'晚点'+a.EDTIME+'分钟'}}</label></div>
								<div v-else-if="parseInt(a.EDTIME)==0"><label>运行状态：</label><label class="zc">正常运行</label></div>
								<div v-else><label>运行状态：</label><label class="zc">-</label></div>
								<div>
									<label>列车长：</label>
									<label v-if="b.STEWARD_NAME">
										{{b.STEWARD_NAME}} <a class="tel" @click="toolClick('openPhone','self')">{{b.PHONE}}</a>
										<el-image :src="msgImg" @click="toolClick('openMsg','self')" title="发送消息" class="img-cls"></el-image>
										<el-image :src="callImg" @click="toolClick('openXiaoYu','self')" title="音视频对讲" class="img-cls"></el-image>
										<el-image :src="phoneImg" @click="toolClick('openPhone','self')" title="应急呼叫" class="img-cls"></el-image>
									</label>
									<label v-else-if="data_lcz.length===1">
										{{data_lcz[0].E_Name}} <a class="tel" @click="toolClick('openPhone',data_lcz[0])">{{data_lcz[0].E_Phone}}</a>
										<el-image :src="msgImg" @click="toolClick('openMsg',data_lcz[0])" title="发送消息" class="img-cls"></el-image>
										<el-image :src="callImg" @click="toolClick('openXiaoYu',data_lcz[0])" title="音视频对讲" class="img-cls"></el-image>
										<el-image :src="phoneImg" @click="toolClick('openPhone',data_lcz[0])" title="应急呼叫" class="img-cls"></el-image>
									</label>
									<el-popover v-else-if="data_lcz.length>0" placement="right" width="300" trigger="click">
										<ul>
											<li v-for="lcz in data_lcz">
												{{lcz.E_Name}} <a class="tel" @click="toolClick('openPhone',lcz)">{{lcz.E_Phone}}</a>
												<el-image :src="msgImg" @click="toolClick('openMsg',lcz)" title="发送消息" class="img-cls"></el-image>
												<el-image :src="callImg" @click="toolClick('openXiaoYu',lcz)" title="音视频对讲" class="img-cls"></el-image>
												<el-image :src="phoneImg" @click="toolClick('openPhone',lcz)" title="应急呼叫" class="img-cls"></el-image>
											</li>
										</ul>
										<span slot="reference">点击查看</span>
									</el-popover>
								</div>
							</div>
							<div v-if="c.length===0" style="text-align: center;padding-top: 90%;color: #909399;">暂无数据</div>
							<ul v-else class="timeline">
								<li v-for="(item,index) in c">
									<div class="point"><span>{{item.s_time_short}}</span></div>
									<!-- STATUS =1 已完成   STATUS = 0  未完成    FUTURE=1 未开始  DELAY_TIME：超时时间 -->
									<div class="info" :class="'statu-'+item.STATUS + '-'+ item.timeoutLevel" :title="item.TASK_CONTENT">
										<template v-if="item.STATUS==='1'">
											<div v-if="item.timeoutLevel==='0'" class="statu">已完成</div>
											<div v-else-if="item.timeoutLevel==='1'" class="statu">已超时</div>
											<div v-else-if="item.timeoutLevel==='2'" class="statu">已超时</div>
										</template>
										<!-- 未完成 -->
										<div v-else-if="item.STATUS==='0'" class="statu">未完成</div>
										<!-- 未开始 -->
										<div v-else-if="item.FUTURE==='1'" class="statu">未开始</div>

										<div>任务名称：{{item.TASK_NAME}}</div>
										<div>责任人：</div>
										<div>完成时间：{{item.s_time_short}}</div>
										<!-- <div>预计完成时间：{{item.P_TIME}}</div> -->
									</div>
								</li>
							</ul>
						</div>
					</td>
					<td valign="top">
						<div class="box" style="width: 840px;">
							<div class="box-title" :class="{'active':curTop==='bz'}" @click="curTop='bz'">编组</div>
							<div class="box-title" :class="{'active':curTop!=='bz'}" @click="curTop='kl'" style="left: 100px;">客流分析</div>
							<div class="box-body" v-show="curTop==='bz'" style="height: 350px;">
								<el-table style="width:100%;" height="100%" size="mini" :data="bz" :border="false" :highlight-current-row="false">
									<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
									<el-table-column label="车厢类型" align="center" prop="CZ"></el-table-column>
									<el-table-column label="车厢编号" align="center" prop="CLH"></el-table-column>
									<el-table-column label="定员" align="center" prop="DY"></el-table-column>
									<el-table-column label="车型" align="center" prop="CX"></el-table-column>
									<el-table-column label="职乘人员" align="center" prop="STEWARD_NAME"></el-table-column>
								</el-table>
							</div>
							<div class="box-body" v-show="curTop!=='bz'" style="height: 350px;">
								<el-table ref="klfx" style="width:100%;" height="350px" size="mini" :data="klfxData" :border="false" :show-summary="true"
								 :summary-method="getSummary" :highlight-current-row="false">
									<el-table-column label="下车站/到" align="left" prop="CZ" width="100" fixed="left"></el-table-column>
									<template v-for="col in autoColumns">
										<el-table-column :label="col.zm" align="center" :prop="col.prop" width="100"></el-table-column>
									</template>
									<el-table-column label="下车人数合计" align="center" prop="zcry" width="100" fixed="right"></el-table-column>
								</el-table>
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<td valign="top">
						<div class="box">
							<div class="box-title" :class="{'active':curBot==='cs'}" @click="curBot='cs'">餐售</div>
							<div class="box-title" :class="{'active':curBot!=='cs'}" @click="curBot='bj'" style="left: 100px;">保洁打分</div>
							<div class="box-body" v-show="curBot==='cs'" style="height: 350px;">
								<div id="cs-charts" style="width:100%;height:350px;;"></div>
							</div>
							<div class="box-body" v-show="curBot!=='cs'" style="height: 350px;">
								<el-table style="width:100%;" height="100%" size="mini" :data="d" :border="false" :highlight-current-row="false">
									<el-table-column label="车号" align="center" prop="TRAIN_UNDER"></el-table-column>
									<el-table-column label="车次" align="center" prop="CC"></el-table-column>
									<el-table-column label="保洁类型" align="center" prop="TYPE"></el-table-column>
									<el-table-column label="考核扣分" align="center" prop="SCORE"></el-table-column>
									<el-table-column label="班组" align="center" prop="CLASS_NAME"></el-table-column>
									<el-table-column label="时间" align="center" prop="CREATE_TIME"></el-table-column>
								</el-table>
							</div>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<el-dialog :title="titleOfCS" :visible.sync="dialogVisible" width="600px" :append-to-body="true">
			<el-table style="width:100%;" height="400" size="mini" :data="detailCS" :border="false" :highlight-current-row="false">
				<el-table-column label="订单时间" align="center" prop="C_TIME"></el-table-column>
				<el-table-column label="商品类型" align="center" prop="MAT_NAME"></el-table-column>
				<el-table-column label="数量" align="center" prop="MAT_QTY"></el-table-column>
				<el-table-column label="金额(元)" align="center" prop="AMOUNT"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
	import C from "../../../../assets/com.js"
	import home from '../service/home.js'
	// 这里引用各种资源
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				titleOfCS: "",
				dialogVisible: false,
				detailCS: [],
				data: {}, //过度数据
				a: {}, //始发终到晚点信息
				b: {}, //列车长信息
				c: [], //任务列表
				d: [], //保洁打分
				e: [], //备品签收情况
				f: [], //客流分析
				autoColumns: [],
				g1: [], //餐售-渠道
				g1: [], //餐售-类型
				trainImg: require('../components/images/logo.png'),
				bg: require('../components/images/detail.png'),
				phoneImg: require('../components/images/call.png'), //应急呼叫
				msgImg: require('../components/images/sendMsg.png'), //发送消息
				callImg: require('../components/images/vidio.png'), //音视频对讲
				bz: [],//编组数据
				klfxData:[],//客流分析数据
				klfx: {
					xAxis: [],
					dy: [],
					down: [],
					up: [],
					left: []
				},
				data_lcz: [], //列车长数据
				loading:false,
				curTop:"bz",//当前展示---上部
				curBot:"cs",//当前展示---下部
			}
		},
		// 属性
		props: {
			datasource: Object,
			detailSql: Array
		},
		// 组件挂载完毕
		mounted() {
			this.loading = true;
			this.autoColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13].map(v => {
				return {
					zm: "站名" + v,
					time: "9:10",
					prop: "CLH"
				}
			})
			this.data = this.datasource
			if (this.data) {
				this.init()
			}

		},
		// 方法
		methods: {
			init() {
				this.a = this.datasource["1"][0] || {} //始发终到
				this.b = this.datasource["2"][0] || {} //列车长
				const dataC = this.datasource["3"] //任务列表
				dataC.forEach(v => {
					v.s_time_short = v.S_TIME.substring(10, 16);
					// v.STATUS = "1"
					v.timeoutLevel = "0";
					// 已完成
					if (v.STATUS === '1') {
						if (v.DELAY_TIME > 20 && v.DELAY_TIME <= 60) {
							v.timeoutLevel = "1";
						} else if (v.DELAY_TIME > 60) {
							v.timeoutLevel = "2";
						}
					}
				});
				this.c = dataC;
				this.d = this.datasource["4"] //保洁打分
				this.e = this.datasource["5"] //备品签收情况
				this.f = this.datasource["6"] //客流分析
				this.g1 = this.datasource["7"] //餐售-渠道
				this.g2 = this.datasource["8"] //餐售-类型

				this.$nextTick(() => {
					if (!this.b.STEWARD_NAME) {
						this.getData_lcz();
					}
					this.getBz(); //编组

					this.initCs(); //餐售

					this.createKlfxData(this.f); //客流分析数据
					// this.initKlfx(); //客流分析图表
					this.loading = false;
				})
			},
			toolClick(ty,per) {
				let lcz = per;
				if(per==="self"){
					lcz = {
						E_Name : this.b.STEWARD_NAME,
						E_Phone:this.b.PHONE
					};
				}
				let _type = "phone";
				// 发文本消息
				if(ty==="openMsg"){
					_type = "msg";
				}
				// 小鱼视频
				else if(ty==="openXiaoYu"){
					_type = "xiaoyu";
				}
				// 打电话
				else if(ty==="openPhone"){
					_type = "phone";
				}
				this.$emit("lczEvent",lcz,_type,false)
			},
			renderHeaderAuto(col, h, {
				column,
				$index
			}) {
				return h("div", {
					attrs: {
						class: "sell"
					},
					domProps: {
						innerHTML: '<div style="line-height:14px;">' + col.zm + '</div><div style="line-height:14px;color:white;">' +
							col.time + '</div>'
					}
				})
			},
			getSummary() {
				return ["上车人数合计", 123, 332, 112, 33, 221, 23, 21, 123, 4, 123, 123, 3, 2, 532]
			},
			//餐售
			initCs() {
				let t = this
				const colors = ['#4a92ff', '#7cffb3', '#fcdd60', '#ff6e75'];
				var o = {
					title: [{
							text: '餐售渠道分布',
							left: '17%',
							top: 'bottom',
							textStyle: {
								color: '#f0f0f0'
							}
						},
						{
							text: '商品销售分布',
							left: '67%',
							top: 'bottom',
							textStyle: {
								color: '#f0f0f0'
							}
						}
					],
					legend: [{
						left: 'left',
						// top:'top',
						textStyle: {
							color: '#f0f0f0'
						},
						data: this.g1.map(item => item.CS_TYPE)
					}, {
						left: 'right',
						// top:'top',
						textStyle: {
							color: '#f0f0f0'
						},
						data: this.g2.map(item => item.MAT_CATE)
					}],
					grid: [{
						width: 300,
						height:300
					}],
					series: [{
							type: 'pie',
							radius: ['40%', '70%'],
							center: ['25%', '50%'],
							label: {
								normal: {
									formatter: '{d}%'
								}
							},
							data: this.g1.map((item, index) => {
								return {
									ty: "渠道",
									meta: item,
									name: item.CS_TYPE,
									value: parseInt(item.AMOUNT),
									itemStyle: {
										normal: {
											color: colors[index]
										}
									}
								}
							})
						},
						{
							type: 'pie',
							radius: ['40%', '70%'],
							center: ['75%', '50%'],
							label: {
								normal: {
									formatter: '{d}%'
								}
							},
							data: this.g2.map((item, index) => {
								return {
									ty: "类型",
									meta: item,
									name: item.MAT_CATE,
									value: parseInt(item.AMOUNT),
									itemStyle: {
										normal: {
											color: colors[index]
										}
									}
								}
							})
						}
					]
				}

				var c = echarts.init(document.getElementById('cs-charts'))
				c.on("click", (params) => {
					this.getDetailOfCS(params)
				})
				c.setOption(o)
			},
			getDetailOfCS(p) {
				// ["车次","开行日期(yyyy/mm/dd)","渠道名称"]
				// ["车次","开行日期(yyyy/mm/dd)","商品大类","商品小类"]
				this.titleOfCS = p.name;
				if (p.data.ty === "渠道") {
					home.getDetailByQD({
						s: [this.a.TRAIN, echarts.format.formatTime('yyyy/MM/dd', new Date(this.a.START_DATE).getTime()), p.name]
					}).then((r) => {
						this.detailCS = JSON.parse(r);
						this.dialogVisible = true;
					}, error => {
						t.$notify.error({
							title: '提示',
							message: '获取销售详情信息异常'
						});
					});
				} else {
					home.getDetailByLX({
						s: [this.a.TRAIN, echarts.format.formatTime('yyyy/MM/dd', new Date(this.a.START_DATE).getTime()), p.data.meta.MAT_KIND,
							p.data.meta.MAT_CATE
						]
					}).then((r) => {
						this.detailCS = JSON.parse(r);
						this.dialogVisible = true;
					}, error => {
						t.$notify.error({
							title: '提示',
							message: '获取销售详情信息异常'
						});
					});
				}

			},
			//客流分析
			initKlfx() {
				let t = this
				var o = {
					title: {

					},
					grid: {
						bottom: 30
					},
					legend: {
						textStyle: {
							color: '#f0f0f0'
						},
						data: ['上车人数', '下车人数', '定员数', '车内总人数']
					},
					tooltip: {
						show: true
					},
					xAxis: {
						type: 'category',
						data: t.klfx.xAxis,
						axisLabel: {
							textStyle: {
								color: '#f0f0f0'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#f0f0f0'
							}
						},
						axisTick: {
							show: false
						}
					},
					yAxis: {
						type: 'value',
						name: '(人)',
						min: 0,
						// max:10000,
						// interval:1000,
						axisLabel: {
							textStyle: {
								color: '#f0f0f0'
							}
						},
						axisLine: {
							lineStyle: {
								color: '#f0f0f0'
							}
						},
						axisTick: {
							show: false
						}
					},
					series: [{
							name: '上车人数',
							type: 'bar',
							barMaxWidth: 40,
							itemStyle: {
								normal: {
									color: '#3292ff'
								}
							},
							data: t.klfx.up
						},
						{
							name: '下车人数',
							type: 'bar',
							barMaxWidth: 40,
							itemStyle: {
								normal: {
									color: '#ff5f5f'
								}
							},
							data: t.klfx.down
						},
						{
							name: '定员数',
							type: 'line',
							itemStyle: {
								normal: {
									color: '#e26dff'
								}
							},
							data: t.klfx.dy
						},
						{
							name: '车内总人数',
							type: 'line',
							itemStyle: {
								normal: {
									color: '#8afec4'
								}
							},
							data: t.klfx.left
						}
					]
				}

				var c = echarts.init(document.getElementById('klfx-charts'))
				c.setOption(o)
			},
			formatTime(str) {
				return str ? echarts.format.formatTime('MM-dd hh:mm', new Date(str).getTime()) : str
			},
			createKlfxData(data) {
				let t = this
				data && data.forEach((o, i) => {
					t.klfx.xAxis.push(o.STN_NAME1)
					t.klfx.dy.push(o.DY)
					t.klfx.up.push(o.SD_UP_COUNT)
					t.klfx.down.push(o.SD_DOWN_COUNT)
					t.klfx.left.push(o.SD_LEFT_COUNT)
				})
			},
			getBz() {
				let t = this
				home.getBz({
					// s:[[t.a.TRAIN,echarts.format.formatTime('yyyyMMdd',new Date(t.a.START_DATE).getTime())]]
					s: [this.detailSql]
				}).then((r) => {
					if (r) {
						t.bz = r["1"]
						this.$nextTick(() => {
							this.$refs.klfx.doLayout()
						})
					} else {
						t.$message({
							type: 'error',
							message: '接口异常'
						})
					}
				}, error => {
					t.$notify.error({
						title: '提示',
						message: '获取班组信息异常'
					})
				})
			},
			getData_lcz() {
				var now = new Date();
				now = now.Format("yyyy-MM-dd");
				C.getData({
					c: "kydp_zxy8024",
					url: C.kydUrl,
					s: [this.a.TRAIN, now],
					a: "【kydp_zxy8024】获取三乘信息detail.vue"
				}, (r) => {
					const real = [];
					if (r !== "null") {
						C.$.each(r, function(i, v) {
							if (v.ZhiWei === "列车长") {
								real.push(v);
							}
						});
					}
					this.data_lcz = real;
				});
			}
		},
		// 监视属性
		watch: {
			datasource: function(n, o) {
				this.datasource = n
				this.init()
			}
		},
		// 计算属性
		computed: {},
	}
</script>

<style scoped="scoped">
	.tel {
		text-decoration: underline;
		color: #00aaff;
	}
	.img-cls {
		width: 24px;
		height: 24px;
		vertical-align: middle;
		margin-left: 10px;
	}

	.table-lay {
		width: 100%;
		height: 100%;
		color: white;
	}

	.box {
		display: inline-block;
		position: relative;
		width: 100%;
		height: 100%;
		vertical-align: top;
		padding: 34px 10px 10px 10px;
		border: 10px solid rgba(28, 36, 59, .7);
		background-color: #2C324C;
	}

	.box-title {
		position: absolute;
		top: 0;
		left: 0;
		height: 34px;
		font-size: 18px;
		font-weight: bold;
		padding: 5px 10px;
		color: #c5bfc5;
		cursor: pointer;
	}
	.box-title.active{
		color: #00aaff;
	}

	.box-body {
		width: 100%;
		height: 100%;
	}

	.train-info .wd {
		color: #e9757f;
	}

	.train-info .zc {
		color: #7cffb3;
	}

	.timeline {
		position: absolute;
		top: 180px;
		bottom: 0px;
		left: 10px;
		right: 10px;
		overflow: auto;
		list-style: none;
		padding: 5px 5px 5px 0;
		margin: 0;
	}

	.timeline>li {
		position: relative;
		display: inline-block;
		height: 80px;
		width: 100%;
		padding: 5px 5px 5px 50px;
	}

	.timeline>li>.point {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0px;
		width: 18px;
		border-right: 1px solid rgba(255,255,255,.1);
	}

	.timeline>li>.point>span {
		position: absolute;
		top: 30px;
		left: 8px;
		text-indent: -8px;
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: url(img/trainInfoCircle.png)no-repeat;
		word-wrap: normal;
		white-space: nowrap;
	}

	.timeline>li>.info {
		position: relative;
		width: 100%;
		height: 74px;
		line-height: 20px;
		padding-top: 7px;
		padding-left: 24px;
		background: url(img/未开始.png) no-repeat;
		background-size: 100% 100%;
	}

	/* statu-a-b a(1-已完成，0-未完成) b(0-未超时，1-超时20~60 2-超时60以上)*/
	.timeline>li>.info.statu-0-0 {
		background: url(img/未完成.png) no-repeat;
		background-size: 100% 100%;
	}

	/* 已完成- */
	.timeline>li>.info.statu-1-0 {
		background: url(img/已完成.png) no-repeat;
		background-size: 100% 100%;
	}

	/* 已完成-已超时20~60 */
	.timeline>li>.info.statu-1-1 {
		background: url(img/已超时020min.png) no-repeat;
		background-size: 100% 100%;
	}

	/* 未完成-已超时60以上 */
	.timeline>li>.info.statu-1-2 {
		background: url(img/已超时60min.png) no-repeat;
		background-size: 100% 100%;
	}

	.timeline>li>.info>.statu {
		position: absolute;
		left: 0;
		top: 0;
		width: 20px;
		line-height: 16px;
		padding-top: 12px;
		padding-left: 3px;
		font-size: 12px;
		word-wrap: break-word;
	}
</style>
