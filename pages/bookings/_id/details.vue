<template>
  <b-container fluid class="wrapper">
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
          Full Name:
          <label class="color-red text-bold" for="">{{
            ownerInfo.fullName
          }}</label>
        </p>
        <p>
          Username:
          <label class="color-red" for="">{{ ownerInfo.username }}</label>
        </p>
        <p>
          Email: <label class="color-red" for="">{{ ownerInfo.email }}</label>
        </p>
        <p>
          Phone: <label class="color-red" for="">{{ ownerInfo.phone }}</label>
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
      List Booking
    </h4>
    <b-row class="mb-3">
      <b-col cols="8" class="d-flex">
        <b-input-group style="max-width: 200px">
          <b-form-input
            v-model="searchText"
            placeholder="Search by name"
            style="max-width: 200px"
            :disabled="processing"
            size="sm"
          ></b-form-input>
          <template v-slot:append>
            <b-input-group-text>
              <fa :icon="['fas', 'search']" style="cursor: pointer" />
            </b-input-group-text>
          </template>
        </b-input-group>
        <b-button
          pill
          size="sm"
          variant="primary"
          class="mr-2 ml-2 pl-3 pr-3"
          @click="filter()"
        >
          Filter
        </b-button>
        <b-button
          pill
          size="sm"
          variant="outline-primary"
          class=""
          @click="clearFilter()"
        >
          Clear Filter
        </b-button>
      </b-col>
      <b-col cols="4" class="text-right">
        <b-form-select
          v-model="selectedLimit"
          :options="limitOptions"
          :disabled="processing"
          style="max-width: 60px"
          size="sm"
          @change="onLimitChange"
        ></b-form-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          id="owner-table"
          responsive
          bordered
          show-empty
          hover
          :items="booking.result"
          :fields="fields"
          :per-page="selectedLimit"
        >
          <template #cell(user)="data">
            <p class="m-0 color-red" style="font-weight: bold; font-size: 15px">
              {{ data.item.user.username }}
            </p>
            <p class="m-0" style="font-weight: bold; color: gray">
              {{ data.item.user.phone }}
            </p>
          </template>
          <template #cell(room)="data">
            <p class="m-0 color-red" style="font-weight: bold; font-size: 15px">
              {{ data.item.room.name }}
            </p>
            <p class="m-0" style="font-weight: bold; color: gray">
              Price: {{ data.item.room.price }} - Area:
              {{ data.item.room.area }}
            </p>
          </template>
          <template #cell(isChecked)="data">
            <b-form-checkbox
              v-model="data.item.isChecked"
              disabled
            ></b-form-checkbox>
          </template>
          <template v-slot:empty>
            <div v-if="processing" class="text-center p-5">
              <b-spinner></b-spinner>
            </div>
            <div v-else class="text-center p-5 color-gray-600 font-2">
              <fa :icon="['fas', 'folder-open']" />
              <span>No data</span>
            </div>
          </template>
        </b-table>
        <b-pagination
          pills
          align="center"
          v-model="currentPage"
          :total-rows="booking.total"
          :per-page="selectedLimit"
          :disabled="processing"
          aria-controls="user-table"
          @change="onPaginationChange"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Cookie from 'js-cookie'
import { debounce } from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'BookingListManagement',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  components: {},
  async fetch({ store, error, query }) {
    try {
      await store.commit('booking/RESET_FILTER')
      await store.commit('booking/SET_VIEWING', {})
      await store.commit('booking/SET_SEARCH_FILTER', '')
      if ('size' in query) {
        await store.commit('booking/SET_LIMIT_FILTER', query.size)
      }
      if ('page' in query) {
        await store.commit('booking/SET_PAGE_FILTER', query.page)
      }
      await store.dispatch('booking/fetchList')
    } catch {
      error({ statusCode: 500, message: 'An error has occurred' })
    }
  },
  data() {
    return {
      // Table fields
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'user', label: 'User' },
        { key: 'room', label: 'Room' },
        { key: 'isChecked', label: 'Check' }
      ],
      // Table limit
      limitOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' }
      ],
      selectedLimit: this.$store.state.category.query.size,
      // Context menu selected item
      selectedItem: {},
      // Current page
      currentPage: this.$store.state.category.query.page,
      // search text
      searchText: this.$store.state.category.query.name,
      processing: false,
      ownerInfo: {},
      checked: true
    }
  },
  computed: mapState({
    booking: (state) => state.booking.viewing,
    query: (state) => state.booking.query
  }),
  created() {
    this.$bus.$emit('title', 'Booking List Management')
    this.getData()
  },
  methods: {
    ...mapMutations({
      SET_SEARCH_FILTER: 'booking/SET_SEARCH_FILTER_BOOKING',
      SET_PAGE_FILTER: 'booking/SET_PAGE_FILTER',
      SET_LIMIT_FILTER: 'booking/SET_LIMIT_FILTER'
    }),
    ...mapActions({
      fetchList: 'booking/fetchList'
    }),
    changeQueryParams() {
      history.pushState(
        {},
        '',
        `${this.$route.path}?page=${this.currentPage}&limit=${this.selectedLimit}`
      )
    },
    async clearFilter() {
      this.searchText = ''
      await this.SET_SEARCH_FILTER('')
    },
    async filter() {
      try {
        await this.SET_SEARCH_FILTER(
          this.searchText != ''
            ? JSON.stringify({
                'user.username': { $contL: this.searchText }
              })
            : ''
        )
        await this.fetchList()
        this.changeQueryParams()
      } catch (error) {
        console.log(error)
      }
    },
    async getData() {
      try {
        const ownerDetail = await this.$axios.get(
          `/users/${this.$route.params.id}`,
          {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          }
        )
        this.ownerInfo = ownerDetail.data
        this.checked = this.ownerInfo.status == 'ACTIVE' ? true : false
        console.log(this.ownerInfo)
      } catch (error) {
        this.processing = false
      }
    },
    onPaginationChange: debounce(async function() {
      try {
        await this.SET_PAGE_FILTER(this.currentPage)
        await this.fetchList()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({ statusCode: 500, message: 'An error has occurred' })
      }
    }, 1000),
    onLimitChange: debounce(async function() {
      try {
        await this.SET_LIMIT_FILTER(this.selectedLimit)
        await this.fetchList()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({ statusCode: 500, message: 'An error has occurred' })
      }
    }, 1000)
  },
  head() {
    return {
      title: 'Booking Management',
      description: 'A short dummy description'
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
