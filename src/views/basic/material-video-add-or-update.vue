<template>
  <el-dialog
    :title="submitType===1 ? '上传视频' : submitType===2 ? '上传音频' : '上传图片'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" size="medium" label-suffix=":">
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
          :props="{ checkStrictly: true, value: 'key', label: 'val' }"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="uploadType === 'video'" label="上传视频" prop="videourl">
        <el-upload
          :show-file-list="false"
          accept=".mp4,.mkv"
          action="actionUrl"
          :on-error="handleError"
          :on-progress="uploadVideoProcess"
          :on-remove="handleRemove"
          :on-success="handleMediaSuccess"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <el-progress v-if="uploadPercent!==0" :percentage="uploadPercent" style="margin-top:10px;" />
        <vue-aliplayer v-if="dataForm.videoPlayerUrl" ref="VueAliplayer" :source="dataForm.videoPlayerUrl" />
      </el-form-item>
      <el-form-item v-if="uploadType === 'audio'" label="上传音频" prop="audiourl">
        <el-upload
          :on-progress="uploadVideoProcess"
          accept=".mp3"
          action="actionUrl"
          :show-file-list="false"
          :on-error="handleError"
          :on-remove="handleRemove"
          :on-success="handleMediaSuccess"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <audio v-if="dataForm.audioPlayerUrl" :src="dataForm.audioPlayerUrl" controls style="margin-top: 10px" />
        <el-progress v-if="uploadPercent!==0" :percentage="uploadPercent" style="margin-top:10px;" />
      </el-form-item>
      <el-form-item v-if="uploadType === 'image'" label="上传图片" prop="image">
        <el-upload
          v-loading="loading"
          class="avatar-uploader"
          action="actionUrl"
          accept=".png,.jpg,.jpeg"
          :on-success="handleMediaSuccess"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <img v-if="image" :src="image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <label style="margin-left:72px;color: #f40;">文件支持类型 jpg/png,文件大小&lt;2M,建议传274x274</label>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelHandle">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ossUpload } from '@/api/oss'
import { getNewName } from '@/utils'
import { materialAdd } from '@/api/material'
import { DATETIME } from '@/utils/global-element'
import VueAliplayer from 'vue-aliplayer-v2'
import axios from 'axios'
export default {
  name: 'VideoAddOrUpdate',
  components: {
    VueAliplayer: VueAliplayer.Player
  },
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
      dataForm: {
        id: '',
        code: DATETIME,
        name: '',
        classification: '', // 选中分类
        videourl: '', // 视频地址
        videoPlayerUrl: '', // 本地视频播放地址
        audiourl: '', // 音频地址
        audioPlayerUrl: '', // 本地音频播放地址
        imageUrl: '' // 图片地址
      },
      actionUrl: 'http://gitbook.eceibs.com.cn/saas30/_book/api/mobile.html#modify-avatar',
      fileList: [], // 文件列表
      carryData: {
        success_action_status: '200'
      },
      validTime: '',
      config: {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    }
  },
  methods: {
    // 初始化
    init(type) {
      this.type = type
      this.getToken(type)
      console.log('提交类型', this.submitType, '上传类型', this.uploadType, 'type====', type)
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.materialType + '表单', this.$service.adornData({
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'category_key': this.dataForm.classification[0],
        'type': this.submitType,
        'size': this.filesize.toString(),
        'entity_id': this.uploadType === 'video' ? this.dataForm.videourl : this.uploadType === 'audio' ? this.dataForm.audiourl : this.dataForm.imageUrl
      }))
      materialAdd(this.$service.adornData({
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'size': this.filesize.toString(),
        'category_key': this.dataForm.classification[0],
        'type': this.submitType,
        'entity_id': this.uploadType === 'video' ? this.dataForm.videourl : this.uploadType === 'audio' ? this.dataForm.audiourl : this.dataForm.imageUrl
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: this.uploadType === 'video' ? '素材视频添加成功' : this.uploadType === 'audio' ? '素材音频添加成功' : '图片添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$refs.cascader.$refs.panel.clearCheckedNodes()
              this.$refs.cascader.$refs.panel.activePath = []
              this.$emit('refreshVideoDataList')
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 显示
    openDialog() {
      this.visible = true
    },
    // 取消
    cancelHandle() {
      this.visible = false
      this.$refs.cascader.$refs.panel.clearCheckedNodes()
      this.$refs.cascader.$refs.panel.activePath = []
    },
    // click 触发子菜单
    handleChange(value) {
      console.log('获得菜单值', value)
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
      this.uploadPercent = Number(file.percentage).toFixed(0)
    },
    handleMediaSuccess(res, file) {
      this.uploadPercent = 0
      this.fileList = []
    },
    // 自动上传拦截
    beforeUpload(file) {
      switch (this.type) {
        case 'video':
          this.filesize = file.size
          this.fileList = [...this.fileList, file]
          break
        case 'audio':
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
      this.carryData.key = `${this.carryData.key}${getNewName(fileName)}` // 保存文件名
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
          this.carryData.key = `${this.carryData.key}${getNewName(fileName)}`
          formData.append('key', this.carryData.key)
          switch (this.type) {
            case 'video':
              this.uploadingVideo(formData)
              break
            case 'audio':
              this.uploadingAudio(formData)
              break
            case 'image':
              this.uploadingImg(formData)
              break
          }
        })
      } else {
        formData.append('key', this.carryData.key)
        switch (this.type) {
          case 'video':
            this.uploadingVideo(formData)
            break
          case 'audio':
            this.uploadingAudio(formData)
            break
          case 'image':
            this.uploadingImg(formData)
            break
        }
      }
    },
    // 上传视频至阿里云
    uploadingVideo(formData) {
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData, this.config).then(res => {
        if (res.status === 200) {
          this.dataForm.videourl = this.carryData.key
          this.$message({
            message: '视频上传成功',
            type: 'success',
            duration: 1500
          })
          this.getVideoURL()
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
      this.dataForm.videoPlayerUrl = this.url + 'v1/coss/file/media' + '?token=' + this.token + '&hash=' + this.carryData.key + '&.m3u8'
    },
    // 上传音频到阿里云
    uploadingAudio(formData) {
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData, this.config).then(res => {
        if (res.status === 200) {
          this.dataForm.audiourl = this.carryData.key
          this.$message({
            message: '音频上传成功',
            type: 'success',
            duration: 1500
          })
          this.getAudioURL()
        } else {
          this.$message.error('音频上传失败')
        }
      })
    },
    // 获取音频地址
    getAudioURL() {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/audio' + '?token=' + this.token + '&hash=' + this.carryData.key)
          .then(res => {
            this.dataForm.audioPlayerUrl = res.data.result.audio_url
            resolve(res.data)
          }).catch(() => {
            reject()
          })
      })
    },
    // 上传图片到阿里云
    uploadingImg(formData) {
      this.loading = true // 加载loading
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData, this.config).then(res => {
        if (res.status === 200) {
          if (process.env.NODE_ENV === 'production') {
            this.image = this.actionUrl + '/' + this.carryData.key
            this.dataForm.imageUrl = this.actionUrl + '/' + this.carryData.key
          } else {
            this.image = this.actionUrl + '/' + this.carryData.key
            this.dataForm.imageUrl = this.actionUrl + '/' + this.carryData.key
          }
          this.$message({
            message: '图片上传成功',
            type: 'success',
            duration: 1500
          })
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
</style>
