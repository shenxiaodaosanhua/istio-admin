<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2">请选择命名空间：</el-col>
        <el-col :span="5">
          <el-select v-model="defaultValue" placeholder="请选择命名空间" @change="getVsByNs">
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
        :data="nsData"
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
                :to="{name:'vs-detail', params: {ns:scope.row.metadata.namespace, name: scope.row.metadata.name}}"
              >查看
              </router-link>
            </el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteVs(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { deleteVs, getVsByNs } from '@/api/vs'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      vsData: [],
      namespaceData: [],
      defaultValue: 'myistio',
      nsData: [],
      wsClient: null
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getVsByNs(this.defaultValue).then(res => {
      this.nsData = res.data
      this.$forceUpdate()
    })
    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const result = JSON.parse(e.data)
        if (result.type === 'vs' && result.result.ns === this.defaultValue) {
          this.nsData = result.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    getVsByNs() {
      getVsByNs(this.defaultValue).then(res => {
        this.nsData = res.data
        this.$forceUpdate()
      })
    },
    deleteVs(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVs({
          ns: row.metadata.namespace,
          name: row.metadata.name
        }).then(res => {
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
