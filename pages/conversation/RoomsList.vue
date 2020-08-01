<template>
  <div class="warpper">
    <div class="showControl">
      <button
        class="text-purple-500 hover:text-white hover:bg-purple-500 border border-purple-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
        @click="isShow = !isShow"
      >
        <span v-if="isShow"> 折叠</span>
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
      isShow: false,
      filters: ''
    }
  },
  computed: {
    rooms() {
      const latestMsgs = this.$store.state.messages.list
      const allRoomsObj = this.$store.state.rooms.list
      // orderBy contact.weight
      // 确保有值后再计算
      console.log(Object.keys(allRoomsObj).length, 'allRoomsObj')
      const roomsArray = []
      const self = this
      if (Object.keys(allRoomsObj).length && latestMsgs.length) {
        // // 只含群消息 && ！机器人主动发送的信息
        // // todo 24会变 / 机器人永远置顶，weight = 9999
        // const filterMsgs = latestMsgs.filter(
        //   (item) => item.to.includes('@chatroom') && item.fromId !== 24
        // )
        // // 需要清零weight，不然是累加了
        // filterMsgs.forEach((msg) => {
        //   if (allRoomsObj[msg.fromId]) {
        //     this.$store.commit('rooms/RESET_WEIGHT', msg.fromId)
        //   }
        // })
        // // change weight by messages!
        // filterMsgs.forEach((msg) => {
        //   if (allRoomsObj[msg.fromId]) {
        //     this.$store.commit('rooms/INCREASE_WEIGHT', msg.fromId)
        //   }
        // })

        Object.values(allRoomsObj).forEach((room) => {
          roomsArray.push(room)
        })
        roomsArray.sort((a, b) => (a.weight > b.weight ? -1 : 1))

        return roomsArray.filter(function(room) {
          if (room.alias) {
            return (
              room.alias.includes(self.filters) ||
              room.topic.includes(self.filters)
            )
          }
          return room.topic.includes(self.filters)
        })
      }
      // allRooms 转化成数组，再排序

      return allRoomsObj
    }
  },
  mounted() {
    this.$store.dispatch('rooms/init')
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
