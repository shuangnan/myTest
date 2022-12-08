<template>
	<div class="dianwu-panel-container">
		<div class="dianwu-title-container">
			<div class="dianwu-logo">
				<div class="dianwu-title">
					<span>电务</span>
				</div>
			</div>
			<div class="dianwu-count-container">
				<div class="dianwu-count-row row1">
					<div
						style="width: 50%; height: 100%; border-right: 1px solid #000000; border-bottom: 1px solid #000000"
						class="dianwu-count-card"
					>
						<span class="dianwu-count-itemname">
							轨道区段
						</span>
						<span class="dianwu-count-item">
							{{ countList.RAIL_INTERVAL_NUM }}个
						</span>
					</div>
					<div
						style="width: 50%; height: 100%; border-bottom: 1px solid #000000"
						class="dianwu-count-card"
					>
						<span class="dianwu-count-itemname">
							有源应答器
						</span>
						<span class="dianwu-count-item">
							{{ countList.SOURCE_RECALL_NUM }}个
						</span>
					</div>
				</div>
				<div class="dianwu-count-row row2">
					<div
						style="width: 50%; height: 100%; border-right: 1px solid #000000; border-bottom: 1px solid #000000"
						class="dianwu-count-card"
					>
						<span class="dianwu-count-itemname">
							4G动图
						</span>
						<span class="dianwu-count-item">
							{{ countList.SG_NUM }}个
						</span>
					</div>
					<div
						style="width: 50%; height: 100%; border-bottom: 1px solid #000000"
						class="dianwu-count-card"
					>
						<span class="dianwu-count-itemname">
							信号机
						</span>
						<span class="dianwu-count-item"> {{ countList.SIGNAL_NUM }}个 </span>
					</div>
				</div>
				<div class="dianwu-count-row row3">
					<div
						style="width: 100%; height: 100%"
						class="dianwu-count-card"
					>
						<span class="dianwu-count-itemname">
							道岔融雪装置
						</span>
						<span class="dianwu-count-item">
							{{ countList.SNOW_CLEAR_NUM }}个
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="g-dev-container">
			<tabs
				:tabsList="[{ id: 0, text: '4G应急通信设备' }]"
				style="height: 30px"
			></tabs>
			<div class="scrolling-table">
				<div class="scrolling-table-header">
					<div class="table-header-item" style="width: 50px">
						站段
					</div>
					<div class="table-header-item" style="width: 50px">
						车间
					</div>
					<div class="table-header-item" style="width: 50px">
						工区
					</div>
					<div class="table-header-item" style="width: 70px">
						临近车站
					</div>
					<div class="table-header-item" style="width: 50px">
						数量
					</div>
					<div class="table-header-item" style="width: 150px">
						管理人员联系电话
					</div>
				</div>
				<div class="scrolling-table-content" id="gDevContainer" @mouseover="clearAutoScroll('gDevContainer')" @mouseout="setAutoScroll('gDevContainer')">
					<div
						v-for="(dev, index) in gDevs"
						:key="index"
						class="scrolling-table-row"
            :class="{
              highlight: JSON.stringify(currentShowItem) === JSON.stringify(dev)
            }"
						@click="handleShowItem('dw_4g', dev)"
					>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.DEPOT }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.WORKSHOP }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.WORKAREA }}
						</div>
						<div class="scrolling-table-cell" style="width: 70px">
							{{ dev.STN_NAME }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.NUM }}
						</div>
						<div class="scrolling-table-cell" style="width: 150px">
							{{ dev.CONTACT }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="transponder-container">
			<tabs ref="ydqTab" :tabsList="[{ id: 0, text: '全部应答器' }, {id: 1, text: '关联应答器'}]" @titleClick="handleYdqChange" style="height: 30px">
			</tabs>
			<div class="scrolling-table">
				<div class="scrolling-table-header">
					<div class="table-header-item" style="width: 50px">
						序号
					</div>
					<div class="table-header-item" style="width: 50px">
						线名
					</div>
					<div class="table-header-item" style="width: 50px">
						编号
					</div>
					<div class="table-header-item" style="width: 80px">
						车站/区间
					</div>
					<div class="table-header-item" style="width: 50px">
						类型
					</div>
					<div class="table-header-item" style="width: 100px">
						公里标
					</div>
					<div class="table-header-item" style="width: 100px">
						关联LEU
					</div>
				</div>
				<div class="scrolling-table-content" id="transponderContainer" @mouseover="clearAutoScroll('transponderContainer')" @mouseout="setAutoScroll('transponderContainer')">
					<div
						v-for="(dev, index) in transpondersTable"
						:key="index"
						class="scrolling-table-row"
            :class="{
              highlight: JSON.stringify(currentShowItem) === JSON.stringify(dev)
            }"
						@click="handleShowItem('dw_lksb', dev)"
					>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ index + 1 }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.LINE_NAME }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.CODE }}
						</div>
						<div class="scrolling-table-cell" style="width: 80px">
							{{ dev.START_STATION_NAME }} -
							{{ dev.END_STATION_NAME }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.DEVICE_CLASSIFY }}
						</div>
						<div class="scrolling-table-cell" style="width: 100px">
							{{ dev.KILOMETER_POST }}
						</div>
						<div class="scrolling-table-cell" style="width: 100px">
							{{ dev.LEU }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="snow-dev-container">
			<tabs
				:tabsList="[{ id: 0, text: '道岔融雪设备' }]"
				style="height: 30px"
			></tabs>
			<div class="scrolling-table">
				<div class="scrolling-table-header">
					<div class="table-header-item" style="width: 100px">
						站段
					</div>
					<div class="table-header-item" style="width: 50px">
						线名
					</div>
					<div class="table-header-item" style="width: 50px">
						车站
					</div>
					<div class="table-header-item" style="width: 80px">
						道岔号
					</div>
					<div class="table-header-item" style="width: 150px">
						设备厂家
					</div>
				</div>
				<div class="scrolling-table-content" id="snowDevContainer" @mouseover="clearAutoScroll('snowDevContainer')" @mouseout="setAutoScroll('snowDevContainer')">
					<div
						v-for="(dev, index) in snowDevs"
						:key="index"
						class="scrolling-table-row"
            :class="{
              highlight: JSON.stringify(currentShowItem) === JSON.stringify(dev)
            }"
						@click="handleShowItem('dw_dccxsb', dev)"
					>
						<div class="scrolling-table-cell" style="width: 100px">
							{{ dev.DEPOT }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.LINE_NAME }}
						</div>
						<div class="scrolling-table-cell" style="width: 50px">
							{{ dev.STATION }}
						</div>
						<div class="scrolling-table-cell" style="width: 80px">
							{{ dev.CONTROL_NO }}
						</div>
						<div class="scrolling-table-cell" style="width: 150px">
							{{ dev.FACTORY }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import com from "../../../assets/com";
	import tabs from "../../../components/bigScreen/KydTabs.vue";

	export default {
		components: {
			tabs
		},
		data() {
			return {
				countList: {},
				gDevs: [],
				transponders: [],
        relatedTransponders: [],
				snowDevs: [],
				timers: {
					gDevContainer: null,
					transponderContainer: null,
					snowDevContainer: null
				},
        showYdqType: '',
        currentShowItem: {}
			};
		},
    computed: {
      currentSelectedYdq() {
        return this.$store.state.dianwu.currentSelected
      },
      transpondersTable() {
        if (this.showYdqType === '关联应答器') {
          return this.relatedTransponders
        } else {
          return this.transponders
        }
      },
      currentSelectedD() {
        return this.$store.state.dianwu.currentSelectedD
      },
      currentSelectedSb() {
        return this.$store.state.dianwu.currentSelectedSb
      }
    },
    watch: {
      'currentSelectedYdq': {
        deep: true,
        handler: function ( newVal ) {
          console.log('选择应答器', newVal)
          com.getData({
            c: 'eqeh_zxy2070',
            s: [{
              PK_ID: newVal.PK_ID,
              LINE_NAME: newVal.LINE_NAME
            }],
            url: com.kydUrl
          }, (res) => {
            if (res) {
              console.log('高亮应答器', res.data['1'])
              this.relatedTransponders = res.data['1']
              this.handleYdqChange({text: '关联应答器'})
              this.$refs['ydqTab'].setActiveItem(1)
            }
          })
        }
      },
      'currentSelectedSb': {
        deep: true,
        handler: function ( newVal ) {
          console.log('CURRENT ITEM', newVal)
          this.currentShowItem = newVal
          if (this.ifInTable('gDevs', newVal)) {
            console.log('IN GDEVS')
            let targetIndex = -1
            for (let i = 0; i < this.gDevs.length; i++) {
              if (JSON.stringify(this.gDevs[i]) === JSON.stringify(newVal)) {
                targetIndex = i
              }
            }
            console.log('INDEX', targetIndex)
            this.clearAutoScroll('gDevContainer')
            let cellHeight= document.getElementById('gDevContainer').childNodes[0].clientHeight
            // let containerHeight = document.getElementById('gDevContainer').clientHeight
            console.log('CELL HEIGHT', cellHeight)
            if (targetIndex <= 2) {
              document.getElementById('gDevContainer').scrollTop = 0
            } else {
              document.getElementById('gDevContainer').scrollTo({
                top: cellHeight * (targetIndex - 1),
                behavior: 'smooth'
              })
            }
          } else if (this.ifInTable('trans', newVal)) {
            console.log('IN TRANS')
            let targetIndex = -1
            for (let i = 0; i < this.transpondersTable.length; i++) {
              if (JSON.stringify(this.transpondersTable[i]) === JSON.stringify(newVal)) {
                targetIndex = i
              }
            }
            console.log('INDEX', targetIndex)
            this.clearAutoScroll('transponderContainer')
            let cellHeight= document.getElementById('transponderContainer').childNodes[0].clientHeight
            // let containerHeight = document.getElementById('gDevContainer').clientHeight
            console.log('CELL HEIGHT', cellHeight)
            if (targetIndex <= 2) {
              document.getElementById('transponderContainer').scrollTop = 0
            } else {
              document.getElementById('transponderContainer').scrollTo({
                top: cellHeight * (targetIndex + 1),
                behavior: 'smooth'
              })
            }
          } else if (this.ifInTable('snow', newVal)) {
            console.log('IN SNOW')
            let targetIndex = -1
            for (let i = 0; i < this.snowDevs.length; i++) {
              if (JSON.stringify(this.snowDevs[i]) === JSON.stringify(newVal)) {
                targetIndex = i
              }
            }
            console.log('INDEX', targetIndex)
            this.clearAutoScroll('snowDevContainer')
            let cellHeight= document.getElementById('snowDevContainer').childNodes[0].clientHeight
            // let containerHeight = document.getElementById('gDevContainer').clientHeight
            console.log('CELL HEIGHT', cellHeight)
            if (targetIndex <= 2) {
              document.getElementById('snowDevContainer').scrollTop = 0
            } else {
              document.getElementById('snowDevContainer').scrollTo({
                top: cellHeight * (targetIndex + 1),
                behavior: 'smooth'
              })
            }
          }
        }
      },
      'currentSelectedD': {
        deep: true,
        handler: function () {
          com.getData(
            {
              c: "eqeh_zxy2069",
              url: "https://10.192.34.79/ky203/GeneralProServlet",
              s: this.$store.state.dianwu.currentSelectedD.length === 0 ? [
                {
                  DEPOT: 'all'
                }
              ] : [
                this.$store.state.dianwu.currentSelectedD.map((d) => {
                  return {
                    DEPOT: d
                  }
                })
              ]
            },
            res => {
              if (res.success) {
                let countObj = {
                  "RAIL_INTERVAL_NUM": 0,
                  "SOURCE_RECALL_NUM": 0,
                  "SIGNAL_NUM": 0,
                  "SWITCH_NUM": 0,
                  "SG_NUM": 0,
                  "SNOW_CLEAR_NUM": 0
                }
                let fixedFields = ["RAIL_INTERVAL_NUM", "SOURCE_RECALL_NUM", "SIGNAL_NUM", "SWITCH_NUM"]
                let unfixedFields = ["SG_NUM", "SNOW_CLEAR_NUM"]
                res.data['1'].map((c, i) => {
                  if (i === 0) {
                    // for (let key in fixedFields) {
                    //   console.log(key)
                    //   countObj[key] = parseInt(countObj[key]) + parseInt(c[key])
                    // }
                    fixedFields.map((key) => {
                      countObj[key] = parseInt(countObj[key]) + parseInt(c[key])
                    })
                  }
                  unfixedFields.map((key) => {
                    countObj[key] = parseInt(countObj[key]) + parseInt(c[key])
                  })
                })
                this.countList = countObj
                // this.countList = res.data["1"][0];
              } else {
                this.$message.warning('获取电务设备统计信息失败')
              }
            }
          );
        }
      }
    },
		mounted() {
			this.getDianwuPanelData();
		},
    beforeDestroy () {
      for (let key in this.timers) {
        this.clearAutoScroll(key)
      }
    },
    methods: {
      handleYdqChange(item) {
        this.showYdqType = item.text
      },
			handleShowItem(type, data) {
        let cloneData = JSON.parse(JSON.stringify(data))
        if (this.showYdqType === '关联应答器') {
          let pk = data.PK_ID
          let originalData = this.transponders.find((t) => {
            return t.PK_ID === pk
          })
          console.log(originalData)
          if (originalData !== undefined) {
            cloneData.LON = originalData.LON
            cloneData.LAT = originalData.LAT
          }
        }
        this.currentShowItem = cloneData
				this.$emit("showItem", {
					type: type,
					data: cloneData
				});
			},
			setScrollTimers() {
        for (let key in this.timers) {
          this.setAutoScroll(key)
        }
      },
			setAutoScroll(containerId) {
				if (this.timers[containerId]) {
					clearInterval(this.timers[containerId]);
				}
				this.timers[containerId] = setInterval(() => {
					let container = document.getElementById(containerId);
					if (
						container.scrollTop + container.clientHeight >=
						container.scrollHeight
					) {
						container.scrollTop = 0;
					} else {
						container.scrollTo({
							top: container.scrollTop + 2,
							behavior: "smooth"
						});
					}
				}, 300);
			},
			clearAutoScroll(containerId) {
        if (this.timers[containerId]) {
          clearInterval(this.timers[containerId])
        }
      },
      ifInTable(type, data) {
        switch (type) {
          case 'gDevs': {
            let arr = this.gDevs.map((g) => {
              return JSON.stringify(g) === JSON.stringify(data)
            })
            return arr.includes(true)
          } break
          case 'trans': {
            let arr = this.transpondersTable.map((g) => {
              return JSON.stringify(g) === JSON.stringify(data)
            })
            return arr.includes(true)
          } break
          case 'snow': {
            let arr = this.snowDevs.map((g) => {
              return JSON.stringify(g) === JSON.stringify(data)
            })
            return arr.includes(true)
          } break
        }
      },
			getDianwuPanelData() {
        // let selectedDs = this.$store.state.dianwu.currentSelectedD
        // com.getData({
        //   c: 'eqeh_zxy2069',
        //   s: [
        //     selectedDs.map((d) => {
        //       return {
        //         DEPOT: d
        //       }
        //     })
        //   ],
        //   url: com.ADDS.servGS
        // }, (res) => {
        //
        // })
        
        let promises = [];
        console.log('统计数据单位', this.currentSelectedD)
        //
				// 获取计数数据
				promises.push(
					new Promise((resolve, reject) => {
						com.getData(
							{
								c: "eqeh_zxy2069",
								url: "https://10.192.34.79/ky203/GeneralProServlet",
                s: this.$store.state.dianwu.currentSelectedD.length === 0 ? [
                  {
                    DEPOT: 'all'
                  }
                ] :
                  this.$store.state.dianwu.currentSelectedD.map((d) => {
                    return {
                      DEPOT: d
                    }
                  })
                
							},
							res => {
								if (res.success) {
                  let countObj = {
                    "RAIL_INTERVAL_NUM": 0,
                    "SOURCE_RECALL_NUM": 0,
                    "SIGNAL_NUM": 0,
                    "SWITCH_NUM": 0,
                    "SG_NUM": 0,
                    "SNOW_CLEAR_NUM": 0
                  }
                  let fixedFields = ["RAIL_INTERVAL_NUM", "SOURCE_RECALL_NUM", "SIGNAL_NUM", "SWITCH_NUM"]
                  let unfixedFields = ["SG_NUM", "SNOW_CLEAR_NUM"]
                  res.data['1'].map((c, i) => {
                    if (i === 0) {
                      // for (let key in fixedFields) {
                      //   console.log(key)
                      //   countObj[key] = parseInt(countObj[key]) + parseInt(c[key])
                      // }
                      fixedFields.map((key) => {
                        countObj[key] = parseInt(countObj[key]) + parseInt(c[key])
                      })
                    }
                    unfixedFields.map((key) => {
                      countObj[key] = parseInt(countObj[key]) + parseInt(c[key])
                    })
                  })
                  this.countList = countObj
									// this.countList = res.data["1"][0];
									resolve();
								} else {
									reject("获取电务设备统计信息失败");
								}
							}
						);
					})
				);

				// 获取4G应急通信设备数据
				promises.push(
					new Promise((resolve, reject) => {
						com.getData(
							{
								c: "eqeh_zxy2050",
								url: "https://10.192.34.79/ky203/GeneralProServlet"
							},
							res => {
								if (res.success) {
									this.gDevs = res.data["1"];
									resolve();
								} else {
									reject("获取4G应急通信设备信息失败");
								}
							}
						);
					})
				);

				// 获取应答器数据
				promises.push(
					new Promise((resolve, reject) => {
						com.getData(
							{
								c: "eqeh_zxy2052",
								url: "https://10.192.34.79/ky203/GeneralProServlet"
							},
							res => {
								if (res.success) {
									this.transponders = res.data["1"];
									resolve();
								} else {
									reject("获取应答器信息失败");
								}
							}
						);
					})
				);

				// 获取融雪设备数据
				promises.push(
					new Promise((resolve, reject) => {
						com.getData(
							{
								c: "tyzd_zxy2033",
								s: [
									{
										LINE_NAME: "all",
										DEPOT: "all",
										STATION: "all",
										PSB_NO: "all",
										CONTROL_NAME: "all",
										CONTROL_NO: "all"
									}
								],
								url: "https://10.192.34.79/ky203/GeneralProServlet"
							},
							res => {
								if (res.success) {
									this.snowDevs = res.data["1"];
									resolve();
								} else {
									reject("获取道岔融雪设备信息失败");
								}
							}
						);
					})
				);
				Promise.all(promises)
					.then(() => {
						console.log("4G", this.gDevs);
						console.log("应答器", this.transponders);
						console.log("融雪", this.snowDevs);
            this.setScrollTimers()
					})
					.catch(e => {
						this.$message.warning(e);
					});
			}
		},
	};
</script>

<style>
	.dianwu-panel-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: flex-start;
	}

	.dianwu-title-container {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: center;
		justify-content: space-around;
		margin-top: 10px;
	}

	.dianwu-logo {
		background: url("../img/1.gif") no-repeat;
		height: 122px;
		width: 109px;
		background-size: 100% 100%;
		display: flex;
		align-content: flex-start;
		align-items: flex-start;
		justify-content: center;
	}

	.dianwu-title > span {
		color: #cd7e15;
		font-weight: bold;
		font-size: 26px;
	}

	.dianwu-count-container {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: flex-start;
		margin-top: 10px;
	}

	.dianwu-count-container .dianwu-count-row {
		width: calc(100% - 20px);
		padding-left: 10px;
		padding-right: 10px;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
	}

	.dianwu-count-card {
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: center;
		background: rgba(7, 13, 35, 0.5);
		padding: 5px;
	}

	.dianwu-count-card .dianwu-count-itemname {
		font-weight: bold;
		font-size: 16px;
	}

	.dianwu-count-card .dianwu-count-item {
		color: #0bccdc;
	}

	.g-dev-container {
		width: 100%;
		margin-bottom: 5px;
	}

	.transponder-container {
		width: 100%;
		margin-bottom: 5px;
	}

	.snow-dev-container {
		width: 100%;
		margin-bottom: 5px;
	}

	.scrolling-table {
		height: 210px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: flex-start;
	}

	.scrolling-table .scrolling-table-header {
		height: 40px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: center;
		justify-content: flex-start;
		border-bottom: 2px solid #000000;
	}

	.scrolling-table-header .table-header-item {
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
	}

	.table-header-item {
		font-weight: bold;
		color: #5b96ef;
	}

	.scrolling-table-content {
		width: 100%;
		height: 180px;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: flex-start;
		overflow-y: scroll;
	}

	.scrolling-table-content .scrolling-table-row {
		height: auto;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-content: center;
		align-items: center;
		justify-content: flex-start;
		border-bottom: 1px solid #000000;
	}
  
  .scrolling-table-row.highlight {
    background: #B0EDCF;
    color: black;
  }

	.scrolling-table-row .scrolling-table-cell {
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 3px;
		/* overflow: hidden;
			  text-overflow: ellipsis;
			  white-space: nowrap; */
	}
</style>
