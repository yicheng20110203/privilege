<template>
  <el-dialog
    title="上传音频"
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
      <el-form-item label="上传音频" prop="audiourl">
        <el-upload
          :on-progress="uploadVideoProcess"
          accept=".mp3"
          :disabled="is_upload"
          action="actionUrl"
          :show-file-list="false"
          :on-error="handleError"
          :on-remove="handleRemove"
          :on-success="handleMediaSuccess"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="上传进度">
        <el-col :span="18">
          <el-progress v-if="uploadPercent!==0" :percentage="uploadPercent" />
        </el-col>
      </el-form-item>
      <el-form-item v-if="dataForm.audioPlayerUrl" label="音频预览">
        <audio ref="audio" :src="dataForm.audioPlayerUrl" autoplay controls />
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
  name: 'AudioAddOrUpdate',
  props: {
    menuCategory: {
      type: Array,
      default: () => ([])
    },
    uploadType: {
      type: String,
      default: 'audio'
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
        audiourl: '', // 音频地址
        audioPlayerUrl: '' // 本地音频播放地址

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
        audiourl: [{ required: true, message: '请上传音频', trigger: 'blur' }]
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
    init() {
      this.getToken()
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
            'times': parseInt(this.$refs.audio.duration),
            'type': this.submitType,
            'entity_id': this.dataForm.audiourl
          })).then(response => {
            if (response && response.code === 0) {
              this.$message({
                message: '素材音频添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$refs.cascader.$refs.panel.clearCheckedNodes()
                  this.$refs.cascader.$refs.panel.activePath = []
                  this.resetForm('dataForm')
                  this.uploadPercent = 0
                  this.dataForm.name = ''
                  this.dataForm.audioPlayerUrl = ''
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
      this.resetForm('dataForm')
      this.dataForm.audioPlayerUrl = ''
      this.$refs.cascader.$refs.panel.clearCheckedNodes()
      this.$refs.cascader.$refs.panel.activePath = []
    },
    // 获取token
    getToken() {
      ossUpload().then(response => {
        if (response && response.code === 0) {
          this.token = response.data.token // 保存token
          this.getPolicy()
        } else {
          this.$message.error('获取token失败')
        }
      })
    },
    // 获取签名
    getPolicy() {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/get-web-upload-sign' + '?type=audio&token=' + this.token)
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
      this.filesize = file.size
      this.fileList = [...this.fileList, file]
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
          this.uploadingAudio(formData, materialkey)
        })
      } else {
        formData.append('key', materialkey)
        this.uploadingAudio(formData, materialkey)
      }
    },
    // 上传音频到阿里云
    uploadingAudio(formData, materialkey) {
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData, this.config).then(res => {
        if (res.status === 200) {
          this.dataForm.audiourl = materialkey
          this.$message({
            message: '音频上传成功',
            type: 'success',
            duration: 1500
          })
          this.fileList = []
          this.is_upload = false
          this.getAudioURL(materialkey)
        } else {
          this.$message.error('音频上传失败')
        }
      })
    },
    // 获取音频地址
    getAudioURL(materialkey) {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/audio' + '?token=' + this.token + '&hash=' + materialkey)
          .then(res => {
            this.dataForm.audioPlayerUrl = res.data.result.audio_url
            resolve(res.data)
          }).catch(() => {
            reject()
          })
      })
    }
  }
}
</script>
