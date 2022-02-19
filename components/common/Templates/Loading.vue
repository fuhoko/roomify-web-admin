<template>
  <transition name="fade">
    <div v-if="loading" class="loading">
      <b-spinner class="spinner-icon"></b-spinner>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Loading',
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
  background: $white;
  z-index: 10000;
}
.spinner-icon {
  position: fixed;
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
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
