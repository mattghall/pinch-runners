const url = "https://g2x40zbnhj.execute-api.us-west-2.amazonaws.com/pinch_runners_data";
const headshots = ["crawford", "fraley", "gonzales", "haniger", "lewis", "moore", "paxton", "white"];
const finish = 121;
var csv = [];
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
  if (imageExists(src)) {
    img.src = "img/icons/" + src + ".png";
  } else {
    img.src = "img/icons/smith.png";
  }
  img.width = imgWidth;
  img.height = imgHeight;
  return img;
}

function imageExists(name) {
  return headshots.includes(name);
}

function postDataGather(data) {
  csv = parseCsv(data);
  resetBars();
  loadChart();
}

function getData() {
  // data = "Matt,Rainier,0.500,0.200,gonzales\nJoe,Rainier,0.200,0.100,paxton\nmegan,,0.0100, 0.000,lewis\nmegan,,0.9100, 0.000\nteam,,0.100, 0.200,haniger";
  // postDataGather(data);
  fetch(url)
    .then(function(response) {
      response.text().then(function(text) {
        postDataGather(text);
      });
    })
    .catch(function(err) {
      console.log("Error: " + err);
    });
}


function resetBars() {
  deleteBars();
  displayBarHeader()
  for (runner of csv) {
    if (runner[0] != "") {
      displayRunner(runner);
    }
  }
}


function displayRunner(runner) {
  var name = runner[0];
  var distance = runner[2];
  var elevation = runner[3];
  addUserRow(name, distance, elevation);
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


function parseCsv(input) {
  var lines = input.split(/\r\n|\n/);
  var csv = [];
  for (line of lines) {
    var row = line.split(',');
    if (row[0] != "") {
      csv.push(row);
    }
  }
  return csv;
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
  for (row of csv) {
    var runner = {
      label: space + row[0],
      data: [{
        x: toPercent(row[2]),
        y: toPercent(row[3])
      }],
      backgroundColor: [validateColor(row[4])],
      radius: 10,
      hoverRadius: 10,
      pointStyle: imgMe(row[5])
    }
    datasets.push(runner);
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
