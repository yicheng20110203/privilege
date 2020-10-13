<template>
  <div class="dashboard-container">
    <el-scrollbar>
      <el-form ref="dataForm" :model="dataForm" label-width="auto" size="medium" label-suffix=":">
        <el-form-item label="内容编号" prop="code">
          <el-col :span="8">
            <el-input
              v-model="dataForm.code"
              placeholder="请输入课程编号"
              maxlength="35"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-col :span="8">
            <el-input
              v-model="dataForm.name"
              placeholder="请输入音频名称"
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
              placeholder="请输入音频简介"
              :autosize="{ minRows: 2, maxRows: 4}"
              maxlength="200"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="图片介绍" prop="detail">
          <el-col :span="16">
            <div class="edit_container">
              <VueUeditorWrap v-model="dataForm.detail" :config="config" />
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="音频分类" prop="classification" class="el-form-item--ys">
          <el-cascader
            v-model="dataForm.classification"
            :options="categoryList"
            :props="{ checkStrictly: true, value: 'key', label: 'val' }"
            clearable
          />
        </el-form-item>
        <el-form-item label="选择音频">
          <el-button type="primary" @click="selectVideoHandle">+选择音频</el-button>
          <el-tag v-if="materialName" type="success">{{ materialName }}</el-tag>
        </el-form-item>
        <el-form-item label="上传封面(横板)" prop="image">
          <div style="display:flex">
            <div style="margin-right:15px;">
              <el-upload
                v-loading="loading"
                class="avatar-uploader"
                action="actionUrl"
                accept=".png,.jpg,.jpeg"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <img v-if="image" :src="image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </div>
            <div>
              <p class="uploadfont">文件支持类型 jpg/jpeg/png</p>
              <p class="uploadfont">文件大小&lt;2M,建议传274x274</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelCreateVideo">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit">确定创建</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <el-dialog
      title="选择音频"
      :close-on-click-modal="false"
      :visible.sync="visible"
      center
    >
      <el-form ref="selectDataForm" :inline="true" :model="selectDataForm" label-suffix=":" @keyup.enter.native="getDataList()">
        <el-form-item label="名称" prop="name">
          <el-input v-model="selectDataForm.name" prefix-icon="el-icon-search" label="名称" placeholder="请输入音频名称" clearable />
        </el-form-item>
        <el-form-item label="素材分类" prop="materialclass" class="el-form-item--ys">
          <el-cascader
            v-model="selectDataForm.materialclass"
            :options="materialCategoryAudioList"
            :props="{ checkStrictly: true, value: 'key', label: 'val' }"
            clearable
          />
        </el-form-item>
        <el-button type="primary" @click="selectMaterialVideoHandle">查询</el-button>
      </el-form>
      <el-table
        ref="materialvideoTable"
        v-loading="dataListLoading"
        :data="materialAudioDataList"
        highlight-current-row
        border
        height="200"
        style="width:100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="id" label="ID" header-align="center" align="center" />
        <el-table-column prop="name" label="名称" header-align="center" align="center" />
        <el-table-column prop="entity_id" label="音频" header-align="center" align="center" />
        <el-table-column prop="size_desc" label="音频大小" header-align="center" align="center" />
        <el-table-column prop="create_time_desc" label="上传时间" header-align="center" align="center" />
      </el-table>
      <el-row>
        <el-pagination
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          style="float:right;margin-top:20px;"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCurrentChange">取消</el-button>
        <el-button type="primary" @click="determineCurrentChang">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryListTree } from '@/api/categorytree'
import { getMaterialList } from '@/api/material'
import { getContentList, contentAdd, contentUpdate } from '@/api/content'
import { ISDELETE, TYPE_AUDIO, SECTION_AUDIO, MATERIAL_AUDIO, DATETIME } from '@/utils/global-element'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { getNewName, ueditorConfig } from '@/utils'
import { ossUpload } from '@/api/oss'
import axios from 'axios'
export default {
  name: 'ContentAddOrUpdateAudio',
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      visible: false,
      loading: false,
      image: '',
      categoryList: [], // 音频分类
      config: ueditorConfig(), // 富文本配置
      dataForm: {
        id: '', // 内容-编辑-id
        code: DATETIME, // 编号
        name: '', // 名称
        desc: '', // 简介
        detail: '<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>ceibsdigital</h2>', // 富文本
        classification: [], // 选中分类
        imageUrl: ''
      },
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      materialCategoryAudioList: [], // 素材-音频-分类-列表
      materialAudioDataList: [], // 素材-音频-列表
      materialId: '', // 素材-id
      materialName: '', // 素材-name
      contentStatus: '', // 内容-状态
      currentRow: null, // 素材-音频-单选
      selectDataForm: {
        name: '',
        materialclass: [] // 音频-分类-选择
      },
      // 上传图片地址
      actionUrl: 'http://gitbook.eceibs.com.cn/saas30/_book/api/mobile.html#modify-avatar',
      fileList: [],
      carryData: {
        success_action_status: '200'
      },
      validTime: ''
    }
  },
  created() {
    // 获取-内容-音频-分类
    this.getCategoryList({ 'types': SECTION_AUDIO })
    // 获取-素材-音频-分类
    this.getMaterialCategoryVideo({ 'types': MATERIAL_AUDIO })
    // 获取-素材-音频-列表
    this.getmaterialAudioDataList({ 'type': TYPE_AUDIO })
    // 获取token
    this.getToken()
    // 判断路由id
    if (this.$route.query.id) {
      this.dataForm.id = this.$route.query.id
    }
  },
  mounted() {
    if (this.dataForm.id) {
      this.getMaterialVideoUpdate()
    }
  },
  methods: {
    // 保存提交
    dataFormSubmit() {
      if (this.dataForm.id) {
        this.editVideoSubmit()
      } else {
        this.createVideoSubmit()
      }
    },
    // 创建音频提交
    createVideoSubmit() {
      contentAdd(this.$service.adornData({
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'type': TYPE_AUDIO,
        'desc': this.dataForm.desc,
        'full_txt': this.dataForm.detail,
        'category_key': this.dataForm.classification[0],
        'material_id': this.currentRow.id,
        'icon': this.dataForm.imageUrl
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.$router.replace({ path: '/course/content-management' })
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 内容-更新-音频提交
    editVideoSubmit() {
      console.log('更新', this.$service.adornData({
        'id': this.dataForm.id,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'type': TYPE_AUDIO,
        'desc': this.dataForm.desc,
        'full_txt': this.dataForm.detail,
        'category_key': this.dataForm.classification[0],
        'material_id': this.materialId,
        'status': this.contentStatus,
        'icon': this.dataForm.imageUrl
      }))
      contentUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'type': TYPE_AUDIO,
        'desc': this.dataForm.desc,
        'full_txt': this.dataForm.detail,
        'category_key': this.dataForm.classification[0],
        'material_id': this.materialId,
        'status': this.contentStatus,
        'icon': this.dataForm.imageUrl
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.$router.replace({ path: '/course/content-management' })
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 选择音频
    selectVideoHandle() {
      this.visible = true
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
    // 获取素材-音频-分类
    getMaterialCategoryVideo(types = {}) {
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        if (res && res.code === 0) {
          this.materialCategoryAudioList = res.data.list
        } else {
          this.materialCategoryAudioList = []
        }
      })
    },
    // 获取素材-音频-列表
    getmaterialAudioDataList(type = {}) {
      getMaterialList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'name': this.selectDataForm.name,
        'is_delete': ISDELETE,
        ...type
      })).then(res => {
        if (res && res.code === 0) {
          this.materialAudioDataList = res.data.list
        } else {
          this.materialAudioDataList = []
        }
      })
    },
    // 素材-音频-查询
    selectMaterialVideoHandle() {
      this.getmaterialAudioDataList({ 'type': TYPE_AUDIO, 'category_key': this.selectDataForm.materialclass[0] })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getmaterialAudioDataList({ 'type': TYPE_AUDIO })
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getmaterialAudioDataList({ 'type': TYPE_AUDIO })
    },
    // 单选
    handleCurrentChange(val) {
      this.currentRow = val
      this.materialId = this.currentRow.id
      this.materialName = this.currentRow.name
      // console.log('素材单选,id = ', this.currentRow.id)
    },
    // 取消创建
    cancelCreateVideo() {
      this.$router.replace({ path: '/course/content-management' })
    },
    // 弹窗-取消
    cancelCurrentChange() {
      this.visible = false
    },
    // 弹窗-确定
    determineCurrentChang() {
      this.visible = false
      // console.log('素材确定,id = ', this.currentRow)
    },
    // 编辑-通过路由id获取数据
    getMaterialVideoUpdate() {
      getContentList(this.$service.adornData({
        'id': this.$route.query.id,
        'type': TYPE_AUDIO
      })).then(res => {
        if (res && res.code === 0) {
          const videolist = res.data.list[0]
          // this.dataForm.id = videolist.id
          this.dataForm.code = videolist.code
          this.dataForm.name = videolist.name
          this.dataForm.desc = videolist.desc
          this.dataForm.detail = videolist.full_txt
          this.dataForm.classification = videolist.categories[0].key
          this.materialId = videolist.material_id
          this.materialName = videolist.material_name
          this.contentStatus = videolist.status
          this.dataForm.image = videolist.icon
          this.dataForm.imageUrl = videolist.icon
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
          this.url = process.env.VUE_APP_UPLOADURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADURL}`
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
      this.carryData.key = `${this.carryData.key}${getNewName(fileName)}` // 保存图片名
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
          this.carryData.key = `${this.carryData.key}${getNewName(fileName)}`
          formData.append('key', this.carryData.key)
          this.uploadingImg(formData)
        })
      } else {
        formData.append('key', this.carryData.key)
        this.uploadingImg(formData)
      }
    },
    // 上传图片到阿里云
    uploadingImg(formData) {
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.actionUrl}`, formData).then(res => {
        if (res.status === 200) {
          this.image = this.actionUrl + '/' + this.carryData.key
          this.dataForm.imageUrl = this.actionUrl + '/' + this.carryData.key
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.edit_container {
  overflow: hidden;
}

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
    width: 170px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 170px;
    height: 150px;
    display: block;
  }
  .uploadfont {
    line-height:4px;
    color: #8c939d;
    font-size: 14px;
  }
</style>
