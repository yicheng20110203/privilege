<template>
  <div class="dashboard-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="搜索条件" name="1">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
          <el-form-item label="手机号" prop="tel">
            <el-input v-model="dataForm.tel" prefix-icon="el-icon-search" placeholder="手机号" clearable />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="dataForm.nickname" prefix-icon="el-icon-search" placeholder="昵称" clearable />
          </el-form-item>
          <el-form-item label="用户标签" prop="user_tag_list">
            <el-select v-model="dataForm.user_tag_list" clearable placeholder="选择用户标签">
              <el-option
                v-for="item in dataForm.user_tag"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="来源渠道" prop="source_channel_list">
            <el-select v-model="dataForm.source_channel_list" clearable placeholder="选择来源渠道">
              <el-option
                v-for="item in dataForm.source_channel"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="用户身份" prop="user_id_list">
            <el-select v-model="dataForm.user_id_list" clearable placeholder="选择用户身份">
              <el-option
                v-for="item in dataForm.user_id"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="注册时间" prop="date1">
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
          <el-button type="primary" @click="getDataList">查询</el-button>
          <el-button @click="resetForm('dataForm')">重置</el-button>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table v-loading="dataListLoading" :data="dataList" border height="450" style="width:100%">
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="id" label="用户ID" header-align="center" align="center" />
      <el-table-column prop="nickname" label="昵称" header-align="center" align="center" />
      <el-table-column prop="mobile" label="手机号" header-align="center" align="center" />
      <!-- <el-table-column prop="vip_type_desc" label="用户身份" header-align="center" align="center" /> -->
      <el-table-column prop="reg_channel_desc" label="来源渠道" header-align="center" align="center" />
      <el-table-column prop="create_time_desc" label="注册时间" header-align="center" align="center" />
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
  </div>
</template>

<script>
import { adminList } from '@/api/user'
import { getUserFilters } from '@/api/courseselection'
import { is_show } from '@/utils/global-element'
export default {
  name: 'UserList',
  data() {
    return {
      activeNames: ['1'],
      dataListLoading: false,
      userLabel: [], // 用户标签
      dataList: [], // 用户列表
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataForm: {
        tel: '', // 手机号
        nickname: '', // 昵称
        user_tag: [], // 用户标签
        user_tag_list: '', // 选中用户标签
        source_channel: [], // 来源渠道
        source_channel_list: '', // 选中来源渠道
        user_id: [], // 用户身份
        user_id_list: '', // 选中用户身份
        date1: '', // 注册时间
        date2: ''
      }
    }
  },
  created() {
    // 获取用户标签
    this.getUserLabel()
    // 获取用户列表
    this.getDataList()
  },
  methods: {
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
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
    // 获取 - 用户 - 标签/渠道/用户身份
    getUserLabel() {
      getUserFilters(this.$service.adornData({
        'show_user_tag': is_show,
        'show_user_channel': is_show,
        'show_user_identifier': is_show
      })).then(res => {
        this.dataForm.user_tag = res && res.code === 0 ? res.data.user_tag : []
        this.dataForm.source_channel = res && res.code === 0 ? res.data.user_channel : []
        this.dataForm.user_id = res && res.code === 0 ? res.data.UserIdentifier : []
      })
    },
    // 查询
    getDataList() {
      this.dataListLoading = true
      adminList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'mobile': this.dataForm.tel.trim(),
        'nickname': this.dataForm.nickname.trim(),
        'tag_key': this.dataForm.user_tag_list.trim(),
        'channel_id': !this.dataForm.source_channel_list ? 0 : this.dataForm.source_channel_list,
        // 'user_vip_type': !this.dataForm.user_id_list ? 0 : this.dataForm.user_id_list,
        'min_create_time': !this.dataForm.date1 ? 0 : this.dataForm.date1 / 1000,
        'max_create_time': !this.dataForm.date2 ? 0 : this.dataForm.date2 / 1000
      })).then(res => {
        this.dataList = res && res.code === 0 ? res.data.list : []
        this.totalPage = res && res.code === 0 ? res.data.total_size : []
      })
      this.dataListLoading = false
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
