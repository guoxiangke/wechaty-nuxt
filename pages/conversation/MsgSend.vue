<template>
  <div v-if="!isDisabled">
    <textarea
      id="textarea"
      v-model="newMessage"
      type="textarea"
      name="message"
      placeholder="回车发布消息..."
      :disabled="isDisabled"
      class="bg-aliceblue focus:bg-white focus:border-gray-300 placeholder-gray-600 duration-100 ease-in-out focus:outline-none border border-transparent "
      @keyup.enter="sendMsg"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'MsgSend',
  data() {
    return {
      newMessage: ''
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
      const res = await this.$axios.$post('/bots/1/send', body)
      this.newMessage = ''
      // todo if(!res)  alert('消息发送失败')
      console.log('res of send always： false: todo', res)
    }
  }
}
</script>

<style scoped>
#textarea {
  padding: 1em;
  width: 100%;
}
</style>
