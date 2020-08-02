<template>
  <div
    v-if="isLoaded"
    id="scroll"
    ref="scroll"
    class="warpper"
    :class="hightClass"
    style="overflow-y: scroll;"
  >
    <div class="header-info title text-xl border border-aliceblue bg-aliceblue">
      <div v-if="!isActive" class="p-4">
        Latest Msg
      </div>
      <div v-else class="flex justify-between px-6 py-4 bg-aliceblue">
        <div class="sm:flex sm:items-center info">
          <img
            class="block mx-auto sm:mx-0 sm:flex-shrink-0 h-16 sm:h-12"
            :src="current.avatar"
            :alt="currentTitle"
          />
          <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <p class="text-base leading-tight">{{ currentTitle }}</p>
            <p class="text-sm leading-tight text-gray-600">
              {{ current.alias }}
            </p>
          </div>
        </div>
        <div>
          <button
            class="text-purple-500 hover:text-white hover:bg-purple-500 border border-purple-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
            @click="scrollToEnd()"
          >
            去底部
          </button>
        </div>
      </div>
    </div>

    <div class="latestMsg  p-4">
      <div v-if="!isActive">
        <div
          v-for="message in messages"
          :key="message.id"
          :contact-id="message.fromId"
        >
          <MsgItem :message="message" :contact="contacts[message.fromId]" />
        </div>
      </div>
    </div>

    <div v-if="isActive" class="">
      <div v-for="message in conversation" :key="message.id" class="li">
        <MsgItem :message="message" :contact="contacts[message.fromId]" />
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
      // 首页显示的最近1000条信息
      return this.$store.state.messages.list
    },
    conversation() {
      // 当前 群/会话的 所有消息
      return this.$store.state.conversation.list
    },
    isActive() {
      return Object.keys(this.$store.state.conversation.current).length
    },
    hightClass() {
      return this.isActive ? 'h80' : 'h100'
    },
    current() {
      // 可以是群
      return this.$store.state.conversation.current
    },
    currentTitle() {
      return this.current.name || this.current.topic
    },
    isRoom() {
      return this.$store.state.conversation.type === 'room'
    },
    contacts() {
      // 用于获取 消息所对应的contact
      return this.$store.state.contacts.list
    },
    isLoaded() {
      // Object.keys(allContactsObj).length
      return Object.keys(this.contacts).length && this.messages.length
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
.h80 {
  height: 90vh;
}
.h100 {
  height: 100vh;
}
.warpper {
  background-color: #ffffff;
  background-image: url(/images/background-1@2x.aea5e218.png);
  background-size: 417px 417px;
  background-repeat: repeat;
  background-color: #fff;
}
.li {
  padding: 1em;
  clear: both;
}
</style>
