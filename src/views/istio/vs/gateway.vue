<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>gateway设置 <i class="ii el-icon-circle-plus" @click="addGW" /></span>
      </div>
      <div>
        <el-form v-for="(host,index) in gateways" :key="index" :inline="true" style="margin-top: 10px">
          <!--<el-input placeholder="填写网关名称" style="width: 150px" v-model="gateways[index]" />-->
          <el-select
            v-model="gateways[index]"
            filterable
            allow-create
          >
            <el-option-group
              v-for="item in allGateways"
              :key="item.ns"
              :label="item.ns"
            >
              <el-option
                v-for="gw in item.list"
                :key="gw.metadata.name"
                :label="gw.metadata.name"
                :value="gw.metadata.name"
              />
            </el-option-group>
          </el-select>
          <el-button type="primary" style="margin-left: 20px" @click="rmGW(index)">
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

import { getGwAll } from '@/api/gw'

export default {
  data() {
    return {
      gateways: [],
      allGateways: {} //  [ {ns:xx,list:xxxx} ] 这种形式
    }
  },
  watch: {
    gateways: {
      handler: function(newVal, oldVal) {
        this.$parent.updateObject('gateways', newVal)
      }

    }
  },
  created() {
    getGwAll().then(rsp => {
      this.allGateways = rsp.data
    })
  },
  methods: {
    addGW() {
      this.gateways.unshift('')
    },
    rmGW(index) {
      this.gateways.splice(index, 1)
    },
    output() {
      return ''
    },
    setObject(v) {
      this.gateways = copyObject(v)
    }
  }

}
</script>
