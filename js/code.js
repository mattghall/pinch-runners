const BROWSER_CHECK_COOKIE = "pinch-runners.mattghall.com:browserCheck";
const VERSION_COOKIE = "pinch-runners.mattghall:version";

function browserCheck() {
  if (localStorage.getItem(VERSION_COOKIE) == null || (localStorage.getItem(VERSION_COOKIE) != VERSION && localStorage.getItem(VERSION_COOKIE).substr(0, 4) != VERSION.substr(0, 4))) {
    localStorage.setItem(VERSION_COOKIE, VERSION);
    $("#version-updates").show();
  }

  var x = document.BROWSER_CHECK_COOKIE;
  if (localStorage.getItem(BROWSER_CHECK_COOKIE) == "true") {
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
  localStorage.setItem(BROWSER_CHECK_COOKIE, 'true');
  alert("We noticed you are using " + browser + " as your browser.\n" +
    "Unfortunately Pinch Runners has only been tested in Google Chrome. " +
    "Certain features may not work. Continue at your own risk");
}
