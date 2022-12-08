<template>
	<div
		class="graph-container"
		id="graphContainer"
		@wheel.prevent="handleScroll"
	>
		<div class="railline-container">
			<station-marker
				v-for="(station, index) in stations"
				:key="index + 'station'"
				:id="'station/' + index"
				:x="getStationMarkerX(index)"
				:station="station"
				:ref="'stationRef'"
			/>
			<section-marker
				v-for="(section, index) in sections"
				:key="index + 'section'"
				:id="'section/' + index"
				:x="getSectionMarkerX(index)"
				:attribute="section.TYPE"
				:ref="'sectionRef'"
			/>
		</div>
		<div class="envline-container">
			<div
				v-for="(env, index) in envs"
				:key="index + 'env'"
				:id="'env/' + index"
				class="env-line"
				:title="`最高行驶速度: ${(env.ENVIRONMENT === '平原' || env.ENVIRONMENT === '微丘') ? '160' : '120'}km/h`"
				:class="{
					low:
						env.ENVIRONMENT === '平原' ||
						env.ENVIRONMENT === '微丘',
					high:
						!(env.ENVIRONMENT === '平原' ||
						env.ENVIRONMENT === '微丘')
				}"
			>
				<div style="height: 30px; width: 40px; background: transparent; margin-bottom: 12px">
					<span style="font-weight: bold; font-size: 18px">
						{{ (env.ENVIRONMENT === '平原' || env.ENVIRONMENT === '微丘') ? '160' : '120' }}
					</span>
				</div>
				<!-- <div
					class="env-logo"
					:class="{
						low:
							env.ENVIRONMENT === '平原' ||
							env.ENVIRONMENT === '微丘',
						high:
							env.ENVIRONMENT === '重丘' ||
							env.ENVIRONMENT === '丘陵'
					}"
				></div> -->
			</div>
		</div>
	</div>
</template>

<script>
	import StationMarker from "./StationMarker.vue";
	import SectionMarker from "./SectionMarker.vue";
	export default {
		name: "EffectRangePreviewN",
		components: {
			StationMarker,
			SectionMarker
		},
		data() {
			return {
				/**
				 * 图片资源列表
				 */
				imgAssetsList: [{}],
				layers: {
					stage: null,
					stationLayer: null,
					sectionLayer: null,
					trainLayer: null,
					railTrainLayer: null,
					envLayer: null
				},
				stationInterval: "150px"
			};
		},
		computed: {
			/**
			 * @returns {Object} 绘图数据
			 */
			graphData() {
				let rawData = this.$store.state.earthquake.currentRenderingSection;
				return rawData;
			},
			/**
			 * @returns {Array} 区间中车站
			 */
			stations() {
				return this.graphData.STATIONLIST
			},
			/**
			 * @returns {Array} 影响车次
			 */
			trains() {
				return this.graphData.TRAINS;
			},
			/**
			 * @returns {Array} 区间列表
			 */
			sections() {
        console.log(this.graphData.SECTIONS)
				return this.graphData.SECTIONS;
			},
			/**
			 * @returns {String} 区间封锁/限速情况
			 */
			sectionAttribute() {
				return this.graphData.ATTRIBUTE;
			},
			/**
			 * @returns {Array} 高层列表
			 */
			envs() {
				return this.graphData.ENVLIST;
			}
		},
		watch: {
			trains: {
				deep: true,
				handler: function(newVal) {
					this.$nextTick(() => {
						this.$refs["sectionRef"].map(comp => {
							comp.clearTrains();
						});
						this.$refs["stationRef"].map(comp => {
							comp.clearTrains();
						});
						if (newVal.length !== 0) {
							this.$nextTick(() => {
								newVal.map((train, index) => {
									if (train.LOCAL_FLAG === "1") {
										// 区间中
										let curr = train.CURRNAME;
										let sectionIndex = this.stations.findIndex(
											s => {
												return s.STATION === curr;
											}
										);
										// console.log(curr, sectionIndex);
										if (
											sectionIndex !==
												this.stations.length - 1 &&
											sectionIndex !== -1
										) {
											// let targetRef = 'sectionRef' + sectionIndex
											// console.log(targetRef)
											// console.log(this.$refs["sectionRef"]);
											this.$refs["sectionRef"][
												sectionIndex
											].appendTrain(train);
										}
									} else {
										// 在站
										let curr = train.CURRNAME;
										let stationIndex = this.stations.findIndex(
											s => {
												return s.STATION === curr;
											}
										);
										if (stationIndex !== -1) {
											this.$refs["stationRef"][
												stationIndex
											].appendTrain(train);
										}
									}
								});
							});
						}
					});
				}
			},
			envs: {
				deep: true,
				immediate: true,
				handler: function(newVal) {
					// console.log(newVal);
					this.$nextTick(() => {
						if (newVal !== undefined && newVal.length !== 0) {
							newVal.map((env, index) => {
								this.getEnvProps(env).then(pos => {
									this.$nextTick(() => {
										// console.log(pos)
										let envInstance = document.getElementById(
											`env/${index}`
										);
										// console.log(pos);
										envInstance.style.left = pos.left;
										envInstance.style.width = pos.width;
									});
								});
							});
						}
					});
				}
			}
		},
		methods: {
			renderStage() {},
			renderStations() {},
			renderSections() {},
			renderTrains() {},
			renderRailTrains() {},
			getStationMarkerX(index) {
				return 150 * index + "px";
			},
			getSectionMarkerX(index) {
				this.getStationX("index", index).then(p => {
					// console.log(p);
					document.getElementById("section/" + index).style.left = p.left;
					document.getElementById("section/" + index).style.width =
						p.width;
					return p;
				});
			},
			getStationX(type = "index", key = 0) {
				return new Promise((resolve, reject) => {
					this.$nextTick(() => {
						switch (type) {
							case "index":
								{
									let target = document.getElementById(
										"station/" + key
									);
									let nextTarget = document.getElementById(
										"station/" + (key + 1)
									);
									if (target && nextTarget) {
										resolve({
											left:
												parseInt(
													target.style.left.split("px")[0]
												) +
												0.5 * target.clientWidth +
												"px",
											width:
												parseInt(
													nextTarget.style.left.split(
														"px"
													)[0]
												) +
												0.5 * nextTarget.clientWidth -
												(parseInt(
													target.style.left.split("px")[0]
												) +
													0.5 * target.clientWidth) +
												"px"
										});
									}
								}
								break;
							case "name": {
								let targetIndex = this.stations.findIndex(s => {
									return s.STATION === key;
								});
								// console.log(targetIndex, key);
								let target = document.getElementById(
									"station/" + key
								);
								// console.log(target);
							}
						}
					});
				});
			},
			getEnvProps(env) {
				return new Promise((resolve, reject) => {
					let start = env.O_STATION;
					let end = env.E_STATION;
					let startStationIndex = this.stations.findIndex(s => {
						return s.STATION === start;
					});
					let endStationIndex = this.stations.findIndex(s => {
						return s.STATION === end;
					});
					if (startStationIndex !== -1 && endStationIndex !== -1) {
						let startStation = document.getElementById(
							`station/${startStationIndex}`
						);
						let endStation = document.getElementById(
							`station/${endStationIndex}`
						);
						if (startStation && endStation) {
							resolve({
								left:
									parseInt(
										startStation.style.left.split("px")[0]
									) +
									0.5 * startStation.clientWidth +
									"px",
								width:
									Math.abs(
										parseInt(
											endStation.style.left.split("px")[0]
										) +
											0.5 * endStation.clientWidth -
											(parseInt(
												startStation.style.left.split(
													"px"
												)[0]
											) +
												0.5 * startStation.clientWidth)
									) + "px"
							});
						} else {
							resolve({
								left: 0,
								width: 0
							});
						}
					} else {
						resolve({
							left: 0,
							width: 0
						});
					}
				});
			},
			handleScroll(e) {
				document.getElementById("graphContainer").scrollLeft +=
					e.deltaY * 0.4;
			}
		}
	};
</script>

<style scoped>
	.graph-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow-x: scroll;
	}

	.railline-container {
		height: 70%;
		width: 100%;
		position: relative;
	}

	.envline-container {
		height: 30%;
		width: 100%;
		position: relative;
	}

	.graph-container::-webkit-scrollbar {
		height: 0px;
		background: transparent;
	}

	.graph-container::-webkit-scrollbar-thumb {
		background: #4eabf8;
	}

	.graph-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.env-line {
		position: absolute;
		height: 4px;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
	}

	.env-line.low {
		background: #b9e896;
	}
	.env-line.high {
		background: #ffa338;
	}

	.env-line .env-logo {
		height: 12px;
		width: 21px;
	}

	.env-logo.low {
		background: url("../imgs/Weiqiu.png") no-repeat;
		background-size: 100% 100%;
	}

	.env-logo.high {
		background: url("../imgs/Pingyuan.png") no-repeat;
		background-size: 100% 100%;
	}
</style>
