<template>
  <div style="height: 100%">
    <el-card>
      <el-select v-model="routeObj" filterable clearable placeholder="请选择路由" @change="selectChange">
        <el-option
            v-for="item in routeData.data"
            :key="item.routeId"
            :label="item.routeId"
            :value="item.id">
        </el-option>
      </el-select>
    </el-card>
    <el-card style="margin-top: 10px">
      <div>
        <el-button type="primary" @click="addRoutesFilter" size="small">新增</el-button>
      </div>
      <el-table :data="filtersTableData.data">
        <el-table-column prop="filtersKey" label="Key" show-overflow-tooltip/>
        <el-table-column prop="filtersValue" label="Value" show-overflow-tooltip/>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
        <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip/>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button @click="deleteRoutefilters(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="新增过滤器" :visible.sync="dialogData.dialogVisible" width="30%" :before-close="dialogClose">

      <el-select v-model="dialogData.routeFiltersData.filtersKey" placeholder="请选择Key" @change="typeSelectChange">
        <el-option value="addRequestHeader">AddRequestHeader</el-option>
        <el-option value="addResponseHeade">AddResponseHeade</el-option>
        <el-option value="addRequestParameter">AddRequestParameter</el-option>
        <el-option value="dedupeResponseHeader">DedupeResponseHeader</el-option>
        <el-option value="mapRequestHeader">MapRequestHeader</el-option>
        <el-option value="prefixPath">PrefixPath</el-option>
        <el-option value="preserveHostHeader">PreserveHostHeader</el-option>
        <el-option value="removeRequestHeader">RemoveRequestHeader</el-option>
        <el-option value="removeResponseHeader">RemoveResponseHeader</el-option>
        <el-option value="removeRequestParameter">RemoveRequestParameter</el-option>
        <el-option value="rewritePath">RewritePath</el-option>
        <el-option value="stripPrefix">StripPrefix</el-option>
      </el-select>

      <el-input
          type="textarea"
          :rows="8"
          v-model="dialogData.routeFiltersData.filtersValue"
          :placeholder="'请输入路由过滤器配置：\r\n说明：' + placeholderDesc + '\r\n例如：'+placeholderText"
          style="margin-top: 10px"/>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="saveRouteFilters">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FiltersList",
  data () {
    return {
      routeObj: null,
      routeData: {},
      filtersTableData: {},
      dialogData: {
        dialogVisible: false,
        routeFiltersData: {
          filtersKey: null,
          filtersValue: null
        },
        isUpdate: false
      },
      placeholderText: '/test',
      placeholderDesc: '添加前缀'
    }
  },
  created() {
    this.getRouteList()
  },
  methods: {
    getRouteList: function () {
      this.$http.get("/y-gateway/api/getRouteList").then(res => {
        this.routeData = res.data
      })
    },
    selectChange: function (data) {
      if (data === ''){
        return
      }
      this.getRouteFiltersByRouteObj()
    },
    getRouteFiltersByRouteObj: function () {
      this.$http.get("/y-gateway/api/getRouteFiltersList",{
        params: {
          routeObj : this.routeObj
        }
      }).then(res => {
        this.filtersTableData = res.data
      })
    },
    addRoutesFilter: function () {
      if (this.routeObj === '' || this.routeObj == null){
        this.$message({
          showClose: true,
          message: '请先选择路由',
          type: 'error'
        })
        return
      }
      this.dialogData.routeFiltersData.routeObj = this.routeObj
      this.dialogData.dialogVisible = true
    },
    dialogClose: function () {
      this.dialogData = {
        dialogVisible: false,
        routeFiltersData: {
          filtersKey: null,
          filtersValue: null
        },
        isUpdate: false
      }
    },
    typeSelectChange: function (type) {
      switch (type){
        case "addRequestHeader":
          this.placeholderText = 'aaa,123'
          this.placeholderDesc = '添加请求头'
          break;
        case "addResponseHeade":
          this.placeholderText = 'aaa,123'
          this.placeholderDesc = '添加响应头'
          break;
        case "addRequestParameter":
          this.placeholderText = 'aaa,123'
          this.placeholderDesc = '添加请求参数'
          break;
        case "dedupeResponseHeader":
          this.placeholderText = 'aaa,RETAIN_FIRST'
          this.placeholderDesc = '去除重复的请求头'
          break;
        case "mapRequestHeader":
          this.placeholderText = 'aabbcc,abcd'
          this.placeholderDesc = 'Map修改请求头'
          break;
        case "prefixPath":
          this.placeholderText = '/test'
          this.placeholderDesc = '添加前缀'
          break;
        case "preserveHostHeader":
          this.placeholderText = 'null'
          this.placeholderDesc = '保持客户端的Host地址不变'
          break;
        case "removeRequestHeader":
          this.placeholderText = 'aaa'
          this.placeholderDesc = '移除请求头'
          break;
        case "removeResponseHeader":
          this.placeholderText = 'aaa'
          this.placeholderDesc = '移除响应头'
          break;
        case "removeRequestParameter":
          this.placeholderText = 'aaa'
          this.placeholderDesc = '移除请求参数'
          break;
        case "rewritePath":
          this.placeholderText = '/test/(?<abc>.*?),/${abc}'
          this.placeholderDesc = '正则表达式替换请求'
          break;
        case "stripPrefix":
          this.placeholderText = '1'
          this.placeholderDesc = '移除前缀'
          break;
      }
    },
    saveRouteFilters: function () {
      this.$http.post("/y-gateway/api/saveRouteFilters", this.dialogData.routeFiltersData).then(res => {
        if (res.data.code === 100){
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.dialogClose()
          this.getRouteFiltersByRouteObj()
        }else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })
    },
    deleteRoutefilters: function (data) {
      this.$http.post("/y-gateway/api/deleteRouteFilters", data).then(res => {
        if (res.data.code === 100){
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.dialogClose()
          this.getRouteFiltersByRouteObj()
        }else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
