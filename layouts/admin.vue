<template>
  <div>
    <Loading />
    <!-- Sidebar -->
    <b-sidebar
      shadow
      :visible="NavbarOpen"
      slide
      no-close-on-route-change
      bg-variant="white"
      @shown="NavbarOpen = true"
      @hidden="NavbarOpen = false"
    >
      <template v-slot:title>
        <div class="w-50" style="font-size: 15px; color: #dc2f2f">
          <nuxt-link to="/" style="color: #dc2f2f">
            ROOMIFY MANAGEMENT
          </nuxt-link>
        </div>
      </template>
      <SidebarAdmin />
    </b-sidebar>
    <!-- Content -->
    <div :class="myClass" style="min-height: 100vh">
      <NavbarAdmin />
      <div class="flex-grow-1 d-flex flex-column">
        <h4 class="header">
          {{ title }}
        </h4>
        <div class="content">
          <nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  components: {
    NavbarAdmin: () =>
      import('~/components/common/Layout/Admin/NavbarAdmin.vue'),
    SidebarAdmin: () =>
      import('~/components/common/Layout/Admin/SidebarAdmin.vue'),
    Loading: () => import('~/components/common/Templates/Loading.vue')
  },
  data() {
    return {
      myClass: 'on-open d-flex flex-column',
      loading: true,
      title: 'No title',
      NavbarOpen: true
    }
  },
  mounted() {
    this.loading = false
    if (window.innerWidth < 991.98) {
      this.NavbarOpen = false
    }
  },
  created() {
    this.notifyToast('success', 'Success', 'Welcome to Roomify Management')
    this.$bus.$on('title', (title) => {
      this.title = title
    })
    this.$bus.$on('toggleNav', () => {
      this.NavbarOpen = !this.NavbarOpen
      this.myClass =
        this.myClass === 'on-open d-flex flex-column'
          ? 'on-close d-flex flex-column'
          : 'on-open d-flex flex-column'
    })
  }
}
</script>
<style lang="scss" scoped>
.on-open {
  position: relative;
  left: 320px;
  width: calc(100% - 320px);
  transition: all 0.3s;
}
.header {
  box-shadow: $shadow-bottom;
  padding: 0.7rem 1.5rem;
  margin: 0;
  height: 50px;
}
.content {
  background-color: $gray-300;
  padding: 2rem 1.5rem;
  flex-grow: 1;
}
@media (max-width: 991.98px) {
  .on-open {
    position: relative;
    left: 0;
    width: 100%;
  }
}
</style>
