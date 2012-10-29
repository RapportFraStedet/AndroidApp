// Start with the map page

$('#Kort').live('pageshow', function (event) {
    fixContentHeight();
    //alert("show");
    if (!window.map) {
        initMap();
        //Move();
    }
    
});

function fixContentHeight() {
    var page = $("#Kort");

    var header = page.children(":jqmData(role=header)");
    var footer = page.children(":jqmData(role=footer)");
    /*var footer = $("div[data-role='footer']:visible"),*/
    var content = page.children(":jqmData(role=content)");
    /*content = $("div[data-role='content']:visible:visible"),*/
	var	viewHeight = $(window).height();
	var	contentHeight = viewHeight - footer.outerHeight() - header.outerHeight();

	if ((content.outerHeight() + footer.outerHeight() + header.outerHeight()) !== viewHeight) {
	    contentHeight -= (content.outerHeight() - content.height());
	    content.height(contentHeight);
	    $("#map").css("height", contentHeight);
	    $("#navigation").css("top", header.outerHeight() + 10);


	    if (window.map) {
	        map.updateSize();
	        //Move();
	    } /*else {
	        // initialize map
	        initMap();
	    }*/
	}
}

function initLayerList() {
    $('#layerslist').html("<li data-role='divider' data-theme='a'>Baggrundskort</li>");
    //$('#layerspage').page();
    /*var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function () {
        addLayerToList(this);
    });

    $('#layerslist').listview('refresh');*/
}

function addLayerToList(layer) {
    var item = $('<li>', {
        "data-icon": "check",
        "class": layer.visibility ? "checked" : ""
    })
        .append($('<a />', {
            text: layer.name
        })
            .click(function () {
                $.mobile.changePage('#Kort');
                if (layer.isBaseLayer) {
                    //var ce = map.getExtent();
                    //ce.transform(map.getProjectionObject(), layer.projection);
                    //map.projection = layer.projection.getCode();
                    //map.maxExtent = layer.maxExtent;
                    map.setBaseLayer(layer);
                    //layer.redraw();
                    //map.zoomToExtent(layer.maxExtent);
                    //map.zoomToExtent(ce);
                } else {
                    layer.setVisibility(!layer.getVisibility());
                }
            })
        )
        .appendTo('#layerslist');
    layer.events.on({
        'visibilitychanged': function () {
            $(item).toggleClass('checked');
        }
    });
}
