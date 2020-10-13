<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '数字中欧',
      logo: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABFCAYAAADgmADjAAAHDElEQVR4nOVca6hVRRT+Rs1nplamKZYS+aiwlOL2ullqkiZZkkEPBIk0IkvKkMIIIioQjNBeFNJDKSrL1OJCmYpeMiq9ZMlNLfOVouYjS9Or94ulc+B07szs2bMf51z94P7ZZ2bNWp+z16xZa21RCSA5jeQmnsRxkvUkZ5GsJtmiIpSsFJC8im7sJPk6yRtPd65OgORXEYQV40uSXStA7fKA5NgYZBWwlmTH05GsHiR3BRAmmFMBJuQHkmeQrA0kq4DZJFufLoS9lJCsAsSnta0Ak7IDybsiSNhA8lAM0j4iqU5VsvqTPGgxfBXJQXpcO5JTSO73JO3p8luXMjQJay0GTzMFqCR7klzpQdgxklc3d47+B5JvWYx9KmJeG5IfepBWf8r4M5J3W4z8xMf/kGxJcp4Hac/lY1GGIHmxxW9tI3m278qatHciCGsgeWlz5OkEJE4iudpgWCPJYQHyFMnXIkirbbanJskXLUbNTiBTebyeE9O1JAeQHKJ3Uin+IHlWEg30zl3iIGwfyW7NhSsxqCPJLRZj7kxpjfNIbneQNjeNdXIByZctRixOc32SIyJezeGVy5KGBJA6a1oKOSkvzGC92Q7CNlZ0bCZhAsnfLMrfn9Ga7Umud5D2bBbrJoZ2xEstSr8dV76O8Lt5BrZV+npkwhGSA8pCig36qLcFlZtJnukhQwLTYSRf0decAuQCPpfklRHzn3HssuUVFZvJtncoO9IxT4i+TleIdjpkFPA1ydslAWmQ1Yrkd465D2ZOhA/ENzmUfM8kgmQfvSM2epBkwp86CdmvRO5Ax6v5F8le5SbrFoeCsmPOLRorPumeiIAzBCJvTOGVE3/pkPF5Ocka5EgGHpYirB7Xj+RMkntSJqoUa0jeQXJwxLh7k9gd5Ah1PLUKQHfDz8cBPACgEcAEAEOSKBiALQAucEzbC2CgUmp7iPDYhEncA6AWwBWWIccAtNB/lYovAIxWSjFTwrSf+BjA2IyIkN3xI4BfAewCcAhAZwDiC/sAkJz/+SmtNVEp9WZKssxwpGtCITHW+yTHy2XaU4fu2ldJyntHgrXl1OyTJVkPp0iUnGzj5ORMqJMEu6O0ww/B0kwCWpL3pUCS5MY+yCKFrIPW0N0/JW1lbnPEWr5YUKg5ZgkdUswhuTeGbodKA+AkZA0neTQBUYtKidLXISno3pBVF47u3Riud7RP/CdF5JZJFx0as2RfjBpTYVWnYlYUjdsqTjyRon623KqrVC4466NRC1QHkrWM5DUOuVMMc+YH6iiu4g39uk+XynrE+K4RVXRJAw2Oq4ScOiNJHgggKrKl0nGPHBdDx9aWVNKTHnPb64yHDRt8UlEiqK1sSZK7YxJVJxfwGMba5Es8dq3H/C6OJOUCTx1K3UIp3nXNV7opbQmA630N1xH5dADzlFKNvpNEsYghmwCsBLAGwA59vbocQBUAOSB6ArCVz9YppbxCFpKd9DqXWYY8opSaZZscp7lN6n1TQwoLJDvEWCcEf8fUp7ejZVSKOCNsEw97KCdjZsgrEZeoonU6Z0wYoxy/Qadq3Y9hwn5jfBZx3DZqB+tKl1QSYb0D9JrqkPdLk01iaf3+V9LLkvJNSlTROl08DJZ/oO910aMugLCqAL3Ejy92yPy0yX1T92/JybGQ5ENx2pBiKNbbopCEMM/rDERxSlvpgHOmbqj7xoOw0YG69dDZCxseT5UMT6VshHmnjHWw6urtn5BAv8kOuQ0huzcRLITJadQhpmF9HbeQ4MyDznj87CDtJwnB8kwjmz5CqFdK/RNHiFJqPYCFlp87hal2Qq6k1l2vnsR4E/MkrL3h2e5AWd9angcThpOk1QCocQyZXO5ChYlEH2y2jEnUqKcxGcARy28XlZuw0G+Ffrc8T7TDcHKXbQTwmOXnz1olXSAGorMA/thiGZmoRlCAUupVOVgATALQF8BRAIsAPJGiDW5I+sdw8tQlkGe60i3L2o7m/D31HsOzVHaYC3kSlvZapnAk1uU7BHkSZjrBkvSfmghr0jeWNsr9SiYh7KDhWaxbQwiasw87YHiW+amfJ2EmhxwauApMGdY0Qxcj8iTM5JCTfOTeYHiWeU9+uV/JdgmaQUxZ4DaJK9gRqISrUf+4k3S1vNryc6b/CUiehNkMeTRA1gyHg8+UsDzvkrZXZZKu9szQ+bFjpQMkuQdggK6dSpX8Jsc6mYYWeRLmwnj9J21VW4taNiXY7aXJ8j0gEmcsXMjtcxKSlwBYrvtVM1sGQA+l1M6sFsjNhyml1gEYCiCo3dsT87MkqyzQJS1XM0gIpIXhBd0SnynK8oWXjr3GSFEBwM0xfal8OLFNDggAP+hGmhVKKVMgmzrK/kkcyXMAjAIgjXhS+5MMZ+GKsw+AHAKrdeFDPqiQkzQXcpoAwH8DeWVu8JW8cAAAAABJRU5ErkJggg=='
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
