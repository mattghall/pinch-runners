function findEndOfWeek() {
  var d = new Date();
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
  return d;
}

function findEndOfMonth() {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function findDayOfYear(date) {
  var start = new Date(date.getFullYear(), 0, 0);
  var diff = date - start;
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getName(url) {
  var sid = url.split("sid=")[1];
  for (let r of runners) {
    if (r[1] == sid) {
      return r[0];
    }
  }
}

function convertDistance(distance) {
  return (.000621371192 * distance).toFixed(2);
}

function calcGreen(miles, expected) {
  if (miles > expected) {
    return expected;
  } else {
    return miles;
  }
}

function calcYellow(miles, expected) {
  if (miles < expected) {
    return (expected - miles).toFixed(2);
  }
  return 0;
}

function calcBlue(miles, expected) {
  if (miles > expected) {
    return (miles - expected).toFixed(2);
  }
  return 0;
}
