<template>
  <el-dialog
    :title="submitType===1 ? '上传视频' : '上传图片'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item label="编号" prop="code">
        <el-col :span="8">
          <el-input v-model="dataForm.code" placeholder="请输入素材编号" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-col :span="8">
          <el-input v-model="dataForm.name" placeholder="请输入素材名称" clearable />
        </el-col>
      </el-form-item>
      <el-form-item label="分类" prop="classification">
        <el-cascader
          ref="cascader"
          v-model="dataForm.classification"
          :options="menuCategory"
          :show-all-levels="false"
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          placeholder="请选择素材分类"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item v-if="uploadType === 'video'" label="上传视频" prop="videourl">
        <el-upload
          :show-file-list="false"
          accept=".mp4,.avi,.wmv"
          :disabled="is_upload"
          action="actionUrl"
          :on-error="handleError"
          :on-progress="uploadVideoProcess"
          :on-remove="handleRemove"
          :on-success="handleMediaSuccess"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <span style="font-size: 12px; margin-left: 12px; color: #f40;">支持mp4/avi/wmv格式，大小不超过2GB</span>
      </el-form-item>
      <el-form-item v-if="uploadType === 'video'" label="上传进度">
        <el-col :span="18">
          <el-progress v-if="uploadPercent!==0" :percentage="uploadPercent" />
        </el-col>
      </el-form-item>
      <el-form-item v-if="uploadType === 'image'" label="上传图片" prop="imageUrl">
        <el-upload
          v-loading="loading"
          :disabled="is_upload"
          class="avatar-uploader"
          action="actionUrl"
          accept=".png,.jpg,.jpeg"
          :on-success="handleMediaSuccess"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <label style="margin-left:72px;color: #f40;">文件支持类型 jpg/png,文件大小&lt;2M,建议传274x274</label>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelHandle">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ossUpload } from '@/api/oss'
import { getNewName, getTime } from '@/utils'
import { materialAdd } from '@/api/material'
import axios from 'axios'
export default {
  name: 'VideoAddOrUpdate',
  props: {
    menuCategory: {
      type: Array,
      default: () => ([])
    },
    uploadType: {
      type: String,
      default: 'video'
    },
    submitType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      visible: false,
      url: '', // 请求签名地址
      loading: false,
      type: '',
      token: '',
      hash: '',
      uploadPercent: 0,
      image: '', // 预览图片地址
      video: '', // 预览视频地址
      audio: '', // 预览音频地址
      filesize: '', // 文件大小
      is_upload: false,
      dataForm: {
        id: '',
        code: getTime(),
        name: '',
        videoTimes: 0, // 视频时长
        audioTimes: 0, // 音频时长
        classification: '', // 选中分类
        videourl: '', // 视频地址
        videoPlayerUrl: '', // 本地视频播放地址
        audiourl: '', // 音频地址
        audioPlayerUrl: '', // 本地音频播放地址
        imageUrl: '' // 图片地址
      },
      actionUrl: '',
      fileList: [], // 文件列表
      carryData: {
        success_action_status: '200'
      },
      dataRule: {
        code: [{ required: true, message: '素材编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '素材名称不能为空', trigger: 'blur' }],
        classification: [{ required: true, message: '素材分类不能为空', trigger: 'blur' }],
        videourl: [{ required: true, message: '请上传视频', trigger: 'blur' }],
        audiourl: [{ required: true, message: '请上传音频', trigger: 'blur' }],
        image: [{ required: true, message: '请上传图片', trigger: 'blur' }]
      },
      validTime: '',
      config: {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          // 如果lengthComputable为false，就获取不到e.total和e.loaded
          if (e.lengthComputable) {
            var rate = e.loaded / e.total // 已上传的比例
            this.uploadPercent = Number(`${(rate * 100).toFixed(2)}`)
          }
        }
      }
    }
  },
  methods: {
    // 初始化
    init(type) {
      this.type = type
      this.getToken(type)
    },
    // 选择
    handleChange(value) {
      this.dataForm.classification = value[value.length - 1]
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          materialAdd(this.$service.adornData({
            'code': this.dataForm.code,
            'name': this.dataForm.name,
            'size': this.filesize.toString(),
            'category_key': this.dataForm.classification,
            'times': 0,
            'type': this.submitType,
            'entity_id': this.uploadType === 'video' ? this.dataForm.videourl : this.dataForm.imageUrl
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: this.uploadType === 'video' ? '素材视频添加成功' : '图片添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$refs.cascader.$refs.panel.clearCheckedNodes()
                  this.$refs.cascader.$refs.panel.activePath = []
                  this.resetForm('dataForm')
                  this.uploadPercent = 0
                  this.dataForm.name = ''
                  this.uploadType === 'video' ? this.dataForm.videoPlayerUrl = '' : this.dataForm.imageUrl = ''
                  this.$emit('refreshVideoDataList')
                  this.visible = false
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
    // 获取视频时长
    getVideoDuration() {
      this.dataForm.videoTimes = this.$refs.VueAliplayer.getDuration()
    },
    // 获取音频时长
    getAudioDuration() {
      this.dataForm.audioTimes = this.$refs.audio.duration
    },
    // 显示
    openDialog() {
      this.visible = true
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    cancelHandle() {
      this.visible = false
      this.$refs.cascader.$refs.panel.clearCheckedNodes()
      this.$refs.cascader.$refs.panel.activePath = []
    },
    // 获取token
    getToken(type) {
      ossUpload().then(response => {
        if (response && response.code === 0) {
          this.token = response.data.token // 保存token
          this.getPolicy(type)
        } else {
          this.$message.error('获取token失败')
        }
      })
    },
    // 获取签名
    getPolicy(type) {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/get-web-upload-sign' + '?type=' + type + '&token=' + this.token)
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
    handleRemove(file, fileList) {
      this.dataForm.videourl = ''
      this.fileList = []
    },
    handleError(file, fileList) {
      this.$message.error('您目前的网络有点慢哦，休息一会再试试吧')
      this.uploadPercent = 0
    },
    uploadVideoProcess(event, file, fileList) {
      // this.uploadPercent = Number(file.percentage).toFixed(0)
    },
    handleMediaSuccess(res, file) {
      this.uploadPercent = 0
      this.fileList = []
    },
    // 自动上传拦截
    beforeUpload(file) {
      this.is_upload = true
      switch (this.type) {
        case 'video':
          this.filesize = file.size
          this.fileList = [...this.fileList, file]
          break
        case 'image':
          this.imageUploadHandle(file)
          break
      }
      this.handleUpload(file.name)
      return false
    },
    // 手动上传
    handleUpload(fileName) {
      const materialkey = `${this.carryData.key}${getNewName(fileName)}` // 保存文件名
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
        this.getToken(this.type).then(() => {
          // 重新请求签名
          const materialkey = `${this.carryData.key}${getNewName(fileName)}`
          formData.append('key', materialkey)
          switch (this.type) {
            case 'video':
              this.uploadingVideo(formData, materialkey)
              break
            case 'image':
              this.uploadingImg(formData, materialkey)
              break
          }
        })
      } else {
        formData.append('key', materialkey)
        switch (this.type) {
          case 'video':
            this.uploadingVideo(formData, materialkey)
            break
          case 'image':
            this.uploadingImg(formData, materialkey)
            break
        }
      }
    },
    // 上传视频至阿里云
    uploadingVideo(formData, materialkey) {
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData, this.config).then(res => {
        if (res.status === 200) {
          this.dataForm.videourl = materialkey
          this.$message({
            message: '视频上传成功',
            type: 'success',
            duration: 1500
          })
          this.is_upload = false
          this.fileList = []
        } else {
          this.$message.error('视频上传失败')
        }
      })
    },
    // 获取视频地址
    getVideoURL() {
      if (process.env.NODE_ENV === 'production') {
        this.url = process.env.VUE_APP_UPLOADOSSURL
      } else {
        this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
      }
      this.dataForm.videoPlayerUrl = this.url + 'v1/coss/file/media' + '?token=' + this.token + '&hash=' + this.dataForm.videourl + '&.m3u8'
    },
    // 上传图片到阿里云
    uploadingImg(formData, materialkey) {
      this.loading = true // 加载loading
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData, this.config).then(res => {
        if (res.status === 200) {
          if (process.env.NODE_ENV === 'production') {
            this.dataForm.imageUrl = `${process.env.VUE_APP_IMAGEURL}` + '/' + materialkey
          } else {
            this.dataForm.imageUrl = this.actionUrl + '/' + materialkey
          }
          this.$message({
            message: '图片上传成功',
            type: 'success',
            duration: 1500
          })
          this.fileList = []
          this.is_upload = false
          this.loading = false
        } else {
          this.$message.error('图片上传失败')
        }
      })
    },
    // 图片大小判断
    imageUploadHandle(file) {
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
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
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
