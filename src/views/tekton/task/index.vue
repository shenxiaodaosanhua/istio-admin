<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="2">请选择命名空间：</el-col>
        <el-col :span="5">
          <el-select v-model="defaultValue" placeholder="请选择命名空间" @change="getTaskByNs">
            <el-option
              v-for="item in namespaceData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <router-link :to="{name: 'task-create'}">新增规则</router-link>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data="tasks"
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
                :to="{name:'task-update', params: {ns:scope.row.metadata.namespace, name: scope.row.metadata.name}}"
              >编辑
              </router-link>
            </el-button>
            <el-button type="text" size="small" @click="deleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { NewClient } from '@/utils/ws'
import { deleteTask, getTaskByNs } from '@/api/tekton'

export default {
  data() {
    return {
      namespaceData: [],
      defaultValue: 'default',
      tasks: [],
      wsClient: null
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getTaskByNs(this.defaultValue).then(res => {
      this.tasks = res.data
    })
    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const result = JSON.parse(e.data)
        if (result.type === 'task' && result.result.ns === this.defaultValue) {
          this.tasks = result.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    getTaskByNs() {
      getTaskByNs(this.defaultValue).then(res => {
        this.tasks = res.data
      })
    },
    deleteTask(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask(row.metadata.namespace, row.metadata.name).then(res => {
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
