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
          rules="required|min:4"
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
              placeholder="Enter username"
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
          rules="required|min:4"
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
              placeholder="Enter full name"
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
              placeholder="Enter phone number"
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
              v-model="form.roles.id"
              :options="roleOptions"
              :disabled="processing"
            ></b-form-select>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <!-- avatar -->
        <ValidationProvider v-slot="{ errors }" mode="lazy" rules="required">
          <b-form-group
            id="input-group-7"
            label="Thumbnail image:"
            label-for="input-7"
          >
            <!-- <b-img
              v-if="thumbnailFile != null"
              :src="previewImage"
              height="400"
              width="400"
            ></b-img> -->
            <b-img
              :src="previewImage"
              height="100"
              width="100"
              class="mb-3"
            ></b-img>
            <div v-if="thumbnailFile != null" class="mb-4">
              <b-button
                size="sm"
                class="mt-4"
                variant="primary"
                :disabled="processing"
                @click="uploadImage"
              >
                Upload
              </b-button>
              <b-button
                size="sm"
                class="mt-4"
                variant="danger"
                :disabled="processing"
                @click="cancelImage"
              >
                Cancel
              </b-button>
            </div>
            <b-input-group>
              <b-form-input
                id="input-7"
                v-model="form.avatar"
                disabled
                placeholder="Upload thumbnail"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  variant="outline-secondary"
                  :disabled="processing"
                  @click="$refs.thumbnail.$el.childNodes[0].click()"
                >
                  Upload
                </b-button>
              </b-input-group-append>
            </b-input-group>
            <p class="text-danger">
              {{ $t(errors[0]) }}
            </p>
          </b-form-group>
        </ValidationProvider>
        <b-form-file
          ref="thumbnail"
          v-model="thumbnailFile"
          class="mt-3"
          name="photo"
          :disabled="processing"
          accept="image/jpeg, image/png"
          size="sm"
          style="display: none"
          @change="previewThumbnail"
        ></b-form-file>
        <b-button
          pill
          variant="outline-danger"
          size="md"
          style="margin-right: 5px"
          @click="$router.push('/users')"
        >
          Go back
        </b-button>
        <b-button
          pill
          variant="danger"
          type="submit"
          size="md"
          :disabled="processing"
          @click="addUser()"
        >
          <b-spinner small type="grow" v-if="processing"></b-spinner>
          Update
        </b-button>
      </b-form>
    </ValidationObserver>
  </div>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  name: 'Edit',
  layout: 'admin',
  components: {},
  data() {
    return {
      form: {
        username: '',
        fullName: '',
        avatar: '',
        email: '',
        phone: '',
        roles: {
          id: ''
        }
      },
      selectedRole: null,
      roleOptions: [
        { value: 1, text: 'ADMIN', disabled: true },
        { value: 2, text: 'MODERATE', disabled: true },
        { value: 3, text: 'OWNER' },
        { value: 4, text: 'USER' }
      ],
      previewImage: '',
      thumbnailFile: null,
      processing: false
    }
  },
  created() {
    this.$bus.$emit('title', 'Edit user')
    this.getUser()
  },
  methods: {
    previewThumbnail(e) {
      this.previewImage = URL.createObjectURL(e.target.files[0])
    },
    async addUser() {
      try {
        this.processing = true
        if (this.$store.state.user.currentUser.role == 'ADMIN') {
          await this.$axios.patch(
            `/users/${this.$route.params.id}`,
            this.form,
            {
              headers: {
                Authorization: 'Bearer ' + Cookie.get('token')
              }
            }
          )
          this.notifyToast('success', 'Success', 'Update user success')
          setTimeout(() => {
            this.$router.push('/users')
          }, 1500)
        } else {
          this.notifyToast('error', 'Error', 'Only Admin can update user')
          setTimeout(() => {
            this.$router.push('/users')
          }, 1500)
        }
      } catch (error) {
        console.log(error)
        this.notifyToast(
          'error',
          'Error',
          'Update user failed, check your permission'
        )
        this.processing = false
      }
    },
    async getUser() {
      try {
        const user = await this.$axios.get(`/users/${this.$route.params.id}`, {
          headers: {
            Authorization: 'Bearer ' + Cookie.get('token')
          }
        })
        this.form.username = user.data.username
        this.form.fullName = user.data.fullName
        this.form.avatar = user.data.avatar
        this.previewImage = user.data.avatar
        this.form.email = user.data.email
        this.form.roles.id = user.data.roles[0].id
        this.form.phone = user.data.phone
      } catch (error) {
        this.processing = false
      }
    },
    cancelImage() {
      this.thumbnailFile = null
      this.previewImage = this.form.avatar
    },
    async uploadImage() {
      try {
        this.processing = true
        const data = new FormData()
        data.append('image', this.thumbnailFile)
        const response = await this.$axios.post(`/image`, data, {
          headers: {
            Authorization: 'Bearer ' + Cookie.get('token')
          }
        })
        this.form.avatar = response.data
        this.previewImage = response.data
        this.notifyToast('success', 'Success', 'Change avatar success')
      } catch {
        this.notifyToast('error', 'Error', 'Change avatar failed')
      } finally {
        this.thumbnailFile = null
        this.processing = false
      }
    }
  },
  middleware: 'AdminAuthRequired',
  head() {
    return {
      title: 'Edit user'
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
