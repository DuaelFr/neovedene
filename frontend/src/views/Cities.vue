<template>
  <div class="cities">
    <Autocomplete></Autocomplete>
    <h1>Search city</h1>
    <ul class="results wrapper">
      <li v-for="city in cities">
        <router-link :to="{ name: 'city', params: { insee: city.key } }">
          {{ city.value.name }} ({{ city.key.substr(0, 2) }})
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import Autocomplete from '@/components/Autocomplete.vue'

  export default {
    components: {Autocomplete},
    data() {
      return {
        cities: []
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'fetchData'
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const url = `http://back.neovedene.localhost:8000/cities?q=${encodeURI(this.$route.params.search)}&full=1`
        fetch(url)
          .then(response => response.json())
          .then(data => this.cities = data)
      }
    }
  }
</script>

<style>
  .results {
    text-align: left;
  }
</style>
