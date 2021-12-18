<template>
  <el-form label-position="right" label-width="100px">
    <el-form-item label="名称">
      <el-input v-model="task.name" />
    </el-form-item>
    <el-form-item label="任务引用名称">
      <el-input v-model="taskRef.name" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      default() {
        return {
          name: '',
          taskRef: {}
        }
      }
    }
  },
  data() {
    return {
      taskRef: {}
    }
  },
  watch: {
    taskRef: {
      handler: function(newVal, oldVal) {
        const obj = {}
        for (const key in newVal) {
          if (newVal[key] !== '') {
            obj[key] = newVal[key]
          }
        }
        this.$set(this.task, 'taskRef', obj)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
