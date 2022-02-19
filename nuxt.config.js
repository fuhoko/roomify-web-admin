/* eslint-disable */
export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/scss/plugins/bootstrap-vue/custom.scss',
    '~/assets/scss/main.scss',
    '~/assets/scss/common/all.scss',
    '~/assets/scss/plugins/splide/all.scss'
  ],
  /*
   ** Import scss resource in every component so we can use the global variant varibles
   */
  styleResources: {
    scss: [
      '~/assets/scss/plugins/bootstrap-vue/variants/main.scss',
      '~/assets/scss/main.scss',
      '~/assets/scss/common/all.scss'
    ]
  },
  /*
   ** Plugins to load before mounting the App
   */

  plugins: [
    // Plugins
    '~/plugins/i18n.js',
    '~/plugins/context-menu.js',
    '~/plugins/vee-validate.js',
    '~/plugins/google-map.js',
    // Utilities
    '~/utils/bus.js', // Event bus
    '~/utils/filters.js', // Filters for custom text formating
    '~/mixins' // Global helper functions, use this.function_name() in your component
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/moment'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          },
          {
            set: '@fortawesome/free-regular-svg-icons',
            icons: ['far']
          }
        ]
      }
    ],
    '@nuxtjs/style-resources'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:3000/api/v1'
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [
      /^vue2-google-maps($|\/)/,
      'vee-validate'
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  },
  /*
  roter.base is not required!
  This will make the static files use ./_nuxt instead of /_nuxt for src
  Which will help avoid 404 error sometime
  Because / is from the root folder of the whole computer
  While ./ will access the same level of directory and stuf :D
  */
  router: {
  },
  server: {
    port: process.env.PORT || 3333, // default: 3000
    host: process.env.HOST || '127.0.0.1', // default: localhost,
    timing: false
  },
  generate: {
  }
}
