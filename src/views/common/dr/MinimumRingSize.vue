<template>
  <el-form-item label="节点哈希">
    <el-input v-model="headerName" />
  </el-form-item>
</template>

<script>
export default {
  props: {
    lb: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      headerName: ''
    }
  },
  watch: {
    headerName: {
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
