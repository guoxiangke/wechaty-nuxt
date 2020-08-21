<template>
  <div>
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

    <div
      v-if="isLoaded"
      id="scroll"
      ref="scroll"
      class="warpper"
      :class="hightClass"
      style="overflow-y: scroll;"
    >
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

    <div v-if="!isDisabled">
      <div class="relative">
        <input
          id="file"
          ref="file"
          type="file"
          name="file"
          class="m-4 mr-0 ml-0 bg-aliceblue p-4"
          @change="handleFileUpload"
        />
        <textarea
          id="textarea"
          ref="input"
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
  </div>
</template>

<script>
import MsgItem from './MsgItem'

export default {
  name: 'MsgList',
  components: { MsgItem },
  data() {
    return {
      file: '',
      newMessage: '',
      sending: false
    }
  },
  computed: {
    isDisabled() {
      // var isMyObjectEmpty = !Object.keys(myObject).length;
      return !Object.keys(this.current).length
    },
    to() {
      // 消息发送给 谁？ wechatId/roomId xxx@chatroom
      return this.current.wechatId || this.current.roomId
    },

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
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0]
    },
    focus() {
      this.$nextTick(() => this.$refs.input.focus())
    },
    scrollToEnd() {
      const container = this.$refs.scroll
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    async sendMsg() {
      // 验证, 文件/文字 选其一
      if (this.newMessage.trim() === '' && this.file === '') {
        alert('消息不能为空')
        this.newMessage = ''
        this.focus()
        return
      }
      // POST /api/bots/1/send
      this.sending = true
      const formData = new FormData()
      if (this.file) {
        formData.append('file', this.file)
      }
      formData.append('to', this.to)
      formData.append('type', 'text')
      formData.append('data', this.newMessage.trim())
      const { success } = await this.$axios.$post('/bots/1/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.sending = false
      if (!success) {
        alert('消息发送失败')
      } else {
        this.newMessage = ''
        this.file = ''
        this.$refs.file.value = ''
        this.focus()
      }
      // scrollToBottom
      this.scrollToEnd()
    }
  }
}
</script>

<style scoped>
.h80 {
  height: 68vh;
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
