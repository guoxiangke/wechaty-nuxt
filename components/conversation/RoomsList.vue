<template>
  <div class="warpper">
    <div class="showControl">
      <button
        class="text-purple-500 hover:text-white hover:bg-purple-500 border border-purple-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
        @click="isShow = !isShow"
      >
        <span v-if="isShow"> 隐藏</span>
        <span v-else> 展开</span>
        群
      </button>
    </div>

    <transition-group name="list" tag="div">
      <div
        v-for="room in rooms"
        v-show="isShow"
        :key="room.id"
        :data-toid="room.room_id"
      >
        <RoomItem :room="room" />
      </div>
    </transition-group>
  </div>
</template>

<script>
import RoomItem from './RoomItem'
export default {
  name: 'RoomsList',
  components: {
    RoomItem
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    filters() {
      return this.$store.state.search.keyword
    },
    rooms() {
      const latestMsgs = this.$store.state.messages.list
      const allRoomsObj = this.$store.state.rooms.list

      const roomsArray = []
      // 确保有值后再计算
      if (Object.keys(allRoomsObj).length && latestMsgs.length) {
        // 转换成数组再filter Array.filter
        Object.values(allRoomsObj).forEach((room) => {
          roomsArray.push(room)
        })
        // rooms 无weight，不再排序
        // roomsArray.sort((a, b) => (a.weight > b.weight ? -1 : 1))

        return roomsArray.filter((room) => {
          if (room.alias) {
            return (
              room.alias.includes(this.filters) ||
              room.topic.includes(this.filters)
            )
          }
          return room.topic.includes(this.filters)
        })
      }
      // allRooms 转化成数组，再排序

      return allRoomsObj
    }
  },
  mounted() {
    this.$store.dispatch('rooms/init')
  },
  methods: {}
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
