<template>
  <b-container>
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
      <b-col
        cols="12"
        class="my-1"
        :key="index"
        v-for="(item, index) in properties.result"
      >
        <div style="width: 100%; height: auto; border-radius: 5px">
          <b-row
            style="
              width: 100%;
              margin: 0px;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
                0 6px 6px rgba(0, 0, 0, 0.23);
            "
          >
            <b-col cols="3" style="margin: 0px; padding: 0">
              <b-img
                :src="item.thumbnail"
                style="
                  width: 100%;
                  border-top-left-radius: 8px;
                  border-bottom-left-radius: 8px;
                "
              ></b-img>
            </b-col>
            <b-col cols="9" style="position: relative">
              <div style="text-align: left">
                <h4
                  class="color-red"
                  style="margin-bottom: 0; margin-top: 10px; font-weight: 600"
                >
                  {{ item.title }}
                </h4>
                <p style="margin-bottom: 0; font-size: 16px">
                  <fa :icon="['far', `map`]" />
                  {{ item.address }}
                </p>
                <div
                  style="display: flex; margin-top: 15px; font-size: 20px"
                  class="color-red"
                >
                  <div style="margin-right: 20px">
                    <p style="margin: 0px; font-size: 14px">
                      <fa :icon="['far', `lightbulb`]" /> Tiền điện
                    </p>
                    <p>{{ item.policy.electricity }}0 VNĐ</p>
                  </div>
                  <div style="margin-right: 20px">
                    <p style="margin: 0px; font-size: 14px">
                      <fa :icon="['fas', `faucet`]" /> Tiền nước
                    </p>
                    <p>{{ item.policy.water }}0 VNĐ</p>
                  </div>
                  <div style="margin-right: 20px">
                    <p style="margin: 0px; font-size: 14px">
                      <fa :icon="['fas', `parking`]" /> Để xe
                    </p>
                    <p>
                      {{
                        item.policy.parking ? item.policy.parking : 'miễn phí'
                      }}0 VNĐ
                    </p>
                  </div>
                  <div style="margin-right: 20px">
                    <p style="margin: 0px; font-size: 14px">
                      <fa :icon="['fas', `wifi`]" /> Wifi
                    </p>
                    <p>
                      {{
                        item.policy.wifi
                          ? item.policy.wifi + '0 VNĐ'
                          : 'miễn phí'
                      }}
                    </p>
                  </div>
                </div>
                <p
                  style="
                    margin-bottom: 0;
                    font-size: 40px;
                    font-weight: 700;
                    position: absolute;
                    top: 50px;
                    right: 15px;
                  "
                  class="color-red"
                >
                  {{ item.minPrice }} - {{ item.maxPrice }}
                  <label for="" style="font-size: 12px; font-weight: 100">
                    tr/phòng
                  </label>
                </p>
              </div>
              <!-- <div style="position: absolute; bottom: 15px; right: 15px">
                <a :href="'/properties/' + item.id + '/detail'">View detail</a>
              </div> -->
              <b-button
                style="position: absolute; bottom: 15px; right: 15px"
                pill
                variant="outline-danger"
                type="submit"
                size="sm"
                class="ml-10"
                @click="restoreData(item.id)"
              >
                Restore
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination
          @change="onPaginationChange"
          :total-rows="properties.total"
          :per-page="perPage"
          v-model="currentPage"
          align="center"
          pills
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Cookie from 'js-cookie'
import { debounce } from 'lodash'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'PropertiesList',
  layout: 'admin',
  middleware: ['AdminAuthRequired'],
  components: {},
  async fetch({ store, error, query }) {
    try {
      await store.commit('property/RESET_FILTER')
      await store.commit('property/SET_VIEWING', {})
      if ('size' in query) {
        await store.commit('property/SET_LIMIT_FILTER', query.size)
      }
      if ('page' in query) {
        await store.commit('property/SET_PAGE_FILTER', query.page)
      }
      await store.dispatch('property/fetchListBanned')
    } catch {
      error({ statusCode: 500, message: 'An error has occurred' })
    }
  },
  data() {
    return {
      // Table limit
      limitOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' }
      ],
      selectedLimit: this.$store.state.property.query.size,
      perPage: this.$store.state.property.query.size,
      // Context menu selected item
      selectedItem: {},
      // Current page
      currentPage: this.$store.state.property.query.page,
      // search text
      searchText: this.$store.state.property.query.name,
      processing: false
    }
  },
  computed: mapState({
    properties: (state) => state.property.viewing,
    query: (state) => state.property.query
  }),
  created() {
    this.$bus.$emit('title', 'Properties List')
  },
  methods: {
    ...mapMutations({
      SET_SEARCH_FILTER: 'property/SET_SEARCH_FILTER',
      SET_PAGE_FILTER: 'property/SET_PAGE_FILTER',
      SET_LIMIT_FILTER: 'property/SET_LIMIT_FILTER'
    }),
    ...mapActions({
      fetchList: 'property/fetchListBanned'
    }),
    changeQueryParams() {
      history.pushState(
        {},
        '',
        `${this.$route.path}?page=${this.currentPage}&limit=${this.selectedLimit}`
      )
    },
    async restoreData(id) {
      try {
        this.processing = true
        await this.$axios.patch(
          `/properties/restore/${id}`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + Cookie.get('token')
            }
          }
        )
        await this.fetchList()
        this.notifyToast('success', 'Success', 'Restore Property Successfully')
      } catch {
        this.notifyToast('error', 'Error', 'Can not restore this property')
      } finally {
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
    }, 1000),
    onSearch: debounce(async function() {
      try {
        await this.SET_SEARCH_FILTER(this.searchText)
        await this.fetchList()
        this.changeQueryParams()
      } catch {
        this.$nuxt.error({ statusCode: 500, message: 'An error has occurred' })
      }
    }, 1000)
  },
  head() {
    return {
      title: 'Properties List',
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
