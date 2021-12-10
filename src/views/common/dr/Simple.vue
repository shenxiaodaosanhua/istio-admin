<template>
  <el-form-item label="负载类型">
    <el-select v-model="data.simple" placeholder="请选择">
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
        return {
          simple: ''
        }
      }
    }
  },
  data() {
    return {
      simpleLB: ['ROUND_ROBIN', 'LEAST_CONN', 'RANDOM', 'PASSTHROUGH']
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
