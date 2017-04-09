<template>
    <div class="form-group pull-right">
        <el-input v-model="tbsearch"
                  type="text"
                  placeholder="Type to search.."
                  class="form-control tbsearch" />
        <el-button type="primary"
                   @click="onSearch()"
                   class='tbsearchBTN'>查询</el-button>
    </div>
</template>

<script>
import * as esriLoader from 'esri-loader';
import { esri } from './test';
export default {
    data() {
        return {
            tbsearch: ''
        }
    },
    methods: {
        onSearch() {
            var me = this;
            me.tbsearch = me.tbsearch.trim();
            if (!me.tbsearch) {
                return;
            }
            esriLoader.dojoRequire(['esri/geometry/Point'], function (Point) {
                // let tempGraphiclayer = esri.getTempGraphicLayer();
                // if(!tempGraphiclayer){
                //     tempGraphiclayer = new GraphicsLayer();
                //     esri.setTempGraphicLayer(tempGraphiclayer);
                // }
                let map = esri.getMap();
                let XYArr = me.tbsearch.split(',');
                if (XYArr.length === 2) {
                    let pJson = { "x": XYArr[0], "y": XYArr[1], "spatialReference": { "wkid": 4326 } }
                    let mapPoint = new Point(pJson);
                    map.centerAt(mapPoint);
                } else {
                    let value = me.tbsearch;
                    let lyr = map.getLayer('100001');
                    let graphics = lyr.graphics;
                    for (let i = 0, len = graphics.length; i < len; i++) {
                        let attrs = graphics[i].attributes;
                        for (let a in attrs) {
                            if (attrs[a] === value) {
                                let extent = graphics[i].geometry.getExtent();
                                map.setExtent(extent);
                                return;
                            }
                        }
                    }
                }

            })

        }
    }
}
</script>

<style>
.tbsearch {
    display: inline-block;
}

.tbsearchBTN {
    display: inline-block;
    position: absolute;
    top: 0px;
    right: -60px;
}
</style>