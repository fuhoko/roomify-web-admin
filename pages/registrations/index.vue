<template>
  <b-container fluid class="wrapper">
    <b-row class="mb-3">
      <b-col cols="8" class="d-flex">
        <b-input-group style="max-width: 200px">
          <b-form-input
            v-model="searchText"
            placeholder="Search owner registration"
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
          v-model="status"
          :options="options"
          size="sm"
        ></b-form-select>
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
          id="user-table"
          responsive
          bordered
          show-empty
          hover
          :items="registration.result"
          :fields="fields"
          :per-page="selectedLimit"
        >
          <template #cell(owner)="data">
            <p class="m-0 color-red" style="font-weight: bold; font-size: 18px">
              {{ data.item.nameOwner }}
            </p>
            <p class="m-0" style="font-weight: bold; color: gray">
              ID:
              {{ data.item.IDNumber }}
            </p>
          </template>
          <template #cell(status)="data" style="text-align: center">
            <b-button
              pill
              :variant="data.item.status == 'ACCEPT' ? 'success' : 'danger'"
              size="sm"
              style="margin-top: 8px"
            >
              {{ data.item.status }}
            </b-button>
            <label style="font-weight: bold; color: gray; margin-left: 15px">
              {{
                $moment(data.item.createdAt).format('MMMM Do YYYY, h:mm:ss a')
              }}
            </label>
          </template>
          <template v-slot:cell(detail)="data">
            <b-button
              @click="$router.push(`/registrations/${data.value}/detail`)"
              pill
            >
              <fa :icon="['far', 'edit']" class="color-red" />
              <span>View detail</span>
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
          :total-rows="registration.total"
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
import { debounce } from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'RegistrationList',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  components: {},
  async fetch({ store, error, query }) {
    try {
      await store.commit('registration/RESET_FILTER')
      await store.commit('registration/SET_VIEWING', {})
      if ('size' in query) {
        await store.commit('registration/SET_LIMIT_FILTER', query.size)
      }
      if ('page' in query) {
        await store.commit('registration/SET_PAGE_FILTER', query.page)
      }
      await store.dispatch('registration/fetchList')
    } catch {
      error({ statusCode: 500, message: 'error has occurred' })
    }
  },
  data() {
    return {
      // Table fields
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'owner', label: 'OwnerInfo' },
        { key: 'status', label: 'Status' },
        {
          key: 'detail',
          label: 'Detail',
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
        { value: 'PENDING', text: 'PENDING' },
        { value: 'ACCEPT', text: 'ACCEPT' }
      ],
      selectedLimit: this.$store.state.registration.query.size,
      // Context menu selected item
      selectedItem: {},
      // Current page
      currentPage: this.$store.state.registration.query.page,
      // search text
      searchText: '',
      status: '',
      processing: false
    }
  },
  computed: mapState({
    registration: (state) => state.registration.viewing,
    query: (state) => state.registration.query
  }),
  created() {
    this.$bus.$emit('title', 'List Owner Registration')
  },
  methods: {
    ...mapMutations({
      SET_SEARCH_FILTER: 'registration/SET_SEARCH_FILTER',
      SET_FILTER: 'registration/SET_FILTER',
      SET_PAGE_FILTER: 'registration/SET_PAGE_FILTER',
      SET_LIMIT_FILTER: 'registration/SET_LIMIT_FILTER'
    }),
    ...mapActions({
      fetchList: 'registration/fetchList'
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
      this.status = ''
      await this.SET_SEARCH_FILTER('')
      await this.SET_FILTER('')
    },
    async filter() {
      try {
        await this.SET_SEARCH_FILTER(
          this.searchText != ''
            ? JSON.stringify({
                nameOwner: { $contL: this.searchText }
              })
            : ''
        )
        await this.SET_FILTER(this.status ? `status||$eq||${this.status}` : '')
        await this.fetchList()
        this.changeQueryParams()
      } catch (error) {
        console.log(error)
      }
    },
    onPaginationChange: debounce(async function() {
      try {
        await this.SET_PAGE_FILTER(this.currentPage)
        await this.fetchList()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({
          statusCode: 500,
          message: 'An error has occurred 1'
        })
      }
    }, 1000),
    onLimitChange: debounce(async function() {
      try {
        await this.SET_LIMIT_FILTER(this.selectedLimit)
        await this.fetchList()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({
          statusCode: 500,
          message: 'An error has occurred 2'
        })
      }
    }, 1000)
  },
  head() {
    return {
      title: 'Owner Registration List',
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
