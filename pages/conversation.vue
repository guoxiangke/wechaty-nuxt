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
    </div>
    <div class="col-span-2 infos invisible lg:invisible xl:visible p-4">
      <div v-if="!isBotLogin">
        <div v-if="loginQR">
          <img :src="loginQR" />

          请联系bot持有者，微信扫描此二维码，扫描登录。长按识别二维码无效
        </div>
      </div>
      <RightInfo :logged="isBotLogin" />
    </div>
  </section>
</template>

<script>
// import { mapState } from 'vuex'
import RoomsList from '~/components/conversation/RoomsList'
import ContactsList from '~/components/conversation/ContactsList'
import RightInfo from '~/components/conversation/RightInfo'
import MsgList from '~/components/conversation/MsgList'
// import MsgSend from '~/components/conversation/MsgSend'
import Search from '~/components/conversation/Search'

export default {
  // 确保用户已经登录，登录的用户有绑定的botId
  middleware: 'auth',
  components: {
    Search,
    RoomsList,
    ContactsList,
    MsgList,
    RightInfo
  },
  data() {
    return {
      isBotLogin: false,
      loginQR: ''
    }
  },
  computed: {
    current() {
      return this.$store.state.conversation.current
    }
  },
  async mounted() {
    await this.$store.dispatch('contacts/init')
    await this.$store.dispatch('messages/init')
    this.loginBot()
  },
  sockets: {
    // connect() {
    //   // Fired when the socket connects.
    //   this.isConnected = true
    // },
    disconnect() {
      alert('与服务器链接已断开')
      // this.isConnected = false
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
        // eslint-disable-next-line no-lonely-if
        if (message.to.includes('@chatroom')) {
          this.$store.commit('rooms/INCREAE_UNREAD', message.to)
        } else {
          this.$store.commit('contacts/INCREAE_UNREAD', message.fromId)
        }
      }
    }
  },
  methods: {
    async loginBot() {
      // 确保用户已经登录，登录的用户有绑定的botId
      const botId = this.$store.state.authUser.botId
      const uri = `/bots/${botId}/login` // + context.page
      const data = await this.$axios.$get(uri)
      if ('success' in data) {
        this.isBotLogin = data.success
      } else {
        this.loginQR = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data.qrcode}`
      }
    }
  }
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
