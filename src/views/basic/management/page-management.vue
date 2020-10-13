<template>
  <div class="dashboard-container">
    <div class="dashboard-text">页面管理</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageManagement',
  computed: {
    ...mapGetters([
      'login_name',
      'userid'
    ])
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
