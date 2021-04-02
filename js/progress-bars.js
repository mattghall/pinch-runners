function displayRunner(runner) {
  addUserRow(runner.name, runner.progress.distance, runner.progress.elevation);
}

function addRowRunner(name) {
  $(".bars").append('<div class="row runner ' + makeSafeName(name) + '">');
}

function addTitleCol(name) {
  $("." + makeSafeName(name)).append('<div class="col-2 d-sm-none"' + makeSafeName(name) + '></div>');
  $("." + makeSafeName(name)).append('<div class="col-10 col-sm-2 text-center text-sm-left"' + makeSafeName(name) + '>' + name + '</div>');
}

var progressMiles = 0;

function addProgress(name, dist, elev) {
  var safeName = makeSafeName(name);

  $("." + safeName).append('<div class="col-2 d-sm-none"' + safeName + '>dist</div>');
  $("." + safeName).append('<div class="col-10 col-sm-5 ' + safeName + '-sm-dist">');
  $("." + safeName + "-sm-dist").append('<div class="progress ' + safeName + '-pro-dist mb-1 mb-sm-0">');
  $("." + safeName + "-pro-dist").append(buildSegment(dist, "green"));

  $("." + safeName).append('<div class="col-2 d-sm-none"' + safeName + '>elev</div>');
  $("." + safeName).append('<div class="col-10 col-sm-5 ' + safeName + '-sm-elev">');
  $("." + safeName + "-sm-elev").append('<div class="progress ' + safeName + '-pro-elev mb-1 mb-sm-0">');
  $("." + safeName + "-pro-elev").append(buildSegment(elev, "blue"));
  progressMiles = 0;
}

function makeSafeName(name) {
  return name.replace(/\W/g, '').toLowerCase();
}

function buildSegment(miles, color) {
  var comp = miles.toFixed(1);
  if (comp != 0) {
    return '<div class="progress-bar progress-bar-striped bar-' +
      color + '" style="width:' + comp + '%">' + comp + '%</div>';
  }

}

function buildNegativeSegment(miles, type) {
  var comp = (1-miles).toFixed(1);

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
  if(name == "team") {
    $(".bars").append("<hr/>");
  }
  addRowRunner(name);
  addTitleCol(name);
  addProgress(name, userDistance, userElevation);
}

function displayBarHeader() {
  addRowRunner("header");
  $(".header").append('<div class="d-none d-sm-block col-sm-2">');
  $(".header").append('<div class="d-none d-sm-block col-sm-5 header-dist">');
  $(".header-dist").append('Distance');
  $(".header").append('<div class="d-none d-sm-block col-sm-5 header-elev">');
  $(".header-elev").append('Elevation');
}

function deleteBars() {
  $(".bars").empty();
}
