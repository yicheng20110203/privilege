<template>
  <el-dialog
    :title="!dataForm.id ? '创建章节' : '编辑章节'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="25%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :inline="true" size="medium" label-suffix=":">
      <el-form-item label="章节名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入章节名称" clearable />
      </el-form-item>
      <el-form-item label="章节排序" prop="display_order">
        <el-input-number v-model="dataForm.display_order" placeholder="请输入排序数字" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { chapterAdd, chapterUpdate } from '@/api/chapter'
export default {
  name: 'ChapterCategoryAdd',
  props: {
    // 章节类型，调用组件必传
    lessonId: {
      type: Number,
      default: () => (0)
    }
  },
  data() {
    return {
      visible: false,
      dataRule: {
        name: [{ required: true, message: '章节名称不能为空', trigger: 'blur' }],
        display_order: [{ required: true, message: '章节排序不能为空', trigger: 'blur' }]
      },
      dataForm: {
        id: 0,
        name: '',
        display_order: 0
      }
    }
  },
  methods: {
    init(data) {
      // 获取内容id
      this.dataForm.id = data.id
      this.dataForm.name = data.name
      this.dataForm.display_order = data.display_order
    },
    // 添加章节
    dataFormSubmit() {
      // 判断内容id
      if (this.dataForm.id) {
        this.updateChapterHandle()
      } else {
        this.chapterAddHandle()
      }
    },
    chapterAddHandle() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          chapterAdd(this.$service.adornData({
            'lesson_id': parseInt(this.lessonId),
            'name': this.dataForm.name,
            'display_order': parseInt(this.dataForm.display_order)
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '章节添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.resetForm('dataForm')
                  this.$emit('refreshDataList')
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
    // 更新章节内容
    updateChapterHandle() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          chapterUpdate(this.$service.adornData({
            'id': parseInt(this.dataForm.id),
            'lesson_id': parseInt(this.lessonId),
            'name': this.dataForm.name,
            'display_order': this.dataForm.display_order
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '章节更新成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.resetForm('dataForm')
                  this.$emit('refreshDataList')
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
