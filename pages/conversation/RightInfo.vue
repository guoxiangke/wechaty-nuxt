<template>
  <div class="main">
    <div class="title"><p class="text-xl">more-info</p></div>
    <p v-if="connected">已成功链接消息服务器! green</p>
    <p v-if="logged">客服机器人🤖️已登录 green/red</p>
    <div v-for="room in rooms" :key="room.id" :data-toid="room.room_id">
      <div
        class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="sm:flex sm:items-center px-6 py-4">
          <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <p class="text-base leading-tight">{{ room.topic }}</p>
            <p class="text-xs leading-tight text-gray-600">
              {{ room.announce }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightInfo',
  props: {
    rooms: Array,
    connected: Boolean,
    logged: false
  },
  data() {
    return {}
  }
}
</script>
