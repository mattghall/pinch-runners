function addRowRunner(name) {
  $(".bars").append('<div class="row runner ' + name + '">');
}

function addTitleCol(name) {
  $("." + name).append('<div class="col-sm-2"' + name + '>' + name + '</div>');
}

var progressMiles = 0;

function addProgress(name, green, yellow, blue) {
  var gray = totalDistance - green - yellow - blue;
  $("." + name).append('<div class="col-sm-10 ' + name + '-sm">');
  $("." + name + "-sm").append('<div class="progress ' + name + '-pro">');
  $("." + name + "-pro").append(buildSegment(green, "green"));
  $("." + name + "-pro").append(buildSegment(yellow, "yellow"));
  $("." + name + "-pro").append(buildSegment(blue, "blue"));
  $("." + name + "-pro").append(buildGraySegment(gray));
  progressMiles = 0;
}

function buildSegment(miles, color) {
  var m = parseFloat(miles);
  if(progressMiles >= totalDistance){
    return;
  }
  progressMiles = progressMiles + m;
  var disp = roundMile(m);
  if(m >= totalDistance) {
    disp = disp + "+";
  }
  if (m != 0) {
    return '<div class="progress-bar progress-bar-striped bar-' +
      color + '" style="width:' + milePercent(m) + '%">' + disp + '</div>';
  }

}

function buildGraySegment(miles) {
  var m = parseFloat(miles);
  if (m > 0) {
    return '<div class="progress-bar  bar-gray" style="width:' + milePercent(m) + '%">' + roundMile(m) + '</div>';
  }
}

function milePercent(mile) {
  return (mile / totalDistance * 100).toFixed();
}

function roundMile(miles) {
  if (miles < 60) {
    return miles.toFixed();
  } else if (miles > 60) {
    return miles.toFixed(1);
  } else if (miles > 100) {
    return miles.toFixed(2);
  }
}

function setThroughSelector(dayOfYear, endOfMonth, endOfWeek) {
  $("#selectToday").val(dayOfYear);
  $("#selectWeek").val(endOfWeek);
  $("#selectMonth").val(endOfMonth);
}

function addUserRow(name, userDistance) {
  var green = calcGreen(userDistance, expectedMiles);
  var yellow = calcYellow(userDistance, expectedMiles);
  var blue = calcBlue(userDistance, expectedMiles);

  addRowRunner(name);
  addTitleCol(name);
  addProgress(name, green, yellow, blue);
}

function deleteBars() {
  $(".bars").empty();
}
