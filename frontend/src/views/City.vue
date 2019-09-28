<template>
  <div class="city">
    <Autocomplete></Autocomplete>
    <h1>{{ city.name }} ({{ city.inseeCode.substr(0, 2) }})</h1>
    <div class="city__body" v-if="loaded">
      <dl class="city__meta">
        <dt>Surface</dt>
        <dd>{{ city.surface }} ha</dd>
        <dt>Population</dt>
        <dd>{{ city.population.total }} ha</dd>
        <dt>Densité</dt>
        <dd>{{ city.density }} hab/km²</dd>
        <dt>Wikipedia</dt>
        <dd>
          <a :href="wikipediaUrl">
            {{ city.wikipedia }}
          </a>
        </dd>
      </dl>
      <div class="city__map">
        <CityMap
          v-bind:center="city.coordinates"
          v-bind:borders="city.borders"
          v-bind:average_ranking="averageRanking"
          v-bind:first_ranking="firstRanking"
        ></CityMap>
      </div>
      <pre style="text-align: left">{{ city }}</pre>
    </div>
  </div>
</template>

<style lang="scss">
  dl {
    text-align: left;

    dt {
      font-weight: bold;
    }
  }
</style>

<script>
import Autocomplete from '@/components/Autocomplete.vue';
import CityMap from '@/components/CityMap.vue';

export default {
  components: { Autocomplete, CityMap },
  data() {
    return {
      loaded: false,
      city: {
        name: 'Loading...',
        inseeCode: '00000',
      },
    };
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  created() {
    this.fetchData();
  },
  computed: {
    wikipediaUrl() {
      const parts = this.city.wikipedia.split(':');
      return `https://${parts[0]}.wikipedia.org/wiki/${parts[1]}`;
    },
    averageRanking() {
      return this.city.politics.europe_2019.average_ranking;
    },
    firstRanking() {
      return this.city.politics.europe_2019.first_ranking;
    },
  },
  methods: {
    fetchData() {
      const url = `http://back.neovedene.localhost:8000/city/${encodeURI(this.$route.params.insee)}`;
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          this.loaded = true;
          this.city = data;
          this.city.density = Math.ceil(data.population.total / (data.surface * 0.01));
        });
    },
  },
  metaInfo() {
    return {
      title: `${this.city.name} (${this.city.inseeCode.substr(0, 2)})`,
    };
  },
};
</script>
