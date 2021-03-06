<template>
  <el-dialog
    title="选择章节"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="编号:" prop="code">
        <el-input v-model="dataForm.code" prefix-icon="el-icon-search" placeholder="请输入章节编号" clearable />
      </el-form-item>
      <el-form-item label="名称:" prop="name">
        <el-input v-model="dataForm.name" prefix-icon="el-icon-search" label="名称" placeholder="请输入章节名称" clearable />
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-select v-model="dataForm.tag" placeholder="请选择章节标签" clearable>
          <el-option v-for="item in tags" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-cascader
          v-model="dataForm.category"
          :options="category_list"
          :show-all-levels="false"
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          placeholder="请选择章节分类"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList">查询</el-button>
        <el-button type="primary" @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      height="300"
      style="width: 100%"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="code" label="编号" header-align="center" align="center" />
      <el-table-column prop="name" label="章节名称" header-align="center" align="center" />
      <el-table-column prop="code" label="小节" header-align="center" align="center" />
      <el-table-column prop="tags" label="标签" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.tags" :key="item.key">{{ item.val }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="categories" label="分类" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.categories" :key="item.key">{{ item.val }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="try_reading_desc" label="是否可试看" header-align="center" align="center" />
      <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
    </el-table>
    <el-row>
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
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelHandle">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定选择</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCourseFilters } from '@/api/courseselection'
import { courseChapterCanSelect, courseManagementUpdate } from '@/api/coursemanagement'
import { CHAPTER_ADD, SCENES_TWO } from '@/utils/global-element'
export default {
  name: 'CourseChooseChapter',
  props: {
    courseId: {
      type: Number,
      default: () => (0)
    }
  },
  data() {
    return {
      visible: false,
      dataListLoading: false,
      dataListSelections: [], // 多选章节
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      category_list: [], // 分类列表
      tags: [], // 标签列表
      dataForm: {
        code: '', // 编号
        name: '', // 名称
        category: '', // 选中分类
        tag: '' // 选中标签
      }
    }
  },
  methods: {
    // 显示
    openDialog() {
      this.visible = true
    },
    // 选择
    handleChange(value) {
      this.dataForm.category = value[value.length - 1]
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
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 获取课程状态和标签
    getStatusTag() {
      getCourseFilters(this.$service.adornData({
        'category_type': CHAPTER_ADD,
        'tag_type': CHAPTER_ADD
      })).then(response => {
        if (response && response.code === 0) {
          this.tags = response.data.tag.list
          this.category_list = response.data.category.list
        } else {
          this.tags = []
          this.category_list = []
        }
      })
    },
    // 获取可关联章节内容
    getDataList() {
      courseChapterCanSelect(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'lesson_id': this.courseId,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'tag_key': this.dataForm.tag,
        'category_key': this.dataForm.category
      })).then(res => {
        this.dataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
    },
    // 取消窗口
    cancelHandle() {
      this.visible = false
      this.dataListSelections = []
    },
    // 提交确定选择
    dataFormSubmit() {
      const chapterData = []
      this.dataListSelections.forEach(item => {
        const chapterList = {
          chapter_id: item.id,
          display_order: parseInt(item.display_order)
        }
        chapterData.push(chapterList)
      })
      courseManagementUpdate(this.$service.adornData({
        'id': this.courseId,
        'chapters': chapterData,
        'scenes': SCENES_TWO
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '章节添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.dataListSelections = []
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
