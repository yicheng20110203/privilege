<template>
  <div class="custom-tree-container">
    <el-tree
      :data="treeData"
      highlight-current
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="nodeclick"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <!-- 如果不是编辑状态 -->
        <i class="el-icon-notebook-2 set-label">{{ data[defaultProps.label] }}</i>
        <!-- <span v-text="data[defaultProps.label]" /> -->
        <span class="set-tree">
          <i class="el-icon-edit" @click.stop="() => edit(node, data)" />
          <i class="el-icon-delete" @click.stop="() => remove(node, data)" />
        </span>
      </div>
    </el-tree>
    <chapter-category-add
      ref="ChapterCategoryAdd"
      :lesson-id="lessonId"
      @refreshDataList="refreshChapterDataList"
    />
  </div>
</template>

<script>
import { chapterDeleteLogic } from '@/api/chapter'
import ChapterCategoryAdd from '@/components/ChapterCategoryAdd'
export default {
  name: 'ChapterCategoryTree',
  components: {
    ChapterCategoryAdd
  },
  props: {
    lessonId: {
      type: Number,
      default: () => (0)
    },
    dataTree: {
      type: Array,
      default: () => ([])
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'name'
        }
      }
    }
  },
  data() {
    return {
      visible: false,
      treeData: [],
      newApiGroupName: '',
      dataRule: {
        name: [{ required: true, message: '章节名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '章节简介不能为空', trigger: 'blur' }]
      },
      dataForm: {
        id: '',
        superiorKey: '',
        superiorName: '',
        name: '',
        desc: ''
      }
    }
  },
  watch: {
    dataTree(val) {
      this.treeData = val
    }
  },
  created() {
    this.treeData = this.dataTree
  },
  methods: {
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    remove(node, data) {
      this.dataForm.id = data.id
      this.dataForm.name = data.name
      this.deleteSubclassHandle()
    },
    // 删除章节
    deleteSubclassHandle() {
      this.$confirm(`确定对章节[${this.dataForm.name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapterDeleteLogic(this.$service.adornData({
          'id': this.dataForm.id,
          'lesson_id': this.lessonId
        })).then((res) => {
          if (res && res.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$emit('refreshChapterDataList')
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    edit(node, data) {
      this.dataForm.id = data.id
      this.$refs.ChapterCategoryAdd.openDialog()
      this.$nextTick(() => {
        this.$refs.ChapterCategoryAdd.init(data)
      })
    },
    refreshChapterDataList() {
      this.$emit('refreshChapterDataList')
    },
    nodeclick(node, data, obj) {
      this.$emit('nodeClick', node)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-container{
  width: 100%;
}
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 16px;
	height: 100%;
    .set-tree{
        transition: all .25s;
        opacity: 0;
        padding-right: 10px;
    }
    &:hover .set-label {
      color: #409EFF;
    }
    &:hover .set-tree{
        opacity: 1;
    }
}
</style>
