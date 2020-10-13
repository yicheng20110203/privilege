<template>
  <el-dialog
    :title="!dataForm.id ? '新增根菜单' : '修改菜单'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit">
      <el-form-item v-if="dataForm.menu_key" label="父菜单" prop="parentName">
        <el-input v-model="dataForm.parentName" :disabled="true" />
      </el-form-item>
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
      <el-form-item v-if="dataForm.name" label="菜单显示" prop="hidden">
        <el-radio-group v-model="dataForm.hidden">
          <el-radio :label="2">显示</el-radio>
          <el-radio :label="1">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序号" prop="display_order">
        <el-input-number
          v-model="dataForm.display_order"
          controls-position="right"
          :min="0"
          label="排序号"
        />
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
            <el-input
              v-model="dataForm.icon"
              v-popover:iconListPopover
              :readonly="true"
              placeholder="菜单图标名称"
              class="icon-list__input"
            />
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
import { menuAdd, menuUpdate } from '@/api/menus'
import Icon from '@/icons'
// import { timers } from '../../../public/static/UEditor/third-party/jquery-1.10.2'
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
        hidden: '2',
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
    // 修改，获取菜单id
    init(data) {
      this.dataForm.id = data.id
      this.dataForm.name = data.name
      this.dataForm.path = data.path
      this.dataForm.url = data.component
      this.dataForm.title = data.title
      this.dataForm.display_order = data.display_order
      this.dataForm.icon = data.icon
    },
    // 添加子菜单，获取父级菜单id
    Submenu(data) {
      console.log('获取父级菜单id', data)
      this.dataForm.menu_key = data.menu_key
      this.dataForm.parentName = data.name
    },
    // 显示
    openDialog() {
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
      if (this.dataForm.id) {
        this.updateMenuHandle()
      } else {
        this.addMenuHandle()
      }
    },
    // 添加菜单
    addMenuHandle() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          menuAdd(this.$service.adornData({
            'path': this.dataForm.path,
            'component': this.dataForm.url,
            'title': this.dataForm.title,
            'name': this.dataForm.name,
            'icon': this.dataForm.icon,
            // menu_key: this.dataForm.menu_key,
            'display_order': this.dataForm.display_order
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: '添加成功',
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
    },
    // 修改菜单
    updateMenuHandle() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          menuUpdate(this.$service.adornData({
            'id': this.dataForm.id,
            'path': this.dataForm.path,
            'component': this.dataForm.url,
            'title': this.dataForm.title,
            'name': this.dataForm.name,
            'icon': this.dataForm.icon,
            'menu_key': this.dataForm.menu_key,
            'display_order': this.dataForm.display_order
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: '菜单更新成功',
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
