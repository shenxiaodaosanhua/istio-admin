<template>
  <div class="el-table--border subset">
    <el-form label-position="right" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="subset.name" />
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
      <Simple v-if="! trafficPolicy[0].hide" :data.sync="subset.traffic_policy.loadBalancer" />
      <ConsistentHash v-if="! trafficPolicy[1].hide" :data.sync="subset.traffic_policy.loadBalancer" />
      <el-form-item label="连接池协议">
        <el-radio-group v-model="poolType">
          <el-radio label="tcp">TCP</el-radio>
          <el-radio label="http">HTTP</el-radio>
        </el-radio-group>
      </el-form-item>
      <TCP v-if="poolType === 'tcp'" :data.sync="subset.traffic_policy.connectionPool" />
      <HTTP v-if="poolType === 'http'" :data.sync="subset.traffic_policy.connectionPool" />
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
          labels: '',
          traffic_policy: {
            loadBalancer: {},
            connectionPool: {},
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
        this.subset.traffic_policy.outlier_detection = obj
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
