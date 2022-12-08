<template>
    <!-- 管界选择界面，管界完成选择后的保存对话框 -->
    <!-- yinwaluo 20220125 -->
    <el-dialog
        title="保存管界区域"
        :visible="dialogVisible"
        width="width"
    >
        <div>
            <el-form ref="form" label-width="80px">
                <el-form-item label="选择单位">
                    <div style="height:300px;overflow:auto">
                        <el-tree
                            :data="treeData"
                            @node-click="(data) => selectedDanwei = data"
                            :props="{
                                label:'code',
                                children:'children',
                                isLeaf:(data)=>typeof(data.children) === 'undefined',
                            }">
                        </el-tree>
                    </div>
                </el-form-item>
                <el-form-item label="区域颜色">
                    <el-color-picker v-model="selectedColor"></el-color-picker>
                </el-form-item>

            </el-form>
        </div>
        <div slot="footer">
            <el-button size="mini" @click="$emit('area-save-cancelled')">取消</el-button>
            <el-button size="mini" type="primary" @click="$emit('area-saved',{selectedDanwei,selectedColor})">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data:function() {
        return {
            selectedDanwei:null,
            selectedColor:"",
        }
    },
    name:"AreaSaveDialog",
    props:["dialogVisible","treeData"]
}
</script>

<style>

</style>