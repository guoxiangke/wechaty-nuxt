<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        nuxtChat
      </h1>
      <h2 class="subtitle">
        微信个人机器人助理
      </h2>
      <div class="links">
        <nuxt-link
          v-if="!$store.state.authUser"
          to="/login"
          class="button--green"
          >登录</nuxt-link
        >
        <button v-else class="button button--green" @click.stop="logout">
          Logout
        </button>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          文档
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Logo from '~/components/Logo.vue'

export default Vue.extend({
  components: {
    Logo
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      console.log('socket connected')
    },
    disconnect() {
      console.log('socket disconnect')
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
    }
  }
})
</script>

<style scoped>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
