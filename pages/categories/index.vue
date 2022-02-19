<template>
  <b-container fluid class="wrapper">
    <b-row class="mb-3">
      <b-col cols="6" class="d-flex">
        <b-input-group>
          <b-form-input
            v-model="searchText"
            placeholder="Search by name"
            style="max-width: 200px"
            :disabled="processing"
            size="sm"
            @input="onSearch"
          ></b-form-input>
          <template v-slot:append>
            <b-input-group-text>
              <fa :icon="['fas', 'search']" style="cursor: pointer" />
            </b-input-group-text>
          </template>
        </b-input-group>
      </b-col>
      <b-col cols="6" class="text-right">
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
        size="md"
        class="ml-3 mr-3 mb-3"
        @click="$refs['addModal'].show()"
        pill
        variant="outline-danger"
      >
        + Add New Category
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
          :items="category.result"
          :fields="fields"
          :per-page="selectedLimit"
        >
          <template v-slot:cell(edit)="data">
            <b-button @click="openEditModal(data.value)">
              <fa :icon="['far', 'edit']" class="color-red" />
              <span>Edit</span>
            </b-button>
            <b-button @click="openDeleteModal(data.value)">
              <fa :icon="['far', 'trash-alt']" class="color-red" />
              <span>Delete</span>
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
          :total-rows="category.total"
          :per-page="selectedLimit"
          :disabled="processing"
          aria-controls="user-table"
          @change="onPaginationChange"
        ></b-pagination>
        <b-modal id="deleteModal" ref="deleteModal" hide-header>
          <div class="text-center">
            <fa
              :icon="['fas', 'times-circle']"
              class="text-danger"
              style="font-size: 7rem"
            />
            <h3 class="my-3 text-gray">
              System Warning
            </h3>
            <p class="text-gray">
              Warning not to delete this category
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
              @click="cancel()"
            >
              OK
            </b-button>
          </template>
        </b-modal>
        <b-modal id="editModal" ref="editModal" hide-header hide-footer>
          <div>
            <h5 class="color-red text-center">
              EDIT CATEGORY
            </h5>
            <ValidationObserver v-slot="{ handleSubmit }">
              <b-form @submit.prevent="handleSubmit(editCategory)">
                <!-- Category's name -->
                <ValidationProvider
                  v-slot="{ errors }"
                  mode="lazy"
                  rules="required"
                >
                  <b-form-group
                    id="input-group-1"
                    label="Category's name"
                    class="color-red"
                    label-for="input-1"
                  >
                    <b-form-input
                      id="input-1"
                      v-model="form.name"
                      :disabled="processing"
                      placeholder="Enter category"
                    ></b-form-input>
                    <p class="text-danger">
                      {{ $t(errors[0]) }}
                    </p>
                  </b-form-group>
                </ValidationProvider>
                <b-button
                  pill
                  variant="outline-danger"
                  size="sm"
                  class="ml-10"
                  @click="closeModal()"
                >
                  Cancel
                </b-button>
                <b-button
                  pill
                  variant="danger"
                  type="submit"
                  size="sm"
                  :disabled="processing"
                >
                  <b-spinner small type="grow" v-if="processing"></b-spinner>
                  Update
                </b-button>
              </b-form>
            </ValidationObserver>
          </div>
        </b-modal>
        <b-modal id="addModal" ref="addModal" hide-header hide-footer>
          <div>
            <h5 class="color-red text-center">
              ADD NEW CATEGORY
            </h5>
            <ValidationObserver v-slot="{ handleSubmit }">
              <b-form @submit.prevent="handleSubmit(addCategory)">
                <!-- Category's name -->
                <ValidationProvider
                  v-slot="{ errors }"
                  mode="lazy"
                  rules="required"
                >
                  <b-form-group
                    id="input-group-1"
                    label="Category's name"
                    class="color-red"
                    label-for="input-1"
                  >
                    <b-form-input
                      id="input-1"
                      v-model="form.name"
                      :disabled="processing"
                      placeholder="Enter category"
                    ></b-form-input>
                    <p class="text-danger">
                      {{ $t(errors[0]) }}
                    </p>
                  </b-form-group>
                </ValidationProvider>
                <b-button
                  pill
                  variant="outline-danger"
                  size="sm"
                  class="ml-10"
                  @click="closeModal()"
                >
                  Cancel
                </b-button>
                <b-button
                  pill
                  variant="danger"
                  type="submit"
                  size="sm"
                  :disabled="processing"
                >
                  <b-spinner small type="grow" v-if="processing"></b-spinner>
                  ADD
                </b-button>
              </b-form>
            </ValidationObserver>
          </div>
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
  name: 'CategoryList',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  components: {},
  async fetch({ store, error, query }) {
    try {
      await store.commit('category/RESET_FILTER')
      await store.commit('category/SET_VIEWING', {})
      if ('size' in query) {
        await store.commit('category/SET_LIMIT_FILTER', query.size)
      }
      if ('page' in query) {
        await store.commit('category/SET_PAGE_FILTER', query.page)
      }
      await store.dispatch('category/fetchList')
    } catch {
      error({ statusCode: 500, message: 'An error has occurred' })
    }
  },
  data() {
    return {
      // Table fields
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        {
          key: 'edit',
          label: 'Edit',
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
      selectedLimit: this.$store.state.category.query.size,
      // Context menu selected item
      selectedItem: {},
      // Current page
      currentPage: this.$store.state.category.query.page,
      // search text
      searchText: this.$store.state.category.query.name,
      processing: false,
      form: {
        name: ''
      }
    }
  },
  computed: mapState({
    category: (state) => state.category.viewing,
    query: (state) => state.category.query,
    detailCategory: (state) => state.category.selected
  }),
  created() {
    this.$bus.$emit('title', 'List Category')
  },
  methods: {
    ...mapMutations({
      SET_SEARCH_FILTER: 'category/SET_SEARCH_FILTER',
      SET_PAGE_FILTER: 'category/SET_PAGE_FILTER',
      SET_LIMIT_FILTER: 'category/SET_LIMIT_FILTER',
      SET_SELECTED_ID: 'category/SET_SELECTED_ID'
    }),
    ...mapActions({
      fetchList: 'category/fetchList',
      fetchDetail: 'category/fetchDetail'
    }),
    createCategory() {
      this.$router.push(`/categories/create`)
    },
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
    onSearch: debounce(async function() {
      try {
        await this.SET_SEARCH_FILTER(this.searchText)
        await this.fetchList()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({ statusCode: 500, message: 'An error has occurred' })
      }
    }, 1000),
    async openEditModal(id) {
      await this.SET_SELECTED_ID(id)
      await this.fetchDetail()
      this.form.name = this.detailCategory.name
      this.$refs['editModal'].show()
    },
    async openDeleteModal(id) {
      await this.SET_SELECTED_ID(id)
      await this.fetchDetail()
      this.form.name = this.detailCategory.name
      this.$refs['deleteModal'].show()
    },
    async editCategory() {
      try {
        if (this.$store.state.user.currentUser.role == 'ADMIN') {
          this.processing = true
          await this.$axios.patch(
            `/category/${this.detailCategory.id}`,
            this.form,
            {
              headers: {
                Authorization: 'Bearer ' + Cookie.get('token')
              }
            }
          )
          this.notifyToast('success', 'Success', 'Update category success')
          this.form.name = ''
          await this.fetchList()
          this.$refs['editModal'].hide()
          this.processing = false
        } else {
          this.processing = false
          this.notifyToast('error', 'Error', 'Only Admin can edit category')
        }
      } catch (error) {
        this.notifyToast('error', 'Error', 'Update category failed')
        this.processing = false
      }
    },
    async addCategory() {
      try {
        if (this.$store.state.user.currentUser.role == 'ADMIN') {
          this.processing = true
          await this.$axios.post(`/category`, this.form, {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          })
          this.notifyToast('success', 'Success', 'Add new category success')
          this.form.name = ''
          await this.fetchList()
          this.$refs['addModal'].hide()
          this.processing = false
        } else {
          this.processing = false
          this.notifyToast('error', 'Error', 'Only Admin can add new category')
        }
      } catch (error) {
        this.notifyToast('error', 'Error', 'Add new category failed')
        this.processing = false
      }
    },
    closeModal() {
      this.$refs['editModal'].hide()
      this.$refs['deleteModal'].hide()
      this.$refs['addModal'].hide()
    },
    async banCategory() {
      try {
        if (this.$store.state.user.currentUser.role == 'ADMIN') {
          this.processing = true
          await this.$axios.delete(`/category/${this.detailCategory.id}`, {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          })
          this.notifyToast('success', 'Success', 'Delete category success')
          await this.fetchList()
          this.$refs['deleteModal'].hide()
          this.processing = false
        } else {
          this.processing = false
          this.notifyToast('error', 'Error', 'Only Admin can delete category')
        }
      } catch (error) {
        this.notifyToast('error', 'Error', 'Delete category failed')
        this.processing = false
      }
    }
  },
  head() {
    return { title: 'Category List', description: 'A short dummy description' }
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
