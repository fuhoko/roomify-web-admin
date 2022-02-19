<template>
  <div class="wrapper">
    <ValidationObserver v-slot="{ handleSubmit }">
      <b-form @submit.prevent="handleSubmit(addUser)">
        <!-- Email -->
        <ValidationProvider
          v-slot="{ errors }"
          mode="lazy"
          rules="required|email"
        >
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.email"
              :disabled="processing"
              placeholder="Enter email"
            ></b-form-input>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <!-- username -->
        <ValidationProvider
          v-slot="{ errors }"
          mode="lazy"
          rules="required|min:6"
        >
          <b-form-group
            id="input-group-2"
            label="Username:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              v-model="form.username"
              :disabled="processing"
              placeholder="Enter name"
            ></b-form-input>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <!-- fullName -->
        <ValidationProvider
          v-slot="{ errors }"
          mode="lazy"
          rules="required|min:6"
        >
          <b-form-group
            id="input-group-2"
            label="Fullname:"
            label-for="input-2"
          >
            <b-form-input
              id="input-2"
              v-model="form.fullName"
              :disabled="processing"
              placeholder="Enter name"
            ></b-form-input>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <!-- Phone -->
        <ValidationProvider
          v-slot="{ errors }"
          mode="lazy"
          rules="required|min:10"
        >
          <b-form-group id="input-group-2" label="Phone:" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.phone"
              :disabled="processing"
              placeholder="Enter name"
            ></b-form-input>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <!-- Role -->
        <ValidationProvider v-slot="{ errors }" mode="lazy" rules="required">
          <b-form-group id="input-group-4" :label="'Role'" label-for="input-4">
            <b-form-select
              id="input-4"
              v-model="form.roleId"
              :options="roleOptions"
              :disabled="processing"
            ></b-form-select>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <!-- Password -->
        <ValidationProvider
          v-slot="{ errors }"
          mode="lazy"
          rules="required|min:6"
        >
          <b-form-group
            id="input-group-5"
            label="Password:"
            label-for="input-5"
          >
            <b-form-input
              id="input-5"
              v-model="form.password"
              :disabled="processing"
              type="password"
              placeholder="Enter password"
            ></b-form-input>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <b-button
          variant="primary"
          type="submit"
          size="sm"
          :disabled="processing"
        >
          <b-spinner small type="grow" v-if="processing"></b-spinner>
          Submit
        </b-button>
      </b-form>
    </ValidationObserver>
  </div>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  name: 'UserCreate',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  components: {},
  data() {
    return {
      form: {
        username: '',
        fullName: '',
        email: '',
        password: '',
        phone: '',
        roleId: ''
      },
      selectedRole: null,
      roleOptions: [
        {
          value: null,
          text: this.$t('placeholder.role'),
          disabled: true
        },
        { value: 1, text: 'ADMIN', disabled: true },
        { value: 2, text: 'MODERATE', disabled: true },
        { value: 3, text: 'OWNER' },
        { value: 4, text: 'USER' }
      ],
      processing: false
    }
  },
  created() {
    this.$bus.$emit('title', 'Add user')
  },
  methods: {
    async addUser() {
      try {
        this.processing = true
        if (this.$store.state.user.currentUser.role == 'ADMIN') {
          await this.$axios.post('/users', this.form, {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          })
          this.notifyToast('success', 'Success', 'Create new user success')
          setTimeout(() => {
            this.$router.push('/users')
          }, 1500)
        } else {
          this.notifyToast('error', 'Error', 'Only Admin can create new user')
          setTimeout(() => {
            this.$router.push('/users')
          }, 1500)
        }
      } catch (error) {
        this.notifyToast('error', 'Error', 'Create new user failed')
        this.processing = false
      }
    }
  },
  head() {
    return {
      title: 'Create user'
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  background-color: $white;
  box-shadow: $shadow;
  padding: 1rem;
}
</style>
