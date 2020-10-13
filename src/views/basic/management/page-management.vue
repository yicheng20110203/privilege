<template>
  <div class="dashboard-container">
    <el-form ref="dataForm" :inline="true" label-suffix=":" :model="dataForm" @keyup.enter.native="getDataList">
      <el-form-item label="页面名称" prop="name">
        <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入页面名称" clearable />
      </el-form-item>
      <el-button type="primary" @click="getDataList">查询</el-button>
      <el-button type="primary" @click="resetForm('dataForm')">重置</el-button>
      <el-button type="warning" @click="createPage">+创建</el-button>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border height="450" style="width: 100%">
      <el-table-column prop="identifier" label="唯一标识" header-align="center" align="center" />
      <el-table-column prop="name" label="页面名称" header-align="center" align="center" />
      <el-table-column prop="desc" label="备注" header-align="center" align="center" />
      <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="buildPage(scope.row.id)">搭建页面</el-button>
          <el-button type="text" size="small" @click="updatePageHandle(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deletePageHandle(scope.row)">删除</el-button>
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
    <create-page
      ref="CreatePage"
      @refreshpage="getDataList"
    />
  </div>
</template>

<script>
import CreatePage from './create-page'
import { getPageList, pageDelete } from '@/api/page'
export default {
  name: 'PageManagement',
  components: {
    CreatePage
  },
  data() {
    return {
      dataList: [], // 列表
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataForm: {
        name: '' // 页面名称
      }
    }
  },
  created() {
    // 获取页面列表
    this.getDataList()
  },
  methods: {
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 创建页面
    createPage() {
      this.$refs.CreatePage.openDialog()
      this.$nextTick(() => {
        this.$refs.CreatePage.init()
      })
    },
    // 搭建页面
    buildPage(id) {},
    // 查询
    getDataList() {
      this.dataListLoading = true
      getPageList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'name': this.dataForm.name
      })).then(res => {
        this.dataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
      this.dataListLoading = false
    },
    // 更新页面
    updatePageHandle(data) {
      this.$refs.CreatePage.openDialog()
      this.$nextTick(() => {
        this.$refs.CreatePage.init(data)
      })
    },
    // 删除页面
    deletePageHandle(data) {
      this.$confirm(`确定对[名称=${data.name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pageDelete(this.$service.adornData({
          'id': [data.id]
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '页面删除成功',
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
