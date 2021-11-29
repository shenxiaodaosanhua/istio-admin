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
            v-for="item in spec.selector"
            :key="item"
            size="small"
          >{{ item }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-container>
    <el-container class="table">
      <el-table
        :data="spec.servers"
      >
        <el-table-column
          prop="port.name"
          label="名称"
        />
        <el-table-column
          prop="port.number"
          label="端口"
        />
        <el-table-column
          prop="port.protocol"
          label="端口协议"
        />
        <el-table-column
          label="域名"
        >
          <template slot-scope="scope">
            <el-tag
              v-for="host in scope.row.hosts"
              :key="host"
            >
              {{ host }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
  </el-main>
</template>

<script>
import { getGwDetailByNsAndName } from '@/api/gw'

export default {
  data() {
    return {
      metadata: {},
      spec: {}
    }
  },
  created() {
    getGwDetailByNsAndName(this.$route.params.ns, this.$route.params.name).then(res => {
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
  .descriptions{
    margin-top: 20px;
  }
</style>
