<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="视频" name="video">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="搜索条件" name="1">
            <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList({ 'type': materialvideoType })">
              <el-form-item label="名称:" prop="name">
                <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入视频名称" clearable />
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-select v-model="dataForm.status" label="请选择">
                  <el-option v-for="item in dataForm.statuslist" :key="item.key" :label="item.val" :value="item.key" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="标签:" prop="tag">
                <el-select v-model="dataForm.tag" label="请选择">
                  <el-option v-for="item in dataForm.tags" :key="item.key" :label="item.val" :value="item.key" />
                </el-select>
              </el-form-item> -->
              <el-form-item label="创建时间:" prop="date1">
                <el-date-picker
                  v-model="dataForm.date1"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="至" prop="date2">
                <el-date-picker
                  v-model="dataForm.date2"
                  type="date"
                  value-format="timestamp"
                  placeholder="结束日期"
                />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="getDataList({ 'type': materialvideoType })">查询</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
            <el-button type="primary" @click="addVideoHandle">+创建视频</el-button>
          </el-collapse-item>
        </el-collapse>

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
            <category-tree
              v-if="videoCategoryList.length"
              ref="CategoryTree"
              :data-tree="videoCategoryList"
              :default-props="defaultProps"
              :category-type="materialCategoryType"
              @nodeClick="switchCategory"
              @refreshCategoryDataList="getCategoryList({ 'types': menuSelect })"
            />
          </el-aside>
          <el-main>
            <el-table v-loading="dataListLoading" :data="videoDataList" border height="400" style="width: 100%">
              <el-table-column type="selection" header-align="center" align="center" width="50" />
              <el-table-column prop="name" label="名称" header-align="center" align="center" />
              <el-table-column prop="icon" label="封面" header-align="center" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.icon">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="scope.row.icon"
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
              <el-table-column prop="type_desc" label="类型" header-align="center" align="center" />
              <el-table-column prop="status_desc" label="状态" header-align="center" align="center" />
              <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
              <el-table-column label="操作" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 1">
                    <el-button type="text" size="small" @click="onlineContent(scope.row.id)">上架</el-button>
                    <el-button type="text" size="small" @click="editVideoHandle(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                  </div>
                  <div v-if="scope.row.status === 2">
                    <el-button type="text" size="small" @click="offlineContent(scope.row.id)">下架</el-button>
                    <el-button type="text" size="small" @click="editVideoHandle(scope.row)">编辑</el-button>
                  </div>
                  <div v-if="scope.row.status === 3">
                    <el-button type="text" size="small" @click="onlineContent(scope.row.id)">上架</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="音频" name="audio">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="搜索条件" name="1">
            <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList({ 'type': materialaudioType })">
              <el-form-item label="名称:" prop="name">
                <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入音频名称" clearable />
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-select v-model="dataForm.status" label="请选择">
                  <el-option v-for="item in dataForm.statuslist" :key="item.key" :label="item.val" :value="item.key" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="标签:" prop="tag">
                <el-select v-model="dataForm.tag" label="请选择">
                  <el-option v-for="item in dataForm.tags" :key="item.key" :label="item.val" :value="item.key" />
                </el-select>
              </el-form-item> -->
              <el-form-item label="创建时间:" prop="date1">
                <el-date-picker
                  v-model="dataForm.date1"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="至" prop="date2">
                <el-date-picker
                  v-model="dataForm.date2"
                  type="date"
                  value-format="timestamp"
                  placeholder="结束日期"
                />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="getDataList({ 'type': materialaudioType })">查询</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
            <el-button type="primary" @click="addAudioHandle">+创建音频</el-button>
          </el-collapse-item>
        </el-collapse>

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
            <category-tree
              v-if="audioCategoryList.length"
              ref="CategoryTree"
              :data-tree="audioCategoryList"
              :default-props="defaultProps"
              :category-type="materialCategoryType"
              @nodeClick="switchCategory"
              @refreshCategoryDataList="getCategoryList({ 'types': menuSelect })"
            />
          </el-aside>
          <el-main>
            <el-table v-loading="dataListLoading" :data="audioDataList" border height="400" style="width: 100%">
              <el-table-column type="selection" header-align="center" align="center" width="50" />
              <el-table-column prop="name" label="名称" header-align="center" align="center" />
              <el-table-column prop="icon" label="封面" header-align="center" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.icon">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="scope.row.icon"
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
              <el-table-column prop="type_desc" label="类型" header-align="center" align="center" />
              <el-table-column prop="status_desc" label="状态" header-align="center" align="center" />
              <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
              <el-table-column label="操作" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 1">
                    <el-button type="text" size="small" @click="onlineContent(scope.row.id)">上架</el-button>
                    <el-button type="text" size="small" @click="editAudioHandle(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                  </div>
                  <div v-if="scope.row.status === 2">
                    <el-button type="text" size="small" @click="offlineContent(scope.row.id)">下架</el-button>
                    <el-button type="text" size="small" @click="editAudioHandle(scope.row)">编辑</el-button>
                  </div>
                  <div v-if="scope.row.status === 3">
                    <el-button type="text" size="small" @click="onlineContent(scope.row.id)">上架</el-button>
                    <el-button type="text" size="small" @click="editAudioHandle(scope.row)">编辑</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="文章" name="article">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="搜索条件" name="1">
            <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList({ 'type': materialarticleType })">
              <el-form-item label="名称:" prop="name">
                <el-input v-model="dataForm.name" prefix-icon="el-icon-search" placeholder="请输入文章名称" clearable />
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-select v-model="dataForm.status" label="请选择">
                  <el-option v-for="item in dataForm.statuslist" :key="item.key" :label="item.val" :value="item.key" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="标签:" prop="tag">
                <el-select v-model="dataForm.tag" label="请选择">
                  <el-option v-for="item in dataForm.tags" :key="item.key" :label="item.val" :value="item.key" />
                </el-select>
              </el-form-item> -->
              <el-form-item label="创建时间:" prop="date1">
                <el-date-picker
                  v-model="dataForm.date1"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="至" prop="date2">
                <el-date-picker
                  v-model="dataForm.date2"
                  type="date"
                  value-format="timestamp"
                  placeholder="结束日期"
                />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="getDataList({ 'type': materialarticleType })">查询</el-button>
            <el-button @click="resetForm('dataForm')">重置</el-button>
            <el-button type="primary" @click="addArticleHandle">+创建文章</el-button>
          </el-collapse-item>
        </el-collapse>

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
            <category-tree
              v-if="articleCategoryList.length"
              ref="CategoryTree"
              :data-tree="articleCategoryList"
              :default-props="defaultProps"
              :category-type="materialCategoryType"
              @nodeClick="switchCategory"
              @refreshCategoryDataList="getCategoryList({ 'types': menuSelect })"
            />
          </el-aside>
          <el-main>
            <el-table v-loading="dataListLoading" :data="articleDataList" border height="400" style="width: 100%">
              <el-table-column type="selection" header-align="center" align="center" width="50" />
              <el-table-column prop="name" label="名称" header-align="center" align="center" />
              <el-table-column prop="icon" label="封面" header-align="center" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.icon">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="scope.row.icon"
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
              <el-table-column prop="type_desc" label="类型" header-align="center" align="center" />
              <el-table-column prop="status_desc" label="状态" header-align="center" align="center" />
              <el-table-column prop="create_time_desc" label="创建时间" header-align="center" align="center" />
              <el-table-column label="操作" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.status === 1">
                    <el-button type="text" size="small" @click="onlineContent(scope.row.id)">上架</el-button>
                    <el-button type="text" size="small" @click="editArticleHandle(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
                  </div>
                  <div v-if="scope.row.status === 2">
                    <el-button type="text" size="small" @click="offlineContent(scope.row.id)">下架</el-button>
                    <el-button type="text" size="small" @click="editArticleHandle(scope.row)">编辑</el-button>
                  </div>
                  <div v-if="scope.row.status === 3">
                    <el-button type="text" size="small" @click="onlineContent(scope.row.id)">上架</el-button>
                    <el-button type="text" size="small" @click="editArticleHandle(scope.row)">编辑</el-button>
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
      </el-tab-pane>
    </el-tabs>
    <category-add
      ref="categoryAdd"
      :category-type="materialCategoryType"
      @refreshCategoryDataList="getCategoryList({ 'types': menuSelect })"
    />
  </div>
</template>

<script>
import CategoryTree from '@/components/Tree/index'
import categoryAdd from '@/components/CategoryAdd/index'
import { getContentList, contentDelete, contentOnline, contentOffline } from '@/api/content'
import { getCourseFilters } from '@/api/courseselection'
import { getCategoryListTree } from '@/api/categorytree'
export default {
  name: 'ContentManagement',
  components: {
    CategoryTree,
    categoryAdd
  },
  data() {
    return {
      activeNames: ['1'],
      activeName: 'video', // tabs状态
      categorykey: '',
      videoDataList: [], // 获取视频数据
      audioDataList: [], // 获取音频数据
      articleDataList: [], // 获取音频数据
      pictureDataList: [], // 获取音频数据
      dataListSelections: [], // 多选
      categoryList: [], // 菜单-列表
      videoCategoryList: [], // 视频-菜单-列表
      audioCategoryList: [], // 音频-菜单-列表
      articleCategoryList: [], // 文章-菜单-列表
      pictureCategoryList: [], // 图片-菜单-列表
      materialType: 1, // 内容-类型 默认视频
      menuSelect: [10], // 添加分类，回调刷新菜单
      materialCategoryType: 10, // 根据tab-添加-分类
      materialvideoType: 1, // 内容-视频-类型
      materialaudioType: 2, // 内容-音频-类型
      materialarticleType: 3, // 内容-文章-类型
      materialpictureType: 4, // 内容-图片-类型
      videoCategoryType: [10], // 视频-树形-分类
      audioCategoryType: [11], // 音频-树形-分类
      articleCategoryType: [12], // 文章-树形-分类
      pictureCategoryType: [13], // 图片-树形-分类
      videoCategoryAdd: 10, // 视频-添加-分类
      audioCategoryAdd: 11, // 音频-添加-分类
      articleCategoryAdd: 12, // 文章-添加-分类
      pictureCategoryAdd: 13, // 图片-添加-分类
      dataForm: {
        name: '', // 名称
        content_type: 0, // 选中类型
        status: 0, // 选中状态
        tag: '', // 选中标签
        tags: [], // 标签列表
        statuslist: [], // 状态列表
        contentTypeList: [], // 章节类型
        date1: '', // 起始时间
        datae2: '' // 结束时间
      },
      // 树形控件配置参数
      defaultProps: {
        children: 'children',
        label: 'val'
      },
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      section_id: ''
    }
  },
  created() {
    // 创新更新返回
    if (this.$route.query.activeName != null) {
      this.activeName = this.$route.query.activeName
      switch (this.activeName) {
        case 'video':
          this.materialType = this.materialvideoType
          this.getDataList({ 'type': this.materialvideoType })
          this.menuSelect = this.videoCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.videoCategoryType })
          this.materialCategoryType = this.videoCategoryAdd // 添加和编辑分类
          break
        case 'audio':
          this.materialType = this.materialaudioType
          this.getDataList({ 'type': this.materialaudioType })
          this.menuSelect = this.audioCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.audioCategoryType })
          this.materialCategoryType = this.audioCategoryAdd // 添加和编辑分类
          break
        case 'article':
          this.materialType = this.materialarticleType
          this.getDataList({ 'type': this.materialarticleType })
          this.menuSelect = this.articleCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.articleCategoryType })
          this.materialCategoryType = this.articleCategoryAdd // 添加和编辑分类
          break
      }
    }
    // 页面刷新
    if (sessionStorage.getItem('content_name') != null) {
      this.activeName = sessionStorage.getItem('content_name')
      switch (this.activeName) {
        case 'video':
          this.materialType = this.materialvideoType
          this.getDataList({ 'type': this.materialvideoType })
          this.menuSelect = this.videoCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.videoCategoryType })
          this.materialCategoryType = this.videoCategoryAdd // 添加和编辑分类
          break
        case 'audio':
          this.materialType = this.materialaudioType
          this.getDataList({ 'type': this.materialaudioType })
          this.menuSelect = this.audioCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.audioCategoryType })
          this.materialCategoryType = this.audioCategoryAdd // 添加和编辑分类
          break
        case 'article':
          this.materialType = this.materialarticleType
          this.getDataList({ 'type': this.materialarticleType })
          this.menuSelect = this.articleCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.articleCategoryType })
          this.materialCategoryType = this.articleCategoryAdd // 添加和编辑分类
          break
      }
    } else {
      // 获取分类方法
      this.getCategoryList({ 'types': this.videoCategoryType })
      // 获取内容列表
      this.getDataList({ 'type': this.materialvideoType })
    }
    this.getStatusTag()
  },
  methods: {
    // 点击tab,切换数据
    handleClick(tab, event) {
      switch (tab.name) {
        case 'video':
          sessionStorage.setItem('content_name', 'video')
          this.materialType = this.materialvideoType
          this.getDataList({ 'type': this.materialvideoType })
          this.menuSelect = this.videoCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.videoCategoryType })
          this.materialCategoryType = this.videoCategoryAdd // 添加和编辑分类
          break
        case 'audio':
          sessionStorage.setItem('content_name', 'audio')
          this.materialType = this.materialaudioType
          this.getDataList({ 'type': this.materialaudioType })
          this.menuSelect = this.audioCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.audioCategoryType })
          this.materialCategoryType = this.audioCategoryAdd // 添加和编辑分类
          break
        case 'article':
          sessionStorage.setItem('content_name', 'article')
          this.materialType = this.materialarticleType
          this.getDataList({ 'type': this.materialarticleType })
          this.menuSelect = this.articleCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.articleCategoryType })
          this.materialCategoryType = this.articleCategoryAdd // 添加和编辑分类
          break
        case 'image':
          this.materialType = this.materialpictureType
          this.getDataList({ 'type': this.materialpictureType })
          this.menuSelect = this.pictureCategoryType // 分类树形菜单
          this.getCategoryList({ 'types': this.pictureCategoryType })
          this.materialCategoryType = this.pictureCategoryAdd // 添加和编辑分类
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
      // 调用组件方法,打开组件
      this.$refs.categoryAdd.openDialog()
    },
    // 获取内容列表
    getDataList(type = {}) {
      getContentList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'name': this.dataForm.name,
        'status': this.dataForm.status,
        'tag_key': this.dataForm.tag,
        'category_key': this.categorykey,
        'min_create_time': !this.dataForm.date1 ? 0 : this.dataForm.date1 / 1000,
        'max_create_time': !this.dataForm.date2 ? 0 : this.dataForm.date2 / 1000,
        ...type
      })).then(res => {
        if (res && res.code === 0) {
          switch (this.activeName) {
            case 'video':
              this.videoDataList = res.data.list
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
          this.videoDataList = []
          this.audioDataList = []
          this.articleDataList = []
          this.pictureDataList = []
          this.totalPage = 0
        }
      })
    },
    // 获取章节类型/标签/状态
    getStatusTag() {
      getCourseFilters(this.$service.adornData({
        'show_status': 1, // 状态
        'show_material_type': 1, // 素材类型
        'tag_type': 5 // 标签类型
      })).then(response => {
        if (response && response.code === 0) {
          this.dataForm.tags = response.data.tag.list
          this.dataForm.statuslist = response.data.status
          this.dataForm.contentTypeList = response.data.material_type
        } else {
          this.dataForm.tags = []
          this.dataForm.statuslist = []
          this.dataForm.contentTypeList = []
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList({ 'type': this.materialType })
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList({ 'type': this.materialType })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDataList({ 'type': this.materialType })
    },
    // 创建视频
    addVideoHandle() {
      this.$router.push({ path: '/course/create-or-update-video' })
    },
    // 创建音频
    addAudioHandle() {
      this.$router.push({ path: '/course/create-or-update-audio' })
    },
    // 创建文章
    addArticleHandle() {
      this.$router.push({ path: '/course/create-or-update-article' })
    },
    // 创建图片
    addImageHandle() {
      this.$router.push({ path: '/course/create-or-update-image' })
    },
    // 编辑-视频-内容
    editVideoHandle(data) {
      this.$router.replace({ path: '/course/create-or-update-video', meta: { title: '编辑视频' }, query: { id: data.id }})
    },
    // 编辑-音频-内容
    editAudioHandle(data) {
      this.$router.replace({ path: '/course/create-or-update-audio', meta: { title: '编辑音频' }, query: { id: data.id }})
    },
    // 编辑-文章-内容
    editArticleHandle(data) {
      this.$router.replace({ path: '/course/create-or-update-article', meta: { title: '编辑音频' }, query: { id: data.id }})
    },
    // 编辑-图片-内容
    editImageHandle(data) {
      this.$router.replace({ path: '/course/create-or-update-image', meta: { title: '编辑图片' }, query: { id: data.id }})
    },
    // 上架
    onlineContent(sectionid) {
      contentOnline(this.$service.adornData({
        'section_id': sectionid
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '上架成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList({ 'type': this.materialType })
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 下架
    offlineContent(sectionid) {
      contentOffline(this.$service.adornData({
        'section_id': sectionid
      })).then(response => {
        if (response && response.code === 0) {
          this.$message({
            message: '下架成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList({ 'type': this.materialType })
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 删除
    deleteHandle(data) {
      this.$confirm(`确定对[名称=${data.name}]进行[${data.name ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contentDelete(this.$service.adornData({
          'section_ids': [data.id]
        })).then((data) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
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
    margin: 25px;
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
