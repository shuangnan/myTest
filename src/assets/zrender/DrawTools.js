//vue实例，在组件created的时候调用setVue传入
let vm = null;
import $ from "jquery";
import * as zrender from "zrender";
import config from "./DrawConfig";
export default {
	x: 0, //拖拽滚动-x
	y: 0, //拖拽滚动-y
	isCanMove: false, //拖拽滚动-是否可移动
	key_Ctrl: false,
	key_Alt: false,
	// 初始化vue实例为vm
	setVue(v) {
		vm = vm ? vm : v;
	},

	/**
	 * 实例化画布
	 * @param {Object} el
	 */
	initCanvas(opts) {
		vm.zr = zrender.init(opts.el);
		vm.zr.elClick = opts.elClick;
		// 存放元素容器
		vm.groupDraw = new zrender.Group();
		vm.$nextTick(() => {
			vm.zr.add(vm.groupDraw);
			opts.done && opts.done.call();
		});
	},

	/**
	 * 绘制直线
	 * @param {Object} p
	 */
	getDrawLine(p) {
		const _this = this;
		var obj = new zrender.Line({
			z:p.z || config.EL_Z,
			shape: Object.assign({}, config.DEFAULT_SHAP_LINE, p.shape),
			style: Object.assign({
				shadowColor: config.COLOR_SELECTED,
				stroke: config.COLOR_LINE,
				lineWidth: 1,
			}, p),
			draggable: p.drag ? true : false,
			type: "line",
			typeText: p.typeText || "直线",
		}).on("click", function() {
			vm.zr.elClick(this);
		});
		return obj
	},
	/**
	 * 绘制圆
	 * @param {Object} p 
	 */
	getDrawCircle(p) {
		const _this = this;
		const obj = new zrender.Circle({
			z:p.z || config.EL_Z,
			shape: Object.assign({}, config.DEFAULT_SHAP_CIRCLE, p.shape),
			style: Object.assign({
				shadowColor: config.COLOR_SELECTED,
				stroke: config.COLOR_LINE,
				fill: config.COLOR_FILL,
			}, p),
			draggable: p.drag ? true : false,
			type: "circle",
			typeText: p.typeText || "圆"
		}).on("click", function() {
			vm.zr.elClick(this);
		});
		return obj;
	},
	/**
	 * 绘制文字
	 * @param {*} x 
	 * @param {*} y 
	 * @param {*} text 
	 */
	getDrawText(p) {
		const _this = this;
		const text = new zrender.Text({
			z:p.z || config.EL_Z,
			position: p.position || config.FONT_POSITION,
			style: Object.assign({
				shadowColor: config.COLOR_SELECTED,
				text: p.text || config.FONT_TEXT, //文本
				textFill: p.textFill || config.COLOR_FONT, //文本颜色
				fontSize: p.fontSize || config.FONT_SIZE, //文本大小
				fontWeight: p.fontWeight || config.FONT_WEIGHT, //文字粗细
				// textBackgroundColor: p.textBackgroundColor || config.FONT_BACKGROUND_COLOR, //文字包围盒颜色
				// textPadding: p.textPadding || config.FONT_PADDING, //文字内边距
				// textBorderRadius: p.textBorderRadius || config.FONT_BORDER_RADIUS, //文字圆角大小
				// 以下为默认属性
				textBorderColor: "", //文字包围盒描边颜色
				textBorderWidth: 1 //文字包围盒描边宽度
			}, p),
			draggable: p.drag ? true : false,
			type: "text",
			typeText: p.typeText || "文本",
		}).on("click", function() {
			vm.zr.elClick(this);
		});
		// text.animate("style", true)
		// 	.when(1000, {
		// 		opacity: 0.1
		// 	}).when(3000, {
		// 		opacity: 1
		// 	}).start();
		return text;
	},
	/**
	 * 绘制图片
	 * @param {Object} p style:图片属性,drag:是否可拖拽
	 */
	getDrawImage(p, isBg) {
		// 是否为图层背景
		if (isBg) {
			const obj = new zrender.Image({
				zlevel: -2,
				style: p.style,
				draggable: false,
				type: "image",
				typeText: p.typeText
			})
			return obj;
		}
		const _this = this;
		const obj = new zrender.Image({
			z:p.z || config.EL_Z,
			style: Object.assign({}, config.DEFAULT_STYLE_IMAGE, p.style),
			draggable: p.drag ? true : false,
			type: "image",
			typeText: p.typeText || "图片"
		}).on("click", function() {
			vm.zr.elClick(this);
		});
		return obj;
	},
	/**
	 * 绘制矩形
	 * @param {Object} p style:矩形属性
	 */
	getDrawRect(p){
		const _this = this;
		const obj = new zrender.Rect({
			z:p.z || config.EL_Z,
			shape: Object.assign({}, config.DEFAULT_SHAP_RECT, p.shape),
			style: Object.assign({
				shadowColor: config.COLOR_SELECTED,
				fill: p.fill || config.RECT_BACKGROUND_COLOR, //背景色
				text: p.text, //文本
				textFill: p.textFill || config.COLOR_FONT, //文本颜色
				fontSize: p.fontSize || config.FONT_SIZE, //文本大小
				fontWeight: p.fontWeight || config.FONT_WEIGHT, //文字粗细
				textPadding: p.textPadding || config.FONT_PADDING, //文字内边距
			}, p),
			draggable: p.drag ? true : false,
			type: "rect",
			typeText: p.typeText || "矩形"
		}).on("click", function() {
			vm.zr.elClick(this);
		});
		return obj;
	},
	/**
	 * 拖拽滚动
	 * @param {Object} scrollEl 滚动容器
	 * @param {Object} dragEl 拖拽对象
	 */
	dragScroll(scrollEl, dragEl) {
		$(dragEl).bind("mousedown", () => {
			this.x = event.clientX;
			this.y = event.clientY;
			this.isCanMove = true;
		}).bind("mousemove", () => {
			if (this.isCanMove) {
				const sx = event.clientX - this.x;
				const sy = event.clientY - this.y;
				this.x = event.clientX;
				this.y = event.clientY;
				const scrollObj = $(scrollEl);
				$(scrollEl).scrollLeft(scrollObj.scrollLeft() - sx);
				$(scrollEl).scrollTop(scrollObj.scrollTop() - sy);
			}
		}).bind("mouseup", () => {
			this.isCanMove = false;
		}).bind("mousewheel", (ev) => {
			// event.preventDefault();
			// const e = event.wheelDelta / 1000;
			// if (e < 0 && mm.base.scale >= 0.5 || e > 0 && mm.base.scale <= 3) {
			// 	mm.base.scale += e;
			// 	setZoom();
			// }
		});
	}
}
