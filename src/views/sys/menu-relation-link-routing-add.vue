<template>
  <el-dialog
    title="添加菜单路由关系"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="菜单key" prop="menu_key">
        <el-cascader
          v-model="dataForm.menu_key"
          :options="dataForm.menuList"
          :show-all-levels="false"
          :props="{ checkStrictly: true, value: 'menu_key', label: 'title' }"
          placeholder="请选择前端菜单"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="后端路由" prop="back_url">
        <el-input
          v-model="dataForm.back_url"
          type="textarea"
          :rows="8"
          placeholder="请输入后端路由"
          clearable
        />
      </el-form-item>
      <el-form-item label="简介" prop="desc">
        <el-input v-model="dataForm.desc" placeholder="请输入简介" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit">保存</el-button>
      <el-button @click="resetForm('dataForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMenusAll } from '@/api/menus'
import { getMenuBackUrlList, getMenuBackUrlAdd, MenuBackUrlUpdate } from '@/api/menubackurl'
export default {
  name: 'MenuRelationLinkRoutingAdd',
  data() {
    return {
      visible: false,
      dataForm: {
        id: '',
        menuList: [],
        menu_key: '', // 菜单key
        back_url: '', // 后端路由
        desc: '' // 描述
      },
      dataRule: {
        menu_key: [{ required: true, message: '菜单key不能为空', trigger: 'blur' }],
        back_url: [{ required: true, message: '后端路由不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id
      this.getMenuBackList(id)
    },
    // 显示
    openDialog() {
      this.visible = true
    },
    // 选择
    handleChange(value) {
      this.dataForm.menu_key = value[value.length - 1]
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取菜单列表
    getDataList() {
      getMenusAll().then(res => {
        this.dataForm.menuList = res.data.items
      })
    },
    // 通过id获取菜单后台路由关联
    getMenuBackList(id) {
      getMenuBackUrlList(this.$service.adornData({
        'id': id
      })).then(res => {
        const backlist = res.data.list[0]
        this.dataForm.menu_key = backlist.menu_key
        this.dataForm.back_url = backlist.back_url
        this.dataForm.desc = backlist.desc
      })
    },
    // 提交
    dataFormSubmit() {
      if (this.dataForm.id) {
        this.menuBackUrlUpdate()
      } else {
        this.menuBackUrlAdd()
      }
    },
    // 添加菜单路由
    menuBackUrlAdd() {
      getMenuBackUrlAdd(this.$service.adornData({
        'menu_key': this.dataForm.menu_key,
        'back_url': this.dataForm.back_url,
        'desc': this.dataForm.desc
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.resetForm('dataForm')
              this.$emit('refreshDataList')
            }
          })
        }
      })
    },
    // 菜单更新
    menuBackUrlUpdate() {
      MenuBackUrlUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'menu_key': this.dataForm.menu_key,
        'back_url': this.dataForm.back_url,
        'desc': this.dataForm.desc
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.resetForm('dataForm')
              this.$emit('refreshDataList')
            }
          })
        }
      })
    }
  }
}
</script>
