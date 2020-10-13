<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="课包" name="lesson">
        <el-container>
          <el-aside width="400px">
            <div class="category">
              <div class="category-item">
                <el-button
                  type="text"
                  size="medium"
                  icon="el-icon-circle-plus-outline"
                  @click="tagAddHandle"
                >
                  添加标签
                </el-button>
              </div>
            </div>
            <tag-tree
              v-if="tags.length"
              ref="TagTree"
              :data-tree="tags"
              :default-props="defaultProps"
              :tag-type="tagsType"
              @refreshTagDataList="getTag({ 'types': tagselect })"
            />
          </el-aside>
          <el-main />
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="课程" name="course">
        <el-container>
          <el-aside width="400px">
            <div class="category">
              <div class="category-item">
                <el-button
                  type="text"
                  size="medium"
                  icon="el-icon-circle-plus-outline"
                  @click="tagAddHandle"
                >
                  添加标签
                </el-button>
              </div>
            </div>
            <tag-tree
              v-if="tags.length"
              ref="TagTree"
              :data-tree="tags"
              :default-props="defaultProps"
              :tag-type="tagsType"
              @refreshTagDataList="getTag({ 'types': tagselect })"
            />
          </el-aside>
          <el-main />
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="章节" name="chapter">
        <el-container>
          <el-aside width="400px">
            <div class="category">
              <div class="category-item">
                <el-button
                  type="text"
                  size="medium"
                  icon="el-icon-circle-plus-outline"
                  @click="tagAddHandle"
                >
                  添加标签
                </el-button>
              </div>
            </div>
            <tag-tree
              v-if="tags.length"
              ref="TagTree"
              :data-tree="tags"
              :default-props="defaultProps"
              :tag-type="tagsType"
              @refreshTagDataList="getTag({ 'types': tagselect })"
            />
          </el-aside>
          <el-main />
        </el-container>
      </el-tab-pane>
    </el-tabs>
    <tag-add
      ref="TagAdd"
      :tag-type="tagsType"
      @refreshTagDataList="getTag({ 'types': tagselect })"
    />
  </div>
</template>

<script>
import { getTagTree } from '@/api/label'
import {
  TAG_COURSE_PACKAGE,
  TAG_COURSE,
  TAG_CHAPTER,
  COURSE_PACKAGE_ADD,
  COURSE_ADD,
  CHAPTER_ADD
} from '@/utils/global-element'
import TagTree from '@/components/TagTree'
import TagAdd from '@/components/TagAdd'
export default {
  name: 'Tag',
  components: {
    TagTree,
    TagAdd
  },
  data() {
    return {
      activeName: 'lesson',
      tagselect: TAG_COURSE_PACKAGE,
      tagsType: COURSE_PACKAGE_ADD,
      // 树形标签配置参数
      defaultProps: {
        children: 'children',
        label: 'val'
      },
      tags: [] // 选中标签
    }
  },
  created() {
    this.getTag({ 'types': this.tagselect })
  },
  methods: {
    // 获取课包标签
    getTag(types = {}) {
      getTagTree(this.$service.adornData({
        ...types
      })).then(res => {
        if (res && res.code === 0) {
          this.tags = res.data.list
        } else {
          this.tags = []
        }
      })
    },
    // 点击tab,切换数据
    handleClick(tab, event) {
      switch (tab.name) {
        case 'lesson':
          this.tagselect = TAG_COURSE_PACKAGE
          this.tagsType = COURSE_PACKAGE_ADD
          this.getTag({ 'types': this.tagselect })
          break
        case 'course':
          this.tagselect = TAG_COURSE
          this.tagsType = COURSE_ADD
          this.getTag({ 'types': this.tagselect })
          break
        case 'chapter':
          this.tagselect = TAG_CHAPTER
          this.tagsType = CHAPTER_ADD
          this.getTag({ 'types': this.tagselect })
          break
      }
    },
    // 标签添加
    tagAddHandle() {
      // 调用组件方法,打开组件
      this.$refs.TagAdd.openDialog()
    }
  }
}
</script>

<style lang="scss" scoped>

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
