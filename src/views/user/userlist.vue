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
          <el-form-item label="用户标签" prop="user_tag">
            <el-select v-model="dataForm.user_tag_list" clearable placeholder="请输入用户标签">
              <el-option
                v-for="item in dataForm.user_tag"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="来源渠道" prop="source_channel">
            <el-select v-model="dataForm.source_channel_list" clearable placeholder="请输入来源渠道">
              <el-option
                v-for="item in dataForm.source_channel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户身份" prop="user_id">
            <el-select v-model="dataForm.user_id_list" clearable placeholder="请输入用户身份">
              <el-option
                v-for="item in dataForm.user_id"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
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
      <el-table-column prop="code" label="昵称" header-align="center" align="center" />
      <el-table-column prop="code" label="手机号" header-align="center" align="center" />
      <el-table-column prop="code" label="用户身份" header-align="center" align="center" />
      <el-table-column prop="code" label="来源渠道" header-align="center" align="center" />
      <el-table-column prop="code" label="购买次数" header-align="center" align="center" />
      <el-table-column prop="code" label="消费总额" header-align="center" align="center" />
      <el-table-column prop="code" label="注册时间" header-align="center" align="center" />
      <el-table-column label="操作" fixed="right" header-align="center" align="center">
        <template>
          <el-button type="text">查看</el-button>
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
  </div>
</template>

<script>

export default {
  name: 'UserList',
  data() {
    return {
      activeNames: ['1'],
      dataListLoading: false,
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
  methods: {
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
    // 查询
    getDataList() {

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
