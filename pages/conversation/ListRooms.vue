<template>
  <div class="warpper">
    <div class="showControl">
      <button
        class="text-purple-500 hover:text-white hover:bg-purple-500 border border-purple-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
        @click="isShow = !isShow"
      >
        展开/折叠群
      </button>
    </div>

    <transition-group name="list" tag="div">
      <div
        v-for="room in rooms"
        v-show="isShow"
        :key="room.id"
        :data-toid="room.room_id"
        @click="select"
      >
        <div
          class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div class="sm:flex sm:items-center px-6 py-4">
            <img
              class="block mx-auto sm:mx-0 sm:flex-shrink-0 h-16 sm:h-12 rounded-full"
              :src="room.avatar"
              :alt="room.topic"
            />
            <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
              <p class="text-base leading-tight">{{ room.topic }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'ListRooms',
  props: {
    rooms: Array
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    select() {
      alert('todo')
    }
  }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
