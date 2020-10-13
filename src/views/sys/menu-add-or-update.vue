<template>
  <el-dialog
    :title="!dataForm.id ? '新增根菜单' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="菜单名称(vue name)" />
      </el-form-item>
      <el-form-item label="菜单路由" prop="path">
        <el-input v-model="dataForm.path" placeholder="菜单路由(vue path)" />
      </el-form-item>
      <el-form-item label="菜单URL" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单URL(vue component)" />
      </el-form-item>
      <el-form-item label="菜单标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="菜单标题(vue title)" />
      </el-form-item>
      <el-form-item label="排序号" prop="display_order">
        <el-input-number v-model="dataForm.display_order" controls-position="right" :min="0" label="排序号" />
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover"
            >
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    :class="{ 'is-active': item === dataForm.icon }"
                    @click="iconActiveHandle(item)"
                  >
                    <svg-icon :icon-class="item" />
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input" />
          </el-col>

        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { menuAdd } from '@/api/menus'
import Icon from '@/icons'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        type: 1,
        typeList: ['目录', '菜单'],
        parentId: 0,
        parentName: '',
        perms: '',
        orderNum: 0,
        path: '', // 菜单路由
        url: '', // 菜单页面URL
        title: '', // 菜单标题
        name: '', // 页面name
        icon: '', // 菜单icon
        menu_key: '', // 菜单key,一级菜单添加无需传递，添加子菜单必须传递
        display_order: 0, // 排序，值越小越靠前
        iconList: []
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '菜单路由不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '菜单标题不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '菜单URL不能为空', trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.iconList = Icon.getNameList()
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      console.log('dataForm-id', this.dataForm.id)
      this.visible = true
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.menuId
      this.dataForm.parentName = data.name
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          menuAdd(this.$service.adornData({
            path: this.dataForm.path,
            component: this.dataForm.url,
            title: this.dataForm.title,
            name: this.dataForm.name,
            icon: this.dataForm.icon,
            // menu_key: this.dataForm.menu_key,
            display_order: this.dataForm.display_order
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(response.msg)
            }
          })
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
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
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
