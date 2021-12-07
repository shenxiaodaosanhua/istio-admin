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
      <el-form-item label="服务">
        <el-select v-model="form.spec.host" placeholder="请选择服务">
          <el-option
            v-for="item in svcs"
            :key="item.$index"
            :label="item.metadata.name"
            :value="item.metadata.name + '.' + item.metadata.namespace + '.svc.cluster.local'"
          >
            <span style="float: left">{{ item.metadata.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.metadata.namespace }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { getSvcAll } from '@/api/svc'
import { createDr } from '@/api/dr'

export default {
  data() {
    return {
      form: {
        metadata: {
          name: '',
          namespace: ''
        },
        spec: {
          host: ''
        }
      },
      namespaceData: [],
      svcs: []
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getSvcAll().then(res => {
      this.svcs = res.data
    })
  },
  methods: {
    onSubmit() {
      console.log(this.form)
      createDr(this.form).then(res => {
        if (res.data === 'ok') {
          this.$message.success('新增成功')
          this.$router.replace('/dr/index')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
