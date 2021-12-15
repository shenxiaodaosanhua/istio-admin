<template>
  <div class="el-table--border subset">
    <el-form label-position="right" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="subset.name" />
      </el-form-item>
    </el-form>
    <el-form :inline="true" label-width="80px">
      <div v-for="(item,index) in labels" :key="index">
        <el-form-item label="key">
          <el-input v-model="item.key" placeholder="请输入key" />
        </el-form-item>
        <el-form-item label="value">
          <el-input v-model="item.value" placeholder="请输入value" />
        </el-form-item>
        <el-form-item>
          <el-button @click.prevent="removeDomain(item)">删除</el-button>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button @click="addLabel">新增标签</el-button>
      </el-form-item>
    </el-form>
    <el-form label-position="right" label-width="80px">
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
      <Simple v-if="! trafficPolicy[0].hide" :data.sync="subset.traffic_policy.load_balancer" />
      <ConsistentHash v-if="! trafficPolicy[1].hide" :data.sync="subset.traffic_policy.load_balancer" />
      <el-form-item label="连接池协议">
        <el-radio-group v-model="poolType">
          <el-radio label="tcp">TCP</el-radio>
          <el-radio label="http">HTTP</el-radio>
        </el-radio-group>
      </el-form-item>
      <TCP v-if="poolType === 'tcp'" :data.sync="subset.traffic_policy.connection_pool" />
      <HTTP v-if="poolType === 'http'" :data.sync="subset.traffic_policy.connection_pool" />
    </el-form>
    <el-divider />
    <el-form label-position="right" label-width="130px" :model="outlierDetection">
      <el-form-item label="熔断错误数">
        <el-input v-model="outlierDetection.consecutive_gateway_errors" />
      </el-form-item>
      <el-form-item label="5XX错误数">
        <el-input v-model="outlierDetection.consecutive_5xx_errors" />
      </el-form-item>
      <el-form-item label="弹出时间">
        <el-input v-model="outlierDetection.base_ejection_time" placeholder="1h/1m/1s/1ms" />
      </el-form-item>
      <el-form-item label="扫描间隔">
        <el-input v-model="outlierDetection.interval" placeholder="10s" />
      </el-form-item>
      <el-form-item label="弹出最小百分比">
        <el-input v-model="outlierDetection.min_health_percent" placeholder="0%" />
      </el-form-item>
      <el-form-item label="弹出最大百分比">
        <el-input v-model="outlierDetection.max_ejection_percent" placeholder="10%" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {
    ConsistentHash: () => import('@/views/common/dr/ConsistentHash'),
    Simple: () => import('@/views/common/dr/Simple'),
    TCP: () => import('@/views/common/dr/pool/Tcp'),
    HTTP: () => import('@/views/common/dr/pool/Http')
  },
  props: {
    subset: {
      type: Object,
      default: () => {
        return {
          name: '',
          labels: {},
          traffic_policy: {
            load_balancer: {},
            connection_pool: {},
            outlier_detection: {}
          }
        }
      }
    }
  },
  data() {
    return {
      trafficPolicyType: 0,
      poolType: '',
      trafficPolicy: [
        {
          simple: {
            simple: ''
          },
          hide: false,
          label: '简单负载'
        },
        {
          consistentHash: {},
          hide: true,
          label: '哈希负载'
        },
        {
          localityLbSetting: {},
          hide: true,
          label: '部分负载'
        }
      ],
      outlierDetection: {
        consecutive_gateway_errors: '',
        consecutive_5xx_errors: '',
        base_ejection_time: '',
        interval: '',
        min_health_percent: '',
        max_ejection_percent: ''
      },
      labels: [],
      label: {}
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
        this.subset.traffic_policy.outlier_detection = obj
      },
      deep: true
    },
    labels: {
      handler: function(newVal, oldVal) {
        for (let i = 0; i < newVal.length; i++) {
          const item = newVal[i]
          if (item.key !== undefined && item.value !== undefined && item.key !== '' && item.value !== '') {
            this.subset.labels[item.key] = item.value
          }
        }
      },
      deep: true
    }
  },
  methods: {
    trafficPolicyChange() {
      this.trafficPolicy.map(res => {
        res.hide = true
      })
      this.trafficPolicy[this.trafficPolicyType].hide = false
    },
    addLabel() {
      this.labels.push({})
    },
    removeDomain(item) {
      const index = this.labels.indexOf(item)
      if (index !== -1) {
        this.labels.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
  .subset{
    border: #DCDFE6 solid 1px;
    padding: 15px;
    margin-bottom: 5px;
  }
</style>
