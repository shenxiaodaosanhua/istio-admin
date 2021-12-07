<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2">请选择命名空间：</el-col>
        <el-col :span="5">
          <el-select v-model="defaultValue" placeholder="请选择命名空间" @change="getDsByNs">
            <el-option
              v-for="item in namespaceData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <router-link :to="{name: 'dr-create'}">新增规则</router-link>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data="dsData"
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
                :to="{name:'dr-detail', params: {ns:scope.row.metadata.namespace, name: scope.row.metadata.name}}"
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
            <el-button type="text" size="small" @click="deleteDs(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { NewClient } from '@/utils/ws'
import { deleteDs, getDsByNs } from '@/api/dr'

export default {
  data() {
    return {
      namespaceData: [],
      defaultValue: 'myistio',
      dsData: [],
      wsClient: null
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getDsByNs(this.defaultValue).then(res => {
      this.dsData = res.data
      this.$forceUpdate()
    })
    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const result = JSON.parse(e.data)
        if (result.type === 'dr' && result.result.ns === this.defaultValue) {
          this.dsData = result.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    getDsByNs() {
      getDsByNs(this.defaultValue).then(res => {
        this.dsData = res.data
        this.$forceUpdate()
      })
    },
    deleteDs(row) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDs(row.metadata.namespace, row.metadata.name).then(res => {
          if (res.data === 'ok') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
