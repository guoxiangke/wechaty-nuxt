<template>
  <div class="main">
    <div class="title"><p class="text-xl">more-info</p></div>
    <div v-for="room in rooms" :key="room.id" :data-toid="room.room_id">
      <div
        class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="sm:flex sm:items-center px-6 py-4">
          <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <p class="text-base leading-tight">{{ room.topic }}</p>
            <p class="text-xs leading-tight text-gray-600">
              {{ room.announce }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightInfo',
  props: {
    rooms: Array
  }
}
</script>
