import Vue from 'vue'
Vue.mixin({
  methods: {
    notifyToast(type) {
      console.log(`Hello ${type}, I'm printed from Vue-Mixin`)
      // if (type == 'success') {
      //   this.$bvToast.toast('Success', {
      //     title: 'Good',
      //     variant: 'success',
      //     autoHideDelay: 2000,
      //     solid: true
      //   })
      // }
      // if (type == 'error') {
      //   // Array of messages
      //   this.$bvToast.toast('Error', {
      //     title: 'Failed',
      //     variant: 'danger',
      //     autoHideDelay: 2000,
      //     solid: true
      //   })
      // }
    }
  }
})
