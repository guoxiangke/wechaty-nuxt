<template id="product-list">
  <section>
    <div v-for="friend in filteredProducts" :data-toid="friend.wechatId">
      <img
        :src="friend.avatar"
        alt=""
        :alt="friend.name"
        :title="friend.name"
        class="rounded-lg h-16 w-16"
      />
    </div>
  </section>
</template>

<script>
export default {
  async asyncData(context) {
    // Get first page! https://blog.csdn.net/Tomwildboar/article/details/95928616
    const uri = '/friend/1' // + context.page
    const res = await context.$axios.get(uri)
    console.log('asyncData', `get ${res.length} data, ${uri}`)
    return { lists: res }
  },
  data() {
    return { lists: [], filters: '' }
  },
  computed: {
    filteredProducts() {
      const self = this

      // console.log(self.lists.length, self.filters)
      if (!self.filters) {
        return self.lists
      }
      return self.lists.filter(function(friend) {
        return friend.name.includes(self.filters)
      })
    },
    page() {
      return this.$route.query.page
    }
  },
  async created() {
    // await this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await this.$axios.$get('/friend/1', {
        params: this.filters
      })
      console.log(this.lists.length)
      this.loading = false
      this.lists = res
      this.pagination.total = this.lists.length
    },
    async sendMsg(data) {
      const res = await this.$axios.$post('/friend/1/say', data)
      if (res) {
        // this.$notification.success({
        //   message: '操作提示',
        //   description: '消息发送成功'
        // })
        // this.$refs.modalDom.isShow(false)
      }
    }
  }
}
</script>

<style>
.logo {
  width: 50px;
  float: left;
  margin-right: 15px;
}

.form-group {
  max-width: 500px;
}

.actions {
  padding: 10px 0;
}

.glyphicon-euro {
  font-size: 12px;
}
</style>
