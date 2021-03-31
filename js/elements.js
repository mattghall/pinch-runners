function addRowRunner(name) {
  var safeName = name.replace(/\W/g, '');
  $(".bars").append('<div class="row runner ' + safeName + '">');
}

function addTitleCol(name) {
  var safeName = name.replace(/\W/g, '');
  $("." + safeName).append('<div class="col-sm-2"' + safeName + '>' + name + '</div>');
}

var progressMiles = 0;

function addProgress(name, dist, elev) {
  var safeName = name.replace(/\W/g, '');

  $("." + safeName).append('<div class="col-sm-5 ' + safeName + '-sm-dist">');
  $("." + safeName + "-sm-dist").append('<div class="progress ' + safeName + '-pro-dist">');
  $("." + safeName + "-pro-dist").append(buildSegment(dist, "green"));

  $("." + safeName).append('<div class="col-sm-5 ' + safeName + '-sm-elev">');
  $("." + safeName + "-sm-elev").append('<div class="progress ' + safeName + '-pro-elev">');
  $("." + safeName + "-pro-elev").append(buildSegment(elev, "blue"));
  progressMiles = 0;
}

function buildSegment(miles, color) {
  var comp = (miles * 100).toFixed(1);
  if (comp != 0) {
    return '<div class="progress-bar progress-bar-striped bar-' +
      color + '" style="width:' + comp + '%">' + comp + '%</div>';
  }

}

function buildNegativeSegment(miles, type) {
  var comp = ((1-miles) * 100).toFixed(1);

  if (comp != 0) {
    return '<div class="progress-bar progress-bar-striped bar-gray" style="width:' + comp + '%">' + type + '</div>';
  }

}

function setThroughSelector(dayOfYear, endOfMonth, endOfWeek) {
  $("#selectToday").val(dayOfYear);
  $("#selectWeek").val(endOfWeek);
  $("#selectMonth").val(endOfMonth);
}

function addUserRow(name, userDistance, userElevation) {
  addRowRunner(name);
  addTitleCol(name);
  addProgress(name, userDistance, userElevation);
}

function displayBarHeader() {
  addRowRunner("header");
  $(".header").append('<div class="col-sm-2">');
  $(".header").append('<div class="col-sm-5 header-dist">');
  $(".header-dist").append('Distance');
  $(".header").append('<div class="col-sm-5 header-elev">');
  $(".header-elev").append('Elevation');
}

function deleteBars() {
  $(".bars").empty();
}
