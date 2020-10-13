<template>
  <div class="dashboard-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="搜索条件" name="1">
        <el-form ref="dataForm" :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
          <el-form-item label="订单编号" prop="order_code">
            <el-input v-model="dataForm.order_code" prefix-icon="el-icon-search" placeholder="请输入订单编辑" clearable />
          </el-form-item>
          <el-form-item label="订单类型" prop="type">
            <el-select v-model="dataForm.type" placeholder="请选择订单类型">
              <el-option v-for="item in typelist" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单时间:" prop="date1">
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
          <el-form-item label="课程编号" prop="lesson_code">
            <el-input v-model="dataForm.lesson_code" prefix-icon="el-icon-search" placeholder="请输入课程编号" clearable />
          </el-form-item>
          <el-form-item label="课程名称" prop="lesson_name">
            <el-input v-model="dataForm.lesson_name" prefix-icon="el-icon-search" placeholder="请输入课程名称" clearable />
          </el-form-item>
          <el-button type="primary" @click="getDataList">查询</el-button>
          <el-button type="primary" @click="resetForm('dataForm')">重置</el-button>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table v-loading="dataListLoading" :data="dataList" border height="450" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column prop="order_no" label="订单编号" header-align="center" align="center" />
      <el-table-column prop="buy_type_desc" label="订单类型" header-align="center" align="center" />
      <el-table-column prop="source_code" label="课程/课包编号" header-align="center" align="center" />
      <el-table-column prop="source_name" label="课程/课包名称" header-align="center" align="center" />
      <el-table-column prop="total_fee" label="成交价" header-align="center" align="center">
        <template slot-scope="scope">
          {{ scope.row.total_fee|priceFilter(scope.row.total_fee) }}
        </template>
      </el-table-column>
      <el-table-column prop="transaction_id" label="流水号" header-align="center" align="center" />
      <el-table-column prop="create_time_desc" label="订单时间" header-align="center" align="center" />
      <el-table-column prop="order_status_desc" label="订单状态" header-align="center" align="center" />
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
import { getOrderList } from '@/api/order'
export default {
  name: 'OrderManagement',
  data() {
    return {
      activeNames: ['1'],
      dataList: [], // 订单列表
      dataForm: {
        order_code: '', // 订单编号
        lesson_code: '', // 课程编号
        lesson_name: '', // 课程名称
        type: '', // 订单类型
        date1: '', // 开始日期
        date2: '' // 结束日期
      },
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      typelist: [
        { 'id': 1, label: '购买课包' },
        { 'id': 2, label: '购买课程' }
      ]
    }
  },
  created() {
    // 获取订单列表
    this.getDataList()
  },
  methods: {
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
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 查询
    getDataList() {
      this.dataListLoading = true
      getOrderList(this.$service.adornData({
        'page': this.pageIndex,
        'size': this.pageSize,
        'type': !this.dataForm.type ? 0 : this.dataForm.type,
        'order_no': this.dataForm.order_code.trim(),
        'source_code': this.dataForm.lesson_code.trim(),
        'source_name': this.dataForm.lesson_name.trim(),
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
