<template>
  <div id='mapDiv'>
    <div class='baseMapBtn'>
      <v-change-base-map></v-change-base-map>
    </div>
    <div class='search'>
      <v-search></v-search>
    </div>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader';
import { esri } from './test';
import vChangeBaseMap from './changeBaseMap.vue';
import vSearch from './search.vue';
import module from './jsonConverters';

import axios from 'axios';
export default {
  name: 'app', 
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      jsonConverters: module,
      esri: esri
    }
  },
  components: {
    vChangeBaseMap, vSearch
  },
  mounted() {
    var me = this;
    if (!esriLoader.isLoaded()) {

      esriLoader.bootstrap((err) => {
        if (err) {
          console.error(err);
        } else {

          createMap(me);
        }
      }, {

          url: 'https://js.arcgis.com/3.20/'
        });
    } else {

      createMap(me);
    }

    function createMap(self) {
      var me = self;
      esriLoader.dojoRequire(['esri/map', '../layerController.js'], (Map, LayerController) => {
        let esriMap = new Map('mapDiv', {
          center: [108, 34.5],
          zoom: 8,
          basemap: 'streets',
          logo: false
        });
        esri.setMap(esriMap);
        me;
        axios.get('../data.json').then(res => {
          console.log(res.data);
          let geoJson = res.data.result.data;
          let id = res.data.result.id;
          let layerController = new LayerController(esriMap, me.jsonConverters, geoJson[0], id);
          layerController.startUp();
        });
      });
    }
  }
}
</script>

<style>
@import url('https://js.arcgis.com/3.20/esri/css/esri.css');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#mapDiv {
  height: 100%;
  width: 100%;
  margin: 0 0 0 0;
}

.search {
  z-index: 1000;
  position: absolute;
  right: 150px;
  top: 15px;
}

.baseMapBtn {
  left: 20px;
  top: 90px;
  right: auto;
  bottom: auto;
  width: auto;
  height: auto;
  padding: 0px;
  z-index: auto;
  position: absolute;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.baseMapBtn:hover {
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
