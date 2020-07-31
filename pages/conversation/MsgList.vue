<template>
  <div
    id="scroll"
    ref="scroll"
    class="warpper"
    style="height:80vh; overflow-y: scroll; padding:1em"
  >
    <div class=" title text-xl">chatform 111</div>

    <div class="latestMsg">
      <ul v-if="!isActive">
        <h1>Latest messages</h1>
        <li
          v-for="message in messages"
          :key="message.id"
          :contact-id="message.fromId"
        >
          {{ message.content.data }} == {{ message.fromId }} ==
          {{ message.to }} ==
        </li>
      </ul>
    </div>

    <div v-if="isActive" class="bubble-dialog">
      <button
        class="text-purple-500 hover:text-white hover:bg-purple-500 border border-purple-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
        @click="scrollToEnd()"
      >
        去底部
      </button>
      <div v-for="message in conversation" :key="message.id" class="bubble">
        <MsgItem :message="message" />
      </div>
    </div>
  </div>
</template>

<script>
import MsgItem from './MsgItem'

export default {
  name: 'MsgList',
  components: { MsgItem },
  computed: {
    messages() {
      return this.$store.state.messages.list
    },
    conversation() {
      return this.$store.state.conversation.list
    },
    isActive() {
      this.scrollToEnd()
      return Object.keys(this.$store.state.contacts.contact).length
    }
  },
  created() {},
  mounted() {
    this.$store.dispatch('messages/init')
  },
  methods: {
    scrollToEnd() {
      const container = this.$refs.scroll // .querySelector('#scroll')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }
}
</script>

<style scoped>
.bubble-dialog {
  white-space: pre-line;
  line-height: 0;
}
</style>
