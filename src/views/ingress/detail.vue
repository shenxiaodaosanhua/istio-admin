<template>
  <el-main>
    <el-page-header content="详情页面" @back="goBack" />
    <el-container column="3">
      <el-descriptions class="margin-top" direction="vertical">
        <el-descriptions-item label="名称">{{ metadata.name }}</el-descriptions-item>
        <el-descriptions-item label="命名空间">
          <el-tag size="small">{{ metadata.namespace }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ metadata.creationTimestamp }}</el-descriptions-item>
        <el-descriptions-item label="规则">
          <el-card v-for="rule in spec.rules" :key="rule.host" class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ rule.host }}</span>
            </div>
            <div v-for="path in rule.http.paths" :key="path.backend.service.name" class="text item">
              <p>服务名：{{ path.backend.service.name }}</p>
              <p>路径：{{ path.path }}</p>
              <p>端口:
                <el-tag>{{ path.backend.service.port.number }}</el-tag>
              </p>
            </div>
          </el-card>
        </el-descriptions-item>
      </el-descriptions>
    </el-container>
  </el-main>
</template>

<script>

import { getIngressInfo } from '@/api/ingress'

export default {
  data() {
    return {
      metadata: {},
      spec: {},
      rules: []
    }
  },
  created() {
    getIngressInfo(this.$route.params.ns, this.$route.params.name).then(res => {
      this.metadata = res.data.metadata
      this.spec = res.data.spec
      this.rules = res.data.spec.rules
      this.$forceUpdate()
    })
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.margin-top {
  margin-top: 10px;
}
</style>
