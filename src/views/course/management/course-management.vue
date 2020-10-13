<template>
  <div class="dashboard-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="搜索条件" name="1">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
          <el-form-item label="编号" prop="code">
            <el-input v-model="dataForm.code" prefix-icon="el-icon-search" placeholder="请输入课程编号" clearable />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入课程名称" clearable />
          </el-form-item>
          <el-form-item label="课程类型" prop="course_type">
            <el-select v-model="dataForm.course_type" placeholder="请选择课程类型">
              <el-option v-for="item in dataForm.courseTypeList" :key="item.key" :label="item.val" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="dataForm.price" :min="0" :max="9999999" :precision="2" />
          </el-form-item>
          <el-form-item label="至" prop="price2">
            <el-input-number v-model="dataForm.price2" :min="0" :max="9999999" :precision="2" />
          </el-form-item>
          <el-form-item label="创建时间" prop="date1">
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
          <el-form-item label="标签" prop="tag">
            <el-select v-model="dataForm.tag" placeholder="请选择课程标签">
              <el-option v-for="item in dataForm.tags" :key="item.key" :label="item.val" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model="dataForm.status" placeholder="请选择课程状态">
              <el-option v-for="item in dataForm.statuslist" :key="item.key" :label="item.val" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="getDataList">查询</el-button>
          <el-button @click="resetForm('dataForm')">重置</el-button>
          <el-button type="primary" @click="addCourseHandle">+创建课程</el-button>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-container>
      <el-aside width="240px">
        <p>课程分类</p>
        <div class="category">
          <div class="category-item">
            <el-button type="text" @click="getDataList()">全部分类</el-button>
          </div>
          <div class="category-item category-item-icon">
            <el-button
              type="text"
              size="medium"
              icon="el-icon-circle-plus-outline"
              @click="categoryAddHandle"
            />
          </div>
        </div>
        <tissue-tree
          v-if="categoryList.length"
          :data-tree="categoryList"
          :default-props="defaultProps"
          :category-type="materialCategoryType"
          @nodeClick="switchCategory"
          @refreshCategoryDataList="getCategoryList({ 'types': menuSelect })"
        />
      </el-aside>

      <el-main>
        <el-table v-loading="dataListLoading" :data="courseDataList" border height="450" style="width:100%">
          <el-table-column type="selection" header-align="center" align="center" width="50" />
          <el-table-column prop="code" label="编号" header-align="center" align="center" />
          <el-table-column prop="name" label="名称" header-align="center" align="center" />
          <el-table-column prop="chapter_nums" label="章节数量" header-align="center" align="center" />
          <el-table-column prop="tags" label="标签" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.tags" :key="item.key">{{ item.val }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.categories" :key="item.key">{{ item.val }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" header-align="center" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.price === 0">免费</div>
              <div v-if="scope.row.price > 0">{{ scope.row.price|priceFilter(scope.row.price) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status_desc" label="状态" header-align="center" align="center" />
          <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
          <el-table-column label="操作" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 1">
                <el-button type="text" size="small" @click="onlineCoursePackage(scope.row.id)">上架</el-button>
                <el-button type="text" size="small" @click="editCourseHandle(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
              </div>
              <div v-if="scope.row.status === 2">
                <el-button type="text" size="small" @click="offlineCoursePackage(scope.row.id)">下架</el-button>
                <el-button type="text" size="small" @click="editCourseHandle(scope.row)">编辑</el-button>
              </div>
              <div v-if="scope.row.status === 3">
                <el-button type="text" size="small" @click="onlineCoursePackage(scope.row.id)">上架</el-button>
                <el-button type="text" size="small" @click="editCourseHandle(scope.row)">编辑</el-button>
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
      </el-main>
    </el-container>
    <category-add
      ref="categoryAdd"
      :category-type="materialCategoryType"
      @refreshCategoryDataList="getCategoryList({ 'types': menuSelect })"
    />
  </div>
</template>

<script>
import tissueTree from '@/components/Tree/index'
import { getCourseList, courseManagementDeleteLogic, courseOnline, courseOffline } from '@/api/coursemanagement'
import categoryAdd from '@/components/CategoryAdd/index'
import { getCategoryListTree } from '@/api/categorytree'
import { getCourseFilters } from '@/api/courseselection'
import { COURSE, COURSE_ADD } from '@/utils/global-element'
export default {
  name: 'CourseManagement',
  components: {
    tissueTree,
    categoryAdd
  },
  data() {
    return {
      activeNames: ['1'],
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      menuSelect: COURSE, // 课程管理分类
      categoryList: [], // 分类
      categorykey: '', // 分类key搜索
      materialCategoryType: COURSE_ADD, // 课程分类添加
      // 树形控件配置参数
      defaultProps: {
        children: 'children',
        label: 'val'
      },
      dataForm: {
        code: '',
        name: '',
        course_type: '', // 默认所有课程类型
        tag: '', // 选中标签
        status: 0, // 选中状态
        statuslist: [], // 状态列表
        tags: [], // 标签列表
        courseTypeList: [], // 课程列表
        label: '', // 选中标签
        date1: '',
        date2: '',
        price: 0,
        price2: 0,
        create_time: ''
      },
      lesson_id: '',
      courseDataList: []
    }
  },
  created() {
    // 获取列表
    this.getDataList()
    // 获取标签
    this.getStatusTag()
    // 获取课程分类
    this.getCategoryList({ 'types': this.menuSelect })
  },
  methods: {
    // 创建
    addCourseHandle() {
      sessionStorage.setItem('active', 0)
      this.$router.push({ path: '/course/add-or-update-course' })
    },
    // 编辑课程
    editCourseHandle(data) {
      sessionStorage.setItem('active', 0)
      this.$router.replace({ path: '/course/add-or-update-course', query: { courseid: data.id }})
    },
    // 获取分类
    getCategoryList(types = {}) {
      this.dataListLoading = true
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        if (res && res.code === 0) {
          this.categoryList = res.data.list
        } else {
          this.categoryList = []
        }
      })
      this.dataListLoading = false
    },
    // 切换分类
    switchCategory(item) {
      this.categorykey = item.key // 获取菜单分类key
      this.getDataList({ 'category_key': this.categorykey })
    },
    // 添加分类
    categoryAddHandle() {
      // 调用组件方法,打开组件
      this.$refs.categoryAdd.openDialog()
    },
    // 课程列表
    getDataList(type = {}) {
      this.dataListLoading = true
      getCourseList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'tag_key': this.dataForm.tag,
        'status': this.dataForm.status,
        'lesson_type': !this.dataForm.course_type ? 0 : this.dataForm.course_type,
        'min_price': parseInt(this.dataForm.price),
        'max_price': parseInt(this.dataForm.price2),
        'min_create_time': !this.dataForm.date1 ? 0 : this.dataForm.date1 / 1000,
        'max_create_time': !this.dataForm.date2 ? 0 : this.dataForm.date2 / 1000,
        ...type
      })).then(res => {
        this.courseDataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
      this.dataListLoading = false
    },
    // 获取课程类型/标签/状态
    getStatusTag() {
      getCourseFilters(this.$service.adornData({
        'show_status': 1, // 状态
        'show_lesson_type': 1, // 课程类型
        'tag_type': 2 // 标签类型
      })).then(response => {
        if (response && response.code === 0) {
          this.dataForm.tags = response.data.tag.list
          this.dataForm.statuslist = response.data.status
          this.dataForm.courseTypeList = response.data.lesson_type
        } else {
          this.dataForm.tags = []
          this.dataForm.statuslist = []
          this.dataForm.course_type = []
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
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 上架
    onlineCoursePackage(lessonid) {
      courseOnline(this.$service.adornData({
        'lesson_id': lessonid
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
    offlineCoursePackage(lessonid) {
      courseOffline(this.$service.adornData({
        'lesson_id': lessonid
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
      this.$confirm(`确定对[名称=${data.name}]进行[${data.name ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseManagementDeleteLogic(this.$service.adornData({
          'lesson_ids': [data.id]
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

 .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 4px;
  }

.category {
  display:flex;
  font-size:14px;
  justify-content: space-between;
  &-item {
    align-self: center;
  }
  &-item-icon {
    padding-right: 10px;
  }
}
</style>
