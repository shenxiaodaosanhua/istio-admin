<template>
  <div>
    <i class="ii el-icon-circle-plus" @click="addMapSlice" />
    <el-form v-for="(item,index) in mapSlice" :key="index" style="margin-top: 5px">
      <el-form-item>
        <el-input v-model="item.key" :placeholder="placeholder" style="width: 120px;margin-left:10px" />
      </el-form-item>
      <el-form-item>
        <StringMatch :data.sync="item.value" />
      </el-form-item>
      <el-form-item><i class="ii el-icon-remove-outline" @click="rmMapSlice(index)" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {
    StringMatch: () => import('@/views/common/StringMatch.vue')
  },
  props: ['data', 'placeholder'],
  data() {
    return {
      mapSlice: [], // {key:'字符串',value:{StringMatch}}
      mapObject: {} // 最终 产生的对象 {xxx:StringMatch}

    }
  },
  watch: {
    mapSlice: {
      handler: function(newVal, oldVal) {
        this.parseSliceToObject()
      },
      deep: true
    },
    mapObject: {
      handler: function(newVal, oldVal) {
        const ret = {}
        for (const key in newVal) {
          const getMatch = newVal[key] // 这里取到一个StringMatch对象 .要判断  StringMatch里面的值是否填，不填不作处理
          for (const matchKey in getMatch) {
            if (getMatch[matchKey] !== '') {
              ret[key] = getMatch
            }
          }
        }
        this.$emit('update:data', ret)
      },
      deep: true

    }
  },
  created() {
    if (this.data !== undefined) {
      this.mapObject = this.data
      for (const key in this.mapObject) {
        this.mapSlice.push({ key, value: this.data[key] })
      }
    }
  },
  methods: {
    addMapSlice() {
      this.mapSlice.push({})
    },
    rmMapSlice(index) {
      this.mapSlice.splice(index, 1)
    },
    change(index) {
      if (this.mapSlice[index].key !== '') {
        this.mapObject[this.mapSlice[index].key] = this.mapSlice[index].value
      }
    },
    // 把 slice解析为object
    parseSliceToObject() {
      const obj = {}
      for (let i = 0; i < this.mapSlice.length; i++) {
        if (this.mapSlice[i].key !== '') {
          obj[this.mapSlice[i].key] = this.mapSlice[i].value
        }
      }
      this.mapObject = obj
    }
  }
}
</script>
