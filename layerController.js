define([
    'dojo/_base/declare',
    "esri/graphic",
    "esri/layers/FeatureLayer",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/InfoTemplate"
], function (declare, Graphic, FeatureLayer, Point, Polygon, Polyline,InfoTemplate) {
    'use strict';
    var clazz = declare(null, {
        constructor: function (map, jsonConverter, geoJsonObj, id) {
            this.map = map;
            this.jsonConverter = jsonConverter;
            this.geoJsonObj = geoJsonObj;
            this.id = id;
        },
        startUp: function () {
            var jsonconverter = new this.jsonConverter.geoJsonConverter();
            var esriFeats = jsonconverter.toEsri(this.geoJsonObj);
            var graphics = [];
            var type = null;
            var allField = null;
            if (!!this.objID === false) {
                this.objID = "OBJID_INDEX";
            }
            this.objID = this.objID.toLocaleUpperCase();


            for (var i = 0, len = esriFeats.features.length; i < len; i++) {
                var feat = esriFeats.features[i];
                delete esriFeats.features[i].attributes['X'];
                delete esriFeats.features[i].attributes['Y'];
                var esriType = feat.geometry.type;
                var graphic = this._getShape(esriType, feat);
                type = graphic.geometry.type;
                //graphic.setSymbol(flRenderer.symbol);
                graphics.push(graphic);
                allField = this._getFieldUnion(esriFeats.features[i].attributes, allField);
            }
            var attributesArr = this._getAttributesField(allField, this.objID);
            var esriType = esriFeats.features[0].geometry.type;
            var featureCollection = this._gerFeatureCollection(esriType, attributesArr, graphics, this.id);
            var popupTemplate = new InfoTemplate('${CXH}');
            this.featureLayer = new FeatureLayer(featureCollection, { 'id': this.id ,infoTemplate: popupTemplate});
            this.map.addLayer(this.featureLayer);

        },
        _gerFeatureCollection: function (type, attrArr, graphics, id) {
            var layerDefinition = {
                "geometryType": type,
                "fields": attrArr,
                "id": id
            };

            var features = [];
            for (var i = 0, len = graphics.length; i < len; i++) {
                features.push(graphics[i].toJson());
            }

            var featureSet = {
                "geometryType": type,
                "spatialReference": { wkid: 4326 },
                "fields": attrArr,
                "features": graphics
            };

            var featureCollection = {
                layerDefinition: layerDefinition,
                featureSet: featureSet
            };

            return featureCollection;
        },


        _getFieldUnion: function (x, y) {
            var context = {};
            for (var attr in x) {
                if (x.hasOwnProperty(attr) && typeof x[attr] != "function") {
                    context[attr] = x[attr];
                }
            }
            if (y !== null) {
                for (var attr in y) {
                    if (y.hasOwnProperty(attr) && typeof y[attr] != "function") {
                        context[attr] = y[attr];
                    }
                }
            }

            return context;
        },
        _getAttributesField: function (attributes, objectid) {
            var attributesFieldArr = [];
            for (var attr in attributes) {
                if (attributes.hasOwnProperty(attr) && typeof attributes[attr] != "function") {
                    var attrFile = {};
                    attrFile.name = attr.toString();
                    attrFile.alias = attr.toString();
                    if (attr.toString().toLocaleUpperCase() === objectid) {
                        attrFile.type = "esriFieldTypeOID";
                    } else {
                        attrFile.type = "esriFieldTypeString";
                    }
                    attributesFieldArr.push(attrFile);
                }
            }
            return attributesFieldArr;
        },

        _getShape: function (type, features) {
            var graphic = null;
            switch (type) {
                case "esriGeometryPoint":
                    graphic = new Graphic({
                        attributes: features.attributes,
                        geometry: new Point({
                            x: features.geometry.x,
                            y: features.geometry.y,
                            'type': 'point',
                            spatialReference: { wkid: 4326 }
                        })
                    });
                    break;

                case "esriGeometryPolyline":
                    graphic = new Graphic({
                        attributes: features.attributes,
                        geometry: new Polyline({
                            paths: features.geometry.paths,
                            'type': 'polyline',
                            spatialReference: { wkid: 4326 }
                        })
                    });
                    break;

                case "esriGeometryPolygon":
                    graphic = new Graphic({
                        attributes: features.attributes,
                        geometry: new Polygon({
                            rings: features.geometry.rings,
                            'type': 'polygon',
                            spatialReference: { wkid: 4326 }
                        })
                    });
                    break;
            }
            return graphic;
        }


    });
    return clazz;
});