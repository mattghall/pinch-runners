function addRowRunner(name) {
  var safeName = name.replace(/\W/g, '');
  $(".bars").append('<div class="row runner ' + safeName + '">');
}

function addTitleCol(name) {
  var safeName = name.replace(/\W/g, '');
  $("." + safeName).append('<div class="col-sm-2"' + safeName + '>' + name + '</div>');
}

var progressMiles = 0;

function addProgress(name, green, yellow, blue) {
  var safeName = name.replace(/\W/g, '');

  // var gray = totalDistance - green - yellow - blue;
  $("." + safeName).append('<div class="col-sm-10 ' + safeName + '-sm">');
  $("." + safeName + "-sm").append('<div class="progress ' + safeName + '-pro">');
  $("." + safeName + "-pro").append(buildSegment(green, "green"));
  // $("." + name + "-pro").append(buildSegment(yellow, "yellow"));
  // $("." + name + "-pro").append(buildSegment(blue, "blue"));
  // $("." + name + "-pro").append(buildGraySegment(gray));
  progressMiles = 0;
}

function buildSegment(miles, color) {
  var comp = miles * 100;
  // if(progressMiles >= totalDistance){
  //   return;
  // }
  // progressMiles = progressMiles + m;
  // var disp = roundMile(m);
  // if(m >= totalDistance) {
  //   disp = disp + "+";
  // }
  if (comp != 0) {
    return '<div class="progress-bar progress-bar-striped bar-' +
      color + '" style="width:' + comp + '%">' + comp + '%</div>';
  }

}

// function buildGraySegment(miles) {
//   var m = parseFloat(miles);
//   if (m > 0) {
//     return '<div class="progress-bar  bar-gray" style="width:' + milePercent(m) + '%">' + roundMile(m) + '</div>';
//   }
// }

// function milePercent(mile) {
//   return (mile / totalDistance * 100).toFixed();
// }

function roundMile(miles) {
  if (miles <= 60) {
    return miles.toFixed();
  } else if (miles > 60) {
    return miles.toFixed(1);
  }
}

function setThroughSelector(dayOfYear, endOfMonth, endOfWeek) {
  $("#selectToday").val(dayOfYear);
  $("#selectWeek").val(endOfWeek);
  $("#selectMonth").val(endOfMonth);
}

function addUserRow(name, userDistance) {
  // var green = calcGreen(userDistance, expectedMiles);
  // var yellow = calcYellow(userDistance, expectedMiles);
  // var blue = calcBlue(userDistance, expectedMiles);

  addRowRunner(name);
  addTitleCol(name);
  addProgress(name, userDistance, 0, 0);
}

function deleteBars() {
  $(".bars").empty();
}
