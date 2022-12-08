<!-- 
 * @created：	2020年11月25日
 * @author：	ch
 * @version:	v1.0
 * @desc:		组织机构树
 -->
<template>
	<div style="width:100%;height:100%;position:relative;">
	<el-container style="width:100%;height:100%;position:relative;">
		<div v-show="readonlyFlag" style="width:100%;height:100%;z-index:2;background:rgba(230,230,230,0.4);top:0;left:0;position:absolute;"></div>
		<el-header style="height:32px;padding:0;border-botom:1px solid #ddd;">
			<el-input v-model="filterUnitText" size="small" placeholder="请输入站名搜索"></el-input>
		</el-header>
		<el-main style="padding:0;">
			<el-tree ref="unitTree" :data="unitData" @node-click="handelNodeClick" :filter-node-method="filterUnitNode" node-key="ID"
			 :highlight-current="true" :default-expand-all="false" :expand-on-click-node="true" :show-checkbox="showCheckbox" @check="getChecked" style="background: transparent;">
				<span slot-scope="{node,data}">
					<span>{{node.label}}</span>
					<span v-if="data.ZMLM!==''" style="color:blue;"> - {{data.ZMLM}}</span>
				</span>
			</el-tree>
		</el-main>
	</el-container>
	</div>
</template>

<script>
	// 这里引用各种资源
	import C from "../../assets/com.js";
	let treeDataAll=[];
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				filterUnitText: "",
				unitData: [], //真实树形数据
				firstStation: {}, //默认选中节点
			}
		},
		// 属性
		props: {
			// 单位ID，通过此数据查询组织机构树
			oid: {
				type: String,
				required: true,
				default: "99990002001499A50004" //信息技术所，查全部
			},
			// 部门ID，通过此数据过滤组织机构树，若示此部门下无数据，则显示全部树
			depid: {
				type: String,
				default: ""
			},
			// 站名略码，有值的情况下会默认选中此节点
			zmlm: {
				type: String,
				default: ""
			},
			// 是否选中第一个站，若zmlm非空，则不生效
			selectFirstStation: {
				type: Boolean
			},
			// 是否展示复选框
			showCheckbox:{
				type: Boolean,
				default:false,
			},
			//只读属性
			readonlyFlag:{
				type: Boolean,
				default:false,
			},
			// 是否显示根节点
			showRoot:{
				type: Boolean,
				default:true,
			},
		},
		// 组件挂载完毕
		mounted() {
			this.getOrgData();
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			// 过滤车站
			filterUnitNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1 || data.ZMLM.indexOf(value.toUpperCase()) !== -1;
			},
			handelNodeClick(data) {
				this.$emit("selected", data);
			},
			getChecked(){
				this.$emit("getChecked",this.$refs.unitTree.getCheckedNodes())
			},
			/* @info  数据处理区-----------------------------------*/
			getChildrenTree(tree, depid) { //根据部门id 获得部门树
				tree.forEach(item => {
					// 找到部门
					if (item.ID === depid) {
						this.unitData = [item];
					}
					if (this.unitData.length === 0 && item.children) {
						this.getChildrenTree(item.children, depid);
					}
				});
			},
			getFirstStationOfTree(tree) { //查找单位树下第一个站名略吗不等于空的节点
				tree.forEach(item => {
					if (item.ZMLM === "") {
						this.getFirstStationOfTree(item.children);
					} else if(!this.firstStation.hasOwnProperty("ID")) {
						this.firstStation = item;
					}
				});
			},
			/* @info  数据交互区-----------------------------------*/
			// 获取组织机构树
			getOrgData() {
				C.getData({
					c: "0695",
					s: [this.oid],
					url: C.orgUrl,
					a: "【0695】获取单位树"
				}, (r) => {
					let treeData = C.convertTreeData(r, "ID", "PID", "ID", "");
					// 不显示根节点
					if(!this.showRoot){
						treeData = treeData[0].children;
					}
					treeDataAll = treeData;
					// 有部门ID,则过滤出此部门下的节点
					let noDepStn = false;//部门下无车站数据
					if(this.depid!==""){
						this.getChildrenTree(treeData, this.depid);
						if(this.unitData.length===0){
							noDepStn = true;
							this.unitData = treeData;
						}
					}else{
						this.unitData = treeData;
					}
					// this.getChildrenTree(treeData, "19B8C3534E125665E0539106C00A58FD");
					// 有站名略码，则寻找树下的第一个站
					if (this.zmlm !== "") {
						let len = r.length;
						for (let i = 0; i < len; i++) {
							if (r[i].ZMLM === this.zmlm) {
								this.firstStation = r[i];
								break;
							}
						}
					}
					//无站名略码且订阅了默认选中第一个，则寻找树下的第一个站
					else if (this.selectFirstStation) {
						this.getFirstStationOfTree(this.unitData);
					}
					
					// 有第一个站，则选择此站
					if (this.firstStation.hasOwnProperty("ID")) {
						// 部门下无车站数据，且有站名略码,且在总机构数上有此站，则只显示此站
						if(noDepStn && this.zmlm !== ""){
							delete this.firstStation.children;
							this.unitData = [this.firstStation];
						}
						this.$nextTick(() => {
							this.$refs.unitTree.setCurrentKey(this.firstStation.ID);
							this.handelNodeClick(this.firstStation);
						});
					}
				});
			},
			//返回树所有选中节点 isStation:只返回有站码节点
			getCheckedNodes(isStation){
				const selections = this.$refs.unitTree.getCheckedNodes();
				if(isStation){
					return selections.filter(item=>item.ZMLM!=="");
				}else{
					return selections;
				}
			},
			//获得该oid查询所得组织机构树数据
			getTreeData(){
				return treeDataAll;
			},
			//获得车间列表 [车间名称(name)，车间包含车站列表(stnList)]
			getworkShopList(){
				var rs=[];
				var childrens=[];
                if(treeDataAll[0]&&!treeDataAll[0].PID){
					childrens=treeDataAll[0].children;
                }else{
					childrens=treeDataAll
				}
				childrens.forEach(v=>{
					if(v.children){
						v.children.forEach(m=>{
							//获得车间列表 车间名称，车间包含车站列表
							var row={name:m.TEXT,stnList:[]};
							if(m.children){
								getZMLMOID(m.children);
								function getZMLMOID(items){
									items.forEach(t=>{
										if(t.children){
											getZMLMOID(t.children);
										}else if(t.ZMLM){
											row.stnList.push({stnName:t.TEXT,stnCode:t.ZMLM});
										}
									})
								}
							}else{
								row.stnList.push({stnName:m.TEXT,stnCode:m.ZMLM});
							}
							rs.push(row);
						})
					}
				})
				return rs;
			},
			//获得选中的获得车间列表 [车间名称(name)，车间包含车站列表(stnList)，选中车站列表(checkStnList)]
			getCheckWorkShopList(kWorkShopList){
				var checkNodes=this.$refs.unitTree.getCheckedNodes();
				kWorkShopList.forEach(v=>{
					v.checkStnList=[];
				});
				checkNodes.forEach(v=>{
					if(v.children){
						return false;
					}
					kWorkShopList.forEach(t=>{
						var flag=false;
						t.stnList.forEach(m=>{
							if(m.stnCode==v.ZMLM){
								flag=true;
							}
						});
						if(flag){
							t.checkStnList.push({stnName:v.TEXT,stnCode:v.ZMLM})
						}
					});
				});
				var rs=kWorkShopList.filter(v=>{
					return v.checkStnList.length>0;
				});
				return rs;

			},
			//返回单位列表
			getOidListData(){
				var rs=[];
				if(treeDataAll[0]&&treeDataAll[0].PID){
					rs=treeDataAll;
				}else{
					rs=treeDataAll[0].children;
				}
				return rs;
			},
			//返回单位树包含的所有车站
			getTreeStnList(){
				var rs=[];
				rs=this.getNodeStnList(this.unitData);
				return rs;
			},
			//返回 单位列表和单位所包含的车站列表
			getOidStnList(){
				var unitList=this.getOidListData();
				unitList.forEach(v=>{
					v.stnList=[];
					if(v.children){
						v.stnList=this.getNodeStnList(v.children);
					}
					
				})
				return unitList;
			},
			//获取树节点下所有站
			getNodeStnList(node){
				var rs=[];
				getStnList(node);
				function getStnList(childrenList){
					childrenList.forEach(v=>{
						if(v.children){
							getStnList(v.children);
						}else if(v.ZMLM){
							rs.push({stncode:v.ZMLM,stnname:v.TEXT})
						}
					})
				}
				return rs;
			},
		},
		// 监视属性
		watch: {
			filterUnitText(val) {
				this.$refs.unitTree.filter(val);
			}
		},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	/deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
		background-color: #d0e3f9;
	}
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
