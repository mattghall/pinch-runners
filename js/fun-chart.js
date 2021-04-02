var imgHeight = 75;
var imgWidth = 50;

$(window).resize(function() {
  if (document.documentElement.clientWidth < 576) {
    imgHeight = 30;
    imgWidth = 20;
  } else if (document.documentElement.clientWidth < 900) {
    imgHeight = 50;
    imgWidth = 33;
  } else {
    imgHeight = 75;
    imgWidth = 50;
  }
}).resize()


function loadChart() {
  var space = "     ";
  if (document.documentElement.clientWidth < 576) {
    space = "";
  }
  var datasets = [];
  for (runner of logData.players) {

    var dataset = {
      label: space + runner.name,
      data: [{
        x: runner.progress.distance,
        y: runner.progress.elevation
      }],
      backgroundColor: runner.color,
      radius: 10,
      hoverRadius: 10,
      pointStyle: imgMe(runner.icon)
    }
    datasets.push(dataset);
  }
  ctx = document.getElementById('myChart').getContext('2d');

  var legend = calcLegend();

  var scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: datasets
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            max: 100,
            min: 0,
            stepSize: 10
          },
          scaleLabel: {
            display: true,
            labelString: "Elevation %"
          }
        }],
        xAxes: [{
          ticks: {
            max: 100,
            min: 0,
            stepSize: 10
          },
          scaleLabel: {
            display: true,
            labelString: "Distance %"
          }
        }],
      },
      legend: legend
    }
  });

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
