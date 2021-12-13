<template>
  <el-form label-position="right" label-width="130px">
    <el-form-item label="http1最大请求数">
      <el-input v-model="http.http1_max_pending_requests" />
    </el-form-item>
    <el-form-item label="http2最大请求数">
      <el-input v-model="http.http2_max_requests" />
    </el-form-item>
    <el-form-item label="后端请求数">
      <el-input v-model="http.max_retries" />
    </el-form-item>
    <el-form-item label="重试次数">
      <el-input v-model="http.idle_timeout" />
    </el-form-item>
    <el-form-item label="协议升级端口">
      <el-select v-model="http.h2_upgrade_policy" placeholder="请选择">
        <el-option
          v-for="item in upgradePolicy"
          :key="item.value"
          :label="item.key"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="使用客户端协议">
      <el-switch
        v-model="http.use_client_protocol"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      http: {
        http1_max_pending_requests: 0,
        http2_max_requests: 0,
        max_requests_per_connection: 0,
        max_retries: 0,
        idle_timeout: '',
        h2_upgrade_policy: '',
        use_client_protocol: false
      },
      upgradePolicy: [{ key: '默认', value: 'DEFAULT' }, { key: '不升级', value: 'DO_NOT_UPGRADE' }, { key: '升级', value: 'UPGRADE' }]
    }
  },
  watch: {
    http: {
      handler: function(newVal, oldVal) {
        const obj = {
          'http': newVal
        }
        this.$emit('update:data', obj)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
