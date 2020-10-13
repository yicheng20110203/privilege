<template>
  <div class="dashboard-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="搜索条件" name="1">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
          <el-form-item label="编号:" prop="number">
            <el-input v-model="dataForm.number" prefix-icon="el-icon-search" placeholder="请输入课包编号" clearable />
          </el-form-item>
          <el-form-item label="名称:" prop="name">
            <el-input v-model="dataForm.name" prefix-icon="el-icon-search" label="名称" placeholder="请输入课包名称" clearable />
          </el-form-item>
          <el-form-item label="状态:" prop="state">
            <el-select v-model="dataForm.status" placeholder="请选择课包状态">
              <el-option v-for="item in dataForm.statuslist" :key="item.key" :label="item.val" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间:" prop="date1">
            <el-date-picker
              v-model="dataForm.date1"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="至" prop="date2">
            <el-date-picker
              v-model="dataForm.date2"
              type="date"
              value-format="timestamp"
              placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="标签" prop="label">
            <el-select v-model="dataForm.label" placeholder="请选择课包标签">
              <el-option v-for="item in dataForm.tags" :key="item.key" :label="item.val" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataList">查询</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
            <el-button type="primary" @click="addLessonPackage">+创建课包</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table v-loading="dataListLoading" :data="dataList" border height="450" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="code" label="编号" header-align="center" align="center" />
      <el-table-column prop="name" label="课包名称" header-align="center" align="center" />
      <el-table-column prop="tag" label="标签" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tags" :key="item.key">{{ item.val }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lesson_nums" label="关联课程数" header-align="center" align="center" />
      <el-table-column prop="status_desc" label="状态" header-align="center" align="center" />
      <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">
            <el-button type="text" size="small" @click="onlineLessonPackage(scope.row.id)">上架</el-button>
            <el-button type="text" size="small" @click="editLessonPackage(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
          </div>
          <div v-if="scope.row.status === 2">
            <el-button type="text" size="small" @click="offlineLessonPackage(scope.row.id)">下架</el-button>
            <el-button type="text" size="small" @click="editLessonPackage(scope.row)">编辑</el-button>
          </div>
          <div v-if="scope.row.status === 3">
            <el-button type="text" size="small" @click="onlineLessonPackage(scope.row.id)">上架</el-button>
            <el-button type="text" size="small" @click="editLessonPackage(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
          </div>
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
  </div>
</template>

<script>
import {
  getLessonPackageList,
  lessonPackageOnline,
  lessonPackageOffline,
  lessonPackageDeleteLogic
} from '@/api/lessonpackage'
import { getCourseFilters } from '@/api/courseselection'
export default {
  name: 'LessonPackage',
  data() {
    return {
      activeNames: ['1'],
      dataForm: {
        number: '', // 编号
        name: '', // 名称
        status: 0, // 选中状态
        statuslist: [], // 状态列表
        tags: [], // 标签列表
        label: '', // 选中标签
        date1: '', // 开始日期
        date2: '' // 结束日期
      },
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      package_id: '', // 课包id
      dataList: []
    }
  },
  created() {
    this.getDataList()
    this.getStatusTag()
  },
  methods: {
    // 获取课包列表
    getDataList() {
      this.dataListLoading = true
      getLessonPackageList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'code': this.dataForm.number,
        'name': this.dataForm.name,
        'status': this.dataForm.status,
        'tag_key': this.dataForm.label,
        'min_create_time': !this.dataForm.date1 ? 0 : this.dataForm.date1 / 1000,
        'max_create_time': !this.dataForm.date2 ? 0 : this.dataForm.date2 / 1000
      })).then(res => {
        this.dataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
      this.dataListLoading = false
    },
    // 获取课包状态和标签
    getStatusTag() {
      getCourseFilters(this.$service.adornData({
        'show_status': 1,
        'tag_type': 5
      })).then(response => {
        if (response && response.code === 0) {
          this.dataForm.tags = response.data.tag.list
          this.dataForm.statuslist = response.data.status
        } else {
          this.dataForm.tags = []
          this.dataForm.statuslist = []
        }
      })
    },
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 创建
    addLessonPackage() {
      this.$router.push({ path: '/course/add-or-update-lessonpackage' })
    },
    // 编辑
    editLessonPackage(data) {
      this.$router.push({ path: '/course/add-or-update-lessonpackage', query: { packageid: data.id }})
    },
    // 上架
    onlineLessonPackage(packageid) {
      lessonPackageOnline(this.$service.adornData({
        'package_id': packageid
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '上架成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 下架
    offlineLessonPackage(packageid) {
      lessonPackageOffline(this.$service.adornData({
        'package_id': packageid
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '下架成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 删除
    deleteHandle(data) {
      this.$confirm(`确定对[名称=${data.name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        lessonPackageDeleteLogic(this.$service.adornData({
          'package_ids': [data.id]
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
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
    margin: 25px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
