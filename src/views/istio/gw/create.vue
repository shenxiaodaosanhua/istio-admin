<template>
  <el-main>
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-form-item label="命名空间">
        <el-select v-model="form.metadata.namespace" placeholder="请选择命名空间">
          <el-option
            v-for="item in namespaceData"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.metadata.name" />
      </el-form-item>
    </el-form>
    <el-card
      class="box-card"
    >
      <span>
        标签配置 (常见的是app:istio-ingressgateway)
        <i class="ii el-icon-circle-plus" @click="selector.push({key:'',value:''})" />
      </span>
    </el-card>
    <el-card
      v-for="(item,index) in selector"
      :key="index"
      class="box-card"
    >
      <el-form label-width="80px" :inline="true">
        <el-form-item label="标签Key">
          <el-input v-model="item.key" placeholder="标签Key" @change="parseSelector" />
        </el-form-item>
        <el-form-item label="标签值">
          <el-input v-model="item.value" placeholder="标签值" @change="parseSelector" />
        </el-form-item>
        <el-form-item>
          <el-button v-show="index>0" type="primary" @click="rmSelector(index)"> -</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card
      v-for="server in form.spec.servers"
      :key="server.$index"
      class="box-card"
    >
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="端口">
          <el-input-number v-model="server.port.number" :min="0" :max="65535" label="请输入端口范围" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="server.port.name" />
        </el-form-item>
        <el-form-item label="协议">
          <el-select v-model="server.port.protocol" placeholder="请选择协议">
            <el-option
              v-for="protocol in protocols"
              :key="protocol"
              :label="protocol"
              :value="protocol"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="域名">
          <el-select
            v-model="server.hosts"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入域名"
          >
            <el-option
              v-for="item in server.hosts"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <div>
      <json-viewer :value="form" :expand-depth="8" copyable sort />
    </div>
  </el-main>
</template>

<script>
import { getNsAll } from '@/api/ns'
import { createGw } from '@/api/gw'

export default {
  data() {
    return {
      form: {
        metadata: {},
        spec: {
          selector: {},
          servers: [
            {
              port: {
                number: '',
                name: '',
                protocol: ''
              },
              hosts: []
            }
          ]
        }
      },
      namespaceData: [],
      protocols: ['HTTP', 'HTTPS', 'GRPC', 'HTTP2', 'MONGO', 'TCP', 'TLS'],
      selector: []
    }
  },
  created() {
    getNsAll().then(res => {
      this.namespaceData = res.data
    })
  },
  methods: {
    submitForm() {
      createGw(this.form).then(res => {
        console.log(res.data)
      })
    },
    parseSelector() {
      this.form.spec.selector = {}
      for (let i = 0; i < this.selector.length; i++) {
        if (this.selector[i].key !== '' && this.selector[i].value !== '') {
          this.$set(this.form.spec.selector, this.selector[i].key, this.selector[i].value)
        }
      }
    },
    rmSelector(index) {
      for (let i = 0; i < this.selector.length; i++) {
        this.selector.splice(index, 1)
      }
      this.parseSelector()
    }
  }
}
</script>

<style scoped>

</style>
