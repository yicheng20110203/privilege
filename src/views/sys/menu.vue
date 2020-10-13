<template>
  <div class="dashboard-container">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增一级菜单</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="menu_key"
      border
      style="width: 100%; "
    >
      <el-table-column
        prop="title"
        header-align="center"
        min-width="150"
        label="名称"
      />
      <el-table-column
        prop="menu_key"
        header-align="center"
        align="center"
        width="120"
        label="菜单标识"
      />
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="图标"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column
        prop="display_order"
        header-align="center"
        align="center"
        width="100"
        label="排序号"
      />
      <el-table-column
        prop="component"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="菜单URL"
      />
      <el-table-column
        prop="path"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="菜单路由"
      />
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import { getMenus } from '@/api/menus'
import AddOrUpdate from './menu-add-or-update'
export default {
  name: 'SysMenus',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getMenus().then(response => {
        this.dataList = response.data.items
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
          method: 'post',
          data: this.$http.adornData()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
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
