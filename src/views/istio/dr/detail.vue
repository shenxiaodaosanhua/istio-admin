<template>
  <el-main>
    <el-page-header content="详情页面" @back="goBack" />
    <el-container column="3" class="descriptions">
      <el-descriptions class="margin-top" direction="vertical">
        <el-descriptions-item label="名称">{{ metadata.name }}</el-descriptions-item>
        <el-descriptions-item label="命名空间">
          <el-tag size="small">{{ metadata.namespace }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ metadata.creationTimestamp }}</el-descriptions-item>
        <el-descriptions-item
          label="标签"
        >
          <el-tag
            v-for="(item, index) in spec.selector"
            :key="item"
            size="small"
          >{{ index + '=' +item }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-container>
  </el-main>
</template>

<script>
import { getDrByNsAndName } from '@/api/dr'

export default {
  data() {
    return {
      metadata: {},
      spec: {}
    }
  },
  created() {
    getDrByNsAndName(this.$route.params.ns, this.$route.params.name).then(res => {
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

</style>
