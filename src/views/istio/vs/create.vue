<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="metadata.name" :disabled="isUpdate" placeholder="虚拟服务名称" />
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="metadata.namespace" placeholder="请选择命名空间">
            <el-option
              v-for="item in namespaceData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="tips"
            active-text="打开教学"
            inactive-text="关闭教学"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <Hosts ref="hostsConfig" />
    <HttpConfig ref="httpConfig" />
    <div>
      <json-viewer :value="spec" :expand-depth="8" copyable sort />
    </div>
    <div style="margin-top: 20px;text-align: center">
      <el-button type="primary" @click="saveVs">
        保存</el-button>
    </div>

  </div>
</template>
<script>
import { getNsAll } from '@/api/ns'
import { createVs, getVsByNsAndName, updateVs } from '@/api/vs'

export default {
  components: {
    Hosts: () => import('./host.vue'),
    HttpConfig: () => import('./http.vue')
  },
  data() {
    return {
      metadata: { name: '', namespace: 'default' },
      spec: { hosts: [], http: [] }, // vs的spec对象
      namespaceData: [], // ns列表
      tips: false, // 是否打开教学
      isUpdate: false
    }
  },
  created() {
    getNsAll().then(rsp => {
      this.namespaceData = rsp.data
      // 代表是修改
      if (this.$route.params.ns !== undefined && this.$route.params.name !== undefined) {
        this.metadata.name = this.$route.params.name
        this.metadata.namespace = this.$route.params.ns
        const { namespace, name } = this.metadata
        getVsByNsAndName(namespace, name).then(rsp => {
          this.spec = rsp.data.spec
          this.$refs.httpConfig.setObject(this.spec.http)
          this.$refs.hostsConfig.setObject(this.spec.hosts)

          this.isUpdate = true
        })
      }
    })
  },
  methods: {
    updateObject(propName, v) {
      this.spec[propName] = Object.assign([], v)
    },
    saveVs() {
      let operatorFunc = createVs
      if (this.isUpdate) { operatorFunc = updateVs }
      operatorFunc({
        metadata: this.metadata,
        spec: this.spec
      }).then(rsp => {
        if (rsp.data === 'ok') {
          this.$message.success('操作成功')
        }
      })
    }
  }
}
</script>
