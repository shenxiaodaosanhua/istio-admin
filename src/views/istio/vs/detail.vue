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
        <el-descriptions-item
          label="域名"
        >
          <el-tag
            v-for="host in spec.hosts"
            :key="host"
            size="small"
          >{{ host }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-container>
  </el-main>
</template>

<script>
import { getVsByNsAndName } from '@/api/vs'

export default {
  data() {
    return {
      metadata: {},
      spec: {}
    }
  },
  created() {
    getVsByNsAndName(this.$route.params.ns, this.$route.params.name).then(res => {
      this.metadata = res.data.metadata
      this.spec = res.data.spec
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
  .margin-top{
    margin-top: 10px;
  }
</style>
