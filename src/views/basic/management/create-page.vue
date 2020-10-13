<template>
  <el-dialog
    :title="!dataForm.id ? '创建页面' : '编辑页面'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="页面唯一标识" prop="identifier">
        <el-input v-model="dataForm.identifier" placeholder="请输入页面唯一标识" clearable />
      </el-form-item>
      <el-form-item label="页面名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入页面名称" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
          clearable
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { pageAdd, pageUpdate } from '@/api/page'
export default {
  name: 'CreatePage',
  data() {
    return {
      visible: false,
      dataForm: {
        id: '',
        identifier: '', // 页面唯一标识
        name: '', // 页面名称
        remark: '' // 备注
      },
      dataRule: {
        identifier: [{ required: true, message: '页面唯一标识不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '页面名称不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(data) {
      if (data) {
        this.dataForm.id = data.id
        this.dataForm.identifier = data.identifier
        this.dataForm.name = data.name
        this.dataForm.remark = data.desc
      } else {
        this.dataForm.id = ''
        this.resetForm('dataForm')
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 打开窗口
    openDialog() {
      this.visible = true
    },
    // 添加页面
    dataFormSubmit() {
      if (this.dataForm.id) {
        this.updatePage()
      } else {
        this.createPage()
      }
    },
    // 创建页面
    createPage() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          pageAdd(this.$service.adornData({
            'identifier': this.dataForm.identifier,
            'name': this.dataForm.name,
            'desc': this.dataForm.remark
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '创建页面成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshpage')
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 更新页面
    updatePage() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          pageUpdate(this.$service.adornData({
            'id': this.dataForm.id,
            'identifier': this.dataForm.identifier,
            'name': this.dataForm.name,
            'desc': this.dataForm.remark
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '页面更新成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshpage')
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
