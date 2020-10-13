<template>
  <el-dialog
    title="添加内容"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
      <el-form-item label="编号" prop="code">
        <el-input v-model="dataForm.code" prefix-icon="el-icon-search" placeholder="请输入内容编号" clearable />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" prefix-icon="el-icon-search" label="名称" placeholder="请输入内容名称" clearable />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择内容类型" clearable>
          <el-option v-for="item in materialTypeList" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="分类" prop="category">
        <el-select
          v-model="dataForm.category"
          clearable
          placeholder="请选择内容分类"
        >
          <el-option v-for="item in categoryList" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item> -->
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
      <el-table-column prop="name" label="名称" header-align="center" align="center" />
      <el-table-column prop="material_type_desc" label="小节类型" header-align="center" align="center" />
      <el-table-column prop="categories" label="分类" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.categories" :key="item.key">{{ item.val }}</el-tag>
        </template>
      </el-table-column>
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
import { chapterSectionCanSelect, chapterUpdate } from '@/api/chapter'
import { SCENES_TWO } from '@/utils/global-element'
export default {
  name: 'ChooseChapter',
  props: {
    chapterId: {
      type: Number,
      default: () => (0)
    }
  },
  data() {
    return {
      visible: false,
      dataListLoading: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [], // 保存多选数据
      materialTypeList: [], // 类型
      categoryList: [], // 分类
      dataForm: {
        code: '', // 编号
        name: '', // 名称
        category: '', // 选中分类
        type: 0 // 类型标签
      }
    }
  },
  methods: {
    // 显示
    openDialog() {
      this.visible = true
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
    // 获取-素材-类型
    getMaterialTypes() {
      getCourseFilters(this.$service.adornData({
        'show_material_type': 1
      })).then(res => {
        this.materialTypeList = res && res.code === 0 ? res.data.material_type : []
      })
    },
    // 获取 - 素材 - 分类
    getCategoryList(data) {
      getCourseFilters(this.$service.adornData({
        'category_type': data
      })).then(res => {
        this.categoryList = res && res.code === 0 ? res.data.category : []
      })
    },
    // 查询
    getDataList() {
      chapterSectionCanSelect(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'chapter_id': this.chapterId,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'material_type': this.dataForm.type
      })).then(res => {
        this.dataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
    },
    // 选择类型，请求分类接口
    selectChangeHandle(val) {
      console.log('分类', val)
    },
    // 取消窗口
    cancelHandle() {
      this.visible = false
      this.dataListSelections = []
    },
    // 提交确定选择
    dataFormSubmit() {
      const sectionsData = []
      this.dataListSelections.forEach(item => {
        const sectionsList = {
          section_id: item.id,
          display_order: item.display_order,
          try_reading: item.try_reading
        }
        sectionsData.push(sectionsList)
      })
      console.log('提交-确定选择', this.$service.adornData({
        'id': this.chapterId,
        'sections': sectionsData,
        'scenes': SCENES_TWO
      }))
      chapterUpdate(this.$service.adornData({
        'id': this.chapterId,
        'sections': sectionsData,
        'scenes': SCENES_TWO
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '内容添加成功',
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
