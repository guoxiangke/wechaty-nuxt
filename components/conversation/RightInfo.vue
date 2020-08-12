<template>
  <div class="main">
    <div class="title"><p class="text-xl">more-info</p></div>
    <p v-if="logged">客服机器人🤖️已登录 green/red</p>
  </div>
</template>

<script>
export default {
  name: 'RightInfo',
  props: {
    logged: Boolean
  }
}
</script>
