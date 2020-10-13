<template>
  <el-dialog
    title="文章详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="编号">
        {{ dataForm.code }}
      </el-form-item>
      <el-form-item label="名称">
        {{ dataForm.name }}
      </el-form-item>
      <el-form-item label="上传时间">
        {{ dataForm.create_time }}
      </el-form-item>
      <el-form-item v-if="dataForm.classify" label="分类">
        {{ dataForm.classify }}
      </el-form-item>
      <el-form-item label="文章内容">
        <el-col>
          <div v-html="dataForm.full_txt" />
        </el-col>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getMaterialList } from '@/api/material'
export default {
  name: 'MaterialArticleDetail',
  props: {
    submitType: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      visible: false,
      pageIndex: 1,
      pageSize: 10,
      dataForm: {
        code: '', // 编号
        name: '', // 文章名称
        full_txt: '', // 富文本
        classify: '', // 分类
        create_time: '' // 上传时间
      }
    }
  },
  methods: {
    init(id) {
      this.getDataList(id)
    },
    // 打开窗口
    openDialog() {
      this.visible = true
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 通过id - 获取文章列表
    getDataList(id) {
      getMaterialList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'type': this.submitType,
        'id': id
      })).then(res => {
        if (res && res.code === 0) {
          const articlelist = res.data.list[0]
          this.dataForm.code = articlelist.code
          this.dataForm.name = articlelist.name
          this.dataForm.create_time = articlelist.create_time_desc
          this.dataForm.classify = articlelist.categories.map(item => item.val).toString()
          this.dataForm.full_txt = articlelist.full_txt
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
