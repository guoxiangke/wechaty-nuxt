<template>
  <div
    class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
    :data-id="contact.id"
    :data-weight="contact.weight"
    :active="isActive"
  >
    <div class="sm:flex sm:items-center px-6 py-4">
      <img
        class="block mx-auto sm:mx-0 sm:flex-shrink-0 h-16 sm:h-12 rounded-full"
        :src="contact.avatar"
        :alt="contact.name"
      />
      <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
        <p class="text-base leading-tight">{{ contact.name }}</p>
        <p class="text-sm leading-tight text-gray-600">
          {{ contact.alias }}

          <button
            class="text-purple-500 hover:text-white hover:bg-purple-500 border border-purple-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
            @click="active"
          >
            消息 {{ contact.unreadCount }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactItem',
  props: {
    contact: Object
  },
  computed: {
    isActive() {
      return this.contact.id === this.$store.state.contacts.contact.id
    }
  },
  methods: {
    active(e) {
      this.$store.commit('contacts/ACTIVE', this.contact)
      console.log('ContactItem active', e.target.textContent)
      // 异步获取 当前active用户的会话消息
      this.$store.dispatch('conversation/active', this.contact.wechatId)

      this.$store.commit('contacts/RESET_UNREAD', this.contact.id)
    }
  }
}
</script>

<style>
[active='true'] {
  background-color: aliceblue;
}
</style>
