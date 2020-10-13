<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <svg t="1589942488938" class="icon user-avatar" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28376" width="200" height="200"><path d="M140.629333 372.565333S112.298667 0 516.437333 0c396.458667 0 363.861333 382.634667 363.861334 382.634667zM147.968 523.434667L119.466667 836.266667a63.146667 63.146667 0 0 0 51.2 68.266666c54.613333 9.386667 155.477333 20.138667 331.093333 20.138667 182.784 0 290.133333-11.605333 348.16-21.333333a62.976 62.976 0 0 0 52.224-68.266667l-28.842667-320.170667z" fill="#D35BE8" p-id="28377" /><path d="M597.333333 682.666667l-85.333333 1.024-85.333333-1.024s17.066667 79.36-37.376 100.522666c0 0 6.997333 74.410667 121.685333 74.410667s122.709333-74.410667 122.709333-74.410667C579.413333 762.538667 597.333333 682.666667 597.333333 682.666667z" fill="#FFEDE1" p-id="28378" /><path d="M516.949333 758.101333a182.784 182.784 0 0 0 80.725334-17.066666A139.946667 139.946667 0 0 1 597.333333 682.666667l-85.333333 1.024-85.333333-1.024a136.533333 136.533333 0 0 1-1.536 59.733333 197.461333 197.461333 0 0 0 91.818666 15.701333z" fill="#FFCFAE" p-id="28379" /><path d="M97.621333 439.978667a112.469333 108.885333 0 1 0 224.938667 0 112.469333 108.885333 0 1 0-224.938667 0Z" fill="#FFEDE1" p-id="28380" /><path d="M706.730667 439.978667a109.909333 108.885333 0 1 0 219.818666 0 109.909333 108.885333 0 1 0-219.818666 0Z" fill="#FFEDE1" p-id="28381" /><path d="M152.064 439.978667a46.933333 45.397333 0 1 0 93.866667 0 46.933333 45.397333 0 1 0-93.866667 0Z" fill="#FFCFAE" p-id="28382" /><path d="M778.069333 439.978667a46.933333 45.397333 0 1 0 93.866667 0 46.933333 45.397333 0 1 0-93.866667 0Z" fill="#FFCFAE" p-id="28383" /><path d="M225.962667 274.602667S140.970667 443.733333 204.8 584.021333c86.528 189.269333 529.066667 190.293333 617.301333-5.802666 61.269333-136.533333-32.256-305.493333-32.256-305.493334l-201.898666-42.666666a354.816 354.816 0 0 0-145.066667 0z" fill="#FFEDE1" p-id="28384" /><path d="M486.570667 530.261333a25.429333 15.36 0 1 0 50.858666 0 25.429333 15.36 0 1 0-50.858666 0Z" fill="#FFCFAE" p-id="28385" /><path d="M733.866667 546.133333a8.533333 8.533333 0 0 1-7.509334-4.608l-8.533333-17.066666a8.533333 8.533333 0 1 1 15.189333-7.850667l8.533334 17.066667a8.533333 8.533333 0 0 1-3.754667 11.434666 8.362667 8.362667 0 0 1-3.925333 1.024zM778.410667 546.133333a8.533333 8.533333 0 0 1-7.509334-4.608l-8.533333-17.066666a8.533333 8.533333 0 1 1 15.189333-7.850667l8.533334 17.066667a8.533333 8.533333 0 0 1-3.754667 11.434666 8.362667 8.362667 0 0 1-3.925333 1.024zM290.133333 546.133333a8.362667 8.362667 0 0 1-3.925333-1.024 8.533333 8.533333 0 0 1-3.754667-11.434666l8.533334-17.066667a8.533333 8.533333 0 0 1 15.189333 7.850667l-8.533333 17.066666A8.533333 8.533333 0 0 1 290.133333 546.133333zM245.589333 546.133333a8.362667 8.362667 0 0 1-3.925333-1.024 8.533333 8.533333 0 0 1-3.754667-11.434666l8.533334-17.066667a8.533333 8.533333 0 0 1 15.189333 7.850667l-8.533333 17.066666a8.533333 8.533333 0 0 1-7.509334 4.608z" fill="#FF4545" p-id="28386" /><path d="M777.898667 938.666667l-25.088-69.632A132.778667 132.778667 0 0 0 631.466667 781.312c-4.437333 38.912-55.808 69.802667-119.466667 69.802667s-114.346667-30.72-119.466667-69.802667a132.778667 132.778667 0 0 0-122.026666 87.552L246.101333 938.666667a32.768 32.768 0 0 0 13.653334 39.082666C290.133333 996.522667 360.96 1024 512 1024s221.866667-27.477333 252.074667-46.592a32.768 32.768 0 0 0 13.824-38.741333z" fill="#C2A6FF" p-id="28387" /><path d="M456.874667 587.776c10.069333-11.264 25.6 2.218667 53.418666 2.218667s35.84-20.821333 52.906667-8.704-4.608 57.173333-52.906667 59.050666c-45.226667 1.877333-72.874667-31.061333-53.418666-52.565333z" fill="#FF4545" p-id="28388" /><path d="M483.144429 627.10327a9.728 25.258667 87.7 1 0 50.476636-2.027351 9.728 25.258667 87.7 1 0-50.476636 2.027351Z" fill="#FF9999" p-id="28389" /><path d="M202.922667 331.264s297.130667 36.864 406.869333-73.216c0 0 39.594667 86.528 208.213333 73.045333 0 0 34.133333-174.592-308.736-174.592S202.922667 331.264 202.922667 331.264z" fill="#D35BE8" p-id="28390" /><path d="M643.242667 443.733333l20.821333-18.944a34.133333 34.133333 0 0 0-28.16-15.36 36.693333 36.693333 0 1 0 34.133333 40.106667zM398.677333 443.733333l20.821334-18.944a34.133333 34.133333 0 0 0-28.16-15.36 36.693333 36.693333 0 1 0 34.133333 40.106667z" fill="#302B28" p-id="28391" /><path d="M264.874667 299.349333a8.533333 8.533333 0 0 1-5.632-2.218666l-50.176-44.714667a8.533333 8.533333 0 0 1 11.434666-12.8l50.176 44.714667a8.533333 8.533333 0 0 1-5.632 14.848zM303.274667 276.48a8.533333 8.533333 0 0 1-5.632-2.218667l-50.176-44.544a8.533333 8.533333 0 1 1 11.434666-12.8l50.176 44.714667a8.533333 8.533333 0 0 1-5.632 14.848z" fill="#C2A6FF" p-id="28392" /></svg>
          <span class="login_name">{{ login_name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'login_name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 35px;

      .avatar-wrapper {
        margin-top: 8px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
        }

        .login_name {
         font-size: 14px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 23px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
