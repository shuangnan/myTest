var bureau = {
	'哈尔滨': [127.9688, 45.368],
	'沈阳': [123.1238, 42.1216],
	'北京': [116.4551, 40.2539],
	'太原': [112.3352, 37.9413],
	'呼和浩特': [111.4124, 40.4901],
	'郑州': [113.4668, 34.6234],
	'武汉': [114.3896, 30.6628],
	'西安': [109.1162, 34.2004],
	'济南': [117.1582, 36.8701],
	'上海': [121.4648, 31.2891],
	'南昌': [116.0046, 28.6633],
	'广州': [113.5107, 23.2196],
	'南宁': [108.479, 23.1152],
	'成都': [103.9526, 30.7617],
	'昆明': [102.9199, 25.4663],
	'兰州': [103.5901, 36.3043],
	'乌鲁木齐': [87.9236, 43.5883],
	'西宁': [101.4038, 36.8207]//西宁
}

var convertData = function(data) {
	var res = [];
	for (var i = 0; i < data.length; i++) {
		var dataItem = data[i];
		var fromCoord = bureau[dataItem[0].name];
		var toCoord = bureau[dataItem[1].name];
		if (fromCoord && toCoord) {
			res.push({
				fromName: dataItem[0].name,
				toName: dataItem[1].name,
				num:dataItem[1].num,
				coords: [fromCoord, toCoord]
			});
		}
	}
	return res;
};


var color = ['#36df67', '#fec91c', '#f86501'];
// var series = [];

function initOpt(type,series,d1,d2,d3) {
	[
		[typeof(type) == 'undefined' ? '3000人以下' : '3000吨以下', d1],
		[typeof(type) == 'undefined' ? '3000人-10000人' : '3000吨-10000吨', d2],
		[typeof(type) == 'undefined' ? '10000人以上' : '10000吨以上', d3],
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
					value: bureau[dataItem[1].name].concat([dataItem[1].value])
				};
			})
		});
	});
}

//3000以下,3000-10000,10000以上
// var d1 = [],d2 = [],d3 = []
export default{
	initData(data,type){
		var d1 = [],d2 = [],d3 = [],series=[]
		data.forEach((item,i) => {
			// console.log(JSON.stringify(item))			
			let num = typeof(type) == 'undefined'?Number(item.PASS_NUM):Number(item.DS)
			if(num < 3000){
				d1.push(
					[{
						name: item.START_CITY
					}, {
						name: item.END_CITY,
						num:num,
						value: 50
					}]
					)
			}else if(num >= 3000 && num < 10000){
				d2.push(
					[{
						name: item.START_CITY
					}, {
						name: item.END_CITY,
						num:num,
						value: 50
					}]
					)
			}else{
				d3.push(
					[{
						name: item.START_CITY
					}, {
						name: item.END_CITY,
						num:num,
						value: 50
					}]
					)
			}
		})

		initOpt(type,series,d1,d2,d3)
		return {
			animation:false,
			animationEasing:'',
			animationDelay:0,
			animationDuration:0,
			// legend:
			// {
			// 	orient: 'vertical',
			// 	y: 'bottom',
			// 	x: '2%',
			// 	data: [{
			// 		name:'图例',
			// 		icon:'none',
			// 		textStyle:{
			// 			fontSize:22,
			// 			color:'#ffffff',
			// 			padding:[5,0,10,35]
			// 		}
			// 	},(typeof(type) == 'undefined' ? '3000人以下' : '3000吨以下'),
			// 	(typeof(type) == 'undefined' ? '3000人-10000人' : '3000吨-10000吨'),
			// 	(typeof(type) == 'undefined' ? '10000人以上' : '10000吨以上')],
			// 	textStyle: {
			// 		color: '#fff',
			// 		fontSize:20
			// 	},
			// 	itemWidth:40,
			// 	itemHeight:10,
			// 	selectedMode: 'multiple',
			// 	backgroundColor: 'rgba(128, 128, 128, 0.5)',
			// },
			tooltip:{
				show:true,
				trigger:'item',
				formatter:function(params){
					return params.name||params.data.fromName +' - '+ params.data.toName+'<br/>'+params.data.num+(typeof(type) == 'undefined' ? ' 人' : ' 吨')
				},
			},
			// series: [{name:'图例',
			// 	type: 'scatter',
			// 	coordinateSystem: 'geo',
			// 	zlevel: 2,
			// 	data: [],
			// 	symbolSize: 10,
			// 	showEffectOn: 'render',
			// 	}].concat(series)
			series:series
		}
	}
}
