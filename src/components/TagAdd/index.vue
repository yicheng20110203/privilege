<template>
  <el-dialog
    title="添加标签"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :inline="true" size="medium" label-suffix=":">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入标签名称" maxlength="15" clearable />
      </el-form-item>
      <el-form-item label="标签简介" prop="desc">
        <el-input v-model="dataForm.desc" placeholder="请输入标签简介" maxlength="15" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { tagAdd } from '@/api/label'
export default {
  name: 'TagAdd',
  props: {
    // 标签类型，调用组件必传
    tagType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      dataRule: {
        name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '标签简介不能为空', trigger: 'blur' }]
      },
      dataForm: {
        name: '',
        desc: ''
      }
    }
  },
  methods: {
    // 添加标签
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          tagAdd(this.$service.adornData({
            'name': this.dataForm.name,
            'type': this.tagType,
            'desc': this.dataForm.desc
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: '标签添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.resetForm('dataForm')
                  this.$emit('refreshTagDataList')
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
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openDialog() {
      this.visible = true
    }
  }
}
</script>
