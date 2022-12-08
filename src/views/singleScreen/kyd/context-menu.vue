<template>
  <div>
    <el-cascader-panel :options="options" :props="{expandTrigger: 'hover'}">
      <template slot-scope="{node, data}">
        <el-popover v-if="data.value==='tempTasks'" trigger="hover" placement="right-end">
          <task-panel @addTempTask="$emit('addTempTask', $event)"/>
          <span slot="reference">{{data.label}}</span>
        </el-popover>
        <span v-else>{{data.label}}</span>
      </template>
    </el-cascader-panel>
  </div>
</template>

<script>
import TaskPanel from "./task-panel";
export default {
  name: "context-menu",
  components: {TaskPanel},
  data() {
    return {
      options: [
        {
          value: 'tempTasks',
          label: '派发临时任务',
        },
        {
          value: 'voiceCall',
          label: '发起通话',
        }
      ],
    }
  },
}
</script>

<style scoped>

</style>