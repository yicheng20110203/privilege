<template>
  <div class="dashboard-container">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getRoles()">
      <el-form-item>
        <el-input v-model="dataForm.roleName" prefix-icon="el-icon-search" placeholder="角色名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getRoles()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="dataListLoading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        label="角色名称"
        prop="name"
        align="center"
      />
      <el-table-column
        label="备注"
        prop="desc"
        align="center"
      />
      <el-table-column
        label="创建时间"
        prop="create_time"
        align="center"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="addOrUpdateHandle(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      style="float:right;margin-top: 20px"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="20%"
      :center="true"
      :show-close="false"
      :before-close="handleClose"
    >
      <span style="font-size: 20px;display:block;text-align: center"><b>确定删除吗?</b></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" style="margin-left: 20px;" @click="delRole">删 除</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getRoles()" />
  </div>
</template>
<script>
import AddOrUpdate from './role-add-or-update'
import { getRoleList, deleteRole } from '@/api/role'
import { parseTime } from '@/utils'

export default {
  name: 'SysRoles',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {
        roleName: ''
      },
      dataListLoading: false,
      dialogVisible: false,
      deleteId: 0,
      deleteIndex: -1,
      tableData: [],
      currentPage: 0,
      pageSize: 10,
      totalPage: 0,
      addOrUpdateVisible: false
    }
  },
  created() {
    this.getRoles()
  },

  methods: {
    getRoles() {
      this.dataListLoading = true
      const data = this.$service.adornData({
        page: this.currentPage,
        size: this.pageSize,
        name: this.dataForm.roleName
      })
      getRoleList(data).then((response) => {
        this.tableData = response.data.list
        this.totalPage = response.data.total_size
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
        console.log('获取角色列表异常')
      }
      )
    },
    // 时间格式化
    parseTime: parseTime,
    // 点击删除
    handleDelete(index, row) {
      this.dialogVisible = true
      this.deleteId = this.tableData[index].id
      this.deleteIndex = index
      console.log(index, row)
    },
    // 关闭删除框
    handleClose() {
      this.dialogVisible = false
      console.log('handleClose')
    },
    // 删除角色
    delRole() {
      this.dialogVisible = false
      const data = this.$service.adornData({
        id: this.deleteId
      })
      deleteRole(data).then(() => {
        this.getRoles()
      }).catch(() => {
        console.log('删除角色失败')
      }
      )
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getRoles()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
      this.getRoles()
    },
    // 新增或编辑角色
    addOrUpdateHandle(row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
