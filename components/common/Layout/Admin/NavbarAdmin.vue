<template>
  <b-navbar toggleable="sm" type="dark" variant="tech-red">
    <b-navbar-brand>
      <fa
        :icon="['fas', `bars`]"
        style="cursor: pointer; user-select: none"
        @click="toggleNav"
      />
    </b-navbar-brand>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-dropdown
        v-if="$store.state.user.currentUser != null"
        right
        size="lg"
        variant="link"
        toggle-class="text-decoration-none p-0"
        no-caret
      >
        <template v-slot:button-content>
          <b-avatar
            v-if="$store.state.user.currentUser.avatar == null"
            variant="info"
            :src="require('~/assets/img/default-man.png')"
            size="sm"
          ></b-avatar>
          <b-avatar
            v-else
            variant="info"
            :src="$store.state.user.currentUser.avatar"
            size="sm"
          ></b-avatar>
        </template>
        <b-dropdown-item @click="$router.push('/auth/profile')">
          <strong> {{ $store.state.user.currentUser.fullName }}</strong>
        </b-dropdown-item>
        <b-dropdown-item @click="logout">
          Logout
        </b-dropdown-item>
      </b-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'NavbarAdmin',
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/auth/login')
    },
    toggleNav() {
      this.$bus.$emit('toggleNav')
    }
  }
}
</script>
<style lang="scss" scoped>
.icon {
  font-size: 1.2rem;
  color: $white;
  cursor: pointer;
  user-select: none;
}
</style>
