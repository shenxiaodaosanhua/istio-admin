<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="metadata.name" placeholder="虚拟服务名称" />
        </el-form-item>
        <el-form-item label="命名空间">
          <!--<el-input v-model="namespace"  placeholder="如default"></el-input>-->
          <el-select v-model="metadata.namespace" placeholder="请选择命名空间" @change="getVsByNs">
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
    <Hosts :hosts="spec.hosts" />
    <HttpConfig :http="spec.http" />

    <div>
      <json-viewer :value="spec" :expand-depth="8" copyable sort />
    </div>
    <div style="margin-top: 20px;text-align: center">
      <el-button type="primary" @click="saveVs">
        保存
      </el-button>
    </div>

  </div>
</template>
<script>
import { getNsAll } from '@/api/ns'
import { createVs } from '@/api/vs'

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
      tips: true // 是否打开教学
    }
  },
  created() {
    getNsAll().then(rsp => {
      this.namespaceData = rsp.data
    })
  },
  methods: {
    saveVs() {
      createVs({
        metadata: this.metadata,
        spec: this.spec
      }).then(res => {
        if (res.data === 'ok') {
          this.$message.success('保存成功')
        }
      })
    },
    getVsByNs() {
      console.log(111)
    }
  }
}
</script>
