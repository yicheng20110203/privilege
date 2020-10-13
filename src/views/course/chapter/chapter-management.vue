<template>
  <div class="dashboard-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="搜索条件" name="1">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="编号" prop="code">
            <el-input v-model="dataForm.code" prefix-icon="el-icon-search" placeholder="请输入章节编号" clearable />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入章节名称" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="dataForm.status" label="请选择">
              <el-option v-for="item in dataForm.statuslist" :key="item.key" :label="item.val" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="chapter_type">
            <el-select v-model="dataForm.chapter_type" label="请选择">
              <el-option v-for="item in dataForm.chapterTypeList" :key="item.key" :label="item.val" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="tag">
            <el-select v-model="dataForm.tag" label="请选择">
              <el-option v-for="item in dataForm.tags" :key="item.key" :label="item.val" :value="item.key" />
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
          <el-button type="primary" @click="getDataList">查询</el-button>
          <el-button @click="resetForm('dataForm')">重置</el-button>
          <el-button type="primary" @click="addChapterHandle">+创建章节</el-button>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-container>
      <el-aside width="240px">
        <p>章节分类</p>
        <div class="category">
          <div class="category-item">
            <el-button type="text" @click="getDataList">全部分类</el-button>
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
        />
      </el-aside>

      <el-main>
        <el-table v-loading="dataListLoading" :data="chapterDataList" border height="450" style="width:100%">
          <el-table-column type="selection" header-align="center" align="center" width="50" />
          <el-table-column prop="code" label="编号" header-align="center" align="center" />
          <el-table-column prop="name" label="章节名称" header-align="center" align="center" />
          <el-table-column prop="section_nums" label="关联小节" header-align="center" align="center" />
          <el-table-column prop="desc" label="备注" header-align="center" align="center" />
          <el-table-column prop="status_desc" label="状态" header-align="center" align="center" />
          <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
          <el-table-column label="操作" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 1">
                <el-button type="text" size="small" @click="onlineChapter(scope.row.id)">上架</el-button>
                <el-button type="text" size="small" @click="editChapterHandle(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
              </div>
              <div v-if="scope.row.status === 2">
                <el-button type="text" size="small" @click="offlineChapter(scope.row.id)">下架</el-button>
                <el-button type="text" size="small" @click="editChapterHandle(scope.row)">编辑</el-button>
              </div>
              <div v-if="scope.row.status === 3">
                <el-button type="text" size="small" @click="onlineChapter(scope.row.id)">上架</el-button>
                <el-button type="text" size="small" @click="editChapterHandle(scope.row)">编辑</el-button>
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
import categoryAdd from '@/components/CategoryAdd/index'
import { getChapterList, chapterDeleteLogic, chapterOnline, chapterOffline } from '@/api/chapter'
import { getCourseFilters } from '@/api/courseselection'
import { getCategoryListTree } from '@/api/categorytree'
import { CHAPTER, TYPE_ARTICLE } from '@/utils/global-element'
export default {
  name: 'ChapterManagement',
  components: {
    tissueTree,
    categoryAdd
  },
  data() {
    return {
      activeNames: ['1'],
      menuSelect: CHAPTER, // 章节管理分类
      categoryList: [], // 分类
      categorykey: '', // 章节分类key搜索
      materialCategoryType: TYPE_ARTICLE, // 章节分类添加
      // 树形控件配置参数
      defaultProps: {
        children: 'children',
        label: 'val'
      },
      dataForm: {
        code: '', // 编号
        name: '', // 名称
        status: 0, // 选中状态
        chapter_type: 0, // 类型
        tag: '', // 标签
        tags: [], // 标签列表
        statuslist: [], // 状态列表
        chapterTypeList: [], // 章节类型
        date1: '',
        date2: ''
      },
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      chapter_id: '', // 章节id
      chapterDataList: []
    }
  },
  created() {
    // 获取章节分类
    this.getCategoryList({ 'types': this.menuSelect })
    // 获取章节列表
    this.getDataList()
    // 获取章节标签
    this.getStatusTag()
  },
  methods: {
    // 获取分类
    getCategoryList(types = {}) {
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        if (res && res.code === 0) {
          this.categoryList = res.data.list
        } else {
          this.categoryList = []
        }
      })
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
    // 获取章节列表
    getDataList(type = {}) {
      getChapterList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'status': this.dataForm.status,
        'tag_key': this.dataForm.tag,
        'chapter_type': this.dataForm.chapter_type,
        'min_create_time': !this.dataForm.date1 ? 0 : this.dataForm.date1 / 1000,
        'max_create_time': !this.dataForm.date2 ? 0 : this.dataForm.date2 / 1000,
        ...type
      })).then(response => {
        if (response && response.code === 0) {
          this.chapterDataList = response.data.list
          this.totalPage = response.data.total_size
        } else {
          this.chapterDataList = []
          this.totalPage = 0
        }
      })
    },
    // 获取章节类型/标签/状态
    getStatusTag() {
      getCourseFilters(this.$service.adornData({
        'show_status': 1, // 状态
        'show_lesson_type': 1, // 课程类型
        'tag_type': 3 // 标签类型
      })).then(response => {
        if (response && response.code === 0) {
          this.dataForm.tags = response.data.tag.list
          this.dataForm.statuslist = response.data.status
          this.dataForm.chapterTypeList = response.data.lesson_type
        } else {
          this.dataForm.tags = []
          this.dataForm.statuslist = []
          this.dataForm.chapterTypeList = []
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
    },
    // 创建章节
    addChapterHandle() {
      this.$router.push({ path: '/course/add-or-update-chapter' })
    },
    // 编辑章节
    editChapterHandle(data) {
      this.$router.replace({ path: '/course/add-or-update-chapter', query: { chapterid: data.id }})
    },
    // 上架
    onlineChapter(chapterid) {
      this.chapter_id	 = chapterid
      chapterOnline(this.$service.adornData({
        'chapter_id	': this.chapter_id
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
    offlineChapter(chapterid) {
      this.chapter_id	 = chapterid
      chapterOffline(this.$service.adornData({
        'chapter_id	': this.chapter_id
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
        chapterDeleteLogic(this.$service.adornData({
          'chapter_ids': [data.id]
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
