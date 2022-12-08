<template>
	<div style="position: relative;width:100%;height:100%;padding: 30px 10px 90px 30px;" class="box">
		<div class="title">施工计划统计</div>

		<div class="left-list" style="padding-top: 0px; -webkit-user-select: none; ">
			<div class="wz" :class="{active:listtype==='Ⅲ'}" style="width: 80px;" @click="chooseleft('Ⅲ',1)">Ⅲ级施工</div>
			<!-- <div class="wz" :class="{active:listtype==='重载'}" style="width: 80px;" @click="chooseleft('重载',2)">Ⅰ级重载</div> -->
			<div class="wz" :class="{active:listtype==='Ⅱ'}" style="width: 80px;" @click="chooseleft('Ⅱ',3)">Ⅱ级施工</div>
			<div class="wz" :class="{active:listtype==='Ⅰ'}" style="width: 80px;" @click="chooseleft('Ⅰ',4)">Ⅰ级施工</div>
			<!-- <div class="wz" :class="{active:listtype==='四级'}" style="width: 80px;" @click="chooseleft('四级',5)">Ⅳ级</div> -->
			<!-- <div class="wz" :class="{active:listtype==='五级'}" style="width: 80px;" @click="chooseleft('五级',6)">Ⅴ级</div> -->
		</div>
		<!-- <div class="table_body"></div>
		<div class="table_main_body"   @mouseenter="mEnter" @mouseleave="mLeave">
			<div class="table_inner_body" :style="{transform: `translate(0px, -${scrollTop}px)`}">
			<div ref="scrollItemBox">
			<el-col class="table_tr" :span="howWidth" v-for="(item,index) in tableData1" :key="index" >
				<div class="shebei1">
					<div class="DuanName">{{item.xianname}}</div>
					<div class="img1" >{{numb}}/{{unnumb}}</div>
				</div>
			</el-col>
			</div>
			<div v-html="copyHtml"></div>
			</div>
		</div> -->


		<div class="table_body" @mouseenter="mEnter" @mouseleave="mLeave">
			<div class="table_main_body">
				<div class="table_inner_body">
					<div ref="scrollItemBox">
						<el-col :span="howWidth" v-for="(item,index) in tmpTableData" :key="index">
							<div class="shebei1" @click="childmd(item.LINE_NAME)">
								<div style="cursor: pointer;" :title="item.LINE_NAME" class="DuanName">{{item.LINE_NAME}}</div>
								<div class="img1">{{item.COUNTY}}</div>
							</div>
						</el-col>
					</div>
				</div>
			</div>
		</div>

		<!-- <div style="position: relative;height: 50%;padding-top: 30px;bottom:0;">
			<div style="position: relative;;left:0;bottom:;width:100%;height: 90px;display: flex;justify-content: space-between;">
			<div class="shebei" style="padding-left: 0px;">
				<div class="DuanName">{{xianname1[0]}}</div>
				<div class="img1" @click="childmd(1)">{{numb}}/{{unnumb}}</div>
			</div>
			<div class="shebei" style="padding-left: 20px;">
							<div class="DuanName">{{xianname1[1]}}</div>
							<div class="img1" @click="childmd(2)">{{numb}}/{{unnumb}}</div>
			</div>
			<div class="shebei" style="padding-left: 20px;">
							<div class="DuanName">{{xianname1[2]}}</div>
							<div class="img1" @click="childmd(3)">{{numb}}/{{unnumb}}</div>
			</div>
			
			</div>
		</div>
		
		
		<div style="position: relative;height: 50%;padding-top: 50px;bottom:0;">
					<div style="position: relative;;left:0;bottom:;width:100%;height: 90px;display: flex;justify-content: space-between;">
				
					<div class="shebei" style="padding-left: 0px;">
						<div class="DuanName">{{xianname1[3]}}</div>
						<div class="img1" @click="childmd(4)">{{numb}}/{{unnumb}}</div>

					</div>
					<div class="shebei" style="padding-left: 20px;">
									<div class="DuanName">{{xianname1[4]}}</div>
									<div class="img1" @click="childmd(5)">{{numb}}/{{unnumb}}</div>

					</div>
					<div class="shebei" style="padding-left: 20px;">
									<div class="DuanName">{{xianname1[5]}}</div>
									<div class="img1" @click="childmd(6)">{{numb}}/{{unnumb}}</div>
					</div>
					
					</div>
		</div> -->
		<!-- <div class="table_body">
		  <div class="table_main_body" >
		    <div class="table_inner_body" >
		      <el-col :span="howWidth" class="table_tr" v-for="(item,index) in tableData1" :key="index" >
						<div class="shebei" style="padding-left: 20px;">
							<div class="DuanName">{{item.xianname}}</div>
							<div class="img1" >{{item.numb}}/{{item.unnumb}}</div>
						</div>
		      </el-col>
		    </div>
		  </div>
		</div> -->

	</div>
</template>

<script>
	let timer = null;
	import C from "../../../assets/com.js"
	export default {
		data() {
			return {
				listtype: "Ⅲ",
				showFlag: true,
				numb: '248',
				unnumb: '345',
				xianname1: ['成渝线', '成昆线', '内六线', '襄渝线', '吉玉线', '沪蓉线'],
				numblist: ['248', '129', '68'],
				tableData1: [
					// listtype="Ⅲ",
					// {listtype:"Ⅲ",}
					// {
					// 	xianname:'成渝线11',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成昆线12',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线13',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线14',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线15',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线16',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线21',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线22',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线23',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线24',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线25',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线26',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线27',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线28',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
				],
				tableData2: [
					// listtype="Ⅱ",
					// {
					// 	xianname:'成渝线21',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成昆线22',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线23',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线24',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线25',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线26',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线27',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线28',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线29',
					// 	numb:'248',
					// 	unnumb:'345',
					// },

					// {
					// 	xianname:'成渝线28',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
				],
				tableData3: [
					// listtype="Ⅰ",
					// {
					// 	xianname:'成渝线30',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成昆线31',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线32',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线33',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线34',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线35',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线36',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线37',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
					// {
					// 	xianname:'成渝线38',
					// 	numb:'248',
					// 	unnumb:'345',
					// },

					// {
					// 	xianname:'成渝线28',
					// 	numb:'248',
					// 	unnumb:'345',
					// },
				],
				howWidth: 8,
				scrollTop: 0,
				speed: 90,
				copyHtml: '',
				tableListSize: 0,
				visibleSize: 6,
				flag: null,
				first: 0,
				tmpTableData: [],
			}
		},
		props: {

		},
		// 组件挂载完毕
		mounted() {
			// this.tableActionFun()
			// clearInterval(this.componentTimer);
			// this.bsGetProductProcess();
			// this.componentTimerFun();
			this.getData()


			setTimeout(() => {
				let tmp = this.first + 6
				this.tmpTableData = this.tableData3.slice(this.first, tmp)
				this.first = tmp
			}, 500)

			this.$nextTick(() => {
				this.flag = setInterval(this.chageData, 8000)
			})

		},
		beforeDestroy() {
			clearInterval(this.componentTimer);
			clearInterval(this.tableTimer);
		},
		created() {
			this.getData3()



		},
		// 方法
		methods: {
			getlisttype() {
				return this.listtype
			},
			/**-------------------------响应事件-------------------------------*/
			chageData() {
				if (this.listtype === 'Ⅰ') {
					if (this.first < this.tableData1.length) {
						let tmp = this.first + 6
						this.tmpTableData = this.tableData1.slice(this.first, tmp)
						this.first = tmp
					} else {
						this.first = 0
						// tmpTableData=[]
						let tmp = this.first + 6
						this.tmpTableData = this.tableData3.slice(this.first, tmp)
						this.first = tmp
						this.listtype = 'Ⅲ'
					}
				}
				if (this.listtype === 'Ⅱ') {
					if (this.first < this.tableData2.length) {
						let tmp = this.first + 6
						this.tmpTableData = this.tableData2.slice(this.first, tmp)
						this.first = tmp
					} else {
						this.first = 0
						// tmpTableData=[]
						let tmp = this.first + 6
						this.tmpTableData = this.tableData1.slice(this.first, tmp)
						this.first = tmp
						this.listtype = 'Ⅰ'
					}
				}
				if (this.listtype === 'Ⅲ') {
					if (this.first < this.tableData3.length) {
						let tmp = this.first + 6
						this.tmpTableData = this.tableData3.slice(this.first, tmp)
						this.first = tmp
					} else {
						this.first = 0
						// tmpTableData=[]

						let tmp = this.first + 6
						this.tmpTableData = this.tableData2.slice(this.first, tmp)
						this.first = tmp
						this.listtype = 'Ⅱ'
					}
				}

			},
			chooseleft(name, seq) {
				this.listtype = name;

				if (name === 'Ⅰ') {
					clearInterval(this.flag);
					this.first = 0
					let tmp = this.first + 6
					this.tmpTableData = this.tableData1.slice(this.first, tmp)
					this.first = tmp
					this.flag = setInterval(this.chageData, 8000)
				}
				if (name === 'Ⅱ') {
					clearInterval(this.flag);
					this.first = 0
					let tmp = this.first + 6
					this.tmpTableData = this.tableData2.slice(this.first, tmp)
					this.first = tmp
					this.flag = setInterval(this.chageData, 8000)
				}
				if (name === 'Ⅲ') {
					clearInterval(this.flag);
					this.first = 0
					let tmp = this.first + 6
					this.tmpTableData = this.tableData3.slice(this.first, tmp)
					this.first = tmp
					this.flag = setInterval(this.chageData, 8000)
				}
			},
			/**-------------------------数据展示-------------------------------*/
			childmd(name1) {
				// this.$parent.shigong();
				this.$emit('fatherMethod', name1)
			},

			// 鼠标移入停止滚动
			mEnter() {
				clearInterval(this.flag);
			},
			// 鼠标移出继续滚动
			mLeave() {
				this.flag = setInterval(this.chageData, 8000)
			},
			/**-------------------------获取数据-------------------------------*/
			// 获取数据
			//Ⅰ、Ⅱ、Ⅲ
			getData() {
				C.getData({
					s: [
						["Ⅰ"]
					],
					url: "https://10.192.126.203/GeneralProServlet",
					c: 'ajsdp_zhaoyue2006',
				}, res => {
					// this.loading =false;
					this.tableData1 = res.data['1']
					console.log("施工1")
					console.log(res)
					// this.rank1=res.data['1'];

				});
				C.getData({
					s: [
						["Ⅱ"]
					],
					url: "https://10.192.126.203/GeneralProServlet",
					c: 'ajsdp_zhaoyue2006',
				}, res => {
					// this.loading =false;
					this.tableData2 = res.data['1']
					console.log("施工2")
					console.log(res)
					// this.rank1=res.data['1'];

				});

			},
			getData3() {
				C.getData({
					s: [
						["Ⅲ"]
					],
					url: "https://10.192.126.203/GeneralProServlet",
					c: 'ajsdp_zhaoyue2006',
				}, res => {
					// this.loading =false;
					this.tableData3 = res.data['1']
					console.log("施工3")
					console.log(res)
					// this.rank1=res.data['1'];
				});
			},


		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
		// 组件
		components: {},
	}
</script>

<style scoped="scoped">
	.box {
		background: url(img2/右边框.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
		/* display: flex; */
		/* flex-direction: column;		 */
		/* border: 1px solid red; */
		/* 		display: flex;
		align-items: center;
		align-content: center; */

	}

	.title {
		position: absolute;
		margin-top: -30px;
		margin-left: -27px;
		font-size: 16px;
		color: #bccde6;
		/* background-image: linear-gradient(#1ae3ff,#2f7aca); */
		-webkit-background-clip: text;
		/* color: transparent; */
		-webkit-user-select: none;
		/* border: 1px solid salmon; */
	}

	.left-list {
		position: relative;
		width: 90%;
		height: 50px;
		display: flex;
		color: #0096ff;
		margin: 0 auto;
		text-align: center;
		justify-content: space-around;
		/* border: 1px solid saddlebrown; */
	}

	.left-list>.wz {
		cursor: pointer;
		font-size: 16px;
		padding-left: 0px;
		padding-top: 10px;
		/* height: 100px; */
		height: 50px;
		width: 100px;
	}

	.left-list>.wz.active {
		background: url(./img2/jianbian.png)no-repeat;
		background-position: center 5px;
		width: 100px;
		color: white;
		/* height: 100px; */
		height: 50px;
	}

	.table_body {
		width: 100%;
		margin-top: 0px;
		position: relative;
		display: flex;
	}

	.table_main_body {
		height: 200px;
		width: 100%;
		display: absolute;
		/* border: 1px solid seagreen; */
	}

	.table_inner_body {
		width: 100%;
		position: absolute;
		/* margin-top: 10px; */
		left: 0;
	}

	.table_tr {
		display: flex;
		height: 90px;
		line-height: 40px;
		color: #eee;
		font-size: 15px;
		/* background: rgba(8, 17, 39, 25); */
		/* border: 1px solid rgb(4, 114, 131); */
		margin-top: 7px;
		align-items: center;
		align-content: center;
	}

	.shebei1 {
		height: 100px;
		width: 100%;
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: center;
		flex-direction: row;
		/* border: 1px solid saddlebrown; */
		/* border: 1px solid seashell; */
	}

	.shebei {
		position: relative;
		width: 100%;
		/* text-align: center; */
		margin-left: 5px;
		margin-top: -10px;
		/* margin-top: -35px; */
		-webkit-user-select: none;
		/* background: url(img2/gz.png)no-repeat; */
	}

	.DuanName {
		/* position: absolute; */
		font-size: 17px;
		/* text-align: left; */
		color: white;
		/* color: #1ed4d8; */
		padding-left: 0px;
		/* margin-right: 70px; */
		/* border: 1px solid salmon; */
		/* margin-left: -40px; */
		padding-top: 0px;
		text-shadow: 0px 0px 10px #0000FF, 0 0 20px #fff;
		white-space: nowrap;
		overflow: hidden;
		width: 70px;
		text-overflow: ellipsis;
	}

	.img1 {
		/* position: absolute; */
		background: url(img/b2-3.png)no-repeat;
		background-size: 100% 100%;
		/* background-position: left bottom; */
		/* margin-top: -20px; */
		/* margin-left: 60px; */
		width: 70px;
		/* border: 1px solid salmon; */
		height: 70px;
		font-size: 16px;
		padding-top: 65px;
		padding-left: 5px;
		text-align: center;
		color: #bad9de;
		cursor: pointer;
	}

	.shebei>.img2 {
		position: absolute;
		background: url(img2/组 254 拷贝 5.png)no-repeat;
		/* background-position: left bottom; */
		margin-top: 30px;
		margin-left: 50px;
		width: 50px;
		height: 50px;
		padding-top: 0px;
		padding-left: 5px;
		text-align: center;
	}

	.shebei>.sj {
		position: absolute;
		margin-top: 80px;
		margin-left: -15px;
		font-size: 12px;
	}

	.shebei>.yj {
		position: absolute;
		margin-top: 80px;
		padding-left: 65px;
		font-size: 12px;
		/* text-align: center; */
	}
</style>
