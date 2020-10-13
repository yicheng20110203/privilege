<template>
  <div class="custom-tree-container">
    <el-tree
      :data="treeData"
      highlight-current
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-click="nodeclick"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <!-- 如果是编辑状态 -->
        <template v-if="data.isEdit==1">
          <el-input
            ref="input"
            v-model="newApiGroupName"
            class="edit-tree-input"
            @blur.stop="() => submitEdit(node,data)"
            @keyup.enter.stop.native="() => submitEdit(node,data)"
          />
        </template>
        <!-- 如果不是编辑状态 -->
        <span v-else v-text="data[defaultProps.label]" />
        <span class="set-tree">
          <i class="el-icon-edit" @click.stop="() => edit(node, data)" />
          <i class="el-icon-plus" @click.stop="() => append(node, data)" />
          <i class="el-icon-delete" @click.stop="() => remove(node, data)" />
        </span>
      </div>
    </el-tree>
    <el-dialog
      title="创建分类"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="25%"
      center
      @closed="closedDialog"
    >
      <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :inline="true" size="medium" label-suffix=":">
        <el-form-item label="上级分类" prop="superiorName">
          <el-input v-model="dataForm.superiorName" maxlength="15" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入分类名称" maxlength="15" clearable />
        </el-form-item>
        <el-form-item label="分类简介" prop="desc">
          <el-input v-model="dataForm.desc" placeholder="请输入分类简介" maxlength="15" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubclass">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categoryAddTree, categoryUpdateTree, categoryDeleteTree } from '@/api/categorytree'
export default {
  name: 'CategoryTree',
  props: {
    forbidDropId: {
      type: Array,
      default: () => ([])
    },
    forbidDragId: {
      type: Array,
      default: () => ([])
    },
    // 分类类型，调用组件必传
    categoryType: {
      type: Number,
      default: () => ('')
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
          label: 'label'
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
        name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '分类简介不能为空', trigger: 'blur' }]
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
    // this.getApiGroupData()
  },
  methods: {
    // 调api获取接口分组数据
    getApiGroupData() {},
    handleDragStart(node, ev) {
      console.log('drag start', node.data[this.defaultProps.label])
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.data[this.defaultProps.label])
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.data[this.defaultProps.label])
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.data[this.defaultProps.label])
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log(
        'tree drag end: ',
        dropNode && dropNode.data[this.defaultProps.label],
        dropType
      )
      // 调后端更新
      this.updateApiGroup(this.data)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.data[this.defaultProps.label], dropType)
    },
    // 节点能否被拖拽
    allowDrop(draggingNode, dropNode, type) {
      return !this.forbidDropId.includes(dropNode.data.id)
    },
    // 节点能否被放置替换
    allowDrag(draggingNode) {
      return !this.forbidDragId.includes(draggingNode.data.id)
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加子类
    dataFormSubclass() {
      categoryAddTree(this.$service.adornData({
        'key': this.dataForm.superiorKey,
        'name': this.dataForm.name,
        'type': this.categoryType,
        'desc': this.dataForm.desc
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '添加分类成功',
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
    },
    // 删除分类
    deleteSubclassHandle() {
      this.$confirm(`确定对分类[${this.dataForm.superiorName}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        categoryDeleteTree(this.$service.adornData({
          'key': this.dataForm.superiorKey,
          'type': this.categoryType
        })).then((res) => {
          if (res && res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$emit('refreshCategoryDataList')
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },

    append(node, data) {
      this.visible = true
      this.dataForm.superiorKey = data.key
      this.dataForm.superiorName = data.val
    },

    remove(node, data) {
      this.dataForm.superiorKey = data.key
      this.dataForm.superiorName = data.val
      this.deleteSubclassHandle()
    },

    edit(node, data) {
      // console.log(
      //   'before:',
      //   data.id,
      //   data.key,
      //   data.val,
      //   data[this.defaultProps.label],
      //   data.isEdit
      // )
      this.$set(data, 'isEdit', 1)
      this.newApiGroupName = data[this.defaultProps.label]
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
      // console.log('after:', data.id, data[this.defaultProps.label], data.isEdit)
    },
    // 更新分类
    submitEdit(node, data) {
      this.dataForm.id = data.id
      this.dataForm.superiorKey = data.key
      this.dataForm.superiorName = data.val
      categoryUpdateTree(this.$service.adornData({
        'id': this.dataForm.id,
        'key': this.dataForm.superiorKey,
        'name': this.newApiGroupName,
        'type': this.categoryType
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '更新分类成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshCategoryDataList')
            }
          })
          this.$set(data, 'isEdit', 0)
        } else {
          this.$message.error(response.msg)
        }
      })
    },

    cancelEdit(node, data) {
      // console.log('放弃编辑')
      // console.log(data.id, data.label)
      // this.newApiGroupName = ''
      this.$set(data, 'isEdit', 0)
    },

    updateApiGroup(data) {
      // 更新后台数据
      console.log('更新后台数据')
    },
    nodeclick(node, data, obj) {
      // console.log('点击了：', node.id, node[this.defaultProps.label])
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
	font-size: 14px;
	height: 100%;
	.edit-tree-input{
		height: 24px;
		line-height: 24px;
		/deep/ .el-input__inner {
			height: 100%;
		}
	}
    .set-tree{
        transition: all .25s;
        opacity: 0;
        padding-right: 10px;
    }
    &:hover .set-tree{
        opacity: 1;
    }
}
</style>
