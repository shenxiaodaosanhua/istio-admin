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
        <span>负载策略</span>
      </div>
      <el-form label-position="right" label-width="80px" :model="form.spec">
        <el-form-item label="负载策略">
          <el-radio-group v-model="trafficPolicyType" @change="trafficPolicyChange">
            <el-radio
              v-for="(item, index) in trafficPolicy"
              :key="index"
              :label="index"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <Simple v-if="! trafficPolicy[0].hide" :data.sync="form.spec.trafficPolicy.loadBalancer" />
        <ConsistentHash v-if="! trafficPolicy[1].hide" :data.sync="form.spec.trafficPolicy.loadBalancer" />
      </el-form>
    </el-card>
    <el-card class="box-card card-top">
      <div slot="header" class="clearfix">
        <span>连接池</span>
      </div>
      <el-form label-position="right" label-width="90px" :model="form.spec">
        <el-form-item label="连接池协议">
          <el-radio-group v-model="poolType">
            <el-radio label="tcp">TCP</el-radio>
            <el-radio label="http">HTTP</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <TCP v-if="poolType === 'tcp'" :data.sync="form.spec.trafficPolicy.connectionPool" />
      <HTTP v-if="poolType === 'http'" :data.sync="form.spec.trafficPolicy.connectionPool" />
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
    Simple: () => import('@/views/common/dr/Simple'),
    ConsistentHash: () => import('@/views/common/dr/ConsistentHash'),
    TCP: () => import('@/views/common/dr/pool/Tcp'),
    HTTP: () => import('@/views/common/dr/pool/Http')
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
          trafficPolicy: {
            loadBalancer: {},
            connectionPool: {}
          }
        }
      },
      namespaceData: [],
      svcs: [],
      trafficPolicyType: 0,
      trafficPolicy: [
        {
          simple: {
            simple: ''
          },
          hide: false,
          label: '简单负载'
        },
        {
          consistentHash: {
            httpCookie: {
              name: '',
              ttl: '0s'
            }
          },
          hide: true,
          label: '哈希负载'
        },
        {
          localityLbSetting: {
          },
          hide: true,
          label: '部分负载'
        }
      ],
      poolType: ''
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
    trafficPolicyChange() {
      this.trafficPolicy.map(res => {
        res.hide = true
      })
      this.trafficPolicy[this.trafficPolicyType].hide = false
    }
    // poolChange() {
    //   this.form.spec.trafficPolicy.connectionPool[this.poolType] = {}
    // }
  }
}
</script>

<style scoped>
  .card-top{
    margin: 10px 0;
  }
</style>
