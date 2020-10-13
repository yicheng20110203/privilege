<template>
  <el-dialog
    :title="!dataForm.id ? '创建' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="登录名" prop="login_name">
        <el-input v-model="dataForm.login_name" placeholder="登录名" />
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="姓名" />
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-select v-model="dataForm.role_key" placeholder="请选择">
          <el-option
            v-for="item in dataForm.roleIdList"
            :key="item.role_key"
            :label="item.name"
            :value="item.role_key"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { adminUserAdd, adminUserUpdate } from '@/api/adminUserList'
import { getRoleList } from '@/api/role'
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      // role_key: '',
      state: false,
      dataForm: {
        id: 0,
        pageIndex: 1,
        pageSize: 10,
        login_name: '',
        password: '',
        userName: '',
        salt: '',
        role_key: '',
        roleIdList: []
      },
      dataRule: {
        login_name: [
          { required: true, message: '登录名不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(data) {
      if (data) {
        this.dataForm.id = data.id
        this.dataForm.login_name = data.login_name
        this.dataForm.userName = data.username
        this.dataForm.role_key = data.role_key
        this.visible = true
        this.state = false
        this.dataGetRole()
      } else {
        this.dataForm.id = 0
        this.state = true
        this.dataGetRole()
      }
    },
    // 获取角色
    dataGetRole() {
      getRoleList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize
      })).then(response => {
        this.dataForm.roleIdList = response && response.code === 0 ? response.data.list : []
      }).then(() => {
        this.visible = true
      })
    },
    // 表单提交
    dataFormSubmit() {
      // 表单添加
      if (this.state) {
        this.dataFormAddSubmit()
      } else {
        // 表单更新
        this.dataFormUpdateSubmit()
      }
    },
    // 表单添加
    dataFormAddSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          adminUserAdd(this.$service.adornData({
            'login_name': this.dataForm.login_name,
            'password': this.dataForm.password,
            'username': this.dataForm.userName,
            'role_key': this.dataForm.role_key
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
    },
    // 表单更新
    dataFormUpdateSubmit() {
      adminUserUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'login_name': this.dataForm.login_name,
        'password': this.dataForm.password,
        'username': this.dataForm.userName,
        'role_key': this.dataForm.role_key
      })).then((data) => {
        if (data && data.code === 0) {
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
          this.$message.error(data.msg)
        }
      })
    }

  }
}
</script>
