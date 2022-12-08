<template>
	<div
		:id="className"
		style="
			background-color: rgb(255, 255, 255);
			height: 200px;
			width: 100vw;
			overflow-x: scroll;
			overflow-y: hidden;
		"
	>
		<v-stage
			:config="stageConfig"
			style="
				background-color: rgb(255, 255, 255);
				position: relative;
				top: 0;
				left: 0;
			"
			@wheel="handleZoom"
		>
			<v-layer>
				<!--        背景-->
				<v-rect
					:config="{
						x: 0,
						y: 0,
						height: 200,
						width: stageConfig.width,
						fill: 'rgb(255, 255, 255)',
					}"
				></v-rect>
				<v-rect
					:config="{
						x: 0,
						y: 200 / 3,
						height: 5,
						width: stageConfig.width,
						fillPatternImage: linePattern,
						fillPatternRepeat: 'repeat-x',
					}"
				></v-rect>
				<v-rect
					:config="{
						x: 0,
						y: 200 * 2 / 3 -3,
						height: 5,
						width: stageConfig.width,
						fillPatternImage: linePattern,
						fillPatternRepeat: 'repeat-x',
					}"
				></v-rect>
				<!--        线名-->
				<v-text
					:config="{
						x: 20,
						y: 20,
						text: lineData.LINE_NAME,
						fontSize: 30,
						fontStyle: 'bold',
						fill: 'black',
					}"
				></v-text>
				<!--        上行指示-->
				<v-text
					:config="{
						x: 20,
						y: 200 * 1 / 3 - 15,
						text: '上行',
						fontSize: 16,
						fill: 'black',
					}"
				></v-text>
				<!--        下行指示-->
				<v-text
					:config="{
						x: 20,
						y: 200 * 2 / 3 + 2,
						text: '下行',
						fontSize: 16,
						fill: 'black',
					}"
				></v-text>
				<!--        车站-->
				<Station
					v-for="(station, index) in stationConfigs"
					:key="'station' + index"
					:config="station"
				></Station>
				<!--        区间-->
				<EffectSection
					v-for="(section, index) in sectionConfigs"
					:key="'section' + index"
					:config="section"
				></EffectSection>
        <Train v-for="(train, index) in trainConfigs" :key="'train' + index" :config="train"></Train>
			</v-layer>
		</v-stage>
	</div>
</template>

<script>
	import Station from "../Station/Index";
	import EffectSection from "../Section/Index";
  import Train from '../Train/Index'
  import dayjs from 'dayjs'

	export default {
		name: "Index",
		components: {
			Station,
			EffectSection,
      Train
		},
		data() {
			return {
				// Konva Stage配置
				stageConfig: {
					red: 0,
					green: 0,
					blue: 0,
					x: 0, // Stage横坐标
					y: 0, // Stage纵坐标
					width: 0, // Stage宽度
					height: 200, // Stage高度
					draggable: false, // 是否可拖拽
				},
				// 线路配置
				config: {
					start: 0, // 起点公里标
					end: 0, // 终点公里标
					unit: 0, // 单位公里对应的像素长度
				},
				stationConfigs: [], // 车站配置
				sectionConfigs: [], // 区间配置
        trainConfigs: [],   // 车次配置
				dragConfig: {
					isMouseDown: false,
					scrollTop: 0,
					scrollLeft: 0,
					startX: 0,
					startY: 0,
					limitX: 0,
					limitY: 0,
				},
				className: "",
				linePattern: null,
			};
		},
		props: {
			// 影响线路数据
			lineData: {
				type: Object,
				default: () => {},
			},
		},
		watch: {
			lineData: {
				deep: true,
				immediate: true,
				handler: function (newVal) {
					this.refreshLine(newVal);
				},
			},
		},
		created() {},
		mounted() {
			this.setCanvasId().then(() => {
				// 在画布容器ID设置完成后，初始化拖拽事件
				this.initDragEvent();
			});
		},
		methods: {
			/**
			 * 生成随机UUID
			 */
			getUUID() {
				function S4() {
					return (((1 + Math.random()) * 0x10000) | 0)
						.toString(16)
						.substring(1);
				}

				return (
					S4() +
					S4() +
					"-" +
					S4() +
					"-" +
					S4() +
					"-" +
					S4() +
					"-" +
					S4() +
					S4() +
					S4()
				);
			},
			/**
			 * 设置画布容器ID
			 */
			setCanvasId() {
				return new Promise((resolve, reject) => {
					this.className = this.getUUID();
					let image = new window.Image();
					image.src = require("../img/linePattern.png");
					this.linePattern = image;
					console.log(this.linePattern);
					resolve();
				});
			},
			/**
			 * 初始化横向拖拽
			 */
			initDragEvent() {
				let lineContainer = document.getElementById(this.className);
				lineContainer.addEventListener("mousedown", (e) => {
					this.dragConfig.isMouseDown = true;
					this.dragConfig.limitX =
						lineContainer.scrollWidth - lineContainer.offsetWidth;
					this.dragConfig.limitY =
						lineContainer.scrollHeight - lineContainer.offsetHeight;
					this.dragConfig.startX = e.offsetX;
					this.dragConfig.startY = e.offsetY;
				});
				lineContainer.addEventListener("mousemove", (e) => {
					if (this.dragConfig.isMouseDown) {
						let offsetX = e.offsetX - this.dragConfig.startX;
						let offsetY = e.offsetY - this.dragConfig.startY;
						this.dragConfig.scrollTop =
							this.dragConfig.scrollTop - offsetY;
						this.dragConfig.scrollLeft =
							this.dragConfig.scrollLeft - offsetX;

						if (this.dragConfig.scrollTop >= this.dragConfig.limitY) {
							this.dragConfig.scrollTop = this.dragConfig.limitY;
						} else if (this.dragConfig.scrollTop <= 0) {
							this.dragConfig.scrollTop = 0;
						}

						if (this.dragConfig.scrollLeft >= this.dragConfig.limitX) {
							this.dragConfig.scrollLeft = this.dragConfig.limitX;
						} else if (this.dragConfig.scrollLeft <= 0) {
							this.dragConfig.scrollLeft = 0;
						}

						// lineContainer.scrollTop = this.dragConfig.scrollTop
						lineContainer.scrollLeft = this.dragConfig.scrollLeft;
					}
				});
				lineContainer.addEventListener("mouseup", () => {
					this.dragConfig.isMouseDown = false;
				});
				lineContainer.addEventListener("mouseout", () => {
					this.dragConfig.isMouseDown = false;
				});
			},
			/**
			 * 刷新线路图形
			 * @param {Object} data 线路数据
			 */
			refreshLine(data) {
				this.setStageWidth(data).then(() => {
					this.putStations(data.stations);
					this.putSections(data.sections);
          this.putTrains(data.trains);
				});
			},
			/**
			 * 设定画布宽度
			 * @param {Object} data 线路数据
			 */
			setStageWidth(data) {
				return new Promise((resolve, reject) => {
					let mileDic = [];
					data.stations.map((station) => {
						mileDic.push(
							station.TOP_IN_BORDER,
							station.TOP_OUT_BORDER,
							station.DOWN_IN_BORDER,
							station.DOWN_OUT_BORDER,
							station.CENTER_MILE
						);
					});
					data.sections.map((section) => {
						mileDic.push(section.S_MILE, section.E_MILE);
					});
					mileDic = mileDic.sort((a, b) => {
						if (parseFloat(a) < parseFloat(b)) {
							return -1;
						} else {
							return 1;
						}
					});
					this.config.start = parseFloat(mileDic[0]) - 10;
					this.config.end = parseFloat(mileDic[mileDic.length - 1]) + 10;
					this.config.unit =
						this.vwToPx(100) /
						(parseFloat(this.config.end) -
							parseFloat(this.config.start));
					this.stageConfig.width = this.vwToPx(100);
					resolve();
				});
			},
			/**
			 * 显示车站
			 * @param {Array} stations 车站数据
			 */
			putStations(stations) {
				this.stationConfigs = [];
				stations.map((station) => {
					this.stationConfigs.push({
						points: [
							this.mileToPx(parseFloat(station.TOP_IN_BORDER)),
							104,
							this.mileToPx(parseFloat(station.TOP_OUT_BORDER)),
							104,
							this.mileToPx(parseFloat(station.DOWN_IN_BORDER)),
							197,
							this.mileToPx(parseFloat(station.DOWN_OUT_BORDER)),
							197,
						],
						text: station.STN_NAME,
						center: this.mileToPx(parseFloat(station.CENTER_MILE)),
						metaData: station,
					});
				});
			},
			/**
			 * 显示区间
			 * @param {Array} sections 区间数据
			 */
			putSections(sections) {
				this.sectionConfigs = [];
				sections.map((section) => {
					this.sectionConfigs.push({
						start: this.mileToPx(parseFloat(section.S_MILE)),
						end: this.mileToPx(parseFloat(section.E_MILE)),
						metaData: section,
					});
				});
			},
      /**
       * 显示车次
       * @param {Array} trains 车次数据
       */
			putTrains(trains) {
        this.trainConfigs = []
        let currentSectionsDic = []
        // 获取所有车次的所在区间集合
        trains.map((train) => {
          currentSectionsDic.push(JSON.stringify({
            start: train.CURRNAME,
            end: train.NEXTNAME,
            direction: train.DIRECTION,
            startMile: train.O_KM,
            endMile: train.E_KM
          }))
        })
        currentSectionsDic = Array.from(new Set(currentSectionsDic))
        // console.log('所在区间', currentSectionsDic)
        currentSectionsDic.map((section) => {
          let s = JSON.parse(section)
          let ts = []
          let base = (parseFloat(s.startMile) + parseFloat(s.endMile)) / 2
          let sLength = parseFloat(s.endMile) - parseFloat(s.startMile)
          // 确定该区间中的车次
          trains.map((train) => {
            if (train.CURRNAME === s.start && train.NEXTNAME === s.end && train.DIRECTION === s.direction && train.O_KM === s.startMile && train.E_KM === s.endMile) {
              // 是该区间中车
              ts.push(train)
            }
          })
          ts = ts.sort((trainA, trainB) => {
            let trainADDSJ = dayjs(trainA.NEXTDDSJ, "YYYY-MM-DD HH:mm:ss").valueOf()
            let trainBDDSJ = dayjs(trainB.NEXTDDSJ, "YYYY-MM-DD HH:mm:ss").valueOf()
            return trainADDSJ - trainBDDSJ
          })
          console.log('区间车次', s, ts)
          ts.map((train, index, arr) => {
            // if (train.DIRECTION === '下') {
            //   let o = train.O_KM
            //   let e = train.E_KM
            //   train.O_KM = e
            //   train.E_KM = o
            // }
            let point = 0
            if (train.LOCAL_FLAG === '0') {
              // 车次在站
              point = this.mileToPx(parseFloat(train.O_KM))
            } else {
              // 车次在区间中
              if (arr.length === 1) {
                // 区间中只有一辆车，使用区间中点
                point = this.mileToPx(parseFloat(base))
              } else {
                // 有多辆车
                point = this.mileToPx(parseFloat(s.startMile) + (sLength/(arr.length + 1))*(index + 1))
              }
            }
            train.TYPE = this.getTrainType(train)
            this.trainConfigs.push({
              point: point,
              metaData: train
            })
          })
        })
        console.log('车次', this.trainConfigs)
      },
      getTrainType(train) {
        if (train.TRAIN_TYPE === 'K') {
          // 客车
          if (train.TRAIN.includes('D') || train.TRAIN.includes('C') || train.TRAIN.includes('G')) {
            // 高速
            return 'G'
          } else {
            // 普速
            return 'P'
          }
        } else {
          // 货车
          return 'H'
        }
      },
			/**
			 * vw单位值转换为像素单位
			 * @param {Number} vw vw值
			 */
			vwToPx(vw) {
				let clientWidth =
					window.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth;
				return vw * (clientWidth / 100);
			},
			/**
			 * 公里标转换为横坐标
			 * @param {Number} mile 公里标
			 */
			mileToPx(mile) {
				return (mile - this.config.start) * this.config.unit;
			},
			pxToMile(px) {
				return px / this.config.unit + this.config.start;
			},
			/**
			 * 滚轮横向缩放
			 * @param {MouseEvent} e 滚动事件
			 */
			handleZoom(e) {
				// 禁用默认事件回调，防止缩放画布时页面整体滚动
				e.evt.preventDefault();
				const stage = e.currentTarget.getStage();
				let oldLayerX = e.evt.offsetX;
				if (e.evt.deltaY < 0) {
					this.config.unit = this.config.unit * 1.15;
					oldLayerX = oldLayerX * 1.15;
				} else {
					this.config.unit = this.config.unit / 1.15;
					oldLayerX = oldLayerX / 1.15;
				}
				this.stageConfig.width = this.mileToPx(this.config.end);
				this.putStations(this.lineData.stations);
				this.putSections(this.lineData.sections);
        this.putTrains(this.lineData.trains);
				let lineContainer = document.getElementById(this.className);
				lineContainer.scrollLeft =
					lineContainer.scrollLeft + oldLayerX - e.evt.offsetX;
			},
			exportThisDiagram() {
				console.log("DIAGRAMS", this.$children[0].getStage().toDataURL());
				const imageURL = this.$children[0].getStage().toDataURL();
				return imageURL;
			},
			showStageInfo(e) {
				console.log(e, e.evt.layerX / e.currentTarget.attrs.width);
			},
		},
	};
</script>

<style scoped>
	::-webkit-scrollbar {
		height: 10px !important;
	}
</style>
