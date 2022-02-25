<template>
  <div class="wrapper">
    <div class="form-wrapper">
      <b-row style="height: 100%">
        <b-col md="8" class="form-background">
          <h1
            style="
              color: white;
              font-size: 50px;
              margin-top: 20px;
              margin-left: 10px;
            "
            class=""
          >
            Roomify Management
          </h1>
        </b-col>
        <b-col md="4">
          <div
            class="mt-20"
            style="
              width: 80%;
              margin: auto;
              text-align: center;
              margin-top: 30px;
            "
          >
            <b-avatar
              variant="info"
              :src="require('~/assets/img/default-man.png')"
              size="7rem"
            ></b-avatar>
            <h1
              style="
                font-size: 30px;
                color: rgb(73, 64, 71);
                margin-bottom: 12px;
              "
            >
              Welcome to Roomify
            </h1>
            <ValidationObserver v-slot="{ handleSubmit }">
              <b-form @submit.prevent="handleSubmit(onSubmit)">
                <ValidationProvider
                  v-slot="{ errors }"
                  mode="lazy"
                  rules="required"
                >
                  <b-form-group>
                    <b-input-group>
                      <template v-slot:prepend>
                        <b-input-group-text>
                          <fa :icon="['fas', 'envelope']" />
                        </b-input-group-text>
                      </template>
                      <b-form-input
                        class="login-input"
                        v-model="username"
                        :disabled="processing"
                        type="text"
                        :placeholder="'Username'"
                      ></b-form-input>
                    </b-input-group>
                    <transition name="fade">
                      <p class="text-danger" style="margin: 0px">
                        {{ $t(errors[0]) }}
                      </p>
                    </transition>
                  </b-form-group>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors }"
                  mode="lazy"
                  rules="required"
                >
                  <b-form-group>
                    <b-input-group style="margin: 0px">
                      <template v-slot:prepend>
                        <b-input-group-text>
                          <fa :icon="['fas', 'lock']" />
                        </b-input-group-text>
                      </template>
                      <b-form-input
                        class="login-input"
                        v-model="password"
                        :disabled="processing"
                        type="password"
                        :placeholder="$t('login.password')"
                      ></b-form-input>
                    </b-input-group>
                    <p class="text-danger" style="margin: 0px">
                      {{ $t(errors[0]) }}
                    </p>
                  </b-form-group>
                </ValidationProvider>
                <b-button
                  type="submit"
                  class="button-input"
                  :disabled="processing"
                >
                  <b-spinner small type="grow" v-if="processing"></b-spinner>
                  {{ $t('login.button') }}
                </b-button>
              </b-form>
            </ValidationObserver>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  middleware: 'AdminAuthNotRequired',
  components: {},
  data() {
    return {
      username: '',
      password: '',
      processing: false
    }
  },
  created() {
    if (process.client) {
      this.$store.dispatch('logout')
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.processing = true
        const loginResponse = await this.$axios.post('/auth/login', {
          username: this.username,
          password: this.password
        })
        const userResponse = await this.$axios.get('/auth/me', {
          headers: {
            Authorization: 'Bearer ' + loginResponse.data.token
          }
        })
        if (userResponse.data.status == 'ACTIVE') {
          if (
            userResponse.data.role == 'ADMIN' ||
            userResponse.data.role == 'MODERATOR'
          ) {
            Cookie.set('token', loginResponse.data.token, {
              expires: 1
            })
            // this.$cookies.set('token', loginResponse.data.token, {
            //   path: '/',
            //   maxAge: 60 * 60 * 24 * 7
            // })
            // Save token in state for other uses
            this.notifyToast('success', 'Success', 'Login successfully')
            this.$store.commit('user/SET_TOKEN', loginResponse.data.token)
            console.log('!!!!', this.$store.state.user.token)
            this.$store.commit('user/SET_USER', userResponse.data)
            this.$router.push('/users')
          } else {
            this.notifyToast('error', 'Error', 'Not enough permission')
            this.processing = false
          }
        } else {
          this.notifyToast('error', 'Error', 'Your account is banned')
          this.processing = false
        }
      } catch (error) {
        this.notifyToast(
          'error',
          'Error',
          'Login failed, check your infomation'
        )
        this.processing = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  width: 100%;
  background-color: rgb(213, 213, 243);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.form-wrapper {
  border: none;
  border-radius: 8px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1200px;
  height: 550px;
  background-color: $white;
  color: $black;
  box-shadow: $shadow-darker;
}
.form-background {
  overflow: hidden;
  border-radius: 8px;
  background-image: url('~@/assets/img/login_bg.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.login-input {
  border: none;
  box-shadow: none;
  background-color: rgb(213, 213, 243);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
