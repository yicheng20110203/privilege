<template>
  <el-dialog
    :title="!dataForm.id ? '创建内容' : '编辑内容'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
    center
    @closed="closedDialog"
  >
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="auto" size="medium" label-suffix=":">
      <el-form-item label="名称" prop="name">
        <el-col :span="8">
          <el-input
            v-model="dataForm.name"
            placeholder="请输入名称"
            maxlength="35"
            show-word-limit
            clearable
          />
        </el-col>
      </el-form-item>
      <el-form-item label="简介" prop="desc">
        <el-col :span="8">
          <el-input
            v-model="dataForm.desc"
            type="textarea"
            :rows="5"
            placeholder="请输入简介"
            maxlength="200"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <el-form-item label="上传封面(横板)" prop="imageUrl">
        <div class="dashboard-coverpicture">
          <div class="dashboard-avataruploader">
            <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="dashboard-avatar-img">
            <i v-else class="el-icon-plus dashboard-avatar-uploader-icon" />
          </div>
          <div class="dashboard-cover_picture_right_box">
            <el-button
              type="primary"
              size="medium"
              class="dashboard-cover_picture_button"
              @click="getMaterialPicture"
            >
              从素材库中选择
            </el-button>
            <el-upload
              ref="upload"
              v-loading="loading"
              action="actionUrl"
              accept=".png,.jpg,.jpeg"
              :limit="1"
              :show-file-list="false"
              :on-remove="handleRemove"
              :on-success="handleCoverSuccess"
              :before-upload="beforeUpload"
            >
              <el-button type="primary" size="medium">本地上传</el-button>
            </el-upload>
            <span>文件支持类型 jpg/jpeg/png,文件大小&lt;2M,建议传274x274</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="是否可试看" prop="try_reading">
        <el-switch v-model="dataForm.try_reading" active-value="1" inactive-value="2" @change="switchHandle" />
      </el-form-item>
      <el-form-item label="图文介绍" prop="detail">
        <VueUeditorWrap v-model="dataForm.detail" :config="config" />
      </el-form-item>
      <el-form-item label="类型" prop="classification">
        <el-select v-model="dataForm.classification" placeholder="选择类型">
          <el-option v-for="item in MaterialTypeList" :key="item.key" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择素材" prop="materialId">
        <el-button type="primary" style="margin-bottom:5px;" @click="selectMaterialHandle">+选择</el-button>
        <el-table
          v-if="videoSelect.length !== 0"
          v-loading="dataListLoading"
          :data="videoSelect"
          border
          style="width:76%"
        >
          <el-table-column prop="code" label="编号" header-align="center" align="center" />
          <el-table-column prop="name" label="名称" header-align="center" align="center" />
          <el-table-column prop="entity_id" label="素材" header-align="center" align="center" />
          <el-table-column prop="size_desc" label="大小" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.size_desc|fileSizeFilter(scope.row.size_desc) }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelCreateVideo">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">{{ !dataForm.id ? '确认创建' : '确认编辑' }}</el-button>
    </div>
    <select-video-list ref="SelectVideoList" @refreshVideoDataList="getVideoList" />
    <select-audio-list ref="SelectAudioList" @refreshAudioDataList="getAudioList" />
    <select-article-list ref="SelectArticleList" @refreshArticleDataList="getArticleList" />
    <select-material-picture ref="SelectMaterialPicture" @refreshPictureDataList="getPictureList" />
  </el-dialog>
</template>

<script>
import { getCategoryListTree } from '@/api/categorytree'
import { getCourseFilters } from '@/api/courseselection'
import { getMaterialList, materialAdd } from '@/api/material'
import { getContentList, contentAdd, contentUpdate } from '@/api/content'
import SelectMaterialPicture from '@/components/SelectMaterialPicture/index'
import SelectVideoList from '@/components/SelectVideoList/index'
import SelectAudioList from '@/components/SelectAudioList/index'
import SelectArticleList from '@/components/SelectArticleList/index'
import { TYPE_VIDEO, TYPE_PICTURE } from '@/utils/global-element'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { getNewName, ueditorConfig, getTime } from '@/utils'
import { ossUpload } from '@/api/oss'
import axios from 'axios'
export default {
  name: 'ContentAdd',
  components: {
    VueUeditorWrap,
    SelectVideoList,
    SelectAudioList,
    SelectArticleList,
    SelectMaterialPicture
  },
  props: {
    // 章节类型，调用组件必传
    lessonId: {
      type: Number,
      default: () => (0)
    },
    chapterId: {
      type: Number,
      default: () => (0)
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      image: '',
      token: '',
      videoSelect: [], // 内容 - 关联 - 素材
      MaterialTypeList: [], // 素材类型
      categoryList: [], // 视频分类
      config: ueditorConfig(), // 富文本配置
      dataForm: {
        id: '', // 内容-编辑-id
        code: getTime(), // 编号
        coverid: '', // 素材id
        name: '', // 名称
        desc: '', // 简介
        detail: '', // 富文本
        classification: '', // 选中分类
        imageUrl: '',
        materialId: 0, // 素材-id
        try_reading: '1'
      },
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      materialCategoryVideoList: [], // 素材-视频-分类-列表
      materialvideoDataList: [], // 素材-视频-列表
      selectDataForm: {
        name: '',
        materialclass: [] // 视频-分类-选择
      },
      dataRule: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
        try_reading: [{ required: true, message: '请选择是否可视看', trigger: 'blur' }],
        classification: [{ required: true, message: '选择类型', trigger: 'blur' }],
        materialId: [{ required: true, message: '选择素材', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请上传封面', trigger: 'blur' }]
      },
      filesize: '', // 图片大小
      // 上传图片地址
      actionUrl: '',
      fileList: [],
      carryData: {
        success_action_status: '200'
      },
      validTime: ''
    }
  },
  methods: {
    // 更新 - 获取内容id
    init(id) {
      this.dataForm.id = id
    },
    switchHandle() {
      console.log(this.dataForm.try_reading)
    },
    // 封面上传至素材库
    uploadMaterialLibrary(params = {}) {
      materialAdd(this.$service.adornData({
        'code': this.dataForm.code,
        'name': this.dataForm.code,
        'size': this.filesize.toString(),
        'type': TYPE_PICTURE,
        ...params
      })).then(res => {
        if (res && res.code === 0) {
          this.dataForm.coverid = res.data.id
          this.$message({
            message: '素材添加成功',
            type: 'success',
            duration: 1500
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取素材图片
    getMaterialPicture() {
      this.$refs.SelectMaterialPicture.openDialog()
      this.$nextTick(() => {
        this.$refs.SelectMaterialPicture.getDataList()
        this.$refs.SelectMaterialPicture.getCategoryList()
      })
    },
    // 关闭窗口
    closedDialog() {
      this.resetForm('dataForm')
      this.dataForm.id = ''
      this.videoSelect = []
    },
    openDialog() {
      this.visible = true
    },
    // 获取编辑器内容
    getEditorContent(data) {
      this.dataForm.detail = data
    },
    // 保存提交
    dataFormSubmit() {
      if (this.dataForm.id) {
        this.editContentHandle()
      } else {
        this.addContentHandle()
      }
    },
    // 添加-内容
    addContentHandle() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          contentAdd(this.$service.adornData({
            'lesson_id': parseInt(this.lessonId),
            'chapter_id': parseInt(this.chapterId),
            'material_id': parseInt(this.dataForm.materialId),
            'type': parseInt(this.dataForm.classification),
            'name': this.dataForm.name,
            'desc': this.dataForm.desc,
            'full_txt': this.dataForm.detail,
            'cover_id': this.dataForm.coverid,
            'try_reading': parseInt(this.dataForm.try_reading)
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.videoSelect = []
                  this.resetForm('dataForm')
                  this.dataForm.id = ''
                  this.$emit('refreshContentDataList')
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 内容-更新-提交
    editContentHandle() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          contentUpdate(this.$service.adornData({
            'id': parseInt(this.dataForm.id),
            'lesson_id': parseInt(this.lessonId),
            'chapter_id': parseInt(this.chapterId),
            'material_id': parseInt(this.dataForm.materialId),
            'type': parseInt(this.dataForm.classification),
            'name': this.dataForm.name,
            'desc': this.dataForm.desc,
            'full_txt': this.dataForm.detail,
            'cover_id': this.dataForm.coverid,
            'try_reading': parseInt(this.dataForm.try_reading)
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.videoSelect = []
                  this.resetForm('dataForm')
                  this.dataForm.id = ''
                  this.$emit('refreshContentDataList')
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 选择视频
    selectMaterialHandle() {
      switch (this.dataForm.classification) {
        case 1:
          this.$refs.SelectVideoList.openDialog()
          this.$nextTick(() => {
            this.$refs.SelectVideoList.getDataList()
            this.$refs.SelectVideoList.getCategoryList()
          })
          break
        case 2:
          this.$refs.SelectAudioList.openDialog()
          this.$nextTick(() => {
            this.$refs.SelectAudioList.getDataList()
            this.$refs.SelectAudioList.getCategoryList()
          })
          break
        case 3:
          this.$refs.SelectArticleList.openDialog()
          this.$nextTick(() => {
            this.$refs.SelectArticleList.getDataList()
            this.$refs.SelectArticleList.getCategoryList()
          })
          break
        case 4:
          this.$refs.SelectMaterialPicture.openDialog()
          this.$nextTick(() => {
            this.$refs.SelectMaterialPicture.getDataList()
            this.$refs.SelectMaterialPicture.getCategoryList()
          })
          break
      }
    },
    // 获取素材类型
    getMaterialType() {
      getCourseFilters(this.$service.adornData({
        'show_section_type': 1
      })).then(res => {
        this.MaterialTypeList = res && res.code === 0 ? res.data.material_type : []
      })
    },
    // 获取分类
    getCategoryList(types = {}) {
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        if (res && res.code === 0) {
          this.categoryList = res.data.list
        } else {
          this.categoryList = []
        }
      })
    },
    // 获取素材-视频-分类
    getMaterialCategoryVideo(types = {}) {
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        if (res && res.code === 0) {
          this.materialCategoryVideoList = res.data.list
        } else {
          this.materialCategoryVideoList = []
        }
      })
    },
    // 获取素材-视频-列表
    getMaterialVideoDatalist(type = {}) {
      getMaterialList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'name': this.selectDataForm.name,
        ...type
      })).then(res => {
        this.materialvideoDataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
    },
    // 获取素材-视频-列表
    getMaterialVideo(type = {}) {
      getMaterialList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'name': this.selectDataForm.name,
        ...type
      })).then(res => {
        this.videoSelect = res && res.code === 0 ? res.data.list : []
      })
    },
    // 素材-视频-查询
    selectMaterialVideoHandle() {
      this.getMaterialVideoDatalist({
        'type': TYPE_VIDEO,
        'category_key': this.selectDataForm.materialclass[0]
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getMaterialVideoDatalist({ 'type': TYPE_VIDEO })
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getMaterialVideoDatalist({ 'type': TYPE_VIDEO })
    },
    // 单选
    handleCurrentChange(val) {
      this.videoSelect = [val]
      this.currentRow = val
      this.dataForm.materialName = this.currentRow.name
    },
    // 创建内容 - 选择 - 视频
    getVideoList(val) {
      this.videoSelect = [val]
      this.dataForm.materialId = val.id
      // console.log('视频ID', this.materialId)
    },
    // 创建内容 - 选择 - 音频
    getAudioList(val) {
      this.videoSelect = [val]
      this.dataForm.materialId = val.id
      // console.log('音频ID', this.materialId)
    },
    // 创建内容 - 选择 - 文章
    getArticleList(val) {
      this.videoSelect = [val]
      this.dataForm.materialId = val.id
      // console.log('文章ID', this.materialId)
    },
    // 创建内容 - 选择 - 图片
    getPictureList(val) {
      this.dataForm.imageUrl = val.entity_id
      this.dataForm.coverid = val.id
    },
    // 取消创建
    cancelCreateVideo() {
      this.videoSelect = []
      this.resetForm('dataForm')
      this.dataForm.id = ''
      this.visible = false
    },
    // 弹窗-取消
    cancelCurrentChange() {
      this.visible = false
    },
    // 弹窗-确定
    determineCurrentChang() {
      this.visible = false
    },
    // 图片删除
    handleRemove(file, fileList) {
      this.dataForm.imageUrl = ''
      this.dataForm.fileList = []
    },
    // 上传图片成功，清除fileList
    handleCoverSuccess(res, file) {
      this.fileList = []
    },
    // 编辑-获取内容数据
    getMaterialContentList() {
      getContentList(this.$service.adornData({
        'id': this.dataForm.id,
        'page': this.pageIndex,
        'size': this.pageSize,
        'lesson_id': this.lessonId,
        'chapter_id': this.chapterId
      })).then(res => {
        if (res && res.code === 0) {
          const contentlist = res.data.list[0]
          this.dataForm.name = contentlist.name
          this.dataForm.desc = contentlist.desc
          this.dataForm.detail = contentlist.full_txt
          this.dataForm.classification = contentlist.type
          this.dataForm.materialId = contentlist.material_info.id
          this.videoSelect = [contentlist.material_info]
          this.contentStatus = contentlist.status
          this.dataForm.imageUrl = contentlist.cover
          this.dataForm.coverid = contentlist.cover_id
          this.dataForm.try_reading = contentlist.try_reading.toString()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取token
    getToken() {
      ossUpload().then(response => {
        if (response && response.code === 0) {
          // this.token = response.data.token
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
            resolve()
          }).catch(() => {
            reject()
          })
      })
    },
    // 自动上传拦截
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      this.filesize = file.size
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
      // this.carryData.key = `${this.carryData.key}${getNewName(fileName)}` // 保存图片名
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
            message: '图片上传成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.uploadMaterialLibrary({ 'entity_id': this.dataForm.imageUrl })
            }
          })
          this.fileList = []
          this.loading = false
        } else {
          this.$message.error('图片上传失败')
        }
      })
    }
  }
}
</script>
