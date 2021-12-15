<template>
  <el-main>
    <el-form label-position="right" label-width="80px" :model="form">
      <el-form-item label="命名空间">
        <el-select v-model="form.metadata.namespace" placeholder="请选择命名空间">
          <el-option
            v-for="item in namespaceData"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.metadata.name" />
      </el-form-item>
      <el-form-item label="服务">
        <el-select v-model="form.spec.host" placeholder="请选择服务">
          <el-option
            v-for="item in svcs"
            :key="item.$index"
            :label="item.metadata.name"
            :value="item.metadata.name + '.' + item.metadata.namespace + '.svc.cluster.local'"
          >
            <span style="float: left">{{ item.metadata.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.metadata.namespace }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-card class="box-card card-top">
      <div slot="header" class="clearfix">
        <span>子集</span>
      </div>
      <div>
        <SUBSET v-for="(item,key) in subsets" :key="key" :subset.sync="item" />
        <el-button @click="addSubsets">新增子集</el-button>
      </div>
    </el-card>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </div>
      </el-col>
    </el-row>
    <div>
      <json-viewer :value="form" :expand-depth="8" copyable sort />
    </div>
  </el-main>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { getSvcAll } from '@/api/svc'
import { createDr } from '@/api/dr'

export default {
  components: {
    SUBSET: () => import('@/views/common/dr/subsets/subset')
  },
  data() {
    return {
      form: {
        metadata: {
          name: '',
          namespace: ''
        },
        spec: {
          host: '',
          subsets: []
        }
      },
      namespaceData: [],
      svcs: [],
      subsets: [],
      subset: {
        name: '',
        labels: {},
        traffic_policy: {}
      }
    }
  },
  watch: {
    outlierDetection: {
      handler: function(newVal, oldVal) {
        const obj = {}
        for (const key in newVal) {
          if (newVal[key] !== '') {
            obj[key] = newVal[key]
          }
        }
        this.form.spec.trafficPolicy.outlierDetection = obj
      },
      deep: true
    },
    subsets: {
      handler: function(newVal, oldVal) {
        this.form.spec.subsets = newVal
      },
      deep: true
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
    getSvcAll().then(res => {
      this.svcs = res.data
    })
  },
  methods: {
    onSubmit() {
      createDr(this.form).then(res => {
        if (res.data === 'ok') {
          this.$message.success('新增成功')
          this.$router.replace('/dr/index')
        }
      })
    },
    addSubsets() {
      this.subsets.push(this.subset)
    }
  }
}
</script>

<style scoped>
.card-top {
  margin: 10px 0;
}
</style>
