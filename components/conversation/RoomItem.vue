<template>
  <div
    class="max-w-sm mx-auto overflow-hidden"
    :data-id="room.id"
    :active="isActive"
  >
    <div class="sm:flex sm:items-center px-6 py-4" @click="active">
      <img
        class="block mx-auto sm:mx-0 sm:flex-shrink-0 h-16 sm:h-12"
        :src="room.avatar"
        :alt="room.topic"
      />
      <div v-if="room.unreadCount > 0" class="unreader">
        <button
          class="text-white bg-red-500 border border-red-500 text-xs font-semibold rounded-full px-1 py-0 leading-normal"
          @click="active"
        >
          {{ room.unreadCount }}
        </button>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
        <p class="text-base leading-tight">{{ room.topic }}</p>
        <p class="text-sm leading-tight text-gray-600">
          {{ room.alias }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactItem',
  props: {
    room: Object
  },
  computed: {
    isActive() {
      return this.room.id === this.$store.state.conversation.current.id
    }
  },
  methods: {
    active() {
      // 异步获取 群消息
      this.$store.dispatch('conversation/init', this.room.roomId)
      // 设置当前 active的群 对话
      this.$store.commit('conversation/ACTIVE', this.room)
      this.$store.commit('conversation/SET_TYPE', 'room')

      // 重置 未读消息
      this.$store.dispatch('rooms/reset_unread', this.room.roomId)
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
