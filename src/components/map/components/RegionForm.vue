<!-- 
 * @created：	2021年12月17日
 * @author：	ch
 * @version:	v1.0
 * @desc:		区域表单
 -->
<template>
	<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible="true"
	 title="区域编辑" width="500px" style="margin-top: 100px;" :destroy-on-close="true" :append-to-body="false">
		<div style="padding-top:20px;">
			<el-form ref="myForm" :model="formQuYu" :rules="rulesQuYu" :inline="true" size="mini" @submit.native.prevent
			 label-width="120px" style="height: auto;padding: 0px;">
				<el-form-item label="区域名称:" prop="REGION_NAME">
					<el-input v-model="formQuYu.REGION_NAME" placeholder="请输入区域名称" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="是否发送消息:">
					<el-radio v-model="formQuYu.REGION_TYPE" label="1">发送警戒消息</el-radio>
					<el-radio v-model="formQuYu.REGION_TYPE" label="0">不发送警戒消息</el-radio>
				</el-form-item>
				<el-form-item label="警戒消息内容:">
					<el-input v-model="formQuYu.WARN_MESSAGE" type="textarea" :rows="4" placeholder="请输入警戒消息内容" style="width: 300px;"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<div slot="footer" style="text-align: center;">
			<el-button plain style="width: 120px;" @click="haddleCloseQuyu">取消</el-button>
			<el-button :disabled="formQuYu.REGION_NAME===''" type="primary" style="width: 120px;" @click="haddleSaveQuyu">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	// 这里引用各种资源
	import C from "../../../assets/com.js";
	export default {
		// 组件
		components: {},
		// 数据仓库
		data() {
			return {
				formQuYu: {
					"REGION_ID": "", //id
					"REGION_TYPE": "1", //区域类型（0-不发送警戒消息，1-发送警戒消息）
					"REGION_NAME": "", //区域名称
					"TRAIN_LIST": [], //列车列表
					"WARN_MESSAGE": "", //警戒消息内容
					// "DEPOT": this.oname, //所属客运段
					"POINT_LIST": [] //点列表
				},
				rulesQuYu: {
					REGION_NAME: [{
						required: true,
						message: "请填写区域名称",
						trigger: 'change'
					}],
				},
			}
		},
		// 属性
		props: {
			formData:Object
		},
		// 组件挂载完毕
		mounted() {
			this.formQuYu = this.formData;
		},
		// 方法
		methods: {
			/* @info  事件处理区-----------------------------------*/
			haddleCloseQuyu(){
				this.$emit("cancel");
			},
			haddleSaveQuyu(){
				this.$emit("save",this.formQuYu,true);
			}
			/* @info  数据处理区-----------------------------------*/

			/* @info  数据交互区-----------------------------------*/

		},
		// 监视属性
		watch: {},
		// 计算属性
		computed: {},
	}
</script>

<!-- 私有样式 -->
<style scoped="scoped">
	
</style>
<!-- 公有样式（会影响全局） -->
<style>
</style>
