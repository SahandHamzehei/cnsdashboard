///////////// VARS ///////////////
var pageNum = 1;
var backButton = d3.select("#story-back");
var forwardButton = d3.select("#story-forward");
var pageNumbers = d3.select("#storymode-controls-numbers");
var storyHeader = d3.select("#storymode-header");
var storyContent = d3.select("#storymode-content p");

// STORIES //
var stories = [
  { title: "The Story of CNS disease and PM value in Italy.",
    description: "The visualizations of the dashboard try to show the connection between CNS disease and PM values in Italy. It is well known that dust has harmful effects that can lead to a variety of diseases. The majority of evidence on the connection between dust and health has focused on lung and cardiovascular diseases. The effects of air pollution on the central nervous system (CNS), on the other hand, are not well-founded. Each story talks about the summarization of the pollution or CNS for one or more regions to give useful data.",
    districts: [01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20],
    day: 0,
    time: 0,
    flyTo: {
      center: [12.5674,41.8719],
      zoom: 3.50,
      bearing: -20,
      pitch: 45.00,
      speed: 0.3,
    },
    flyToMobile: {
      center: [12.5674,41.8719],
      zoom: 0,
      bearing: -20,
      pitch: 45.00,
      speed: 0.1
    }
  },

// Story 2
  { title: "Min and max values of CNS.",
    description: "Regarding the dataset, Campania and Calabria are two countries with the lowest rate of CNS disease for all three years. On the other hand, the maximum value of the CNS disease is for Liguria for 2015 and 2016, and Marcas for 2017.",
    districts: [18,15,07,11],
    day: 0,
    time: 0,
    flyTo: {
      center: [12.5674,41.8719],
      zoom: 5.6,
      bearing: -20,
      pitch: 55.00,
      speed: 0.3
    },
    flyToMobile: {
      center: [12.5674,41.8719],
      zoom: 0,
      bearing: -20,
      pitch: 75.00,
      speed: 0.3
    }
  },

  // Story 3
  { title: "The most polluted and cleanest regions in Italy.",
  description: "From the dataset, it can be seen that during three years, Lombardia is the most polluted region in Italy (in the case of pm2.5) In 2017, it has the most pollution level. Regarding the research, The Lombardia region in northern Italy ranks among the most air polluted areas of Europe. By considering the min values of PM2.5, Valle d'Aosta is the region that for all three years has the min values.",
  districts: [03,02],
  day: 1,
  time: 2,
  flyTo: {
    center: [8.51,46.00],
    zoom: 6.50,
    bearing: -20,
    pitch: 65.00,
    speed: 0.3
  },
  flyToMobile: {
    center: [12.5674,41.8719],
    zoom: 5.0,
    bearing: -20,
    pitch: 45.00,
    speed: 0.3
    }
  },


  // Story 4
  { title: "Piemonte",
  description: "Piemonte is one of the primary regions in Italy. In the case of PM2.5 for all three years, it is the third polluted region in Italy. Also in 2017, piemonte experienced the most pollution",
  districts: [01],
  day: 1,
  time: 2,
  flyTo: {
    center: [7.51,45.05],
    zoom: 6.50,
    bearing: -20,
    pitch: 75.00,
    speed: 0.3
  },
  flyToMobile: {
    center: [12.5674,41.8719],
    zoom: 2,
    bearing: -20,
    pitch: 75.00,
    speed: 0.3
    }
  },

  // Story 5
  { title: "CNS in most polluted and cleanest",
  description: "As mentioned, Lombardia is the most polluted region in Italy. However among all regions, in the case of CNS disease, it is located in the mid of the table, 8th for 2015, 7th for 2016, and 10th for 2017 (from largest values to smallest). In contrast, the Valle d'Aosta is the cleanest city and in the case of CNS, it is located in 14th in 2015, 15th in 2016, and 9th in 2017.",
  districts: [03,02],
  day: 0,
  time: 0,
  flyTo: {
    center: [8.51,46.00],
    zoom: 6.50,
    bearing: -20,
    pitch: 75.00,
    speed: 0.3
  },
  flyToMobile: {
    center: [12.5674,41.8719],
    zoom: 1.50,
    bearing: -20,
    pitch: 45.00,
    speed: 0.3
    }
  },


 // Story 6
  { title: "Capital of Italy",
  description: "Rome, the capital of Italy is located in the Lacio region. During the three years, it has the constant values in the CNS. However, in 2015 it is the 7th polluted region in Italy. The point is that in 2017, the pollution decrease, and Lacio located in the mid of the table of PM2.5 value. It has the less pollution in 2016",
  districts: [12],
  day: 1,
  time: 1,
  flyTo: {
    center: [12.98,41.65],
    zoom: 6.50,
    bearing: -20,
    pitch: 75.00,
    speed: 0.3
  },
  flyToMobile: {
    center: [12.5674,41.8719],
    zoom: 0,
    bearing: -20,
    pitch: 75.00,
    peed: 0.3
    }
  },

 // Story 7
  { title: "Constancy during three years",
  description: "In the case of the constancy during three years in PM values, Veneto and Basilicata have the most stability in PM2.5. But on the other hand, Marche has the most fluctuation.",
  districts: [05,17,11],
  day: 1,
  time: 0,
  flyTo: {
    center: [12.5674,41.8719],
    zoom: 5.50,
    bearing: -20,
    pitch: 45.00,
    speed: 0.3
  },
  flyToMobile: {
    center: [12.5674,41.8719],
    zoom: 0,
    bearing: -20,
    pitch: 45.00,
    speed: 0.3
    }
  },
  
];



///////////// FUNCTIONS ///////////////

// Update Districts.
function updateStoryDistricts(districts) {

  // Update the sidebar filter.
  d3.select("#cb1").property("checked", (districts.indexOf(1) > -1) ? true : false);
  d3.select("#cb2").property("checked", (districts.indexOf(2) > -1) ? true : false);
  d3.select("#cb3").property("checked", (districts.indexOf(3) > -1) ? true : false);
  d3.select("#cb4").property("checked", (districts.indexOf(4) > -1) ? true : false);
  d3.select("#cb5").property("checked", (districts.indexOf(5) > -1) ? true : false);
  d3.select("#cb6").property("checked", (districts.indexOf(6) > -1) ? true : false);
  d3.select("#cb7").property("checked", (districts.indexOf(7) > -1) ? true : false);
  d3.select("#cb8").property("checked", (districts.indexOf(8) > -1) ? true : false);
  d3.select("#cb9").property("checked", (districts.indexOf(9) > -1) ? true : false);
  d3.select("#cb10").property("checked", (districts.indexOf(10) > -1) ? true : false);
  d3.select("#cb11").property("checked", (districts.indexOf(11) > -1) ? true : false);
  d3.select("#cb12").property("checked", (districts.indexOf(12) > -1) ? true : false);
  d3.select("#cb13").property("checked", (districts.indexOf(13) > -1) ? true : false);
  d3.select("#cb14").property("checked", (districts.indexOf(14) > -1) ? true : false);
  d3.select("#cb15").property("checked", (districts.indexOf(15) > -1) ? true : false);
  d3.select("#cb16").property("checked", (districts.indexOf(16) > -1) ? true : false);
  d3.select("#cb17").property("checked", (districts.indexOf(17) > -1) ? true : false);
  d3.select("#cb18").property("checked", (districts.indexOf(18) > -1) ? true : false);
  d3.select("#cb19").property("checked", (districts.indexOf(19) > -1) ? true : false);
  d3.select("#cb20").property("checked", (districts.indexOf(20) > -1) ? true : false);









  // Update the map.
  if (map)
    map.setFilter('total', ['in', 'reg_istat_code_num'].concat(districts));
    map.setFilter('pol', ['in', 'reg_istat_code_num'].concat(districts));
    map.setFilter('rel', ['in', 'reg_istat_code_num'].concat(districts));

};

// Update Daytime.
function updateStoryDaytime(day, time){

  var daytime = (day*24 + time).toString();

  // Update the slider.
  slideTimeCallback(d3.event, time);
  slideendTimeCallback(d3.event, time);
  sliderTime.value(time);

  slideDataCallback(d3.event, day);
  slideendDataCallback(d3.event, day);
  sliderData.value(day);

};

// Update Story.
function updateStory(storyObj) {
  
  // Story vars.
  var title = storyObj['title'];
  var description = storyObj['description'];
  var districts = storyObj['districts'];
  var day = storyObj['day'];
  var time = storyObj['time'];
  if (media == "full")
    var cameraSettings = storyObj['flyTo'];
  else
    var cameraSettings = storyObj['flyToMobile'];

  // Update the Storymode content.
  storyHeader.text(title);
  storyContent.text(description);

  // Update the District filters.
  updateStoryDistricts(districts);

  // Update the daytime.
  updateStoryDaytime(day, time);

  // Update Camera.
  map.flyTo(cameraSettings);
};


///////////// CALLBACKS ///////////////

// Story mode click through FORWARD.
backButton.on("click", function () {
  
  // Update the Navigation bottom panel.
  pageNum = pageNum - 1;
  pageNumbers.text(pageNum + " of " + stories.length);
  backButton.style( "visibility", (pageNum == 1) ? "hidden" : "visible" );
  forwardButton.style( "visibility", (pageNum == stories.length) ? "hidden" : "visible" );

  // Update the story.
  updateStory(stories[pageNum-1]);
});

// Story mode click through BACKWARD.
forwardButton.on("click", function () {
  
  // Update the Navigation bottom panel.
  pageNum = pageNum + 1;
  pageNumbers.text(pageNum + " of " + stories.length);
  backButton.style( "visibility", (pageNum == 1) ? "hidden" : "visible" );
  forwardButton.style( "visibility", (pageNum == stories.length) ? "hidden" : "visible" );

  // Update the story.
  updateStory(stories[pageNum-1]);
});
