import Vue from 'vue'
Vue.mixin({
  data() {
    return {
      mixinMessage: 'Hello from mixin'
    }
  },
  methods: {
    sayHello(name) {
      // eslint-disable-next-line
      console.log(`Hello ${name}, I'm printed from Vue-Mixin`)
    },
    notifyToast(type, title, message) {
      //console.log(`Hello ${type}, I'm printed from Vue-Mixin`)
      if (type == 'success') {
        this.$bvToast.toast(message, {
          title: title,
          variant: 'success',
          autoHideDelay: 3000,
          solid: true
        })
      }
      if (type == 'error') {
        // Array of messages
        this.$bvToast.toast(message, {
          title: title,
          variant: 'danger',
          autoHideDelay: 3000,
          solid: true
        })
      }
    }
  }
})
