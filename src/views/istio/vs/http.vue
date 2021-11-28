<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>http设置 <i class="ii el-icon-circle-plus" @click="addHttp" /></span>
      </div>
      <div v-show="$parent.tips">
        tips:基于HTTP/HTTP2/GRPC的路由配置
      </div>
      <div>
        <el-form v-for="(httpcfg,rootindex) in $props.http" :inline="true" style="margin-top: 10px">
          <el-form-item label="http配置名称" style="color: green!important;font-weight: bold">
            <el-input v-model="httpcfg.name" placeholder="填写name" style="width: 150px" />
            <el-button type="primary" style="margin-left: 20px" @click="rmHttp(rootindex)">
              <i class="el-icon-minus" /></el-button>
            <!--match相关。可以有多个-->
            <el-card class="box-card" style="margin-top: 10px">
              <div style="text-align:right;width:100%;display: block">
                <i class="ii el-icon-circle-plus" @click="addMatch(rootindex)" />
              </div>
              <el-form v-for="(match,matchindex) in httpcfg.match" :inline="false" style="margin-top: 10px">
                <el-form-item>
                  <i class="ii el-icon-remove-outline" @click="rmMatch(rootindex,matchindex)" />
                </el-form-item>
                <el-form-item label="匹配名称">
                  <el-input v-model="match.name" placeholder="填写match name" />
                </el-form-item>
                <el-form-item label="uri匹配">
                  <el-select v-model="match._uri.key" style="width: 100px" @change="()=>changeUri(rootindex,matchindex)">
                    <el-option value="exact" label="精确匹配" />
                    <el-option value="prefix" label="前缀匹配" />
                    <el-option value="regex" label="regex正则匹配" />
                  </el-select>
                  <el-input v-model="match._uri.value" placeholder="如填写：/users/v2/" style="width: 150px;margin-left:10px" @change="changeUri(rootindex,matchindex)" />
                </el-form-item>

              </el-form>
            </el-card>
            <!--route相关。可以有多个-->
            <el-card class="box-card" style="margin-top: 10px">
              <div style="text-align:right;width:100%;display: block">
                <i class="ii el-icon-circle-plus" @click="addRoute(rootindex)" />
              </div>
              <el-form v-for="(routeconfig,routeindex) in httpcfg.route" style="margin-top: 10px;padding-top:10px;border-top:dashed 1px #ddd">
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
                      <el-input v-model="routeconfig.destination.host" placeholder="填写服务名" />
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
                <el-form-item label="头操作" style="padding-left:20px">
                  <el-form-item style="display: block;width: 100%;margin:5px auto">
                    <i class="ii el-icon-circle-plus" @click="addEmptyRouteHeader(rootindex,routeindex)" />

                  </el-form-item>
                  <el-form v-for="(header,headerindex) in routeconfig._headers" :inline="true" style="margin-top: 10px">
                    <el-form-item label="选择类型">
                      <el-select v-model="header.type" style="width: 100px" @change="checkRouteHeader(routeindex,routeindex,headerindex)">
                        <el-option label="请求" value="request" />
                        <el-option label="响应" value="response" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="操作模式">
                      <el-select v-model="header.mod" style="width: 100px" @change="checkRouteHeader(routeindex,routeindex,headerindex)">
                        <el-option label="添加" value="add" />
                        <el-option label="设置" value="set" />
                        <el-option label="删除" value="remove" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="key">
                      <el-input v-model="header.key" style="width:120px" placeholder="头的名称" @change="checkRouteHeader(routeindex,routeindex,headerindex)" />
                    </el-form-item>
                    <el-form-item label="value">
                      <el-input v-model="header.value" style="width:120px" placeholder="头的值" @change="checkRouteHeader(routeindex,routeindex,headerindex)" />
                    </el-form-item>
                    <el-form-item>
                      <el-button v-show="headerindex>0" type="primary" @click="rmRouteHeader(rootindex,routeindex,headerindex)">-</el-button>
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
const emptyMatch = { name: '', uri: {}, _uri: { key: 'exact', value: '' }}
const emptyRoute = { destination:
    { host: '', subset: '', port: { number: 0 }},
weight: 100,
headers: {}, _headers: [{ type: '', mod: '', key: '', value: '' }] }
const emptyHttp = { // 先写这么多
  name: '',
  match: [copyObject(emptyMatch)],
  route: [copyObject(emptyRoute)]
}
// 拷贝对象
function copyObject(obj) {
  const str = JSON.stringify(obj)
  return JSON.parse(str)
}
export default {
  props: {
    http: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    // 专门封装一个函数 ,可以用来取出match列表或单个match对象
    getMatch(rootindex, matchindex, islist) {
      for (let i = 0; i < this.$props.http.length; i++) {
        if (i === rootindex) {
          const matchList = this.$props.http[i].match
          if (islist) { // 要的是列表 还是 单个
            return matchList
          }
          for (let j = 0; j < matchList.length; j++) {
            if (j === matchindex) {
              return matchList[matchindex]
            }
          }
        }
      }
      return null
    },
    // 专门封装一个函数 ,可以用来取出route列表或单个route对象
    getRoute(rootindex, routeindex, islist) {
      for (let i = 0; i < this.$props.http.length; i++) {
        if (i === rootindex) {
          const getList = this.$props.http[i].route
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

    // URI配置选择切换或uri文本发生变化时触发
    changeUri(rootindex, matchindex) {
      const match = this.getMatch(rootindex, matchindex, false)
      if (match !== null) {
        match.uri = {} // 先清空 。因为 uri匹配只能填一个
        if (match._uri.key !== '' && match._uri.value !== '') { match.uri[match._uri.key] = match._uri.value }
      }
    },
    // 添加 Route对象的头操作部分
    addEmptyRouteHeader(rootindex, routeindex) {
      const route = this.getRoute(rootindex, routeindex, false)
      if (route !== null) {
        route._headers.push({ type: '', mod: '', key: '', value: '' })
      }
    },
    addRoute(rootindex) {
      const routeList = this.$props.http[rootindex].route
      routeList.push(copyObject(emptyRoute))
    },
    addMatch(rootindex) {
      const matchList = this.getMatch(rootindex, 0, true)
      if (matchList !== null) {
        matchList.unshift(copyObject(emptyMatch))
      }
    },
    rmMatch(rootindex, matchindex) {
      const matchList = this.getMatch(rootindex, 0, true)
      if (matchList !== null) {
        matchList.splice(matchindex, 1)
      }
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
        for (let i = 0; i < route._headers.length; i++) {
          if (headerindex === i) {
            route._headers.splice(headerindex, 1)
            this.checkRouteHeader(rootindex, routeindex, headerindex)
            break
          }
        }
      }
    },
    checkRouteHeader(rootindex, routeindex) {
      const route = this.getRoute(rootindex, routeindex, false)
      if (route !== null) {
        // 先清空 router.headers
        route.headers = {}
        const pushObject = {}
        for (let i = 0; i < route._headers.length; i++) {
          const h = route._headers[i]
          if (h.key === '' || h.type === '' || h.mod === '') {
            continue
          }
          if (h.mod === 'remove') { // 删除操作  只需要处理key
            if (h.type in pushObject && h.mod in pushObject[h.type]) { // 如果已经存在了，则要修改，否则就是添加
              const rmList = pushObject[h.type][h.mod]
              rmList.push(h.key)
            } else {
              pushObject[h.type] = {}
              pushObject[h.type][h.mod] = [h.key]
            }
          } else { // add 和set处理模式一样
            if (h.type in pushObject && h.mod in pushObject[h.type]) { // 如果已经存在了，则要修改，否则就是添加
              const op = pushObject[h.type][h.mod]
              op[h.key] = h.value
            } else {
              pushObject[h.type] = {}
              pushObject[h.type][h.mod] = {}
              pushObject[h.type][h.mod][h.key] = h.value
            }
          }
        }
        route.headers = pushObject
      }
    },
    addHttp() {
      this.$props.http.push(copyObject(emptyHttp))
    },
    rmHttp(index) {
      this.$props.http.splice(index, 1)
    },
    // 保留函数
    genOutput() {
      return ''
    }
  }

}
</script>
<style>
.ii{cursor:pointer}
</style>
