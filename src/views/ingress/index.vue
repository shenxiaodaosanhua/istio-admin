<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2">请选择命名空间：</el-col>
        <el-col :span="5">
          <el-select v-model="defaultValue" placeholder="请选择命名空间" @change="getIngressByNs">
            <el-option
              v-for="item in namespaceData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <router-link :to="{name: 'vs-create'}">新增配置</router-link>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data="ingressData"
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
                :to="{name:'ingress-detail', params: {ns:scope.row.metadata.namespace, name: scope.row.metadata.name}}"
              >查看
              </router-link>
            </el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteIngress(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { deleteIngress, getIngressByNs } from '@/api/ingress'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      namespaceData: [],
      defaultValue: 'default',
      ingressData: [],
      wsClient: null
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getIngressByNs(this.defaultValue).then(res => {
      this.ingressData = res.data
    })
    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const result = JSON.parse(e.data)
        if (result.type === 'ingress' && result.result.ns === this.defaultValue) {
          this.ingressData = result.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    getIngressByNs() {
      getIngressByNs(this.defaultValue).then(res => {
        this.ingressData = res.data
      })
    },
    deleteIngress(row) {
      deleteIngress({
        namespace: row.metadata.namespace,
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
