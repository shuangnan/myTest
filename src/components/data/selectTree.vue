<template>
  <el-select
    :class="selectTreeClass"
    ref="select"
    :value="valueTitle"
    :filterable="filterable"
    :filterString="filterString"
    :filter-method="filterMethod"
    :clearable="clearable"
    :disabled="disabled"
    :size="size"
    :popper-class="selectTreeClass"
    @clear="clearHandle"
    :style="{width:selectWidth}"
  >
    <el-option :value="valueTitle" :label="valueTitle" :size="size" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        :show-checkbox="showCheckbox"
        :auto-expand-parent="false"
        @node-click="handleNodeClick"
        @check="checkChange"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "el-tree-select",
  props: {
    //配置项
    props: {
      type: Object,
      default: function () {
        return {
          value: "id",
          label: "text",
          children: "children"
        }
      }
    },

    // 选项列表数据(树形结构的对象数组)
    options: { type: Array, default: function () { return [] } },

    // 初始值
    value: { type: String, default: null },

    // 可清空选项
    clearable: { type: Boolean, default: false },

    // 自动收起
    accordion: { type: Boolean, default: true },

    //禁用
    disabled: { type: Boolean, default: false },

    size: { type: String, default: "" },

    //可以进行搜索
    filterable: { type: Boolean, default: false },
    //可以用来搜索的字段
    filterString: { type: String, default: "text,zmlm" },
    selectWidth: { type: String, default: '100px' },

    //select样式设置 蓝屏样式1 selectTreeOne，
    selectTreeClass: { type: String, default: "" },
    //是否可以多选
    showCheckbox: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      valueId: null,
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  mounted() {
    this.valueId = this.value,    // 初始值
      this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 初始化显示
        if (this.showCheckbox) {
          this.$refs.selectTree.setCheckedKeys([this.valueId]);
        } else {
          this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
        }

        this.defaultExpandedKey = [this.valueId]      // 设置默认展开
      }
      this.initScroll()
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0)
      })
    },
    // 切换选项
    handleNodeClick(node) {
      if (this.showCheckbox) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.clearSelected();
          }, 10);
        })
        return;
      }
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('getValue', node)
      this.defaultExpandedKey = []
      this.$refs.select.blur();
    },
    //多选 时复选框选中事件
    checkChange() {
      if (this.showCheckbox) {
        let valueTitle = [];
        let valueId = [];
        var checkedNodes = this.$refs.selectTree.getCheckedNodes();
        checkedNodes.forEach(node => {
          valueTitle.push(node[this.props.label]);
          valueId.push(node[this.props.value]);
        })
        this.valueTitle = valueTitle.join(",");
        this.valueId = valueId.join(",");
        this.$emit('getValue', checkedNodes);
        this.defaultExpandedKey = []
        this.$nextTick(() => {
          setTimeout(() => {
            this.clearSelected();
          }, 10);
        })
      }
      
    },
    //返回 所有选中节点
    getCheckedNodes() {
      return this.$refs.selectTree.getCheckedNodes();
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null)
    },
    // 清空选中样式
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    },
    //树数据搜索
    filterNode(value, data) {
      if (!value) return true;
      var filterS = this.filterString.split(",");
      var rsFlag = false;
      filterS.forEach(v => {
        if (data[v] && (data[v].includes(value) || data[v].toUpperCase().includes(value))) {
          rsFlag = true;
        }
      })
      return rsFlag;
    },
    //下拉框数据搜索
    filterMethod(value) {
      this.$refs.selectTree.filter(value);
    },
  },
  watch: {
    value() {
      this.valueId = this.value
      this.initHandle()
    }
  },
}
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: 100%;
  /* max-height: 254px; */
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}

/* 选中框样式1 */
.selectTreeOne >>> .el-input.is-disabled {
  background: #3b4589;
  border-color: #11255d;
  color: #97a0da;
  border-radius: 4px;
}
.selectTreeOne >>> .el-input.is-disabled .el-input__inner {
  background: #3b4589;
  border-color: #11255d;
  color: #97a0da;
  border-radius: 4px;
}

.selectTreeOne >>> .el-input__inner {
  background: #3b4589;
  border-color: #11255d;
  color: #97a0da;
  border-radius: 4px;
}

.selectTreeOne >>> .el-input__suffix {
  background-color: #21337e;
  right: 0;
}

</style>