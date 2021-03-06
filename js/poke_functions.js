/********** Functions **********/
        /**** Generic ****/
//Load all pokemon miniatures into a panel
function loadSelectionPanel(panel, expr){
    switch (expr) {
            case "Safari":
            console.log("Safari");
                for (i=0; i < dataSet.length;i++){
                var pokemonbutton = $('<a id="' + dataSet[i][5] + '_' + $(dataSet[i][2]).html() + '" class="pokemon404" href="' + $(dataSet[i][2]).attr('href') + '">' + '<img src="' + $(dataSet[i][1]).attr("src") + '"/></a>');
                panel.append(pokemonbutton);
                }
                break;
            case "Comparison":
            console.log("Comparison");
            for (i=0; i < dataSet.length;i++){
                var pokemonbutton = $('<input type="image" id="'+ dataSet[i][5] + '_' + $(dataSet[i][2]).html() + '" class="poke_button" ' +' title="' + $(dataSet[i][2]).html()  + '" src="' + $(dataSet[i][1]).attr("src") + '" onclick="selectPoke(this)" />')
                panel.append(pokemonbutton);
            }
                break;
            default:
                ;
        }
};


function secureAPI(sUrl) {
        if (sUrl.indexOf('https') == -1)
            return sUrl.replace('http','https');
        else
            return sUrl;
    }
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

//Display/Hide pokemon that doesn't fit a certain description
function searchPoke(pokeName,searchbarid,pokemoncontainer,pokemonclass){
            /*Here's an exemple
            pokename : instance of search bar
            searchbarid : poke_search_left
            pokemoncontainer : poke_selection_left
            pokemonclass : poke_button
            */
    var name = pokeName.value;
    var pokeList = $("#" + pokeName.id.replace(searchbarid, pokemoncontainer)).find(pokemonclass);
    console.log(pokeList.length + " pokemon found");
    pokeList.each(function(index, pokemon){
        if(pokemon.id.toLowerCase().indexOf(name.toLowerCase()) > -1){
            pokemon.style.display = 'inline-block';
        }
        else{
            pokemon.style.display = 'none';
        }
    })
}

function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

function drawChart(arrayStats, chart_container) {

    var dataArray = [];
    var labelArray = ["Spd","Sp.Def","Sp.Atk","Def","Atk","HP"];

    for (var i=0; i < arrayStats.length; i++) {
        dataArray.push(arrayStats[i].base_stat);
        //labelArray.push(toTitleCase(arrayStats[i].stat.name));
    }
    var data = {
        labels: labelArray,
        datasets: [
            {
                label: "Pokemon Stats",                    
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: dataArray
            }
        ]
    };

    var ctx = $(chart_container).get(0).getContext("2d");
    var myRadarChart = new Chart(ctx).Radar(data);    
    $(chart_container).data('test', myRadarChart);
}

function calcHeight(height){
    var scr_height = height;
    //if (scr_height <= 500)
        //return ((scr_height - 100) <= 0 )? scr_height : (scr_height - 100);
    if (scr_height == 0)
        return scr_height;
    else
        return scr_height / Math.floor(scr_height / 350);
}

function calcWidth(width){
    var scr_width = width;
    //if (scr_width <= 500)
        //return ((scr_width - 100) <= 0 )? scr_width : (scr_width - 100);
    if (scr_width == 0)
        return scr_width;
    else
        return scr_width / Math.floor(scr_width / 350);
}


function getData() {

        var pokeId = getUrlParameter('id');

        if ($.isNumeric(pokeId) == false) {
            $('#pokePage').empty();
            $("#overlay").hide();
            $('#pokePage').load('404.html');
            return false;
        }

        //rajouter une image de loading pour faire joli
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + pokeId + '/', 
            method: 'GET',
            dataType: 'json',
            success: function(result) {
                
                var stats = [];
                for (var i=0; i < result.stats.length; i++) {
                    stats.push(result.stats[i].base_stat);
                }
                
                drawChart(result.stats, setPokeData($(".stats_generator"), stats, result, result.name, true));
                
                
                //fillNameDiv(toTitleCase(result.name));
                //addPic(result.sprites.front_default);
                getGeneralInfo(result);
                getEvolutionChain(result.species.url, pokeId);

                //drawChart(result.stats);
                //drawBarChart(result.stats);
                //drawTable(result.moves);             
            }
        });
    }
        /**** Safari ****/
function pokeballGo(){
    if ($('#safari_park').css('display') == 'none'){
        $('#safari_park').show();
    }
    else {
        $('#safari_park').hide();
    }
};

        /**** Custom Stats ****/
function loadCprPokemon(iptPoke){
    
}

function selectPoke(poke){
    var custom_stats = editableZone(poke);
    var loadinggif = $("<img id='loading' class='hm' alt='Loading... PLease wait' src='images/loading.gif'/>");
    custom_stats.empty();
    custom_stats.prepend(loadinggif);
    $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/' + $(poke).attr('id').split('_')[0] + '/', 
            method: 'GET',
            dataType: 'json',
            success: function(pokemon){
                var stats = [];
                for (var i=0; i < pokemon.stats.length; i++) {                
                    stats.push(pokemon.stats[i].base_stat);
                }

                drawChart(pokemon.stats, setPokeData(custom_stats, stats, pokemon, pokemon.name, false));
            }
    });
}

function editableZone(poke){
    return $(poke).parent().parent().find('.stats_generator');
}

/*function getSide(poke){
    return $(poke).parent().parent().find('.stats_generator').attr('id').replace('custom_stats_','');
}*/

function getSide(poke){
    return editableZone(poke).attr('id').replace('pokemon_content','');
}

function getCheckSide(checkbox){
    return $(checkbox).parent().parent().parent().parent().attr('id').split('_')[1];
}

function getContainerSide(container){
    return $(container).attr('id').split('_')[$(container).attr('id').split('_').length - 1];
}


function setPokeData(container, statsval, pokemon, name, isPagePoke){

    //initialisation des structures de données pour le simulateur
    var side = getContainerSide(container);
    $(container).data('poke_' + side, pokemon);
    $('#fightBtn').data('moves_poke_'+side, []);

    console.log($(container).data('poke_' + side));

    container.empty();
    container.append($("<div id='pokeID-"+ name +"' class='hm'><p>" + toTitleCase(name) + "</p><br/><img src='http://pokeapi.co/media/sprites/pokemon/" + pokemon.id + ".png'/></div>"));
    
    if(isPagePoke){
            var pagePoke = "<table id='pokeinfo' class='hm' style='width:30%; min-width:350px;'><tr></tr><th>Height :</th><td id='height'></td><th>Catch rate :</th><td id='catch-rate'></td><tr><th>Weight :</th><td id='weight'></td><th>Gender % :</th><td id='gender-ratio'></td></tr><tr><th>Type :</th><td id='type'></td><th>XP Class :</th><td id='xpclass'></td></tr></table></br><div id='desc'></div><div id='ability'></div><div id='evolutionChain'><table id='evolutionTable' style='width:100%'><tr id='picRow'></tr><tr id='textRow'></tr></table></div>";
            container.append($(pagePoke))
    }
    var stats = ["spd","spdef","spatk","def","atk","hp"];
    var statsnames = ["Spd","Sp.Def","Sp.Atk","Def","Atk","HP"];
    var statstable = $("<table id='%Pokemon_statstable' class='hm2'><tr><th>Stat</th><th title='Base Stat'>BS</th><th title='Individual Values'>IV</th><th title='Effort Values'>EV</th><th>Value</th></tr></table>".replace(/%Pokemon/g,name + "_" + getContainerSide(container)))
    //var singlestat = "<div id='poke_stats_%Name' class='stat_container'><span id='stat_name_%Name'>%StatName :</span> <input id='stat_value_%Name' class='stat_value' type='text' value='%Stat_val' readonly='readonly'/></div>";
    var singlestat = "<tr id='%Pokemon_poke_stats_%Name_c'><th>%StatName :</th><td><input id='%Pokemon_bs_%Name' class='stat_value' type='text' value='%Stat_val' readonly='readonly'/></td><td><input id='%Pokemon_iv_%Name' class='stat_value' type='text' value='0'/></td><td><input id='%Pokemon_ev_%Name' class='stat_value' type='text' value='0' /></td><td><input id='%Pokemon_sv_%Name' class='stat_value' type='text' value='%Stat_calc' readonly='readonly'/></td></tr>";
    var movetable = "<div id='pokemoves_%Side' class='hm" + (isPagePoke?"2":"3") + "'><table id='moves_%Side'><tr><th></th><th class'move_header'>Name</th><th class'move_header'>Type</th><th class'move_header'>PP</th><th class'move_header'>Power</th><th class'move_header'>Effect</th><th class'move_header'>Level</th><th class'move_header'>Method</th></tr></table></div>";
    var radar = $("<canvas id='" + name + "-" + $(container).attr('id').replace("custom_stats_","") + "-Radar' height=" + calcHeight($(window).height()) + "  width=" + calcWidth(container.width()) + "></canvas>");
    container.append($("<br/>"));
    var barchart = $(('<div id="%Pokemon_barChart"></div>').replace(/%Pokemon/g,name + "_" + getContainerSide(container)));
    
    container.append(radar);
    container.append(barchart);
    drawBarChart(barchart, statsval);
    for (var i = 0; i < stats.length; i++){
        var children = $(singlestat.replace(/%Name/g,stats[i]).replace(/%StatName/g,statsnames[i]).replace(/%Stat_val/g,statsval[i]).replace(/%Pokemon/g,name + "_" + getContainerSide(container)).replace(/%Stat_calc/g,calcStat(parseInt(statsval[i]),0,0,1,1,(i < (stats.lengh-1)))));
        statstable.append(children);
    }
    var ns = $(("<tr id='%Pokemon_poke_stats_ns_c'><th>Nature :</th><td><select id='%Pokemon_ns' class='nature_value'/></td></tr>").replace(/%Pokemon/g,name + "_" + getContainerSide(container)));
    var select_ns = ns.find("select");
    
    for (var i = 0; i < natures.length; i++){
        select_ns.append($("<option value='" + natures[i].name + "'" + (natures[i].name == "Docile" ? " selected='selected' ": "") + ">" + natures[i].name + "</option>"));
    }
    
    statstable.append(ns);
    var lvl = $(("<tr id='%Pokemon_poke_stats_lvl_c'><th>Level :</th><td><input id='%Pokemon_lvl' class='stat_value' type='text' value='1' /></td></tr>").replace(/%Pokemon/g,name + "_" + getContainerSide(container)));
    statstable.append(lvl);
    container.append(statstable);
    container.append($("<br/>"))
    //var moves = $(movetable.replace("%Side", getContainerSide(container)).replace("%Side", getContainerSide(container)));
    var moves = $(movetable.replace(/%Side/g, getContainerSide(container)));
    container.append(moves);
    drawMoveTable(moves.find("#moves_" + getContainerSide(container)), pokemon.moves);
    
    
    $('.stat_value').keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            $("#errmsg").html("Digits Only").show().fadeOut("slow");
            return false;
         }
    });
    $('.stat_value').keyup(function (e) {
        if($(this).attr('id').indexOf("_lvl") > -1){
            if($(this).val().trim() == "" || parseInt($(this).val()) < 1)
                $(this).val('1');
            else{
                if(parseInt($(this).val()) > 100)
                    $(this).val('100');
            }
        }
        else{
            if($(this).attr('id').indexOf("_iv_") > -1){
                if($(this).val().trim() == "")
                    $(this).val('0');
                else{
                    if(parseInt($(this).val()) > 31)
                        $(this).val('31');
                }
            }
            else{
                if($(this).val().trim() == "")
                    $(this).val('0');
                else{
                    if(parseInt($(this).val()) > 252)
                        $(this).val('252');
                }
            }
        }
        processStats($(this));
    });
    
    $('.nature_value').change(function(){
        processStats($(this));
    })
    
    return radar;
}


function drawBarChart(barchart, arrayStats) {

    //var dataArray = [];
    var labelArray = ["Spd","Sp.Def","Sp.Atk","Def","Atk","HP"];
    var dataProvider = [];

    for (var i=0; i < arrayStats.length; i++) {
        var obj = new Object();
        obj.stat = labelArray[i];
        obj.value = arrayStats[i];            
        dataProvider.push(obj);
    }        

     var chart = AmCharts.makeChart($(barchart).attr('id'), {
        "type": "serial",
        "theme": "light",  
        "handDrawn":true,
        "handDrawScatter":2,
        "legend": {
            "useGraphSettings": true,
            "markerSize":12,
            "valueWidth":0,
            "verticalGap":0
        },
        "dataProvider": dataProvider,
        "valueAxes": [{
            "minorGridAlpha": 0.08,
            "minorGridEnabled": true,
            "position": "top",
            "axisAlpha":0
        }],
        "startDuration": 1,
        "graphs": [{
            "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>",
            "title": "Value",
            "type": "column",
            "fillAlphas": 0.8,
            "valueField": "value"
        }],
        "rotate": true,
        "categoryField": "stat",
        "categoryAxis": {
            "gridPosition": "start"
        },
        "export": {
            "enabled": true
         }
    });
}

//*******************************************

function processStats(IEV){
    
    var tablestat = $(IEV).parent().parent().parent().parent();
    //var rowstat = $(IEV).parent().parent();
    
    var bs6 = fillStats(tablestat.find('[id*="_bs_"]'));
    var iv6 = fillStats(tablestat.find('[id*="_iv_"]'));
    var ev6 = fillStats(tablestat.find('[id*="_ev_"]'));
    
    var isHP = $(IEV).attr('id').indexOf("_hp") > -1;
    var lvl = parseInt(tablestat.find('[id$="_lvl"]').val());
    var ns = getNatStats(tablestat.find('[id$="_ns"]').val());
    
    var i = 0;
    $(tablestat).find('[id*="_sv_"]').each(function(){
        var bs = parseInt(bs6[i]);
        var iv = parseInt(iv6[i]);
        var ev = parseInt(ev6[i]);
        $(this).val(calcStat(bs, iv, ev, lvl, ns[i], i==5));
        //console.log((i + ':                iv ' + iv + ' bs ' + bs + ' ev ' + ev + ' lvl ' + lvl+ ' ns ' + ns[i] + ' isHP: '+ isHP));
        i++;
    });
    
    updateRadar($(tablestat).parent().find('[id$="-Radar"]'), fillStats(tablestat.find('[id*="_sv_"]')));
    
}

function fillStats(inputArray){
    var tab = [];
    
    inputArray.each(function(){
        tab.push(parseInt($(this).val()));
    })
    return tab;
}


function getNatStats(nature){
    for(var i=0; i< natures.length; i++){
        if(natures[i].name == nature){
            //console.log(i);
            return natures[i].stats;
        }
    }
}

function calcStat(bs, iv, ev, lvl, ns, isHP){
    //alert('iv ' + iv + ' bs ' + bs + ' ev ' + ev + ' lvl ' + lvl);
    
    if(isHP)
        return Math.floor((iv+(2*bs)+Math.floor(ev/4))*(lvl/100)+10 +lvl);
    else
        return Math.floor(Math.floor((iv+(2*bs)+Math.floor(ev/4))*(lvl/100)+5) * ns);
}

function updateRadar(radar, stats){    
    var chartPoints = $(radar).data('test');
    for (var i = 0; i < stats.length; i++){        
        chartPoints.datasets[0].points[i].value = stats[i];
    }
    chartPoints.update();
}



//*****************************************

function drawMoveTable(movetable, moves) {

        for (var i=0; i < moves.length; i++) {
            //faire un tri des données à récupérer
            for (var j=0; j < moves[i].version_group_details.length; j++) {

                if (moves[i].version_group_details[j].version_group.name == 'omega-ruby-alpha-sapphire') {

                    drawMoveRow(movetable, {
                        move: moves[i].move,
                        details: moves[i].version_group_details[j]
                    });
                }
            }
        }
    }

function drawMoveRow(movetable, move) {
    var row = $('<tr class="move_row"/>');
    movetable.append(row);

    var move_check = $('<td class="move_name move_cell"><input class="move_check" type="checkbox" onchange="checkMove(this)"></td>')
    var move_name = $('<td class="move_name move_cell">' + toTitleCase(move.move.name) + '</td>');
    var move_PP = $('<td class="move_PP move_cell"/>');
    var move_power = $('<td class="move_power move_cell"/>');
    var move_type = $("<td class='move_type move_cell'/>");
    var move_effect = $("<td class='move_effect move_cell'/>");
    
    var move_level = $("<td class='move_level move_cell'>" + move.details.level_learned_at + "</td>");
    var move_method = $("<td class='move_method move_cell'><img alt='" + move.details.move_learn_method.name +"' title='" + toTitleCase(move.details.move_learn_method.name) + "' src='./images/moves/" + move.details.move_learn_method.name + ".png'/></td>");
    
    row.append(move_check);
    row.append(move_name);
    row.append(move_type);
    row.append(move_PP);
    row.append(move_power);
    row.append(move_effect);
    row.append(move_level);
    row.append(move_method);
    getMoveSpecs(move.move.url, move_type, move_PP, move_power, move_effect, row, move.move.name);    
}


/* Gets the specs of a move and appends it to the table */
function getMoveSpecs(sUrl, move_type, move_pp, move_power, move_effect, move_row, move_name) {
    $.ajax({
        url: secureAPI(sUrl), 
        method: 'GET',
        dataType: 'json',            
        success: function(result) {
            move_type.html($("<img src='./images/types/" + toTitleCase(result.type.name) + ".gif'/>"));
            move_pp.html(result.pp);
            move_power.html(result.power);
            var sMove = result.effect_entries[0].short_effect;
            sMove = sMove.replace("$effect_chance%", "");
            move_effect.html(sMove);
            move_row.attr('title', result.effect_entries[0].effect);

            c_type = result.type.name;
            c_power = result.power;
            c_accuracy = result.accuracy;
            c_pp = result.pp;

            var battle_move = {
                name : move_name,
                type : result.type.name,
                power : result.power,
                accuracy : result.accuracy,
                pp : result.pp / 5
            };

            $(move_row).find(".move_check").data("move", battle_move);
        }
    });
}
    
    
function sendFightData() {
    
    var statPoke1 = getAllStats($('#custom_stats_left'));
    var statPoke2 = getAllStats($('#custom_stats_left'));
    
    var fight = {
        fightLog : '',
        poke1 : {
            name : $('#custom_stats_left').data('poke_left').name,
            level : parseInt($('#'+$('#custom_stats_left').data('poke_left').name+'_left_lvl').val()),
            type1 : $('#custom_stats_left').data('poke_left').types[0].type.name,
            type2 : typeof $('#custom_stats_left').data('poke_left').types[1] === 'undefined' ? '' : $('#custom_stats_left').data('poke_left').types[1].type.name,
            speed : statPoke1[0],
            spDef : statPoke1[1],
            spAtk : statPoke1[2],
            defense : statPoke1[3],
            attack : statPoke1[4],
            maxHP : statPoke1[5],
            currentHP : statPoke1[5],
            moves : $('#fightBtn').data('moves_poke_left'),
            frontSprite : $('#custom_stats_left').data('poke_left').sprites.front_default,
            backSprite : $('#custom_stats_left').data('poke_left').sprites.back_default
        },
        poke2 : {
            name : $('#custom_stats_right').data('poke_right').name,
            level : parseInt($('#'+$('#custom_stats_right').data('poke_right').name+'_right_lvl').val()),
            type1 : $('#custom_stats_right').data('poke_right').types[0].type.name,
            type2 : typeof $('#custom_stats_right').data('poke_right').types[1] === 'undefined' ? '' : $('#custom_stats_right').data('poke_right').types[1].type.name,
            speed : statPoke2[0],
            spDef : statPoke2[1],
            spAtk : statPoke2[2],
            defense : statPoke2[3],
            attack : statPoke2[4],
            maxHP : statPoke2[5],
            currentHP : statPoke2[5],
            moves : $('#fightBtn').data('moves_poke_right'),
            frontSprite : $('#custom_stats_right').data('poke_right').sprites.front_default,
            backSprite : $('#custom_stats_right').data('poke_right').sprites.back_default
        }
    };

    $.ajax({
        url: 'https://api.mongolab.com/api/1/databases/pikadb/collections/fight?apiKey=Iq2U_zn9n2pFQk2nyLNnHzPL8EtNr2t5',
        type: 'POST',
        data: JSON.stringify(fight),
        contentType: 'application/json',
        success: function(result) {
            console.log(result._id.$oid);
            window.location.href = 'battle.html?id='+result._id.$oid;
        }
    });
}


function checkMove(checkbox) {

    var side = getCheckSide(checkbox);

    //Affichage du bouton Fight, si 2 checkbox au moins
    if ($('table#moves_left input:checkbox:checked').length > 0 && $('table#moves_right input:checkbox:checked').length > 0)
        $('#fightBtn').css({'display':'inline'});
    else
        $('#fightBtn').css({'display':'none'});

    if ($('table#moves_' + side + ' input:checkbox:checked').length <= 4) {
        $('table#moves_' + side + ' input[type=checkbox]').removeAttr('disabled');

        //On décoche, on retire le move
        if (!$(checkbox).is(':checked')) {

            var tmp = $('#fightBtn').data('moves_poke_'+side);

            $.each(tmp, function(i){
                if(tmp[i].name === $(checkbox).data('move').name) {                    
                    tmp.splice(i,1);
                    return false;
                }
            });
                        
            $('#fightBtn').data('moves_poke_'+side, tmp);            
        }

        //on ajoute les valeurs du move
        else {

            $('#fightBtn').data('moves_poke_'+side).push($(checkbox).data('move'));            
        }

        if ($('table#moves_' + side + ' input:checkbox:checked').length == 4)
            $('table#moves_' + side + ' input[type=checkbox]:not(:checked)').attr('disabled','true');
    }
}


function getAllStats(sideContainer) {

    var tab = [];
    var inputArray = sideContainer.find('[id*="_sv_"]');
    inputArray.each(function(){
        tab.push(parseInt($(this).val()));
    })

    return tab;
}