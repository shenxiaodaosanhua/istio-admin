<template>
  <div>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>hosts设置 <i class="ii el-icon-circle-plus" @click="addHost" /></span>
      </div>
      <div v-show="$parent.tips">
        Hosts:目标主机,通配符前缀的服务名或IP。适用于 HTTP 和 TCP服务
      </div>
      <div>
        <el-form v-for="(host,index) in $props.hosts" :inline="true" style="margin-top: 10px">
          <el-input v-model="$props.hosts[index]" placeholder="填写host" style="width: 150px" />

          <el-button type="primary" style="margin-left: 20px" @click="rmHost(index)">
            <i class="el-icon-minus" /></el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    hosts: {
      type: Array,
      default() {
        return []
      }

    }
  },
  data() {
    return {}
  },
  methods: {
    addHost() {
      this.$props.hosts.unshift('')
    },
    rmHost(index) {
      this.$props.hosts.splice(index, 1)
    },
    output() {
      return ''
    }
  }

}
</script>
