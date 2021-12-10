<template>
  <el-form-item label="哈希">
    <el-switch
      v-model="useSourceIp"
      active-color="#13ce66"
      inactive-color="#ff4949"
    />
  </el-form-item>
</template>

<script>
export default {
  data() {
    return {
      useSourceIp: false
    }
  },
  watch: {
    useSourceIp: {
      handler: function(newVal, oldVal) {
        this.$emit('update', newVal)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
