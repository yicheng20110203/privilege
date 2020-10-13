<template>
  <div class="dashboard-container">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
      <el-form-item>
        <el-input v-model="dataForm.login_name" prefix-icon="el-icon-search" placeholder="登录名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">创建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID"
      />
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="姓名"
      />
      <el-table-column
        prop="login_name"
        header-align="center"
        align="center"
        label="登录名"
      />
      <el-table-column
        prop="admin"
        header-align="center"
        align="center"
        label="身份权限"
      />
      <el-table-column
        prop="create_time"
        header-align="center"
        align="center"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import { getAdminUserList, adminUserDelete } from '@/api/adminUserList'
import { parseTime } from '@/utils'
import AddOrUpdate from './user-add-or-update'
export default {
  name: 'SysList',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {
        login_name: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
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
      getAdminUserList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'login_name': this.dataForm.login_name
      })).then(response => {
        if (response && response.code === 0) {
          this.dataList = response.data.list
          this.totalPage = response.data.total_size
        } else {
          this.dataList = []
          this.totalPage = 0
        }
      })
      this.dataListLoading = false
    },
    // 时间格式化
    parseTime: parseTime,
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 创建 // 编辑
    addOrUpdateHandle(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    // 删除
    deleteHandle(data) {
      this.$confirm(`确定对[id=${data.id}]进行[${data.id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adminUserDelete(this.$service.adornData({
          'login_name': data.login_name,
          'id': data.id
        })).then((data) => {
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
