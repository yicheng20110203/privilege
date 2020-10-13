<template>
  <div class="custom-tree-container">
    <el-tree
      :data="treeData"
      highlight-current
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
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
          <!-- <i class="el-icon-plus" @click.stop="() => append(node, data)" /> -->
          <i class="el-icon-delete" @click.stop="() => remove(node, data)" />
        </span>
      </div>
    </el-tree>
    <el-dialog
      title="创建标签"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="25%"
      center
      @closed="closedDialog"
    >
      <el-form ref="dataForm" :rules="dataRule" :model="dataForm" :inline="true" size="medium" label-suffix=":">
        <el-form-item label="上级标签" prop="superiorName">
          <el-input v-model="dataForm.superiorName" maxlength="15" clearable disabled />
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入标签名称" maxlength="15" clearable />
        </el-form-item>
        <el-form-item label="标签简介" prop="desc">
          <el-input v-model="dataForm.desc" placeholder="请输入标签简介" maxlength="15" clearable />
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
import { tagAdd, tagUpdate, tagDelete } from '@/api/label'
export default {
  name: 'TagTree',
  props: {
    forbidDropId: {
      type: Array,
      default: () => ([])
    },
    forbidDragId: {
      type: Array,
      default: () => ([])
    },
    // 标签类型，调用组件必传
    tagType: {
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
        name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '标签简介不能为空', trigger: 'blur' }]
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
    this.getApiGroupData()
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
      // console.log(
      //   'tree drag end: ',
      //   dropNode && dropNode.data[this.defaultProps.label],
      //   dropType
      // )
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 添加子类
    dataFormSubclass() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          tagAdd(this.$service.adornData({
            'key': this.dataForm.superiorKey,
            'name': this.dataForm.name,
            'type': this.tagType,
            'desc': this.dataForm.desc
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: '添加标签成功',
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
    // 删除标签
    deleteSubclassHandle() {
      this.$confirm(`确定对标签[${this.dataForm.superiorName}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tagDelete(this.$service.adornData({
          'key': this.dataForm.superiorKey,
          'type': this.tagType
        })).then((res) => {
          if (res && res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$emit('refreshTagDataList')
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
    // 更新标签
    submitEdit(node, data) {
      this.dataForm.id = data.id
      this.dataForm.superiorKey = data.key
      this.dataForm.superiorName = data.val
      tagUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'key': this.dataForm.superiorKey,
        'name': this.newApiGroupName,
        'type': this.tagType
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '更新标签成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshTagDataList')
            }
          })
          this.$set(data, 'isEdit', 0)
        } else {
          this.$message.error(response.msg)
        }
      })
    },

    cancelEdit(node, data) {
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
	font-size: 16px;
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
