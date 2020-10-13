<template>
  <el-dialog
    title="添加分类"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="25%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :inline="true" size="medium" label-suffix=":">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入分类名称" maxlength="15" clearable />
      </el-form-item>
      <el-form-item label="分类简介" prop="desc">
        <el-input v-model="dataForm.desc" placeholder="请输入分类简介" maxlength="15" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { categoryAddTree } from '@/api/categorytree'
export default {
  name: 'CategoryAdd',
  props: {
    // 分类类型，调用组件必传
    categoryType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      dataRule: {
        name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '分类简介不能为空', trigger: 'blur' }]
      },
      dataForm: {
        name: '',
        desc: ''
      }
    }
  },
  methods: {
    // 添加分类
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          categoryAddTree(this.$service.adornData({
            'name': this.dataForm.name,
            'type': this.categoryType,
            'desc': this.dataForm.desc
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: '分类添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.resetForm('dataForm')
                  this.$emit('refreshCategoryDataList')
                }
              })
            } else {
              this.$message.error(response.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    openDialog() {
      this.visible = true
    }
  }
}
</script>
