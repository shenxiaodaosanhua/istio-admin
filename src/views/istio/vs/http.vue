<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>http设置 <i class="ii el-icon-circle-plus" @click="addHttp" /></span>
      </div>
      <div>
        <el-form v-for="(httpcfg,rootindex) in childHttp" :key="rootindex" :inline="true" style="margin-top: 10px">
          <el-form-item label="http配置名称" style="color: green!important;font-weight: bold">
            <el-input v-model="httpcfg.name" placeholder="填写name" style="width: 150px" />
            <el-button type="primary" style="margin-left: 20px" @click="rmHttp(rootindex)">
              <i class="el-icon-minus" /></el-button>
            <!--match相关。可以有多个-->
            <el-card class="box-card" style="margin-top: 10px">
              <div style="text-align:right;width:100%;display: block">
                <i class="ii el-icon-circle-plus" @click="addSlice(rootindex,'match',{})" />
              </div>
              <el-form v-for="(match,matchindex) in httpcfg.match" :key="matchindex" style="margin-top: 10px">
                <el-form-item>
                  <i class="ii el-icon-remove-outline" @click="rmSlice(rootindex,'match',matchindex)" />
                </el-form-item>
                <el-form-item label="匹配名称">
                  <el-input v-model="match.name" placeholder="填写match name" />
                </el-form-item>
                <el-form-item label="uri匹配">
                  <StringMatch :data.sync="match.uri" placeholder="譬如/user" />
                </el-form-item>
                <el-form-item label="method匹配">
                  <StringMatch :data.sync="match.method" placeholder="如GET 或POST" />
                </el-form-item>
                <el-form-item label="头匹配" style="width:100%">
                  <MapStringMatch :data.sync="match.headers" placeholder="必须是小写" />
                </el-form-item>

              </el-form>
            </el-card>

            <!--rewrite相关 ,只有一个-->
            <el-card class="box-card" style="margin-top: 10px">
              <el-form style="margin-top: 10px">
                <el-form-item label="重写配置">
                  <StringObject :data.sync="httpcfg.rewrite" props="uri,authority,abc" />
                </el-form-item>

              </el-form>
            </el-card>
            <!--route相关。可以有多个-->
            <el-card class="box-card" style="margin-top: 10px">
              <div style="text-align:right;width:100%;display: block">
                <i class="ii el-icon-circle-plus" @click="addRoute(rootindex)" />
              </div>
              <el-form
                v-for="(routeconfig,routeindex) in httpcfg.route"
                :key="routeindex"
                style="margin-top: 10px;padding-top:10px;border-top:dashed 1px #ddd"
              >
                <!-- 删除该 route-->
                <el-form-item>
                  <i class="ii el-icon-remove-outline" @click="rmRoute(rootindex,routeindex)" />
                </el-form-item>
                <!--route   weight-->
                <el-form-item label="权重">
                  <el-input v-model="routeconfig.weight" placeholder="填写0-100的数字" />
                </el-form-item>
                <!--route   destination-->
                <el-form-item label=" 目标" style="padding-left:20px">
                  <el-form :inline="true" style="margin-top: 10px">
                    <el-form-item label="服务名">
                      <el-select v-model="routeconfig.destination.host" placeholder="请选择服务">
                        <el-option
                          v-for="svc in svcs"
                          :key="svc.metadata.name"
                          :label="svc.metadata.name"
                          :value="svc.metadata.name"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="子集">
                      <el-input v-model="routeconfig.destination.subset" placeholder="子集" />
                    </el-form-item>
                    <el-form-item label="端口">
                      <el-input v-model="routeconfig.destination.port.number" placeholder="端口:如80" />
                    </el-form-item>
                  </el-form>
                </el-form-item>

                <!--route   headers  .头操作。对应-->
                <el-form-item label="头操作" style="padding-left:20px;width:100%;display: block">
                  <el-form-item style="display: block;width: 100%;margin:5px auto">
                    <i class="ii el-icon-circle-plus" @click="addEmptyRouteHeader(rootindex,routeindex)" />

                  </el-form-item>
                  <el-form v-for="(header,headerindex) in routeconfig._headers" :key="headerindex" :inline="true" style="margin-top: 10px">
                    <el-form-item label="选择类型">
                      <el-select
                        v-model="header.type"
                        style="width: 100px"
                        @change="checkRouteHeader(routeindex,routeindex,headerindex)"
                      >
                        <el-option label="请求" value="request" />
                        <el-option label="响应" value="response" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="操作模式">
                      <el-select
                        v-model="header.mod"
                        style="width: 100px"
                        @change="checkRouteHeader(routeindex,routeindex,headerindex)"
                      >
                        <el-option label="添加" value="add" />
                        <el-option label="设置" value="set" />
                        <el-option label="删除" value="remove" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="key">
                      <el-input
                        v-model="header.key"
                        style="width:120px"
                        placeholder="头的名称"
                        @change="checkRouteHeader(routeindex,routeindex,headerindex)"
                      />
                    </el-form-item>
                    <el-form-item label="value">
                      <el-input
                        v-model="header.value"
                        style="width:120px"
                        placeholder="头的值"
                        @change="checkRouteHeader(routeindex,routeindex,headerindex)"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-show="headerindex>0"
                        type="primary"
                        @click="rmRouteHeader(rootindex,routeindex,headerindex)"
                      >-
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-form-item>
              </el-form>
            </el-card>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getSvcByNs } from '@/api/svc'

const emptyMatch = { name: '', uri: {}}
const emptyRoute = {
  destination:
    { host: '', subset: '', port: { number: 0 }},
  weight: 100,
  headers: {}, _headers: [{ type: '', mod: '', key: '', value: '' }]
}
const emptyHttp = { // 先写这么多
  name: '',
  match: [copyObject(emptyMatch)],
  rewrite: {},
  route: [copyObject(emptyRoute)]
}

// 拷贝对象
function copyObject(obj) {
  const str = JSON.stringify(obj)
  return JSON.parse(str)
}

export default {
  components: {
    StringMatch: () => import('@/views/common/StringMatch.vue'),
    MapStringMatch: () => import('@/views/common/MapStringMatch.vue'),
    StringObject: () => import('@/views/common/StringObject.vue')
  },
  props: {
    spec: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      childHttp: [],
      svcs: []
    }
  },
  watch: {
    childHttp: {
      handler: function(newVal, oldVal) {
        this.$parent.updateObject('http', newVal)
      }
    }
  },
  created() {
    getSvcByNs('myistio').then(res => {
      this.svcs = res.data
    })
  },
  updated() {

  },
  methods: {
    // 专门封装一个函数 ,可以用来取出route列表或单个route对象
    getRoute(rootindex, routeindex, islist) {
      for (let i = 0; i < this.childHttp.length; i++) {
        if (i === rootindex) {
          const getList = this.childHttp[i].route
          if (islist) { // 要的是列表 还是 单个
            return getList
          }
          for (let j = 0; j < getList.length; j++) {
            if (j === routeindex) {
              return getList[routeindex]
            }
          }
        }
      }
      return null
    },

    // 添加 Route对象的头操作部分
    addEmptyRouteHeader(rootindex, routeindex) {
      const routeList = this.getRoute(rootindex, 0, true)
      if (routeList === undefined || routeList === null) {
        this.$set(this.childHttp[rootindex], 'route', [copyObject(emptyRoute)])
      } else {
        if (routeList[routeindex]._headers === undefined) {
          this.$set(routeList[routeindex], '_headers', [{ type: '', mod: '', key: '', value: '' }])
        } else {
          routeList[routeindex]._headers.push({ type: '', mod: '', key: '', value: '' })
        }
      }
    },
    addRoute(rootindex) {
      var routeList = this.childHttp[rootindex].route
      routeList.push(copyObject(emptyRoute))
    },
    // 写一个通用的加入空对象的方法，rootindex是childHttp对应的索引  key 就是属性名 ,value 就是要加入的对象
    addSlice(rootindex, key, value) {
      if (this.childHttp[rootindex][key] === undefined) {
        this.$set(this.childHttp[rootindex], key, [copyObject(value)])
      } else {
        this.childHttp[rootindex][key].unshift(copyObject(value))
      }
    },
    // 写一个通用的删除对象的方法  rootindex是childHttp对应的索引   key 就是属性名
    rmSlice(rootindex, key, keyindex) {
      this.childHttp[rootindex][key].splice(keyindex, 1)
    },

    rmRoute(rootindex, routeindex) {
      const routeList = this.getRoute(rootindex, routeindex, true)
      if (routeList !== null) {
        routeList.splice(routeindex, 1)
      }
    },
    // 移除 空header配置
    rmRouteHeader(rootindex, routeindex, headerindex) {
      const route = this.getRoute(rootindex, routeindex, false)
      if (route !== null) {
        for (var i = 0; i < route._headers.length; i++) {
          if (headerindex === i) {
            route._headers.splice(headerindex, 1)
            this.checkRouteHeader(rootindex, routeindex, headerindex)
            break
          }
        }
      }
    },
    checkRouteHeader(rootindex, routeindex, headerindex) {
      const route = this.getRoute(rootindex, routeindex, false)
      if (route === null) {
        alert('没有找到路由')
        return
      }
      // 先清空 router.headers
      this.$set(route, 'headers', {})

      var pushObject = {}
      for (var i = 0; i < route._headers.length; i++) {
        var h = route._headers[i]
        if (h.key === '' || h.type === '' || h.mod === '') {
          continue
        }
        if (h.mod === 'remove') { // 删除操作  只需要处理key
          if (h.type in pushObject && h.mod in pushObject[h.type]) { // 如果已经存在了，则要修改，否则就是添加
            var rmList = pushObject[h.type][h.mod]
            rmList.push(h.key)
          } else {
            pushObject[h.type] = {}
            pushObject[h.type][h.mod] = [h.key]
          }
        } else { // add 和set处理模式一样
          if (h.type in pushObject && h.mod in pushObject[h.type]) { // 如果已经存在了，则要修改，否则就是添加
            var op = pushObject[h.type][h.mod]
            op[h.key] = h.value
          } else {
            pushObject[h.type] = {}
            pushObject[h.type][h.mod] = {}
            pushObject[h.type][h.mod][h.key] = h.value
          }
        }
      }
      route.headers = pushObject
    },
    addHttp() {
      this.childHttp.push(copyObject(emptyHttp))
    },
    rmHttp(index) {
      this.childHttp.splice(index, 1)
    },
    parseRouteHeaders() {
      // 把 route 里面的headers 转换成_headers  --- 如果有的话
      for (var rootindex = 0; rootindex < this.childHttp.length; rootindex++) {
        const http = this.childHttp[rootindex]
        if (http.route === undefined) return
        for (var routeindex = 0; routeindex < http.route.length; routeindex++) {
          const route = http.route[routeindex]

          if (route.headers !== undefined) {
            this.$set(route, '_headers', [])// 先清空
            for (var key in route.headers) { // 遍历属性
              var pushObject = { type: '', mod: '', key: '', value: '' } // {type:'',mod:'',key:'',value:''}
              pushObject.type = key
              for (var subkey in route.headers[key]) { // 只取一个 ,所以遍历一次就可以break
                pushObject.mod = subkey
                if (subkey === 'remove') { // 删除要做特殊处理
                  pushObject.key = route.headers[key][subkey][0] // remove是一个数组 ，
                } else {
                  for (var sub_subkey in route.headers[key][subkey]) {
                    pushObject.key = sub_subkey
                    pushObject.value = route.headers[key][subkey][sub_subkey]
                  }
                }
              }

              route._headers.push(pushObject)
            }
          }
        }
      }
    },
    parseRouteMatch() {
      for (var rootindex = 0; rootindex < this.childHttp.length; rootindex++) {
        const http = this.childHttp[rootindex]
        if (http.match === undefined) return // 如果本身就没match 则不做任何处理
        // {name:'',uri:{},_uri:{key:'exact',value:''}}
        for (var matchindex = 0; matchindex < http.match.length; matchindex++) {
          var match = http.match[matchindex] // 读取match
          if (match.name === undefined) { this.$set(match, 'name', '') }
          var _uriObject = { key: 'exact', value: '' }
          // 先清空
          for (var key in match.uri) { // 遍历uri属性
            _uriObject.key = key
            _uriObject.value = match.uri[key]
          }
          this.$set(match, '_uri', _uriObject)
        }
      }
    },
    setObject(v) {
      if (v === undefined) {
        this.childHttp = []
        return
      }
      this.childHttp = copyObject(v)
      this.parseRouteHeaders()// 反解route里面的headers ---->  _headers
      this.parseRouteMatch() // 反解 http里的match
    },
    // 保留函数
    genOutput() {
      return ''
    }
  }

}
</script>
<style>
.el-form-item__content {
  line-height: normal
}

.ii {
  cursor: pointer
}
</style>
