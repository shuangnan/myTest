var geoCoordMap = {
	'上海': [121.4648, 31.2891],
	'东莞': [113.8953, 22.901],
	'东营': [118.7073, 37.5513],
	'中山': [113.4229, 22.478],
	'临汾': [111.4783, 36.1615],
	'临沂': [118.3118, 35.2936],
	'丹东': [124.541, 40.4242],
	'丽水': [119.5642, 28.1854],
	'乌鲁木齐': [87.9236, 43.5883],
	'佛山': [112.8955, 23.1097],
	'保定': [115.0488, 39.0948],
	'兰州': [103.5901, 36.3043],
	'包头': [110.3467, 41.4899],
	'北京': [116.4551, 40.2539],
	'北海': [109.314, 21.6211],
	'南京': [118.8062, 31.9208],
	'南宁': [108.479, 23.1152],
	'南昌': [116.0046, 28.6633],
	'南通': [121.1023, 32.1625],
	'厦门': [118.1689, 24.6478],
	'台州': [121.1353, 28.6688],
	'合肥': [117.29, 32.0581],
	'呼和浩特': [111.4124, 40.4901],
	'咸阳': [108.4131, 34.8706],
	'哈尔滨': [127.9688, 45.368],
	'唐山': [118.4766, 39.6826],
	'嘉兴': [120.9155, 30.6354],
	'大同': [113.7854, 39.8035],
	'大连': [122.2229, 39.4409],
	'天津': [117.4219, 39.4189],
	'太原': [112.3352, 37.9413],
	'威海': [121.9482, 37.1393],
	'宁波': [121.5967, 29.6466],
	'宝鸡': [107.1826, 34.3433],
	'宿迁': [118.5535, 33.7775],
	'常州': [119.4543, 31.5582],
	'广州': [113.5107, 23.2196],
	'廊坊': [116.521, 39.0509],
	'延安': [109.1052, 36.4252],
	'张家口': [115.1477, 40.8527],
	'徐州': [117.5208, 34.3268],
	'德州': [116.6858, 37.2107],
	'惠州': [114.6204, 23.1647],
	'成都': [103.9526, 30.7617],
	'扬州': [119.4653, 32.8162],
	'承德': [117.5757, 41.4075],
	'拉萨': [91.1865, 30.1465],
	'无锡': [120.3442, 31.5527],
	'日照': [119.2786, 35.5023],
	'昆明': [102.9199, 25.4663],
	'杭州': [119.5313, 29.8773],
	'枣庄': [117.323, 34.8926],
	'柳州': [109.3799, 24.9774],
	'株洲': [113.5327, 27.0319],
	'武汉': [114.3896, 30.6628],
	'汕头': [117.1692, 23.3405],
	'江门': [112.6318, 22.1484],
	'沈阳': [123.1238, 42.1216],
	'沧州': [116.8286, 38.2104],
	'河源': [114.917, 23.9722],
	'泉州': [118.3228, 25.1147],
	'泰安': [117.0264, 36.0516],
	'泰州': [120.0586, 32.5525],
	'济南': [117.1582, 36.8701],
	'济宁': [116.8286, 35.3375],
	'海口': [110.3893, 19.8516],
	'淄博': [118.0371, 36.6064],
	'淮安': [118.927, 33.4039],
	'深圳': [114.5435, 22.5439],
	'清远': [112.9175, 24.3292],
	'温州': [120.498, 27.8119],
	'渭南': [109.7864, 35.0299],
	'湖州': [119.8608, 30.7782],
	'湘潭': [112.5439, 27.7075],
	'滨州': [117.8174, 37.4963],
	'潍坊': [119.0918, 36.524],
	'烟台': [120.7397, 37.5128],
	'玉溪': [101.9312, 23.8898],
	'珠海': [113.7305, 22.1155],
	'盐城': [120.2234, 33.5577],
	'盘锦': [121.9482, 41.0449],
	'石家庄': [114.4995, 38.1006],
	'福州': [119.4543, 25.9222],
	'秦皇岛': [119.2126, 40.0232],
	'绍兴': [120.564, 29.7565],
	'聊城': [115.9167, 36.4032],
	'肇庆': [112.1265, 23.5822],
	'舟山': [122.2559, 30.2234],
	'苏州': [120.6519, 31.3989],
	'莱芜': [117.6526, 36.2714],
	'菏泽': [115.6201, 35.2057],
	'营口': [122.4316, 40.4297],
	'葫芦岛': [120.1575, 40.578],
	'衡水': [115.8838, 37.7161],
	'衢州': [118.6853, 28.8666],
	'西宁': [101.4038, 36.8207],
	'西安': [109.1162, 34.2004],
	'贵阳': [106.6992, 26.7682],
	'连云港': [119.1248, 34.552],
	'邢台': [114.8071, 37.2821],
	'邯郸': [114.4775, 36.535],
	'郑州': [113.4668, 34.6234],
	'鄂尔多斯': [108.9734, 39.2487],
	'重庆': [107.7539, 30.1904],
	'金华': [120.0037, 29.1028],
	'铜川': [109.0393, 35.1947],
	'银川': [106.3586, 38.1775],
	'镇江': [119.4763, 31.9702],
	'长春': [125.8154, 44.2584],
	'长沙': [113.0823, 28.2568],
	'长治': [112.8625, 36.4746],
	'阳泉': [113.4778, 38.0951],
	'青岛': [120.4651, 36.3373],
	'韶关': [113.7964, 24.7028]
};

var BJData = [
	[{
		name: '北京'
	}, {
		name: '上海',
		value: 95
	}],
	[{
		name: '北京'
	}, {
		name: '广州',
		value: 90
	}],
	[{
		name: '北京'
	}, {
		name: '大连',
		value: 80
	}],
	[{
		name: '北京'
	}, {
		name: '南宁',
		value: 70
	}],
	[{
		name: '北京'
	}, {
		name: '南昌',
		value: 60
	}],
	[{
		name: '北京'
	}, {
		name: '拉萨',
		value: 50
	}],
	[{
		name: '北京'
	}, {
		name: '长春',
		value: 40
	}],
	[{
		name: '北京'
	}, {
		name: '包头',
		value: 30
	}],
	[{
		name: '北京'
	}, {
		name: '重庆',
		value: 20
	}],
	[{
		name: '北京'
	}, {
		name: '常州',
		value: 10
	}]
];

var SHData = [
	[{
		name: '上海'
	}, {
		name: '包头',
		value: 95
	}],
	[{
		name: '上海'
	}, {
		name: '昆明',
		value: 90
	}],
	[{
		name: '上海'
	}, {
		name: '广州',
		value: 80
	}],
	[{
		name: '上海'
	}, {
		name: '郑州',
		value: 70
	}],
	[{
		name: '上海'
	}, {
		name: '长春',
		value: 60
	}],
	[{
		name: '上海'
	}, {
		name: '重庆',
		value: 50
	}],
	[{
		name: '上海'
	}, {
		name: '长沙',
		value: 40
	}],
	[{
		name: '上海'
	}, {
		name: '北京',
		value: 30
	}],
	[{
		name: '上海'
	}, {
		name: '丹东',
		value: 20
	}],
	[{
		name: '上海'
	}, {
		name: '大连',
		value: 10
	}]
];

var CDData = [
	[{
		name: '成都'
	}, {
		name: '太原',
		value: 90
	}],
	[{
		name: '太原'
	}, {
		name: '成都',
		value: 80
	}],
	[{
		name: '成都'
	}, {
		name: '海口',
		value: 10
	}],
	[{
		name: '海口'
	}, {
		name: '成都',
		value: 50
	}],
	[{
		name: '成都'
	}, {
		name: '乌鲁木齐',
		value: 30
	}],
	[{
		name: '乌鲁木齐'
	}, {
		name: '成都',
		value: 30
	}],
	[{
		name: '上海'
	}, {
		name: '成都',
		value: 80
	}],
	[{
		name: '成都'
	}, {
		name: '上海',
		value: 70
	}],
];

var CDData1 = [
	[{
		name: '成都'
	}, {
		name: '广州',
		value: 50
	}],
	[{
		name: '广州'
	}, {
		name: '成都',
		value: 40
	}],
	[{
		name: '成都'
	}, {
		name: '北京',
		value: 30
	}],
	[{
		name: '北京'
	}, {
		name: '成都',
		value: 20
	}],
	[{
		name: '成都'
	}, {
		name: '拉萨',
		value: 70
	}],
	[{
		name: '拉萨'
	}, {
		name: '成都',
		value: 60
	}],
	[{
		name: '成都'
	}, {
		name: '威海',
		value: 70
	}],
	[{
		name: '威海'
	}, {
		name: '成都',
		value: 60
	}],
	[{
		name: '成都'
	}, {
		name: '呼和浩特',
		value: 70
	}],
	[{
		name: '呼和浩特'
	}, {
		name: '成都',
		value: 60
	}],
]

var CDData2 = [
	[{
		name: '成都'
	}, {
		name: '重庆',
		value: 70
	}],
	[{
		name: '重庆'
	}, {
		name: '成都',
		value: 60
	}],
	[{
		name: '成都'
	}, {
		name: '昆明',
		value: 70
	}],
	[{
		name: '昆明'
	}, {
		name: '成都',
		value: 60
	}],
	[{
		name: '成都'
	}, {
		name: '西安',
		value: 70
	}],
	[{
		name: '西安'
	}, {
		name: '成都',
		value: 60
	}],
	[{
		name: '成都'
	}, {
		name: '兰州',
		value: 70
	}],
	[{
		name: '兰州'
	}, {
		name: '成都',
		value: 60
	}],
]

var GZData = [
	// [{
	// 	name: '广州'
	// }, {
	// 	name: '福州',
	// 	value: 1
	// }]
	[{
		name: '广州'
	}, {
		name: '太原',
		value: 90
	}],
	[{
		name: '广州'
	}, {
		name: '长春',
		value: 80
	}],
	[{
		name: '广州'
	}, {
		name: '重庆',
		value: 70
	}],
	[{
		name: '广州'
	}, {
		name: '西安',
		value: 60
	}],
	[{
		name: '广州'
	}, {
		name: '成都',
		value: 50
	}],
	[{
		name: '广州'
	}, {
		name: '常州',
		value: 40
	}],
	[{
		name: '广州'
	}, {
		name: '北京',
		value: 30
	}],
	[{
		name: '广州'
	}, {
		name: '北海',
		value: 20
	}],
	[{
		name: '广州'
	}, {
		name: '海口',
		value: 10
	}]
];

// var planePath =
// 	'path://M432.3328 0c58.9824 0 114.5856 2.1504 166.912 6.3488 52.224 4.1984 98.6112 13.9264 139.0592 29.0816 38.8096 15.1552 69.5296 37.0688 92.2624 65.7408 22.7328 28.672 34.0992 66.6624 34.0992 113.7664l0 513.2288c0 25.2928-5.0176 49.2544-15.1552 72.0896-10.1376 22.7328-23.6544 42.5984-40.448 59.392C790.528 876.544 769.8432 889.9584 747.1104 900.096 724.3776 910.2336 700.416 915.2512 675.1232 915.2512l80.896 80.896L756.0192 1024 108.7488 1024 108.7488 996.1472l80.896-80.896c-25.2928 0-49.2544-5.0176-72.0896-15.1552C94.8224 889.9584 74.1376 876.544 55.6032 859.648c-16.896-16.7936-30.3104-36.6592-40.448-59.392C5.0176 777.5232 0 753.4592 0 728.1664L0 214.9376c0-47.104 11.3664-85.0944 34.0992-113.7664 22.7328-28.672 53.5552-50.5856 92.2624-65.7408C166.912 20.2752 213.1968 10.5472 265.5232 6.3488 317.7472 2.1504 373.3504 0 432.3328 0zM379.2896 214.9376 108.7488 214.9376l0 270.5408 270.5408 0L379.2896 214.9376zM189.6448 809.0624c10.1376 0 20.2752-2.56 30.3104-7.5776C230.0928 796.4672 238.4896 790.528 245.248 783.7696 253.6448 777.1136 259.9936 768.6144 264.192 758.4768 268.3904 748.4416 270.5408 738.304 270.5408 728.1664c0-11.776-2.1504-22.3232-6.3488-31.6416-4.1984-9.216-10.5472-18.0224-18.944-26.5216-6.7584-6.656-15.1552-12.1856-25.2928-16.384C209.8176 649.4208 199.7824 647.2704 189.6448 647.2704c-10.1376 0-20.2752 2.1504-30.3104 6.3488-10.1376 4.1984-18.5344 9.728-25.2928 16.384C125.5424 678.5024 119.296 687.3088 114.9952 696.5248c-4.1984 9.216-6.3488 19.8656-6.3488 31.6416 0 10.1376 2.1504 20.2752 6.3488 30.3104 4.1984 10.1376 10.5472 18.6368 18.944 25.2928C140.6976 790.528 149.1968 796.4672 159.232 801.4848 169.3696 806.5024 179.5072 809.0624 189.6448 809.0624zM756.0192 214.9376 485.4784 214.9376l0 270.5408 270.5408 0L756.0192 214.9376zM675.1232 809.0624c10.1376 0 20.2752-2.56 30.3104-7.5776C715.5712 796.4672 723.968 790.528 730.7264 783.7696 739.1232 777.1136 745.472 768.6144 749.6704 758.4768 753.8688 748.4416 756.0192 738.304 756.0192 728.1664c0-11.776-2.1504-22.3232-6.3488-31.6416C745.472 687.3088 739.1232 678.5024 730.7264 670.0032 723.968 663.3472 715.5712 657.8176 705.4336 653.6192 695.296 649.4208 685.1584 647.2704 675.1232 647.2704c-10.1376 0-20.2752 2.1504-30.3104 6.3488-10.1376 4.1984-18.5344 9.728-25.2928 16.384C611.0208 678.5024 604.672 687.3088 600.4736 696.5248c-4.1984 9.216-6.3488 19.8656-6.3488 31.6416 0 10.1376 2.1504 20.2752 6.3488 30.3104 4.1984 10.1376 10.5472 18.6368 18.944 25.2928C626.176 790.528 634.6752 796.4672 644.7104 801.4848 654.848 806.5024 664.9856 809.0624 675.1232 809.0624z';
var planePath =
	'path://M762.325333 213.333333l112.298667 144.405334 0.042667 0.021333v469.333333H149.333333v-469.333333l644.224-0.021333L731.008 277.333333H292.992l-62.549333 80.405334h-81.066667L261.674667 213.333333h500.650666zM810.666667 421.76H213.333333v341.333333h597.333334v-341.333333z m-426.666667 64v213.333333h-64v-213.333333h64z m170.666667 0v213.333333h-64v-213.333333h64z m170.666666 0v213.333333h-64v-213.333333h64z';

var planePath_jx =
	'path://M762.325333 213.333333l112.298667 144.405334 0.042667 0.021333v469.333333H149.333333v-469.333333l644.224-0.021333L731.008 277.333333H292.992l-62.549333 80.405334h-81.066667L261.674667 213.333333h500.650666zM810.666667 421.76H213.333333v341.333333h597.333334v-341.333333z m-426.666667 64v213.333333h-64v-213.333333h64z m170.666667 0v213.333333h-64v-213.333333h64z m170.666666 0v213.333333h-64v-213.333333h64z';
var convertData = function(data) {
	var res = [];
	for (var i = 0; i < data.length; i++) {
		var dataItem = data[i];
		var fromCoord = geoCoordMap[dataItem[0].name];
		var toCoord = geoCoordMap[dataItem[1].name];
		if (fromCoord && toCoord) {
			res.push({
				fromName: dataItem[0].name,
				toName: dataItem[1].name,
				coords: [fromCoord, toCoord]
			});
		}
	}
	return res;
};

// var color = ['#a6c84c', '#ffa022', '#46bee9','#00aa00'];
var color = ['#36df67','#fec91c','#f86501'];
var series = [];
function initOpt(type){
[
	[typeof(type) == 'undefined'?'3000人以下':'3000吨以下', CDData2],
	// ['上海', SHData],
	// ['广州', GZData],
	[typeof(type) == 'undefined'?'3000人-10000人':'3000吨-10000吨', CDData],
	[typeof(type) == 'undefined'?'10000人以上':'10000吨以上', CDData1],
].forEach(function(item, i) {
	series.push({ //飞行亮条
		name: item[0],
		type: 'lines',
		coordinateSystem: 'leaflet',
		zlevel: 1,
		effect: {
			show: true,
			period: 6,
			trailLength: 0.7,
			color: '#fff',
			symbolSize: 3
		},
		lineStyle: {
			normal: {
				color: color[i],
				width: 0,
				curveness: 0.2
			}
		},
		data: convertData(item[1])
	}, { //飞行线条
		name: item[0],
		type: 'lines',
		coordinateSystem: 'leaflet',
		zlevel: 2,
		symbol: ['none', 'arrow'],
		symbolSize: 10,
		// effect: {//图标
		// 	show: true,
		// 	period: 6,
		// 	trailLength: 0,
		// 	symbol: planePath,
		// 	symbolSize: 15
		// },
		lineStyle: {
			normal: {
				color: color[i],
				width: 1,
				opacity: 0.6,
				curveness: 0.2
			}
		},
		data: convertData(item[1])
	}, {
		name: item[0],
		type: 'effectScatter',
		coordinateSystem: 'leaflet',
		zlevel: 2,
		rippleEffect: {
			brushType: 'stroke'
		},
		label: {
			normal: {
				show: false,
				position: 'right',
				formatter: '{b}'
			}
		},
		symbolSize: function(val) {
			return val[2] / 8;
		},
		itemStyle: {
			normal: {
				color: color[i]
			}
		},
		data: item[1].map(function(dataItem) {
			return {
				name: dataItem[1].name,
				value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
			};
		})
	});
});

}
export default {
	getOptionFly(data, opts) {
		let series = [];
		data.forEach(item => {
			const p1 = {
				name: item.name,
				type: 'lines',
				coordinateSystem: 'leaflet',
				zlevel: 1,
				effect: {
					show: true,
					period: 6,
					trailLength: 0.7,
					color: opts.color,
					symbolSize: 3
				},
				lineStyle: {
					normal: {
						color: opts.color,
						width: 0,
						curveness: 0.2
					}
				},
				data: item.lines
			};
			const p2 = {
				name: item.name,
				type: 'lines',
				coordinateSystem: 'leaflet',
				zlevel: 2,
				symbol: ['none', 'arrow'],
				symbolSize: 10,
				effect: {
					show: true,
					period: 15, //飞行速度
					trailLength: 0, //阴影
					symbol: opts.pathName === "jx" ? planePath_jx : planePath,
					symbolSize: opts.size
				},
				lineStyle: {
					normal: {
						color: opts.color,
						width: 1,
						opacity: 0.6,
						curveness: 0.2
					}
				},
				data: item.lines
			};
			const p3 = {
				name: item.name,
				type: 'effectScatter',
				coordinateSystem: 'leaflet',
				zlevel: 2,
				rippleEffect: {
					brushType: 'stroke'
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						formatter: '{b}'
					}
				},
				symbolSize: function(val) {
					return val[2] / 8;
				},
				itemStyle: {
					normal: {
						color: opts.color
					}
				},
				data: item.datas
			}
			series.push(p1, p2, p3);
		});
		return {
			title: {
				text: '',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				top: 'bottom',
				left: '30%',
				data: [],
				textStyle: {
					color: opts.color
				},
				selectedMode: 'multiple',
			},
			series: series
		}
	},
	// getOption() {
	// 	return {
	// 		title: {
	// 			text: '',
	// 			left: 'center'
	// 		},
	// 		tooltip: {
	// 			trigger: 'item'
	// 		},
	// 		legend: {
	// 			orient: 'vertical',
	// 			top: 'bottom',
	// 			left: '30%',
	// 			data: ['成都 Top10'],
	// 			textStyle: {
	// 				color: '#fff'
	// 			},
	// 			selectedMode: 'multiple',
	// 			// backgroundColor: 'rgba(128, 128, 128, 0.5)'
	// 		},
	// 		series: series
	// 	}
	// },
	getOption() {
		initOpt()
		return {
			legend:
			{
				orient: 'vertical',
				y: 'bottom',
				x: '2%',
				data: [{
					name:'图例',
					icon:'none',
					textStyle:{
						fontSize:22,
						color:'#ffffff',
						padding:[5,0,10,35]
					}
				},"3000人以下","3000人-10000人","10000人以上"],
				textStyle: {
					color: '#fff',
					fontSize:20
				},
				itemWidth:40,
				itemHeight:10,
				selectedMode: 'multiple',
				backgroundColor: 'rgba(128, 128, 128, 0.5)',
			},
			tooltip:{
				show:true,
				trigger:'item',
				formatter:function(params){
					return params.name||params.data.fromName +' - '+ params.data.toName
				}
			},
			series: [{name:'图例',
				type: 'scatter',
				coordinateSystem: 'geo',
				zlevel: 2,
				data: [],
				symbolSize: 10,
				showEffectOn: 'render',
				}].concat(series)
		}
	},
	getOptionZo() {
		initOpt('zo')
		return {
			legend:
			{
				orient: 'vertical',
				y: 'bottom',
				x: '2%',
				data: [{
					name:'图例',
					icon:'none',
					textStyle:{
						fontSize:22,
						color:'#ffffff',
						padding:[5,0,10,35]
					}
				},"3000吨以下","3000吨-10000吨","10000吨以上"],
				textStyle: {
					color: '#fff',
					fontSize:20
				},
				itemWidth:40,
				itemHeight:10,
				selectedMode: 'multiple',
				backgroundColor: 'rgba(128, 128, 128, 0.5)',
			},
			tooltip:{
				show:true,
				trigger:'item',
				formatter:function(params){
					return params.name||params.data.fromName +' - '+ params.data.toName
				}
			},
			series: [{name:'图例',
				type: 'scatter',
				coordinateSystem: 'geo',
				zlevel: 2,
				data: [],
				symbolSize: 10,
				showEffectOn: 'render',
				}].concat(series)
		}
	},
	getOptionTop5() {
		return {
			title: [{
				text: '装车前五位车站(实时)',
				right: '3%',
				top: '1%',
				textAlign: 'center'
			}, {
				text: '卸车前五位车站(昨日)',
				right: '3%',
				top: '50%',
				textAlign: 'center'
			}],
			color: ['#3398D8'],
			legend: {},
			tooltip: {

			},
			grid: [{
				width: '20%',
				top: '2%',
				right: '-20%',
				bottom: '55%',
				containLabel: true
			}, {
				width: '20%',
				top: '55%',
				right: '-20%',
				bottom: '3%',
				containLabel: true
			}],
			xAxis: [{
				type: 'category',
				data: ['平顶山东', '太和北', '铁山', '舵落口', '沙市南'],
				axisLabel: {
					interval: 0,
					formatter: function(v) {
						return v.split("").join("\n")
					}
				}
			}, {
				type: 'category',
				gridIndex: 1,
				axisLabel: {
					interval: 0,
					formatter: function(v) {
						return v.split("").join("\n")
					}
				},
				data: ['武昌东', '枝城', '驻马店', '滠口', '周口']
			}],
			yAxis: [{
				show: false
			}, {
				show: false,
				gridIndex: 1
			}],
			series:[
				{
					type:'bar',
					xAxisIndex:0,
					yAxisIndex:0,
					barWidth:50,
					label:{
						normal:{
							show:true,
							position:'top'
						}
					},
					data:[402,115,102,100,91],
				},
				{
					type:'bar',
					xAxisIndex:1,
					yAxisIndex:1,
					barWidth:50,
					label:{
						normal:{
							show:true,
							position:'top'
						}
					},
					data:[700,238,216,190,127],
				}
			]
		}
	}
}
