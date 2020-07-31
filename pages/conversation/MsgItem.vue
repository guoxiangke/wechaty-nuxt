<template>
  <div class="warpper">
    <div :class="algin">
      <p>{{ message.content.data }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MsgItem',
  props: { message: Object },
  computed: {
    algin() {
      return this.message.kfId ? 'bubble-right' : 'bubble-left'
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped>
.bubble-dialog {
  white-space: pre-line;
  line-height: 0;
}

.bubble-left,
.bubble-right {
  line-height: 100%;
  display: block;
  position: relative;
  padding: 0.25em 0.5em;
  background: pink;
  border: red solid 3px;
  -webkit-border-radius: 11px;
  -moz-border-radius: 11px;
  border-radius: 11px;
  margin-bottom: 2em;
  clear: both;
  max-width: 50%;
}
p {
  margin-bottom: 0;
  padding: 1em;
}

.bubble-left {
  float: left;
  margin-right: 10%;
}
.bubble-right {
  float: right;
  margin-left: 10%;
}

.bubble-left:after,
.bubble-left:before,
.bubble-right:after,
.bubble-right:before {
  content: '';
  position: absolute;
  top: 21px;
  border-style: solid;
  border-width: 13px 17px 13px 0;
  border-color: transparent pink;
  display: block;
  width: 0;
}

.bubble-left:after,
.bubble-left:before {
  border-width: 13px 17px 13px 0;
  border-color: transparent pink;
}

.bubble-right:after,
.bubble-right:before {
  border-width: 13px 0 13px 17px;
  border-color: transparent pink;
}

.bubble-left:after {
  left: -16px;
  border-color: transparent pink;
  z-index: 1;
}

.bubble-left:before {
  left: -19px;
  border-color: transparent red;
  z-index: 0;
}

.bubble-right:after {
  right: -16px;
  border-color: transparent pink;
  z-index: 1;
}

.bubble-right:before {
  right: -19px;
  border-color: transparent red;
  z-index: 0;
}
</style>
