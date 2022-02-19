<template>
  <div>
    <transition name="fade">
      <div v-if="loading" class="loading">
        <b-spinner class="spinner-icon"></b-spinner>
      </div>
    </transition>
    <nuxt />
  </div>
</template>

<script>
export default {
  name: 'Default',
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.loading = false
  }
}
</script>
<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $white; /* Just to visualize the extent */
  z-index: 9999;
}
.spinner-icon {
  position: fixed; /* change this to fixed */
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 50px;
  height: 50px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
