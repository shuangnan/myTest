<template>
	<div ref="main" style="width: 100%;height:100%;overflow: hidden;padding:0;margin:0;background:#2a3252">
		<div class="content">
			<div class="opa">
				<label class="title">班组情况</label>
				<el-select v-model="opt.cd" size="mini" @change="filterData">
					<el-option v-for="(item,i) in cd" :value="item.TEAM_ID" :label="item.TEAM_NAME">
						
					</el-option>
				</el-select>
			</div>

			<el-table style="width:100%;" height="300" size="mini" :data="datasource" :border="false" v-loading="loading" element-loading-background="rgba(0,0,0,.5)" element-loading-text="loading" tooltip-effect="light"
			 :highlight-current-row="false">
				<!-- <el-table-column type="index" label="序号" width="50" align="center"></el-table-column> -->
				<el-table-column label="班组" align="center" prop="CLASS_NAME"></el-table-column>
				<el-table-column label="列车长" align="center" prop="STEWARD_NAME"></el-table-column>
				<el-table-column label="手机号" align="center" prop="PHONE" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="已工作时长" align="center" prop="WORK_HOURS"></el-table-column>
				<el-table-column label="当前当班" align="center" prop="SCAN_ACT"></el-table-column>
				<el-table-column align="center">
					<template scope="scope">
						<el-popover trigger="click" placement="right">
							<div class="con">
								<span><label>列车长：</label>{{scope.row.STEWARD_NAME}}(<label style="color:#00BFFF;">{{scope.row.PHONE}}</label>)</span>
								<span><label>成员：</label>{{scope.row.STEWARD_LIST}}</span>
								<span><label>交路信息：</label>{{scope.row.ROUTE_NAME}}</span>
								<span><label>乘务日志：</label>{{scope.row.LOG_LIST}}</span>
							</div>
							<el-button slot="reference" type="primary" size="mini">详情</el-button>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>

		</div>
	</div>
</template>

<script>
	import home from './service/home.js'
	export default {
		props:{
			oname:{
				type:String,
				default:"",
			}
		},
		data() {
			return {
				loading:false,
				logo: require('../../images/yyqk.png'),
				cd: [],
				opt: {
					cd: ''
				},
				datasource: [{
						bz: '广夏01组',
						lcz: '拼夕夕',
						sjh: '18191977712',
						ygzsc: '13h',
						dqdb: 'G11',
						cy: '王老五 梅老七 罗三岁',
						jl: 'G11-G89',
						log: '乘务日志'
					}
				],
				user:{
					oName:null
				}
			}
		},
		mounted() {
			this.user.oName = this.$store.state.user.u_DEPOT
			this.initCdzd()
		},
		methods: {
			initCdzd() {
				let t = this
				home.getCdzd({
					s:[[t.oname]]
				}).then((r) => {
					if (r) {
						t.cd = r["1"]
						if(t.cd&&t.cd[0]){
							t.opt.cd=t.cd[0].TEAM_ID
							t.getBzqk()
						}
					} else {
						this.$message('接口错误')
					}
				}, error => {
					t.$notify.error({
						title: '班组情况',
						message: '获取车队数据异常'
					})
				})
			},
			getBzqk(){
				let t = this
				t.datasource = []
				home.getBzqk({
					s:[[t.opt.cd]]
				}).then((r) => {
					if (r) {
						t.datasource = r["1"]
					} else {
						this.$message('接口错误')
					}
					t.loading = false
				}, error => {
					t.loading = false
					t.$notify.error({
						title: '班组情况',
						message: '获取班组情况异常'
					})
				})
			},
			filterData(){
				this.loading = true
				this.getBzqk()
			}
		},
		watch:{
			oname(){
				this.initCdzd();
			}
		}
	}
</script>

<style scoped="scoped">
	.content {
		display: flex;
		flex-direction: column;
		color: #f0f0f0;
		width: 100%;
		height: 100%;
	}

	.content .opa {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
	}

	.content .title {
		font-size: 22px;
	}

	.content .time {
		width: 100%;
		text-align: center;
		font-size: 16px;
		margin: 10px 0;
	}

	.content .center {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.content .center .logo {
		width: 50px;
		height: 50px;
	}

	.content .center .left {
		display: flex;
		flex-direction: column;
	}

	.content .center .right {
		display: flex;
		flex-direction: column;
	}

	.content .center .right span {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.content .center .right span label:nth-child(1) {
		width: 100px;
		text-align: right;
	}

	.content .center .space {
		width: 1px;
		height: 70px;
		background: #222222;
	}

	.font-blue {
		color: #2b97ff;
		font-size: 18px;
	}

	.font-white {
		color: #f0f0f0;
		font-size: 14px;
	}

	.con {
		color: #f0f0f0;
		display: flex;
		flex-direction: column;
	}

	.con>span>label {
		min-width: 80px;
		text-align: right;
		display: inline-block;
	}
</style>
