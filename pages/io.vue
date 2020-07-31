<template id="product-list">
  <section class="grid grid-cols-4" style="height: 100vh;">
    <p v-if="isConnected">We're connected to the server!</p>
    <p>Message from server: "{{ socketMessage }}"</p>
    <button @click="pingServer()">Ping Server</button>

    <button @click="clickButton">ping</button>
  </section>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  async asyncData(context) {
    // Get first page! https://blog.csdn.net/Tomwildboar/article/details/95928616
    const uri = '/conversation/1' // + context.page
    const res = await context.$axios.get(uri)
    return { contacts: res.contacts, rooms: res.rooms }
  },
  data() {
    return {
      isConnected: false,
      socketMessage: '',
      filters: '',
      newMessage: '',
      messageRxd: 'xxx'
    }
  },
  computed: {
    // ...mapState(['chatMessages']),
    filteredContacts() {
      const self = this

      // self.contacts.sort(function(p1, p2) {
      //   return p2.id - p1.id
      // })
      // console.log(self.lists.length, self.filters)
      if (!self.filters) {
        return self.contacts
      }
      return self.contacts.filter(function(contact) {
        return contact.name.includes(self.filters)
      })
    },
    filteredRooms() {
      const self = this

      // self.contacts.sort(function(p1, p2) {
      //   return p2.id - p1.id
      // })
      if (!self.filters) {
        return self.rooms
      }
      return self.rooms.filter(function(contact) {
        return contact.name.includes(self.filters)
      })
    },
    page() {
      return this.$route.query.page
    }
  },
  async created() {
    // await this.getList()
  },
  mounted() {},
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true
    },

    disconnect() {
      this.isConnected = false
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data
    },
    // broadcast
    newMsgEmit(data) {
      this.socketMessage = data
      this.$store.commit('messages/ADD', data)
    }
  },
  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.client.emit('pingServer', 'PING!')
    },
    clickButton() {
      console.log('clickButton', 'emit_ping')
      this.$socket.client.emit('emit_ping', { data: 'ping' })
    },
    activeChat($e) {
      console.log($e.target.dataset.type, $e.target.dataset.index)
      const current = {
        type: $e.target.dataset.type,
        index: $e.target.dataset.index
      }
      this.current = current // attributes.data('type')
    },
    getMessage() {
      // // return new Promise((resolve) => {
      // this.socket.emit('getMessage', { id: 'abc123' }, (resp) => {
      //   this.messageRxd = resp
      //   // resolve()
      // })
      // this.socket.emit('broadcastMsg')
      // // })
    }
  }
}
</script>

<style>
.logo {
  width: 50px;
  float: left;
  margin-right: 15px;
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
#textarea {
  padding: 1em;
  width: 100%;
  background-color: aliceblue;
}
</style>
