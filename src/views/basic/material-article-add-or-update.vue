<template>
  <el-dialog
    :title="!dataForm.id ? '创建文章' : '编辑文章'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="编号" prop="code">
        <el-col :span="4">
          <el-input v-model="dataForm.code" placeholder="请输入素材编号" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="文章名称" prop="name">
        <el-col :span="8">
          <el-input
            v-model="dataForm.name"
            placeholder="请输入文章名称"
            maxlength="35"
            show-word-limit
            clearable
          />
        </el-col>
      </el-form-item>
      <el-form-item label="文章分类" prop="classify">
        <el-cascader
          v-model="dataForm.classify"
          :options="menuCategory"
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          placeholder="请选择文章分类"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="内容编辑" prop="detail">
        <el-col>
          <VueUeditorWrap v-model="dataForm.detail" :config="config" />
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit"
      >
        {{ !dataForm.id ? '确定创建' : '确定编辑' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMaterialList, materialAdd, materialUpdate } from '@/api/material'
import { getTime } from '@/utils'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { ossUpload } from '@/api/oss'
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
      config: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 300,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: '',
        zIndex: 3000,
        toolbars: [
          [
            'source', // 源代码
            'anchor', // 锚点
            'undo', // 撤销
            'redo', // 重做
            'bold', // 加粗
            'indent', // 首行缩进
            'italic', // 斜体
            'underline', // 下划线
            'strikethrough', // 删除线
            'subscript', // 下标
            'fontborder', // 字符边框
            'superscript', // 上标
            'formatmatch', // 格式刷
            'blockquote', // 引用
            'pasteplain', // 纯文本粘贴模式
            'selectall', // 全选
            'print', // 打印
            'preview', // 预览
            'horizontal', // 分隔线
            'removeformat', // 清除格式
            'time', // 时间
            'date', // 日期
            'unlink', // 取消链接
            'insertrow', // 前插入行
            'insertcol', // 前插入列
            'mergeright', // 右合并单元格
            'mergedown', // 下合并单元格
            'deleterow', // 删除行
            'deletecol', // 删除列
            'splittorows', // 拆分成行
            'splittocols', // 拆分成列
            'splittocells', // 完全拆分单元格
            'deletecaption', // 删除表格标题
            'inserttitle', // 插入标题
            'mergecells', // 合并多个单元格
            'deletetable', // 删除表格
            'cleardoc', // 清空文档
            'insertparagraphbeforetable', // "表格前插入行"
            'insertcode', // 代码语言
            'fontfamily', // 字体
            'fontsize', // 字号
            'paragraph', // 段落格式
            'insertimage', // 多图上传
            'edittable', // 表格属性
            'edittd', // 单元格属性
            'link', // 超链接
            'emotion', // 表情
            'spechars', // 特殊字符
            'searchreplace', // 查询替换
            'insertvideo', // 视频
            'help', // 帮助
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            'forecolor', // 字体颜色
            'backcolor', // 背景色
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'fullscreen', // 全屏
            'directionalityltr', // 从左向右输入
            'directionalityrtl', // 从右向左输入
            'rowspacingtop', // 段前距
            'rowspacingbottom', // 段后距
            'pagebreak', // 分页
            'insertframe', // 插入Iframe
            'imagenone', // 默认
            'imageleft', // 左浮动
            'imageright', // 右浮动
            'attachment', // 附件
            'imagecenter', // 居中
            'wordimage', // 图片转存
            'lineheight', // 行间距
            'edittip ', // 编辑提示
            'customstyle', // 自定义标题
            'autotypeset', // 自动排版
            'touppercase', // 字母大写
            'tolowercase', // 字母小写
            'background', // 背景
            'template', // 模板
            'music', // 音乐
            'inserttable', // 插入表格
            'drafts', // 从草稿箱加载
            'charts' // 图表
          ]
        ]
      }, // 富文本配置
      // 树形控件配置参数
      defaultProps: {
        children: 'children',
        label: 'val'
      },
      pageIndex: 1,
      pageSize: 10,
      onlykey: 1,
      token: '', // 获取图片上传token
      dialogVisible: false,
      dataForm: {
        id: '',
        code: getTime(),
        name: '',
        detail: '',
        classifyId: '', // 选择分类id
        classifyKey: '', // 选中分类key
        classify_name: '', // 选中分类名称
        classify: '' // 选中分类
      },
      dataRule: {
        code: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        classify: [{ required: true, message: '分类不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 获取图片上传token
    this.getToken()
  },
  methods: {
    init(id) {
      this.dataForm.id = id
      this.getDataList(id)
    },
    // 显示
    openDialog() {
      this.visible = true
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 选择
    handleChange(value) {
      this.dataForm.classify = value[value.length - 1]
    },
    // 获取编辑器内容
    getEditorContent(data) {
      // console.log('wangEditor内容', data)
      this.dataForm.detail = data
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 获取token
    getToken() {
      ossUpload().then(res => {
        if (res && res.code === 0) {
          this.token = res.data.token
          sessionStorage.setItem('tk', res.data.token)
        } else {
          this.$message.error('获取图片上传token失败')
        }
      })
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
          this.dataForm.classify = articlelist.categories[0].key
          this.dataForm.detail = articlelist.full_txt
        } else {
          this.$message.error(res.msg)
        }
      })
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
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          materialAdd(this.$service.adornData({
            'code': this.dataForm.code,
            'name': this.dataForm.name,
            'category_key': this.dataForm.classify,
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
                  this.resetForm('dataForm')
                  this.$emit('refreshArticleDataList')
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
    // 文章更新
    articleEdit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          materialUpdate(this.$service.adornData({
            'id': this.dataForm.id,
            'code': this.dataForm.code,
            'name': this.dataForm.name,
            'category_key': this.dataForm.classify,
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
                  this.resetForm('dataForm')
                  this.$emit('refreshArticleDataList')
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
      width: 200px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 200px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
