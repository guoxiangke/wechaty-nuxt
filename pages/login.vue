<template>
  <div class="container">
    <div>
      <form v-if="!$store.state.authUser" @submit.prevent="login">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              v-model="email"
              name="email"
              class="input"
              type="text"
              placeholder="Text input"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              v-model="password"
              name="password"
              class="input"
              type="text"
              placeholder="Text input"
            />
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" type="submit">Submit</button>
          </div>
        </div>
      </form>
      <div v-else>
        <p>Login Already, <nuxt-link to="/"> go to Homepage?</nuxt-link></p>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" @click.stop="logout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      formError: null,
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })
        this.email = ''
        this.password = ''
        this.formError = null
        // https://router.vuejs.org/guide/#javascript
        // return this.$route.params.username
        // window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        this.$router.push('/conversation')
      } catch (e) {
        this.formError = e.message
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('logout')
      } catch (e) {
        this.formError = e.message
      }
    }
  }
})
</script>

<style scoped></style>
