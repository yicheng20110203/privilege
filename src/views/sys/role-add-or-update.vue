<template>
  <el-dialog
    :title="isAdd ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" />
      </el-form-item>
      <el-form-item size="mini" label="授权" required>
        <el-tree
          ref="menuListTree"
          node-key="menu_key"
          :data="menuList"
          :default-checked-keys="defaultCheckKeys"
          :props="menuListTreeProps"
          :default-expand-all="true"
          show-checkbox
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addRole, updateRole, getRoleAuthTree } from '@/api/role'
export default {
  data() {
    return {
      visible: false,
      submitLoading: false,
      isAdd: true,
      menuList: [
      ],
      defaultCheckKeys: [

      ],
      menuListTreeProps: {
        label: 'title',
        children: 'children'
      },
      dataForm: {
        id: 0,
        roleName: '',
        roleKey: '',
        remark: ''
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    // 表单提交
    dataFormSubmit() {
      if (this.dataForm.roleName === '') {
        this.$message.error('角色名称不能为空')
        return
      }
      if (this.$refs.menuListTree.getCheckedKeys().length === 0) {
        this.$message.error('请勾选权限')
        return
      }
      this.submitLoading = true
      if (this.isAdd) {
        const checkMenuKeys = this.$refs.menuListTree.getCheckedKeys().concat(this.$refs.menuListTree.getHalfCheckedKeys())
        const data = this.$service.adornData({
          menu_keys: checkMenuKeys,
          name: this.dataForm.roleName,
          desc: this.dataForm.remark
        })
        addRole(data).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.$emit('refreshDataList')
              this.submitLoading = false
              this.visible = false
            }
          })
        }).catch(() => {
          this.submitLoading = false
          console.log('添加角色异常')
        })
      } else {
        const checkMenuKeys = this.$refs.menuListTree.getCheckedKeys().concat(this.$refs.menuListTree.getHalfCheckedKeys())
        const data = this.$service.adornData({
          menu_keys: checkMenuKeys,
          name: this.dataForm.roleName,
          desc: this.dataForm.remark,
          id: this.dataForm.id
        })
        updateRole(data).then(() => {
          console.log('修改角色成功')
          this.$emit('refreshDataList')
          this.submitLoading = false
          this.visible = false
        }).catch(() => {
          this.submitLoading = false
          console.log('修改角色异常')
        })
      }
    },
    init(roleData) {
      // 初始化数据
      this.dataForm = {
        id: 0,
        roleName: '',
        remark: '',
        roleKey: ''
      }
      this.defaultCheckKeys = []
      this.isAdd = true
      if (roleData != null) { // 编辑
        this.dataForm = {
          id: roleData.id,
          roleName: roleData.name,
          remark: roleData.desc,
          roleKey: roleData.role_key
        }
        this.isAdd = false
      }
      const data = this.$service.adornData({
        parent_role_key: this.dataForm.roleKey
      })
      // 获取角色权限树
      getRoleAuthTree(data).then((response) => {
        this.menuList = response.data.items
        this.menuList.forEach((item) => {
          this.handleAuthTreeData(item, true)
        })
        this.visible = true
        console.log(this.defaultCheckKeys)
      }).catch(() => {
        console.log('获取权限树异常')
      })
    },
    handleAuthTreeData(treeData, isRootNode) {
      if (treeData.selected && !isRootNode) {
        this.defaultCheckKeys.push(treeData.menu_key)
      }
      if (treeData.children != null && treeData.children.length > 0) {
        treeData.children.forEach((item) => {
          this.handleAuthTreeData(item, false)
        })
      }
    }
  }
}
</script>
