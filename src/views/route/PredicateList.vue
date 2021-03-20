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
        <el-button type="primary" @click="addRoutePredicate" size="small">新增</el-button>
      </div>
      <el-table :data="predicateTableData.data">
        <el-table-column prop="predicateKey" label="Key" show-overflow-tooltip/>
        <el-table-column prop="predicateValue" label="Value" show-overflow-tooltip/>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
        <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip/>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button @click="updateRoutePredicate(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteRoutePredicate(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="新增断言" :visible.sync="dialogData.dialogVisible" width="30%" :before-close="dialogClose">

      <el-select v-model="dialogData.routePredicateData.predicateKey" placeholder="请选择Key" @change="typeSelectChange">
        <el-option value="path">Path</el-option>
        <el-option value="query">Query</el-option>
        <el-option value="cookie">Cookie</el-option>
        <el-option value="header">Header</el-option>
        <el-option value="host">Host</el-option>
        <el-option value="method">Method</el-option>
        <el-option value="after">After</el-option>
        <el-option value="before">Before</el-option>
        <el-option value="remoteAddr">RemoteAddr</el-option>
        <el-option value="between">Between</el-option>
      </el-select>

      <el-input
          type="textarea"
          :rows="8"
          :placeholder="'请输入路由断言配置：\r\n说明：' + placeholderDesc + '\r\n例如：'+placeholderText"
          v-model="dialogData.routePredicateData.predicateValue"
          style="margin-top: 10px"/>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="saveRoutePredicate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PredicateList",
  data () {
    return {
      routeObj: null,
      routeData: {},
      predicateTableData: {},
      dialogData: {
        dialogVisible: false,
        routePredicateData: {
          predicateKey: null,
          predicateValue: null
        },
        isUpdate: false
      },
      placeholderText: '/abc/**',
      placeholderDesc: '满足指定请求路径'
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
    selectChange: function (data){
      if (data === ''){
        return
      }
      this.getRoutePredicateList()
    },
    getRoutePredicateList(){
      this.$http.get("/y-gateway/api/getRoutePredicateList", {
        params: {
          routeObj : this.routeObj
        }
      }).then(res => {
        this.predicateTableData = res.data
      })
    },
    addRoutePredicate: function () {

      if (this.routeObj === '' || this.routeObj == null){
        this.$message({
          showClose: true,
          message: '请先选择路由',
          type: 'error'
        })
        return
      }
      this.dialogData.routePredicateData.routeObj = this.routeObj
      this.dialogData.dialogVisible = true
    },
    dialogClose: function () {
      this.dialogData = {
        dialogVisible: false,
        routePredicateData: {
          predicateKey: null,
          predicateValue: null
        },
        isUpdate: false
      }
      this.placeholderText = '/abc/**'
      this.placeholderDesc = '满足指定请求路径'
    },
    typeSelectChange: function (type) {
      switch (type){
        case 'path':
          this.placeholderText = '/abc/**'
          this.placeholderDesc = '满足指定请求路径'
          break
        case 'query':
          this.placeholderText = 'abc,1'
          this.placeholderDesc = '满足指定请求参数'
          break
        case 'cookie':
          this.placeholderText = 'abc,1'
          this.placeholderDesc = '满足指定请求Cookie'
          break
        case 'host':
          this.placeholderText = 'www.yanghuisen.cn'
          this.placeholderDesc = '满足指定Host地址'
          break
        case 'method':
          this.placeholderText = 'GET'
          this.placeholderDesc = '满足指定请求方式'
          break
        case 'after':
          this.placeholderText = '2021-03-14T15:23:19+08:00[Asia/Shanghai]'
          this.placeholderDesc = '满足指定时间之后'
          break
        case 'before':
          this.placeholderText = '2021-05-01T23:59:59+08:00[Asia/Shanghai]'
          this.placeholderDesc = '满足指定时间之前'
          break
        case 'remoteAddr':
          this.placeholderText = '192.168.0.1'
          this.placeholderDesc = '满足指定请求IP'
          break
        case 'header':
          this.placeholderText = 'abc,123'
          this.placeholderDesc = '满足指定请求头'
          break
        case 'between':
          this.placeholderText = '2021-03-14T15:23:19+08:00[Asia/Shanghai],2021-05-01T23:59:59+08:00[Asia/Shanghai]'
          this.placeholderDesc = '满足指定请求时间'
          break
      }
    },
    saveRoutePredicate: function () {
      let url = "/y-gateway/api/saveRoutePredicate"
      if (this.dialogData.isUpdate){
        url = "/y-gateway/api/updateRoutePredicate"
      }


      this.$http.post(url, this.dialogData.routePredicateData).then(res => {
        if (res.data.code === 100){
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.dialogClose()
          this.getRoutePredicateList()
        }else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })
    },
    updateRoutePredicate: function (data) {
      this.dialogData.isUpdate = true
      this.dialogData.dialogVisible = true
      this.$set(this.dialogData.routePredicateData,'id',data.id)
      this.$set(this.dialogData.routePredicateData,'predicateKey',data.predicateKey)
      this.$set(this.dialogData.routePredicateData,'predicateValue',data.predicateValue)
    },
    deleteRoutePredicate: function (data) {
      this.$http.post("/y-gateway/api/deleteRoutePredicate", data).then(res => {
        if (res.data.code === 100){
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.dialogClose()
          this.getRoutePredicateList()
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
