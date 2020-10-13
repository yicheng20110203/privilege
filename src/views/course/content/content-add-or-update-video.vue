<template>
  <div class="dashboard-container">
    <el-scrollbar>
      <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="auto" size="medium" label-suffix=":">
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
              placeholder="请输入视频名称"
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
              placeholder="请输入视频简介"
              :autosize="{ minRows: 2, maxRows: 4}"
              maxlength="200"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="图文介绍" prop="detail">
          <VueUeditorWrap v-model="dataForm.detail" :config="config" />
        </el-form-item>
        <el-form-item label="视频分类" prop="classification" class="el-form-item--ys">
          <el-cascader
            v-model="dataForm.classification"
            :options="categoryList"
            :show-all-levels="false"
            :props="{ checkStrictly: true, value: 'key', label: 'val' }"
            placeholder="请选择视频分类"
            clearable
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="选择视频" prop="materialName">
          <el-button type="primary" style="margin-bottom:5px;" @click="selectVideoHandle">+选择视频</el-button>
          <!-- <el-tag v-if="dataForm.materialName" type="success">{{ dataForm.materialName }}</el-tag> -->
          <el-table
            v-if="videoSelect.length !== 0"
            v-loading="dataListLoading"
            :data="videoSelect"
            border
            style="width:76%"
          >
            <el-table-column prop="code" label="编号" header-align="center" align="center" />
            <el-table-column prop="name" label="名称" header-align="center" align="center" />
            <el-table-column prop="entity_id" label="视频" header-align="center" align="center" />
            <el-table-column prop="size_desc" label="视频大小" header-align="center" align="center">
              <template slot-scope="scope">
                {{ scope.row.size_desc|fileSizeFilter(scope.row.size_desc) }}
              </template>
            </el-table-column>
            <el-table-column prop="create_time_desc" label="上传时间" header-align="center" align="center" />
          </el-table>
        </el-form-item>
        <el-form-item label="上传封面(横板)" prop="imageUrl">
          <div style="display:flex">
            <div style="margin-right:15px;">
              <el-upload
                ref="upload"
                v-loading="loading"
                class="avatar-uploader"
                action="actionUrl"
                accept=".png,.jpg,.jpeg"
                :limit="1"
                :show-file-list="false"
                :on-remove="handleRemove"
                :on-success="handleCoverSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar">
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
          <el-button type="primary" @click="dataFormSubmit">{{ !dataForm.id ? '确定创建' : '确定编辑' }}</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <el-dialog
      title="选择视频"
      :close-on-click-modal="false"
      :visible.sync="visible"
      center
    >
      <el-form ref="selectDataForm" :inline="true" :model="selectDataForm" label-suffix=":" @keyup.enter.native="getDataList()">
        <el-form-item label="名称" prop="name">
          <el-input v-model="selectDataForm.name" prefix-icon="el-icon-search" label="名称" placeholder="请输入视频名称" clearable />
        </el-form-item>
        <el-form-item label="素材分类" prop="materialclass" class="el-form-item--ys">
          <el-cascader
            v-model="selectDataForm.materialclass"
            :options="materialCategoryVideoList"
            :props="{ checkStrictly: true, value: 'key', label: 'val' }"
            clearable
          />
        </el-form-item>
        <el-button type="primary" @click="selectMaterialVideoHandle">查询</el-button>
      </el-form>
      <el-table
        ref="materialvideoTable"
        v-loading="dataListLoading"
        :data="materialvideoDataList"
        highlight-current-row
        border
        height="250"
        style="width:100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="id" label="选择ID" header-align="center" align="center">
          <template slot-scope="scope">
            <el-radio-group v-model="materialId">
              <el-radio :label="scope.row.id" />
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编号" header-align="center" align="center" />
        <el-table-column prop="name" label="名称" header-align="center" align="center" />
        <el-table-column prop="entity_id" label="视频" header-align="center" align="center" />
        <el-table-column prop="size_desc" label="视频大小" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.size_desc|fileSizeFilter(scope.row.size_desc) }}
          </template>
        </el-table-column>
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
        <!-- <el-button @click="cancelCurrentChange">取消</el-button> -->
        <el-button type="primary" @click="determineCurrentChang">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryListTree } from '@/api/categorytree'
import { getMaterialList } from '@/api/material'
import { getContentList, contentAdd, contentUpdate } from '@/api/content'
import { TYPE_VIDEO, SECTION_VIDEO, MATERIAL_VIDEO } from '@/utils/global-element'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { getNewName, ueditorConfig, getTime } from '@/utils'
import { ossUpload } from '@/api/oss'
import axios from 'axios'
export default {
  name: 'ContentAddOrUpdateVideo',
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      visible: false,
      loading: false,
      image: '',
      token: '',
      videoSelect: [],
      categoryList: [], // 视频分类
      config: ueditorConfig(), // 富文本配置
      dataForm: {
        id: '', // 内容-编辑-id
        code: getTime(), // 编号
        name: '', // 名称
        desc: '', // 简介
        detail: '', // 富文本
        classification: [], // 选中分类
        materialName: '', // 素材-name
        imageUrl: ''
      },
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      materialCategoryVideoList: [], // 素材-视频-分类-列表
      materialvideoDataList: [], // 素材-视频-列表
      materialId: '', // 素材-id
      contentStatus: '', // 内容-状态
      currentRow: null, // 素材-视频-单选
      selectDataForm: {
        name: '',
        materialclass: [] // 视频-分类-选择
      },
      dataRule: {
        code: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
        detail: [{ required: true, message: '图文介绍不能为空', trigger: 'blur' }],
        classification: [{ required: true, message: '视频分类不能为空', trigger: 'blur' }],
        materialName: [{ required: true, message: '请选择视频', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请上传视频封面', trigger: 'blur' }]
      },
      // 上传图片地址
      actionUrl: '',
      fileList: [],
      carryData: {
        success_action_status: '200'
      },
      validTime: ''
    }
  },
  created() {
    // 获取-内容-视频-分类
    this.getCategoryList({ 'types': SECTION_VIDEO })
    // 获取-素材-视频-分类
    this.getMaterialCategoryVideo({ 'types': MATERIAL_VIDEO })
    // 获取-素材-视频-列表
    this.getMaterialVideoDatalist({ 'type': TYPE_VIDEO })
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
    // 选择
    handleChange(value) {
      this.dataForm.classification = value[value.length - 1]
    },
    // 获取编辑器内容
    getEditorContent(data) {
      this.dataForm.detail = data
    },
    // 保存提交
    dataFormSubmit() {
      if (this.dataForm.id) {
        this.editVideoSubmit()
      } else {
        this.createVideoSubmit()
      }
    },
    // 创建视频提交
    createVideoSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          contentAdd(this.$service.adornData({
            'code': this.dataForm.code,
            'name': this.dataForm.name,
            'type': TYPE_VIDEO,
            'desc': this.dataForm.desc,
            'full_txt': this.dataForm.detail,
            'category_key': this.dataForm.classification,
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
        } else {
          return false
        }
      })
    },
    // 内容-更新-视频提交
    editVideoSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          contentUpdate(this.$service.adornData({
            'id': this.dataForm.id,
            'code': this.dataForm.code,
            'name': this.dataForm.name,
            'type': TYPE_VIDEO,
            'desc': this.dataForm.desc,
            'full_txt': this.dataForm.detail,
            'category_key': this.dataForm.classification,
            'material_id': this.materialId,
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
        } else {
          return false
        }
      })
    },
    // 选择视频
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
      // this.materialId = this.currentRow.id
      this.dataForm.materialName = this.currentRow.name
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
    // 编辑-通过路由id获取数据
    getMaterialVideoUpdate() {
      getContentList(this.$service.adornData({
        'id': this.$route.query.id,
        'type': TYPE_VIDEO
      })).then(res => {
        if (res && res.code === 0) {
          const videolist = res.data.list[0]
          this.dataForm.code = videolist.code
          this.dataForm.name = videolist.name
          this.dataForm.desc = videolist.desc
          this.dataForm.detail = videolist.full_txt
          this.dataForm.classification = videolist.categories[0].key
          this.materialId = videolist.material_id
          this.dataForm.materialName = videolist.material_name
          this.contentStatus = videolist.status
          this.dataForm.imageUrl = videolist.icon
          this.getMaterialVideo({ 'type': TYPE_VIDEO, 'id': this.materialId, 'name': this.dataForm.materialName })
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
            duration: 1500
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
