// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map, pointControl, pathControl, polygonControl, modifyControl, removeControl, navigationControl,redline,vector,crosshairs;
//var gg = new OpenLayers.Projection("EPSG:4326");
//var sm = new OpenLayers.Projection("EPSG:900913");
function Point(item) {
    $("#tegnPunkt").addClass('checked');
    $("#tegnLinie").removeClass('checked');
    $("#tegnPolygon").removeClass('checked');
    $("#tegnRediger").removeClass('checked');
    $("#tegnSlet").removeClass('checked');
    $("#tegnNaviger").removeClass('checked');
    pointControl.activate();
    pathControl.deactivate();
    polygonControl.deactivateurl
    modifyControl.deactivate();
    removeControl.deactivate();
    //navigationControl.deactivate();
}
function Path() {
    $("#tegnPunkt").removeClass('checked');
    $("#tegnLinie").addClass('checked');
    $("#tegnPolygon").removeClass('checked');
    $("#tegnRediger").removeClass('checked');
    $("#tegnSlet").removeClass('checked');
    $("#tegnNaviger").removeClass('checked');
    pointControl.deactivate();
    pathControl.activate();
    polygonControl.deactivate();
    modifyControl.deactivate();
    removeControl.deactivate();
    //navigationControl.deactivate();
}
function Polygon() {
    $("#tegnPunkt").removeClass('checked');
    $("#tegnLinie").removeClass('checked');
    $("#tegnPolygon").addClass('checked');
    $("#tegnRediger").removeClass('checked');
    $("#tegnSlet").removeClass('checked');
    $("#tegnNaviger").removeClass('checked');
    pointControl.deactivate();
    pathControl.deactivate();
    polygonControl.activate();
    modifyControl.deactivate();
    removeControl.deactivate();
    //navigationControl.deactivate();
}
function Modify() {
    $("#tegnPunkt").removeClass('checked');
    $("#tegnLinie").removeClass('checked');
    $("#tegnPolygon").removeClass('checked');
    $("#tegnRediger").addClass('checked');
    $("#tegnSlet").removeClass('checked');
    $("#tegnNaviger").removeClass('checked');
    pointControl.deactivate();
    pathControl.deactivate();
    polygonControl.deactivate();
    modifyControl.activate();
    removeControl.deactivate();
    //navigationControl.deactivate();
}
function Remove() {
    $("#tegnPunkt").removeClass('checked');
    $("#tegnLinie").removeClass('checked');
    $("#tegnPolygon").removeClass('checked');
    $("#tegnRediger").removeClass('checked');
    $("#tegnSlet").addClass('checked');
    $("#tegnNaviger").removeClass('checked');
    pointControl.deactivate();
    pathControl.deactivate();
    polygonControl.deactivate();
    modifyControl.deactivate();
    removeControl.activate();
    //navigationControl.deactivate();
}
function Navigate() {
    $("#tegnPunkt").removeClass('checked');
    $("#tegnLinie").removeClass('checked');
    $("#tegnPolygon").removeClass('checked');
    $("#tegnRediger").removeClass('checked');
    $("#tegnSlet").removeClass('checked');
    $("#tegnNaviger").addClass('checked');
    pointControl.deactivate();
    pathControl.deactivate();
    polygonControl.deactivate();
    modifyControl.deactivate();
    removeControl.deactivate();
    navigationControl.activate();
}
var style_crosshairs = {
    strokeColor: "#000000",
    strokeOpacity: 0.5,
    strokeWidth: 5,
    strokeLinecap: "square"
};
var style_crosshairs2 = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.5,
    strokeWidth: 3
};
var style_circle = {
    strokeColor: "#000000",
    strokeOpacity: 0.5,
    strokeWidth: 5,
    fill: false
};

function Move() {
    crosshairs.removeAllFeatures();
    var extent = map.getExtent();
    var p1 = new OpenLayers.Geometry.Point(extent.left+(extent.right-extent.left)/2, extent.top);
    var p2 = new OpenLayers.Geometry.Point(extent.right,extent.bottom+(extent.top-extent.bottom)/2);
    var p3 = new OpenLayers.Geometry.Point(extent.left+(extent.right-extent.left)/2, extent.bottom);
    var p4 = new OpenLayers.Geometry.Point(extent.left,extent.bottom+(extent.top-extent.bottom)/2);
    var line1 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p3, p1]), null, style_crosshairs2);
    var line2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p4, p2]), null, style_crosshairs2);
    
    /*var radius1 = 0.9 * (extent.right - extent.left) / 2;
    var radius2 = 0.9 * (extent.top - extent.bottom) / 2;
    if (radius1 < radius2) {
        radius2 = radius1;
    }
    var x = extent.left + (extent.right - extent.left) / 2;
    var y = extent.bottom + (extent.top - extent.bottom) / 2;
    var p1 = new OpenLayers.Geometry.Point(x, y+radius2);
    var p11 = new OpenLayers.Geometry.Point(x, y+radius2*0.8);
    var p2 = new OpenLayers.Geometry.Point(x+radius2,y);
    var p22 = new OpenLayers.Geometry.Point(x+radius2*0.8,y);
    var p3 = new OpenLayers.Geometry.Point(x, y-radius2);
    var p33 = new OpenLayers.Geometry.Point(x, y-radius2*0.8);
    var p4 = new OpenLayers.Geometry.Point(x-radius2,y);
    var p44 = new OpenLayers.Geometry.Point(x-radius2*0.8,y);
    var line1 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p1, p11]), null, style_crosshairs);
    var line2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p2, p22]), null, style_crosshairs);
    var line3 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p3, p33]), null, style_crosshairs);
    var line4 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p4, p44]), null, style_crosshairs);
    var line5 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p44, p22]), null, style_crosshairs2);
    var line6 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([p11, p33]), null, style_crosshairs2);
    var circle = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.Polygon.createRegularPolygon(
            new OpenLayers.Geometry.Point(x, y),
            radius2,
            50,
            0
        ),
        {},
        style_circle
    )
    crosshairs.addFeatures([line1, line2, line3, line4, line5, line6, circle]);*/
    crosshairs.addFeatures([line1, line2]);
}
function initMap() {
    var colorDefault = "#ff6600";
    var colorSelect = "#ff9900";
    var colorTemporary = "#ff3300";
    crosshairs = new OpenLayers.Layer.Vector("Crosshairs Layer", {});
    //crosshairs.isFixed = true;
    vector = new OpenLayers.Layer.Vector("Vector Layer", {});
    redline = new OpenLayers.Layer.Vector('Redline Layer', {
        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [
                    new OpenLayers.Rule({
                        symbolizer: {
                            "Point": {
                                pointRadius: 20,
                                graphicName: "circle",
                                fillColor: "white",
                                fillOpacity: 0.25,
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                strokeColor: colorDefault
                            },
                            "Line": {
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                strokeColor: colorDefault
                            },
                            "Polygon": {
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                fillColor: colorDefault,
                                strokeColor: colorDefault
                            }
                        }
                    })
                ]
            }),
            "select": new OpenLayers.Style(null, {
                rules: [
                    new OpenLayers.Rule({
                        symbolizer: {
                            "Point": {
                                pointRadius: 20,
                                graphicName: "circle",
                                fillColor: "white",
                                fillOpacity: 0.25,
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                strokeColor: colorSelect
                            },
                            "Line": {
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                strokeColor: colorSelect
                            },
                            "Polygon": {
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                fillColor: colorSelect,
                                strokeColor: colorSelect
                            }
                        }
                    })
                ]
            }),
            "temporary": new OpenLayers.Style(null, {
                rules: [
                    new OpenLayers.Rule({
                        symbolizer: {
                            "Point": {
                                graphicName: "circle",
                                pointRadius: 20,
                                fillColor: "white",
                                fillOpacity: 0.25,
                                strokeWidth: 3,
                                strokeColor: colorTemporary
                            },
                            "Line": {
                                pointRadius: 20,
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                strokeColor: colorTemporary
                            },
                            "Polygon": {
                                strokeWidth: 3,
                                strokeOpacity: 1,
                                strokeColor: colorTemporary,
                                fillColor: colorTemporary
                            }
                        }
                    })
                ]
            })
        })
    });
    
    var snap = new OpenLayers.Control.Snapping({
        layer: redline
    });
    snap.activate();
    removeControl = new OpenLayers.Control.SelectFeature(redline, {
        onSelect: function (feature) {
            redline.removeFeatures([feature]);
        }
    });
    modifyControl = new OpenLayers.Control.ModifyFeature(redline);
    pointControl = new OpenLayers.Control.DrawFeature(redline, OpenLayers.Handler.Point);
    pathControl = new OpenLayers.Control.DrawFeature(redline, OpenLayers.Handler.Path);
    polygonControl = new OpenLayers.Control.DrawFeature(redline, OpenLayers.Handler.Polygon);
    //navigationControl = new OpenLayers.Control.Navigation();
    navigationControl = new OpenLayers.Control.TouchNavigation({
        dragPanOptions: {
            enableKinetic: true
        }
    });
    
    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 7000
        }
    });
    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };
    geolocate.events.register("locationupdated", this, function (e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                style
            )
        ]);
        map.zoomToExtent(vector.getDataExtent());

    });
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        //projection: new OpenLayers.Projection("EPSG:900913"),
        //units: "m",
        //numZoomLevels: 18,
        /*maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(
        -20037508.34, -20037508.34, 20037508.34, 20037508.34
        ),*/
        controls: [
        //new OpenLayers.Control.Attribution(),
            snap,
            geolocate,
			pointControl,
            pathControl,
            polygonControl,
            modifyControl,
            navigationControl,
            removeControl
        ],
        layers: [redline, vector, crosshairs],
        eventListeners: {
            "move": Move
        }

    });
    $("#plus").click(function () {
        map.zoomIn();
    });
    $("#minus").click(function () {
        map.zoomOut();
    });
    $("#locate").click(function () {
        var control = map.getControlsBy("id", "locate-control")[0];
        if (control.active) {
            control.getCurrentLocation();
        } else {
            control.activate();
        }
    });
    $(window).bind("resize orientationchange", function (e) {
        fixContentHeight();
    });
    //$('#layerspage').page();
    createMap();
}
function createMap() {
    if (map && Rfs.rapport!=null && Rfs.rapport.MapSet) {
        $('#layerslist').html("<li data-role='divider' data-theme='a'>Baggrundskort</li>");
        var n = map.layers.length;
        for (i=0;i<n;i++) {
            map.removeLayer(map.layers[0], false);
        }
        var rapport = Rfs.rapport;
        map.addLayer(redline);
        map.addLayer(vector);
        map.addLayer(crosshairs);
        var zoom = false;
        var layer;
        for (mapGroupItem in rapport.MapSet.MapGroup) {
            for (mapItem in rapport.MapSet.MapGroup[mapGroupItem].Map) {
                var m = rapport.MapSet.MapGroup[mapGroupItem].Map[mapItem];
                switch (m.Type[0]) {
                    case "WMTS":
                        var name = m.Extension[0].Options[0].name[0];
                        layer =  new OpenLayers.Layer.WMTS({
                            name: name,
                            url: m.Extension[0].Options[0].url[0],
                            layer: m.Extension[0].Options[0].layer[0],
                            matrixSet: m.Extension[0].Options[0].matrixSet[0],
                            format: m.Extension[0].Options[0].format[0],
                            style: m.Extension[0].Options[0].style[0],
                            opacity: 0.7,
                            isBaseLayer: false
                        });
                        break;
                    case "MapGuide":
                        mapguide(m);
                        break;
                    case "OpenStreetMap":
                        layer = new OpenLayers.Layer.OSM(m.Extension[0].Options[0].name[0]);
                        map.addLayer(layer);
                        addLayerToList(layer);
                        zoom = true;
                        break;
                    case "Google":
                        var name = m.Extension[0].Options[0].name[0];
                        switch (m.Extension[0].Options[0].type[0]) {
                            case "G_PHYSICAL_MAP":   
                            case "TERRAIN":
                                layer = new OpenLayers.Layer.Google(name, {
                                    type: google.maps.MapTypeId.TERRAIN//,
                                    //numZoomLevels: 22
                                });
                                map.addLayer(layer);
                                addLayerToList(layer);
                                zoom = true;
                                //map.zoomToMaxExtent();
                                break;
                            case "G_HYBRID_MAP":   
                            case "HYBRID":
                                layer = new OpenLayers.Layer.Google(name, {
                                    type: google.maps.MapTypeId.HYBRID//,
                                    //numZoomLevels: 22
                                });
                                map.addLayer(layer);
                                addLayerToList(layer);
                                zoom = true;
                                //map.zoomToMaxExtent();
                                break;
                            case "G_SATELLITE_MAP":   
                            case "SATELLITE":
                                layer = new OpenLayers.Layer.Google(name, {
                                    type: google.maps.MapTypeId.SATELLITE//,
                                    //numZoomLevels: 22
                                });
                                map.addLayer(layer);
                                addLayerToList(layer);
                                zoom = true;
                                //map.zoomToMaxExtent();
                                break;
                            case "G_NORMAL_MAP":   
                            case "ROADMAP":
                                layer = new OpenLayers.Layer.Google(name, {
                                    type: google.maps.MapTypeId.ROADMAP//,
                                    //numZoomLevels: 22
                                });
                                map.addLayer(layer);
                                addLayerToList(layer);
                                zoom = true;
                                //map.zoomToMaxExtent();
                                break;
                        }
                        break;
                    case "VirtualEarth":
                        var name = m.Extension[0].Options[0].name[0];
                        switch (m.Extension[0].Options[0].type[0]) {
                            case "Road":
                                layer = new OpenLayers.Layer.Bing({
                                    key: apiKey,
                                    type: "Road",
                                    // custom metadata parameter to request the new map style - only useful
                                    // before May 1st, 2011
                                    metadataParams: {
                                        mapVersion: "v1"
                                    },
                                    name: name
                                    //transitionEffect: 'resize',
                                    //numZoomLevels: 22
                                });
                                map.addLayer(layer);
                                addLayerToList(layer);
                                zoom = true;
                                break;
                            case "Aerial":
                                layer = new OpenLayers.Layer.Bing({
                                    key: apiKey,
                                    type: "Aerial",
                                    name: name
                                    //transitionEffect: 'resize',
                                    //numZoomLevels: 22
                                });
                                map.addLayer(layer);
                                addLayerToList(layer);
                                zoom = true;
                                break;
                            case "Hybrid":
                                layer = new OpenLayers.Layer.Bing({
                                    key: apiKey,
                                    type: "AerialWithLabels",
                                    name: name
                                    //transitionEffect: 'resize',
                                    //numZoomLevels: 22
                                });
                                map.addLayer(layer);
                                addLayerToList(layer);
                                zoom = true;
                                break;
                        }
                        break;
                }
            }
        }
        if (zoom) {
            $('#layerslist').listview('refresh');
            map.zoomToMaxExtent();
        }
        var control = map.getControlsBy("id", "locate-control")[0];
        if (control.active) {
            control.getCurrentLocation();
        } else {
            control.activate();
        }
    }
}

function mapguide(m) {
    var rapport = Rfs.rapport;
    var url = rapport.MapAgent.toLowerCase().replace("mapagent/mapagent.fcgi", "fusion") + "/layers/mapguide/php/";
    $.ajax({
        url: url + "createsession.php",
        data: { username: "Anonymous" },
        dataType: 'jsonp',
        success: function (data) {
            $.ajax({
                url: url + "loadmap.php",
                type: "POST",
                data: { mapid: m.Extension[0].ResourceId[0], session: data.sessionId },
                dataType: 'jsonp',
                success: function (data) {
                    var inPerUnit = OpenLayers.INCHES_PER_UNIT.m * data.metersPerUnit;
                    OpenLayers.INCHES_PER_UNIT["dd"] = inPerUnit;
                    OpenLayers.INCHES_PER_UNIT["degrees"] = inPerUnit;
                    OpenLayers.DOTS_PER_INCH = 96;
                    var isBaseLayer = true;
                    if (m.Extension[0].Options && m.Extension[0].Options[0].isBaseLayer && m.Extension[0].Options[0].isBaseLayer[0] == "false") {
                        isBaseLayer = false;
                    }
                    var useOverlay = false;
                    if (m.Extension[0].Options && m.Extension[0].Options[0].useOverlay && m.Extension[0].Options[0].useOverlay[0] == "true") {
                        useOverlay = true;
                    }
                    var singleTile = true;
                    if (m.SingleTile && m.SingleTile[0] == "False") {
                        singleTile = false;
                    }
                    var useHttpTile = false;
                    if (m.Extension[0].Options && m.Extension[0].Options[0].useHttpTile && m.Extension[0].Options[0].useHttpTile[0] == "true") {
                        useHttpTile = true;
                    }
                    var options = {
                        isBaseLayer: isBaseLayer,
                        useOverlay: useOverlay,
                        useAsyncOverlay: true,
                        singleTile: singleTile,
                        useHttpTile: useHttpTile,
                        maxExtent: new OpenLayers.Bounds.fromArray(data.extent)
                    };
                    var layer;
                    //HttpTiled
                    if (useHttpTile) {
                        var params = {
                            basemaplayergroupname: data.groups[0].groupName
                        };
                        options["scales"] = data.FiniteDisplayScales;
                        layer = new OpenLayers.Layer.MapGuide(data.mapTitle, m.Extension[0].Options[0].tileCacheUrl[0].split(","), params, options);
                    }
                    //Untiled
                    else if (singleTile) {
                        map.projection = "EPSG:" + data.epsg;
                        var params = {
                            mapname: data.mapName,
                            session: data.sessionId,
                            behavior: 2
                        };
                        options["maxResolution"] = "auto";
                        layer = new OpenLayers.Layer.MapGuide(data.mapTitle, rapport.MapAgent, params, options);
                    }
                    //Tiled
                    else {
                        var params = {
                            mapdefinition: data.mapId,
                            session: data.sessionId,
                            basemaplayergroupname: data.groups[0].groupName
                        };
                        options["scales"] = data.FiniteDisplayScales;
                        layer = new OpenLayers.Layer.MapGuide(data.mapTitle, rapport.MapAgent, params, options);
                    }
                    map.addLayer(layer);
                    $("#map").css("background-color", data.backgroundColor);
                    map.zoomToExtent(layer.maxExtent);
                    var control = map.getControlsBy("id", "locate-control")[0];
                    if (control.active) {
                        control.getCurrentLocation();
                    } else {
                        control.activate();
                    }

                    if (useOverlay) {
                        map.removeLayer(redline, false);
                        map.removeLayer(vector, false);
                        map.removeLayer(crosshairs, false);
                        map.addLayer(redline);
                        map.addLayer(vector);
                        map.addLayer(crosshairs);
                    }
                    else {
                        addLayerToList(layer);
                        $('#layerslist').listview('refresh');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

