<template>
  <div id="sidebar" class="sidebar">
    <!-- User info -->
    <div v-if="$store.state.user.currentUser != null" class="sidebar-user-info">
      <div class="w-100 text-center">
        <b-avatar
          v-if="$store.state.user.currentUser.avatar == null"
          variant="info"
          :src="require('~/assets/img/default-man.png')"
          size="3rem"
        ></b-avatar>
        <b-avatar
          v-else
          variant="info"
          :src="$store.state.user.currentUser.avatar"
          size="6rem"
        ></b-avatar>
      </div>
      <div class="text-center">
        <p class="m-0">
          {{ $store.state.user.currentUser.fullName }}
        </p>
        <p class="m-0 color-red" style="font-size: 0.8rem; font-weight: 500">
          {{ $store.state.user.currentUser.role }}
        </p>
      </div>
    </div>
    <div role="tablist" class="mb-10 text-gray">
      <!-- User -->
      <b-card no-body class="accordion mb-1">
        <b-card-header
          v-b-toggle="'accordion-1'"
          header-tag="header"
          class="accordion-header"
          role="tab"
          header-bg-variant="white"
        >
          <span class="navigation-header">
            <fa :icon="['far', `user-circle`]" class="mr-1 color-red" />
            {{ 'User management' }}
          </span>
          <fa
            class="opened"
            :icon="['fas', 'angle-down']"
            style="float: right"
          />
          <fa class="closed" :icon="['fas', 'angle-up']" style="float: right" />
        </b-card-header>
        <b-collapse :id="'accordion-1'" role="tabpanel" visible>
          <b-card-body class="py-0 pl-5">
            <nuxt-link
              to="/users"
              :event="$route.path == '/users' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['far', 'list-alt']" class="mr-1 color-red" />
                Users List
              </p>
            </nuxt-link>
            <nuxt-link
              to="/users/create"
              :event="$route.path == '/users/create' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['far', `plus-square`]" class="mr-1 color-red" />
                {{ 'Add user' }}
              </p>
            </nuxt-link>
            <nuxt-link
              to="/users/deleted"
              :event="$route.path == '/users/deleted' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['far', `trash-alt`]" class="mr-1 color-red" />
                Banned List
              </p>
            </nuxt-link>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- Property -->
      <b-card no-body class="accordion mb-1">
        <b-card-header
          v-b-toggle="'accordion-2'"
          header-tag="header"
          class="accordion-header"
          role="tab"
          header-bg-variant="white"
        >
          <span class="navigation-header">
            <fa :icon="['far', `building`]" class="mr-1 color-red" />
            {{ 'Apartment management' }}
          </span>
          <fa
            class="opened"
            :icon="['fas', 'angle-down']"
            style="float: right"
          />
          <fa class="closed" :icon="['fas', 'angle-up']" style="float: right" />
        </b-card-header>
        <b-collapse :id="'accordion-2'" role="tabpanel">
          <b-card-body class="py-0 pl-5">
            <nuxt-link
              to="/properties"
              :event="$route.path == '/properties' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['far', 'list-alt']" class="mr-1 color-red" />
                {{ 'Apartments List' }}
              </p>
            </nuxt-link>
            <nuxt-link
              to="/properties/deleted"
              :event="$route.path == '/properties/deleted' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['far', `trash-alt`]" class="mr-1 color-red" />
                {{ 'Banned Apartment' }}
              </p>
            </nuxt-link>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- Category -->
      <b-card no-body class="accordion mb-1">
        <b-card-header
          v-b-toggle="'accordion-3'"
          header-tag="header"
          class="accordion-header"
          role="tab"
          header-bg-variant="white"
        >
          <span class="navigation-header">
            <fa :icon="['fas', `list-ol`]" class="mr-1 color-red" />
            {{ 'Category management' }}
          </span>
          <fa
            class="opened"
            :icon="['fas', 'angle-down']"
            style="float: right"
          />
          <fa class="closed" :icon="['fas', 'angle-up']" style="float: right" />
        </b-card-header>
        <b-collapse :id="'accordion-3'" role="tabpanel">
          <b-card-body class="py-0 pl-5">
            <nuxt-link
              to="/categories"
              :event="$route.path == '/categories' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['far', `list-alt`]" class="mr-1 color-red" />
                {{ 'Categories List' }}
              </p>
            </nuxt-link>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- Registration -->
      <b-card no-body class="accordion mb-1">
        <b-card-header
          v-b-toggle="'accordion-4'"
          header-tag="header"
          class="accordion-header"
          role="tab"
          header-bg-variant="white"
        >
          <span class="navigation-header">
            <fa :icon="['far', `eye`]" class="mr-1 color-red" />
            {{ 'Registration management' }}
          </span>
          <fa
            class="opened"
            :icon="['fas', 'angle-down']"
            style="float: right"
          />
          <fa class="closed" :icon="['fas', 'angle-up']" style="float: right" />
        </b-card-header>
        <b-collapse :id="'accordion-4'" role="tabpanel">
          <b-card-body class="py-0 pl-5">
            <nuxt-link
              to="/registrations"
              :event="$route.path == '/registrations' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['fas', `info-circle`]" class="mr-1 color-blue" />
                {{ 'Registrations List' }}
              </p>
            </nuxt-link>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- Booking -->
      <b-card no-body class="accordion mb-1">
        <b-card-header
          v-b-toggle="'accordion-5'"
          header-tag="header"
          class="accordion-header"
          role="tab"
          header-bg-variant="white"
        >
          <span class="navigation-header">
            <fa :icon="['fas', `file-invoice`]" class="mr-1 color-red" />
            {{ 'Booking management' }}
          </span>
          <fa
            class="opened"
            :icon="['fas', 'angle-down']"
            style="float: right"
          />
          <fa class="closed" :icon="['fas', 'angle-up']" style="float: right" />
        </b-card-header>
        <b-collapse :id="'accordion-5'" role="tabpanel">
          <b-card-body class="py-0 pl-5">
            <nuxt-link
              to="/bookings"
              :event="$route.path == '/bookings' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['fas', `info-circle`]" class="mr-1 color-blue" />
                {{ 'Booking List' }}
              </p>
            </nuxt-link>
            <nuxt-link
              to="/bookings/transactions"
              :event="$route.path == '/bookings/transactions' ? '' : 'click'"
              class="navigation-item"
              @click.native="checkActive"
            >
              <p>
                <fa :icon="['fas', `plus-circle`]" class="mr-1 color-green" />
                {{ 'Transactions List' }}
              </p>
            </nuxt-link>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SidebarAdmin',
  data() {
    return {
      selectedLang: null,
      entity: [
        ['user', 'users'],
        ['archive', 'classes'],
        ['book', 'posts']
      ],
      lang: [
        { value: 'en', text: 'EN' },
        { value: 'vi', text: 'VI' }
      ]
    }
  },
  watch: {},
  mounted() {
    this.checkActive()
  },
  methods: {
    checkActive() {
      const elements = this.$el.querySelectorAll('.navigation-item')
      setTimeout(() => {
        elements.forEach((element) => {
          if (this.$route.path == element.pathname) {
            element.classList.add('color-red')
          } else {
            element.classList.remove('color-red')
          }
        })
      }, 800)
    }
  }
}
</script>
<style lang="scss" scoped>
// CSS for item
.sidebar {
  height: 100%;
  box-shadow: $shadow;
  .sidebar-user-info {
    font-size: 1rem;
    padding: 0.7rem;
    margin-bottom: 0.5rem;
  }
}
.user-badge {
  color: $blue;
  font-weight: bold;
}
.accordion {
  cursor: pointer;
  border-radius: 0;
  border: none;
}
.accordion-header {
  border: none;
  &:focus {
    border: none;
    outline: none;
  }
}
.border-left-gray {
  border-left: 5px solid $gray-500;
}
.collapsed > .opened,
:not(.collapsed) > .closed {
  display: none;
}
.navigation-header {
  color: $black;
  user-select: none;
}
.navigation-item {
  text-decoration: none;
  color: $gray-700;
  user-select: none;
  &:hover {
    color: $blue;
  }
}
.text-blue {
  background-color: aqua;
  color: $blue;
}
</style>
