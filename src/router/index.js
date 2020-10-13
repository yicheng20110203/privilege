import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/common/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/management',
    children: [{
      path: 'management',
      name: 'UserList',
      component: () => import('@/views/user/userlist'),
      meta: { title: '用户管理', icon: 'useradmin' }
    }]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/sys-list',
    meta: { title: '管理员管理', icon: 'admin' },
    children: [{
      path: 'sys-list',
      name: 'SysList',
      component: () => import('@/views/sys/list'),
      meta: { title: '管理员列表', icon: 'list' }
    },
    {
      path: 'sys-role',
      name: 'SysRoles',
      component: () => import('@/views/sys/role'),
      meta: { title: '角色管理', icon: 'roles' }
    },
    {
      path: 'sys-menus',
      name: 'SysMenus',
      component: () => import('@/views/sys/menu'),
      meta: { title: '菜单管理', icon: 'list' }
    }]
  },
  // {
  //   path: '/course',
  //   component: Layout,
  //   redirect: '/course/lesson-package',
  //   meta: { title: '课程管理', icon: 'course' },
  //   children: [{
  //     path: 'lesson-package',
  //     name: 'LessonPackage',
  //     component: () => import('@/views/course/package/lessonpackage-management'),
  //     meta: { title: '课包管理', icon: 'course' }
  //   },
  //   {
  //     path: 'add-or-update-lessonpackage',
  //     name: 'AddOrUpdateLessonPackage',
  //     hidden: true,
  //     component: () => import('@/views/course/package/add-or-update-lessonpackage'),
  //     meta: { title: '创建课包', icon: 'course', activeMenu: '/course/lesson-package' }
  //   },
  //   {
  //     path: 'course-management',
  //     name: 'CourseManagement',
  //     component: () => import('@/views/course/management/course-management'),
  //     meta: { title: '课程管理', icon: 'course-module' },
  //     children: []
  //   },
  //   {
  //     path: 'add-or-update-course',
  //     name: 'AddOrUpdateCourse',
  //     hidden: true,
  //     component: () => import('@/views/course/management/add-or-update-course'),
  //     meta: { title: '创建课程', icon: 'course-module' }
  //   },
  //   {
  //     path: 'course-chapter',
  //     name: 'ChapterManagement',
  //     component: () => import('@/views/course/chapter/chapter-management'),
  //     meta: { title: '章节管理', icon: 'course-package' },
  //     children: []
  //   },
  //   {
  //     path: 'add-or-update-chapter',
  //     name: 'AddOrUpdateChapter',
  //     hidden: true,
  //     component: () => import('@/views/course/chapter/add-or-update-chapter'),
  //     meta: { title: '创建章节', icon: 'course-package' }
  //   },
  //   {
  //     path: 'content-management',
  //     name: 'ContentManagement',
  //     component: () => import('@/views/course/content/content-management'),
  //     meta: { title: '内容管理', icon: 'course-package' },
  //     children: []
  //   },
  //   {
  //     path: 'create-or-update-video',
  //     name: 'CreateOrUpdateVideo',
  //     hidden: true,
  //     component: () => import('@/views/course/content/content-add-or-update-video'),
  //     meta: { title: '创建视频', icon: 'course-package', activeMenu: '/course/content-management' }
  //   },
  //   {
  //     path: 'create-or-update-audio',
  //     name: 'CreateOrUpdateAudio',
  //     hidden: true,
  //     component: () => import('@/views/course/content/content-add-or-update-audio'),
  //     meta: { title: '创建音频', icon: 'course-package', activeMenu: '/course/content-management' }
  //   },
  //   {
  //     path: 'create-or-update-article',
  //     name: 'CreateOrUpdateArticle',
  //     hidden: true,
  //     component: () => import('@/views/course/content/content-add-or-update-article'),
  //     meta: { title: '创建文章', icon: 'course-package', activeMenu: '/course/content-management' }
  //   },
  //   {
  //     path: 'create-or-update-image',
  //     name: 'CreateOrUpdateImage',
  //     hidden: true,
  //     component: () => import('@/views/course/content/content-add-or-update-image'),
  //     meta: { title: '创建图片', icon: 'course-package', activeMenu: '/course/content-management' }
  //   }]
  // },
  // {
  //   path: '/basic',
  //   component: Layout,
  //   redirect: '/basic/management/page-management',
  //   meta: { title: '基础管理', icon: 'basic' },
  //   children: [{
  //     path: 'management',
  //     name: 'management',
  //     redirect: '/basic/management/page-management',
  //     component: () => import('@/views/basic/management'),
  //     meta: { title: '页面管理', icon: 'basic' },
  //     children: [{
  //       path: 'page-management',
  //       name: 'PageManagement',
  //       component: () => import('@/views/basic/management/page-management'),
  //       meta: { title: '页面管理', icon: 'basic' }
  //     },
  //     {
  //       path: 'build-page',
  //       name: 'BuildPage',
  //       component: () => import('@/views/basic/management/build-page'),
  //       meta: { title: '搭建页面', icon: 'basic' }
  //     }]
  //   },
  //   {
  //     path: 'material-management',
  //     name: 'MaterialManagement',
  //     component: () => import('@/views/basic/material-management'),
  //     meta: { title: '素材管理', icon: 'basic' }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

/**
 * 调用的addRoutes()方法是router自带的原生方法，是动态添加路由的，没有删除之前路由中原有的路由！！
 * 在动态添加路由时，清空一下之前的路由，就可以防止报这个错误
 */
router.selfaddRoutes = function(params) {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  router.addRoutes(params)
}

router.$addRoutes = (params) => {
  router.matcher = createRouter({
    mode: 'history'
  }).matcher
  router.addRoutes(params)
}

export default router
