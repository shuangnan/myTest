<!-- 
 * @created：	2022年6月21日
 * @author：	ch
 * @version:	v1.0
 * @desc:		铁路线段维护
 * 
 1、新增组时，序号用最后一条序号+1
2、选中组后，清空左边点位选择状态
3、删除组调trdm_lv_829接口，is_use设为0
 -->
<template>
	<div class="map-blue" style="width: 100%;height: 100%;">
		<el-container style="height: 100%;background: #010713;color: white;">
			<el-header style="height:40px;padding: 4px;background: #525C75;">
				<h3 style="display: inline-block;margin: 0;padding: 4px 15px 2px 10px;">线路线段维护</h3>
				<div style="float: right;">
					<el-button @click="playTrainLineVideo()" size="mini" type="primary">沿线视频</el-button>
					<el-button @click="queryBySql" size="mini" type="primary">SQL查询</el-button>
				</div>
			</el-header>
			<el-container>
				<el-aside style="width:600px;">
					<div
						style="position: relative;width: 50%;height: 100%;display: inline-block;vertical-align: top;border-right: 1px solid #333;">
						<div style="padding: 5px 0;">
							<el-select v-model="mType" size="small" placeholder="请选择维护类型" style="width: 100%;">
								<el-option v-for="item in dicMType" :key="item" :label="item" :value="item">
								</el-option>
							</el-select>
							<el-select v-model="curLine" size="small" placeholder="输入线名模糊查询" filterable remote
								:remote-method="getDicLines" @change="handleLineChange"
								style="width: 100%;margin-top: 5px;">
								<el-option v-for="item in dicLines" :key="item.LINE_ID" :label="item.LINE_NAME"
									:value="item.LINE_ID">
								</el-option>
							</el-select>
						</div>
						<div style="position: absolute;top:80px;bottom: 0px;width: 100%;border-top: 1px solid #333;">
							<el-table ref="points" :data="dicPoints" v-loading="pointsLoading" element-loading-text="拼命加载中"
								element-loading-spinner="el-icon-loading"
								element-loading-background="rgba(0, 0, 0, 0.8)" @row-click="pointRowClick" size="mini"
								border :highlight-current-row="true" stripe height="100%" width="100%">
								<el-table-column property="PATH_NUM" label="编号" width="50" align="center">
								</el-table-column>
								<el-table-column property="name" label="点" align="center">
									<template slot-scope="{row}">
										<div style="height:18px;overflow:hidden;">{{row.POINT_X}}</div>
										<div style="height:18px;overflow:hidden;">{{row.POINT_Y}}</div>
									</template>
								</el-table-column>
								<el-table-column property="CENTER_MILES" label="公里标" width="60" align="center">
								</el-table-column>
								<el-table-column property="BZ" label="备注" align="left">
									<template slot="header">
										<div style="text-align: center;">备注</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
					<div
						style="position: relative;width: 50%;height: 100%;display: inline-block;vertical-align: top;border-right: 1px solid #333;">
						<div style="padding: 3px 5px;">
							序号<el-input-number size="mini" v-model="f_seq" placeholder="请输入序号" style="width: 100px;">
							</el-input-number>
							点颜色<el-color-picker title="点颜色" v-model="pColor" color-format="hex" :show-alpha="false"
								size="mini" style="display: inline-block;vertical-align: middle;"></el-color-picker>
							线颜色<el-color-picker title="线颜色" v-model="lColor" color-format="hex" :show-alpha="false"
								size="mini" style="display: inline-block;vertical-align: middle;"></el-color-picker>
						</div>
						<div style="padding:0px 5px;">名称
							<el-input size="mini" v-model="f_name" placeholder="请输入名称"></el-input>
						</div>
						<div style="padding: 3px 5px;">{{dicValText[mType]}}
							<span v-if="f_val===''" style="color: red;">未选择</span><span v-else
								style="color: green;">已选择</span>
							<el-button style="float: right;" size="mini" icon="el-icon-search"
								@click="vedioListVisible=true">选择</el-button>
						</div>
						<div style="padding: 3px 5px;">备注
							<el-input size="mini" v-model="f_memo" placeholder="请输入备注" type="textarea" :rows="2">
							</el-input>
						</div>
						<div style="text-align: center;padding-top:2px">
							<el-button size="mini" @click="saveObj('新增')"
								:disabled="this.f_name === ''||this.f_val === ''||this.curLine===''" type="success"
								style="display: inline-block;vertical-align: middle;width: 30%;">新增</el-button>
							<el-button size="mini" @click="saveObj('修改')"
								:disabled="!curObjectRow.G_ID" type="primary"
								style="display: inline-block;vertical-align: middle;width: 30%;">修改</el-button>
							<el-button size="mini" @click="delObj" :disabled="!curObjectRow.G_ID" type="danger"
								style="display: inline-block;vertical-align: middle;width: 30%;">删除</el-button>
						</div>
						<div style="position: absolute;top:214px;bottom: 0px;width: 100%;border-top: 1px solid #333;">
							<el-table :data="objectList" @row-click="handleSelectRow" size="mini" border
								highlight-current-row stripe height="100%" width="100%">
								<el-table-column property="G_SEQ" label="序" width="50" align="center"></el-table-column>
								<el-table-column property="G_NAME" label="名称" align="center"></el-table-column>
								<el-table-column property="G_MEMO" label="备注" align="center">
									<template slot="header">
										<div style="text-align: center;">备注</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-aside>
				<el-main style="width: 100%;height: 100%;padding: 0;">
					<div ref="map" oncontextmenu="return false"
						style="width: 100%;height: 100%;background: transparent;"></div>
				</el-main>
			</el-container>
		</el-container>
		<el-dialog title="视频列表" :visible.sync="vedioListVisible" width="700px">
			<el-table :data="vedioList" size="mini" @row-click="(row)=>this.curVedio=row" border highlight-current-row
				stripe height="400" width="100%">
				<el-table-column property="" label="序" type="index" width="50" align="center"></el-table-column>
				<el-table-column property="V_NAME" label="名称" width="200" align="center"></el-table-column>
				<el-table-column property="V_URL" label="地址" align="left">
					<template slot="header">
						<div style="text-align: center;">地址</div>
					</template>
				</el-table-column>
				<el-table-column property="cz" label="查看" width="60" align="center">
					<template slot-scope="{row}">
						<el-button size="mini" @click="playTrainLineVideo(row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer">
				<el-button size="mini" type="danger" @click="vedioListVisible=false">取 消</el-button>
				<el-button size="mini" type="primary"
					@click="f_name=curVedio.V_NAME;f_val=curVedio.V_URL;vedioListVisible=false">确
					定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="视频" :visible.sync="videoVisible" width="800px">
			<iframe v-if="videoVisible" :src="videoSrc" style="width: 100%;height: 500px;"></iframe>
		</el-dialog>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../assets/com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				zoom: "",

				map: null,
				mapUrl: "https://10.192.125.55:8443/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3", //地图服务
				// trainLineUrl: "https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine3/rest/maps/RoadLine3", //铁路线服务
				trainLineUrl: "https://10.192.125.55:8443/iserver/services/map-ugcv5-RoadLine7bq/rest/maps/RoadLine7bq", //铁路线服务
				sccqUrl: "http://10.192.125.55:8090/iserver/services/map-ugcv5-chengduCity/rest/maps/chengduCity", //四川重庆详细地图服务

				// 数据类型
				dicMType: ["沿线视频"],
				// 数据类型对应值标题
				dicValText: {
					"沿线视频": "视频地址"
				},
				dicLines: [], //铁路线别
				curLine: "", //当前线别
				curLineObj: {}, //当前线别对象数据
				vedioListVisible: false,
				vedioList: [], //视频列表
				curVedio: {},

				// 表单数据
				mType: "沿线视频", //维护类型
				pColor: "#1e90ff",
				lColor: "#ff8c00",
				f_seq: 1, //序号
				f_name: "", //名称
				f_val: "", //内容
				f_memo: "", //备注

				tempLayer: null, //地图上临时绘制层
				chooseP1: "", //选择的第1个点
				chooseP2: "", //选择的第2个点
				linePoints: [], //当前地图上要绘制的点
				// 点列表
				pointsLoading: false,
				dicPoints: [],
				//点线对象数组
				objectList: [],
				curObjectRow: {},
				objectDetail: [],

				// 铁路沿线视频
				videoVisible: false,
				videoSrc: "",
				isctrl: false, // ctrl快捷键是否被按下
			}
		},
		// 属性
		props: {

		},
		created() {
			this.keyctrlEvent(); // 判断是否按下ctrl
		},
		// 组件挂载完毕
		mounted() {
			document.querySelector("title").innerHTML = "铁路线段维护";
			// 右键菜单关闭
			document.body.addEventListener('click', () => {
				// this.visibleTrainContextMenu = false;
			});
			this.initMap();
			this.getVedioList();
		},
		// 方法
		methods: {
			// 播放铁路沿线视频
			playTrainLineVideo(row) {
				console.log(row)
				const url =
					"https://10.192.34.85:8443/JFLCMS/vueYTH/#/videoVR?videoSrc="; //startTime=50&videoSrc=http%3A%2F%2F10.192.6.110%3A9090%2FJFLCMS%2Ffile%2F3604k.mp4
				const vedio = row.V_URL || "https://10.192.34.85:8443/JFLCMS/video360/斑竹园（途中）-竹园坝.mp4";
				const path = encodeURIComponent(vedio);
				this.videoVisible = true;
				this.videoSrc = url + path;
			},
			/* @info  事件处理区-----------------------------------*/
			initMap() {
				const mapCenterPoint = [30.631366575429297, 104.13792321791442]; //成都东
				const scale = [36978669, 18489335, 9244668, 4622334, 3081556, 2311167, 1540778, 1155583, 770389, 577792,
					288896, 144448, 72224, 36112, 18056, 9028, 4514, 2257, 1129 //19个
				];
				//自定义坐标系
				const crs = L.Proj.CRS("EPSG:3857", {
					origin: mapCenterPoint,
					scaleDenominators: scale,
				});
				//边界
				const cornerLeftUp = L.latLng(70, 30);
				const cornerRightDown = L.latLng(-10, 175);
				const bounds = L.latLngBounds(cornerLeftUp, cornerRightDown)
				this.map = L.map(this.$refs.map, {
					crs: crs,
					center: mapCenterPoint, //中心点
					minZoom: 0, //最小缩放
					maxZoom: 15, //最大缩放15
					zoom: 5, //默认缩放
					maxBounds: bounds, //边界
					zoomControl: false, //不显示缩放按钮
					logoControl: false, //supermap水印
					attributionControl: false, //水印文本,可以传字符串进行自定义
				});
				//注册地图的缩放事件
				this.map.on("zoomend", (e) => {
					const oldZoom = this.zoom;
					const newZoom = e.target._zoom;
					console.log("地图缩放事件:" + oldZoom + " → " + newZoom);
					this.zoom = newZoom;
				});
				// 地图点击事件
				this.map.on("click", (e) => {
					// console.log(e.latlng)
				});
				// 地图双击事件
				this.map.on("dblclick", (e) => {});
				// 地图鼠标移动事件
				this.map.on("mousemove", (e) => {});
				this.map.on("mousedown", (e) => {});

				// 加载天地图
				// const layer = L.supermap.tiledMapLayer(this.mapUrl, {
				// 	transparent: true,
				// 	maxZoom:18
				// }).addTo(this.map);

				const layer = L.supermap.tiledMapLayer(this.mapUrl);
				// layer.options.maxZoom = 20;
				layer.addTo(this.map);
				// 加载四川重庆图
				// L.supermap.tiledMapLayer(this.sccqUrl, {
				// 	opacity: 1,
				// 	transparent: true
				// }).addTo(this.map);
				// 加载铁路线
				L.supermap.tiledMapLayer(this.trainLineUrl, {
					transparent: true
				}).addTo(this.map);

				// 用于临时绘制的层
				this.tempLayer = L.featureGroup().addTo(this.map);
			},

			// 点表格行点击事件
			pointRowClick(row) {
				if (this.isctrl === false && this.chooseP2 === "") { // 确认起点
					if (this.chooseP1 === "") {
						this.chooseP1 = row; // 点击行触发开始切换点1
					} else if (this.chooseP1.GIS_LD_ID === row.GIS_LD_ID) {
						this.chooseP1 = ""; // 点击当前行清空点1
					} else {
						this.chooseP1 = row; // 点击行触发开始切换点1
					}
				} else if (this.isctrl === true && this.chooseP1 !== "") { // 确认终点
					if (this.chooseP2 === "" && this.chooseP1.GIS_LD_ID !== row.GIS_LD_ID) {
						this.chooseP2 = row; // 按下ctrl点击其他行触发开始选择点2
					} else if (this.chooseP2.GIS_LD_ID === row.GIS_LD_ID) {
						this.chooseP2 = ""; // 按下ctrl并点击当前行清空点2
					} else if (this.chooseP1.GIS_LD_ID !== row.GIS_LD_ID) {
						this.chooseP2 = row; // 点击行触发开始切换点2
					}
				} else if (this.chooseP1.GIS_LD_ID !== row.GIS_LD_ID && this.chooseP2 !== "") {
					this.chooseP1 = row; // 已有起点与终点时，点击行触发开始重新配置点1
					this.chooseP2 = "";
					// await this.$confirm("确定清除起点与终点？", {
					// 	type: 'warning'
					// }).then(() => {
					// 	this.$message({
					// 		type: "success",
					// 		message: "起点与终点已清除"
					// 	})
					// }).catch(() => {})
				}
				// if (this.chooseP1 === "") {
				// 	this.chooseP1 = row;
				// } else if (this.chooseP1.GIS_LD_ID === row.GIS_LD_ID) {
				// 	this.chooseP1 = "";
				// } else if (this.chooseP2 === "") {
				// 	this.chooseP2 = row;
				// } else if (this.chooseP2.GIS_LD_ID === row.GIS_LD_ID) {
				// 	this.chooseP2 = "";
				// } else {
				// 	this.chooseP2 = row; //每次更换第二个点
				// }

				const tempPoints = [];
				if (this.chooseP1 !== "") {
					tempPoints.push(this.chooseP1);
				}
				if (this.chooseP2 !== "") {
					tempPoints.push(this.chooseP2);
				}
				// 计算实际所有点
				let realPoints = tempPoints;
				if (tempPoints.length > 1) {
					let p1 = tempPoints[0];
					let p2 = tempPoints[1];
					if (p2.PATH_NUM - p1.PATH_NUM < 0) {
						p1 = tempPoints[1];
						p2 = tempPoints[0];
					}
					// 2个点相临
					if (p2.PATH_NUM - p1.PATH_NUM === 1) {
						realPoints = [p1, p2];
					} else {
						realPoints = this.dicPoints.filter(p => p.PATH_NUM - p1.PATH_NUM >= 0 && p2.PATH_NUM - p
							.PATH_NUM >= 0);
					}
				}
				this.linePoints = realPoints.map(p => {
					return {
						id: p.GIS_LD_ID,
						lat: p.POINT_Y,
						lng: p.POINT_X,
						bh: p.PATH_NUM,
						glb: p.CENTER_MILES,
						bz: p.BZ
					};
				});
				this.creatMarkers();
			},
			// 创建点或线
			creatMarkers() {
				this.tempLayer.pm._layers.forEach(layer => {
					this.map.removeLayer(layer)
				});
				const lines = [];
				this.linePoints.forEach((p, i) => {
					lines.push([p.lat, p.lng]);
					if (i === 0 || i === this.linePoints.length - 1) {
						const marker = L.marker([p.lat, p.lng], {
							icon: L.divIcon({
								className: "",
								html: `<div style="background:${this.pColor};width:14px;height:14px;border-radius:50%;font-size:12px;text-align:center;">${p.bh}</div>`,
							})
						});
						// 只有一个点，则在点上加播放视频事件
						if (this.linePoints.length === 1) {
							marker.on("click", () => {
								this.playTrainLineVideo({
									V_URL: this.f_val
								});
							});
						}
						this.tempLayer.addLayer(marker);
					}
				});
				// 2个点以上，则将所有点用线连接，并加播放视频事件
				if (lines.length > 1) {
					var polyLine = L.polyline(lines, {
						color: this.lColor
					});
					polyLine.on("click", () => {
						this.playTrainLineVideo({
							V_URL: this.f_val
						});
					});
					this.tempLayer.addLayer(polyLine);
				}
				if (lines.length > 0) {
					const index = Math.floor(lines.length / 2);
					this.map.setView(lines[index], 12); //平移地图
				}
			},
			queryBySql() {
				var resultLayer;
				const url = "http://10.192.125.65:8090/iserver/services/data-TieLuTu/rest/data"
				var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
					queryParameter: {
						name: "铁路",
						attributeFilter: "NAME = '测试线路' or NAME = '京包线'"
					},
					datasetNames: ["铁路:金堂线", "铁路:全国铁路线_1"]
				});
				L.supermap
					.featureService(url)
					.getFeaturesBySQL(sqlParam, (serviceResult) => {
						console.log(serviceResult.result.features)
						// const lines = L.Util.transform(serviceResult.result.features, L.CRS.EPSG3857, L.CRS.EPSG4326)
						// resultLayer = L.geoJSON(lines).addTo(this.map).bindPopup('SMID = 234');
					});
			},
			// 铁路线选择事件
			handleLineChange(line_id, _from) {
				this.chooseP1 = "";
				this.chooseP2 = "";
				this.tempLayer.pm._layers.forEach(layer => {
					this.map.removeLayer(layer)
				});
				this.getObjectList(line_id); //获取指定线点位分组
				if (_from !== "删除") {
					this.curLineObj = this.dicLines.find(v => v.LINE_ID === line_id);
					this.getDicPoints(line_id);
				}
			},
			// 点位组表格行点击事件
			handleSelectRow(row) {
				this.chooseP1 = "";
				this.chooseP2 = "";
				this.curObjectRow = row;
				// 为表单赋值
				this.pColor = "#1e90ff";
				this.lColor = "#ff8c00";
				this.f_seq = row.G_SEQ; //序号
				this.f_name = row.G_NAME; //名称
				this.f_val = row.G_CONTENT; //内容
				this.f_memo = row.G_MEMO; //备注
				this.$refs.points.setCurrentRow(-1);
				this.getObjectDetail(row);
			},
			/* @info  数据处理区-----------------------------------*/

			/* @info  数据交互区-----------------------------------*/
			// 获取铁路线路字典
			getDicLines(txt) {
				if (txt.length > 0) {
					C.getData({
						c: "trdm_lv_826",
						s: [txt],
					}, (res) => {
						this.dicLines = res;
					});
				}
			},
			//获取线别内所有点
			getDicPoints(line_id) {
				this.pointsLoading = true;
				C.getData({
					c: "trdm_lv_827",
					s: [line_id],
				}, (res) => {
					// [[GIS_LD_ID（点位ID），LINE_ID（线路ID），PATH_NUM（坐标数据编号），POINT_X（GIS线路X坐标），POINT_Y（GIS线路Y坐标），CENTER_MILES（公里标），BZ（备注，包含点位描述，需显示）]]
					this.dicPoints = res;
					this.pointsLoading = false;
				});
			},
			// 获取指定线点位分组
			getObjectList(line_id) {
				// 41.3、获取指定线点位分组
				// code trdm_lv_830
				// param1 [LINE_ID（线路ID），G_TYPE（分组类型（1-全景视频））]
				// return [[G_ID（分组ID），LINE_ID（线路ID），LINE_NAME（线路名称），G_NAME（分组名称），G_CONTENT（分组内容），G_MEMO（分组备注），IS_USE（使用标志（1-使用，0-停用）），G_SEQ（分组序号，各分组间的顺序）]]
				this.curObjectRow = {};
				C.getData({
					c: "trdm_lv_830",
					s: [line_id, 1],
				}, (res) => {
					this.objectList = res;
					if(res.length>0){
						this.f_seq = Number(res[res.length-1].G_SEQ)+1;
					}else{
						this.f_seq = 1;
					}
				});
			},
			// 获取指定线点位分组详情
			getObjectDetail(row) {
				// 41.5、获取指定线点位分组详情，即指定分组的点位坐标
				// code trdm_lv_831
				// param1 [G_ID（分组ID）]
				// return [[GIS_LD_ID（点位ID）, G_ID（分组ID），PATH_NUM（坐标数据编号），POINT_X（GIS线路X坐标），POINT_Y（GIS线路Y坐标），CENTER_MILES（公里标），BZ（备注，包含点位描述，需显示），IS_USE（使用标志（1-使用，0-停用））]]
				C.getData({
					c: "trdm_lv_831",
					s: [row.G_ID],
				}, (res) => {
					this.objectDetail = res;
					this.linePoints = res.map(p => {
						return {
							id: p.GIS_LD_ID,
							lat: p.POINT_X,
							lng: p.POINT_Y,
							bh: p.PATH_NUM,
							glb: p.CENTER_MILES,
							bz: p.BZ
						};
					});
					this.creatMarkers();
				});
			},
			// 获取指定类型视频列表
			getVedioList() {
				// 41.6、获取指定类型视频列表
				// code trdm_lv_832
				// param1 [视频类型（1-全景视频）]
				// return [[V_URL（视频地址），V_NAME（视频名称）]]
				C.getData({
					c: "trdm_lv_832",
					s: [1],
				}, (res) => {
					this.vedioList = res;
					// this.vedioList = [{V_URL:"http://10.192.6.110:9090/JFLCMS/file/364.mp4",V_NAME:"视频地址"}];
				});
			},
			// 保存点配置
			saveObj(saveType) {
				// 41.2、设置点位分组
				// code trdm_lv_829
				// param1 [[G_ID（分组ID，新增时传空字符串），LINE_ID（线路ID），LINE_NAME（线路名称），G_NAME（分组名称），G_CONTENT（分组内容），G_MEMO（分组备注），
				// IS_USE（使用标志（1-使用，0-停用）），G_SEQ（分组序号，各分组间的顺序），G_TYPE（分组类型（1-全景视频））]]
				const c = this.curLineObj;
				let sql1 = ["", c.LINE_ID, c.LINE_NAME, this.f_name, this.f_val, this.f_memo, 1, this.f_seq, 1];
				if (saveType === "修改") {
					sql1[0] = this.curObjectRow.G_ID;
				}
				C.getData({
					c: "trdm_lv_829",
					s: [sql1],
				}, (res1) => {
					if (saveType === "新增") {
						this.$message({
							message: '新增成功，请绑定点位信息',
							type: 'success'
						});
						this.getObjectList(this.curLine);
					} else if (saveType === "修改") {
						if ((this.chooseP1 === "" && this.chooseP2 === "")) {
							this.$message({
								message: '修改成功，点位无更新',
								type: 'success'
							});
							this.getObjectList(this.curLine);
							return;
						}
						// 41.2、设置点位分组详情，即指定分组的点位坐标
						// code trdm_lv_828
						// param1 [[GIS_LD_ID（点位ID）, G_ID（分组ID），PATH_NUM（坐标数据编号），POINT_X（GIS线路X坐标），POINT_Y（GIS线路Y坐标），CENTER_MILES（公里标），BZ（备注，包含点位描述，需显示），IS_USE（使用标志（1-使用，0-停用））]]
						//要删除的点
						const sql2Del = this.objectDetail.filter(pold => {
							return !this.linePoints.find(p => pold.GIS_LD_ID === p.id); //旧点 在 新点里不存在，则要删除
						}).map(p => [p.GIS_LD_ID, p.G_ID, p.PATH_NUM, p.POINT_X, p.POINT_Y, p.CENTER_MILES, p
							.BZ, 0
						]);
						//要新增的点
						const sql2Add = this.linePoints.filter(p => {
							return !this.objectDetail.find(pold => pold.GIS_LD_ID === p
								.id); //新点 在 旧点里不存在，则要新增
						}).map(p => [p.id, this.curObjectRow.G_ID, p.bh, p.lat, p.lng, p.glb, p.bz, 1]);
						const realSql = sql2Del.concat(sql2Add);
						if(realSql.length>0){
							C.getData({
								c: "trdm_lv_828",
								s: sql2Del.concat(sql2Add),
							}, (res2) => {
								this.$message({
									message: '修改成功，点位已更新',
									type: 'success'
								});
								this.getObjectList(this.curLine);
							});
						}else{
							this.$message({
								message: '修改成功，点位无更新',
								type: 'success'
							});
							this.getObjectList(this.curLine);
						}
					}
				});
			},
			// 删除组？删除不了
			delObj() {
				this.$confirm('此操作将删除该点位组, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const c = this.curLineObj;
					let sql1 = [this.curObjectRow.G_ID, c.LINE_ID, c.LINE_NAME, this.f_name, this.f_val, this.f_memo, 0, this.f_seq,1];
					C.getData({
						c: "trdm_lv_829",
						s: [sql1],
					}, (res2) => {
						this.handleLineChange(this.curLine, "删除");
						this.$message({
							message: '点位删除成功',
							type: 'success'
						});
					});
				}).catch(() => {});
			},
			keyctrlEvent() {
				var that = this
				document.onkeydown = function(e) {
					if (e.keyCode == 17) {
						that.isctrl = true
					}
				}
				document.onkeyup = function(e) {
					if (e.keyCode == 17) {
						that.isctrl = false
					}
				}
			}
		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	.place-list {
		padding: 5px;
		margin: 0;
	}

	.place-list>li {
		height: 30px;
		padding: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.place-list>li:hover,
	.place-list>li.active {
		cursor: pointer;
		background: #525C75;
	}

	>>>.el-table--mini td,
	>>>.el-table--mini th {
		padding: 0;
	}

	>>>.el-table .cell {
		padding: 2px;
		line-height: 18px;
	}
</style>
<!-- 公有样式（会影响全局） -->

<style src="../../components/map/css/blue.css"></style><!-- 蓝色调 -->
<style>
	/* 地图测距样式 */
	#rangingJiaoTongLine {
		position: fixed;
		top: -100px;
		left: -100px;
		z-index: 420;
		padding: 3px 5px;
		color: white;
		color: #aaffff;
		border: 1px solid red;
	}

	#rangingJiaoTongLine>div {
		color: #d9d9d9;
		font-size: 12px;
	}

	.ranging-remove-jiaotong-container-jiaotong {
		margin-top: -8px !important;
		margin-left: -20px !important;
	}

	.ranging-remove-jiaotong {
		display: inline-block;
		width: 12px;
		height: 12px;
		font-size: 18px;
		text-align: center;
		line-height: 10px;
		font-weight: bold;
		color: red;
		background: white;
		border: 1px solid red;
	}

	.ranging-box-jiaotong {
		white-space: nowrap;
	}

	.ranging-box-jiaotong>i {
		display: inline-block;
		vertical-align: top;
		background: white;
		width: 10px;
		height: 10px;
		border-radius: 6px;
		border: 2px solid red;
	}

	.ranging-box-jiaotong>span {
		display: inline-block;
		vertical-align: top;
		padding: 0px 3px;
		margin-left: 3px;
		margin-top: -5px;
		white-space: nowrap;
		font-size: 12px;
		border-radius: 3px;
		border: 1px solid #a5a1cc;
	}
</style>
