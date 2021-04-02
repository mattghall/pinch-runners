const url = "https://8kmzt1szjl.execute-api.us-west-2.amazonaws.com/pinch-runners-data-2";

const headshots = ["crawford", "fraley", "gonzales", "haniger", "lewis", "moore", "paxton", "white", "bishop", "graveman", "marmolejos", "seager", "vest", "dunn", "haggerty", "misiewicz", "sheffield", "fletcher", "kelenic", "murphy", "torrens", "flexen", "kikuchi", "rodriguez", "trammell", "france", "margevicius", "sadler", "travis", "moose"];
const finish = 121;
var logData = {};
var ctx;

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

$(function() {
  browserCheck();
  getData();
});

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

function postDataGather(data) {
  logData = JSON.parse(data);
  resetBars();
  loadChart();
}

function getData() {
  data = '{"players":[{"name":"Matt","mountain":"Rainier","color":"blue","icon":"kelenic","target":{"distance":100,"elevation":14411},"progress":{"distance":10.3,"elevation":4.9},"distances":["10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3"],"elevations":["4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9"]},{"name":"Isaac","mountain":"Rainier","color":"","icon":"","target":{"distance":100,"elevation":14411},"progress":{"distance":0,"elevation":0},"distances":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],"elevations":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"]},{"name":"Rachel","mountain":"Olympus","color":"green","icon":"lewis","target":{"distance":100,"elevation":7979},"progress":{"distance":0,"elevation":0},"distances":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],"elevations":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"]},{"name":"Hillary","mountain":"Mailbox","color":"purple","icon":"haniger","target":{"distance":45,"elevation":4822},"progress":{"distance":0,"elevation":0},"distances":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],"elevations":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"]},{"name":"Megan B","mountain":"Olympus","color":"yellow","icon":"gonzales","target":{"distance":100,"elevation":7979},"progress":{"distance":7,"elevation":1.7},"distances":["7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0"],"elevations":["1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7"]},{"name":"Sean","mountain":"Mailbox","color":"","icon":"seager","target":{"distance":45,"elevation":4822},"progress":{"distance":4.1,"elevation":1.5},"distances":["4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1"],"elevations":["1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5"]},{"name":"Jason (Bike)","mountain":"Shasta","color":"","icon":"","target":{"distance":600,"elevation":14179},"progress":{"distance":3.5,"elevation":7.9},"distances":["3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5"],"elevations":["7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9"]},{"name":"Megan C","mountain":"Mailbox","color":"red","icon":"trammell","target":{"distance":45,"elevation":4822},"progress":{"distance":5,"elevation":5.1},"distances":["5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0"],"elevations":["5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1"]}],"team":{"name":"team","target":{"distance":2270,"elevation":146850},"actuals":{"distance":"84.8","elevation":"4560"},"progress":{"distance":"3.7","elevation":"3.1"},"icon":"paxton"}}';
    postDataGather(data);
  // fetch(url)
  //   .then(function(response) {
  //     response.text().then(function(text) {
  //       postDataGather(text);
  //     });
  //   })
  //   .catch(function(err) {
  //     console.log("Error: " + err);
  //   });
}


function resetBars() {
  deleteBars();
  displayBarHeader()
  for (runner of logData.players) {
    displayRunner(runner);
  }
}


function displayRunner(runner) {
  addUserRow(runner.name, runner.progress.distance, runner.progress.elevation);
}


function browserCheck() {
  if (navigator.userAgent.search("Chrome") >= 0) {
    return;
  }
  var browser = "not chrome"
  if (navigator.userAgent.search("MSIE") >= 0) {
    browser = "MSIE";
  } else if (navigator.userAgent.search("Firefox") >= 0) {
    browser = "Firefox";
  } else if (navigator.userAgent.search("Safari") >= 0) {
    browser = "Safari";
  } else if (navigator.userAgent.search("Opera") >= 0) {
    browser = "Opera";
  }
  alert("We noticed you are using " + browser + " as your browser.\n" +
    "Unfortunately Pinch Runners has only been tested in Google Chrome. " +
    "Certain features such as 'literally doing anything' may not work. Continue at your own risk");
}

function validateColor(color) {
  if (color == "") {
    return randomColor();
  }
  return color;
}

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

function toPercent(val) {
  return (val * 100).toFixed(0);
}


function randomColor() {
  var c = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return c;
}
