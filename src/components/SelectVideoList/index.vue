<template>
  <el-dialog
    title="选择视频"
    :close-on-click-modal="false"
    :visible.sync="visible"
    center
    width="60%"
    append-to-body
    @closed="closedDialog"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :inline="true"
      size="medium"
      label-suffix=":"
      @keyup.enter.native="getDataList"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="dataForm.name"
          placeholder="请输入视频名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="素材分类" prop="classification">
        <el-cascader
          v-model="dataForm.classification"
          :options="categoryList"
          :show-all-levels="false"
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          placeholder="请选择素材分类"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-button type="primary" @click="getDataList">查询</el-button>
      <el-button type="primary" @click="resetForm('dataForm')">重置</el-button>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      height="300"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="视频ID"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-radio-group v-model="dataForm.materialId">
            <el-radio :label="scope.row.id" @change="radioChange(scope)" />
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="entity_id"
        label="视频"
        header-align="center"
        align="center"
      />
      <el-table-column prop="name" label="名称" header-align="center" align="center" />
      <el-table-column prop="size_desc" label="视频大小" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.size_desc|fileSizeFilter(scope.row.size_desc) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time_desc"
        label="创建时间"
        header-align="center"
        align="center"
      />
    </el-table>
    <el-col>
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        style="float:right;margin-top:10px;margin-bottom: 5px"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </el-col>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getMaterialList } from '@/api/material'
import { getCategoryListTree } from '@/api/categorytree'
import { TYPE_VIDEO, MATERIAL_VIDEO } from '@/utils/global-element'
export default {
  name: 'SelectMaterialVideo',
  data() {
    return {
      visible: false,
      is_popover: true,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [], // 视频列表
      categoryList: [], // 视频分类
      radioVidelList: '',
      dataListLoading: false,
      // 树形控件配置参数
      defaultProps: {
        children: 'children',
        label: 'val'
      },
      dataForm: {
        materialId: '', // 素材id
        name: '',
        classify: '', // 分类key
        classification: '' // 选中素材分类
      }
    }
  },
  methods: {
    // 确定选择
    dataFormSubmit() {
      this.visible = false
      this.dataForm.materialId = ''
      this.$emit('refreshVideoDataList', this.radioVidelList)
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
    // 获取视频-列表
    getDataList() {
      getMaterialList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'name': this.dataForm.name,
        'category_key': this.dataForm.classification,
        'type': TYPE_VIDEO
      })).then(res => {
        this.dataList = res && res.code === 0 ? this.dataList = res.data.list : []
        this.totalPage = res && res.code === 0 ? this.totalPage = res.data.total_size : []
      })
    },
    // 获取视频分类
    getCategoryList() {
      getCategoryListTree(this.$service.adornData({
        'types': MATERIAL_VIDEO
      })).then(res => {
        this.categoryList = res && res.code === 0 ? res.data.list : this.categoryList = []
      })
    },
    // 选择视频 - 触发
    radioChange(data) {
      // console.log('选择视频 - 触发', data.row)
      this.radioVidelList = data.row
    },
    // 选择素材视频分类
    handleChange(value) {
      // 选中获取分类
      if (value) {
        this.dataForm.classification = value[value.length - 1]
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataForm.materialId = ''
      this.getDataList()
    },
    // 关闭窗口
    closedDialog() {
      this.visible = false
      this.dataForm.materialId = ''
      this.resetForm('dataForm')
    },
    // 打开窗口
    openDialog() {
      this.visible = true
    },
    // 取消窗口
    cancelHandle() {
      this.visible = false
      this.dataForm.materialId = ''
      this.resetForm('dataForm')
    }
  }

}
</script>
<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 190px;
      overflow: hidden;
    }
  }
</style>
