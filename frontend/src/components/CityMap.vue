<template>
  <div id="map"></div>
</template>

<style>
  @import '../../node_modules/ol/ol.css';
</style>

<script>
import {Feature, Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Style} from 'ol/style';

export default {
  props: [
    'center',
    'borders',
  ],
  watch: {
    center() {
      this.$forceUpdate();
    },
  },
  computed: {
    coords() {
      return fromLonLat([parseFloat(this.center.x), parseFloat(this.center.y)]);
    },
    bordersFeature() {
      if (!this.bordersFeatureElements) {
        this.bordersFeatureElements = new Feature({
          geometry: this.bordersGeometry,
        });
      }
      return this.bordersFeatureElements;
    },
    bordersGeometry() {
      return (new GeoJSON())
        .readGeometry(this.borders)
        .transform('EPSG:4326', 'EPSG:3857');
    },
  },
  mounted() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: this.coords,
        zoom: 12,
      }),
    });

    const borderLayer = new VectorLayer({
      source: new Vector({
        features: [
          this.bordersFeature,
        ],
      }),
      styles: [
        new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 3,
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
        }),
      ],
    });
    this.map.addLayer(borderLayer);
  },
  updated() {
    this.bordersFeature.setGeometry(this.bordersGeometry);
    this.bordersFeature.getGeometry().setCoordinates(this.bordersGeometry.getCoordinates());
    this.map.getView().setCenter(this.coords);
  },
};
</script>
