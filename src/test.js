var map = null;
var tempGraphicLayer = null;
var esri ={};

esri.setMap = function(map){
    this.map = map;
};
esri.getMap = function(){
    return this.map;
};
esri.setTempGraphicLayer = function(lyr){
    this.tempGraphicLayer = lyr;
};
esri.getTempGraphicLayer = function(){
    return this.tempGraphicLayer;
};
export {esri};