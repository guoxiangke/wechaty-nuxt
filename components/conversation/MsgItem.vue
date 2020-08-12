<template>
  <div class="warpper">
    <div :class="algin">
      <div class="intercom-comment-container">
        <div class="intercom-comment-container-admin-avatar">
          <div class="intercom-avatar">
            <img :src="contact.avatar" :alt="contact.name" />
          </div>
        </div>
        <div class="intercom-comment" :class="bgColor">
          <div class="intercom-block-paragraph" v-html="content"></div>
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
  data() {
    return {
      bgColor: 'bg-gray-200'
    }
  },
  computed: {
    algin() {
      return this.message.kfId ? 'right flex flex-row-reverse' : 'left'
    },
    content() {
      let content = this.message.content.data
      if (`${content}`.endsWith('.gif') || `${content}`.endsWith('.png')) {
        content = '<img src="/' + content + '" />'
        this.bgColor = 'bg-transparent'
      } else if (content && content.url) {
        // console.log(content)
        content = `<div>
        <a target="_blank" href="${content.url}">
          <div class="title text-indigo-600 font-medium"> <p>${content.title} </p> </div>
          <div class="desc">
          <div class="description"> <p>${content.description} </p> </div>
          <div> <img src="${content.thumbnailUrl}"/> </div>
          </div>
        </a>
        </div>`
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
  padding: 10px 15px;
  border-radius: 4px;
  width: fit-content;
}
.intercom-block-paragraph {
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
