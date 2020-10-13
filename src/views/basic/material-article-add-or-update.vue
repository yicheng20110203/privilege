<template>
  <el-dialog
    :title="!dataForm.id ? '创建文章' : '编辑文章'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
  >
    <el-form ref="dataForm" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="编号" prop="code">
        <el-col :span="4">
          <el-input v-model="dataForm.code" placeholder="请输入素材编号" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="文章名称" prop="name">
        <el-col :span="8">
          <el-input v-model="dataForm.name" placeholder="请输入文章名称" maxlength="35" show-word-limit clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="文章分类" prop="classify">
        <el-cascader
          v-model="dataForm.classify"
          :options="menuCategory"
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          clearable
        />
      </el-form-item>
      <el-form-item label="内容编辑" prop="detail">
        <el-col :span="20">
          <div class="edit_container">
            <VueUeditorWrap v-model="dataForm.detail" :config="config" />
          </div>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确认创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { materialAdd, materialUpdate } from '@/api/material'
import { DATETIME } from '@/utils/global-element'
import { ueditorConfig } from '@/utils'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  name: 'ArticleAddorupdate',
  components: {
    VueUeditorWrap
  },
  props: {
    menuCategory: {
      type: Array,
      default: () => ([])
    },
    submitType: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      visible: false,
      content: '',
      config: ueditorConfig(), // 富文本配置
      dataForm: {
        id: '',
        code: DATETIME,
        name: '',
        detail: 'ceibsdigital',
        classify: '' // 选中分类
      }
    }
  },
  methods: {
    init(data) {
      this.dataForm.id = data.id
      this.dataForm.code = data.code
      this.dataForm.name = data.name
      this.dataForm.classify = data.categories[0].key
      this.dataForm.detail = data.full_txt
    },
    // 显示
    openDialog() {
      this.visible = true
    },
    // 表单提交
    dataFormSubmit() {
      if (this.dataForm.id) {
        this.articleEdit()
      } else {
        this.articleAdd()
      }
    },
    // 文章添加
    articleAdd() {
      materialAdd(this.$service.adornData({
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'category_key': this.dataForm.classify[0],
        'type': this.submitType,
        'full_txt': this.dataForm.detail
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '文章添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshArticleDataList')
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 文章更新
    articleEdit() {
      materialUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'category_key': this.dataForm.classify[0],
        'type': this.submitType,
        'full_txt': this.dataForm.detail
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '文章更新成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshArticleDataList')
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    }
  }
}
</script>
