<template>
  <autocomplete
    :search="search"
    placeholder="Search for a city"
    aria-label="Search for a city"
    :get-result-value="getResultValue"
    @submit="handleSubmit"
  ></autocomplete>
</template>

<script>
  import Autocomplete from '@trevoreyre/autocomplete-vue'
  import '@trevoreyre/autocomplete-vue/dist/style.css'

  let lastInput

  function isInsee(code) {
    return (new RegExp('^[0-9][0-9a-z][0-9]{3}$', 'i')).test(code)
  }

  export default {
    components: {Autocomplete},
    methods: {
      search(input) {
        lastInput = input
        const url = `http://back.neovedene.localhost:8000/cities?q=${encodeURI(input)}`
        return fetch(url)
          .then(response => response.json())
      },
      getResultValue(result) {
        return result.value
      },
      handleSubmit(result) {
        if (result && isInsee(result.key)) {
          // Todo search results list
          console.log(result.key)
        }
        else {
          // Todo search results list
          console.log(lastInput)
        }
      }
    }
  }
</script>
