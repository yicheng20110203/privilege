<template>
  <el-dialog
    :title="submitType===1 ? '编辑视频信息' : submitType===2 ? '编辑音频信息' : '编辑图片信息'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
  >
    <el-form ref="dataForm" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item v-if="submitType===1" label="视频名称" prop="name">
        <el-col :span="12">
          <el-input v-model="dataForm.name" placeholder="请输入视频名称" clearable />
        </el-col>
      </el-form-item>
      <el-form-item v-if="submitType===2" label="音频名称" prop="name">
        <el-col :span="12">
          <el-input v-model="dataForm.name" placeholder="请输入音频名称" clearable />
        </el-col>
      </el-form-item>
      <el-form-item v-if="submitType===4" label="图片名称" prop="name">
        <el-col :span="12">
          <el-input v-model="dataForm.name" placeholder="请输入图片名称" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="所属分类" prop="classify">
        <el-cascader
          v-model="dataForm.classify"
          :options="menuCategory"
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          placeholder="请选择分类"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelHandle">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { materialUpdate } from '@/api/material'
export default {
  name: 'MaterialEdit',
  props: {
    menuCategory: {
      type: Array,
      default: () => ([])
    },
    submitType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      visible: false,
      dataForm: {
        id: '', // 素材id
        name: '', // 名称
        classify: '' // 分类
      }
    }
  },
  methods: {
    // 获取数据
    init(data) {
      this.dataForm.id = data.id
      this.dataForm.name = data.name
      this.dataForm.classify = data.categories[0].key
    },
    // 打开窗口
    openDialog() {
      this.visible = true
    },
    // 取消
    cancelHandle() {
      this.visible = false
      this.dataForm.classify = ''
    },
    // 确定
    dataFormSubmit() {
      materialUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'name': this.dataForm.name,
        'type': this.submitType,
        'category_key': this.dataForm.classify[0]
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: this.submitType === 1 ? '编辑视频信息成功' : this.submitType === 2 ? '编辑音频信息成功' : '编辑图片信息成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.dataForm.classify = ''
              this.$emit('refreshEditDataList')
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
