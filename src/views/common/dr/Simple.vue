<template>
  <el-form-item label="负载类型">
    <el-select v-model="simpleValue" placeholder="请选择">
      <el-option
        v-for="item in simpleLB"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </el-form-item>
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
      simpleLB: ['ROUND_ROBIN', 'LEAST_CONN', 'RANDOM', 'PASSTHROUGH'],
      simpleValue: ''
    }
  },
  watch: {
    simpleValue: {
      handler: function(newVal, oldVal) {
        const obj = {
          'simple': newVal
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
