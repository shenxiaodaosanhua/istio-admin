<template>
  <el-container>
    <el-form-item label="名称">
      <el-input v-model="cookie.name" />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="cookie.path" />
    </el-form-item>
    <el-form-item label="超时时间">
      <el-input v-model="cookie.ttl" />
    </el-form-item>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      cookie: {
        name: '',
        path: '',
        ttl: ''
      }
    }
  },
  watch: {
    cookie: {
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
