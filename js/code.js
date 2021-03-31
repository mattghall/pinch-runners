const url = "https://g2x40zbnhj.execute-api.us-west-2.amazonaws.com/pinch_runners_data";
const finish = 121;
var csv = [];

$(function() {
  browserCheck();
  getData();

});


function postDataGather(data) {
  // console.log(data);
  csv = parseCsv(data);
  for(line of csv) {
    console.log(line);
  }
  resetBars();
}

function getData() {
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

  for (runner of csv) {
      if(runner[0] != ""){
      displayRunner(runner);
    }
  }
}


function displayRunner(runner) {
  var name = runner[0];
  var distance = runner[2];
  console.log("printing: " + name);
  addUserRow(name, distance);
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
  alert("We noticed you are using " + browser + " as your browser.\nUnfortunately TCX Editor has only been tested in Google Chrome. Certain features such as 'literally doing anything' may not work. Please consider reopening in Chrome or else you're on your own.");
}


function parseCsv(input) {
    var record_num = 5;  // or however many elements there are in each row
    var lines = input.split(/\r\n|\n/);
    var csv = [];
    for(line of lines) {
      var row = line.split(',');
      csv.push(row);
    }
    return csv;
}
