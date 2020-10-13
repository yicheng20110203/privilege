<template>
  <el-dialog
    title="文章详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="名称">
        {{ dataForm.name }}
      </el-form-item>
      <el-form-item label="上传时间">
        {{ dataForm.create_time }}
      </el-form-item>
      <el-form-item label="分类">
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
export default {
  name: 'MaterialArticleDetail',
  data() {
    return {
      visible: false,
      dataForm: {
        name: '', // 文章名称
        full_txt: '', // 富文本
        classify: '', // 分类
        create_time: '' // 上传时间
      }
    }
  },
  methods: {
    init(data) {
      // console.log('文章详情=', data)
      this.dataForm.name = data.name
      this.dataForm.create_time = data.create_time_desc
      this.dataForm.classify = data.categories[0].val
      this.dataForm.full_txt = data.full_txt
    },
    // 打开窗口
    openDialog() {
      this.visible = true
    },
    // 关闭窗口
    closedDialog() {
    }
  }
}
</script>
