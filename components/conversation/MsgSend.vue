<template>
  <div v-if="!isDisabled">
    <div class="relative">
      <textarea
        id="textarea"
        v-model="newMessage"
        type="textarea"
        name="message"
        placeholder="回车发布消息..."
        :disabled="isDisabled || sending"
        class="bg-aliceblue focus:bg-white focus:border-gray-300 placeholder-gray-600 duration-100 ease-in-out focus:outline-none border border-transparent "
        @keyup.enter="sendMsg"
      >
      </textarea>
      <div v-show="sending" class="lds-ring absolute right-0 top-auto">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MsgSend',
  data() {
    return {
      newMessage: '',
      sending: false
    }
  },
  computed: {
    isDisabled() {
      // var isMyObjectEmpty = !Object.keys(myObject).length;
      return !Object.keys(this.current).length
    },
    current() {
      return this.$store.state.conversation.current
    },
    to() {
      // 消息发送给 谁？ wechatId/roomId xxx@chatroom
      return this.current.wechatId || this.current.roomId
    }
  },
  methods: {
    async sendMsg() {
      // 验证
      if (this.newMessage === '') {
        alert('消息不能为空')
        return
      }
      const body = {
        id: this.to,
        content: {
          type: 'text',
          data: this.newMessage
        }
      }
      // POST /api/bots/1/send
      this.sending = true
      const { success } = await this.$axios.$post('/bots/1/send', body)
      this.sending = false
      if (!success) {
        alert('消息发送失败')
      } else {
        this.newMessage = ''
      }
      // scrollToBottom
    }
  }
}
</script>

<style scoped>
#textarea {
  padding: 1em;
  width: 100%;
}
/* // https://loading.io/css/ */
.lds-ring {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 30px;
  height: 30px;
  margin: 5px;
  border: 5px solid #15c399;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #15c399 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
