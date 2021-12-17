<template>
  <el-main>
    <el-form label-position="right" label-width="80px" :model="form">
      <el-form-item label="命名空间">
        <el-select v-model="form.metadata.namespace" placeholder="请选择命名空间">
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
    <el-card v-for="(item,key) in form.spec.steps" :key="key" class="step box-card card-top">
      <div slot="header" class="clearfix">
        <span>步骤{{ key+1 }}</span>
      </div>
      <div>
        <CONTAINER :step.sync="item" />
        <el-button type="danger" @click.prevent="removeDomain(item)">删除</el-button>
      </div>
    </el-card>
    <el-container>
      <el-button @click="addStep">新增步骤</el-button>
    </el-container>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="onSubmit">立即更新</el-button>
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
import { getTaskDetail, updateTask } from '@/api/tekton'

export default {
  components: {
    CONTAINER: () => import('@/components/container/StepContainer')
  },
  data() {
    return {
      form: {
        metadata: {
          namespace: '',
          name: ''
        },
        spec: {
          steps: []
        }
      },
      namespaceData: []
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getTaskDetail(this.$route.params.ns, this.$route.params.name).then(res => {
      this.form = res.data
    })
  },
  methods: {
    removeDomain(item) {
      const index = this.form.spec.steps.indexOf(item)
      if (index !== -1) {
        this.form.spec.steps.splice(index, 1)
      }
    },
    addStep() {
      this.form.spec.steps.push({})
    },
    onSubmit() {
      updateTask(this.form).then(res => {
        if (res.data === 'ok') {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.$router.replace('/tekton/task/index')
        }
      })
    }
  }
}
</script>

<style scoped>
.step{
  margin: 10px 0;
}
</style>
