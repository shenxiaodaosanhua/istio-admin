<template>
  <el-form label-position="right" label-width="100px">
    <el-form-item label="名称">
      <el-input v-model="step.name" />
    </el-form-item>
    <el-form-item label="镜像">
      <el-input v-model="step.image" />
    </el-form-item>
    <el-form-item label="超时时间">
      <el-input v-model="step.timeout" placeholder="1ms/1s/1m/1h" />
    </el-form-item>
    <el-divider />
    <el-form-item
      v-for="(item, index) in commands"
      :key="'command-' + index"
      :label="'命令'+ (index+1)"
      :prop="'commands.' + index"
    >
      <el-input v-model="commands[index]" />
      <el-input v-model="args[index]" />
      <el-button @click.prevent="removeDomain(item)">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addDomain">新增命令</el-button>
    </el-form-item>
    <el-divider />
    <el-form-item
      v-for="(item, index) in envs"
      :key="'env-' + index"
      :label="'命令'+ (index+1)"
    >
      <el-input v-model="item.name" />
      <el-input v-model="item.value" />
      <el-button @click.prevent="removeEnv(item)">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addEnv">新增环境配置</el-button>
    </el-form-item>
    <el-divider />
    <el-form-item label="脚本">
      <el-input
        v-model="step.script"
        type="textarea"
        :rows="4"
        placeholder="脚本"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      default() {
        return {
          name: '',
          image: '',
          command: [],
          args: [],
          env: [],
          timeout: '',
          script: ''
        }
      }
    }
  },
  data() {
    return {
      commands: [],
      args: [],
      envs: []
    }
  },
  watch: {
    commands: {
      handler: function(newVal, oldVal) {
        const arr = []
        for (const key in newVal) {
          arr[key] = newVal[key]
        }
        this.step.command = arr
        this.$forceUpdate()
      },
      deep: true
    },
    args: {
      handler: function(newVal, oldVal) {
        const arr = []
        for (const key in newVal) {
          arr[key] = newVal[key]
        }
        this.step.args = arr
        this.$forceUpdate()
      },
      deep: true
    },
    envs: {
      handler: function(newVal, oldVal) {
        const arr = []
        for (const key in newVal) {
          arr[key] = newVal[key]
        }
        this.step.env = arr
        this.$forceUpdate()
      },
      deep: true
    }
  },
  methods: {
    removeDomain(item) {
      const index = this.commands.indexOf(item)
      if (index !== -1) {
        this.commands.splice(index, 1)
      }
    },
    addDomain() {
      if (this.commands === undefined) {
        this.commands = []
      }
      this.commands.push('')
    },
    removeEnv(item) {
      const index = this.envs.indexOf(item)
      if (index !== -1) {
        this.envs.splice(index, 1)
      }
    },
    addEnv() {
      if (this.envs === undefined) {
        this.envs = []
      }
      this.envs.push({})
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>

</style>
