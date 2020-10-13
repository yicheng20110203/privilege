<template>
  <el-dialog
    title="编辑图片信息"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="图片名称" prop="name">
        <el-col :span="12">
          <el-input v-model="dataForm.name" placeholder="请输入图片名称" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="所属分类" prop="classify">
        <el-cascader
          v-model="dataForm.classify"
          :options="menuCategory"
          :show-all-levels="false"
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          placeholder="请选择分类"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="图片" prop="imageUrl">
        <el-upload
          v-loading="loading"
          class="avatar-uploader"
          action="actionUrl"
          accept=".png,.jpg,.jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <label style="margin-left:72px;color: #f40;">文件支持类型 jpg/png,文件大小&lt;2M,建议传274x274</label>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelHandle">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { materialUpdate } from '@/api/material'
import { getNewName } from '@/utils'
import { ossUpload } from '@/api/oss'
import axios from 'axios'
export default {
  name: 'MaterialPhotoEdit',
  props: {
    menuCategory: {
      type: Array,
      default: () => ([])
    },
    submitType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      filesize: '',
      dataForm: {
        id: '', // 图片id
        name: '', // 图片名称
        classify: '', // 图片分类
        imageUrl: '' // 图片地址
      },
      actionUrl: '',
      fileList: [], // 文件列表
      carryData: {
        success_action_status: '200'
      },
      validTime: ''
    }
  },
  created() {
    // 获取token
    this.getToken()
  },
  methods: {
    // 获取数据
    init(data) {
      this.dataForm.id = data.id
      this.dataForm.name = data.name
      this.dataForm.classify = data.categories[0].key
      this.dataForm.imageUrl = data.entity_id
    },
    // 打开窗口
    openDialog() {
      this.visible = true
    },
    // 取消
    cancelHandle() {
      this.visible = false
      this.dataForm.classify = ''
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 选择
    handleChange(value) {
      this.dataForm.classify = value[value.length - 1]
    },
    // 确定
    dataFormSubmit() {
      materialUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'name': this.dataForm.name,
        'type': this.submitType,
        'entity_id': this.dataForm.imageUrl,
        'category_key': this.dataForm.classify
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '编辑图片信息成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.dataForm.classify = ''
              this.resetForm('dataForm')
              this.$emit('refreshPictureEditDataList')
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取token
    getToken() {
      ossUpload().then(response => {
        if (response && response.code === 0) {
          this.getPolicy(response.data.token)
        } else {
          this.$message.error('获取图片上传token失败')
        }
      })
    },
    // 获取签名
    getPolicy(token) {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/get-web-upload-sign' + '?type=image&token=' + token)
          .then(res => {
            this.actionUrl = res.data.result.host
            this.carryData.OSSAccessKeyId = res.data.result.accessid
            this.carryData.policy = res.data.result.policy
            this.carryData.Signature = res.data.result.signature
            this.carryData.key = res.data.result.dir
            this.validTime = res.data.result.expire
            resolve(res.data)
          }).catch(() => {
            reject()
          })
      })
    },
    // 自动上传拦截
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      this.filesize = file.size
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      this.fileList = [...this.fileList, file]
      this.handleUpload(file.name)
      return false
    },
    // 手动上传图片
    handleUpload(fileName) {
      this.loading = true // 加载loading
      const imgKey = `${this.carryData.key}${getNewName(fileName)}` // 保存图片名
      const formData = new FormData() // form表单
      const timestamp = `${new Date().getTime()}` // 时间戳
      formData.append('name', fileName)
      for (const key in this.carryData) {
        if (key !== 'key') {
          formData.append(key, this.carryData[key])
        }
      }
      if (parseInt(timestamp.substr(0, 10)) >= this.validTime) {
        // 判断签名是否过期
        this.getToken().then(() => {
          // 重新请求签名
          const imgKey = `${this.carryData.key}${getNewName(fileName)}`
          formData.append('key', imgKey)
          this.uploadingImg(formData, imgKey)
        })
      } else {
        formData.append('key', imgKey)
        this.uploadingImg(formData, imgKey)
      }
    },
    // 上传图片到阿里云
    uploadingImg(formData, imgKey) {
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData).then(res => {
        if (res.status === 200) {
          if (process.env.NODE_ENV === 'production') {
            this.dataForm.imageUrl = `${process.env.VUE_APP_IMAGEURL}` + '/' + imgKey
          } else {
            this.dataForm.imageUrl = this.actionUrl + '/' + imgKey
          }
          this.$message({
            message: '图片更新成功',
            type: 'success',
            duration: 1500
          })
          this.fileList = []
          this.loading = false
        } else {
          this.$message.error('图片更新失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    line-height: 180px;
    text-align: center;
  }
  .avatar {
    width: 180px;
    height: 180px;
    display: block;
  }
  .uploadfont {
    line-height:4px;
    color: #8c939d;
  }
  .uploadprogress {
    margin-top:5px;
    margin-bottom: 5px;
  }
</style>
