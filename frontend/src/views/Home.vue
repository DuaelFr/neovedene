<template>
  <div class="home wrapper">
    <h1>Neo Vedene</h1>
    <p>Welcome on the Neo Vedene project. Please search for a city using the text field below.</p>
    <Autocomplete></Autocomplete>
  </div>
</template>

<script>
import Autocomplete from '@/components/Autocomplete.vue';

export default {
  components: { Autocomplete },
  metaInfo: {
    titleTemplate: null,
  },
};
</script>
