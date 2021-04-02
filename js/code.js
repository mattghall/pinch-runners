const url = "https://8kmzt1szjl.execute-api.us-west-2.amazonaws.com/pinch-runners-data-2";
const cookie = "pinch-runners.mattghall.com:browserCheck";
var logData = {};

$(function() {
  browserCheck();
  getData();
});


function postDataGather(data) {
  logData = JSON.parse(data);
  resetBars();
  loadChart();
}

function getData() {
  // data = '{"players":[{"name":"Matt","mountain":"Rainier","color":"blue","icon":"kelenic","target":{"distance":100,"elevation":14411},"progress":{"distance":10.3,"elevation":4.9},"distances":["10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3"],"elevations":["4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9"]},{"name":"Isaac","mountain":"Rainier","color":"","icon":"","target":{"distance":100,"elevation":14411},"progress":{"distance":0,"elevation":0},"distances":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],"elevations":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"]},{"name":"Rachel","mountain":"Olympus","color":"green","icon":"lewis","target":{"distance":100,"elevation":7979},"progress":{"distance":0,"elevation":0},"distances":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],"elevations":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"]},{"name":"Hillary","mountain":"Mailbox","color":"purple","icon":"haniger","target":{"distance":45,"elevation":4822},"progress":{"distance":0,"elevation":0},"distances":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],"elevations":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"]},{"name":"Megan B","mountain":"Olympus","color":"yellow","icon":"gonzales","target":{"distance":100,"elevation":7979},"progress":{"distance":7,"elevation":1.7},"distances":["7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0","7.0"],"elevations":["1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7","1.7"]},{"name":"Sean","mountain":"Mailbox","color":"","icon":"seager","target":{"distance":45,"elevation":4822},"progress":{"distance":4.1,"elevation":1.5},"distances":["4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1"],"elevations":["1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5"]},{"name":"Jason (Bike)","mountain":"Shasta","color":"","icon":"","target":{"distance":600,"elevation":14179},"progress":{"distance":3.5,"elevation":7.9},"distances":["3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5","3.5"],"elevations":["7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9","7.9"]},{"name":"Megan C","mountain":"Mailbox","color":"red","icon":"trammell","target":{"distance":45,"elevation":4822},"progress":{"distance":5,"elevation":5.1},"distances":["5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0","5.0"],"elevations":["5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1","5.1"]}],"team":{"name":"team","target":{"distance":2270,"elevation":146850},"actuals":{"distance":"84.8","elevation":"4560"},"progress":{"distance":"3.7","elevation":"3.1"},"icon":"paxton"}}';
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
  for (runner of logData.players) {
    displayRunner(runner);
  }
}


function browserCheck() {
  var x = document.cookie;
  if(localStorage.getItem(cookie) == "true"){
    return;
  }
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
  localStorage.setItem(cookie, 'true');
  alert("We noticed you are using " + browser + " as your browser.\n" +
    "Unfortunately Pinch Runners has only been tested in Google Chrome. " +
    "Certain features may not work. Continue at your own risk");
}

function validateColor(color) {
  if (color == "") {
    return randomColor();
  }
  return color;
}





function toPercent(val) {
  return (val * 100).toFixed(0);
}


function randomColor() {
  var c = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return c;
}
