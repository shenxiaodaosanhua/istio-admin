<template>
  <el-main>
    <el-form label-position="right" label-width="100px" :model="form">
      <el-form-item label="命名空间">
        <el-select v-model="form.metadata.namespace" placeholder="请选择命名空间" @change="getPipelines">
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
      <el-form-item label="选择流水线">
        <el-select v-model="form.spec.pipelineRef.name" placeholder="请选择流水线">
          <el-option
            v-for="item in pipelines"
            :key="item.metadata.name"
            :label="item.metadata.name"
            :value="item.metadata.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
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
import { createPipelineRun, getPipelineByNs } from '@/api/tekton'

export default {
  data() {
    return {
      form: {
        metadata: {
          namespace: 'default',
          name: ''
        },
        spec: {
          pipelineRef: {
            name: ''
          }
        }
      },
      namespaceData: [],
      pipelines: []
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getPipelineByNs(this.form.metadata.namespace).then(res => {
      this.pipelines = res.data
    })
  },
  methods: {
    onSubmit() {
      createPipelineRun(this.form).then(res => {
        if (res.data === 'ok') {
          this.$message.success('添加成功')
          this.$router.replace('/tekton/pipeline-run/index')
        }
      })
    },
    getPipelines() {
      getPipelineByNs(this.form.metadata.namespace).then(res => {
        this.pipelines = res.data
      })
    }
  }
}
</script>

<style scoped>
.tasks{
  margin: 10px 0;
}
</style>
