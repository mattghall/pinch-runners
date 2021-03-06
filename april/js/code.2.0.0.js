const VERSION = "v2.0.0";
const CLUB_ID = 911459;

const url = "https://8kmzt1szjl.execute-api.us-west-2.amazonaws.com/pinch";
var logData = {};
var playerMap = new Map();
var maxX = 10;
var maxY = 10;
var dayOfChallenge = 31;

$(function() {
  feather.replace();
  $(".version-span").text(VERSION);
  browserCheck();
  getData(false);

  var date = new Date();
  if (date < Date.parse('1 May 2021 00:00:00 GMT')) {
    dayOfChallenge = date.getDate();
  }
}); // end startup

function buildplayerMap(json) {
  for (i = 0; i < json.players.length; i++) {
    playerMap.set(json.players[i].name, json.players[i]);
    if (json.players[i].color == "") {
      json.players[i].color = randomColor();
    }
    if (json.players[i].progress.distance > maxX) {
      maxX = json.players[i].progress.distance;
    }
    if (json.players[i].progress.elevation > maxY) {
      maxY = json.players[i].progress.elevation;
    }
    if (json.players[i].icon == "") {
      json.players[i].icon = randomHeadshot();
    }
  }
}

function postDataGather(data) {
  logData = JSON.parse(data);
  buildplayerMap(logData);
  resetBars();
  loadChart();
  loading(false);
}

function loading(bool) {
  if (bool || bool == "true") {
    $('.chart-row').hide();
    $('#spinner').show();
    $('#notSpinner').hide();
    $('#refresh-button').addClass('disabled');
  } else {
    $('.chart-row').show();
    $('#spinner').hide();
    $('#notSpinner').show();
    $('#refresh-button').removeClass('disabled');
  }
}

function toolTipDist(name) {
  var player = playerMap.get(name);
  return "Distance: " + (player.progress.distance * player.target.distance / 100).toFixed(1) + " mi";
}

function toolTipElev(name) {
  var player = playerMap.get(name);
  return "Elevation: " + (player.progress.elevation * player.target.elevation / 100).toFixed() + " ft";
}

function toolTipMariner(name) {
  var player = playerMap.get(name);
  var mariner = player.icon;
  mariner = mariner.charAt(0).toUpperCase() + mariner.slice(1);
  return " " + mariner;
}

function getData(forceUpdate) {
  loading(true);
  console.log("Getting Data with forceUpdate=" + forceUpdate);
  // data = '{"players":[{"name":"Matt","mountain":"Rainier","color":"teal","icon":"kelenic","target":{"distance":100,"elevation":14411},"progress":{"distance":32.7,"elevation":19},"distances":["10.3","14.5","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7","32.7"],"elevations":["4.9","7.1","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0","19.0"]},{"name":"Isaac","mountain":"Rainier","color":"","icon":"","target":{"distance":100,"elevation":14411},"progress":{"distance":0,"elevation":0},"distances":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],"elevations":["0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"]},{"name":"Rachel","mountain":"Olympus","color":"green","icon":"lewis","target":{"distance":100,"elevation":7979},"progress":{"distance":6.2,"elevation":5.3},"distances":["0.0","0.0","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2","6.2"],"elevations":["0.0","0.0","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3","5.3"]},{"name":"Hillary","mountain":"Mailbox","color":"purple","icon":"haniger","target":{"distance":45,"elevation":4822},"progress":{"distance":6.4,"elevation":1.9},"distances":["0.0","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4","6.4"],"elevations":["0.0","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9","1.9"]},{"name":"Megan B","mountain":"Olympus","color":"yellow","icon":"moose","target":{"distance":100,"elevation":7979},"progress":{"distance":11.9,"elevation":5.9},"distances":["7.0","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9","11.9"],"elevations":["1.7","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9","5.9"]},{"name":"Sean","mountain":"Mailbox","color":"Pick a color sean!","icon":"seager","target":{"distance":45,"elevation":4822},"progress":{"distance":4.1,"elevation":1.5},"distances":["4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1","4.1"],"elevations":["1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5","1.5"]},{"name":"Jason (Bike)","mountain":"Shasta","color":"magenta","icon":"marmolejos","target":{"distance":600,"elevation":14179},"progress":{"distance":10.3,"elevation":15.4},"distances":["3.5","8.0","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3","10.3"],"elevations":["7.9","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4","15.4"]},{"name":"Megan C","mountain":"Mailbox","color":"red","icon":"trammell","target":{"distance":45,"elevation":4822},"progress":{"distance":18,"elevation":8.6},"distances":["5.0","14.2","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0","18.0"],"elevations":["5.1","6.4","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6","8.6"]}],"team":{"name":"team","target":{"distance":1135,"elevation":73425},"actuals":{"distance":"125.4","elevation":"6394"},"progress":{"distance":"11.1","elevation":"8.7"},"icon":"paxton"}}';
  // postDataGather(data);

  deleteBars();
  displayBarHeader()

  fetch(url, {
      headers: {
        "force-update": forceUpdate + ""
      }
    })
    .then(function(response) {
      response.text().then(function(text) {
        postDataGather(text);
      });
    })
    .catch(function(err) {
      console.log("Error: " + err);
      window.location.href = "error.html"
    });
}

function resetBars() {
  deleteBars();
  displayBarHeader()
  for (runner of logData.players) {
    displayRunner(runner);
  }
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
