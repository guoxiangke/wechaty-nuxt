<template>
  <div class="relative" :filter="filter">
    <input
      v-model="filters"
      type="Search"
      class="transition-colors duration-100 ease-in-out focus:outline-none border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-600 rounded-lg bg-gray-200 border-0 px-4 py-2  pl-12 my-2 w-full "
      placeholder="Search by name..."
    />
    <div class="absolute left-0 top-0 mt-5 ml-5 text-purple-lighter">
      <svg
        version="1.1"
        class="h-4 text-dark"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 52.966 52.966"
        style="enable-background:new 0 0 52.966 52.966;"
        xml:space="preserve"
      >
        <path
          d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
        c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
        C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
        S32.459,40,21.983,40z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      filters: ''
    }
  },
  computed: {
    filter() {
      this.$store.commit('search/SET', this.filters)
      return this.filters
    }
  },
  methods: {}
}
</script>
