<template>
  <div style="height: 100%">
    <el-card>
      <el-form :inline="true" :model="formData">
        <el-form-item label="路由ID">
          <el-input v-model="formData.routeId" placeholder="请输入路由ID"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" placeholder="状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="formData.type" placeholder="类别">
            <el-option label="服务名" value="0"></el-option>
            <el-option label="URL" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRouteList">查询</el-button>
          <el-button type="primary" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px" :body-style="{ height: '100%'}">
      <div>
        <el-button type="primary" @click="addRoute(0)" size="small">新增(服务名)</el-button>
        <el-button type="primary" @click="addRoute(1)" size="small">新增(URL)</el-button>
      </div>
      <el-table :data="tableData.data">
        <el-table-column prop="routeId" label="路由ID" show-overflow-tooltip/>
        <el-table-column prop="uri" label="URI" show-overflow-tooltip/>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" size="small">服务名</el-tag>
            <el-tag type="success" v-else size="small">URL</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="predicates" label="断言">
          <template slot-scope="scope">
            <el-button @click="showPredicate(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="filters" label="过滤器">
          <template slot-scope="scope">
            <el-button @click="addRoute(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ord" label="排序"/>
        <el-table-column prop="remarks" label="描述" show-overflow-tooltip/>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="updateStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip/>
        <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip/>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button @click="updateRoute(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteRoute(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 10px;float: right" layout="total, prev, pager, next" :total="tableData.total"/>
    </el-card>


    <el-dialog :title="dialogData.title" :visible.sync="dialogData.dialogVisible" width="30%" :before-close="dialogClose">
      <el-input v-model="dialogData.routeDate.routeId" placeholder="请输入路由ID" />
      <el-input v-model="dialogData.routeDate.uri" placeholder="请输入路由URI" style="margin-top: 10px" v-if="dialogData.routeDate.type === 1"/>
      <el-select v-model="dialogData.routeDate.uri" placeholder="请选择服务名" style="width: 100%; margin-top: 10px" v-else>
        <el-option
            v-for="item in serviceList"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-input-number v-model="dialogData.routeDate.ord" :min="0"  label="排序"  style="margin-top: 10px;margin-right: 15px"/><span style="color: red;font-size: 14px">数字越小，匹配优先级越高</span>
      <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入路由描述"
          v-model="dialogData.routeDate.remarks"
          style="margin-top: 10px"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="saveRoute">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="predicateDialogData.title" :visible.sync="predicateDialogData.dialogVisible" width="30%" :before-close="predicateDialogClose">

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RouteList",
  data () {
    return {
      formData: {},
      tableData: {},
      dialogData: {
        routeDate: {
          ord: 0,
          type: 0
        },
        dialogVisible: false,
        isUpdate: false
      },
      serviceList: [],
      predicateDialogData: {
        title: '断言',
        tableData: {},
        dialogVisible: false
      }
    }
  },
  created() {
    this.getRouteList()
  },
  methods: {
    getRouteList: function () {
      this.$http.get("/y-gateway/api/getRouteList",{
        params: this.formData
      }).then(res => {
        this.tableData = res.data
      })
    },
    addRoute: function (type) {
      if (type === 0) {
        this.getServiceList()
      }
      this.dialogData.routeDate.type = type
      this.dialogData.title = type?'新增(URL)':'新增(服务名)'
      this.dialogData.dialogVisible = true
    },
    dialogClose: function (){
      this.dialogData = {
        routeDate: {
          ord: 0,
          type: 0
        },
        dialogVisible: false,
        isUpdate: false
      }
    },
    getServiceList: function (){
      this.$http.get("/y-gateway/api/getServiceList").then(res => {
        this.serviceList = res.data
      })
    },
    saveRoute: function () {
      let url = "/y-gateway/api/saveRoute"
      if (this.dialogData.isUpdate) {
        url = "/y-gateway/api/updateRoute"
      }
      this.$http.post(url, this.dialogData.routeDate).then(res => {
        if (res.data.code === 100){
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.dialogClose()
          this.getRouteList()
        }else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })
    },
    updateRoute: function (data) {
      this.dialogData.routeDate.id = data.id
      this.$set(this.dialogData.routeDate,"routeId",data.routeId)
      this.$set(this.dialogData.routeDate,"uri",data.uri)
      this.$set(this.dialogData.routeDate,"ord",data.ord)
      this.$set(this.dialogData.routeDate,"type",data.type)
      this.$set(this.dialogData.routeDate,"remarks",data.remarks)
      this.dialogData.title = data.type?'编辑(URL)':'编辑(服务名)'
      this.dialogData.dialogVisible = true
      this.dialogData.isUpdate = true
      if (data.type === 0) {
        this.getServiceList()
      }
    },
    updateStatus(data){
      this.$http.post("/y-gateway/api/updateStatus",data).then(res => {
        if (res.data.code === 100){
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.dialogClose()
          this.getRouteList()
        }else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })
    },
    resetClick(){
      this.formData = {}
      this.getRouteList()
    },
    deleteRoute(data){
      this.$http.post("/y-gateway/api/deleteRoute",data).then(res => {
        if (res.data.code === 100){
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'success'
          });
          this.dialogClose()
          this.getRouteList()
        }else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })
    },
    showPredicate: function () {
      this.predicateDialogData.dialogVisible = true
    },
    predicateDialogClose: function () {
      this.predicateDialogData.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-form-item{
  margin-bottom: 0;
}
.el-card-define {
  min-height: 100%;
  height: 100%;
}
.el-card-define >>> .el-card__body {
  height: 100%;
}
</style>
