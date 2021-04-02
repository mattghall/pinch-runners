const host = "docs.google.com";
const url = "/spreadsheets/d/1tU3qY3sGw-D4hWGDx-eSQy2-Mn9rXPO55iXp9aITcwQ/export?format=csv&id=1tU3qY3sGw-D4hWGDx-eSQy2-Mn9rXPO55iXp9aITcwQ&gid=1282434482";

var team = {
  "target": {
    dist: 0,
    elev: 0,
  },
  "progress": {
    dist: 0,
    elev: 0,
  }
}

var https = require('https');

exports.handler = function(event, context, callback) {
  console.log('start request to ' + url)
  var result = '';
  var options = {
    hostname: host,
    path: url,
    headers: {
      "Accept": "text/csv",
      "User-Agent": "Mozilla",
      "Cookie": "troute=t1;"
    }
  }

  https.get(options, (response) => {
    // https://www.mattlunn.me.uk/blog/2012/05/handling-a-http-redirect-in-node-js/
    if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
      console.log("Redirecting to " + response.headers.location);
      var loc = response.headers.location.replace("https://", "");
      if (loc.split(".com").length != 2) {
        // TODO some errors
        console.log("Couldn't split url");
        callback(null, buildResp(500, "Couldn't split url in redirect"));
        return;
      }
      var ho = loc.split(".com")[0] + ".com"
      var pa = loc.split(".com")[1];

      options.hostname = loc.split(".com")[0] + ".com";
      options.path = loc.split(".com")[1];

      // GET the redirect
      https.get(options, (response) => {
        if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
          callback(null, buildResp(response.statusCode, "Likely redirected more than once"));
          return;
        }
        response.on('data', function(responseData) {
          result += responseData;
          console.log("received data");
        });
        response.on('error', function(responseData) {
          result += "error";
          console.log("error: " + responseData);
        });

        response.on('end', function() {
          if (result != 'error') {
            console.log("success");
            callback(null, buildResp(200, result));
            return;
          } else {
            console.log("error");
            callback(null, buildResp(500, "error"));
            return;
          }
        });
      });
    }
    response.on('error', function(responseData) {
      console.log("outer error");
    });
    response.on('end', function() {
      console.log("end");
    });
  });


  console.log('end request');
}

class Player {
  constructor(line1, line2) {
    var dist = parseFloat(line1[4]) || 0;
    var elev = parseFloat(line2[4]) || 0;
    var targetDist = parseFloat(line1[2]) || 100;
    var targetElev = parseFloat(line2[2]) || 10000;
    team.progress.dist += (dist * targetDist / 100);
    team.progress.elev += (elev * targetElev / 100);
    team.target.dist += targetDist;
    team.target.elev += targetElev;

    this.name = line1[0];
    this.mountain = line2[0];
    this.color = line1[1];
    this.icon = line2[1];
    this.target = {
      distance: targetDist,
      elevation: targetElev,
    };
    this.progress = {
      distance: dist,
      elevation: elev,
    }
    var dist = [];
    var totalDist = 0;
    var elev = [];
    var totalElev = 0;

    for (var day = 0; day < 30; day++) {
      var d = parseFloat(line1[5 + day] || 0);
      totalDist += d;
      var daysPercent = ((totalDist / targetDist) * 100).toFixed(1);
      dist.push(daysPercent);
      var e = parseFloat(line2[5 + day] || 0);
      totalElev += e;
      daysPercent = ((totalElev / targetElev) * 100).toFixed(1);
      elev.push(daysPercent);
    }
    this.distances = dist;
    this.elevations = elev;
  }
}


function parseCsv(body) {
  var lines = body.split(/\r\n|\n/);
  var playerJsons = [];

  for (var i = 1; i < lines.length - 2; i += 2) {
    var row1 = lines[i].split(',');
    var row2 = lines[i + 1].split(',');
    if (row1[0] == "" || row2[0] == "") {
      continue;
    }
    playerJsons.push(new Player(row1, row2))
  }

  var teamJson = {
    name: "team",
    target: {
      distance: team.target.dist,
      elevation: team.target.elev,
    },
    actuals: {
      distance: team.progress.dist.toFixed(1),
      elevation: team.progress.elev.toFixed(),
    },
    progress: {
      distance: (team.progress.dist / team.target.dist * 100).toFixed(1),
      elevation: (team.progress.elev / team.target.elev * 100).toFixed(1),
    },
    icon: "paxton"
  }

  return {
    players: playerJsons,
    team: teamJson
  };
}

function buildResp(code, body) {
  if (code == 200) {
    var json = parseCsv(body);
    json = JSON.stringify(json);
    const resp = {
      statusCode: code,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: json,
    };
    return resp;
  } else {
    const resp = {
      statusCode: code,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify("{'error':'uh oh'}"),
    };
    return resp;
  }

}
