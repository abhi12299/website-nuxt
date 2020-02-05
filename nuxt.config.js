require('dotenv').config()

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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }]
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
    { src: '~/plugins/aos', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
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
  }
}
