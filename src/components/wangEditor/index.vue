<template>
  <div id="wangeditor">
    <div ref="Editor" style="text-align:left" />
  </div>
</template>
<script>
import Editor from 'wangeditor'
import axios from 'axios'
export default {
  name: 'WangEditor',
  props: {
    content: {
      type: String,
      default: () => ('')
    }
  },
  data() {
    return {
      editor: null,
      editorContent: '',
      url: `${process.env.VUE_APP_UPLOADOSSURL}` + 'v1/coss/file/upload',
      token: '',
      uploadPercent: 0,
      config: {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          // 如果lengthComputable为false，就获取不到e.total和e.loaded
          if (e.lengthComputable) {
            var rate = e.loaded / e.total // 已上传的比例
            this.uploadPercent = Number(`${(rate * 100).toFixed(2)}`)
          }
        }
      }
    }
  },
  watch: {
    content() {
      this.editor.txt.html(this.content)
    }
  },
  mounted() {
    this.editor = new Editor(this.$refs.Editor)
    this.editor.customConfig.onchange = (html) => {
      // html 即变化之后的内容
      this.editorContent = html
      this.$emit('editorContent', html)
    }
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    this.editor.customConfig.customUploadImg = (files, insert) => {
      // form表单
      var formData = new FormData()
      formData.append('token', decodeURIComponent(sessionStorage.getItem('tk')))
      formData.append('file', files[0])
      axios.post(this.url, formData, this.config).then(res => {
        if (res.status === 200) {
          // 上传代码返回结果之后，将图片插入到编辑器中
          insert(res.data.result.file_url)
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1500
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
    // 编辑区域的z-index默认为10000，可自定义修改
    this.editor.customConfig.zIndex = 100
    this.editor.create()
    this.editor.txt.html(this.content)
  }
}
</script>
<style lang="scss" scoped>
#wangeditor {
    width: 100%;
}
</style>
