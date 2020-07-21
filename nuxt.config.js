// import io from 'io.config' // import IO options
module.exports = {
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
  css: ['assets/css/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/axios'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://nuxt-socket-io.netlify.app/
    'nuxt-socket-io',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  io: {
    // RES: not work of setting server option
    // server: {
    //   ioSvc: './server/io/index.ts'
    // },

    // module options https://nuxt-socket-io.netlify.app/configuration
    sockets: [
      {
        name: 'main',
        url: 'http://127.0.0.1:3000',
        // RES: if I use next url setting, the demo works very well
        // url: 'https://nuxt-socket-io.herokuapp.com',
        default: true,
        vuex: {
          mutations: [{ progress: 'examples/SET_PROGRESS' }],
          actions: [{ chatMessage: 'FORMAT_MESSAGE' }],
          emitBacks: [
            // 'examples/someObj',
            // 'examples/sample',
            // { 'examples/sample2': 'sample2' }
            // 'titleFromUser'
          ]
        }
      }
    ]
    // sockets: [
    //   {
    //     name: 'home',
    //     url:
    //       process.env.NODE_ENV === 'production'
    //         ? 'https://nuxt-socket-io.herokuapp.com'
    //         : 'http://localhost:3000',
    //     vuex: {
    //       mutations: [{ progress: 'examples/SET_PROGRESS' }],
    //       actions: [{ chatMessage: 'FORMAT_MESSAGE' }],
    //       emitBacks: [
    //         'examples/someObj',
    //         'examples/sample',
    //         { 'examples/sample2': 'sample2' },
    //         'titleFromUser'
    //       ]
    //     },
    //     namespaces: {
    //       '/index': {
    //         emitters: ['getMessage2 + testMsg --> message2Rxd'],
    //         listeners: ['chatMessage2', 'chatMessage3 --> message3Rxd']
    //       },
    //       '/examples': {
    //         emitBacks: ['sample3', 'sample4 <-- myObj.sample4'],
    //         emitters: [
    //           'reset] getProgress + refreshInfo --> progress [handleDone'
    //         ],
    //         listeners: ['progress']
    //       }
    //     }
    //   }
    // ]
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true, // 表示开启代理
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true // 表示跨域请求时是否需要使用凭证
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {}
  }
}
