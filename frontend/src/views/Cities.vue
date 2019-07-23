<template>
  <div class="cities">
    <Autocomplete></Autocomplete>
    <h1>Search city</h1>
    <ul class="results wrapper" v-if="loaded">
      <li v-for="city in cities">
        <router-link :to="{ name: 'city', params: { insee: city.key } }">
          {{ city.value.name }} ({{ city.key.substr(0, 2) }})
        </router-link>
      </li>
    </ul>
    <p class="wrapper" v-else>Loading...</p>
  </div>
</template>

<script>
  import Autocomplete from '@/components/Autocomplete.vue'

  export default {
    components: {Autocomplete},
    data() {
      return {
        loaded: false,
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
          .then(data => {
            this.cities = data
            this.loaded = true
          })
      }
    },
    metaInfo() {
      return {
        title: this.loaded ? this.cities.length + ' results for "' + this.$route.params.search + '"' : 'Loading...',
      };
    }
  }
</script>

<style>
  .results {
    text-align: left;
  }
</style>
