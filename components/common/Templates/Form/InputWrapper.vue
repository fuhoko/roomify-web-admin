<template>
  <ValidationProvider v-slot="{ errors }" :rules="rules">
    <slot></slot>
    <transition name="fade">
      <div class="text-danger">
        {{ $t(errors[0]) }}
      </div>
    </transition>
  </ValidationProvider>
</template>
<script>
import { ValidationProvider } from 'vee-validate'
export default {
  name: 'InputWrapper',
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
