<template>
  <b-container fluid class="wrapper">
    <b-row class="mb-3">
      <b-col cols="8" class="d-flex">
        <b-input-group style="max-width: 250px">
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
        <b-form-select
          style="max-width: 200px"
          class="ml-3 mr-3"
          v-model="paidStatus"
          :options="options"
          size="sm"
        ></b-form-select>
        <b-button
          pill
          size="sm"
          variant="primary"
          class="mr-2 pl-3 pr-3"
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
          :items="transaction.result"
          :fields="fields"
          :per-page="selectedLimit"
        >
          <template #cell(owner)="data">
            <div class="d-flex">
              <p
                class="m-0 color-red"
                style="font-weight: bold; font-size: 15px; padding-top: 6px"
              >
                {{ data.item.owner.username }}
              </p>
              <b-button
                pill
                class="ml-3"
                :variant="
                  data.item.owner.status == 'ACTIVE' ? 'success' : 'danger'
                "
                size="sm"
              >
                {{ data.item.owner.status }}
              </b-button>
            </div>
          </template>
          <template v-slot:cell(Bookings)="data">
            <b-button @click="download(data.value)">
              <fa :icon="['far', 'edit']" class="color-red" />
              <span>Download Transaction</span>
            </b-button>
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
          :total-rows="transaction.total"
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
  name: 'TransactionManagement',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  components: {},
  async fetch({ store, error, query }) {
    try {
      await store.commit('booking/RESET_FILTER')
      await store.commit('booking/SET_TRANSACTION', {})
      await store.commit('booking/SET_SEARCH_FILTER', '')
      if ('size' in query) {
        await store.commit('booking/SET_LIMIT_FILTER', query.size)
      }
      if ('page' in query) {
        await store.commit('booking/SET_PAGE_FILTER', query.page)
      }
      await store.dispatch('booking/fetchListTransaction')
    } catch {
      error({ statusCode: 500, message: 'An error has occurred' })
    }
  },
  data() {
    return {
      // Table fields
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'owner', label: 'Owner' },
        { key: 'isPaid', label: 'Paid' },
        {
          key: 'Bookings',
          label: 'Download',
          formatter: (value, key, item) => {
            return item.id
          }
        }
      ],
      // Table limit
      limitOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' }
      ],
      options: [
        { value: true, text: 'PAID DONE' },
        { value: false, text: 'OWN' }
      ],
      selectedLimit: this.$store.state.category.query.size,
      // Context menu selected item
      selectedItem: {},
      // Current page
      currentPage: this.$store.state.category.query.page,
      // search text
      searchText: '',
      paidStatus: false,
      processing: false
    }
  },
  computed: mapState({
    transaction: (state) => state.booking.listTransaction,
    query: (state) => state.booking.query
  }),
  created() {
    this.$bus.$emit('title', 'Booking Management')
  },
  methods: {
    ...mapMutations({
      SET_SEARCH_FILTER: 'booking/SET_SEARCH_FILTER',
      SET_FILTER: 'booking/SET_FILTER',
      SET_PAGE_FILTER: 'booking/SET_PAGE_FILTER',
      SET_LIMIT_FILTER: 'booking/SET_LIMIT_FILTER',
      SET_USER: 'booking/SET_USER'
    }),
    ...mapActions({
      fetchListTransaction: 'booking/fetchListTransaction'
    }),
    changeQueryParams() {
      history.pushState(
        {},
        '',
        `${this.$route.path}?page=${this.currentPage}&limit=${this.selectedLimit}`
      )
    },
    onPaginationChange: debounce(async function() {
      try {
        await this.SET_PAGE_FILTER(this.currentPage)
        await this.fetchListOwner()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({ statusCode: 500, message: 'An error has occurred' })
      }
    }, 1000),
    onLimitChange: debounce(async function() {
      try {
        await this.SET_LIMIT_FILTER(this.selectedLimit)
        await this.fetchListOwner()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({ statusCode: 500, message: 'An error has occurred' })
      }
    }, 1000),
    async clearFilter() {
      this.searchText = ''
      await this.SET_SEARCH_FILTER('')
    },
    async download(id) {
      try {
        this.processing = true
        await this.$axios
          .get(`/transaction/extract-invoice/${id}`, {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          })
          .then((response) => {
            const url = URL.createObjectURL(
              new Blob([response.data], {
                type: 'application/vnd.ms-excel'
              })
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', Date.now())
            document.body.appendChild(link)
            link.click()
          })
        this.notifyToast(
          'success',
          'Success',
          'Download Transaction successfully'
        )
        this.processing = false
      } catch (error) {
        this.notifyToast('error', 'Error', 'Download Transaction failed')
        this.processing = false
      }
    },
    async filter() {
      try {
        await this.SET_SEARCH_FILTER(
          this.searchText != ''
            ? JSON.stringify({
                'owner.username': { $contL: this.searchText }
              })
            : ''
        )
        await this.SET_FILTER(`isPaid||$eq||${this.paidStatus}`)
        await this.fetchListTransaction()
        this.changeQueryParams()
      } catch (error) {
        console.log(error)
      }
    }
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
