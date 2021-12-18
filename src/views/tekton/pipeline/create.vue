<template>
  <el-main>
    <el-form label-position="right" label-width="80px" :model="form">
      <el-form-item label="命名空间">
        <el-select v-model="form.metadata.namespace" :disabled="disabled" placeholder="请选择命名空间">
          <el-option
            v-for="item in namespaceData"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.metadata.name" />
      </el-form-item>
    </el-form>
    <el-card v-for="(item, index) in form.spec.tasks" :key="'tasks-' + index" class="tasks box-card card-top">
      <div slot="header" class="clearfix">
        <span>任务{{ index+1 }}</span>
      </div>
      <div>
        <TASK :namespace.sync="form.metadata.namespace" :task.sync="item" />
        <el-button type="danger" @click.prevent="removeDomain(item)">删除</el-button>
      </div>
    </el-card>
    <el-container>
      <el-button @click="addTask">新增任务</el-button>
    </el-container>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </div>
      </el-col>
    </el-row>
    <div>
      <json-viewer :value="form" :expand-depth="8" copyable sort />
    </div>
  </el-main>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { createPipeline } from '@/api/tekton'

export default {
  components: {
    TASK: () => import('@/components/pipeline/Task')
  },
  data() {
    return {
      form: {
        metadata: {
          namespace: 'default',
          name: ''
        },
        spec: {
          tasks: []
        }
      },
      namespaceData: [],
      disabled: false
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
  },
  methods: {
    onSubmit() {
      createPipeline(this.form).then(res => {
        if (res.data === 'ok') {
          this.$message.success('添加成功')
        }
      })
    },
    removeDomain(item) {
      const index = this.form.spec.tasks.indexOf(item)
      if (index !== -1) {
        this.form.spec.tasks.splice(index, 1)
      }
    },
    addTask() {
      // this.disabled = true
      this.form.spec.tasks.push({})
    }
  }
}
</script>

<style scoped>
  .tasks{
    margin: 10px 0;
  }
</style>
