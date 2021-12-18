<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2">请选择命名空间：</el-col>
        <el-col :span="5">
          <el-select v-model="defaultValue" placeholder="请选择命名空间" @change="getPipelineByNs">
            <el-option
              v-for="item in namespaceData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <router-link :to="{name: 'pipeline-create'}">新增规则</router-link>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data="pipelines"
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
                :to="{name:'pipeline-update', params: {ns:scope.row.metadata.namespace, name: scope.row.metadata.name}}"
              >编辑
              </router-link>
            </el-button>
            <el-button type="text" size="small" @click="deletePipeline(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { deletePipeline, getPipelineByNs } from '@/api/tekton'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      namespaceData: [],
      defaultValue: 'default',
      wsClient: null,
      pipelines: []
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getPipelineByNs(this.defaultValue).then(res => {
      this.pipelines = res.data
    })
    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const result = JSON.parse(e.data)
        if (result.type === 'pipeline' && result.result.ns === this.defaultValue) {
          this.pipelines = result.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    getPipelineByNs() {
      getPipelineByNs(this.defaultValue).then(res => {
        this.pipelines = res.data
      })
    },
    deletePipeline(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePipeline(row.metadata.namespace, row.metadata.name).then(res => {
          if (res.data === 'ok') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
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
