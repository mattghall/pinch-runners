var team;

function parseCsv(body) {
  resetTeam();
  var lines = body.split(/\r\n|\n/);
  var playerJsons = [];

  for (var i = 1; i < lines.length - 2; i += 2) {
    var row1 = lines[i].split(',');
    var row2 = lines[i + 1].split(',');
    if (row1[0] == "" || row1[1] == "" || row2[1] == "") {
      continue;
    }
    playerJsons.push(new Player(row1, row2))
  }

  playerJsons.sort((a, b) => (b.progress.distance + b.progress.elevation) - (a.progress.distance + a.progress.elevation));

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

class Player {
  constructor(line1, line2) {
    var dist = parseFloat(line1[5]) || 0;
    var elev = parseFloat(line2[5]) || 0;
    var playerTotal = parseFloat((dist+elev)/2).toFixed() || 0;
    var targetDist = parseFloat(line1[3]) || 100;
    var targetElev = parseFloat(line2[3]) || 10000;
    team.progress.dist += (dist * targetDist / 100);
    team.progress.elev += (elev * targetElev / 100);
    team.target.dist += targetDist;
    team.target.elev += targetElev;

    this.name = line1[0];
    this.type = line1[1];
    this.mountain = line2[1];
    this.color = line1[2];
    this.icon = line2[2];
    this.target = {
      distance: targetDist,
      elevation: targetElev,
    };
    this.progress = {
      distance: dist,
      elevation: elev,
      total: playerTotal,
    }
    var dist = [];
    var totalDist = 0;
    var elev = [];
    var totalElev = 0;

    for (var day = 0; day < 30; day++) {
      var d = parseFloat(line1[6 + day] || 0);
      totalDist += d;
      var daysPercent = ((totalDist / targetDist) * 100).toFixed(1);
      dist.push(daysPercent);
      var e = parseFloat(line2[6 + day] || 0);
      totalElev += e;
      daysPercent = ((totalElev / targetElev) * 100).toFixed(1);
      elev.push(daysPercent);
    }
    this.distances = dist;
    this.elevations = elev;
  }
}

function resetTeam() {
  team = {
    "target": {
      dist: 0,
      elev: 0,
    },
    "progress": {
      dist: 0,
      elev: 0,
    }
  }
}

module.exports = {
  parseCsv
};
