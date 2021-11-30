<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2">请选择命名空间：</el-col>
        <el-col :span="5">
          <el-select v-model="defaultValue" placeholder="请选择命名空间" @change="getGwByNs">
            <el-option
              v-for="item in namespaceData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <router-link :to="{name: 'gw-create'}">新增网关</router-link>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data="gatewayData"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.metadata.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="命名空间" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.metadata.namespace }}</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.metadata.creationTimestamp }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <router-link
                :to="{name:'gw-detail', params: {ns:scope.row.metadata.namespace, name: scope.row.metadata.name}}"
              >查看
              </router-link>
            </el-button>
            <el-button type="text" size="small">
              <router-link
                :to="{name:'gw-update', params: {ns:scope.row.metadata.namespace, name: scope.row.metadata.name}}"
              >
                编辑
              </router-link>
            </el-button>
            <el-button type="text" size="small" @click="deleteGw(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { NewClient } from '@/utils/ws'
import { deleteGw, getGwByNs } from '@/api/gw'

export default {
  data() {
    return {
      namespaceData: [],
      defaultValue: 'myistio',
      gatewayData: [],
      wsClient: null
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getGwByNs(this.defaultValue).then(res => {
      this.gatewayData = res.data
      this.$forceUpdate()
    })
    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const result = JSON.parse(e.data)
        if (result.type === 'gw' && result.result.ns === this.defaultValue) {
          this.gatewayData = result.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    getGwByNs() {
      getGwByNs(this.defaultValue).then(res => {
        this.gatewayData = res.data
        this.$forceUpdate()
      })
    },
    deleteGw(row) {
      deleteGw({
        ns: row.metadata.namespace,
        name: row.metadata.name
      }).then(res => {
        if (res.data === 'ok') {
          this.$message.success('删除成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #7cd1c0;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
