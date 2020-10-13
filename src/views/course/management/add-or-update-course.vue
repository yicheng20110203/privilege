<template>
  <div class="dashboard-container">
    <el-steps :active="active" finish-status="success" simple style="margin-bottom: 20px;">
      <el-step title="基础信息" icon="el-icon-upload" />
      <el-step title="设置内容" icon="el-icon-circle-plus" />
      <el-step title="价格&推荐设置" icon="el-icon-setting" />
    </el-steps>
    <div v-if="active === 0">
      <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="auto" size="medium" label-suffix=":">
        <el-form-item label="编号" prop="code">
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
            <el-input v-model="dataForm.name" placeholder="请输入课程名称" maxlength="35" show-word-limit />
          </el-col>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-col :span="8">
            <el-input
              v-model="dataForm.desc"
              type="textarea"
              :rows="5"
              placeholder="请输入课程简介"
              maxlength="200"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="分类" prop="classification" class="el-form-item--ys">
          <el-cascader
            v-model="dataForm.classification"
            :options="courseCategoryList"
            :show-all-levels="false"
            :props="{ checkStrictly: true, value: 'key', label: 'val' }"
            placeholder="请选择课程分类"
            clearable
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="购买后可学习时间" prop="study_days">
          <el-input-number v-model="dataForm.study_days" placeholder="学习时间" />
          <span>天</span>
          <span style="color:#f40;">注意：0 表示永久有效。</span>
        </el-form-item>
        <el-form-item label="上传封面" prop="image">
          <el-col :span="8">
            <div class="dashboard-coverpicture">
              <div>
                <label class="dashboard-cover_picture_label">1:1格式图</label>
                <div class="dashboard-avataruploader">
                  <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="dashboard-avatar-img">
                  <i v-else class="el-icon-plus dashboard-avatar-uploader-icon" />
                </div>
              </div>
              <div class="dashboard-cover_picture_right_box">
                <el-button
                  type="primary"
                  size="medium"
                  class="dashboard-cover_picture_button"
                  @click="getMaterialPicture('cover')"
                >
                  从素材库中选择
                </el-button>
                <el-upload
                  v-loading="loading"
                  action="coverActionUrl"
                  accept=".png,.jpg,.jpeg"
                  :show-file-list="false"
                  :on-success="handleCoverSuccess"
                  :before-upload="beforeUpload"
                >
                  <el-button type="primary" size="medium">本地上传</el-button>
                </el-upload>
                <span class="dashboard-uploadfont">文件类型jpg/png</span><br>
                <span class="dashboard-uploadfont">文件大小&lt;2M,建议上传274x274</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="dashboard-coverpicture">
              <div>
                <label class="dashboard-cover_picture_label">横版图</label>
                <div class="dashboard-horizontal-avatar">
                  <img v-if="dataForm.horizontalUrl" :src="dataForm.horizontalUrl" class="dashboard-avatar-horizontal-img">
                  <i v-else class="el-icon-plus dashboard-avatar-uploader-horizontal-icon" />
                </div>
              </div>
              <div class="dashboard-cover_picture_right_box">
                <el-button
                  type="primary"
                  size="medium"
                  class="dashboard-cover_picture_button"
                  @click="getMaterialPicture('horizontal')"
                >
                  从素材库中选择
                </el-button>
                <el-upload
                  v-loading="loading"
                  action="horizontalActionUrl"
                  accept=".png,.jpg,.jpeg"
                  :show-file-list="false"
                  :on-success="handleHorizontalSuccess"
                  :before-upload="horizontalBeforeUpload"
                >
                  <el-button type="primary">本地上传</el-button>
                </el-upload>
                <span class="dashboard-uploadfont">文件类型jpg/png</span><br>
                <span class="dashboard-uploadfont">文件大小&lt;2M,建议上传</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="dashboard-coverpicture">
              <div>
                <label class="dashboard-cover_picture_label">竖版图</label>
                <div class="dashboard-vertical-avatar">
                  <img v-if="dataForm.verticalUrl" :src="dataForm.verticalUrl" class="dashboard-avatar-vertical-img">
                  <i v-else class="el-icon-plus dashboard-avatar-uploader-icon" />
                </div>
              </div>
              <div class="dashboard-cover_picture_right_box">
                <el-button
                  type="primary"
                  size="medium"
                  class="dashboard-cover_picture_button"
                  @click="getMaterialPicture('vertical')"
                >
                  从素材库中选择
                </el-button>
                <el-upload
                  v-loading="loading"
                  action="verticalActionUrl"
                  accept=".png,.jpg,.jpeg"
                  :show-file-list="false"
                  :on-success="handleVerticalSuccess"
                  :before-upload="verticalBeforeUpload"
                >
                  <el-button type="primary">本地上传</el-button>
                </el-upload>
                <span class="dashboard-uploadfont">文件类型jpg/png</span><br>
                <span class="dashboard-uploadfont">文件大小&lt;2M,建议上传</span>
              </div>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-checkbox-group v-model="dataForm.tags">
            <el-checkbox v-for="item in tags" :key="item.key" :value="item.key" :label="item.key">{{ item.val }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="介绍" prop="detail">
          <VueUeditorWrap v-model="dataForm.detail" :config="config" />
        </el-form-item>
      </el-form>
      <el-row style="margin-top: 20px; text-align: center;">
        <el-button type="primary" @click="basicInfoHandle">下一步</el-button>
        <el-button type="primary" @click="basicComeback">返回</el-button>
      </el-row>
    </div>

    <div v-if="active === 1">
      <el-container>
        <el-aside width="240px">
          <p>章节管理</p>
          <div class="dashboard-category">
            <div class="dashboard-category-item">
              <el-button type="text">全部章节</el-button>
            </div>
            <div class="dashboard-category-item dashboard-category-item-icon">
              <el-button
                type="text"
                size="medium"
                icon="el-icon-circle-plus-outline"
                @click="ChapterCategoryAddHandle"
              />
            </div>
          </div>
          <chapter-category-tree
            v-if="chapterDataList.length"
            ref="ChapterCategoryTree"
            :data-tree="chapterDataList"
            :lesson-id="dataForm.id"
            :default-props="defaultProps"
            @nodeClick="switchCategory"
            @refreshChapterDataList="getChapterDataList"
          />
        </el-aside>
        <el-main>
          <el-button type="primary" @click="contentAddHandle">+创建内容</el-button>
          <el-table
            v-loading="dataListLoading"
            :data="contentDataList"
            border
            style="margin-top: 20px; width:100%;"
          >
            <el-table-column prop="display_order" label="排序" header-align="center" align="center" width="65">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.display_order"
                  @blur.stop="() => submitEdit(scope.row)"
                  @keyup.enter.stop.native="() => submitEdit(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="cover" label="封面" header-align="center" align="center">
              <template slot-scope="scope">
                <el-image :key="scope.row.id" style="width: 50%; height: 20%" :src="scope.row.cover" lazy>
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" header-align="center" align="center" />
            <el-table-column prop="desc" label="简介" header-align="center" align="center" />
            <el-table-column prop="type_desc" label="类型" header-align="center" align="center" />
            <el-table-column prop="try_reading_desc" label="是否可试看" header-align="center" align="center" />
            <el-table-column label="操作" fixed="right" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editContentHandle(scope.row.id)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteContentHandle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 20px; text-align: center;">
            <el-button type="primary" @click="previousHandle">上一步</el-button>
            <el-button type="primary" @click="contentNextHandle">下一步</el-button>
            <el-button type="primary" @click="basicComeback">返回</el-button>
          </el-row>
        </el-main>
      </el-container>
    </div>

    <div v-if="active === 2">
      <el-form ref="dataForm3" :model="dataForm3" :rules="dataRule3" label-width="auto" size="medium" label-suffix=":">
        <el-form-item label="售卖价格">
          <el-form-item prop="isfree">
            <el-col :span="4">
              <el-radio-group v-model="dataForm3.isfree">
                <el-radio :label="2">付费</el-radio>
                <el-radio :label="1">免费</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item v-if="dataForm3.isfree === 2" label="总价" prop="price" class="basic-info">
            <el-col :span="6">
              <el-input-number v-model="dataForm3.price" :min="0" :max="9999999" placeholder="请输入总价" /> 元
            </el-col>
          </el-form-item>
          <el-form-item v-if="dataForm3.isfree === 2" label="划线价" prop="origin_price" class="basic-info">
            <el-col :span="6">
              <el-input-number v-model="dataForm3.origin_price" :min="0" :max="9999999" placeholder="请输入划线价" /> 元
            </el-col>
          </el-form-item>
          <el-form-item v-if="dataForm3.isfree === 2" label="价格标识" prop="pricetype" class="basic-info">
            <el-radio-group v-model="dataForm3.pricetype">
              <el-radio v-for="item in dataForm.price_type" :key="item.key" :label="item.key">{{ item.val }}</el-radio>
            </el-radio-group>
            <span style="margin-left: 30px;color:#f40">提示：当设置价格标识后，前台将显示该价格标识</span>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="contentPreviousHandle">上一步</el-button>
          <el-button type="primary" @click="setPriceHandle">保 存</el-button>
          <el-button type="primary" @click="basicComeback">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <select-material-picture
      ref="SelectMaterialPicture"
      @refreshPictureDataList="getPictureList"
    />
    <chapter-category-add
      ref="ChapterCategoryAdd"
      :lesson-id="dataForm.id"
      @refreshDataList="getChapterDataList"
    />
    <content-add
      ref="ContentAdd"
      :lesson-id="dataForm.id"
      :chapter-id="dataForm.chapter_id"
      @refreshContentDataList="getContentDataList({ 'chapter_id': dataForm.chapter_id })"
    />
  </div>
</template>

<script>
import { getCourseFilters } from '@/api/courseselection'
import { getCourseList,
  courseManagementAdd,
  courseManagementUpdate
} from '@/api/coursemanagement'
import { getCategoryListTree } from '@/api/categorytree'
import { getChapterList } from '@/api/chapter'
import { getContentList, contentUpdate, contentDelete } from '@/api/content'
import { materialAdd } from '@/api/material'
import ChapterCategoryAdd from '@/components/ChapterCategoryAdd/index'
import ChapterCategoryTree from '@/components/ChapterCategoryTree/index'
import ContentAdd from '@/components/ContentAdd'
import SelectMaterialPicture from '@/components/SelectMaterialPicture/index'
import { getNewName, getTime, ueditorConfig } from '@/utils'
import { COURSE, TYPE_PICTURE, SCENES_THREE } from '@/utils/global-element'
import { ossUpload } from '@/api/oss'
import VueUeditorWrap from 'vue-ueditor-wrap'
import axios from 'axios'
export default {
  name: 'AddOrUpdateCourse',
  components: {
    SelectMaterialPicture,
    ContentAdd,
    ChapterCategoryAdd,
    ChapterCategoryTree,
    VueUeditorWrap
  },
  data() {
    return {
      active: parseInt(sessionStorage.getItem('active')), // 默认0,从步骤一开始
      token: '',
      config: ueditorConfig(),
      courseSelect: COURSE, // 课程分类
      dataListSelections: [], // 多选
      chapterDataList: [], // 章节列表
      contentDataList: [], // 内容列表
      pageIndex: 1,
      pageSize: 100,
      totalPage: 0,
      filesize: '', // 图片大小
      dataForm: {
        id: 0, // 课程id
        chapter_id: 0, // 章节ID
        code: getTime(), // 课程编号
        name: '', // 课程名称
        desc: '', // 课课描述
        detail: '', // 课程介绍
        tags: [], // 选中标签
        imageUrl: '', // 本地图片显示地址
        horizontalUrl: '', // 横版图片
        verticalUrl: '', // 竖版图
        fileList: [], // 封面
        study_days: 0, // 学习时间天数
        classification: '' // 选中课程分类
      },
      // 树形控件配置参数
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dataListLoading: false,
      loading: false,
      courseDataList: [],
      tags: [], // 获取标签列表
      courseCategoryList: [], // 获取课程分类
      dataRule: {
        code: [{ required: true, message: '课程编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '课程名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '课程描述不能为空', trigger: 'blur' }],
        classification: [{ required: true, message: '课程分类不能为空', trigger: 'blur' }],
        study_days: [{ required: true, message: '学习时间不能为空', trigger: 'blur' }]
      },
      dataForm3: {
        isfree: 1, // 是否免费 2: 收费 1: 免费
        pricetype: '',
        price_type: [], // 价格标识枚举
        price: 0, // 总价
        origin_price: 0 // 划线价对应
      },
      dataRule3: {
        isfree: [{ required: true, message: '请选择售卖价格', trigger: 'blur' }],
        price: [{ required: true, message: '请输入总价', trigger: 'blur' }],
        origin_price: [{ required: true, message: '请输入划线价', trigger: 'blur' }],
        pricetype: [{ required: true, message: '请选择价格标识', trigger: 'blur' }]
      },
      // 上传图片地址
      coverActionUrl: '',
      horizontalActionUrl: '',
      verticalActionUrl: '',
      fileList: [],
      horizontalList: [], // 横板图
      verticalList: [], // 竖版图
      coverCarryData: {
        success_action_status: '200'
      },
      coverValidTime: '',
      horizontalCarryData: {
        success_action_status: '200'
      },
      horizontalValidTime: '',
      verticalCarryData: {
        success_action_status: '200'
      },
      verticalValidTime: ''
    }
  },
  created() {
    this.$route.meta.title = '创建课程'
    // this.active = parseInt(sessionStorage.getItem('active'))
    // 获取课程标签
    this.getStatusTag()
    // 获取章节分类
    this.getCategoryList({ 'types': COURSE })
    // 获取token
    this.getToken()
    // 获取路由id
    if (this.$route.query.courseid) {
      this.$route.meta.title = '编辑课程'
      this.dataForm.id = parseInt(this.$route.query.courseid)
      this.getCourseList()
    }
  },
  methods: {
    // 选择
    handleChange(value) {
      this.dataForm.classification = value[value.length - 1]
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
    // 获取课程标签
    getStatusTag() {
      getCourseFilters(this.$service.adornData({
        'tag_type': 2,
        'show_price_type': 1
      })).then(response => {
        if (response && response.code === 0) {
          this.tags = response.data.tag.list
          this.dataForm.price_type = response.data.price_type
        } else {
          this.dataForm.tags = []
          this.dataForm.price_type = []
        }
      })
    },
    // 获取分类
    getCategoryList(types = {}) {
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        this.courseCategoryList = res && res.code === 0 ? res.data.list : []
      })
    },
    // 获取章节列表
    getChapterDataList() {
      getChapterList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'lesson_id': parseInt(this.dataForm.id)
      })).then(res => {
        this.chapterDataList = res && res.code === 0 ? res.data.list : []
        if (this.dataForm.id) {
          this.dataForm.chapter_id = this.chapterDataList[0].id
          this.getContentDataList({ 'chapter_id': this.chapterDataList[0].id }) // 获取章节内容
        }
      })
    },
    // 获取-内容-列表
    getContentDataList(chapterid = {}) {
      getContentList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'lesson_id': parseInt(this.dataForm.id),
        ...chapterid
      })).then(res => {
        this.contentDataList = res && res.code === 0 ? res.data.list : []
      })
    },
    // 切换章节
    switchCategory(item) {
      this.dataForm.chapter_id = item.id // 获取章节id
      // 获取章节内容
      this.getContentDataList({ 'chapter_id': this.dataForm.chapter_id })
    },
    // 内容 - 排序
    submitEdit(data) {
      contentUpdate(this.$service.adornData({
        'id': data.id,
        'lesson_id': this.dataForm.id,
        'chapter_id': this.dataForm.chapter_id,
        'type': data.type,
        'display_order': parseInt(data.display_order)
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '排序更新成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getContentDataList({ 'chapter_id': this.dataForm.chapter_id })
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
          this.token = response.data.token
          this.coverGetPolicy(response.data.token)
          this.horizontalGetPolicy(response.data.token)
          this.verticalGetPolicy(response.data.token)
        } else {
          this.$message.error('获取图片上传token失败')
        }
      })
    },
    // 获取素材图片
    getMaterialPicture(type) {
      sessionStorage.setItem('cover', type)
      this.$refs.SelectMaterialPicture.openDialog()
      this.$nextTick(() => {
        this.$refs.SelectMaterialPicture.getDataList()
        this.$refs.SelectMaterialPicture.getCategoryList()
      })
    },
    getPictureList(val) {
      switch (sessionStorage.getItem('cover')) {
        case 'cover':
          this.dataForm.imageUrl = val.entity_id
          break
        case 'horizontal':
          this.dataForm.horizontalUrl = val.entity_id
          break
        case 'vertical':
          this.dataForm.verticalUrl = val.entity_id
          break
      }
    },
    // 基本信息 - 保存
    basicInfoHandle() {
      if (this.dataForm.id) {
        this.updateCourseBasicInfo()
      } else {
        this.addCourseBasicInfo()
      }
    },
    // 基本信息 - 返回
    basicComeback() {
      this.$router.replace({ path: '/course/course-management' })
    },
    // 设置价格
    setPriceHandle() {
      if (parseInt(this.dataForm.isfree) === 1) {
        this.freeHandle()
      } else {
        this.chargeHandle()
      }
    },
    // 设置价格 - 收费
    chargeHandle() {
      this.$refs.dataForm3.validate((valid) => {
        if (valid) {
          courseManagementUpdate(this.$service.adornData({
            'id': parseInt(this.dataForm.id),
            'is_free': parseInt(this.dataForm3.isfree),
            'origin_price': parseInt(this.dataForm3.origin_price),
            'price': parseInt(this.dataForm3.price),
            'price_type_id': parseInt(this.dataForm3.pricetype),
            'scenes': SCENES_THREE
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '价格设置成功',
                type: 'success',
                duration: 1500
              })
              this.$router.replace({ path: '/course/course-management' })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 设置价格 - 免费
    freeHandle() {
      courseManagementUpdate(this.$service.adornData({
        'id': parseInt(this.dataForm.id),
        'is_free': parseInt(this.dataForm.isfree),
        'scenes': SCENES_THREE
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '价格设置成功',
            type: 'success',
            duration: 1500
          })
          this.$router.replace({ path: '/course/course-management' })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 设置价格 - 上一步
    setPricePrevious() {
      if (this.active > 0) {
        this.active = this.active - 1
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getContentDataList({ 'chapter_id': this.dataForm.chapter_id })
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getContentDataList({ 'chapter_id': this.dataForm.chapter_id })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 创建章节/编辑章节
    ChapterCategoryAddHandle() {
      this.$refs.ChapterCategoryAdd.openDialog()
    },
    // 创建内容/编辑内容
    contentAddHandle() {
      if (this.chapterDataList.length !== 0) {
        if (this.dataForm.chapter_id) {
          this.$refs.ContentAdd.openDialog()
          this.$nextTick(() => {
            this.$refs.ContentAdd.getMaterialType()
            this.$refs.ContentAdd.getToken()
          })
        } else {
          this.$message({
            message: '请先选择章节，再创建内容',
            type: 'warning',
            duration: 1500
          })
        }
      } else {
        this.$message({
          message: '请先创建章节',
          type: 'warning',
          duration: 1500
        })
      }
    },
    // 选择课程
    getChooseCourse() {
      this.$refs.CourseChooseChapter.openDialog()
      this.$nextTick(() => {
        this.$refs.CourseChooseChapter.getDataList()
        this.$refs.CourseChooseChapter.getStatusTag()
      })
    },
    // 创建课程第一步
    addCourseBasicInfo() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          courseManagementAdd(this.$service.adornData({
            'code': this.dataForm.code,
            'name': this.dataForm.name,
            'description': this.dataForm.desc,
            'full_txt_desc': this.dataForm.detail,
            'cover': this.dataForm.imageUrl,
            'tag_key': this.dataForm.tags,
            'category_key': this.dataForm.classification,
            'horizontal': this.dataForm.horizontalUrl,
            'vertical': this.dataForm.verticalUrl,
            'study_days': parseInt(this.dataForm.study_days),
            'scenes': 1
          })).then(res => {
            if (res && res.code === 0) {
              this.dataForm.id = res.data.id
              this.$message({
                message: '基础信息添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  sessionStorage.setItem('active', 1)
                  this.active = parseInt(sessionStorage.getItem('active'))
                  this.getChapterDataList() // 获取章节
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
    // 更新课程第一步
    updateCourseBasicInfo() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          courseManagementUpdate(this.$service.adornData({
            'id': parseInt(this.dataForm.id),
            'code': this.dataForm.code,
            'name': this.dataForm.name,
            'description': this.dataForm.desc,
            'full_txt_desc': this.dataForm.detail,
            'tag_key': this.dataForm.tags,
            'category_key': this.dataForm.classification,
            'cover': this.dataForm.imageUrl,
            'horizontal': this.dataForm.horizontalUrl,
            'vertical': this.dataForm.verticalUrl,
            'study_days': parseInt(this.dataForm.study_days),
            'scenes': 1
          })).then(res => {
            if (res && res.code === 0) {
              this.$message({
                message: '课程基础更新成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  sessionStorage.setItem('active', 1)
                  this.active = parseInt(sessionStorage.getItem('active'))
                  this.getChapterDataList() // 获取章节
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
    // 通过课程id，获取课程列表
    getCourseList() {
      getCourseList(this.$service.adornData({
        'id': this.dataForm.id
      })).then(res => {
        if (res && res.code === 0) {
          const courselist = res.data.list[0]
          this.dataForm.code = courselist.code
          this.dataForm.name = courselist.name
          this.dataForm.desc = courselist.desc
          this.dataForm.detail = courselist.full_txt_desc
          this.dataForm.tags = courselist.tags.map(item => item.key)
          this.dataForm.classification = courselist.categories[0].key
          this.dataForm.imageUrl = courselist.cover
          this.dataForm.horizontalUrl = courselist.horizontal
          this.dataForm.verticalUrl = courselist.vertical
          this.dataForm.study_days = courselist.study_days
          this.dataForm3.isfree = courselist.is_free
          this.dataForm3.origin_price = courselist.origin_price
          this.dataForm3.price = courselist.price
          this.dataForm3.pricetype = courselist.price_type_id
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 编辑内容
    editContentHandle(id) {
      this.$refs.ContentAdd.openDialog()
      this.$nextTick(() => {
        this.$refs.ContentAdd.init(id)
        this.$refs.ContentAdd.getMaterialType()
        this.$refs.ContentAdd.getMaterialContentList()
      })
    },
    // 删除 - 内容
    deleteContentHandle(data) {
      this.$confirm(`确定对[名称=${data.name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contentDelete(this.$service.adornData({
          'id': data.id,
          'lesson_id': this.dataForm.id,
          'chapter_id': this.dataForm.chapter_id
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getContentDataList({ 'chapter_id': this.dataForm.chapter_id })
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    },
    // 设置内容 - 上一步
    previousHandle() {
      if (this.active > 0) {
        sessionStorage.setItem('active', 0)
        this.active = parseInt(sessionStorage.getItem('active'))
      }
    },
    // 设置价格 - 上一步
    contentPreviousHandle() {
      if (this.active > 0) {
        sessionStorage.setItem('active', 1)
        this.active = parseInt(sessionStorage.getItem('active'))
      }
    },
    // 设置内容 - 下一步
    contentNextHandle() {
      sessionStorage.setItem('active', 2)
      this.active = parseInt(sessionStorage.getItem('active'))
    },
    handleCoverSuccess(res, file) {
      this.fileList = []
    },
    handleHorizontalSuccess(res, file) {
      this.horizontalList = []
    },
    handleVerticalSuccess(res, file) {
      this.verticalList = []
    },
    // 获取封面签名
    coverGetPolicy(token) {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/get-web-upload-sign' + '?type=image&token=' + token)
          .then(res => {
            this.coverActionUrl = res.data.result.host
            this.coverCarryData.OSSAccessKeyId = res.data.result.accessid
            this.coverCarryData.policy = res.data.result.policy
            this.coverCarryData.Signature = res.data.result.signature
            this.coverCarryData.key = res.data.result.dir
            this.coverValidTime = res.data.result.expire
            resolve(res.data)
          }).catch(() => {
            reject()
          })
      })
    },
    // 获取横版签名
    horizontalGetPolicy(token) {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/get-web-upload-sign' + '?type=image&token=' + token)
          .then(res => {
            this.horizontalActionUrl = res.data.result.host
            this.horizontalCarryData.OSSAccessKeyId = res.data.result.accessid
            this.horizontalCarryData.policy = res.data.result.policy
            this.horizontalCarryData.Signature = res.data.result.signature
            this.horizontalCarryData.key = res.data.result.dir
            this.horizontalValidTime = res.data.result.expire
            resolve(res.data)
          }).catch(() => {
            reject()
          })
      })
    },
    // 获取竖版签名
    verticalGetPolicy(token) {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
          this.url = process.env.VUE_APP_UPLOADOSSURL
        } else {
          this.url = `${process.env.VUE_APP_UPLOADOSSURL}`
        }
        axios.get(this.url + 'v1/coss/file/get-web-upload-sign' + '?type=image&token=' + token)
          .then(res => {
            this.verticalActionUrl = res.data.result.host
            this.verticalCarryData.OSSAccessKeyId = res.data.result.accessid
            this.verticalCarryData.policy = res.data.result.policy
            this.verticalCarryData.Signature = res.data.result.signature
            this.verticalCarryData.key = res.data.result.dir
            this.verticalValidTime = res.data.result.expire
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
      this.filesize = file.size

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      this.fileList = [...this.fileList, file]
      this.handleUpload(file.name)
      return true
    },
    // 手动上传图片
    handleUpload(fileName) {
      this.loading = true // 加载loading
      const coverkey = `${this.coverCarryData.key}${getNewName(fileName)}` // 保存图片名
      const formData = new FormData() // form表单
      const timestamp = `${new Date().getTime()}` // 时间戳
      formData.append('name', fileName)
      for (const key in this.coverCarryData) {
        if (key !== 'key') {
          formData.append(key, this.coverCarryData[key])
        }
      }
      if (parseInt(timestamp.substr(0, 10)) >= this.coverValidTime) {
        // 判断签名是否过期
        this.getToken().then(() => {
          // 重新请求签名
          this.coverGetPolicy()
          const coverkey = `${this.coverCarryData.key}${getNewName(fileName)}`
          formData.append('key', coverkey)
          this.uploadingImg(formData, coverkey)
        })
      } else {
        formData.append('key', coverkey)
        this.uploadingImg(formData, coverkey)
      }
    },
    // 上传图片到阿里云
    uploadingImg(formData, coverkey) {
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.coverActionUrl}`, formData).then(res => {
        if (res.status === 200) {
          if (process.env.NODE_ENV === 'production') {
            this.dataForm.imageUrl = `${process.env.VUE_APP_IMAGEURL}` + '/' + coverkey
          } else {
            this.dataForm.imageUrl = this.coverActionUrl + '/' + coverkey
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
    },
    // 横版图上传
    horizontalBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      this.filesize = file.size

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      this.horizontalList = [...this.horizontalList, file]
      this.horizontalHandleUpload(file.name)
      return false
    },
    // 手动上传图片
    horizontalHandleUpload(fileName) {
      this.loading = true // 加载loading
      const horizontalkey = `${this.horizontalCarryData.key}${getNewName(fileName)}` // 保存图片名
      const formData = new FormData() // form表单
      const timestamp = `${new Date().getTime()}` // 时间戳
      formData.append('name', fileName)
      for (const key in this.horizontalCarryData) {
        if (key !== 'key') {
          formData.append(key, this.horizontalCarryData[key])
        }
      }
      if (parseInt(timestamp.substr(0, 10)) >= this.horizontalValidTime) {
        // 判断签名是否过期
        this.getToken().then(() => {
          // 重新请求签名
          const horizontalkey = `${this.horizontalCarryData.key}${getNewName(fileName)}`
          formData.append('key', horizontalkey)
          this.uploadingImg(formData, horizontalkey)
        })
      } else {
        formData.append('key', horizontalkey)
        this.horizontalUploadingImg(formData, horizontalkey)
      }
    },
    // 上传横版图到阿里云
    horizontalUploadingImg(formData, horizontalkey) {
      this.horizontalList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.horizontalActionUrl}`, formData).then(res => {
        if (res.status === 200) {
          if (process.env.NODE_ENV === 'production') {
            this.dataForm.horizontalUrl = `${process.env.VUE_APP_IMAGEURL}` + '/' + horizontalkey
          } else {
            this.dataForm.horizontalUrl = this.horizontalActionUrl + '/' + horizontalkey
          }
          this.$message({
            message: '图片上传成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.uploadMaterialLibrary({ 'entity_id': this.dataForm.horizontalUrl })
            }
          })
          this.horizontalList = []
          this.loading = false
        } else {
          this.$message.error('图片上传失败')
        }
      })
    },
    // 竖版图上传
    verticalBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      this.filesize = file.size

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      this.verticalList = [...this.verticalList, file]
      this.verticalHandleUpload(file.name)
      return false
    },
    // 竖版图上传
    verticalHandleUpload(fileName) {
      this.loading = true // 加载loading
      const verticalkey = `${this.verticalCarryData.key}${getNewName(fileName)}` // 保存图片名
      const formData = new FormData() // form表单
      const timestamp = `${new Date().getTime()}` // 时间戳
      formData.append('name', fileName)
      for (const key in this.verticalCarryData) {
        if (key !== 'key') {
          formData.append(key, this.verticalCarryData[key])
        }
      }
      if (parseInt(timestamp.substr(0, 10)) >= this.verticalValidTime) {
        // 判断签名是否过期
        this.getToken().then(() => {
          // 重新请求签名
          const verticalkey = `${this.verticalCarryData.key}${getNewName(fileName)}`
          formData.append('key', verticalkey)
          this.uploadingImg(formData, verticalkey)
        })
      } else {
        formData.append('key', verticalkey)
        this.verticalUploadingImg(formData, verticalkey)
      }
    },
    // 上传竖版图到阿里云
    verticalUploadingImg(formData, verticalkey) {
      this.verticalList.forEach(file => {
        formData.append('file', file)
      })
      axios.post(`${this.verticalActionUrl}`, formData).then(res => {
        if (res.status === 200) {
          if (process.env.NODE_ENV === 'production') {
            this.dataForm.verticalUrl = `${process.env.VUE_APP_IMAGEURL}` + '/' + verticalkey
          } else {
            this.dataForm.verticalUrl = this.verticalActionUrl + '/' + verticalkey
          }
          this.$message({
            message: '图片上传成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.uploadMaterialLibrary({ 'entity_id': this.dataForm.verticalUrl })
            }
          })
          this.verticalList = []
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
    font-size: 20px;
    line-height: 46px;
  }
  &-button {
    margin: 10px 0px;
  }
}
</style>
