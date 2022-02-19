<template>
  <div class="wrapper">
    <h4 class="color-red" style="font-weight: bold">
      Owner Information
    </h4>
    <b-row>
      <b-col cols="3" class="pl-5 pt-3">
        <b-avatar
          variant="info"
          :src="ownerInfo.avatar"
          size="8rem"
          style="border: 3px solid red"
        ></b-avatar>
      </b-col>
      <b-col cols="9">
        <p>
          Full Name: <label for="">{{ ownerInfo.fullName }}</label>
        </p>
        <p>
          Username: <label for="">{{ ownerInfo.username }}</label>
        </p>
        <p>
          Email: <label for="">{{ ownerInfo.email }}</label>
        </p>
        <p>
          Phone: <label for="">{{ ownerInfo.phone }}</label>
        </p>
        <p style="display: flex">
          Status:
          <b-form-checkbox
            v-model="checked"
            name="check-button"
            size="lg"
            style="margin-left: 9px"
            switch
            disabled
          >
          </b-form-checkbox>
        </p>
      </b-col>
    </b-row>
    <hr />
    <h4 class="color-red" style="font-weight: bold">
      Registration Infomation
    </h4>
    <b-row>
      <b-col cols="6" class="ml-2">
        <p>
          Owner Name: <label for="">{{ ownerInfo.fullName }}</label>
        </p>
        <p>
          Citizen ID: <label for="">{{ registration.IDNumber }}</label>
        </p>
        <p>
          Created At:
          <label for="">
            {{
              $moment(registration.createdAt).format('h:mm:ssa Do-MMMM-YYYY')
            }}
          </label>
        </p>
      </b-col>
      <b-col cols="5">
        <b-button pill variant="danger" size="md">
          {{ registration.status }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div>
          <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="4000"
            controls
            indicators
            background="#ababab"
            img-width="1024"
            img-height="480"
            style="text-shadow: 1px 1px 2px #333"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
          >
            <!-- Text slides with image -->
            <b-carousel-slide
              v-for="item in imageList"
              :key="item"
              caption="Resgistration"
              :img-src="item"
            ></b-carousel-slide>
          </b-carousel>
        </div>
      </b-col>
    </b-row>
    <hr />
    <b-row class="mt-4" style="padding-left: 800px">
      <b-button
        pill
        variant="outline-danger"
        size="md"
        class="mr-2"
        @click="denie()"
      >
        Delete
      </b-button>
      <b-button pill variant="danger" size="md" @click="accept()">
        Accept
      </b-button>
    </b-row>
  </div>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  name: 'OwnerRegistration',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  data() {
    return {
      registration: {},
      ownerInfo: {},
      checked: false,
      form: {
        status: 'ACCEPT'
      },
      imageList: [],
      slide: 0,
      sliding: null
    }
  },
  components: {},
  created() {
    this.$bus.$emit('title', 'Owner Registration Detail')
    this.getData()
  },
  methods: {
    onSlideStart() {
      this.sliding = true
    },
    onSlideEnd() {
      this.sliding = false
    },
    async getData() {
      try {
        const registrationDetail = await this.$axios.get(
          `/owner-registration/${this.$route.params.id}`,
          {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          }
        )
        this.registration = registrationDetail.data
        this.ownerInfo = registrationDetail.data.user
        this.imageList = registrationDetail.data.householdRegistrationImgs
        console.log(this.imageList)
        this.checked = this.ownerInfo.status == 'ACTIVE' ? true : false
      } catch (error) {
        this.processing = false
      }
    },
    async accept() {
      try {
        await this.$axios.patch(
          `/owner-registration/${this.$route.params.id}`,
          this.form,
          {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          }
        )
        this.notifyToast('success', 'Success', 'Update owner successfully')
      } catch (error) {
        this.notifyToast('error', 'Error', 'Update owner failer')
      }
    }
  },
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
p {
  margin: 0;
  color: rgb(99, 95, 95);
  font-weight: 100;
}
label {
  color: $red;
  font-size: 20px;
  font-weight: bold;
}
</style>
