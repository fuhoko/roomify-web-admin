<template>
  <b-container fluid class="wrapper">
    <b-row class="mb-3">
      <b-col cols="8">
        <b-button
          size="md"
          pill
          class="mb-3 ml-3"
          @click="$router.push('/users')"
          variant="outline-danger"
        >
          Go Back
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
          :items="user.result"
          :fields="fields"
          :per-page="selectedLimit"
          @row-contextmenu="handleContextMenu"
        >
          <template v-slot:cell()="data">
            <p
              v-contextmenu:contextmenu
              class="h-100 m-0 w-100"
              style="cursor: pointer"
            >
              {{ data.value }}
            </p>
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
          v-model="currentPage"
          :total-rows="user.total"
          :per-page="selectedLimit"
          :disabled="processing"
          aria-controls="user-table"
          align="center"
          pills
          @change="onPaginationChange"
        ></b-pagination>
        <v-contextmenu ref="contextmenu">
          <v-contextmenu-item @click="restoreUser">
            <fa :icon="['far', 'edit']" class="color-red" />
            <span>Restore</span>
          </v-contextmenu-item>
        </v-contextmenu>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Cookie from 'js-cookie'
import { debounce } from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'UserList',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  components: {},
  async fetch({ store, error, query }) {
    try {
      await store.commit('user/RESET_FILTER')
      await store.commit('user/SET_VIEWING', {})
      if ('size' in query) {
        await store.commit('user/SET_LIMIT_FILTER', query.size)
      }
      if ('page' in query) {
        await store.commit('user/SET_PAGE_FILTER', query.page)
      }
      await store.dispatch('user/fetchListBanned')
    } catch {
      error({ statusCode: 500, message: 'An error has occurred' })
    }
  },
  data() {
    return {
      // Table fields
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'fullName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'roles[0].name', label: 'Role' },
        { key: 'phone', label: 'Phone' }
      ],
      roleId: null,
      options: [
        { value: 1, text: 'ADMIN' },
        { value: 2, text: 'MODERATOR' },
        { value: 3, text: 'OWNER' },
        { value: 4, text: 'USER' }
      ],
      // Table limit
      limitOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' }
      ],
      selectedLimit: this.$store.state.user.query.size,
      // Context menu selected item
      selectedItem: {},
      // Current page
      currentPage: this.$store.state.user.query.page,
      // search text
      searchText: '',
      processing: false,
      form: {
        status: 'ACTIVE'
      }
    }
  },
  computed: mapState({
    user: (state) => state.user.viewing,
    query: (state) => state.user.query
  }),
  created() {
    this.$bus.$emit('title', 'List Delete User')
    //this.token = Cookie.get('token')
  },
  methods: {
    ...mapMutations({
      SET_SEARCH_FILTER: 'user/SET_SEARCH_FILTER',
      SET_FILTER: 'user/SET_FILTER',
      SET_PAGE_FILTER: 'user/SET_PAGE_FILTER',
      SET_LIMIT_FILTER: 'user/SET_LIMIT_FILTER'
    }),
    ...mapActions({
      fetchList: 'user/fetchListBanned'
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
    }, 1000),
    handleContextMenu(item, index, event) {
      event.preventDefault()
      this.selectedItem = item
    },
    async restoreUser() {
      try {
        this.processing = true
        if (this.$store.state.user.currentUser.role == 'ADMIN') {
          await this.$axios.patch(`/users/${this.selectedItem.id}`, this.form, {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          })
          await this.fetchList()
          this.notifyToast('success', 'Success', 'Restore User successfully')
        } else {
          this.notifyToast('error', 'Error', 'Only Admin can restore user')
        }
      } catch {
        this.notifyToast('error', 'Error', 'Can not restore user')
      } finally {
        this.processing = false
      }
    }
  },
  head() {
    return {
      title: 'User Banned List',
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
