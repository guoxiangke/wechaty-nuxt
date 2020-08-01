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
      return this.room.id === this.$store.state.rooms.current.id
    }
  },
  methods: {
    active() {
      this.$store.commit('rooms/ACTIVE', this.room)

      // // 异步获取 当前active用户的会话消息
      // this.$store.dispatch('conversation/active', this.room.wechatId)

      // this.$store.commit('rooms/RESET_UNREAD', this.room.id)
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
