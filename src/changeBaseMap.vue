<template>
    <div class='baseMapImg'
         @click='handleClick'>
    </div>
</template>

<script>
import { esri } from './test';
export default {
    name: 'cahngeBaseMap',
    data() {
        return {}
    },
    methods: {
        handleClick() {
            let map = esri.getMap();
            if (map.getBasemap() === 'streets') {
                map.setBasemap('satellite');
            }else{
                map.setBasemap('streets');
            }
            let lyr = map.getLayer('100001');
            let visible = lyr.visible;
            lyr.setVisibility(!visible);

        }
    }
}
</script>

<style>
.baseMapImg {
    width: 30px;
    height: 30px;
    background: url(http://quickwide.com:3002/pgis-2dviewer/widgets/pgis/Qw_SwitchingMap/css/images/icon-image.png) center no-repeat;
    background-size: 20px 20px;
}
</style>