<template>
  <el-container>
    <el-form-item label="负载类型">
      <el-select v-model="value" placeholder="请选择" @change="selectChange">
        <el-option
          v-for="item in consistentHashLB"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <HttpCookie v-if="value === 'httpCookie'" @update="updateObj" />
    <HttpHeaderName v-if="value === 'httpHeaderName'" @update="updateObj" />
    <UseSourceIp v-if="value === 'useSourceIp'" @update="updateObj" />
    <HttpQueryParameterName v-if="value === 'httpQueryParameterName'" @update="updateObj" />
    <MinimumRingSize v-if="value === 'minimumRingSize'" @update="updateObj" />
  </el-container>
</template>

<script>
export default {
  components: {
    HttpCookie: () => import('@/views/common/dr/HttpCookie'),
    HttpHeaderName: () => import('@/views/common/dr/HttpHeaderName'),
    UseSourceIp: () => import('@/views/common/dr/UseSourceIp'),
    HttpQueryParameterName: () => import('@/views/common/dr/HttpQueryParameterName'),
    MinimumRingSize: () => import('@/views/common/dr/MinimumRingSize')
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      consistentHashLB: [
        'httpHeaderName',
        'httpCookie',
        'useSourceIp',
        'httpQueryParameterName',
        'minimumRingSize'
      ],
      value: 'httpHeaderName',
      lb: {},
      myLb: {}
    }
  },
  watch: {
    myLb: {
      handler: function(newVal, oldVal) {
        const obj = {
          'consistentHash': this.myLb
        }
        this.$emit('update:data', obj)
      },
      deep: true
    },
    lb: {
      handler: function(newVal, oldVal) {
        this.myLb = {}
        this.myLb[this.value] = newVal
      },
      deep: true
    }
  },
  created() {
    this.myLb = this.data
    if (this.myLb === null || this.myLb === undefined) {
      this.myLb = {}
    } else {
      this.unParseObject()
    }
  },
  methods: {
    selectChange() {
      this.myLb = {}
      this.myLb[this.value] = this.lb
    },
    unParseObject() {
      for (const key in this.myLb) {
        console.log('----', key)
      }
    },
    updateObj(value) {
      this.lb = value
    }
  }
}
</script>

<style scoped>

</style>
