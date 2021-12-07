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
    <el-form-item label="名称">
      <el-input v-model="lb.name" />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="lb.path" />
    </el-form-item>
    <el-form-item label="超时时间">
      <el-input v-model="lb.ttl" />
    </el-form-item>
  </el-container>
</template>

<script>
export default {
  props: {
    consistentHash: {
      type: Object,
      default: () => {
        return {
          httpHeaderName: {}
        }
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
      lb: {
        name: '',
        path: '',
        ttl: ''
      },
      myLb: {}
    }
  },
  watch: {
    myLb: {
      handler: (newVal, oldVal) => {
        console.log(newVal)
        // this.$emit('update:consistentHashLB', newVal)
      },
      deep: true
    },
    lb: {
      handler: (newVal, oldVal) => {
        console.log(newVal)
      },
      deep: true
    }
  },
  created() {
    this.myLb = this.consistentHash
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
        console.log(key)
      }
    }
  }
}
</script>

<style scoped>

</style>
