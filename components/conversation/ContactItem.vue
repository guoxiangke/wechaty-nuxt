<template>
  <div
    class="max-w-sm mx-auto overflow-hidden"
    :data-id="contact.id"
    :data-weight="contact.weight"
    :active="isActive"
    :data-from="contact.from"
  >
    <div class="sm:flex sm:items-center px-6 py-4" @click="active">
      <img
        v-lazy="contact.avatar"
        class="block mx-auto sm:mx-0 sm:flex-shrink-0 h-16 sm:h-12"
        :alt="contact.name"
      />
      <div v-if="contact.unreadCount > 0" class="unreader">
        <button
          class="text-white bg-red-500 border border-red-500 text-xs font-semibold rounded-full px-1 py-0 leading-normal"
          @click="active"
        >
          {{ contact.unreadCount }}
        </button>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
        <p class="text-base leading-tight">{{ contact.name }}</p>
        <p class="text-sm leading-tight text-gray-600">
          {{ contact.alias }}
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
      // todo check if type != room
      return this.contact.id === this.$store.state.conversation.current.id
    }
  },
  methods: {
    active() {
      // console.log('ContactItem active', e.target.textContent)
      // 异步获取 会话消息
      this.$store.dispatch('conversation/init', this.contact.wechatId)
      // 设置当前 active的用户 对话
      this.$store.commit('conversation/ACTIVE', this.contact)
      this.$store.commit('conversation/SET_TYPE', 'contact')

      this.$store.commit('contacts/RESET_UNREAD', this.contact.id)
    }
  }
}
</script>

<style>
[active='true'] {
  background-color: #ffffff;
}
.unreader {
  position: relative;
  top: -25px;
  right: 10px;
}
</style>
