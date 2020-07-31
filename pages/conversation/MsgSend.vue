<template>
  <div class="intercom-conversation-footer">
    <textarea
      id="textarea"
      v-model="newMessage"
      type="textarea"
      name="message"
      placeholder="发布消息..."
      :disabled="isDisabled"
      @keyup.enter="sendMsg"
    ></textarea>

    <div class="mt-4">
      <button
        class="text-purple-500 hover:text-white hover:bg-purple-500 border border-purple-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
        :disabled="isDisabled"
        @click="sendMsg"
      >
        发送
      </button>
    </div>
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
      return !Object.keys(this.$store.state.contacts.contact).length
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
        id: this.$store.state.contacts.contact.wechatId, // 'bluesky_still', // 获取当前的wechatID
        content: {
          type: 'text',
          data: this.newMessage
        }
      }
      // POST /api/bots/1/send
      const res = await this.$axios.$post('/bots/1/send', body)
      this.newMessage = ''
      // todo if(!res)  alert('消息发送失败')
      console.log('res of send always false: todo', res)
    }
  }
}
</script>

<style></style>
