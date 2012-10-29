var kommuneNr = null;
$('#SearchPage1').live('pageinit', function (event) {
    oiorest.init();
    $("#search1").bind("keyup change", function (event) {
        var text = $(this).val();
        oiorest.search(text);
    });
});
$('#SearchPage1').live('pageshow', function (event) {
    

});
$('#OioVej').live('pageinit', function (event) {
});

var oiorest = {
    kommuneNr: null,
    kommuner: null,
    vejNr: null,
    ajax: new Array(),
    items: null,
    activeSearch: null,
    search: function (text) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].text1 != text) {
                this.items[i].text1 = text;
                this.items[i].search1();
            }
        }
    },
    init: function () {
        var page = $("OioKommune");
        $("#listKommune").html("");
        $("#searchOptions>.ui-controlgroup-controls").html("");
        this.items = new Array();
        var search1 = new Search(1, "OIOREST", true);
        search1.placeholder1 = "Søg kommune...";
        search1.url1 = "http://geo.oiorest.dk/kommuner.json?q=[text]";
        search1.id1 = "nr";
        search1.name1 = "[navn]";
        search1.chars1 = 2;
        search1.title1 = "Kommune";
        search1.placeholder2 = "Søg vej...";
        search1.url2 = "http://geo.oiorest.dk/vejnavne.json?kommunekode=[selection1]&vejnavn=[text]";
        search1.id2 = "kode";
        search1.name2 = "[navn] ([postnummer.nr])";
        search1.chars2 = 2;
        search1.title2 = "Vej";
        search1.placeholder3 = "Søg husnr...";
        search1.url3 = "http://geo.oiorest.dk/adresser.json?kommunekode=[selection1]&vejkode=[selection2]&husnr=[text]*";
        search1.id3 = "id";
        search1.name3 = "[husnr]";
        search1.chars3 = 0;
        search1.title3 = "Husnr.";
        search1.url = "http://geo.oiorest.dk/adresser/[selection3].json",
        search1.x1 = "wgs84koordinat.længde";
        search1.y1 = "wgs84koordinat.bredde";
        search1.projection = "EPSG:4326";
        this.items.push(search1);

        var search2 = new Search(2, "Matrikel", false);
        search2.placeholder1 = "Søg ejerlav...";
        search2.url1 = "http://rtv04/rapportfrastedet/api/ejerlav?name=[text]";
        search2.id1 = "cadastralDistrictIdentifierField";
        search2.name1 = "[cadastralDistrictNameField]";
        search2.chars1 = 3;
        search2.title1 = "Ejerlav";

        search2.placeholder2 = "Søg matrikel...";
        search2.url2 = "http://rtv04/rapportfrastedet/api/matrikler?id=[selection1]&name=[text]";
        search2.id2 = "cadastralDistrictIdentifierField";
        search2.name2 = "[landParcelIdentifierField]";
        search2.chars2 = 1;
        search2.title2 = "Matrikel";

        search2.url = "http://rtv04/rapportfrastedet/api/matrikel?id=[selection1]&name=[text]";
        search2.x1 = "point1Field.xField";
        search2.y1 = "point1Field.yField";
        search2.x2 = "point2Field.xField";
        search2.y2 = "point2Field.yField";
        search2.projection = "EPSG:25832";

        this.items.push(search2);

        $("#searchOptions").controlgroup();
        $("#searchOptions").trigger("create");
        $("#searchOptionsCollapsible").collapsible();
        $("#searchOptionsCollapsible").trigger("create");

        $("#SearchPage2").page();
        $("#SearchPage3").page();
        $("#searchInput2").bind("keyup change", function () {
            var text = $(this).val();
            oiorest.activeSearch.search2(text);
        });
        $("#searchInput3").bind("keyup change", function () {
            var text = $(this).val();
            if (text.length >= oiorest.activeSearch.chars3 && oiorest.activeSearch.text3 != text) {
                oiorest.activeSearch.text3 = text;
                oiorest.activeSearch.search3();
            }
        });
    }
};

Search = function (id, title, checked) {
    this.id = id;
    this.title = title;
    this.checked = checked;
    this.ajax = null;

    this.x1 = null;
    this.y1 = null;
    this.x2 = null;
    this.y2 = null;
    this.url = null;
    this.projection = null;

    this.title1 = null;
    this.title2 = null;
    this.title3 = null;
    this.url1 = null;
    this.url2 = null;
    this.url3 = null;
    this.id1 = null;
    this.id2 = null;
    this.id3 = null;
    this.name1 = null;
    this.name2 = null;
    this.name3 = null;
    this.placeholder1 = null;
    this.placeholder2 = null;
    this.placeholder3 = null;
    this.chars1 = null;
    this.chars2 = null;
    this.chars3 = null;
    this.text1 = "";
    this.text2 = "";
    this.text3 = "";
    this.selection1 = null;
    this.selection2 = null;
    this.selection3 = null;

    var self = this;

    var searchList = $("<ul>", {
        "id": "searchList" + this.id,
        "data-role": "listview",
        "data-inset": "true",
        "data-count-theme": "b"
    }).appendTo("#searchResult1");
    searchList.listview();
    var mycheck = $("<input>", {
        "name": "searchOption" + this.id,
        "id": "searchOption" + this.id,
        "type": "checkbox"
    });
    if (this.checked) {
        mycheck.attr("checked", "checked");
    }
    mycheck.bind("change", function (event, ui) {
        self.checked = event.target.checked;

        if (self.checked) {
            self.search1();
        }
        else {
            //searchList.listview("refresh");
            var searchList = $("#searchList" + self.id);
            searchList.html("");

        }
    });
    mycheck.appendTo("#searchOptions>.ui-controlgroup-controls");
    $("<label>", {
        "for": "searchOption" + this.id,
        "text": this.title
    }).appendTo("#searchOptions>.ui-controlgroup-controls");
    this.search1 = function () {
        if (self.checked) {
            $("#searchList" + self.id).html("");
            if (self.text1.length >= self.chars1) {
                if (self.ajax != null) {
                    self.ajax.abort();
                }
                $.mobile.showPageLoadingMsg("a", "Søger...", false);
                self.ajax = $.ajax({
                    url: self.url1.replace("[text]", self.text1),
                    dataType: 'jsonp',
                    success: function (data) {
                        $("<li data-role='list-divider'>" + self.title1 + "<span class='ui-li-count'>" + data.length + "</span></li>").appendTo("#searchList" + self.id);

                        for (var i = 0; i < data.length; i++) {
                            var name = self.name1;
                            var m = self.name1.match(/\[.+?\]/g);
                            while (m.length) {
                                var a = m.shift();
                                var b = getPath(data[i], a.replace("[", "").replace("]", ""));
                                name = name.replace(a, b);
                            }
                            self.addItem1(getPath(data[i], self.id1), name);
                        }
                        $("#searchList" + self.id).listview("refresh");
                    },
                    complete: function () {
                        $.mobile.hidePageLoadingMsg();
                    }
                });
            }
        }
    };
    this.search2 = function (text) {
        if (text.length >= self.chars2 && self.text2 != text) {
            $("#searchResult2").html("");
            self.text2 = text;
            if (self.ajax != null) {
                self.ajax.abort();
            }
            $.mobile.showPageLoadingMsg("a", "Søger...", false);
            self.ajax = $.ajax({
                url: self.url2.replace("[text]", text).replace("[selection1]", self.selection1),
                dataType: 'jsonp',
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var name = self.name2;
                        var m = self.name2.match(/\[.+?\]/g);
                        while (m.length) {
                            var a = m.shift();
                            var b = getPath(data[i], a.replace("[", "").replace("]", ""));
                            name = name.replace(a, b);
                        }
                        self.addItem2(getPath(data[i], self.id2), name);
                    }
                    $("#searchResult2").listview("refresh");
                },
                complete: function () {
                    $.mobile.hidePageLoadingMsg();
                }
            });
        }
    };
    this.search3 = function () {
        $("#searchResult3").html("");
        if (self.ajax != null) {
            self.ajax.abort();
        }
        $.mobile.showPageLoadingMsg("a", "Søger...", false);
        self.ajax = $.ajax({
            url: self.url3.replace("[text]", self.text3).replace("[selection1]", self.selection1).replace("[selection2]", self.selection2),
            dataType: 'jsonp',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var name = self.name3;
                    var m = self.name3.match(/\[.+?\]/g);
                    while (m.length) {
                        var a = m.shift();
                        var b = getPath(data[i], a.replace("[", "").replace("]", ""));
                        name = name.replace(a, b);
                    }
                    self.addItem3(getPath(data[i], self.id3), name);
                }
                $("#searchResult3").listview("refresh");
            },
            complete: function () {
                $.mobile.hidePageLoadingMsg();
            }
        });
    };
    this.addItem1 = function (id, name) {
        $("<li>").append(
            $("<a />", { text: name }).click(function () {
                oiorest.activeSearch = self;
                self.selection1 = id;
                var page = $("#SearchPage2");
                var header = page.children(":jqmData(role=header)");
                if (self.chars2 > 0)
                    $("#searchHint2").html("Indtast minimum " + self.chars2 + " karakterer!");
                else
                    $("#searchHint2").html("");
                header.find("h1").html(self.title2);
                $("#searchInput2").val("");
                $("#searchInput2").attr("placeholder", self.placeholder2);
                $("#searchResult2").html("");
                $.mobile.changePage(page);
            })
        ).appendTo("#searchList" + self.id);
    };
    this.addItem2 = function (id, name) {
        $("<li>").append(
            $("<a />", { text: name }).click(function () {
                oiorest.activeSearch = self;
                self.selection2 = id;
                if (self.url3) {
                    var page = $("#SearchPage3");
                    var header = page.children(":jqmData(role=header)");
                    header.find("h1").html(self.title3);
                    $("#searchInput3").val("");
                    $("#searchInput3").attr("placeholder", self.placeholder3);
                    $("#searchResult3").html("");
                    if (self.chars3 > 0)
                        $("#searchHint3").html("Indtast minimum " + self.chars3 + " karakterer!");
                    else {
                        self.text3 = "";
                        self.search3();
                    }
                    $.mobile.changePage(page);
                }
                else {
                    self.getPosition(name);
                }
            })
        ).appendTo("#searchResult2");
    };
    this.addItem3 = function (id, name) {
        $("<li>").append(
            $("<a />", { text: name }).click(function () {
                oiorest.activeSearch = self;
                self.selection3 = id;
                self.getPosition(name);
            })
        ).appendTo("#searchResult3");
    };
    this.getPosition = function (name) {
        if (self.ajax != null) {
            self.ajax.abort();
        }
        $.mobile.showPageLoadingMsg("a", "Søger...", false);
        self.ajax = $.ajax({
            url: self.url.replace("[text]", name).replace("[selection1]", self.selection1).replace("[selection2]", self.selection2).replace("[selection3]", self.selection3),
            dataType: 'jsonp',
            success: function (data) {
                if (self.x2) {
                    var point1 = new OpenLayers.Geometry.Point(getPath(data, self.x1), getPath(data, self.y1));
                    var point2 = new OpenLayers.Geometry.Point(getPath(data, self.x2), getPath(data, self.y2));
                    point1.transform(new OpenLayers.Projection(self.projection), map.projection);
                    point2.transform(new OpenLayers.Projection(self.projection), map.projection);
                    var bounds = new OpenLayers.Bounds(point1.x, point1.y, point2.x, point2.y);
                    map.zoomToExtent(bounds);
                }
                else {
                    var point = new OpenLayers.Geometry.Point(getPath(data, self.x1), getPath(data, self.y1));
                    point.transform(new OpenLayers.Projection(self.projection), map.projection);
                    vector.removeAllFeatures();
                    vector.addFeatures([
                        new OpenLayers.Feature.Vector(
                            point,
                            {},
                            {
                                graphicName: 'cross',
                                strokeColor: '#f00',
                                strokeWidth: 2,
                                fillOpacity: 0,
                                pointRadius: 10
                            }
                        )
                    ]);
                    map.zoomToExtent(vector.getDataExtent());
                }
                var page = $("#Kort");
                $.mobile.changePage(page);
            },
            complete: function () {
                $.mobile.hidePageLoadingMsg();
            }
        });

    }
}

function getPath(obj, path) {
    var parts = path.split('.');
    while (parts.length && obj) {
        obj = obj[parts.shift()];
    }
    return obj;
}