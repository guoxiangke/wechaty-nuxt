<template>
  <div class="warpper">
    <div v-for="contact in contacts" :key="contact.id">
      <ContactItem :contact="contact" />
    </div>
  </div>
</template>

<script>
import ContactItem from './ContactItem'

export default {
  name: 'ContactsList',
  components: { ContactItem },
  computed: {
    contacts() {
      const latestMsgs = this.$store.state.messages.list
      const allContactsObj = this.$store.state.contacts.list
      // orderBy contact.weight
      // 确保有值后再计算
      // console.log(Object.keys(allContactsObj).length, 'allContactsObj')
      const contactsArray = []

      Object.values(allContactsObj).forEach((contact) => {
        contactsArray.push(contact)
      })
      // 过滤掉，不显示群成员
      // from !== Type.RoomMemeber 2
      const filteredArray = contactsArray.filter((contact) => {
        return contact.from !== 2
      })

      const self = this
      if (Object.keys(allContactsObj).length && latestMsgs.length) {
        // 过滤掉群消息 || 机器人主动发送的信息
        // todo 24 会变 / 机器人永远置顶，weight = 9999
        const filterMsgs = latestMsgs.filter(
          (item) => !item.to.includes('@chatroom') && item.fromId !== 24
        )
        // 需要清零weight，不然是累加了
        filterMsgs.forEach((msg) => {
          if (allContactsObj[msg.fromId]) {
            this.$store.commit('contacts/RESET_WEIGHT', msg.fromId)
          }
        })
        // change weight by messages!
        filterMsgs.forEach((msg) => {
          if (allContactsObj[msg.fromId]) {
            this.$store.commit('contacts/INCREASE_WEIGHT', msg.fromId)
          }
        })
        filteredArray.sort((a, b) => (a.weight > b.weight ? -1 : 1))

        return filteredArray.filter(function(contact) {
          if (contact.alias) {
            return (
              contact.alias.includes(self.filters) ||
              contact.name.includes(self.filters)
            )
          }
          return contact.name.includes(self.filters)
        })
      }
      // allContacts 转化成数组，再排序

      return filteredArray // 默认初始化的数据
    },
    filters() {
      return this.$store.state.search.keyword
    }
  },
  created() {
    this.$store.dispatch('contacts/init')
  },
  methods: {
    filterObject(obj, condition) {
      const filteredObj = {}
      Object.keys(obj).map((key) => {
        if (condition(key)) {
          filteredObj[key] = obj[key]
        }
      })
      return filteredObj
    }
  }
}
</script>
