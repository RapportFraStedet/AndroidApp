var Rfs = {
    temaer: null,
    tema: null,
    rapport: null,
    kommuner: null,
    kommune: null,
    x: 0,
    y: 0,
    init: function () {
        $("#Kommune").page();
        $("#AlleKommuner").page();
        $("#Formular").page();
        $("#Advarsel").page();
        //$("#ModtagerIkkeIndberetning").page();
        //$("#OioKommune").page();
    },
    showAlleKommuner: function (urlObj, options) {
        if (Rfs.kommuner == null) {
            $.mobile.showPageLoadingMsg("a", "Henter kommuner...", false);
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function (data) {
                    Rfs.kommuner = data;
                    var markup = "";
                    for (var i = 0; i < data.length; i++) {
                        var kommune = data[i];
                        markup += "<li";
                        if (kommune.ModtagerIndberetning == 0) {
                            markup += " data-icon='alert'>";
                            markup += "<a href='#Advarsel?nr=" + kommune.Nr + "' data-transition='slide'>";
                        }
                        else {
                            markup += "><a href='#Kommune?nr=" + kommune.Nr + "' data-transition='slide'>";
                        }
                        if (kommune.Logo != '') {
                            markup += "<img src='" + kommune.Logo + "' />"
                        }
                        markup += "<h1>" + kommune.Navn + "</h1>";
                        if (kommune.ModtagerIndberetning == 0) {
                            markup += "<a href='#Advarsel?nr=" + kommune.Nr + "' data-theme='e' data-transition='slide'></a>";
                        }
                        markup += "</a></li>";
                    }
                    var page = $("#AlleKommuner");
                    var content = page.children(":jqmData(role=content)");
                    content.find("ul").html(markup);
                    content.find("ul").listview("refresh");
                    $.mobile.changePage(page, options);
                },
                error: function () {
                    $.mobile.changePage("#ShowKommunerError");
                },
                complete: function () {
                    $.mobile.hidePageLoadingMsg();
                }
            });
        }
        else {
            $.mobile.changePage($("#AlleKommuner"), options);
        }
    },
    showKommune: function (urlObj, options) {
        var nr = urlObj.hash.replace(/.*nr=/, "");
        if (nr == "#Kommune") {
            $.mobile.changePage($("#Kommune"), options);
        }
        else {
            if (Rfs.kommuner != null) {
                for (var i = 0; i < Rfs.kommuner.length; i++) {
                    if (Rfs.kommuner[i].Nr == nr) {
                        Rfs.kommune = Rfs.kommuner[i];
                        break;
                    }
                }
            }
            if (Rfs.kommune != null) {
                $.mobile.showPageLoadingMsg("a", "Henter temaer...", false);
                $.ajax({
                    url: Rfs.kommune.URL + "/api/Tema",
                    dataType: 'jsonp',
                    data: { nr: Rfs.kommune.Nr, x: x, y: y },
                    success: function (data) {
                        Rfs.temaer = data;
                        var page = $("#Kommune");
                        var header = page.children(":jqmData(role=header)");
                        var markup = "";
                        var img = header.find("img");
                        img[0].src = Rfs.kommune.Logo;
                        if (Rfs.kommune.Logo == '') {
                            img[0].style.visibility = "hidden";
                        }
                        else {
                            img[0].style.visibility = "visible";
                        }
                        header.find("h1").html(Rfs.kommune.Navn + " Kommune");
                        //markup = "<ul data-role='listview'>";
                        markup = "";
                        for (var i = 0; i < Rfs.temaer.length; i++) {
                            var tema = Rfs.temaer[i];
                            markup += "<li"
                            if (tema.ModtagerIndberetning == 0) {
                                markup += " data-icon='alert'";
                            }
                            markup += "><a href='#Tema?id=" + tema.Id + "' data-transition='slide'>";
                            if (tema.Logo != '') {
                                markup += "<img src='" + tema.Logo + "' />"
                            }
                            markup += "<h1>" + tema.Navn + "</h1><p>" + tema.Beskrivelse + "</p>";
                            if (tema.ModtagerIndberetning == 0) {
                                markup += "<a href='#Warning' data-theme='e' data-rel='dialog' data-transition='slide'></a>";
                            }
                            markup += "</a></li>";
                        }
                        //markup += "</ul>";

                        var content = page.children(":jqmData(role=content)");
                        content.find("ul").html(markup);
                        content.find("ul").listview("refresh");
                        page.page();
                        /*content.html(markup);
                        content.find(":jqmData(role=listview)").listview();*/
                        $.mobile.changePage(page, options);
                    },
                    error: function () {
                        $.mobile.changePage("#ShowKommunerError");
                    },
                    complete: function () {
                        $.mobile.hidePageLoadingMsg();
                    }
                });
            }
        }
    },
    showTema: function (urlObj, options) {
        var id = urlObj.hash.replace(/.*id=/, "");
        if (id == "#Tema") {
            $.mobile.changePage($(id), options);
        }
        else {
            if (Rfs.temaer != null) {
                for (var i = 0; i < Rfs.temaer.length; i++) {
                    if (Rfs.temaer[i].Id == id) {
                        Rfs.tema = Rfs.temaer[i];
                        break;
                    }
                }
                if (Rfs.tema != null) {
                    $.mobile.showPageLoadingMsg("a", "Henter tema...", false);
                    $.ajax({
                        url: Rfs.tema.URL + "/api/data/" + Rfs.tema.FormId,
                        dataType: 'jsonp',
                        success: function (data) {
                            if (data.ApplicationDefinition != "") {
                                var appurl = data.MapAgent.toLowerCase().replace("mapagent/mapagent.fcgi", "fusion") + "/layers/mapguide/php/ApplicationDefinition.php?USERNAME=Anonymous&CLIENTAGENT=Rapport+Fra+Stedet+1.0.0&appid=" + data.ApplicationDefinition;
                                $.ajax({
                                    url: appurl,
                                    dataType: 'jsonp',
                                    success: function (appdef) {
                                        if (appdef.ApplicationDefinition && appdef.ApplicationDefinition.length > 0 && appdef.ApplicationDefinition[0].MapSet && appdef.ApplicationDefinition[0].MapSet.length > 0) {
                                            data.MapSet = appdef.ApplicationDefinition[0].MapSet[0];
                                        }
                                        Rfs.createform(data, options);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        $.mobile.changePage("#ShowKommunerError");
                                    },
                                    complete: function () {
                                        $.mobile.hidePageLoadingMsg();
                                    }
                                });
                            }
                            else {
                                Rfs.createform(data, options);
                            }
                        },
                        error: function () {
                            $.mobile.changePage("#ShowKommunerError");
                        },
                        complete: function () {
                            $.mobile.hidePageLoadingMsg();
                        }
                    });
                }
            }
        }
    },
    createform: function (data, options) {
        Rfs.rapport = data;
        var felter = data.Felter;
        var page = $("#Formular");
        /*var footer = page.children(":jqmData(role=footer)");
        var markup = "<div data-role='navbar'><ul>";
        if(data.MapSet)
        {
        markup += "<li><a href='#Kort'>Tilbage</a></li>";
        createMap(data);
        }
        markup += "<li><a href='#Confirm'>Næste</a></li></ul></div>";
        var myNavbar = $(markup);
        footer.html(myNavbar).trigger("create");
        */
        var header = page.children(":jqmData(role=header)");
        var img = header.find("img");
        img[0].src = Rfs.tema.Logo;
        if (Rfs.tema.Logo == '') {
            img[0].style.visibility = "hidden";
        }
        else {
            img[0].style.visibility = "visible";
        }
        header.find("h1").html(Rfs.tema.Navn);


        markup = "<fieldset>";
        for (var i = 0; i < felter.length; i++) {
            var felt = felter[i];
            markup += "<div data-role='fieldcontain'>";
            if (!felt.Data)
                felt.Data = "";
            switch (felt.TypeId) {
                case 2: //TextBox
                    markup += "<label for='" + felt.Id + "'>";
                    if (felt.Required == 1) {
                        markup += "<em>*</em>";
                    }
                    markup += felt.Name + "</label>";
                    markup += "<input type='text' id='" + felt.Id + "' name='" + felt.Id + "' value='" + felt.Data + "'";
                    if (felt.Required == 1) {
                        markup += " class=required";
                    }
                    markup += " />";
                    break;
                case 3: //DropDown
                    markup += "<label for='" + felt.Id + "'>" + felt.Name + "</label>";
                    markup += "<select id='" + felt.Id + "' name='" + felt.Id + "' value='" + felt.Data + "'><option data-placeholder='true'>-- Vælg --</option>";
                    var selections = felt.Selections;
                    for (var j = 0; j < selections.length; j++) {
                        var selection = selections[j];
                        markup += "<option value='" + selection.Name + "'";
                        if (selection.Selected == 1) {
                            markup += " selected='selected'";
                        }
                        markup += ">" + selection.Name + "</option>";
                    }
                    markup += "</select>";
                    break;
                case 4: //RadioButton
                    markup += "<fieldset data-role='controlgroup'><legend>" + felt.Name + "</legend>";
                    var selections = felt.Selections;
                    for (var j = 0; j < selections.length; j++) {
                        var selection = selections[j];
                        markup += "<input type='radio' id='" + selection.Id + "' name='" + felt.Id + "' value='" + selection.Name + "'";
                        if (selection.Selected == 1) {
                            markup += " checked='checked'";
                        }
                        markup += "/><label for='" + selection.Id + "'>" + selection.Name + "</label>";
                    }
                    markup += "</fieldset>";
                    break;
                case 5: //TextArea
                    markup += "<label for='" + felt.Id + "'>" + felt.Name + "</label>";
                    markup += "<textarea id='" + felt.Id + "' name='" + felt.Id + "'>" + felt.Data + "</textarea>";
                    break;
                case 6: //CheckBox
                    markup += "<fieldset data-role='controlgroup'><legend>" + felt.Name + "</legend>";
                    markup += "<input type='checkbox' id='" + felt.Id + "' name='" + felt.Id + "'";
                    if (felt.Data == 'true') {
                        markup += " checked='checked'";
                    }
                    markup += " /><label for='" + felt.Id + "'>" + felt.Name + "</label>";
                    markup += "</fieldset>";
                    break;
                case 8: //Upload
                    markup += "<label for='" + felt.Id + "'>" + felt.Name + "</label>";
                    markup += "<img id='" + felt.Id + "' width='100%' />";
                    markup += "<input type='button' onclick='captureImage(" + felt.Id + ");' value='Tag billede' />";
                    break;
                case 10: //Date
                    markup += "<label for='" + felt.Id + "'>" + felt.Name + "</label>";
                    markup += "<input type='date' id='" + felt.Id + "' name='" + felt.Id + "' data-role='datebox' data-options='{\"mode\": \"calbox\"}' />";
                    break;
            }
            markup += "</div>";
        }

        markup += "</fieldset>";


        //var content = page.children(":jqmData(role=content)");

        $("#rapportForm").html(markup);
        //$("#rapportForm").appendTo(page).trigger("create");
        //page.page();
        //navbar.trigger("create");
        page.trigger("create");
        //navbar.trigger("refresh");
        //navbar.navbar();

        $("#rapportForm").validate();
        //page.page();
        if (data.MapSet) {
            createMap();
            //oiorest.init();
            $.mobile.changePage("#Kort", options);

        }
        else {
            $.mobile.changePage("#Formular", options);
        }
    },
    showPosition: function () {
        $.mobile.showPageLoadingMsg("a", "Finder position...", false);
        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: { x: x, y: y },
            success: function (data) {
                Rfs.kommune = data;
                if (data.ModtagerIndberetning) {
                    $.mobile.changePage("#Kommune?nr=" + data.Nr);
                    //$.mobile.changePage("#Div1");
                }
                else {
                    var page = $("#ModtagerIkkeIndberetning");
                    var content = page.children(":jqmData(role=content)");
                    var markup = "";
                    markup += "<h2>Du står i " + data.Navn + " Kommune</h2>";
                    markup += "<p>RapportFraStedet kan ikke indberette til denne kommune!</p>";
                    if (Rfs.kommune.Besked != "") {
                        markup += "<p>" + data.Besked + "</p>"
                    }
                    if (data.URL != "") {
                        markup += "<a href='" + data.URL + "' rel='external' data-ajax='false' data-role='button'>Kontakt</a>";
                    }
                    markup += "<p>Du kan vælge at indberette til en anden kommune.</p>";
                    markup += "<a href='#AlleKommuner' data-role='button' data-theme='b' >Vælg kommune</a>";
                    content.html(markup);
                    page.trigger("create");
                    $.mobile.changePage("#ModtagerIkkeIndberetning");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.mobile.changePage("#ShowKommunerError");
            },
            complete: function () {
                $.mobile.hidePageLoadingMsg();
            }
        });
    },
    showAdvarsel: function (urlObj, options) {
        var nr = urlObj.hash.replace(/.*nr=/, "");
        if (Rfs.kommuner != null) {
            for (var i = 0; i < Rfs.kommuner.length; i++) {
                if (Rfs.kommuner[i].Nr == nr) {
                    Rfs.kommune = Rfs.kommuner[i];
                    break;
                }
            }
        }
        if (Rfs.kommune != null) {
            var page = $("#Advarsel");
            //var content = page.children(":jqmData(role=content)");
            var markup = "";
            markup += "<h2>" + Rfs.kommune.Navn + " Kommune</h2>";
            markup += "<p>Rapport Fra Stedet kan ikke indberette til denne kommune!</p>";
            if (Rfs.kommune.Besked != "") {
                markup += "<p>" + Rfs.kommune.Besked + "</p>"
            }
            if (Rfs.kommune.URL != "") {
                markup += "<a href='" + Rfs.kommune.URL + "' rel='external' data-ajax='false' data-role='button'>Kontakt</a>";
            }
            markup += "<p>Du kan vælge at indberette til en anden kommune.</p>";
            markup += "<a href='#AlleKommuner' data-role='button' data-theme='b' >Vælg kommune</a>";
            $("#update").html(markup);
            page.trigger("create");
            $.mobile.changePage(page, options);

        }
    },
    submitForm: function (urlObj, options) {

        /*$.each($("#rapportForm").serializeArray(), function (index, value) {
        Rfs.rapport.Felter[value.name] = value.value;
        });*/
        var options = { FormId: Rfs.rapport.FormId, Felter: $("#rapportForm").serializeArray() };
        if (Rfs.rapport.MapSet) {
            var extent = map.getExtent();
            var p = new OpenLayers.Geometry.Point(extent.left + (extent.right - extent.left) / 2, extent.bottom + (extent.top - extent.bottom) / 2);
            options.position = p.toString();
            options.projCode = map.projection;
        }
        $.mobile.showPageLoadingMsg("a", "Sender indberetning...", false);
        $.ajax({
            url: Rfs.tema.URL + "/api/SaveFormsData",
            dataType: "jsonp",
            data: options,
            success: function (data) {
                if (data == true)
                    $.mobile.changePage($("#Kvittering"), options);
                else
                    $.mobile.changePage($("#KvitteringError"), options);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.mobile.changePage("#loginError");
            },
            complete: function () {
                $.mobile.hidePageLoadingMsg();
            }
        });
    }
}