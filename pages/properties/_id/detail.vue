<template>
  <div class="wrapper">
    <h4 class="color-red" style="font-weight: bold">
      Owner Information
    </h4>
    <b-row>
      <b-col cols="3" class="pl-5 pt-3">
        <b-avatar
          variant="info"
          :src="owner.avatar"
          size="8rem"
          style="border: 3px solid red"
        ></b-avatar>
      </b-col>
      <b-col cols="9">
        <p>
          Full Name:
          <label for="" class="owner-detail">{{ owner.fullName }}</label>
        </p>
        <p>
          Username:
          <label for="" class="owner-detail">{{ owner.username }}</label>
        </p>
        <p>
          Email: <label for="" class="owner-detail">{{ owner.email }}</label>
        </p>
        <p>
          Phone: <label for="" class="owner-detail">{{ owner.phone }}</label>
        </p>
      </b-col>
    </b-row>
    <hr />
    <h4 class="color-red" style="font-weight: bold">
      Property Information
    </h4>
    <b-row>
      <b-col cols="3">
        <b-img
          :src="property.thumbnail"
          style="
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
          "
        ></b-img>
      </b-col>
      <b-col cols="6">
        <p class="color-red" style="font-size: 25px">
          {{ property.title }}
        </p>
        <p>
          <fa :icon="['far', `map`]" />
          <label for="" class="color: gray">
            {{ property.address }}
          </label>
        </p>
        <div style="display: flex; font-size: 17px">
          <div style="margin-right: 20px">
            <p style="margin: 0px; font-size: 14px">
              <fa :icon="['far', `lightbulb`]" /> Tiền điện
            </p>
            <p class="color-red">
              {{ policy.electricity + '0 VNĐ' }}
            </p>
          </div>
          <div style="margin-right: 20px">
            <p style="margin: 0px; font-size: 14px">
              <fa :icon="['fas', `faucet`]" /> Tiền nước
            </p>
            <p class="color-red">
              {{ policy.water + '0 VNĐ' }}
            </p>
          </div>
          <div style="margin-right: 20px">
            <p style="margin: 0px; font-size: 14px">
              <fa :icon="['fas', `parking`]" /> Để xe
            </p>
            <p class="color-red">
              {{ policy.parking ? policy.parking : 'miễn phí' }}0 VNĐ
            </p>
          </div>
          <div style="margin-right: 20px">
            <p style="margin: 0px; font-size: 14px">
              <fa :icon="['fas', `wifi`]" /> Wifi
            </p>
            <p class="color-red">
              {{ policy.wifi ? policy.wifi + '0 VNĐ' : 'miễn phí' }}
            </p>
          </div>
        </div>
        <div style="margin-right: 20px; font-size: 17px">
          <p style="font-size: 14px">
            <fa :icon="['fas', `ruler`]" />
            Diện tích
          </p>
          <p>{{ property.averageArea }} m2</p>
        </div>
        <b-button
          pill
          variant="outline-danger"
          size="sm"
          style="position: absolute; bottom: 10px; right: 10px"
          v-b-modal.modal-1
        >
          View Map
        </b-button>
        <b-button
          pill
          variant="danger"
          size="sm"
          style="position: absolute; bottom: 10px; right: 100px"
          v-b-modal.deleteModal
        >
          Delete
        </b-button>
      </b-col>
      <b-col
        cols="3"
        class=""
        style="border-left: 3px solid red; text-align: center"
      >
        <p style="margin-top: 50px">
          Average
        </p>
        <p class="color-red" style="font-size: 30px; font-weight: bold">
          {{ property.averagePrice }}
        </p>
        <p>VND/month</p>
      </b-col>
    </b-row>
    <b-modal id="modal-1" hide-footer hide-header size="lg">
      <google-map :lat="property.latitude" :lng="property.longtitude" />
    </b-modal>
    <hr />
    <h4 class="color-red" style="font-weight: bold">
      Room List
    </h4>
    <b-row>
      <b-col
        cols="12"
        class="my-1"
        :key="index"
        v-for="(item, index) in roomList.result"
      >
        <div>
          <b-row
            style="
              width: 100%;
              margin: 0px;
              background-color: white;
              border-radius: 8px;
              border: 2px solid red;
            "
          >
            <b-col cols="2" style="margin: 0px; padding: 0">
              <b-img
                :src="item.images[0]"
                style="width: 100%; border-radius: 8px"
              ></b-img>
            </b-col>
            <b-col cols="7" style="position: relative">
              <div style="text-align: left; margin-top: 10px">
                <b-button :id="`${item.id}`" pill variant="outline-danger">
                  More description
                </b-button>
                <b-popover
                  :target="`${item.id}`"
                  triggers="hover"
                  placement="top"
                  variant="Dark"
                >
                  {{ item.description }}
                </b-popover>
                <div
                  style="display: flex; font-size: 17px; margin-top: 10px; margin-bottom: 10px"
                >
                  <p
                    :key="index1"
                    v-for="(item1, index1) in item.amenities"
                    class="amenities"
                  >
                    <fa :icon="['fas', `${item1.iconWeb}`]" />
                    {{ item1.name }}
                  </p>
                </div>
                <div style="margin-right: 20px">
                  <p>
                    <fa :icon="['fas', `ruler`]" />
                    <label for="" class="policy">{{ item.area }}</label>
                    m2
                  </p>
                </div>
              </div>
              <div style="position: absolute; bottom: 10px; right: 10px">
                <b-button pill variant="outline-danger" size="sm">
                  {{ item.status }}
                </b-button>
              </div>
            </b-col>
            <b-col cols="3" class="text-center">
              <p
                class="color-red"
                style="font-size: 25px; font-weight: bold; margin-top: 30px"
              >
                {{ item.price }}
              </p>
              <p>VND/month</p>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
    <b-modal id="deleteModal" hide-header ref="deleteModal">
      <div class="text-center">
        <fa
          :icon="['far', 'times-circle']"
          class="text-danger"
          style="font-size: 7rem;"
        />
        <h3 class="my-3 text-gray">
          Are you sure you want to do this?
        </h3>
        <p class="text-gray">
          You are about to ban this record from the system
        </p>
      </div>
      <template v-slot:modal-footer="{ cancel }">
        <b-button
          size="sm"
          variant="secondary"
          :disabled="processing"
          @click="cancel()"
        >
          Cancel
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          :disabled="processing"
          @click="deleteData()"
        >
          Ban
        </b-button>
      </template>
    </b-modal>
    <hr style="margin-top: 10px" />
    <b-button
      size="sm"
      pill
      variant="outline-danger"
      @click="$router.push('/properties')"
    >
      GO BACK
    </b-button>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'App',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  data() {
    return {
      roomList: {},
      property: {},
      policy: {},
      owner: {},
      loading: false
    }
  },
  components: {
    GoogleMap: () => import('~/components/common/Plugins/map.vue')
  },
  created() {
    this.$bus.$emit('title', 'Apartment Detail')
    this.getData()
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        const propertyDetail = await this.$axios.get(
          `/properties/${this.$route.params.id}`,
          {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          }
        )
        this.property = propertyDetail.data
        this.policy = propertyDetail.data.policy
        this.owner = propertyDetail.data.owner
        const list = await this.$axios.get(
          `/properties/${this.$route.params.id}/rooms`,
          {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          }
        )
        this.roomList = list.data
      } catch (error) {
        this.notifyToast('error', 'Error', 'Can Featch Detail Property')
      }
    },
    async deleteData() {
      try {
        await this.$axios.delete(`/properties/${this.$route.params.id}`, {
          headers: {
            Authorization: 'Bearer ' + Cookie.get('token')
          }
        })
        this.$refs['deleteModal'].hide()
        this.$router.push('/properties')
        this.notifyToast('success', 'Success', 'Ban Properties Success')
      } catch (error) {
        this.notifyToast('error', 'Error', 'Can Not Ban Properties')
      }
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
.owner-detail {
  color: $red;
  font-size: 20px;
  font-weight: bold;
}
.policy {
  color: $red;
}
.amenities {
  font-size: 14px;
  margin-left: 10px;
}
</style>
