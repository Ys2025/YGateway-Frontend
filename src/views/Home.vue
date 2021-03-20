<template>
  <div id="home">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" class="aside">
        <el-menu class="el_menu" router>
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-message"></i>路由管理</template>
            <el-menu-item index="/route/list">路由列表</el-menu-item>
            <el-menu-item index="/predicate/list">断言列表</el-menu-item>
            <el-menu-item index="/filters/list">过滤列表</el-menu-item>
            <el-menu-item index="1-1">回收站</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-message"></i>放行管理</template>
            <el-menu-item index="1-1">放行列表</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-message"></i>访问统计</template>
            <el-menu-item index="1-1">统计列表</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-message"></i>系统管理</template>
            <el-menu-item index="1-1">系统配置</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <span>YGateway</span>
          <div style="float: right;font-size: 12px">
            <el-dropdown>
            <span class="el-dropdown-link">
              Admin<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
#home{
  height: 100%;
}
.el-header {
  /*background-color: #B3C0D1;*/
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.main{
  background: #f4f5fa;
}
</style>

<script>
export default {
  data() {
    return {
      collapseIco: 'el-icon-s-fold'
    }
  }
}
</script>
