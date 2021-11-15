<template>
  <el-main>
    <el-table
      :data="vsData"
    >
      <el-table-column
        prop="date"
        label="名称"
      />
      <el-table-column
        prop="name"
        label="命名空间"
      />
      <el-table-column
        prop="address"
        label="操作"
      />
    </el-table>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      vsData: []
    }
  }
}
</script>

<style scoped>

</style>
