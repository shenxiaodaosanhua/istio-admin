<template>
  <el-form label-position="right" label-width="100px">
    <el-form-item label="名称">
      <el-input v-model="task.name" />
    </el-form-item>
    <el-form-item label="任务引用名称">
      <el-select v-model="taskRef.name" placeholder="请选择任务">
        <el-option
          v-for="item in tasks"
          :key="item.metadata.name"
          :label="item.metadata.name"
          :value="item.metadata.name"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { getTaskByNs } from '@/api/tekton'

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
    },
    namespace: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      taskRef: {},
      tasks: []
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
    },
    namespace: {
      handler: function(newVal, oldVal) {
        this.$set(this.taskRef, 'name', '')
        getTaskByNs(newVal).then(res => {
          this.tasks = res.data
        })
        this.$forceUpdate()
      },
      deep: true
    }
  },
  created() {
    if (this.namespace !== '') {
      getTaskByNs(this.namespace).then(res => {
        this.tasks = res.data
      })
    }
    if (this.task.taskRef.name !== '') {
      this.taskRef.name = this.task.taskRef.name
    }
  }
}
</script>

<style scoped>

</style>
