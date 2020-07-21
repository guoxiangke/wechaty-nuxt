<template>
  <div class="warpper">
    <div
      v-for="contact in contacts"
      :key="contact.id"
      :data-toid="contact.wechatId"
    >
      <div
        class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div
          class="sm:flex sm:items-center px-6 py-4"
          data-type="contact"
          :data-index="contact.id"
          @click="select"
        >
          <img
            class="block mx-auto sm:mx-0 sm:flex-shrink-0 h-16 sm:h-12 rounded-full"
            :src="contact.avatar"
            :alt="contact.name"
          />
          <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <p class="text-base leading-tight">{{ contact.name }}</p>
            <p class="text-sm leading-tight text-gray-600">
              {{ contact.alias }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListContacts',
  props: {
    contacts: Array
  },
  methods: {
    select() {
      alert('todo')
    }
  }
}
</script>
