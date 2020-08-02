<template id="product-list">
  <section
    id="conversation-page"
    class="grid grid-cols-4"
    style="height: 100vh;"
  >
    <div class="col-span-1 contacts" style="overflow-y: scroll;">
      <section class="grid grid-cols-1 gap-4 p-4">
        <Search />
        <RoomsList />
        <ContactsList />
      </section>
    </div>
    <div class="col-span-1 conversations">
      <MsgList />
      <MsgSend />
    </div>
    <div class="col-span-2 infos invisible lg:invisible xl:visible p-4">
      <RightInfo :connected="isConnected" :logged="isBotLogin" />
    </div>
  </section>
</template>

<script>
// import { mapState } from 'vuex'
import RoomsList from './RoomsList'
import ContactsList from './ContactsList'
import RightInfo from './RightInfo'
import MsgList from './MsgList'
import MsgSend from './MsgSend'
import Search from './Search'

export default {
  components: {
    Search,
    RoomsList,
    ContactsList,
    MsgList,
    RightInfo,
    MsgSend
  },
  async asyncData(context) {
    // Get first page! https://blog.csdn.net/Tomwildboar/article/details/95928616
    const uri = '/bots/1/login' // + context.page
    const res = await context.$axios.get(uri)
    return { isBotLogin: res.success }
  },
  data() {
    return {
      isBotLogin: false,
      isConnected: false,
      contacts: [],
      rooms: []
    }
  },
  computed: {
    // // ...mapState(['chatMessages']),
    // filteredContacts() {
    //   const self = this

    //   // self.contacts.sort(function(p1, p2) {
    //   //   return p2.id - p1.id
    //   // })
    //   // console.log(self.lists.length, self.filters)
    //   if (!self.filters) {
    //     return self.contacts
    //   }
    //   return self.contacts.filter(function(contact) {
    //     return contact.name.includes(self.filters)
    //   })
    // },
    // filteredRooms() {
    //   const self = this

    //   // self.contacts.sort(function(p1, p2) {
    //   //   return p2.id - p1.id
    //   // })
    //   if (!self.filters) {
    //     return self.rooms
    //   }
    //   return self.rooms.filter(function(contact) {
    //     return contact.name.includes(self.filters)
    //   })
    // },
    page() {
      return this.$route.query.page
    },
    current() {
      return this.$store.state.conversation.current
    }
  },
  created() {},
  mounted() {},
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true
    },

    disconnect() {
      this.isConnected = false
    },

    // broadcast
    newMsgEmit(message) {
      this.$store.commit('messages/ADD', message)
      // 如果新到消息在某个active会话，则加入到 conversation 数据里
      if (
        this.current.wechatId === message.to ||
        this.current.roomId === message.to
      ) {
        this.$store.commit('conversation/ADD', message)
      } else {
        // 未读消息 +1
        this.$store.commit('contacts/INCREAE_UNREAD', message.fromId)
      }
    }
  },
  methods: {}
}
</script>

<style>
.search {
  margin: 0 1em;
  width: 90%;
}
#conversation-page {
  background-color: #abd9e9;
}
.bg-aliceblue {
  background: #eff3f7;
}
.form-group {
  max-width: 500px;
}

.actions {
  padding: 10px 0;
}

.glyphicon-euro {
  font-size: 12px;
}
</style>
