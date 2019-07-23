<template>
  <div class="city">
    <Autocomplete></Autocomplete>
    <h1>{{ city.name }} ({{ city.inseeCode.substr(0, 2) }})</h1>
    <pre style="text-align: left">{{ city }}</pre>
  </div>
</template>

<script>
  import Autocomplete from '@/components/Autocomplete.vue'

  export default {
    components: {Autocomplete},
    data() {
      return {
        city: {
          name: "Loading..."
        }
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
        const url = `http://back.neovedene.localhost:8000/city/${encodeURI(this.$route.params.insee)}`
        fetch(url)
          .then(response => response.json())
          .then(data => this.city = data)
      }
    }
  }
</script>
