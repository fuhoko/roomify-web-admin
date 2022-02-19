import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
extend('required', {
  ...required,
  message: 'Field can not be empty'
})
extend('email', {
  ...email,
  message: 'Invalid Email'
})
extend('min', {
  validate(value, { length }) {
    return value.length >= length
  },
  params: ['length'],
  message: `Field Required {length} Characters`
})
extend('max', {
  validate(value, { length }) {
    return value.length <= length
  },
  params: ['length'],
  message: `Field Max {length} Characters`
})
extend('between', {
  validate(value, { min, max }) {
    return parseInt(value) >= parseInt(min) && parseInt(value) <= parseInt(max)
  },
  params: ['min', 'max'],
  message: `Field Between {min} And {max}`
})
extend('numeric', {
  validate(value) {
    return String(value).match(/^[+-]?\d+(\.\d+)?$/)
  },
  message: 'Must Be Numeric'
})
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
