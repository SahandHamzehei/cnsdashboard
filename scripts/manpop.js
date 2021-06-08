// Public Token
mapboxgl.accessToken = "pk.eyJ1IjoidG9tbWFzb2NhbG8iLCJhIjoiY2traGJsNHVxMDFqNzJ2bmVobnd4MTBjcCJ9.HwahFhAyrkcMMlRrNls4jQ";

// Global vars
var vizControl = d3.select("#mode-viz");
var statsControl = d3.select("#mode-stats");
var storyControl = d3.select("#mode-story");
var currentMode = "story";  //init mode
var neighborhood = "MN";
var daytime;
var daytime_stats;
var color_total = false;
var time = 0;
var day = 0;
var stime;
var sday;
var url = 'https://raw.githubusercontent.com/tommasocalo/Dashboard/main/data_new.geojson';
var url_reg = 'https://raw.githubusercontent.com/tommasocalo/Dashboard/main/data_reg.geojson';

var vid = document.getElementById("myVideo");


var tp = d3.select("#tp");

vid.onended = function() {
  d3.select('#video-view').style('display', 'none');
  d3.select('#bibi').style('display', 'none');

};

tp.on('click', function () {  d3.select('#video-view').style('display', 'none');
d3.select('#bibi').style('display', 'none');
vid.pause();
});


// Media Vars
var media;
var isNarrow = window.matchMedia("(max-width: 620px)");
function changeMedia(x) {
  if (x.matches) {
    
    // Update media var.
    media = "mobile";
    
    // Hide sliders from story mode ONLY.
    if (currentMode == "stats") {
      d3.select("#controls").style("bottom", "140px");
    } else {
      d3.select("#controls").style("bottom", "30px");
    }

  } else {
    media = "full";
    d3.select("#controls").style("display", "block");
  };
};
changeMedia(isNarrow); // Call listener function at run time
isNarrow.addListener(changeMedia); // Attach listener function on state changes

// CB Controls vars
var cb1 = d3.select("#cb1");
var cb2 = d3.select("#cb2");
var cb3 = d3.select("#cb3");
var cb4 = d3.select("#cb4");
var cb5 = d3.select("#cb5");
var cb6 = d3.select("#cb6");
var cb7 = d3.select("#cb7");
var cb8 = d3.select("#cb8");
var cb9 = d3.select("#cb9");
var cb10 = d3.select("#cb10");
var cb11 = d3.select("#cb11");
var cb12 = d3.select("#cb12");
var cb13 = d3.select("#cb13");
var cb14 = d3.select("#cb14");
var cb15 = d3.select("#cb15");
var cb16 = d3.select("#cb16");
var cb17 = d3.select("#cb17");
var cb18 = d3.select("#cb18");
var cb19 = d3.select("#cb19");
var cb20 = d3.select("#cb20");

var abs = d3.select("#switch");
abs.property("checked", false);
d3.select('#tg').style("display", "none")


var cbn = d3.selectAll(".cbn");

// Slider vars
var interval;
var sliding;
var value = 0;

// Info Panel vars
var info = d3.select("#info");
var infoGraph = d3.select("#info-popgraph");
var nta_clicked = false;

// Story panel vars
var story = d3.select("#storymode");

// Map vars
var start_viz = {
  // zoom: 4.95,
  center: [14,42],
  bearing: -2.35,
  pitch: 0.00,
  speed: 0.3
};

var start_viz_mobile = {
  center: [14,42],
  zoom: 0,
  bearing: -20,
  pitch: 45.00,
  speed: 0.1
};

var start_stats = {
  zoom: 4.95,
  center: [14,42],
  bearing: -2.35,
  pitch: 0.00,
  speed: 0.3
};

var start_stats_mobile = {
  zoom: 0,
  center: [14,42],
  bearing: -2.35,
  pitch: 0.00,
  speed: 0.3
};

var start_story = {
  zoom: 4.95,
  center: [14,42],
  bearing: -2.35,
  pitch: 60.0
};

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/tommasocalo/ckklejaw03aij17ryhtkbfyf8",
  center: start_story.center,
  zoom: start_story.zoom,
  minZoom: 5,
  bearing: start_story.bearing,
  pitch: start_story.pitch
});


// Helper Functions
function timeFormatter(t) {
  var dt;
  if(t == 0) dt = '2015';
  if(t == 1) dt = '2016';
  if(t == 2) dt = '2017';
  return dt;
}

function dataFormatter(d) {
  var dt;
  if(d == 0) dt = 'CNS';
  if(d == 1) dt = 'CNSr';

  if(d == 2) dt = 'PM2.5';
  return dt;
}


// About Module Callbacks
d3.select("#about-map-button").on("click", function() {
  d3.select("#about").style("display", "none");});

d3.select("#about-close").on("click", function() {
  d3.select("#about").style("display", "none");});

d3.select("#about").on("click", function() {
  d3.select("#about").style("display", "none");});

d3.select("#about-link").on("click", function() {
  d3.select("#about").style("display", "block");
});


// Legend Display callbacks
d3.select("#legend-mobile").on("click", function() {
  
  if (currentMode == "story" || currentMode == "viz") {
    if (d3.select("#legend").style("display") == "none")
      d3.select("#legend").style("display", "block")
    else
      d3.select("#legend").style("display", "none")
  }
  if (currentMode == "story" || currentMode == "stat") {
    d3.select('#tg').style("display", "none")

  }
  if (currentMode == "stats") {
    if (d3.select("#statslegend").style("display") == "none")
      d3.select("#statslegend").style("display", "block")
    else
      d3.select("#statslegend").style("display", "none")
  }
});


// Build sliders and set callbacks.

var slideTimeCallback = function(evt, value) {
                                    stime = value;
                                    
                                    d3.select("#handle-one-t")
                                       .html(timeFormatter(value));
                                    
                                    if(!sliding) {
                                      sliding = true;
                                      interval = setInterval(function () {
                                                              changeTime({day: sday, time: stime});
                                                              clearInterval(interval);
                                                              sliding = false;
                                                             }, 500);
                                    } 
                                  };

var slideendTimeCallback = function(evt, value) {
  
                                      sliding = false;
                                      clearInterval(interval);
                                      changeTime({day: sday, time: stime});
                                     };

var slideDataCallback = function(evt, value) {
                                      sday = value;
                                      
                                      d3.select("#handle-one-b")
                                        .html(dataFormatter(value));
                                      
                                      if(!sliding) {
                                        sliding = true;
                                        interval = setInterval(function () {
                                                                changeTime({day: sday, time: stime});
                                                                clearInterval(interval);
                                                                sliding = false;
                                                               }, 500);
  
                                      }
                                    };
  

var slideendDataCallback = function(evt, value) {

                                      sliding = false;
                                      clearInterval(interval);
                                      changeTime({day: sday, time: stime});
                                     };

var sliderTime = d3.slider().min(0).max(2).step(1).id('t')
                     .on("slide", slideTimeCallback)
                     .on("slideend", slideendTimeCallback);

var sliderData = d3.slider().min(0).max(2).step(1).id('b')
                     .on("slide", slideDataCallback)
                     .on("slideend", slideendDataCallback);
function getSliders() {

  // TIME
  d3.select('#slider-t').call(sliderTime);
  d3.select('#slider-b').call(sliderData);


  // Init Slider text.

  d3.select("#handle-one-t").text('2015');
  d3.select("#handle-one-b").text('CNS');

}

// Change data by time.
function changeTime(settings) {
  deaths = ["2015_abs","2016_abs","2017_abs"]
  poll = ["PM2.5_2015","PM2.5_2016","PM2.5_2017"]


  rel = ["2015_rel","2016_rel","2017_rel"]
  time = (settings.time) ? settings.time : 0;
  day = (settings.day) ? settings.day : 0;



  if(map) {

    // VIZ

      if (day == 0){
        d3.select("#legend-content").style("display",  "block");
        d3.select("#legend-rel").style("display",  "none");
        d3.select("#legend-pm").style("display",  "none");

        map.setLayoutProperty("total", "visibility", "visible");
        map.setLayoutProperty("rel", "visibility", "none");

        map.setLayoutProperty("pol", "visibility", "none");

        map.setPaintProperty("total",
                            "fill-extrusion-height",
                            ["*", ["get", deaths[settings.time]], 20]);

        map.setPaintProperty("total",
                              "fill-extrusion-color",
                              {"base": 1,
                              "type": "interval",
                              "property": deaths[settings.time],
                              "stops": [[0, "#808080"],
                                          [1, "#fff7ec"],
                                        [10, "#fdd49e"],
                                        [20, "#fee8c8"],
                                        [40, "#fdbb84"],
                                        [80, "#fc8d59"],
                                        [160, "#ef6548"],
                                        [320, "#d7301f"],
                                        [640, "#b30000"],
                                        [1280, "#7f0000"]],
                              "default": "#800026"});}
      if (day == 2){
        d3.select("#legend-content").style("display",  "none");
        d3.select("#legend-rel").style("display",  "none");
        d3.select("#legend-pm").style("display",  "block");

        map.setLayoutProperty("pol", "visibility", "visible");
        map.setLayoutProperty("rel", "visibility", "none");

        map.setLayoutProperty("total", "visibility", "none");
        map.setPaintProperty("pol",
                            "fill-extrusion-height",
                            ["*", ["get", poll[settings.time]], 500]);

        map.setPaintProperty("pol",
                              "fill-extrusion-color",
                              {"base": 1,
                              "type": "interval",
                              "property": poll[settings.time],
                              "stops": [[0, "#808080"],
                                        [1, "#fff7ec"],
                                        [4, "#fdd49e"],
                                        [8, "#fee8c8"],
                                        [12, "#fdbb84"],
                                        [16, "#fc8d59"],
                                        [20, "#ef6548"],
                                        [24, "#d7301f"],
                                        [28, "#b30000"],
                                        [32, "#7f0000"]],
                              "default": "#800026"});}
          

      if (day==1){
        d3.select("#legend-content").style("display",  "none");
        d3.select("#legend-rel").style("display",  "block");
        d3.select("#legend-pm").style("display",  "none");

        map.setLayoutProperty("pol", "visibility", "none");
        map.setLayoutProperty("rel", "visibility", "visible");

        map.setLayoutProperty("total", "visibility", "none");
      map.setPaintProperty("rel",
                           "fill-extrusion-height",
                           ["*", ["get", rel[settings.time]], 2000]);
  
      map.setPaintProperty("rel",
                            "fill-extrusion-color",
                            {"base": 1,
                             "type": "interval",
                             "property": rel[settings.time],
                             "stops": [[0, "#808080"],
                                        [1, "#fff7ec"],
                                       [1.5, "#fdd49e"],
                                       [2, "#fee8c8"],
                                       [3, "#fdbb84"],
                                       [4, "#fc8d59"],
                                       [5, "#ef6548"],
                                       [6, "#d7301f"],
                                       [7, "#b30000"],
                                       [8, "#7f0000"]],
                             "default": "#800026"});}

    // STATS
     map.setPaintProperty("stats-highlighted",
                         "fill-color",
                         {"base": 0,
                          "type": "interval",
                          "property": 'corr',
                          "stops": [[-0.8, "#1a9850"],
                          [-0.6, "#66bd63"],
                          [-0.4, "#a6d96a"],
                          [-0.2, "#d9ef8b"],
                          [0, "#ffffbf"],
                          [0.2, "#fee08b"],
                          [0.6, "#fdae61"],
                          [0.8, "#f46d43"],
                          [0.9, "#d73027"]]});

     map.setPaintProperty("stats-dimmed",
                         "fill-color",
                          {"base": 0,
                           "type": "interval",
                           "property": 'corr',
                           "stops": [[-0.8, "#1a9850"],
                           [-0.6, "#66bd63"],
                           [-0.4, "#a6d96a"],
                           [-0.2, "#d9ef8b"],
                           [0, "#ffffbf"],
                           [0.2, "#fee08b"],
                           [0.6, "#fdae61"],
                           [0.8, "#f46d43"],
                           [0.9, "#d73027"]]});

    if (nta_clicked) 
      updateInfo(infoGraph, neighborhood);
    else
      updateInfo(infoGraph, "00");
  }
}

// Change the map mode.
function changeMode(settings) {

  // Control Legends.
  d3.select("#legend-content").style("display", (settings.id == "viz" || settings.id == "story") ? "block": "none");
  d3.select("#cbs-content").style("display", (settings.id == "viz" || settings.id == "story") ? "block": "none");
  d3.select("#statslegend-content").style("display", (settings.id == "viz" || settings.id == "story") ? "none": "block");

  // Control Sliders.
  if (media == "mobile" && settings.id == "story")
    d3.select("#controls").style("display", "none");
  else
    d3.select("#controls").style("display", "block");

  if (media == "mobile" && settings.id == "stats")
    d3.select("#controls").style("bottom", "140px");
  else
    d3.select("#controls").style("bottom", "30px");

  // Header button attrs.
  vizControl.attr("class", (settings.id == "viz") ? "mode-selected" : "mode");
  statsControl.attr("class", (settings.id == "stats") ? "mode-selected" : "mode");
  storyControl.attr("class", (settings.id == "story") ? "mode-selected" : "mode");

  // Change the map to STATS mode.
  if (settings.id == "stats") {
    d3.select("#controls").style("display", "none");

    map.setLayoutProperty("rel", "visibility", "none");
    map.setLayoutProperty("pol", "visibility", "none");

    d3.select('#tg').style("display", "none")

    // Change map view settings.
    if (media == "full") {
      map.flyTo(start_stats);
    } else {
      map.flyTo(start_stats_mobile);
    };

    // Turn on STATS overlays and turn of VIZ overlays.
    map.setLayoutProperty("stats-dimmed", "visibility", "visible");
    map.setLayoutProperty("stats-highlighted", "visibility", "visible");
    map.setLayoutProperty("total", "visibility", "none");

    // Turn on the info panel.
    info.style("display", "block");

    // Turn off Story panel.
    story.style("display", "none");

    // Set the Info Panel to the default.
    updateInfo(infoGraph, "00");
  }

  // Change the map to VIZ mode.
  if (settings.id == "viz") {
    story.style("display", "none");
    map.setLayoutProperty("total", "visibility", "visible");
    map.setLayoutProperty("rel", "visibility", "none");
    map.setLayoutProperty("pol", "visibility", "none");
    map.setLayoutProperty("stats-dimmed", "visibility", "none");
    map.setLayoutProperty("stats-highlighted", "visibility", "none");
    info.style("display", "none");


    // Change the map view settings.
    if (media == "full") map.flyTo(start_viz);
    else map.flyTo(start_viz_mobile);

    // Reset filters.
    d3.select("#cb1").property("checked", true);
    d3.select("#cb2").property("checked", true);
    d3.select("#cb3").property("checked", true);
    d3.select("#cb4").property("checked", true);
    d3.select("#cb5").property("checked", true);
    d3.select("#cb6").property("checked", true);
    d3.select("#cb7").property("checked", true);
    d3.select("#cb8").property("checked", true);
    d3.select("#cb9").property("checked", true);
    d3.select("#cb10").property("checked", true);
    d3.select("#cb11").property("checked", true);
    d3.select("#cb12").property("checked", true);
    d3.select("#cb13").property("checked", true);
    d3.select("#cb14").property("checked", true);
    d3.select("#cb15").property("checked", true);
    d3.select("#cb16").property("checked", true);
    d3.select("#cb17").property("checked", true);
    d3.select("#cb18").property("checked", true);
    d3.select("#cb19").property("checked", true);
    d3.select("#cb20").property("checked", true);

    // Update map.
    map.setFilter('total', ['in', "reg_istat_code_num", 1, 2, 3, 4, 5,
                          6, 7, 8, 9, 10, 11,12,13,14,15,16,17,18,19,20]);
                          
    map.setFilter('rel', ['in', "reg_istat_code_num", 1, 2, 3, 4, 5,
                          6, 7, 8, 9, 10, 11,12,13,14,15,16,17,18,19,20]);

    map.setFilter('pol', ['in', "reg_istat_code_num", 1, 2, 3, 4, 5,
                          6, 7, 8, 9, 10, 11,12,13,14,15,16,17,18,19,20]);

    // Reset the time.
    changeTime({day:0 , time: 0});
    slideTimeCallback(d3.event, 0);
    slideendTimeCallback(d3.event, 0);
    sliderTime.value(0);
    slideDataCallback(d3.event, 0);
    slideendDataCallback(d3.event, 0);
    sliderData.value(0);


    // Turn on VIZ overlays and turn off STATS overlays.
    map.setLayoutProperty("stats-dimmed", "visibility", "none");
    map.setLayoutProperty("stats-highlighted", "visibility", "none");

    // Turn off info panel.
    info.style("display", "none");

    // Turn off Story panel.

  }

  // Change the map to STORY mode.
  if (settings.id == "story") {
    map.setLayoutProperty("total", "visibility", "visible");
    map.setLayoutProperty("rel", "visibility", "none");
    map.setLayoutProperty("pol", "visibility", "none");

    d3.select('#tg').style("display", "none")

    // Change map view settings.
    map.flyTo(start_story);

    // Turn on VIZ overlays and turn off STATS overlays.
    map.setLayoutProperty("stats-dimmed", "visibility", "none");
    map.setLayoutProperty("stats-highlighted", "visibility", "none");

    // Turn on the story panel.
    story.style("display", "block");

    // Turn off info panel.
    info.style("display", "none");

    // Start at the beginning.
    pageNum = 1;
    pageNumbers.text(pageNum + " of " + stories.length);
    backButton.style( "visibility", (pageNum == 1) ? "hidden" : "visible" );
    forwardButton.style( "visibility", (pageNum == stories.length) ? "hidden" : "visible" );
    updateStory(stories[pageNum-1]);
  }

  currentMode = settings.id;
}

// Define map behavior and callback functions.
map.on("load", function(e) {
  
  // Add Source.
  map.addSource("data", {
    type: "geojson",
    data: url
  });

  map.addSource("data_reg", {
    type: "geojson",
    data: url_reg
  });
  
  // Add VIZ layer.


  map.addLayer({
    "id": "total",
    'type': 'fill-extrusion',
    'paint': {
    "fill-extrusion-opacity": 0.8,
    "fill-extrusion-height-transition": {duration: 500, delay: 0},
    'fill-extrusion-height': ["*", ["get", "2015_abs"], 35],
      
    "fill-extrusion-height-transition": {duration: 500,
                                                               delay: 0},
    'fill-extrusion-color':                     {"base": 1,
                                                  "type": "interval",
                                                   "property": "2015_abs",
                                                   "default": "#800026",
                                                   "stops": [[0, "#808080"],
                                                   [1, "#fff7ec"],
                                                             [10, "#fdd49e"],
                                                             [20, "#fee8c8"],
                                                             [40, "#fdbb84"],
                                                             [80, "#fc8d59"],
                                                             [160, "#ef6548"],
                                                             [320, "#d7301f"],
                                                             [640, "#b30000"],
                                                             [1280, "#7f0000"]]}
    },
    "source": "data"
  });

  map.addLayer({
    "id": "rel",
    'type': 'fill-extrusion',
    'paint': {
    "fill-extrusion-opacity": 0.8,
    "fill-extrusion-height-transition": {duration: 500, delay: 0},
    'fill-extrusion-height': ["*", ["get", "2015_rel"], 2000],
      
    "fill-extrusion-height-transition": {duration: 500,
                                                               delay: 0},
    'fill-extrusion-color':                     {"base": 1,
                                                  "type": "interval",
                                                   "property": "2015_rel",
                                                   "default": "#800026",
                                                   "stops": [[0, "#808080"],
                                                             [1, "#fff7ec"],
                                                             [2, "#fdd49e"],
                                                             [3, "#fee8c8"],
                                                             [4, "#fdbb84"],
                                                             [5, "#fc8d59"],
                                                             [6, "#ef6548"],
                                                             [7, "#d7301f"],
                                                             [8, "#b30000"],
                                                             [9, "#7f0000"]]}
    },
    "source": "data"
  });
  map.addLayer({
    "id": "pol",
    'type': 'fill-extrusion',
    'paint': {
      
    "fill-extrusion-opacity": 0.8,
    "fill-extrusion-height-transition": {duration: 500, delay: 0},
    'fill-extrusion-height': ["*", ["get", "PM2.5_2015"], 350],
      
    "fill-extrusion-height-transition": {duration: 500,
                                                               delay: 0},
    'fill-extrusion-color':                     {"base": 1,
                                                  "type": "interval",
                                                   "property": "PM2.5_2015",
                                                   "default": "#800026",
                                                   "stops": [[0, "#808080"],
                                                   [4, "#fff7ec"],
                                                   [8, "#fdd49e"],
                                                   [12, "#fee8c8"],
                                                   [16, "#fdbb84"],
                                                   [20, "#fc8d59"],
                                                   [24, "#ef6548"],
                                                   [28, "#d7301f"],
                                                   [32, "#b30000"],
                                                   [36, "#7f0000"]]}
    },
    "source": "data"
  });
  // Stats

  // Add DATA HIGHLIGHTED layer.
  map.addLayer({"id": "stats-highlighted",
                "type": "fill",
                "source": "data_reg",
                "filter" : ["in", "reg_istat_code", ""],
                "paint": {"fill-opacity": 0.85,
                          "fill-color": {"base": 0,
                                         "type": "interval",
                                         "property": "corr",
                                         "stops": [[-0.8, "#1a9850"],
                                         [-0.6, "#66bd63"],
                                         [-0.4, "#a6d96a"],
                                         [-0.2, "#d9ef8b"],
                                         [0, "#ffffbf"],
                                         [0.2, "#fee08b"],
                                         [0.6, "#fdae61"],
                                         [0.8, "#f46d43"],
                                         [0.9, "#d73027"]]}}}
                );

  // Add DATA DIMMED layer.
  map.addLayer({"id": "stats-dimmed",
                "type": "fill",
                "source": "data_reg",
                "paint": {"fill-opacity": 0.30,
                          "fill-color": {"base": 0,
                                         "type": "interval",
                                         "property": "corr",
                                         "stops": [[-0.8, "#1a9850"],
                                         [-0.6, "#66bd63"],
                                         [-0.4, "#a6d96a"],
                                         [-0.2, "#d9ef8b"],
                                         [0, "#ffffbf"],
                                         [0.2, "#fee08b"],
                                         [0.6, "#fdae61"],
                                         [0.8, "#f46d43"],
                                         [0.9, "#d73027"]]}}}
                );

  // Draw sliders.
  getSliders();


  abs.on("change", function() { 

    if (abs.property("checked")){
      map.setLayoutProperty("rel", "visibility", "visible");
      map.setLayoutProperty("total", "visibility", "none");

    } else {
      map.setLayoutProperty("rel", "visibility", "none");
      map.setLayoutProperty("total", "visibility", "visible");

    }

  });


  // Visualization District filters.
  cbn.on("change", function() { 
    
    // Init a set of all districts.
    var filter = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);

    // Add and remove callbacks.
    (cb1.property("checked")) ? filter.add(1) : filter.delete(1);
    (cb2.property("checked")) ? filter.add(2) : filter.delete(2);
    (cb3.property("checked")) ? filter.add(3) : filter.delete(3);
    (cb4.property("checked")) ? filter.add(4) : filter.delete(4);
    (cb5.property("checked")) ? filter.add(5) : filter.delete(5);
    (cb6.property("checked")) ? filter.add(6) : filter.delete(6);
    (cb7.property("checked")) ? filter.add(7) : filter.delete(7);
    (cb8.property("checked")) ? filter.add(8) : filter.delete(8);
    (cb9.property("checked")) ? filter.add(9) : filter.delete(9);
    (cb10.property("checked")) ? filter.add(10) : filter.delete(10);
    (cb11.property("checked")) ? filter.add(11) : filter.delete(11);
    (cb12.property("checked")) ? filter.add(12) : filter.delete(12);
    (cb13.property("checked")) ? filter.add(13) : filter.delete(13);
    (cb14.property("checked")) ? filter.add(14) : filter.delete(14);
    (cb15.property("checked")) ? filter.add(15) : filter.delete(15);
    (cb16.property("checked")) ? filter.add(16) : filter.delete(16);
    (cb17.property("checked")) ? filter.add(17) : filter.delete(17);
    (cb18.property("checked")) ? filter.add(18) : filter.delete(18);
    (cb19.property("checked")) ? filter.add(19) : filter.delete(19);
    (cb20.property("checked")) ? filter.add(20) : filter.delete(20);

    // Set the filter based on the set.
    map.setFilter('total', ['in', "reg_istat_code_num"].concat(Array.from(filter)));
    map.setFilter('rel', ['in', "reg_istat_code_num"].concat(Array.from(filter)));
    map.setFilter('pol', ['in', "reg_istat_code_num"].concat(Array.from(filter)));

  });
  

  // Modes control.
  vizControl.on('click', function () {changeMode({id: 'viz'});});
  statsControl.on('click', function () {changeMode({id: 'stats'});});
  storyControl.on('click', function () {changeMode({id: 'story'});});

/*   var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
    });

  map.on('mousemove', 'total', function (e) {
    popup.setLngLat(e.lngLat)
    .setHTML(e.features[0].properties.prov_name)
    .addTo(map);
    });


  map.on('mouseleave', 'total', function () {
      map.getCanvas().style.cursor = '';
      popup.remove();
      });
 */
  // Callback for STATS overlay mouse movement (on).
  map.on('mousemove', 'stats-dimmed', function(e) {
    
    // Interactive Cursor.
    map.getCanvas().style.cursor = 'pointer';

    // If there is no map focus...
    if (!nta_clicked) {
      
      // Single out the first found feature.
      var feature = e.features[0];

      // Get the feature's neighborhood (NTA).
      neighborhood = feature.properties.reg_istat_code;

      // Filter map overlay for the NTA.
      map.setFilter('stats-highlighted', ['in', 'reg_istat_code', neighborhood]);

      // Update the info panel.
      updateInfo(infoGraph, neighborhood);
    }
  });

  // Callback for STATS overlay mouse movement (leave).
  map.on('mouseleave', 'stats-dimmed', function(e) {

    // Change the cursor style again.
    map.getCanvas().style.cursor = '';

    // If not map focus...
    if (!nta_clicked) {
      
      // Clear Filters.
      map.setFilter('stats-highlighted', ['in', 'reg_istat_code', '']);
      map.setFilter('stats-dimmed', null);

      // Update info panel with Manhattan data.
      updateInfo(infoGraph, "00");
    }
  });

  // Callback for STATS overlay mouse click.
  map.on('click', function(e) {

    if (currentMode == "stats") {
      // Expand map query bounding box.
      var bbox = [[(e.point.x-5), (e.point.y-5)], 
                  [(e.point.x+5), (e.point.y+5)]];

      // Search for feature in both highlighted and dimmed layers.
      var features = map.queryRenderedFeatures(bbox,
                                               {layers: ['stats-highlighted',
                                                         'stats-dimmed']});

      // If feature found...
      if (features.length) {
        
        // Map overlay focus.
        nta_clicked = true;

        // Turn hightlighted map feature.
        neighborhood = features[0].properties.reg_istat_code;
        map.setFilter('stats-highlighted', ['in', 'reg_istat_code', neighborhood]);

        // Center map view on feature.
        map.flyTo({
          center: e.lngLat,
          zoom: 6.5,
          bearing: -20.5,
          pitch: 0.00,
          speed: 0.3
        });

        // Update panel.
        updateInfo(infoGraph, neighborhood);


      } else { // No feature found.
        
        // Clear focus, clear feature.
        nta_clicked = false;
        map.setFilter('stats-highlighted', ['in', 'reg_istat_code', '']);

        // Re-center map.
        if (media == "full")
          map.flyTo(start_stats);
        else
          map.flyTo(start_stats_mobile);

        // Update info panel with Manhattan data.
        updateInfo(infoGraph, "00");
      }
    }
  });

  // Initialize app mode.
  if (media == "full") changeMode({id: 'story'});
  if (media == "mobile") changeMode({id: 'story'});

  // Initialize Story to page one.
  //pageNumbers.text(pageNum + " of " + stories.length);
  //backButton.style( "visibility", (pageNum == 1) ? "hidden" : "visible" );
  //forwardButton.style( "visibility", (pageNum == stories.length) ? "hidden" : "visible" );
  //updateStory(stories[pageNum-1]);

});

// Set default map cursor to a hand.
map.getCanvas().style.cursor = "default";

