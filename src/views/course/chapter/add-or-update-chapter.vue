<template>
  <div class="dashboard-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="基本信息" icon="el-icon-upload" />
      <el-step title="设置小节" icon="el-icon-circle-plus" />
    </el-steps>
    <div v-if="active === 0">
      <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="auto" size="medium" label-suffix=":">
        <el-form-item label="章节编号" prop="code">
          <el-col :span="8">
            <el-input
              v-model="dataForm.code"
              placeholder="请输入章节编号"
              maxlength="35"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="章节名称" prop="name">
          <el-col :span="8">
            <el-input v-model="dataForm.name" placeholder="请输入章节名称" maxlength="35" show-word-limit />
          </el-col>
        </el-form-item>
        <el-form-item label="备注信息" prop="desc">
          <el-col :span="8">
            <el-input
              v-model="dataForm.desc"
              type="textarea"
              placeholder="请输入章节备注信息"
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
              :options="chaptertags"
              :props="{ multiple: true,checkStrictly: true,value: 'key', label: 'val' }"
              placeholder="请选择章节标签"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="章节分类" prop="classification" class="el-form-item--ys">
          <el-cascader
            v-model="dataForm.classification"
            :options="chapterCategoryList"
            :props="{ checkStrictly: true, value: 'key', label: 'val' }"
            placeholder="请选择章节分类"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="basicInfoHandle">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="active === 1">
      <el-form label-width="auto" size="medium" label-suffix=":">
        <el-form-item>
          <el-button type="danger" :disabled="dataListSelections.length <= 0" @click="chapterDeleteHandle">批量删除</el-button>
          <el-button type="primary" @click="getChooseChapter">+添加内容</el-button>
          <span style="color:#f40;font-size:14px;margin-left:10px">可通过设置数字调整排序，默认按照升序排列</span>
        </el-form-item>
        <el-table
          v-loading="dataListLoading"
          :data="contentDataList"
          border
          height="350"
          style="width: 100%"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50" />
          <el-table-column prop="display_order" label="排序" header-align="center" align="center" width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.display_order" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="内容名称" header-align="center" align="center" />
          <el-table-column prop="material_type_desc" label="小节类型" header-align="center" align="center" />
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
        <el-form-item style="margin-top:15px">
          <el-button type="primary" @click="dataFormSubmit">保 存</el-button>
          <el-button @click="cancelHandle">取 消</el-button>
        </el-form-item>
      </el-form>
      <!-- 选择内容 -->
      <choose-chapter
        ref="ChooseChapter"
        :chapter-id="dataForm.id"
        @refreshDataList="getConnectedContentList"
      />
    </div>
  </div>
</template>

<script>
import ChooseChapter from './choose-chapter'
import { getCategoryListTree } from '@/api/categorytree'
import { DATETIME } from '@/utils/global-element'
import { getTagTree } from '@/api/label'
import { getChapterList, chapterAdd, chapterUpdate, chapterSectionSelected, chapterSetOrder, chapterSectionDelete } from '@/api/chapter'
import { TAG_CHAPTER, CHAPTER, SCENES_ONE } from '@/utils/global-element'
export default {
  name: 'AddOrUpdateChapter',
  components: {
    ChooseChapter
  },
  data() {
    return {
      active: 0,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      checked: true,
      dataListSelections: [], // 批量删除
      status: '', // 章节状态
      menuSelect: CHAPTER,
      dataForm: {
        id: '', // 章节id
        code: DATETIME, // 章节编号
        name: '', // 章节名称
        desc: '', // 章节描述
        tags: [], // 选中标签
        classification: [] // 选中章节分类
      },
      dataListLoading: false,
      contentDataList: [],
      chapterCategoryList: [], // 章节分类
      chaptertags: [], // 章节标签
      dataRule: {
        code: [{ required: true, message: '章节编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '章节名称不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '备注信息不能为空', trigger: 'blur' }],
        tags: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
        classification: [{ required: true, message: '章节分类不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 获取标签
    this.getChapterTags()
    // 获取章节分类
    this.getCategoryList({ 'types': CHAPTER })
    // 获取路由id
    if (this.$route.query.chapterid) {
      this.dataForm.id = this.$route.query.chapterid
      this.getChapterContentList()
    }
  },
  methods: {
    // 基本信息 下一步
    basicInfoHandle() {
      if (this.dataForm.id) {
        this.updateChapterHandle()
      } else {
        this.createChapterHandle()
      }
    },
    // 获取分类
    getCategoryList(types = {}) {
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        this.chapterCategoryList = res && res.code === 0 ? res.data.list : []
      })
    },
    // 获取章节标签
    getChapterTags() {
      getTagTree(this.$service.adornData({
        'types': TAG_CHAPTER
      })).then(res => {
        this.chaptertags = res && res.code === 0 ? res.data.list : []
      })
    },
    // 创建章节
    createChapterHandle() {
      chapterAdd(this.$service.adornData({
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'desc': this.dataForm.desc,
        'tag_key': this.dataForm.chapterlist,
        'category_key': this.dataForm.classification[0],
        'scenes': SCENES_ONE
      })).then(res => {
        if (res && res.code === 0) {
          this.dataForm.id = res.data.id
          this.$message({
            message: '章节添加成功',
            type: 'success',
            duration: 1500
          })
          this.getConnectedContentList()
          if (this.active++ > 1) this.active = 0
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 更新章节内容
    updateChapterHandle() {
      console.log('678', this.dataForm.tags, '分类==', this.dataForm.classification)
      const tag = []
      this.dataForm.tags.forEach(item => tag.push(item[0]))
      chapterUpdate(this.$service.adornData({
        'id': this.dataForm.id,
        'code': this.dataForm.code,
        'name': this.dataForm.name,
        'desc': this.dataForm.desc,
        'tag_key': tag,
        'category_key': this.dataForm.classification[0],
        'status': this.status
      })).then(res => {
        if (res && res.code === 0) {
          this.$message({
            message: '章节更新成功',
            type: 'success',
            duration: 1500
          })
          this.getConnectedContentList()
          if (this.active++ > 1) this.active = 0
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 通过章节id，获取章节内容
    getChapterContentList() {
      getChapterList(this.$service.adornData({
        'id': this.dataForm.id
      })).then(res => {
        if (res && res.code === 0) {
          const contentlist = res.data.list[0]
          this.dataForm.code = contentlist.code
          this.dataForm.name = contentlist.name
          this.dataForm.desc = contentlist.desc
          this.dataForm.tags = contentlist.tags
          this.dataForm.classification = contentlist.categories
          this.status = contentlist.status
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 设置小节 - 获取已关联内容列表
    getConnectedContentList() {
      chapterSectionSelected(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'chapter_id': this.dataForm.id
      })).then(res => {
        this.contentDataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
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
    getChooseChapter() {
      this.$refs.ChooseChapter.openDialog()
    },
    // 取消
    cancelHandle() {
      this.$router.replace({ path: '/course/course-chapter' })
    },
    // 是否可试看
    readingHandle(val) {
      console.log('是否可试看', val)
    },
    // 保存
    dataFormSubmit() {
      if (this.dataListSelections) {
        const sectionsData = []
        this.dataListSelections.forEach(item => {
          const sectionsList = {
            id: item.pk_id,
            display_order: parseInt(item.display_order),
            try_reading: parseInt(item.try_reading)
          }
          sectionsData.push(sectionsList)
        })
        console.log('保存章节==', this.$service.adornData({
          'chapter_id': this.dataForm.id,
          'items': sectionsData
        }))
        chapterSetOrder(this.$service.adornData({
          'chapter_id': this.dataForm.id,
          'items': sectionsData
        })).then(res => {
          if (res && res.code === 0) {
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$router.replace({ path: '/course/course-chapter' })
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.warning('请选择小节')
      }
    },
    // 章节关联小节 - 删除
    chapterDeleteHandle(id) {
      var chapterIds = id ? [id] : this.dataListSelections.map(item => {
        return item.pk_id
      })
      this.$confirm(`确定对小节进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapterSectionDelete(this.$service.adornData({
          'chapter_ids': chapterIds
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
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
</style>
