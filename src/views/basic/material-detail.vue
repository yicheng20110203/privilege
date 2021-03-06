<template>
  <el-dialog
    :title="submitType===1 ? '视频详情' : submitType===2 ? '音频详情' : '预览图片详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :model="dataForm" size="medium" label-suffix=":">
      <el-form-item v-if="submitType===1" label="视频名称">
        {{ dataForm.name }}
      </el-form-item>
      <el-form-item v-if="submitType===2" label="音频名称">
        {{ dataForm.name }}
      </el-form-item>
      <el-form-item v-if="submitType===4" label="图片名称">
        {{ dataForm.name }}
      </el-form-item>
      <el-form-item v-if="submitType===1" label="视频文件">
        <el-col :span="22">
          <!-- <vue-aliplayer
            ref="VueAliplayer"
            :source="dataForm.videoUrl"
          /> -->
          <template v-if="videoPlay">
            <vue-aliplayer ref="VueAliplayer" :source="dataForm.videoUrl" />
          </template>
        </el-col>
      </el-form-item>
      <el-form-item v-if="submitType===2" label="音频文件">
        <audio v-if="dataForm.audiourl" :src="dataForm.audiourl" controls style="margin-top: 10px" />
      </el-form-item>
      <el-form-item v-if="submitType===4" label="图片文件">
        <img :src="dataForm.imageurl" width="200px" height="200px">
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { ossUpload } from '@/api/oss'
import axios from 'axios'
import VueAliplayer from 'vue-aliplayer-v2'
export default {
  name: 'MaterialDetail',
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
      url: '',
      visible: false,
      reFresh: true, // 组件状态
      videoPlay: true,
      token: '', // 获取token
      material: '',
      options: {
        source: ''
      },
      show: true,
      aliPlaySrc: 'https://g.alicdn.com/de/prismplayer/2.8.8/aliplayer-min.js',
      aliPlayCss: 'https://g.alicdn.com/de/prismplayer/2.8.8/skins/default/aliplayer-min.css',
      dataForm: {
        name: '', // 名称
        mediaurl: '', // 视频音频hash值
        imageurl: '', // 图片地址
        audiourl: '', // 音频播放地址
        videoUrl: '' // 视频播放地址
      }
    }
  },
  // 刷新组件
  methods: {
    init(data) {
      this.dataForm.name = data.name
      this.dataForm.mediaurl = data.entity_id
      this.dataForm.imageurl = data.entity_id
      if (this.submitType === 1 || this.submitType === 2) {
        this.getToken()
      }
      this.videoPlay = true
    },
    play() {
      this.$refs.VueAliplayer.play()
    },
    // 暂停
    pause() {
      this.$refs.VueAliplayer.pause()
    },
    replay() {
      this.$refs.VueAliplayer.replay()
    },
    getCurrentTime() {
      this.$refs.VueAliplayer.getCurrentTime()
    },
    // 关闭窗口,销毁
    dispose() {
      this.$refs.VueAliplayer.dispose()
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
      this.videoPlay = false
      this.dataForm = {
        name: '', // 名称
        mediaurl: '', // 视频音频hash值
        imageurl: '', // 图片地址
        audiourl: '', // 音频播放地址
        videoUrl: '' // 视频播放地址
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取token
    getToken(type) {
      ossUpload().then(response => {
        if (response && response.code === 0) {
          this.token = response.data.token // 保存token
          if (this.uploadType === 'video') {
            this.getVideoURL()
          } else {
            this.getAudioURL(response.data.token)
          }
        } else {
          this.$message.error('获取token失败')
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
      this.dataForm.videoUrl = this.url + 'v1/coss/file/media' + '?token=' + this.token + '&hash=' + this.dataForm.mediaurl + '&.m3u8'
      this.videoPlay = true
    },
    // 获取音频地址
    getAudioURL(token) {
      if (process.env.NODE_ENV === 'production') {
        this.url = process.env.VUE_APP_UPLOADOSSURL
      } else {
        this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
      }
      axios.get(this.url + 'v1/coss/file/audio' + '?token=' + token + '&hash=' + this.dataForm.mediaurl)
        .then(res => {
          this.dataForm.audiourl = res.data.result.audio_url
        })
    },
    // 打开窗口
    openDialog() {
      this.visible = true
    }
  }
}
</script>
