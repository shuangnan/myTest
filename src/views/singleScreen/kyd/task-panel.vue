<template>
  <div class="taskPanel">
    <el-card shadow="hover" v-for="task in tempTasks" :key="task" :style="{width: '150px', height: '150px', marginBottom: '15px'}">
      <div slot="header" style="display: flex; flex-direction: row;justify-content: space-around; align-items: center;">
        <el-button size="mini" type="primary" @click="handleAddTempTask(task.MOD_ID)">{{task.MOD_NAME}}</el-button>
      </div>
      <div>
        <span>{{task.MOD_CONTENT}}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import C from '../../../assets/com.js'
export default {
  name: "task-panel",
  data() {
    return {
    }
  },
  computed: {
    tempTasks() {
      return this.$store.state.tasks.tempTasks
    }
  },
  mounted() {
    this.$store.dispatch('tasks/getTempTasks', this.$store.state.params.Oname).then((res) => {
      this.$message.success('获取任务模板成功！')
      console.log(this.$store.state.tasks.tempTasks)
    })
  },
  methods: {
    handleAddTempTask(MOD_ID) {
      const t = this
      console.log(MOD_ID)
      t.$emit('addTempTask', MOD_ID)
    }
  }
}
</script>

<style scoped>
.taskPanel {
  width: 180px;
  height: 300px;
  overflow: scroll;
  overflow-x: hidden;
}
</style>