<template>
  <div v-if="contact" class="warpper">
    <div :class="algin">
      <div class="intercom-comment-container">
        <div class="intercom-comment-container-admin-avatar">
          <div class="intercom-avatar">
            <img v-lazy="contact.avatar" :alt="contact.name" />
          </div>
        </div>
        <div class="intercom-comment max-w-full bg-gray-200 break-all">
          <div v-html="content"></div>
        </div>
      </div>
    </div>
    <div :class="algin" class="intercom-conversation-part-metadata">
      {{ contact.name }}
      &nbsp;&nbsp; {{ message.created_at.substr(5, 11).replace('T', ' ') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MsgItem',
  props: {
    message: Object,
    contact: Object
  },
  computed: {
    algin() {
      return this.message.kfId ? 'right flex flex-row-reverse' : 'left'
    },
    content() {
      let content = this.message.content.data
      const type = this.message.type
      switch (type) {
        case 2: // MessageType.Audio voice
          content = `<audio controls src="${content}"/>`
          break
        case 5: //  MessageType.Emoticon
        case 6: //  MessageType.Image
          content =
            '<div  class="px-4 py-2"><img src="/' + content + '" /></div>'
          this.bgColor = 'bg-transparent'
          break
        case 13: // Url
          content = `<div>
        <a target="_blank" href="${content.url}">
          <div class="title text-indigo-600 font-medium"> <p>${content.title} </p> </div>
          <div class="desc">
          <div class="description"> <p>${content.description} </p> </div>
          <div> <img src="${content.thumbnailUrl}"/> </div>
          </div>
        </a>
        </div>`
          break
        case 7: // MessageType.Text
          content = `<div class="px-4 py-2">${content}</div>`
          break

        default:
          break
      }
      return content
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped>
/* .li.right {
  padding-right: 1em;
  max-width: 80%;
} */

.intercom-comment-container {
  padding-left: 40px;
  position: relative;
  max-width: 85%;
}
.right .intercom-comment-container {
  padding-left: 0px;
  position: relative;
  max-width: 85%;
}

.right .intercom-conversation-part-metadata {
  padding-left: 0px;
  clear: both;
  color: #a8b6c2;
  font-size: 10px;
  padding-top: 5px;
  text-align: right;
}
.right .intercom-comment-container-admin-avatar {
  display: none;
}
.intercom-comment-container-admin-avatar {
  position: absolute;
  left: 0;
  bottom: 10px;
}
.intercom-comment {
  color: #606273;
  border-radius: 4px;
  width: fit-content;
}
.intercom-block-paragraph {
  padding: 10px 15px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 1.4;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}
.intercom-conversation-part-metadata {
  padding-left: 40px;
  clear: both;
  color: #a8b6c2;
  font-size: 10px;
  padding-top: 5px;
}
.intercom-avatar {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  margin: 0 auto;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}
.intercom-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
#online-avatar {
  margin: 1rem 0 1rem 1rem;
}
.chat-profile {
  width: 50px;
}
.right .intercom-comment-container {
  padding: 0;
  padding: none;
  width: fit-content;
  max-width: 100%;
}

.right .intercom-comment {
  color: #fff;
  background-color: #1f8ceb;
}
</style>
