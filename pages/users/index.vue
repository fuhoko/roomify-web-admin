<template>
  <b-container fluid class="wrapper">
    <b-row class="mb-3">
      <b-col cols="8" class="d-flex">
        <b-input-group style="max-width: 200px">
          <b-form-input
            v-model="searchText"
            placeholder="Search by name"
            style="max-width: 250px"
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
          v-model="roleId"
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
      <b-button
        size="sm"
        class="mb-3 ml-3 btn-outline-light"
        @click="createUser"
        variant="success"
      >
        Add new user
      </b-button>
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
          <v-contextmenu-item @click="editUser">
            <fa :icon="['far', 'edit']" class="color-red" />
            <span>Edit</span>
          </v-contextmenu-item>
          <v-contextmenu-item v-b-modal.deleteModal>
            <fa :icon="['far', 'trash-alt']" class="color-red" />
            <span>Ban</span>
          </v-contextmenu-item>
        </v-contextmenu>
        <b-modal id="deleteModal" hide-header>
          <div class="text-center">
            <fa
              :icon="['fas', 'times-circle']"
              class="text-danger"
              style="font-size: 7rem"
            />
            <h3 class="my-3 text-gray">
              {{ $t('modal.confirmTitle') }}
            </h3>
            <p class="text-gray">
              {{ $t('modal.banDescription') }}
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
              @click="banUser()"
            >
              Ban
            </b-button>
          </template>
        </b-modal>
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
      await store.dispatch('user/fetchList')
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
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status' }
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
      deleteForm: {
        status: 'BANNED'
      }
    }
  },
  computed: mapState({
    user: (state) => state.user.viewing,
    query: (state) => state.user.query
  }),
  created() {
    console.log('!!!!123', this.$store.state.user.currentUser)
    this.$bus.$emit('title', 'List user')
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
      fetchList: 'user/fetchList'
    }),
    createUser() {
      this.$router.push(`/users/create`)
    },
    changeQueryParams() {
      history.pushState(
        {},
        '',
        `${this.$route.path}?page=${this.currentPage}&limit=${this.selectedLimit}`
      )
    },
    clearFilter() {
      this.roleId = null
      this.searchText = ''
    },
    async filter() {
      try {
        await this.SET_SEARCH_FILTER(
          this.searchText != ''
            ? JSON.stringify({
                $or: [
                  {
                    fullName: { $contL: this.searchText }
                  },
                  {
                    email: { $contL: this.searchText }
                  }
                ]
              })
            : ''
        )
        await this.SET_FILTER(
          this.roleId ? `roles.id||$eq||${this.roleId}` : ''
        )
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
    editUser() {
      this.$router.push(`/users/${this.selectedItem.id}/edit`)
    },
    async banUser() {
      try {
        this.processing = true
        if (this.$store.state.user.currentUser.role == 'ADMIN') {
          await this.$axios.patch(
            `/users/${this.selectedItem.id}`,
            this.deleteForm,
            {
              headers: {
                Authorization: 'Bearer ' + Cookie.get('token')
              }
            }
          )
          await this.fetchList()
          this.notifyToast('success', 'Success', 'Ban user successfully')
        } else {
          this.notifyToast('error', 'Error', 'Only ADMIN can ban user')
        }
      } catch {
        this.notifyToast('error', 'Error', 'Can not ban this user')
      } finally {
        this.$bvModal.hide('deleteModal')
        this.processing = false
      }
    }
  },
  head() {
    return { title: 'User List', description: 'A short dummy description' }
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
