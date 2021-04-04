var imgHeight = 75;
var imgWidth = 50;
const LINE_CONST = "_line_";
var sz = 0;

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


function avatarDataset(runner, space) {
  return {
    label: space + runner.name,
    data: [{
      x: runner.progress.distance,
      y: runner.progress.elevation
    }],
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

function plotDataset(runner, space) {
  var data = []
  data.push(new Point(0, 0))
  for (i = 0; i < dayOfChallenge; i++) {
    data.push(new Point(runner.distances[i], runner.elevations[i]));
  }
  return {
    label: LINE_CONST + runner.name,
    data: data,
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

function loadChart() {
  if(typeof logData === 'undefined') {
    console.log("Waiting for data");
    return;
  }
  var space = "     ";
  if (document.documentElement.clientWidth < 576) {
    space = "";
  }
  var datasets = [];
  for (runner of logData.players) {
    datasets.push(avatarDataset(runner, space));
    datasets.push(plotDataset(runner, space))
  }
  ctx = document.getElementById('myChart').getContext('2d');

  var legend = calcLegend();

  var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: datasets
    },
    options: {
      tooltips: {
        mode: "point",
        callbacks: toolTipCallbacks(),
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            max: roundNum(maxY + 7, 10),
            min: 0,
            stepSize: roundNum(maxY / 10, 5)
          },
          scaleLabel: {
            display: true,
            labelString: "Elevation %"
          }
        }],
        xAxes: [{
          ticks: {
            max: roundNum(maxX + 7, 10),
            min: 0,
            stepSize: roundNum(maxX / 10, 5)
          },
          scaleLabel: {
            display: true,
            labelString: "Distance %"
          }
        }],
      },
      legend: legend
    },
    plugins: [{
      afterLayout: function(chart) {
        chart.legend.legendItems.forEach(
          (label) => {
            label.text = label.text.replace(LINE_CONST, "");
            return label;
          }
        )
      }
    }]
  });

}

function roundNum(x, to) {
  return Math.ceil(x / to) * to;
}

function calcLegend() {
  if (document.documentElement.clientWidth < 576) {
    return {
      display: true,
      position: 'bottom',
      labels: {
        fontColor: "#000080",
        usePointStyle: true,
        fontSize: 15,
        boxWidth: 50,
        padding: 20,
      }
    }
  } else if (document.documentElement.clientWidth < 900) {
    return {
      display: true,
      position: 'bottom',
      labels: {
        fontColor: "#000080",
        usePointStyle: true,
        fontSize: 15,
        boxWidth: 50,
        padding: 50,
      }
    }
  } else {
    return {
      display: true,
      position: 'right',
      labels: {
        fontColor: "#000080",
        usePointStyle: true,
        fontSize: 15,
        boxWidth: 500,
        padding: 60,
      }
    }
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
