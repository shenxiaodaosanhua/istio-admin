<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>hosts设置 <i class="ii el-icon-circle-plus" @click="addHost" /></span>
      </div>
      <div>
        <el-form v-for="(host,index) in hosts" :key="index" :inline="true" style="margin-top: 10px">
          <el-input v-model="hosts[index]" placeholder="填写host" style="width: 150px" />

          <el-button type="primary" style="margin-left: 20px" @click="rmHost(index)">
            <i class="el-icon-minus" /></el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
function copyObject(obj) {
  const str = JSON.stringify(obj)
  return JSON.parse(str)
}
export default {
  data() {
    return {
      hosts: []
    }
  },
  watch: {
    hosts: {
      handler: function(newVal, oldVal) {
        this.$parent.updateObject('hosts', newVal)
      }

    }
  },
  methods: {
    addHost() {
      this.hosts.unshift('')
    },
    rmHost(index) {
      this.hosts.splice(index, 1)
    },
    output() {
      return ''
    },
    setObject(v) {
      this.hosts = copyObject(v)
    }
  }

}
</script>
