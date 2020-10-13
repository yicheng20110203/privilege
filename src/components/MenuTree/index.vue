<template>
  <div class="custom-tree-container">
    <el-tree
      :data="treeData"
      highlight-current
      :props="defaultProps"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="nodeclick"
    />
  </div>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    dataTree: {
      type: Array,
      default: () => ([])
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'val'
        }
      }
    }
  },
  data() {
    return {
      visible: false,
      treeData: [],
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
    // 节点被点击时的回调
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
