<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="视频" name="video">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList({ 'type': materialvideoType })">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入视频名称" clearable />
          </el-form-item>
          <el-button type="primary" @click="getDataList({ 'type': materialvideoType })">查询</el-button>
          <el-button type="warning" @click="uploadVideoHandle">+上传视频</el-button>
          <el-container>
            <el-aside width="240px">
              <p>视频分类</p>
              <div class="category">
                <div class="category-item">
                  <el-button type="text" @click="getDataList({ 'type': materialvideoType })">全部分类</el-button>
                </div>
                <div class="category-item category-item-icon">
                  <el-button
                    type="text"
                    size="medium"
                    icon="el-icon-circle-plus-outline"
                    @click="categoryAddHandle"
                  />
                </div>
              </div>
              <tissue-tree
                v-if="videoCategoryList.length"
                :data-tree="videoCategoryList"
                :default-props="defaultProps"
                :category-type="materialCategoryType"
                @nodeClick="switchCategory"
              />
            </el-aside>
            <el-main>
              <el-table v-loading="dataListLoading" :data="dataList" border height="450" style="width:100%">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="name" label="名称" header-align="center" align="center" />
                <el-table-column prop="entity_id" label="视频" header-align="center" align="center" />
                <el-table-column prop="size_desc" label="视频大小" header-align="center" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.size_desc|fileSizeFilter(scope.row.size_desc) }}
                  </template>
                </el-table-column>
                <el-table-column prop="create_time_desc" label="上传时间" header-align="center" align="center" />
                <el-table-column prop="trans_code_status" label="状态" header-align="center" align="center">
                  <template slot-scope="scope">
                    <label v-if="scope.row.trans_code_status === 1">转码中</label>
                    <label v-if="scope.row.trans_code_status === 2">转码完成</label>
                    <label v-if="scope.row.trans_code_status === 3">转码失败</label>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.trans_code_status === 1">
                      <el-button type="text" size="small" @click="editVideoHandle(scope.row)">编辑</el-button>
                      <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                    </div>
                    <div v-if="scope.row.trans_code_status === 2">
                      <el-button type="text" size="small" @click="previewVideoHandle(scope.row)">预览</el-button>
                      <el-button type="text" size="small" @click="editVideoHandle(scope.row)">编辑</el-button>
                      <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                    </div>
                    <div v-if="scope.row.trans_code_status === 3">
                      <el-button type="text" size="small" @click="editVideoHandle(scope.row)">编辑</el-button>
                      <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
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
            </el-main>
          </el-container>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="音频" name="audio">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList({ 'type': materialaudioType })">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入音频名称" clearable />
          </el-form-item>
          <el-button type="primary" @click="getDataList({ 'type': materialaudioType })">查询</el-button>
          <el-button type="warning" @click="uploadAudioHandle">+上传音频</el-button>
          <el-container>
            <el-aside width="240px">
              <p>音频分类</p>
              <div class="category">
                <div class="category-item">
                  <el-button type="text" @click="getDataList({ 'type': materialaudioType })">全部分类</el-button>
                </div>
                <div class="category-item category-item-icon">
                  <el-button
                    type="text"
                    size="medium"
                    icon="el-icon-circle-plus-outline"
                    @click="categoryAddHandle"
                  />
                </div>
              </div>
              <tissue-tree
                v-if="audioCategoryList.length"
                :data-tree="audioCategoryList"
                :default-props="defaultProps"
                :category-type="materialCategoryType"
                @nodeClick="switchCategory"
              />
            </el-aside>
            <el-main>
              <el-table v-loading="dataListLoading" :data="audioDataList" border height="450" style="width:100%">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="name" label="名称" header-align="center" align="center" />
                <el-table-column prop="entity_id" label="音频" header-align="center" align="center" />
                <el-table-column prop="size_desc" label="音频大小" header-align="center" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.size_desc|fileSizeFilter(scope.row.size_desc) }}
                  </template>
                </el-table-column>
                <el-table-column prop="create_time_desc" label="上传时间" header-align="center" align="center" />
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="previewAudioHandle(scope.row)">预览</el-button>
                    <el-button type="text" size="small" @click="editAudioHandle(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
            </el-main>
          </el-container>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="文章" name="article">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList({ 'type': materialarticleType })">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入文章名称" clearable />
          </el-form-item>
          <el-button type="primary" @click="getDataList({ 'type': materialarticleType })">查询</el-button>
          <el-button type="warning" @click="uploadArticleHandle">+创建文章</el-button>
          <el-container>
            <el-aside width="240px">
              <p>文章分类</p>
              <div class="category">
                <div class="category-item">
                  <el-button type="text" @click="getDataList({ 'type': materialarticleType })">全部分类</el-button>
                </div>
                <div class="category-item category-item-icon">
                  <el-button
                    type="text"
                    size="medium"
                    icon="el-icon-circle-plus-outline"
                    @click="categoryAddHandle"
                  />
                </div>
              </div>
              <tissue-tree
                v-if="articleCategoryList.length"
                :data-tree="articleCategoryList"
                :default-props="defaultProps"
                :category-type="materialCategoryType"
                @nodeClick="switchCategory"
              />
            </el-aside>
            <el-main>
              <el-table v-loading="dataListLoading" :data="articleDataList" border height="450" style="width:100%">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="name" label="名称" header-align="center" align="center" />
                <el-table-column prop="create_time_desc" label="上传时间" header-align="center" align="center" />
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="previewArticleHandle(scope.row)">预览</el-button>
                    <el-button type="text" size="small" @click="editArticleHandle(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
            </el-main>
          </el-container>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="图片" name="image">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList({ 'type': materialpictureType })">
          <el-form-item label="名称:" prop="name">
            <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入图片名称" clearable />
          </el-form-item>
          <el-button type="primary" @click="getDataList({ 'type': materialpictureType })">查询</el-button>
          <el-button type="warning" @click="uploadPictureHandle">+上传图片</el-button>
          <el-container>
            <el-aside width="240px">
              <p>图片分类</p>
              <div class="category">
                <div class="category-item">
                  <el-button type="text" @click="getDataList({ 'type': materialpictureType })">全部分类</el-button>
                </div>
                <div class="category-item category-item-icon">
                  <el-button
                    type="text"
                    size="medium"
                    icon="el-icon-circle-plus-outline"
                    @click="categoryAddHandle"
                  />
                </div>
              </div>
              <tissue-tree
                v-if="pictureCategoryList.length"
                :data-tree="pictureCategoryList"
                :default-props="defaultProps"
                :category-type="materialCategoryType"
                @nodeClick="switchCategory"
              />
            </el-aside>
            <el-main>
              <el-table v-loading="dataListLoading" :data="pictureDataList" border height="450" style="width:100%">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="name" label="名称" header-align="center" align="center" />
                <el-table-column prop="entity_id" label="图片" header-align="center" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.entity_id">
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.entity_id"
                        lazy
                      />
                    </div>
                    <div v-else>
                      <el-image>
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="size_desc" label="图片大小" header-align="center" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.size_desc|fileSizeFilter(scope.row.size_desc) }}
                  </template>
                </el-table-column>
                <el-table-column prop="create_time_desc" label="上传时间" header-align="center" align="center" />
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="previewPictureHandle(scope.row)">预览</el-button>
                    <el-button type="text" size="small" @click="editPictureHandle(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
            </el-main>
          </el-container>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <category-add
      ref="categoryAdd"
      :category-type="materialCategoryType"
      @refreshCategoryDataList="getCategoryList({ 'types': menuSelect })"
    />
    <video-add
      ref="videoAdd"
      :menu-category="categoryList"
      :submit-type="materialType"
      :upload-type="activeName"
      @refreshVideoDataList="getDataList({ 'type': materialType })"
    />
    <article-add-or-update
      ref="ArticleAddOrUpdate"
      :menu-category="categoryList"
      :submit-type="materialType"
      @refreshArticleDataList="getDataList({ 'type': materialType })"
    />
    <material-edit
      ref="MaterialEdit"
      :menu-category="categoryList"
      :submit-type="materialType"
      @refreshEditDataList="getDataList({ 'type': materialType })"
    />
    <material-detail
      ref="MaterialDetail"
      :submit-type="materialType"
      :upload-type="activeName"
    />
    <material-article-detail
      ref="MaterialArticleDetail"
    />
  </div>
</template>

<script>
import { getMaterialList, materialDelete } from '@/api/material'
import tissueTree from '@/components/Tree/index'
import categoryAdd from '@/components/CategoryAdd/index'
import { getCategoryListTree } from '@/api/categorytree'
import videoAdd from './material-video-add-or-update'
import MaterialEdit from './material-edit'
import MaterialDetail from './material-detail'
import MaterialArticleDetail from './material-article-detail'
import ArticleAddOrUpdate from './material-article-add-or-update'
export default {
  name: 'MaterialManagement',
  components: {
    tissueTree,
    categoryAdd,
    videoAdd,
    MaterialEdit,
    MaterialDetail,
    ArticleAddOrUpdate,
    MaterialArticleDetail
  },
  data() {
    return {
      activeName: 'video',
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      categorykey: '',
      dataList: [], // 获取视频数据
      audioDataList: [], // 获取音频数据
      articleDataList: [], // 获取音频数据
      pictureDataList: [], // 获取音频数据
      dataListSelections: [], // 多选
      categoryList: [], // 菜单-列表
      videoCategoryList: [], // 视频-菜单-列表
      audioCategoryList: [], // 音频-菜单-列表
      articleCategoryList: [], // 文章-菜单-列表
      pictureCategoryList: [], // 图片-菜单-列表
      materialType: 1, // 素材-类型 默认视频
      menuSelect: [], // 添加分类，回调刷新菜单
      materialCategoryType: 6, // 根据tab-添加-分类
      materialvideoType: 1, // 素材-视频-类型
      materialaudioType: 2, // 素材-音频-类型
      materialarticleType: 3, // 素材-文章-类型
      materialpictureType: 4, // 素材-图片-类型
      videoCategoryType: [6], // 视频-树形-分类
      audioCategoryType: [7], // 音频-树形-分类
      articleCategoryType: [8], // 文章-树形-分类
      pictureCategoryType: [9], // 图片-树形-分类
      videoCategoryAdd: 6, // 视频-添加-分类
      audioCategoryAdd: 7, // 音频-添加-分类
      articleCategoryAdd: 8, // 文章-添加-分类
      pictureCategoryAdd: 9, // 图片-添加-分类
      // 树形控件配置参数
      defaultProps: {
        children: 'children',
        label: 'val'
      },
      dataForm: {
        name: ''
      }
    }
  },
  created() {
    // 获取列表方法
    this.getDataList({ 'type': this.materialvideoType })
    // 获取分类方法
    this.getCategoryList({ 'types': this.videoCategoryType })
  },
  methods: {
    // 点击tab,切换数据
    handleClick(tab, event) {
      switch (tab.name) {
        case 'video':
          this.materialType = this.materialvideoType
          this.getDataList({ 'type': this.materialvideoType })
          this.menuSelect = this.videoCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.videoCategoryType })
          break
        case 'audio':
          this.materialType = this.materialaudioType
          this.getDataList({ 'type': this.materialaudioType })
          this.menuSelect = this.audioCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.audioCategoryType })
          break
        case 'article':
          this.materialType = this.materialarticleType
          this.getDataList({ 'type': this.materialarticleType })
          this.menuSelect = this.articleCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.articleCategoryType })
          break
        case 'image':
          this.materialType = this.materialpictureType
          this.getDataList({ 'type': this.materialpictureType })
          this.menuSelect = this.pictureCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.pictureCategoryType })
          break
      }
    },
    // 切换分类
    switchCategory(item) {
      this.categorykey = item.key // 获取菜单分类key
      switch (this.activeName) {
        case 'video':
          this.getDataList({ 'type': this.materialvideoType, 'category_key': this.categorykey })
          break
        case 'audio':
          this.getDataList({ 'type': this.materialaudioType, 'category_key': this.categorykey })
          break
        case 'article':
          this.getDataList({ 'type': this.materialarticleType, 'category_key': this.categorykey })
          break
        case 'image':
          this.getDataList({ 'type': this.materialpictureType, 'category_key': this.categorykey })
          break
      }
    },
    // 获取分类
    getCategoryList(types = {}) {
      getCategoryListTree(this.$service.adornData({
        ...types
      })).then(res => {
        if (res && res.code === 0) {
          switch (this.activeName) {
            case 'video':
              this.videoCategoryList = res.data.list
              this.categoryList = res.data.list
              break
            case 'audio':
              this.audioCategoryList = res.data.list
              this.categoryList = res.data.list
              break
            case 'article':
              this.articleCategoryList = res.data.list
              this.categoryList = res.data.list
              break
            case 'image':
              this.pictureCategoryList = res.data.list
              this.categoryList = res.data.list
              break
          }
        } else {
          this.categoryList = []
          this.videoCategoryList = []
          this.audioCategoryList = []
          this.articleCategoryList = []
          this.pictureCategoryList = []
        }
      })
    },
    // 添加分类
    categoryAddHandle() {
      // 根据tab,修改添加分类
      switch (this.activeName) {
        case 'video':
          this.materialCategoryType = this.videoCategoryAdd
          break
        case 'audio':
          this.materialCategoryType = this.audioCategoryAdd
          break
        case 'article':
          this.materialCategoryType = this.articleCategoryAdd
          break
        case 'image':
          this.materialCategoryType = this.pictureCategoryAdd
          break
      }
      // 调用组件方法,打开组件
      this.$refs.categoryAdd.openDialog()
    },
    // 上传视频
    uploadVideoHandle() {
      this.$refs.videoAdd.openDialog()
      this.$nextTick(() => {
        this.$refs.videoAdd.init(this.activeName)
      })
    },
    // 上传音频
    uploadAudioHandle() {
      this.$refs.videoAdd.openDialog()
      this.$nextTick(() => {
        this.$refs.videoAdd.init(this.activeName)
      })
    },
    // 上传图片
    uploadPictureHandle() {
      this.$refs.videoAdd.openDialog()
      this.$nextTick(() => {
        this.$refs.videoAdd.init(this.activeName)
      })
    },
    // 上传文章
    uploadArticleHandle() {
      this.$refs.ArticleAddOrUpdate.openDialog()
    },
    // 预览视频
    previewVideoHandle(data) {
      this.$refs.MaterialDetail.openDialog()
      this.$nextTick(() => {
        this.$refs.MaterialDetail.init(data)
      })
    },
    // 预览音频
    previewAudioHandle(data) {
      this.$refs.MaterialDetail.openDialog()
      this.$nextTick(() => {
        this.$refs.MaterialDetail.init(data)
      })
    },
    // 预览文章
    previewArticleHandle(data) {
      this.$refs.MaterialArticleDetail.openDialog()
      this.$nextTick(() => {
        this.$refs.MaterialArticleDetail.init(data)
      })
    },
    // 预览图片
    previewPictureHandle(data) {
      this.$refs.MaterialDetail.openDialog()
      this.$nextTick(() => {
        this.$refs.MaterialDetail.init(data)
      })
    },
    // 编辑视频
    editVideoHandle(data) {
      this.$refs.MaterialEdit.openDialog()
      this.$nextTick(() => {
        this.$refs.MaterialEdit.init(data)
      })
    },
    // 编辑音频
    editAudioHandle(data) {
      this.$refs.MaterialEdit.openDialog()
      this.$nextTick(() => {
        this.$refs.MaterialEdit.init(data)
      })
    },
    // 编辑文章
    editArticleHandle(data) {
      this.$refs.ArticleAddOrUpdate.openDialog()
      this.$nextTick(() => {
        this.$refs.ArticleAddOrUpdate.init(data)
      })
    },
    // 编辑图片
    editPictureHandle(data) {
      this.$refs.MaterialEdit.openDialog()
      this.$nextTick(() => {
        this.$refs.MaterialEdit.init(data)
      })
    },
    // 获取视频/音频/文章/图片-列表
    getDataList(type = {}) {
      getMaterialList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'name': this.dataForm.name,
        ...type
      })).then(res => {
        if (res && res.code === 0) {
          switch (this.activeName) {
            case 'video':
              this.dataList = res.data.list
              this.totalPage = res.data.total_size
              break
            case 'audio':
              this.audioDataList = res.data.list
              this.totalPage = res.data.total_size
              break
            case 'article':
              this.articleDataList = res.data.list
              this.totalPage = res.data.total_size
              break
            case 'image':
              this.pictureDataList = res.data.list
              this.totalPage = res.data.total_size
              break
          }
        } else {
          this.dataList = []
          this.audioDataList = []
          this.articleDataList = []
          this.pictureDataList = []
          this.totalPage = 0
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 删除
    deleteHandle(data) {
      this.$confirm(`确定对[名称=${data.name}]进行[${data.name ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        materialDelete(this.$service.adornData({
          'material_ids	': [data.id]
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList({ 'type': this.materialvideoType })
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
.category {
  display:flex;
  font-size:14px;
  justify-content: space-between;
  &-item {
    align-self: center;
  }
  &-item-icon {
    padding-right: 10px;
  }
}
</style>
