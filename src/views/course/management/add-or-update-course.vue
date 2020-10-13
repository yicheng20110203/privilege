<template>
  <div class="dashboard-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="基本信息" icon="el-icon-upload" />
      <el-step title="添加课程内容" icon="el-icon-circle-plus" />
      <el-step title="设置价格" icon="el-icon-setting" />
    </el-steps>
    <div v-if="active === 0">
      <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="auto" size="medium" label-suffix=":">
        <el-form-item label="课程编号" prop="code">
          <el-col :span="8">
            <el-input
              v-model="dataForm.code"
              placeholder="请输入课程编号"
              maxlength="35"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-col :span="8">
            <el-input v-model="dataForm.name" placeholder="请输入课程名称" maxlength="35" show-word-limit />
          </el-col>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-col :span="8">
            <el-input
              v-model="dataForm.desc"
              type="textarea"
              placeholder="请输入课程简介"
              :autosize="{ minRows: 2, maxRows: 4}"
              maxlength="200"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <div class="block">
            <el-cascader
              v-model="dataForm.tags"
              :options="tags"
              :props="{ multiple: true,checkStrictly: true,value: 'key', label: 'val' }"
              placeholder="请课程标签"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="课程分类" prop="classification" class="el-form-item--ys">
          <el-cascader
            v-model="dataForm.classification"
            :options="courseCategoryList"
            :props="{ checkStrictly: true, value: 'key', label: 'val' }"
            placeholder="请课程分类"
            clearable
          />
        </el-form-item>
        <el-row :gutter="1">
          <el-col :span="8">
            <el-form-item label="上传封面" prop="image">
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
              <p class="uploadfont">文件支持类型 jpg/jpeg/png</p>
              <p class="uploadfont">文件大小&lt;2M,建议传274x274</p>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上传横版图" prop="horizontalUrl">
              <el-upload
                v-loading="loading"
                class="avatar-uploader"
                action="actionUrl"
                accept=".png,.jpg,.jpeg"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <img v-if="dataForm.horizontalUrl" :src="dataForm.horizontalUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <p class="uploadfont">文件支持类型 jpg/jpeg/png</p>
              <p class="uploadfont">文件大小&lt;2M,建议传274x274</p>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="上传竖版图" prop="verticalUrl">
              <el-upload
                v-loading="loading"
                class="avatar-uploader"
                action="actionUrl"
                accept=".png,.jpg,.jpeg"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <img v-if="dataForm.verticalUrl" :src="dataForm.verticalUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <p class="uploadfont">文件支持类型 jpg/jpeg/png</p>
              <p class="uploadfont">文件大小&lt;2M,建议传274x274</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="购买后可学习时间" prop="study_days">
          <el-row :gutter="2">
            <el-col :span="3">
              <el-input v-model="dataForm.study_days" placeholder="学习时间">
                <template slot="append">天</template>
              </el-input>
            </el-col>
            <el-col>
              <span style="color:#f40;">注意：0 表示永久有效。</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="basicInfoHandle">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="active === 1">
      <el-form label-width="auto" size="medium" label-suffix=":">
        <el-form-item>
          <el-button type="primary" @click="getChooseCourse">+选择章节</el-button>
          <span style="color:#f40;font-size:14px;margin-left:10px">可通过设置数字调整排序，默认按照升序排列</span>
        </el-form-item>
        <el-table
          v-loading="dataListLoading"
          :data="courseDataList"
          border
          height="350"
          style="width: 100%"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50" />
          <el-table-column prop="display_order" label="排序" header-align="center" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.display_order" />
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编号" header-align="center" align="center" />
          <el-table-column prop="name" label="名称" header-align="center" align="center" />
          <el-table-column prop="chapter_type_desc" label="课程类型" header-align="center" align="center" />
          <el-table-column prop="categories" label="分类" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.categories" :key="item.key">{{ item.val }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="try_reading" label="是否可试看" header-align="center" align="center">
            <template slot-scope="scope">
              <el-radio v-model="scope.row.try_reading" :label="1">是</el-radio>
              <el-radio v-model="scope.row.try_reading" :label="2">否</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="chapterDeleteHandle(scope.row.pk_id)">删除</el-button>
            </template>
          </el-table-column>
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
        <el-form-item style="margin-top: 15px">
          <el-button type="warning" @click="selectContentSaveHandle">保存</el-button>
          <el-button type="primary" @click="selectContentNext">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="active === 2">
      <el-form ref="dataForm3" :model="dataForm" label-width="auto" size="medium" label-suffix=":">
        <el-form-item label="售卖价格">
          <el-form-item prop="isfree">
            <el-col :span="4">
              <el-radio v-model="dataForm3.isfree" label="2">付费</el-radio>
            </el-col>
          </el-form-item>
          <el-form-item label="总价" prop="price">
            <el-col :span="6">
              <el-input v-model="dataForm3.price" placeholder="最大支持两位小数">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="划线价" prop="origin_price">
            <el-col :span="6">
              <el-input v-model="dataForm3.origin_price" placeholder="最大支持两位小数">
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="价格标识">
            <el-radio-group v-model="dataForm3.pricetype">
              <el-radio v-for="item in dataForm.price_type" :key="item.key" :label="item.key">{{ item.val }}</el-radio>
            </el-radio-group>
            <span style="margin-left: 30px;color:#f40">提示：当设置价格标识后，前台将显示该价格标识</span>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="isfree">
          <el-radio v-model="dataForm3.isfree" label="1">免费</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setPriceHandle">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 选择-课程 -->
    <course-choose-chapter
      ref="CourseChooseChapter"
      :course-id="dataForm.id"
      @refreshDataList="getConnectedContentList"
    />
  </div>
</template>

<script>
import { getCourseFilters } from '@/api/courseselection'
import { getCourseList,
  courseManagementAdd,
  courseManagementUpdate,
  courseChapterSelected,
  courseChapterDelete,
  courseChapterSetOrder
} from '@/api/coursemanagement'
import { getCategoryListTree } from '@/api/categorytree'
import CourseChooseChapter from './course-choose-chapter'
import { getNewName } from '@/utils'
import { DATETIME, COURSE, SCENES_THREE } from '@/utils/global-element'
import { ossUpload } from '@/api/oss'
import axios from 'axios'
export default {
  name: 'AddOrUpdateCourse',
  components: {
    CourseChooseChapter
  },
  data() {
    return {
      active: 0,
      courseSelect: COURSE, // 课程分类
      dataListSelections: [], // 多选
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataForm: {
        id: '', // 课程id
        code: DATETIME, // 课程编号
        name: '', // 课包名称
        desc: '', // 课包描述
        tags: [], // 选中标签
        imageUrl: '', // 本地图片显示地址
        horizontalUrl: '', // 横版图片
        verticalUrl: '', // 竖版图
        fileList: [], // 封面
        study_days: 0, // 学习时间天数
        classification: [] // 选中课程分类
      },
      dataForm3: {
        isfree: '1', // 是否免费 1: 收费 2: 免费
        pricetype: '', // 选中价格标识
        price_type: [], // 价格标识枚举
        price: '', // 总价
        origin_price: '' // 划线价对应
      },
      dataListLoading: false,
      loading: false,
      courseDataList: [],
      tags: [], // 获取标签列表
      courseCategoryList: [], // 获取课程分类
      dataRule: {
        code: [{ required: true, message: '课程编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '课程名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '课程名称不能为空', trigger: 'blur' }]
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
    // 获取课程标签
    this.getStatusTag()
    // 获取章节分类
    this.getCategoryList({ 'types': COURSE })
    // 获取token
    this.getToken()
    // 获取路由id
    if (this.$route.query.courseid) {
      this.dataForm.id = this.$route.query.courseid
      this.getCourseList()
    }
  },
  methods: {
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
    // 基本信息 下一步
    basicInfoHandle() {
      if (this.dataForm.id) {
        this.updateCourseBasicInfo()
      } else {
        this.addCourseBasicInfo()
      }
    },
    // 课程 - 批量删除课与章节关系
    chapterDeleteHandle(id) {
      this.$confirm(`确定对章节[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseChapterDelete(this.$service.adornData({
          'ids': [id]
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '课程删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getConnectedContentList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    },
    // 选择内容 - 保存
    selectContentSaveHandle() {
      if (this.dataListSelections) {
        const chapterData = []
        this.dataListSelections.forEach(item => {
          const chapterList = {
            id: item.pk_id,
            display_order: parseInt(item.display_order)
          }
          chapterData.push(chapterList)
        })
        console.log('参数=', this.$service.adornData({
          'lesson_id': this.dataForm.id,
          'items': chapterData
        }))
        courseChapterSetOrder(this.$service.adornData({
          'lesson_id': this.dataForm.id,
          'items': chapterData
        })).then(res => {
          if (res && res.code === 0) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1500
            })
            if (this.active++ > 2) this.active = 0
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.warning('请选择课程')
      }
    },
    // 选择内容后直接 - 下一步
    selectContentNext() {
      if (this.active++ > 2) this.active = 0
    },
    // 设置价格
    setPriceHandle() {
      if (parseInt(this.dataForm3.isfree) === 1) {
        this.freeHandle()
      } else {
        this.chargeHandle()
      }
    },
    // 设置价格 - 收费
    chargeHandle() {
      console.log('收费=', this.$service.adornData({
        'id': this.dataForm.id,
        'is_free': parseInt(this.dataForm3.isfree),
        'origin_price': parseInt(this.dataForm3.origin_price),
        'price': parseInt(this.dataForm3.price),
        'price_type_id': parseInt(this.dataForm3.pricetype),
        'scenes': SCENES_THREE
      }))
      courseManagementUpdate(this.$service.adornData({
        'id': this.dataForm.id,
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
    },
    // 设置价格 - 免费
    freeHandle() {
      console.log('免费==', this.$service.adornData({
        'id': this.dataForm.id,
        'is_free': parseInt(this.dataForm3.isfree),
        'scenes': SCENES_THREE
      }))
      courseManagementUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'is_free': parseInt(this.dataForm3.isfree),
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
      this.getConnectedContentList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getConnectedContentList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 选择课程
    getChooseCourse() {
      this.$refs.CourseChooseChapter.openDialog()
    },
    // 创建课程第一步
    addCourseBasicInfo() {
      const tag = []
      this.dataForm.tags.forEach(item => tag.push(item[0]))
      courseManagementAdd(this.$service.adornData({
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'description': this.dataForm.desc,
        'cover': this.dataForm.imageUrl,
        'tag_key': tag,
        'category_key': this.dataForm.classification[0],
        'horizontal': this.dataForm.horizontalUrl,
        'vertical': this.dataForm.verticalUrl,
        'study_days': parseInt(this.dataForm.study_days),
        'scenes': 1
      })).then(res => {
        if (res && res.code === 0) {
          this.dataForm.id = res.data.id
          this.$message({
            message: '基本信息添加成功',
            type: 'success',
            duration: 1500
          })
          if (this.active++ > 2) this.active = 0
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 更新课程第一步
    updateCourseBasicInfo() {
      const tag = []
      this.dataForm.tags.forEach(item => tag.push(item[0]))
      courseManagementUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'description': this.dataForm.desc,
        'tag_key': tag,
        'category_key': this.dataForm.classification[0],
        'cover': this.dataForm.imageUrl,
        'horizontal': this.dataForm.horizontalUrl,
        'vertical': this.dataForm.verticalUrl,
        'study_days': parseInt(this.dataForm.study_days),
        'scenes': 1
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '课程信息更新成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getConnectedContentList()
              if (this.active++ > 1) this.active = 0
            }
          })
        } else {
          this.$message.error(res.msg)
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
          this.dataForm.tag_list = courselist.tags
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
    // 设置课程章节 - 获取已关联内容列表
    getConnectedContentList() {
      courseChapterSelected(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'lesson_id': this.dataForm.id
      })).then(res => {
        this.courseDataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
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
    font-size: 20px;
    line-height: 46px;
  }
  &-button {
    margin: 10px 0px;
  }
}
.basic-info {
  margin-top: 5px;
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
