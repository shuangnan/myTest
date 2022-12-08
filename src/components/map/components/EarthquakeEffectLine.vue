<!-- 
 * @created：	2022年1月13日
 * @author：	chenpy
 * @version:	v1.0
 * @desc:		地震影响线路区段
 -->
<template>
	<div style="width: 100%; height: 100%">
		<v-stage
			:config="{
				width: konvaConfigs.width,
				height: konvaConfigs.height,
			}"
			ref="earthquakeEffectLine"
		>
			
			<!-- 影响区段图 -->
			<v-layer
				:config="{
					width: konvaConfigs.width,
					height: konvaConfigs.height,
				}"
				@wheel="zoomLine($event)"
				@mousedown="enableScroll($event)"
				@mousemove="dragScroll($event)"
				@mouseup="disableScroll($event)"
				@mouseleave="disableScroll($event)"
				ref="effectLine"
			>
				<!-- 上下行线路铁路线背景 -->
				<v-rect
					:config="konvaConfigs.baseLine[0]"
					ref="baseLine0"
				></v-rect>
				<v-rect
					:config="konvaConfigs.baseLine[1]"
					ref="baseLine1"
				></v-rect>
				<!-- 避示区间 -->
				<v-rect
					v-for="line in konvaConfigs.lines"
					:config="line"
					:key="JSON.stringify(line)"
					@click="clickQJ(line, $event)"
					@mouseenter="showQjGLB(line, $event, true)"
					@mouseleave="showQjGLB(line, $event, false)"
				></v-rect>
				<!-- 区间点 -->
				<v-image
					v-for="qj in konvaConfigs.qjs"
					:config="qj"
					:key="JSON.stringify(qj)"
					@click="clickQJPoint(qj, $event)"
				></v-image>

				<!-- 车站 -->
				<v-group
					v-for="stn in konvaConfigs.stns"
					:key="JSON.stringify(stn)"
					@click="clickStn(stn, $event)"
				>
					<v-image :config="stn.stn"></v-image>
					<v-text :config="stn.text"></v-text>
				</v-group>
				<!-- 公里标 -->
				<v-text
					v-for="text in konvaConfigs.texts"
					:config="text"
					:key="JSON.stringify(text)"
					@click="clickGLB(text, $event)"
					:ref="text.ID"
					:title="text.text"
				></v-text>
				<!-- 继电器 -->
				<v-image
					v-for="jdq in konvaConfigs.jdqs"
					:config="jdq"
					:key="JSON.stringify(jdq)"
					@click="clickJDQ(jdq, $event)"
					@mouseenter="hoverJDQ(jdq, $event)"
					@mouseleave="disHoverJDQ(jdq, $event)"
				></v-image>
				<!-- 按钮 -->
				
			</v-layer>
			<!-- 左右方向箭头和文本 -->
			<v-layer>
				<v-image
					:config="konvaConfigs.leftArrow"
					@click="scrollLeft"
				></v-image>
				<v-text :config="konvaConfigs.leftArrow.text"></v-text>
				<v-image
					:config="konvaConfigs.rightArrow"
					@click="scrollRight"
				></v-image>
				<v-text :config="konvaConfigs.rightArrow.text"></v-text>
				<v-image
					v-for="button in konvaConfigs.button"
					:config="button"
					:key="JSON.stringify(button)"
					@click="clickButton(button)"
					ref="resetButton"
				></v-image>
			</v-layer>
		</v-stage>
	</div>
</template>

<script>
	// 这里引用各种资源
	import com from "./../../../assets/com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				/**
				 * 画布konva canvas配置
				 */
				konvaConfigs: {
					/**
					 * 画布宽度
					 */
					width: 1230,
					/**
					 * 画布高度
					 */
					height: 180,
					/**
					 * 区间线段
					 */
					lines: [],
					/**
					 * 上下行线路背景
					 */
					baseLine: [],
					/**
					 * 继电器
					 */
					jdqs: [],
					/**
					 * 车站
					 */
					stns: [],
					/**
					 * 公里标
					 */
					texts: [],
					/**
					 * 区间点
					 */
					qjs: [],
					/**
					 * 横轴缩放
					 */
					scaleX: 1,
					/**
					 * 纵轴缩放
					 */
					scaleY: 1,
					leftArrow: {
						x: 0,
						y: 5,
						height: 10,
						width: 40,
						image: null,
						text: {
							x: 50,
							y: 5,
							text: "",
							fontSize: 15,
							fill: "white",
						},
					},
					rightArrow: {
						x: 1230 - 40,
						y: 5,
						height: 10,
						width: 40,
						image: null,
						text: {
							x: 1230 - 40 - 70,
							y: 5,
							text: "",
							fontSize: 15,
							fill: "white",
						},
					},
					button: [],
				},
				qjPointImage1: null,
				jdqPointImage: null,
				stnPointImage: null,
				railBImage: null,
				arrowLeftImage: null,
				arrowRightImage: null,
				railRImage: null,
				jdqEnableImage: null,
				jdqDisableImage: null,
				railSlowedImage: null,
				railBlockedImage: null,
				resetButtonImage: null,
				nowScale: 1,
				scroll: false,
				scrollStartPoint: {
					x: 0,
					y: 0,
				},
				layerPosition: {
					x: 0,
					y: 0,
				},
				jdqDic: [
					// {
					// 	CODE: "CGW010XJ",
					// 	UP_MIL_END_N: "275494",
					// 	UP_MIL_START_N: "267548",
					// 	DOWN_MIL_END_N: "276479",
					// 	DOWN_MIL_START_N: "266906",
					// },
				],
				effectedData: [],
			};
		},
		// 属性
		props: {
			lid: {
				type: String,
				default: "20020",
			},
			effectFiled: {
				type: Array,
			},
			effectedJdq: {},
			earthID: {
				type: String,
			},
			lno: {},
			effectLines: {
				type: Array,
			},
			edit: {
				type: Boolean,
				default: true
			}
		},
		// 组件挂载完毕
		mounted() {
			this.initPatterns();
			this.createEffectLine(this.lid);
		},
		created() {
			this.initPatterns();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			showStnGlb(text, e, ifShow) {
				this.konvaConfigs.texts.map((t) => {
					if (t.id === text.id && t.type === "STN_GLB") {
						t.rotation = ifShow ? 0 : 270;
						t.fontSize = ifShow ? 12 : 6;
						t.scaleX = 1 / this.nowScale;
					}
				});
			},
			/**
			 * 点击区间
			 * @param {Object} qj 点击的区间Object
			 * @param {Event} e 点击事件
			 */
			clickQJ(qj, e) {
				this.dispatchEvent({
					type: "qjClicked",
					param: qj,
					event: e,
				});
				// if (this.scroll === true) {
				// 	this.highlightQJ(qj.id, qj.fillPatternImage ? false : true);
				// }
			},

			showQjGLB(qj, e, ifShow) {
				console.log(qj);
				this.konvaConfigs.texts.map((text) => {
					if (text.id === qj.id) {
						text.fill = ifShow ? "white" : "transparent";
						text.scaleX = 1 / this.nowScale;
					}
				});
			},

			/**
			 * 点击区间点
			 * @param {Object} qjPoint 点击的区间点Object
			 * @param {Event} e 点击事件
			 */
			clickQJPoint(qjPoint, e) {
				this.dispatchEvent({
					type: "qjPointClicked",
					param: qjPoint,
					event: e,
				});
			},

			/**
			 * 点击继电器
			 * @param {Object} jdq 点击的继电器Object
			 * @param {Event} e 点击事件
			 */
			clickJDQ(jdq, e) {
				this.dispatchEvent({
					type: "jdqClicked",
					param: jdq,
					event: e,
				});
				if (jdq.effected && this.edit) {
					/**
					 * 恢复受影响的继电器
					 */
					this.$confirm("确认恢复该继电器吗？", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					}).then(() => {
						com.getPromiseData({
							c: "eqeh_zxy9004",
							s: [
								this.earthID,
								"1",
								this.lno.toString(),
								jdq.params.CODE,
							],
						});
						// if (this.effectedJdq.length !== 1) {
						// 	com.getPromiseData({
						// 		c: "eqeh_zxy9004",
						// 		s: [
						// 			this.earthID,
						// 			"1",
						// 			this.lno.toString(),
						// 			jdq.params.CODE,
						// 		],
						// 	});
						// } else {
						// 	com.getPromiseData({
						// 		c: "eqeh_zxy9004",
						// 		s: [this.earthID, "0", this.lno.toString()],
						// 	});
						// }
					});
				}
				// this.highlightJdq(jdq.params.CODE, true)
				// let upClickable = false;
				// let downClickable = false
				// /**
				//  * 判断继电器操控范围是否包含地震影响区段
				//  */
				// const [effectStart, effectEnd] = this.effectFiled
				// this.jdqDic.map((j) => {
				// 	if (j.CODE === jdq.params.CODE) {
				// 		/**
				// 		 * 继电器控制范围的两个端点公里标如果有落在地震影响范围内的，则有重合区域
				// 		 */
				// 		if ((effectStart <= parseInt(j.UP_MIL_START_N) && parseInt(j.UP_MIL_START_N) <= effectEnd) || (effectStart <= parseInt(j.UP_MIL_END_N) && parseInt(j.UP_MIL_END_N) <= effectEnd)) {
				// 			upClickable = true
				// 		}
				// 		if ((effectStart <= parseInt(j.DOWN_MIL_START_N) && parseInt(j.DOWN_MIL_START_N) <= effectEnd) || (effectStart <= parseInt(j.DOWN_MIL_END_N) && parseInt(j.DOWN_MIL_END_N) <= effectEnd)) {
				// 			downClickable = true
				// 		}
				// 	}
				// })
				// if (upClickable && downClickable) {
				// 	console.log("是影响的继电器")
				// 	this.konvaConfigs.jdqs.map((j) => {
				// 		if (j.params.CODE === jdq.params.CODE) {
				// 			if (
				// 				j.image === this.jdqPointImage ||
				// 				j.image === this.jdqDisableImage
				// 			) {
				// 				/**
				// 				 * 状态0 点击后继电器开
				// 				 */
				// 				console.log("继电器开启");
				// 				j.image = this.jdqEnableImage;
				// 				this.highlightJdq(jdq.params.CODE, true);
				// 			} else if (j.image === this.jdqEnableImage) {
				// 				/**
				// 				 * 状态1 继电器开点击后继电器合
				// 				 */
				// 				console.log("继电器闭合");
				// 				j.image = this.jdqDisableImage;
				// 				this.highlightJdq(jdq.params.CODE, false);
				// 			}
				// 		}
				// 	});
				// }
			},

			hoverJDQ(jdq, e) {
				console.log(jdq);
				// this.konvaConfigs.jdqs.map((j) => {
				// 	if (j.params.CODE === jdq.params.CODE) {
				// 		if (j.image === this.jdqPointImage || j.image === this.jdqDisableImage) {
				// 			/**
				// 			 * 状态0 点击后继电器开
				// 			 */
				// 			console.log("继电器开启")
				// 			j.image = this.jdqEnableImage
				// 			this.highlightJdq(jdq.params.CODE, true)
				// 		} else if (j.image === this.jdqEnableImage) {
				// 			/**
				// 			 * 状态1 继电器开点击后继电器合
				// 			 */
				// 			console.log("继电器闭合")
				// 			j.image = this.jdqDisableImage
				// 			this.highlightJdq(jdq.params.CODE, false)
				// 		}
				// 	}
				// })
				this.highlightJdq(jdq.params.CODE, true);
				this.konvaConfigs.texts.map((j) => {
					if (j.id === jdq.id) {
						j.fill = "white";
						j.scaleX = 1 / this.nowScale;
					}
				});
				// this.konvaConfigs.jdqs.map((j) => {
				// 	if (j.params.CODE === jdq.params.CODE) {
				// 		console.log("SHADOW", j.shadowEnabled)
				// 		j.shadowEnabled = true
				// 	}
				// })
			},

			disHoverJDQ(jdq, e) {
				this.highlightJdq(jdq.params.CODE, false);
				this.konvaConfigs.texts.map((j) => {
					if (j.id === jdq.id) {
						j.fill = "transparent";
						j.scaleX = 1 / this.nowScale;
					}
				});
				// this.konvaConfigs.jdqs.map((j) => {
				// 	if (j.params.CODE === jdq.params.CODE) {
				// 		console.log("SHADOW", j.shadowEnabled)
				// 		j.shadowEnabled = false
				// 	}
				// })
			},

			/**
			 * 点击车站
			 * @param {Object} stn 点击的车站Object
			 * @param {Event} e 点击事件
			 */
			clickStn(stn, e) {
				this.dispatchEvent({
					type: "stnClicked",
					param: stn,
					event: e,
				});
			},

			/**
			 * 点击公里标
			 * @param {Object} glb 点击的公里标Object
			 * @param {Event} e 点击事件
			 */
			clickGLB(glb, e) {
				this.dispatchEvent({
					type: "glbClicked",
					param: glb,
					event: e,
				});
			},

			/**
			 * 触发组件事件并回传给父组件
			 * @param {Object} event 事件内容，包括事件类型和相关数据
			 */
			dispatchEvent(event) {
				console.log(event);
				this.$emit("earthquakeEffectLineClicked", event);
			},

			/**
			 * 显示/隐藏公里标
			 * @param {Object} glb 公里标Object
			 * @param {Boolean} ifShow 是否显示
			 * @param {Event} e 鼠标事件
			 */
			showGLB(glb, ifShow, e) {
				console.log(e);
				const scale = this.nowScale; // 当前画布缩放倍率
				if (ifShow) {
					/**
					 * 显示公里标
					 * 1. 文本旋转至横向（270 -> 360）
					 * 2. 文本放大 (6 -> 12)
					 * 3. 修正横向和纵向缩放防止文字被拉抻 (横向缩放：当前画布缩放倍率的倒数；纵向缩放：旋转前的纵向缩放倍率 * 当前画布缩放倍率)
					 */
					e.target.rotation(0);
					e.target.fontSize(15);
					e.target.position({
						x: e.target.x(),
						y: e.target.y() - 10,
					});
					e.target.scaleX(1 / scale);
					e.target.scaleY(e.target.attrs.scaleY * scale);
				} else {
					/**
					 * 隐藏公里标
					 * 1. 文本旋转至纵向 (360 -> 270)
					 * 2. 文本缩小 (12 -> 6)
					 * 3. 修正横向和纵向缩放防止文字被拉抻 (横向缩放：1；纵向缩放：当前画布缩放倍率的倒数)
					 */
					console.log("Y", e.target.attrs.y);
					e.target.rotation(e.target.attrs.y < 50 ? 270 : 90);
					e.target.fontSize(6);
					e.target.position({
						x: e.target.x(),
						y: e.target.y() + 10,
					});
					e.target.scaleX(1);
					e.target.scaleY(1 / scale);
				}
			},

			clickButton(button) {
				if (button.params.CODE === "return" && this.edit) {
					/**
					 * 恢复全部
					 */
					// this.konvaConfigs.lines.map((line) => {
					// 	this.highlightQJ(line.id, false);
					// });
					// this.konvaConfigs.jdqs.map((jdq) => {
					// 	jdq.image = this.jdqPointImage;
					// });
					this.dispatchEvent({
						type: "resetAll",
					});
					this.$confirm("确定恢复该地震所有影响线路？", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					}).then(() => {
						console.log(this.jdqDic)
						let jdqs = []
						this.jdqDic.map((jdq) => {
							jdqs.push(jdq.CODE)
						})
						console.log(jdqs)
						// debugger
						com.getPromiseData({
							c: "eqeh_zxy9004",
							s: [this.earthID, "2", this.lno.toString(), jdqs.join(',')],
						});
					});
					// this.highlightEffectfiled(this.effectFiled, true)
				}
			},

			/**
			 * 缩放事件
			 * @param {Event} e 鼠标滚动事件
			 */
			zoomLine(e) {
				console.log("ZOOM", e);
				e.evt.preventDefault();
				if (e.currentTarget.getClassName() === "Layer") {
					console.log("ZOOM AVA", e, e.currentTarget.getClassName());
					/**
					 * 缩放事件仅限影响区段图部分
					 */
					const layer = e.currentTarget;
					const scaleBy = 1.05;
					let oldScale = layer.scaleX(); // 之前的缩放倍率
					let pointer = layer.getStage().getPointerPosition(); // 当前指针位置
					/**
					 * 计算缩放后指针位置，保证缩放以指针所在位置为中心
					 */
					let mousePointTo = {
						x: (pointer.x - layer.x()) / oldScale,
						y: (pointer.y - layer.y()) / oldScale,
					};
					let direction = e.evt.deltaY > 0 ? -1 : 1; // 确定放大还是缩小
					/**
					 * 求新的缩放倍数
					 * 1. 放大时，新的缩放倍数 = 老的缩放倍数 * 1.05
					 * 2. 缩小时，新的缩放倍数 = 老的缩放倍数 / 1.05
					 * 3. 新的缩放倍数 < 1 时，修正为 1 (不能比原大小更小)
					 */
					let newScale =
						direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
					if (newScale < 1) {
						newScale = 1;
					}
					this.nowScale = newScale;
					layer.scaleX(newScale);
					/**
					 * 画布移动到指针处
					 */
					let newPos = {
						x: pointer.x - mousePointTo.x * newScale,
						y: 0,
					};
					layer.position(newPos);
					/**
					 * 修复画布中元素的横向拉抻
					 */
					layer.children.map((ele) => {
						if (ele.getClassName() === "Image") {
							/**
							 * 单独的图片元素（区段点、继电器、铁路线）：当前宽度除以缩放倍数 = 原宽度
							 */
							const width = ele.attrs.params.width;
							ele.width(width / newScale);
						}
						if (ele.getClassName() === "Group") {
							/**
							 * 车站
							 * 1. 车站图片宽度除以当前缩放倍数，横轴偏移除以当前缩放倍数
							 * 2. 站名文本横向缩放倍数除以当前缩放倍数恢复1倍缩放
							 */
							const children = ele.getChildren();
							// console.log("GROUP CHILDREN", children)
							children.map((node) => {
								if (node.getClassName() === "Image") {
									const width = node.attrs.params.width;
									const offsetX = node.attrs.params.offsetX;
									node.width(width / newScale);
									node.offsetX(offsetX / newScale);
								}
								if (node.getClassName() === "Text") {
									// const offsetX = node.attrs.params.textOffsetX
									// console.log(offsetX)
									node.scaleX(1 / newScale);
									// node.offsetX(offsetX / newScale)
								}
							});
						}
						if (ele.getClassName() === "Text") {
							/**
							 * 公里标
							 * 1. 隐藏状态的公里标由于横纵颠倒，恢复纵向缩放
							 * 2. 显示状态的公里标恢复横向缩放
							 */
							ele.scaleX(1 / newScale);
							const rotate = ele.rotation();
							if (rotate === 270 || rotate === 90) {
								ele.scaleY(1 / newScale);
								// ele.scaleX(1 / newScale);
							} else {
								ele.scaleX(1 / newScale);
								// ele.scaleY(1 / newScale);
							}
						}
					});
				}
			},

			/**
			 * 允许拖移滚动
			 * @param {Event} e 点击事件
			 */
			enableScroll(e) {
				if (e.evt) {
					console.log("SCROLL ENABLE", e);
					this.scrollStartPoint.x = e.evt.layerX;
					console.log("EFF", this.$refs["effectLine"].getNode());
					this.layerPosition.x = this.$refs["effectLine"]
						.getNode()
						.position().x;
					this.scroll = true;
				}
			},

			/**
			 * 拖移滚动
			 * @param {Event} e 鼠标移动事件
			 */
			dragScroll(e) {
				// console.log(e)
				if (this.scroll && e.evt) {
					console.log(e);
					const scroll = {
						x: e.evt.layerX,
					};
					const delta = {
						x: -(this.scrollStartPoint.x - scroll.x),
					};
					console.log("SCROLL DELTA", delta);
					const layer = this.$refs["effectLine"];
					layer.getNode().x(this.layerPosition.x + delta.x);
				}
			},

			/**
			 * 禁用拖移滚动
			 * @param {Event} e 鼠标松开/离开事件
			 */
			disableScroll(e) {
				// console.log("DISABLE SCROLL", e)
				this.scroll = false;
			},

			/**
			 * 点击左箭头向左滚动
			 */
			scrollLeft() {
				const layer = this.$refs["effectLine"];
				layer.getNode().x(layer.getStage().position().x + 40);
			},

			/**
			 * 点击右箭头向右滚动
			 */
			scrollRight() {
				const layer = this.$refs["effectLine"];
				layer.getNode().x(layer.getStage().position().x - 40);
			},

			/**
			 * 双击重置缩放和拖移
			 */
			resetView() {
				const layer = this.$refs["effectLine"];
				layer.getNode().x(0);
				layer.getNode().scaleX(1);
				layer.getNode().children.map((ele) => {
					if (ele.getClassName() === "Image") {
						const width = ele.attrs.params.width;
						ele.width(width);
					}
					if (ele.getClassName() === "Group") {
						const children = ele.getChildren();
						children.map((node) => {
							if (node.getClassName() === "Image") {
								const width = node.attrs.params.width;
								const offsetX = node.attrs.params.offsetX;
								node.width(width);
								node.offsetX(offsetX);
							}
							if (node.getClassName() === "Text") {
								node.scaleX(1);
							}
						});
					}
					if (ele.getClassName() === "Text") {
						// const rotate = ele.rotation();
						// if (rotate === 270 || rotate === 90) {
						// 	ele.scaleY(1);
						// } else {
						// 	ele.scaleX(1);
						// }
						ele.scaleX(1);
					}
				});
			},
			/* @info  数据处理区-----------------------------------*/
			/**
			 * 初始化图片素材
			 */
			initPatterns() {
				let qjPoint1 = new window.Image();
				let jdqPoint = new window.Image();
				let stnPoint = new window.Image();
				let railBPattern = new window.Image();
				let arrowLeft = new window.Image();
				let arrowRight = new window.Image();
				let railRPattern = new window.Image();
				let jdqDisable = new window.Image();
				let jdqEnable = new window.Image();
				let railXS = new window.Image();
				let railQFB = new window.Image();
				let reset = new window.Image();
				qjPoint1.src = require("../img/qjLine.png");
				jdqPoint.src = require("../img/jdq.png");
				stnPoint.src = require("../img/stn.png");
				railBPattern.src = require("../img/railB.png");
				arrowLeft.src = require("../img/arrow-right.png");
				arrowRight.src = require("../img/arrow-left.png");
				railRPattern.src = require("../img/railR.png");
				jdqDisable.src = require("../img/jdqDis.png");
				jdqEnable.src = require("../img/jdqEna.png");
				railXS.src = require("../img/railXS.png");
				railQFB.src = require("../img/railQFB.png");
				reset.src = require("../img/resetButton.png");
				this.railSlowedImage = railXS;
				this.railBlockedImage = railQFB;
				this.qjPointImage1 = qjPoint1;
				this.jdqPointImage = jdqPoint;
				this.stnPointImage = stnPoint;
				this.railBImage = railBPattern;
				this.arrowLeftImage = arrowLeft;
				this.arrowRightImage = arrowRight;
				this.konvaConfigs.leftArrow.image = this.arrowLeftImage;
				this.konvaConfigs.rightArrow.image = this.arrowRightImage;
				this.railRImage = railRPattern;
				this.jdqEnableImage = jdqEnable;
				this.jdqDisableImage = jdqDisable;
				this.resetButtonImage = reset;
			},

			/**
			 * 加载底图数据
			 * @param {String} lid 线ID
			 */
			createEffectLine(lid) {
				com.getPromiseData({
					c: "eqeh_zxy2005",
					s: [[lid]],
				}).then((res) => {
					if (res) {
						const effectLineData = res["1"];
						let qjPoints = [];
						let jdqPoints = [];
						let stnPoints = [];
						let directionText = [];
						let texts = [];
						let buttonText = [];
						effectLineData.map((ele) => {
							/**
							 * 接口返回数据按照TYPE筛选
							 */
							if (ele.TYPE == 2) {
								jdqPoints.push(ele);
							}
							if (ele.TYPE == 6) {
								qjPoints.push(ele);
							}
							if (ele.TYPE == 101) {
								stnPoints.push(ele);
							}
							if (ele.TYPE == 202) {
								texts.push(ele);
							}
							if (ele.TYPE == 204) {
								directionText.push(ele);
							}
							if (ele.TYPE == 9) {
								buttonText.push(ele);
							}
						});
						console.log("QJP", qjPoints);
						console.log("JDQ", jdqPoints);
						console.log("STN", stnPoints);
						console.log("TEXTS", texts);
						console.log("DIRECTIONS", directionText);
						console.log("BUTTONTEXT", buttonText);
						const button = buttonText[0];

						let qjLineYDics = [];
						let qjPointXDics = [];
						let linePointsY1 = [];
						let linePointsY2 = [];
						let glbYdics = [];
						qjPoints.map((qjPoint) => {
							/**
							 * 整理区间点横纵坐标字典
							 */
							qjLineYDics.push(parseInt(qjPoint.Y));
							qjPointXDics.push(parseInt(qjPoint.X));
							glbYdics.push(parseInt(qjPoint.Y));
						});
						qjLineYDics = Array.from(new Set(qjLineYDics)).sort(
							(a, b) => {
								return a > b ? 1 : -1;
							}
						);
						qjPointXDics = Array.from(new Set(qjPointXDics)).sort(
							(a, b) => {
								return a > b ? 1 : -1;
							}
						);
						console.log("QJLINE YS", qjLineYDics);
						console.log("QJXS", qjPointXDics);
						let jdqYDics = [];
						jdqPoints.map((jdqPoint) => {
							jdqYDics.push(parseInt(jdqPoint.Y));
						});
						jdqYDics = Array.from(new Set(jdqYDics)).sort((a, b) => {
							return a > b ? 1 : -1;
						});

						texts.map((text) => {
							glbYdics.push(parseInt(text.Y));
						});
						glbYdics = Array.from(new Set(glbYdics)).sort((a, b) => {
							return a > b ? 1 : -1;
						});
						console.log("GLB YS", glbYdics);
						console.log("JDQ YS", jdqYDics);
						const canvasHeight = jdqYDics[jdqYDics.length - 1]; // 继电器位于画布最下方，通过继电器纵坐标最大值确定原画布高度
						const canvasWidth = qjPointXDics[qjPointXDics.length - 1]; // 通过区间点横坐标最大值确定原画布宽度
						let leftDirectionText = "";
						let rightDirectionText = "";
						/**
						 * 确定线路方向文本
						 */
						directionText.map((d) => {
							if (parseInt(d.X) < 0.5 * canvasWidth) {
								leftDirectionText = d.TEXT;
							} else {
								rightDirectionText = d.TEXT;
							}
						});
						this.konvaConfigs.leftArrow.text.text = leftDirectionText;
						this.konvaConfigs.rightArrow.text.text = rightDirectionText;
						console.log("CANVAS", canvasHeight, canvasWidth);
						console.log("LEFT", leftDirectionText);
						console.log("RIGHT", rightDirectionText);
						/**
						 * 依据视图中画布实际大小确定缩放因子
						 */
						const canvasScaleX = this.konvaConfigs.width / canvasWidth;
						const canvasScaleY =
							this.konvaConfigs.height / canvasHeight;
						this.konvaConfigs.scaleX = canvasScaleX;
						this.konvaConfigs.scaleY = canvasScaleY;
						this.konvaConfigs.button.push({
							x: parseInt(button.X) * canvasScaleX - 50,
							y: 0,
							width: 69 * 0.7,
							height: 31 * 0.7,
							params: button,
							image: this.resetButtonImage,
						});
						/**
						 * 生成 Konva canvas 区间点
						 */
						qjPoints.map((qjPoint, index, points) => {
							(qjPoint.width = 2), (qjPoint.height = 7);

							const id = com.getUuid();
							qjPoint.ID = id;
							this.konvaConfigs.qjs.push({
								x: parseInt(qjPoint.X) * canvasScaleX,
								y:
									parseInt(qjPoint.Y) == parseInt(qjLineYDics[0])
										? 31
										: 56,
								image: this.qjPointImage1,
								width: 2,
								height: 7,
								params: qjPoint,
								id: id,
							});
							if (parseInt(qjPoint.Y) == parseInt(qjLineYDics[0])) {
								linePointsY1.push(qjPoint);
							} else {
								linePointsY2.push(qjPoint);
							}
							// texts.push({
							// 	CODE: "",
							// 	CONTENT: "",
							// 	ID: id,
							// 	SUBTYPE: "0",
							// 	TEXT: qjPoint.GLB_TEXT.split(",")[0],
							// 	TX: qjPoint.TX,
							// 	TY: qjPoint.TY,
							// 	TYPE: "202",
							// 	X: qjPoint.X,
							// 	Y: qjPoint.Y,
							// });
						});
						/**
						 * 生成两个方向线路的铁路线纹理
						 */
						qjLineYDics.map((line, index) => {
							this.konvaConfigs.baseLine.push({
								x: 0,
								y: index === 0 ? 30 + 3 : 55 + 3,
								width: this.konvaConfigs.width,
								height: 10,
								fillPatternImage: this.railBImage,
								fillPatternRepeat: "repeat-x",
								params: line,
								id: index.toString(),
							});
						});
						linePointsY1.sort((a, b) => {
							return parseInt(a.X) - parseInt(b.X) > 0 ? 1 : -1;
						});
						linePointsY2.sort((a, b) => {
							return parseInt(a.X) - parseInt(b.X) > 0 ? 1 : -1;
						});
						/**
						 * 生成两个方向上的区间
						 */
						linePointsY1.map((point, index, points) => {
							if (index < linePointsY1.length - 2) {
								let pA = point;
								let pB = points[index + 1];
								const id = com.getUuid();

								if (pA.GLB === "") {
									/**
									 * 起始点没有公里标，用上一个点的
									 */
									pA.GLB = points[index - 1].GLB;
								}

								if (pB.GLB === "") {
									/**
									 * 结束点没有公里标，用下一个点的
									 */
									pB.GLB = points[index + 2].GLB;
								}

								this.konvaConfigs.lines.push({
									x: parseInt(pA.X) * canvasScaleX,
									y:
										parseInt(pA.Y) == parseInt(qjLineYDics[0])
											? 30 + 3
											: 55,
									height: 10,
									width:
										parseInt(pB.X) * canvasScaleX -
										parseInt(pA.X) * canvasScaleX,
									fill: "transparent",
									params: {
										pA: pA,
										pB: pB,
									},
									// id: pA.CONTENT,
									id: id,
									filed: [parseInt(pA.GLB), parseInt(pB.GLB)],
									shadowColor: "white",
									shadowBlur: 5,
									shadowEnabled: false,
								});

								this.konvaConfigs.texts.push({
									x: parseInt(pA.X) * canvasScaleX,
									y:
										parseInt(pA.Y) == parseInt(qjLineYDics[0])
											? 30 - 15
											: 55,
									text:
										pA.GLB_TEXT.split(",")[0] +
										"-" +
										pB.GLB_TEXT.split(",")[0],
									fill: "transparent",
									fontSize: 12,
									id: id,
								});
							}
						});
						linePointsY2.map((point, index, points) => {
							if (index < linePointsY2.length - 2) {
								let pA = point;
								let pB = points[index + 1];
								const id = com.getUuid();
								this.konvaConfigs.lines.push({
									x: parseInt(pA.X) * canvasScaleX,
									y:
										parseInt(pA.Y) == parseInt(qjLineYDics[0])
											? 30
											: 55 + 3,
									height: 10,
									width:
										parseInt(pB.X) * canvasScaleX -
										parseInt(pA.X) * canvasScaleX,
									fill: "transparent",
									params: {
										pA: pA,
										pB: pB,
									},
									// id: pA.CONTENT,
									id: id,
									filed: [parseInt(pA.GLB), parseInt(pB.GLB)],
									shadowColor: "white",
									shadowBlur: 5,
									shadowEnabled: false,
								});

								this.konvaConfigs.texts.push({
									x: parseInt(pA.X) * canvasScaleX,
									y:
										parseInt(pA.Y) == parseInt(qjLineYDics[0])
											? 30 - 7
											: 70,
									text:
										pA.GLB_TEXT.split(",")[0] +
										"-" +
										pB.GLB_TEXT.split(",")[0],
									fill: "transparent",
									fontSize: 12,
									id: id,
								});
							}
						});
						/**
						 * 生成继电器
						 */
						jdqPoints.map((jdqPoint) => {
							jdqPoint.width = 20;
							jdqPoint.height = 20;
							this.konvaConfigs.jdqs.push({
								x: parseInt(jdqPoint.X) * canvasScaleX,
								y: 70,
								image: this.jdqPointImage,
								width: 20,
								height: 20,
								params: jdqPoint,
								id: jdqPoint.CODE,
								shadowColor: "white",
								shadowBlur: 15,
								shadowEnabled: false,
								effected: false,
							});
							this.konvaConfigs.texts.push({
								x: parseInt(jdqPoint.X) * canvasScaleX,
								offsetX: 45,
								y: 75,
								text: jdqPoint.TEXT,
								fill: "transparent",
								params: jdqPoint,
								id: jdqPoint.CODE,
							});
						});
						let stnGlb = [];
						for (let i = 0; i < texts.length; i++) {
							if (parseInt(texts[i].Y) === parseInt(glbYdics[0])) {
								stnGlb.push({
									x: parseInt(texts[i].X) * canvasScaleX,
									y:
										parseInt(texts[i].Y) ===
										parseInt(glbYdics[0])
											? 20
											: 63,

									fontSize: 12,
									text: texts[i].TEXT,
									params: texts[i],
									fill: "white",
									id: com.getUuid(),
									scaleX: 1,
									scaleY: 1,
									type: "STN_GLB",
								});
							}
						}
						stnGlb.sort((a, b) => {
							return a.x - b.x > 0 ? 1 : -1;
						});
						console.log("STNGLBS", stnGlb, stnPoints);
						// texts.map((text) => {
						// 	// if (parseInt(text.Y) === parseInt(glbYdics[0])) {
						// 	// 	this.konvaConfigs.texts.push({
						// 	// 		x: parseInt(text.X) * canvasScaleX,
						// 	// 		y:
						// 	// 			parseInt(text.Y) === parseInt(glbYdics[0])
						// 	// 				? 30
						// 	// 				: 55,
						// 	// 		rotation: 270,
						// 	// 		fontSize: 6,
						// 	// 		text: text.TEXT,
						// 	// 		params: text,
						// 	// 		fill: "white",
						// 	// 		id: text.ID,
						// 	// 		scaleX: 1,
						// 	// 		scaleY: 1,
						// 	// 	});
						// 	// }
						// 	console.log(text)
						// 	if (parseInt(text.Y) === parseInt(glbYdics[0])) {
						// 		stnGlb.push({
						// 			x: parseInt(text.X) * canvasScaleX,
						// 			y:
						// 				parseInt(text.Y) === parseInt(glbYdics[0])
						// 					? 20
						// 					: 63,

						// 			fontSize: 12,
						// 			text: text.TEXT,
						// 			params: text,
						// 			fill: "white",
						// 			id: com.getUuid(),
						// 			scaleX: 1,
						// 			scaleY: 1,
						// 			type: "STN_GLB",
						// 		});
						// 	} else {
						// 		stnGlb.push({type: "NULL"})
						// 	}
						// });
						/**
						 * 生成车站
						 */
						stnPoints
							.filter((stn) => {
								return parseInt(stn.Y) === 80;
							})
							.sort((a, b) => {
								return parseInt(a.X) - parseInt(b.X) > 0 ? 1 : -1;
							})
							.map((stnPoint, index) => {
								stnPoint.height = 34;
								stnPoint.width = 12;
								stnPoint.offsetX = 5;
								stnPoint.textOffsetX = 12;
								console.log(index, stnGlb[index]);
								const glb = stnGlb[index].text;
								this.konvaConfigs.stns.push({
									stn: {
										x: parseInt(stnPoint.X) * canvasScaleX,
										y: 30,
										image: this.stnPointImage,
										height: 34,
										width: 12,
										params: stnPoint,
										id: stnPoint.ID,
										offsetX: 5,
									},
									text: {
										x: parseInt(stnPoint.X) * canvasScaleX,
										y: 42,
										text: stnPoint.TEXT + " (" + glb + ")",
										fill: "white",
										params: stnPoint,
										fontSize: 11,
										id: stnPoint.ID,
										offsetX: -12,
									},
									params: stnPoint,
								});
							});
						/**
						 * 生成公里标
						 */

						console.log("CONFIGS", this.konvaConfigs);
						setTimeout(() => {
							/**
							 * 更新所有图片纹理填充
							 */
							console.log(
								this.$refs["earthquakeEffectLine"].getStage()
							);
							this.$refs["earthquakeEffectLine"]
								.getStage()
								.batchDraw();
							this.$forceUpdate();
							console.log(
								this.$refs["baseLine0"]
									.getNode()
									.fillPatternImage(this.railBImage)
							);
							this.$refs["baseLine0"]
								.getNode()
								.fillPatternImage(this.railBImage);
							this.$refs["baseLine1"]
								.getNode()
								.fillPatternImage(this.railBImage);
								console.log(this.$refs["resetButton"][0].getNode())
							this.$refs["resetButton"][0].getNode().moveToBottom()
							// this.highlightEffectfiled([190000, 330000])
						}, 500);
					}
				});
			},
			/* @info  数据交互区-----------------------------------*/
			/**
			 * 高亮指定区间
			 * @param {String} UUID 区间UUID
			 */
			highlightQJ(UUID, ifShow) {
				// console.log("FOUND", UUID)
				this.konvaConfigs.lines.map((qj) => {
					// console.log("FOUND", UUID)
					if (qj.id === UUID) {
						// console.log("HIGHT", qj.highlighted);
						// console.log("FOUND", UUID, qj, ifShow)
						if (ifShow) {
							qj.fillPatternImage = qj.effected
								? this.railRImage
								: qj.blocked
								? this.railBlockedImage
								: qj.slowed
								? this.railSlowedImage
								: null;
							qj.fillPatternRepeat =
								qj.effected || qj.blocked || qj.slowed
									? "repeat-x"
									: null;
							qj.fill =
								qj.effected || qj.blocked || qj.slowed
									? ""
									: "transparent";
							qj.shadowEnabled = qj.highlighted;
						} else {
							qj.shadowEnabled = false;
						}
					}
				});
			},

			/**
			 * 根据公里标范围高亮影响区段
			 * @param {Array} effectFiled 影响区段的公里标范围
			 */
			highlightEffectfiled(effectFiled, ifShow, type) {
				const [effectStart, effectEnd] = effectFiled;
				console.log(effectStart, effectEnd);
				console.log(this.konvaConfigs.lines);
				let lineYDic = Array.from(
					new Set(
						this.konvaConfigs.lines.map((qj) => {
							return parseInt(qj.y);
						})
					)
				);
				const lines1 = this.konvaConfigs.lines.filter((qj) => {
					return parseInt(qj.y) === lineYDic[0];
				});
				const lines2 = this.konvaConfigs.lines.filter((qj) => {
					return parseInt(qj.y) === lineYDic[1];
				});
				let line1StartIndex = 0;
				let line1EndIndex = lines1.length;
				let line2StartIndex = 0;
				let line2EndIndex = lines2.length;
				lines1.map((qj, index) => {
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectStart &&
						effectStart <= qj.filed[1]
					) {
						/**
						 * 高亮起始区段
						 */
						line1StartIndex = index;
						// console.log("LINE1 高亮起点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectEnd &&
						effectEnd <= qj.filed[1]
					) {
						/**
						 * 高亮终点区段
						 */
						line1EndIndex = index;
						// console.log("LINE1 高亮终点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
				});
				lines2.map((qj, index) => {
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectStart &&
						effectStart <= qj.filed[1]
					) {
						/**
						 * 高亮起始区段
						 */
						line2StartIndex = index;
						// console.log("LINE2 高亮起点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectEnd &&
						effectEnd <= qj.filed[1]
					) {
						/**
						 * 高亮终点区段
						 */
						line2EndIndex = index;
						// console.log("LINE2 高亮终点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
				});
				lines1.map((qj, index) => {
					if (line1StartIndex <= index && index <= line1EndIndex) {
						// console.log("HIGHTLIGHT QJ", index, qj)
						qj.slowed = type == 3;
						qj.blocked = type == 2;
						qj.highlighted = false;
						qj.effected = false;
						this.highlightQJ(qj.id, ifShow);
					}
				});
				lines2.map((qj, index) => {
					if (line2StartIndex <= index && index <= line2EndIndex) {
						qj.slowed = type == 3;
						qj.blocked = type == 2;
						qj.highlighted = false;
						qj.effected = false;
						this.highlightQJ(qj.id, ifShow);
					}
				});
			},

			/**
			 * 根据公里标范围高亮上行线路影响区段
			 * @param {Array} effectFiled 影响区段的公里标范围
			 */
			highlightEffectfiledUp(effectFiled, ifShow, highlightType) {
				const [effectStart, effectEnd] = effectFiled;
				// console.log(effectStart, effectEnd);
				// console.log(this.konvaConfigs.lines);
				let lineYDic = Array.from(
					new Set(
						this.konvaConfigs.lines.map((qj) => {
							return parseInt(qj.y);
						})
					)
				);
				const lines1 = this.konvaConfigs.lines.filter((qj) => {
					return parseInt(qj.y) === lineYDic[0];
				});
				// const lines2 = this.konvaConfigs.lines.filter((qj) => {
				// 	return parseInt(qj.y) === lineYDic[1]
				// })
				let line1StartIndex = 0;
				let line1EndIndex = lines1.length;
				// let line2StartIndex = 0
				// let line2EndIndex = lines2.length
				lines1.map((qj, index) => {
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectStart &&
						effectStart <= qj.filed[1]
					) {
						/**
						 * 高亮起始区段
						 */
						line1StartIndex = index;
						// console.log("LINE1 高亮起点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectEnd &&
						effectEnd <= qj.filed[1]
					) {
						/**
						 * 高亮终点区段
						 */
						line1EndIndex = index;
						// console.log("LINE1 高亮终点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
				});
				// lines2.map((qj, index) => {
				// 	if ((isNaN(qj.filed[0]) === false && isNaN(qj.filed[1]) === false) && (qj.filed[0] <= effectStart && effectStart <= qj.filed[1])) {
				// 		/**
				// 		 * 高亮起始区段
				// 		 */
				// 		line2StartIndex = index
				// 		console.log("LINE2 高亮起点", qj, index)
				// 		// this.highlightQJ(qj.id, true)
				// 	}
				// 	if ((isNaN(qj.filed[0]) === false && isNaN(qj.filed[1]) === false) && (qj.filed[0] <= effectEnd && effectEnd <= qj.filed[1])) {
				// 		/**
				// 		 * 高亮终点区段
				// 		 */
				// 		line2EndIndex = index
				// 		console.log("LINE2 高亮终点", qj, index)
				// 		// this.highlightQJ(qj.id, true)
				// 	}
				// })
				lines1.map((qj, index) => {
					if (line1StartIndex <= index && index <= line1EndIndex) {
						// console.log("HIGHTLIGHT QJ", index, qj)
						if (highlightType === "effect") {
							qj.effected = ifShow;
							qj.highlighted = false;
						} else if (highlightType === "highlight") {
							qj.highlighted = ifShow;
						} else if (highlightType === "block") {
							qj.blocked = true;
							qj.highlighted = false;
						} else if (highlightType === "speed") {
							qj.slowed = true;
							qj.highlighted = false;
						}
						this.highlightQJ(qj.id, ifShow);
					}
				});
				// lines2.map((qj, index) => {
				// 	if (line2StartIndex <= index && index <= line2EndIndex) {
				// 		this.highlightQJ(qj.id, ifShow)
				// 	}
				// })
			},

			/**
			 * 根据公里标范围高亮下行线路影响区段
			 * @param {Array} effectFiled 影响区段的公里标范围
			 */
			highlightEffectfiledDown(effectFiled, ifShow, highlightType) {
				const [effectStart, effectEnd] = effectFiled;
				// console.log(effectStart, effectEnd);
				// console.log(this.konvaConfigs.lines);
				let lineYDic = Array.from(
					new Set(
						this.konvaConfigs.lines.map((qj) => {
							return parseInt(qj.y);
						})
					)
				);
				// const lines1 = this.konvaConfigs.lines.filter((qj) => {
				// 	return parseInt(qj.y) === lineYDic[0]
				// })
				const lines2 = this.konvaConfigs.lines.filter((qj) => {
					return parseInt(qj.y) === lineYDic[1];
				});
				// let line1StartIndex = 0
				// let line1EndIndex = lines1.length
				let line2StartIndex = 0;
				let line2EndIndex = lines2.length;
				// lines1.map((qj, index) => {
				// 	if ((isNaN(qj.filed[0]) === false && isNaN(qj.filed[1]) === false) && (qj.filed[0] <= effectStart && effectStart <= qj.filed[1])) {
				// 		/**
				// 		 * 高亮起始区段
				// 		 */
				// 		line1StartIndex = index
				// 		console.log("LINE1 高亮起点", qj, index)
				// 		// this.highlightQJ(qj.id, true)
				// 	}
				// 	if ((isNaN(qj.filed[0]) === false && isNaN(qj.filed[1]) === false) && (qj.filed[0] <= effectEnd && effectEnd <= qj.filed[1])) {
				// 		/**
				// 		 * 高亮终点区段
				// 		 */
				// 		line1EndIndex = index
				// 		console.log("LINE1 高亮终点", qj, index)
				// 		// this.highlightQJ(qj.id, true)
				// 	}
				// })
				lines2.map((qj, index) => {
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectStart &&
						effectStart <= qj.filed[1]
					) {
						/**
						 * 高亮起始区段
						 */
						line2StartIndex = index;
						// console.log("LINE2 高亮起点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
					if (
						isNaN(qj.filed[0]) === false &&
						isNaN(qj.filed[1]) === false &&
						qj.filed[0] <= effectEnd &&
						effectEnd <= qj.filed[1]
					) {
						/**
						 * 高亮终点区段
						 */
						line2EndIndex = index;
						// console.log("LINE2 高亮终点", qj, index);
						// this.highlightQJ(qj.id, true)
					}
				});
				// lines1.map((qj, index) => {
				// 	if (line1StartIndex <= index && index <= line1EndIndex) {
				// 		// console.log("HIGHTLIGHT QJ", index, qj)
				// 		this.highlightQJ(qj.id, ifShow)
				// 	}
				// })
				lines2.map((qj, index) => {
					if (line2StartIndex <= index && index <= line2EndIndex) {
						if (highlightType === "effect") {
							qj.effected = ifShow;
							qj.highlighted = false;
						} else if (highlightType === "highlight") {
							qj.highlighted = ifShow;
						} else if (highlightType === "block") {
							qj.blocked = true;
							qj.highlighted = false;
						} else if (highlightType === "speed") {
							qj.slowed = true;
							qj.highlighted = false;
						}
						this.highlightQJ(qj.id, ifShow);
					}
				});
			},

			highlightJdq(jdqID, ifShow) {
				console.log("CLICKED JDQ", jdqID);
				const jdqs = this.jdqDic;
				jdqs.map((jdq) => {
					if (jdq.CODE === jdqID) {
						/**
						 * 高亮继电器控制的公里标指示的区段
						 */
						this.highlightEffectfiledUp(
							[
								parseInt(jdq.UP_MIL_START_N),
								parseInt(jdq.UP_MIL_END_N),
							],
							ifShow,
							"highlight"
						);
						this.highlightEffectfiledDown(
							[
								parseInt(jdq.DOWN_MIL_START_N),
								parseInt(jdq.DOWN_MIL_END_N),
							],
							ifShow,
							"highlight"
						);
					}
				});
			},

			highlightEffectedJdq(jdqID, ifShow) {
				// console.log("CLICKED JDQ", jdqID);
				const jdqs = this.jdqDic;
				jdqs.map((jdq) => {
					const type =
						jdq.LIMIT_LEVEL == 1
							? "effect"
							: jdq.LIMIT_LEVEL == 2
							? "block"
							: "speed";
					if (jdq.CODE === jdqID) {
						/**
						 * 高亮继电器控制的公里标指示的区段
						 */
						this.highlightEffectfiledUp(
							[
								parseInt(jdq.UP_MIL_START_N),
								parseInt(jdq.UP_MIL_END_N),
							],
							ifShow,
							type
						);
						this.highlightEffectfiledDown(
							[
								parseInt(jdq.DOWN_MIL_START_N),
								parseInt(jdq.DOWN_MIL_END_N),
							],
							ifShow,
							type
						);
						this.konvaConfigs.jdqs.map((j) => {
							if (j.params.CODE === jdq.CODE) {
								j.shadowEnabled = true;
							}
						});
					}
				});
			},

			moveToGlb(glb) {
				let errorArray = []
				this.konvaConfigs.qjs.map((qjPoint) => {
					// console.log("比较区间点", qjPoint)
					// console.log(Math.abs(parseInt(glb) - parseInt(qjPoint.params.GLB)))
					errorArray.push({
						error: Math.abs(parseInt(glb) - parseInt(qjPoint.params.GLB)),
						x: parseInt(qjPoint.x)
					})
				})
				errorArray = errorArray.sort((a, b) => {return a.error - b.error > 0 ? 1 : -1}).filter((error) => {return isNaN(error.error) === false})
				const errorMin = errorArray[0]
				// console.log("目标区间点", errorMin)
				this.$refs["effectLine"].getNode().x(-errorMin.x + this.konvaConfigs.width / 2)
			}
		},
		// 监视属性
		watch: {
			edit(v){
				// alert(v)
			},
			lid(newVal) {
				this.createEffectLine(newVal);
			},
			effectFiled(newVal) {
				// this.highlightEffectfiled(newVal, true);
				/**
				 * 画布转移至起点
				 */
				const startGlb = parseInt(newVal[0])
				const endGlb = parseInt(newVal[1])
				console.log("转移至公里标", parseInt((startGlb + endGlb) / 2))
				this.moveToGlb(parseInt((startGlb + endGlb) / 2))
				// this.moveToGlb(parseInt(startGlb))
			},
			effectLines(newVal) {
				this.effectedData = newVal;
				console.log("影响范围更新", this.effectedData);
				/**
				 * 复原所有区段高亮
				 */
				this.konvaConfigs.lines.map((line) => {
					line.fillPatternImage = null;
					line.fillPatternRepeat = "";
					line.fill = "transparent";
					line.effected = false;
				});
				/**
				 * 复原全部继电器显示
				 */
				this.konvaConfigs.jdqs.map((jdq) => {
					jdq.image = this.jdqPointImage;
					jdq.shadowEnabled = false;
					jdq.effected = false;
					// jdq.scaleX = 1 / this.nowScale
				});
				/**
				 * 绘制影响区间
				 */
				const effected = this.effectedData.filter((effect) => {
					return effect.LEVEL == 1;
				});
				const blocked = this.effectedData.filter((effect) => {
					return effect.LEVEL == 2;
				});
				const slowed = this.effectedData.filter((effect) => {
					return effect.LEVEL == 3;
				});

				/**
				 * 先绘制限速区段
				 */
				slowed.map((effect) => {
					this.highlightEffectfiled(
						[
							parseInt(effect.glbS.LINE_M),
							parseInt(effect.glbE.LINE_M),
						],
						true,
						"3"
					);
				});

				/**
				 * 再绘制封锁区段
				 */
				effected.map((effect) => {
					this.jdqDic = effect.jdq;
					this.jdqDic.map((jdq) => {
						this.konvaConfigs.jdqs.map((j) => {
							if (j.params.CODE === jdq.CODE) {
								// console.log(jdq);
								j.image = this.jdqEnableImage;
								j.shadowEnabled = true;
								j.effected = jdq.LIMIT_LEVEL == 1;
								j.slowed = jdq.LIMIT_LEVEL == 3;
								j.blocked = jdq.LIMIT_LEVEL == 2;
								this.highlightEffectedJdq(jdq.CODE, true);
							}
						});
					});
				});

				/**
				 * 最后绘制禁入区段
				 */
				blocked.map((effect) => {
					this.highlightEffectfiled(
						[
							parseInt(effect.glbS.LINE_M),
							parseInt(effect.glbE.LINE_M),
						],
						true,
						"2"
					);
				});
				// this.effectedData.map((effect) => {

				// 	if (effect.LEVEL == 3) {
				// 		/**
				// 		 * 限速区段
				// 		 */
				// 		this.highlightEffectfiled([parseInt(effect.glbS.LINE_M), parseInt(effect.glbE.LINE_M)], true, "3")
				// 	} else if (effect.LEVEL == 1) {
				// 		/**
				// 		 * 封锁区段
				// 		 */
				// 		this.jdqDic = effect.jdq;
				// 		this.jdqDic.map((jdq) => {
				// 			this.konvaConfigs.jdqs.map((j) => {
				// 				if (j.params.CODE === jdq.CODE) {
				// 					// console.log(jdq);
				// 					j.image = this.jdqEnableImage;
				// 					j.shadowEnabled = true;
				// 					j.effected = jdq.LIMIT_LEVEL == 1;
				// 					j.slowed = jdq.LIMIT_LEVEL == 3;
				// 					j.blocked = jdq.LIMIT_LEVEL == 2;
				// 					this.highlightEffectedJdq(jdq.CODE, true);
				// 				}
				// 			});
				// 		});
				// 	} else if (effect.LEVEL == 2) {
				// 		/**
				// 		 * 检测车进入区段
				// 		 */
				// 		this.highlightEffectfiled([parseInt(effect.glbS.LINE_M), parseInt(effect.glbE.LINE_M)], true, "2")
				// 	}
				// });
				this.resetView();
			},
			effectedJdq(newVal) {
				console.log("N JDQ", typeof newVal, this.lno);
				if (newVal == 2 || newVal == 3) {
					this.konvaConfigs.lines.map((line) => {
						line.fillPatternImage = null;
						line.fillPatternRepeat = "";
						line.fill = "transparent";
						line.effected = false;
					});
					this.highlightEffectfiled(this.effectFiled, true, newVal);
					this.konvaConfigs.jdqs.map((jdq) => {
						// jdq.image = this.jdqPointImage;
						// jdq.shadowEnabled = false;
						jdq.effected = false;
						jdq.slowed = newVal == 3;
						jdq.blocked = newVal == 2;
						// jdq.scaleX = 1 / this.nowScale
					});
					this.jdqDic = [];
					this.resetView();
				} else {
					/**
					 * 封锁区段
					 */
					this.jdqDic = newVal;
					this.konvaConfigs.lines.map((line) => {
						line.fillPatternImage = null;
						line.fillPatternRepeat = "";
						line.fill = "transparent";
						line.effected = false;
					});
					this.konvaConfigs.jdqs.map((jdq) => {
						jdq.image = this.jdqPointImage;
						jdq.shadowEnabled = false;
						jdq.effected = false;
						// jdq.scaleX = 1 / this.nowScale
					});
					newVal.map((jdq) => {
						this.konvaConfigs.jdqs.map((j) => {
							if (j.params.CODE === jdq.CODE) {
								console.log(jdq);
								j.image = this.jdqEnableImage;
								j.shadowEnabled = true;
								j.effected = jdq.LIMIT_LEVEL == 1;
								j.slowed = jdq.LIMIT_LEVEL == 3;
								j.blocked = jdq.LIMIT_LEVEL == 2;
								this.highlightEffectedJdq(jdq.CODE, true);
							}
						});
					});
					this.resetView();
				}
			},
		},
		// 计算属性
		computed: {},
	};
</script>

<!-- 私有样式 -->
<style scoped="scoped">
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
