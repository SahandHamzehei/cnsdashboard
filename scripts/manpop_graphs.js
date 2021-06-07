// VARIABLES
var data = [];
var offsetX = 30;
var offsetY = 15;
var height = 80;
var step = 10;
var bottomY = 2000000;
var topY = 4000000;
var x = d3.scale.linear()
.range([0, 230])
.domain([0, 30])

var xAxis = d3.svg.axis()
              .scale(x)
              .ticks(3);
var yAvailability;
var yAxisAvailabilityR;
var yAxisAvailabilityL;


var infoHeader = d3.select("#info-header");
var infoContentGraph = d3.select("#info-content-graphs");



// HELPER FUNCTION: Adds commas for thousands place.
const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

function ntaFormatter(nta) {
  var nta_long;
  if (nta == "00") nta_long = "Italy";
  if (nta == "01") nta_long = "Piemonte";
  if (nta == "02") nta_long = "Valle d'Aosta";
  if (nta == "03") nta_long = "Lombardia";
  if (nta == "04") nta_long = "Trentino-Alto Adige";
  if (nta == "05") nta_long = "Veneto";
  if (nta == "06") nta_long = "Friuli-Venezia Giulia";
  if (nta == "07") nta_long = "Liguria";
  if (nta == "08") nta_long = "Emilia-Romagna";
  if (nta == "09") nta_long = "Toscana";
  if (nta == "10") nta_long = "Umbria";
  if (nta == "11") nta_long = "Marche";
  if (nta == "12") nta_long = "Lazio";
  if (nta == "13") nta_long = "Abruzzo";
  if (nta == "14") nta_long = "Molise";
  if (nta == "15") nta_long = "Campania";
  if (nta == "16") nta_long = "Puglia";
  if (nta == "17") nta_long = "Basilicata";
  if (nta == "18") nta_long = "Calabria";
  if (nta == "19") nta_long = "Sicilia";
  if (nta == "20") nta_long = "Sardegna";

  return nta_long;
}

// Bring in Manhattan data.
d3.csv('data/man.csv', function(file) {
  file.forEach(function(row) {




    // Push onto data.
    data['00'] = {
      id: 'italy',
      dea: row.dea,
      corr: row.corr,
      pt: []

    };
  });
});

// Bring in Neighborhood data.
d3.csv('data/absf.csv', function(file) {

  file.forEach(function(row) {



    // Push onto data.
    data[row.regions] = {
      id: row.regions,
      dea: row.dea,
      corr: row.corr,
      pt: []
      
    };

  });
});


// Bring in Total data.
d3.csv('data/abss.csv', function(file) {
      // Push onto data.
  file.forEach(function(row) {



    // Loop through the columns (datetimes).
    data['00'].pt.push([row.x,row.y]);


    // Push onto data.
  });
});

// Bring in Total data.
d3.csv('data/abss.csv', function(file) {
  // Push onto data.

file.forEach(function(row) {


// Loop through the columns (datetimes).
data[row.id].pt.push([row.x,row.y]);


// Push onto data.
});

console.log(data['02'])
});

// Update the Info panel graph.
function getPopulationGraph(container, ntaid) {

  day_long = ntaFormatter(ntaid)
  // Set the graph's title.
  container.text('');
  container.append("div")
           .text("CNS Relative deaths vs PM2.5 levels in " + day_long)
           .style("text-align", "center");

  // Init SVG container for the graph.
  var svg = container.append("svg").attr("width", offsetX*2 + step*23 + 10)
                                   .attr("height", height + offsetY*2 + 10);

  // Take the min and max for the whole week and make it the Y-axis range.
  var max = 10;
  var min = 0;


  // Set the D3 Y axis objects with the new range.
  yAvailability = d3.scale.linear()
                    .range([height, 0])
                    .domain([min, max]);

  yAxisAvailabilityR = d3.svg.axis()
                         .scale(yAvailability)
                         .ticks(3)
                         .tickFormat(d3.format("s"))
                         .orient("right");

  yAxisAvailabilityL = d3.svg.axis()
                         .scale(yAvailability)
                         .ticks(3)
                         .tickFormat(d3.format("s"))
                         .orient("left");

  if(data[ntaid]) {
    // Build the line and assign to div.
    svg.append("g")
    .selectAll("dot")
    .data(data[ntaid].pt)
    .enter()
    .append("circle")
    .attr("transform", "translate(" + offsetX + "," + offsetY + ")")

      .attr("cx", function (d) { return d[0]*230/34; } )
      .attr("cy", function (d) { return height-d[1]*height/10; } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")


    // Build the X axis.
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(" + offsetX + ", " + (offsetY + height) + ")")
       .call(xAxis);

    // Build the Y axis (left).
    svg.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate("+ offsetX + "," + offsetY + ")")
       .call(yAxisAvailabilityL);

    // Build the Y axis (right).
    svg.append("g")
       .attr("class", "y axis")
       .attr("transform", "translate("+ (offsetX + step*23) + "," + offsetY + ")")
       .call(yAxisAvailabilityR);

   
      
  }
}

// Update the Info panel.
function updateInfo(div, region) {

  // Get the population for the region and day.
  var dats = data[region];
  
  // Change Region name.
  infoHeader.text(ntaFormatter(region));

  // Update Population graph.
  getPopulationGraph(div, region);

  // Change Import/Export type.
  d3.select("#info-ntatype-caption")
    .text("Correlation coefficient :");
  d3.select("#info-ntatype-value").text(Math.round(dats.corr * 100) / 100);

  // Change Flux data.
  d3.select("#info-ntaflux-caption")
    .text(" Estimated CNS deaths for upcoming year: ");
  d3.select("#info-ntaflux-value")
    .text(dats.dea);
  
  //if (type == "Importer") d3.select("#info-ntaflux-value").style("color", "#66bd63");
  //if (type == "Exporter") d3.select("#info-ntaflux-value").style("color", "#f46d43");
  //if (type == "Balanced") d3.select("#info-ntaflux-value").style("color", "#ffffbf");

  // Change Current population.

}

