export default {
	// 网格线间距
	WGX_STEP: 50,
	//选中颜色
	COLOR_SELECTED: "#ff0000",
	//文本颜色
	COLOR_FONT : "#222222",
	//填充色
	COLOR_FILL: "#FF8000",
	//线条颜色
	COLOR_LINE: "#333333",
	//线条颜色-网格线
	COLOR_LINE_WXG: "#D2DDFC",
	//文本
	FONT_TEXT: "新文本",
	//文本位置
	FONT_POSITION: [50, 50],
	//文本大小
	FONT_SIZE: 14,
	//文本粗细
	FONT_WEIGHT: 500,
	//文本内边距
	FONT_PADDING: [5, 5, 5, 5],
	//文字包围盒颜色
	FONT_BACKGROUND_COLOR: "#e6e6e6",
	//文字圆角大小
	FONT_BORDER_RADIUS: 0,
	// 元素前后顺序层级
	EL_Z:1,
	// 默认配置-线条
	DEFAULT_SHAP_LINE: {
		x1: 50,
		y1: 25,
		x2: 500,
		y2: 25
	},
	// 默认配置-圆
	DEFAULT_SHAP_CIRCLE: {
		cx: 50,
		cy: 50,
		r: 10
	},
	// 默认配置-图片
	DEFAULT_STYLE_IMAGE: {
		x: 50,
		y: 50,
		width: 50,
		height: 50,
		image: "",
		shadowColor: () => {
			return this.COLOR_SELECTED;
		}
	},
	DEFAULT_SHAP_RECT : {
		x: 50,
		y: 50,
		width: 100,
		height: 50,
	}
}
