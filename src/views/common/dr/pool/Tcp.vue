<template>
  <el-form label-position="right" label-width="90px">
    <el-form-item label="最大连接数">
      <el-input v-model="tcp.max_connections" placeholder="0" />
    </el-form-item>
    <el-form-item label="超时时间">
      <el-input v-model="tcp.connect_timeout" placeholder="30ms" />
    </el-form-item>
    <el-form-item label="探针">
      <el-input v-model="tcp.tcp_keepalive.probes" placeholder="0" />
    </el-form-item>
    <el-form-item label="间隔">
      <el-input v-model="tcp.tcp_keepalive.interval" placeholder="75s" />
    </el-form-item>
    <el-form-item label="时间">
      <el-input v-model="tcp.tcp_keepalive.time" placeholder="9s" />
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
      tcp: {
        max_connections: '',
        connect_timeout: '',
        tcp_keepalive: {
          time: '',
          interval: '',
          probes: ''
        }
      }
    }
  },
  watch: {
    tcp: {
      handler: function(newVal, oldVal) {
        const obj = {
          'tcp': newVal
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
