var imgHeight = 75;
var imgWidth = 50;
const LINE_CONST = "_line_";
var sz = 0;
var scatterChart;

$(function() {
  $("#axis .val").click(function() {
    $("#axis button").removeClass("selected");
    graphMode = $(this).text().toLowerCase();
    console.log(graphMode + " " + graphType);
    loadChart();
    $(this).addClass("selected");
  });

  $(".type-dropdown").click(function() {
    graphType = $(this).text().toLowerCase();
    console.log(graphMode + " " + graphType);
    loadChart();
  });
});

$(window).resize(function() {
  var old = sz;
  var width = document.documentElement.clientWidth;
  if (width < 400) {
    imgHeight = 30;
    imgWidth = 20;
    sz = 0;
  } else if (width < 576) {
    imgHeight = 30;
    imgWidth = 20;
    sz = 1;
  } else if (width < 900) {
    imgHeight = 50;
    imgWidth = 33;
    sz = 2;
  } else if (width < 1200) {
    imgHeight = 75;
    imgWidth = 50;
    sz = 3;
  } else {
    imgHeight = 75;
    imgWidth = 50;
    sz = 4;
  }
  if (old != sz) {
    loadChart();
  }
}).resize()

const graphModes = {
  TOTAL: "total",
  DISTANCE: "distance",
  ELEVATION: "elevation"
}

const graphTypes = {
  PERCENT: "percent",
  ACTUAL: "actual"
}

var graphMode = graphModes.TOTAL;
var graphType = graphTypes.PERCENT;

function avatarData(runner) {
  switch (graphType) {
    case graphTypes.PERCENT:
      switch (graphMode) {
        case graphModes.TOTAL:
          return [{
            x: runner.progress.distance,
            y: runner.progress.elevation
          }];
          break;
        case graphModes.DISTANCE:
          return [{
            x: dayOfChallenge - 1,
            y: runner.progress.distance
          }];
          break;
        case graphModes.ELEVATION:
          return [{
            x: dayOfChallenge - 1,
            y: runner.progress.elevation
          }];
          break;
      }
      break;
    case graphTypes.ACTUAL:
      switch (graphMode) {
        case graphModes.TOTAL:
          return [{
            x: runner.actual.distance,
            y: runner.actual.elevation
          }];
          break;
        case graphModes.DISTANCE:
          return [{
            x: dayOfChallenge - 1,
            y: runner.actual.distance
          }];
          break;
        case graphModes.ELEVATION:
          return [{
            x: dayOfChallenge - 1,
            y: runner.actual.elevation
          }];
          break;
      }
      break;
  }
}

function avatarDataset(runner) {
  return {
    label: runner.name,
    data: avatarData(runner),
    backgroundColor: runner.color,
    radius: 20,
    hoverRadius: 20,
    pointStyle: imgMe(runner.icon),
    order: 1,
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function plotData(runner) {
  var data = []
  data.push(new Point(0, 0));

  switch (graphType) {
    case graphTypes.PERCENT:
      switch (graphMode) {
        case graphModes.TOTAL:
          for (i = 0; i < dayOfChallenge; i++) {
            data.push(new Point(runner.distances[i], runner.elevations[i]));
          }
          break;
        case graphModes.DISTANCE:
          for (i = 0; i < dayOfChallenge; i++) {
            data.push(new Point(i, runner.distances[i]));
          }
          break;
        case graphModes.ELEVATION:
          for (i = 0; i < dayOfChallenge; i++) {
            data.push(new Point(i, runner.elevations[i]));
          }
          break;
      }
      break;
    case graphTypes.ACTUAL:
      switch (graphMode) {
        case graphModes.TOTAL:
          for (i = 0; i < dayOfChallenge; i++) {
            data.push(new Point(runner.distances[i] * runner.target.distance / 100, runner.elevations[i] * runner.target.elevation / 100));
          }
          break;
        case graphModes.DISTANCE:
          for (i = 0; i < dayOfChallenge; i++) {
            data.push(new Point(i, runner.distances[i] * runner.target.distance / 100));
          }
          break;
        case graphModes.ELEVATION:
          for (i = 0; i < dayOfChallenge; i++) {
            data.push(new Point(i, runner.elevations[i] * runner.target.elevation / 100));
          }
          break;
      }
      break;
  }
  return data;
}

function plotDataset(runner) {
  return {
    label: LINE_CONST + runner.name,
    data: plotData(runner),
    borderColor: runner.color,
    pointBackgroundColor: "white",
    radius: 2,
    order: 10,
    hoverRadius: 2,
    spanGaps: true,
    fill: false,
    type: "line"
  }
}

function findTTI(tti) {
  if (Array.isArray(tti)) {
    // line plot
    return tti[0];
  } else {
    // scatter plot
    return tti;
  }
}

function toolTipCallbacks() {
  var multiple = false;
  return {
    beforeTitle: function(tooltipItem, data) {
      multiple = false;
    },
    title: function(tooltipItem, data) {
      try {
        if (tooltipItem.length > 1) {
          multiple = true;
          return (((tooltipItem[0].xLabel + tooltipItem[0].yLabel) / 2) || 0).toFixed() + "%";
        } else {
          var tti = findTTI(tooltipItem);
          var dat = data.datasets[tti.datasetIndex];
          if (dat.hasOwnProperty("label")) {
            var name = dat.label.trim();
            if (!name.startsWith(LINE_CONST)) {
              return name;
            }
          }
        }
      } catch (e) {}
    },
    label: function(tooltipItem, data) {
      try {
        var tti = findTTI(tooltipItem);
        var dat = data.datasets[tti.datasetIndex];
        var name = dat.label.trim();

        if (name.startsWith(LINE_CONST)) {
          if (multiple) {
            return;
          } else {
            return " April " + tooltipItem.index;
          }
        } else {
          if (multiple) {
            return " " + name.replace(LINE_CONST, "");
          } else {
            return toolTipMariner(name);
          }
        }
      } catch (e) {
        console.log(e);
      }
      return name;
    },
    afterBody: function(tooltipItem, data) {
      try {
        var msg = [];
        var tti = findTTI(tooltipItem);
        if (Array.isArray(tooltipItem) && tooltipItem.length == 1) {
          var dat = data.datasets[tti.datasetIndex];
          var name = dat.label.trim();
          if (!name.startsWith(LINE_CONST)) {
            msg.push("");
            msg.push(toolTipDist(name));
            msg.push(toolTipElev(name));
          }
        }
        return msg;

      } catch (e) {
        console.log(e);
      }
    },
  };
}

function makeDatasets() {
  var datasets = [];
  for (runner of logData.players) {
    if (graphType != graphTypes.PERCENT && runner.type != "RUN") {
      continue;
    }
    datasets.push(avatarDataset(runner));
    datasets.push(plotDataset(runner));
    (new LegendEntry(runner)).makeEntry();
  }
  return datasets;
}

function loadChart() {
  if (typeof(scatterChart) != "undefined") {
    scatterChart.destroy();
  }
  if (typeof logData === 'undefined') {
    console.log("Waiting for data");
    return;
  }
  var legend = calcLegend();


  ctx = document.getElementById('myChart').getContext('2d');

  scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: makeDatasets()
    },
    options: {
      tooltips: {
        mode: "point",
        callbacks: toolTipCallbacks(),
      },
      maintainAspectRatio: false,
      scales: makeScales(),
      legend: legend
    }
  });
}

function makeAxes(min, max, step, label) {
  return [{
    ticks: {
      max: max,
      min: min,
      stepSize: step
    },
    scaleLabel: {
      display: true,
      labelString: label
    }
  }];
}

function makeScales() {
  switch (graphType) {
    case graphTypes.PERCENT:
      switch (graphMode) {
        case graphModes.TOTAL:
          return {
            yAxes: makeAxes(0, roundNum(maxY + 7, 10), roundNum(maxY / 10, 5), "Elevation %"),
              xAxes: makeAxes(0, roundNum(maxX + 7, 10), roundNum(maxX / 10, 5), "Distance %"),
          }
          break;
        case graphModes.DISTANCE:
          var furthest = logData.players.sort((a, b) => (b.progress.distance) - (a.progress.distance))[0].progress.distance;
          return {
            yAxes: makeAxes(0, roundNum(furthest + 7, 10), roundNum(furthest / 10, 10), "Distance %"),
              xAxes: makeAxes(0, dayOfChallenge + 1, 1, "Day of April '21"),
          }
          break;
        case graphModes.ELEVATION:
          var highest = logData.players.sort((a, b) => (b.progress.elevation) - (a.progress.elevation))[0].progress.elevation;
          return {
            yAxes: makeAxes(0, roundNum(highest + 7, 10), roundNum(highest / 10, 5), "Elevation %"),
              xAxes: makeAxes(0, dayOfChallenge + 1, 1, "Day of April '21"),
          }
          break;
      }
      break;
    case graphTypes.ACTUAL:
      switch (graphMode) {
        case graphModes.TOTAL:
          var furthest = logData.players.sort((a, b) => (b.actual.distance) - (a.actual.distance))[0].actual.distance;
          var highest = logData.players.sort((a, b) => (b.actual.elevation) - (a.actual.elevation))[0].actual.elevation;
          return {
            yAxes: makeAxes(0, roundNum(highest + 170, 250), roundNum(highest / 10, 250), "Elevation ft"),
              xAxes: makeAxes(0, roundNum(furthest + 7, 10), roundNum(furthest / 10, 5), "Distance mi"),
          }
          break;
        case graphModes.DISTANCE:
          var furthest = logData.players.sort((a, b) => (b.actual.distance) - (a.actual.distance))[0].actual.distance;
          return {
            yAxes: makeAxes(0, roundNum(furthest + 7, 10), roundNum(furthest / 10, 10), "Distance mi"),
              xAxes: makeAxes(0, dayOfChallenge + 1, 1, "Day of April '21"),
          }
          break;
        case graphModes.ELEVATION:
          var highest = logData.players.sort((a, b) => (b.actual.elevation) - (a.actual.elevation))[0].actual.elevation;
          return {
            yAxes: makeAxes(0, roundNum(highest + 170, 250), roundNum(highest / 10, 250), "Elevation ft"),
              xAxes: makeAxes(0, dayOfChallenge + 1, 1, "Day of April '21"),
          }
          break;
      }
      break;
  }

}

function roundNum(x, to) {
  return Math.ceil(x / to) * to;
}

function calcLegend() {
  $(".legend").empty();
  return {
    display: false
  }

}

function imgMe(src) {
  var img = new Image();
  if (!imageExists(src)) {
    src = randomHeadshot();
  }
  img.src = "img/icons/" + src + ".png";
  img.width = imgWidth;
  img.height = imgHeight;
  return img;
}

function randomHeadshot() {
  var i = Math.floor(Math.random() * (headshots.length - 1));
  return headshots[i];
}

function imageExists(name) {
  return headshots.includes(name);
}

const headshots = ["crawford", "fraley", "gonzales", "haniger", "lewis", "moore", "paxton", "white", "bishop", "graveman", "marmolejos", "seager", "vest", "dunn", "haggerty", "misiewicz", "sheffield", "fletcher", "kelenic", "murphy", "torrens", "flexen", "kikuchi", "rodriguez", "trammell", "france", "margevicius", "sadler", "travis", "moose"];


class LegendEntry {
  constructor(runner) {
    this.name = runner.name;
    this.type = runner.type;
    this.icon = runner.icon;
    this.color = runner.color;
  }

  displayName() {
    return this.name + " (" + this.type + ")";
  }

  makeEntry() {
    var entry = $('<div name="' + this.name + '" class="col-6 col-md-4 col-lg-12 legend-entry">')
    entry.append('<img src="img/icons/' + this.icon + '.png" />');
    entry.append('<div class="circle mx-2" style="background: ' + this.color + ';"></div>');
    entry.append('<span>' + this.displayName() + '</span>');
    $(".row .legend").append(entry);
    $(entry).click(function() {
      hideDataSets(this);
    });
  }
}

function hideDataSets(cell) {
  var name = $(cell).attr("name")
  var hidden = true;
  if ($(cell).hasClass("disabled")) {
    console.log("Enabling " + name);
    hidden = false;
    $(cell).removeClass("disabled")
  } else {
    console.log("Hiding " + name);
    $(cell).addClass("disabled")
  }

  scatterChart.data.datasets.forEach(function(dataset) {
    if (dataset.label.includes(name)) {
      dataset.hidden = hidden;
    }
  })
  scatterChart.update();
}

function toggleAllDataSets() {
  for (var child of $(".legend").children("div")) {
    hideDataSets(child);
  }
}
