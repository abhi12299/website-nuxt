require('dotenv').config()
const keys = require('./constants/apiKeys')

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Abhishek Mehandiratta | Web Developer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'Abhishek Mehandiratta | Web Developer'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    // script: [{ src: '/removePreloader.js' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'black', height: '5px' },
  /*
   ** Global CSS
   */
  css: ['~/css/index.css', 'aos/dist/aos.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/toastr-init', mode: 'client' },
    { src: '~/plugins/aos', mode: 'client' },
    { src: '~/plugins/removePreloader', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    [
      '@nuxtjs/google-analytics',
      {
        id: keys.GTAG_ID
        // debug: {
        //   enabled: true,
        //   sendHitTask: true
        // }
      }
    ]
  ],
  router: {
    middleware: 'auth'
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    [
      'nuxt-fontawesome',
      {
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
    ]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  pwa: {
    workbox: {
      cachingExtensions: '~/plugins/sw-cache.js'
    }
  },
  manifest: {
    name: 'Abhishek Mehandiratta | Web Developer',
    short_name: 'AM | Web Developer',
    lang: 'en',
    display: 'standalone',
    start_url: 'https://iabhishek.dev',
    background_color: '#F0F0F0',
    theme_color: '#FFFFFF',
    icons: [
      {
        src: '/android-icon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
        density: '0.75'
      },
      {
        src: '/android-icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
        density: '1.0'
      },
      {
        src: '/android-icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        density: '1.5'
      },
      {
        src: '/android-icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        density: '2.0'
      },
      {
        src: '/android-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        density: '3.0'
      },
      {
        src: '/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        density: '4.0'
      }
    ]
  }
}
