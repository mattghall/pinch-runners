const url = "https://8kmzt1szjl.execute-api.us-west-2.amazonaws.com/pinch-runners-data-2";
const cookie = "pinch-runners.mattghall.com:browserCheck";
var logData = {};
var indexMap = new Map();
var maxX = 10;
var maxY = 10;
var dayOfChallenge = 31;

$(function() {
  browserCheck();
  getData();

  var date = new Date();
  if (date < Date.parse('1 May 2021 00:00:00 GMT')) {
    dayOfChallenge = date.getDate();
  }
});

function buildIndexMap(json) {
  for (i = 0; i < json.players.length; i++) {
    indexMap.set(json.players[i].name, i);
    if(json.players[i].color == "") {
      json.players[i].color = randomColor();
    }
    if(json.players[i].progress.distance > maxX) {
      maxX = json.players[i].progress.distance;
    }
    if(json.players[i].progress.elevation > maxY) {
      maxY = json.players[i].progress.elevation;
    }
    if(json.players[i].icon == "" ) {
      json.players[i].icon = randomHeadshot();
    }
  }
}

function postDataGather(data) {
  logData = JSON.parse(data);
  buildIndexMap(logData);
  resetBars();
  loadChart();
}

function toolTipDist(name) {
  var player = logData.players[indexMap.get(name)];
  return "Distance: " + (player.progress.distance *  player.target.distance / 100).toFixed(1) + " mi";
}

function toolTipElev(name) {
  var player = logData.players[indexMap.get(name)];
  return "Elevation: " + (player.progress.elevation *  player.target.elevation / 100).toFixed() + " ft";
}

function toolTipMariner(name) {
  var player = logData.players[indexMap.get(name)];
  var mariner = player.icon;
  mariner = mariner.charAt(0).toUpperCase() + mariner.slice(1);
  return " " + mariner;
}

function getData() {
  // data = '{"players":[{"name":"Matt","mountain":"Rainier","color":"","icon":"kelenic","target":{"distance":100,"elevation":14411},"progress":{"distance":10.3,"elevation":4.9},'
  // +'"distances":[ "0", "10.3", "11.3", "20.3", "25.3", "30.3", "35.3", "38.3", "40.3","60.3", "63.3", "65.3", "66.3", "67.3", "69.3", "70.3", "71.3", "72", "73.3","74.3", "75.3", "80.3", "81.3", "85.3", "86.3", "90.3", "91.3", "92.3", "93.3","100" ],' +
  // '"elevations":["0","4.9","4.9","4.9","4.9","16","70","50","34","45","45","60","60","80","80","50","50","34","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9"]},'+
  // '{"name":"Joe","mountain":"Rainier","color":"red","icon":"gonzales","target":{"distance":100,"elevation":14411},"progress":{"distance":50.3,"elevation":4.9},'
  // +'"distances":[ "0", "10.3", "11.3", "20.3", "25.3", "30.3", "35.3", "38.3", "40.3","60.3", "63.3", "65.3", "66.3", "67.3", "69.3", "70.3", "71.3", "72", "73.3","74.3", "75.3", "80.3", "81.3", "85.3", "86.3", "40.3", "91.3", "92.3", "93.3","100" ],' +
  // '"elevations":["0","4.9","4.9","4.9","4.9","16","70","50","34","45","45","60","60","80","80","50","50","34","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9","4.9"]}],'+
  // '"team":{"name":"team","target":{"distance":2270,"elevation":146850},"actuals":{"distance":"84.8","elevation":"4560"},"progress":{"distance":"3.7","elevation":"3.1"},"icon":"paxton"}}';
  //
  //   postDataGather(data);


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
