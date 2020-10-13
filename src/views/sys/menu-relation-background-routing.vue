<template>
  <div class="dashboard-container">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="relationRoutingHandle">+关联后台路由</el-button>
      </el-form-item>
    </el-form>
    <el-container>
      <el-aside width="250px">
        <menu-tree
          v-if="menuList.length"
          ref="MenuTree"
          :data-tree="menuList"
          :default-props="defaultProps"
          @nodeClick="switchCategory"
        />
      </el-aside>
      <el-main>
        <el-table v-loading="dataListLoading" :data="dataList" border height="450" style="width:100%">
          <el-table-column prop="id" label="ID" header-align="center" align="center" />
          <el-table-column prop="menu_key" label="菜单标识" header-align="center" align="center" />
          <el-table-column prop="back_url" label="后台路由" header-align="center" align="center" />
          <el-table-column prop="desc" label="简介" header-align="center" align="center" />
          <el-table-column label="操作" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editMenuLinkRoutingHandle(scope.row.id)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          style="float:right;margin-top:20px;"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </el-main>
    </el-container>
    <menu-link-routing-add
      ref="MenuLinkRoutingAdd"
      @refreshDataList="getMenuBackList({ 'menu_key': Menukey })"
    />
  </div>
</template>

<script>
import { getMenusAll } from '@/api/menus'
import { getMenuBackUrlList, menuBackUrlDelete } from '@/api/menubackurl'
import MenuTree from '@/components/MenuTree'
import MenuLinkRoutingAdd from './menu-relation-link-routing-add'
export default {
  name: 'MenuRelationBackgroundRouting',
  components: {
    MenuTree,
    MenuLinkRoutingAdd
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      Menukey: '',
      menuList: [], // 菜单列表
      dataListLoading: false,
      dataList: [],
      // 树形菜单配置参数
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dataForm: {}
    }
  },
  created() {
    // 获取菜单列表
    this.getDataList()
  },
  methods: {
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getMenuBackList({ 'menu_key': this.Menukey })
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getMenuBackList({ 'menu_key': this.Menukey })
    },
    // 关联后台路由
    relationRoutingHandle() {
      this.$refs.MenuLinkRoutingAdd.openDialog()
      this.$nextTick(() => {
        this.$refs.MenuLinkRoutingAdd.getDataList()
      })
    },
    // 获取菜单列表
    getDataList() {
      getMenusAll().then(res => {
        this.menuList = res.data.items
      })
    },
    // 获取菜单后台路由关联
    getMenuBackList(menu_key = {}) {
      getMenuBackUrlList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        ...menu_key
      })).then(res => {
        this.dataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
    },
    // 切换菜单
    switchCategory(item) {
      this.Menukey = item.menu_key
      this.getMenuBackList({ 'menu_key': this.Menukey })
    },
    // 编辑关联
    editMenuLinkRoutingHandle(id) {
      this.$refs.MenuLinkRoutingAdd.openDialog()
      this.$nextTick(() => {
        this.$refs.MenuLinkRoutingAdd.init(id)
        this.$refs.MenuLinkRoutingAdd.getDataList()
      })
    },
    // 删除关联
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menuBackUrlDelete(this.$service.adornData({
          'id': id
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getMenuBackList({ 'menu_key': this.Menukey })
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
