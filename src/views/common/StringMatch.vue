<template>
  <div>
    <el-select v-model="matchKey" style="width: 100px" @change="change">
      <el-option value="exact" label="精确匹配" />
      <el-option value="prefix" label="前缀匹配" />
      <el-option value="regex" label="regex正则匹配" />
    </el-select>
    <el-input v-model="matchValue" :placeholder="placeholder" style="width: 120px;margin-left:10px" @change="change" />
  </div>
</template>
<script>
export default {
  // props: ['data', 'placeholder'],
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      matchObject: {}, // 譬如{exact:"xxxxx"}
      matchKey: 'prefix',
      matchValue: ''
    }
  },
  watch: {
    matchObject: {
      handler: function(newVal, oldVal) {
        var obj = newVal
        for (var key in obj) {
          if (obj[key] === '') { // 如果为空，直接返回空对象
            obj = {}
          }
        }
        this.$emit('update:data', obj)
      },
      deep: true

    }
  },
  created() {
    this.matchObject = this.data
    if (this.matchObject === null || this.matchObject === undefined) {
      this.matchObject = {}
    } else {
      this.unParseObject()
    }
  },
  methods: {
    // 把对象解析出来，赋值给matchKey和matchValue
    unParseObject() {
      for (const key in this.matchObject) {
        this.matchKey = key
        this.matchValue = this.matchObject[key]
      }
    },
    change() {
      this.matchObject = {}// 清空
      this.matchObject[this.matchKey] = this.matchValue
    }
  }
}
</script>
