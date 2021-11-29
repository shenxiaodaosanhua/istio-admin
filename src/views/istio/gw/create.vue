<template>
  <el-main>
    <el-form ref="form" :model="form" label-width="80px">
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
      <el-card
        v-for="server in form.spec.servers"
        :key="server.$index"
        class="box-card"
      >
        <el-form-item label="端口">
          <el-input v-model="server.port.number" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="server.port.name" />
        </el-form-item>
        <el-form-item label="协议">
          <el-input v-model="server.port.protocol" />
        </el-form-item>
        <el-form-item label="域名">
          <el-select
            v-model="server.hosts"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入域名"
          >
            <el-option
              v-for="item in server.hosts"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-card>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { createGw } from '@/api/gw'

export default {
  data() {
    return {
      form: {
        metadata: {},
        spec: {
          servers: [
            {
              port: {
                number: '',
                name: '',
                protocol: ''
              },
              hosts: []
            }
          ]
        }
      },
      namespaceData: []
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
  },
  methods: {
    submitForm() {
      createGw(this.form).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
