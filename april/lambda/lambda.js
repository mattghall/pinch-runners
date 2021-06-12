const convert = require('./convert.js');
const host = "docs.google.com";
const url = "/spreadsheets/d/1tU3qY3sGw-D4hWGDx-eSQy2-Mn9rXPO55iXp9aITcwQ/export?format=csv&id=1tU3qY3sGw-D4hWGDx-eSQy2-Mn9rXPO55iXp9aITcwQ&gid=1331343005";
const headerName = "force-update";
const msInHour = 3600000;

var https = require('https');
var cache = "";
var lastCache = new Date('1995-12-17T03:24:00');
var httpOptions;


exports.handler = function(event, context, callback) {
  resetHttpOptions();
  console.log("lastCache: " + lastCache);

  if (useCache(event)) {
    callback(null, buildResp(200, cache, true));
    return;
  }

  return download(callback);
}

function download(callback) {
  console.log('start request to ' + url)
  var result = '';

  https.get(httpOptions, (response) => {
    // https://www.mattlunn.me.uk/blog/2012/05/handling-a-http-redirect-in-node-js/
    if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
      console.log("Redirecting to " + response.headers.location);
      if (!updateHttpOptions(response.headers.location)) {
        callback(null, buildResp(500, "Couldn't split url in redirect"));
        return;
      }

      // GET the redirect
      https.get(httpOptions, (response) => {
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
            callback(null, buildResp(200, result, false));
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

function buildResp(code, body, usingCache) {
  if (code == 200) {
    if (!usingCache) {
      var json = convert.parseCsv(body);
      cache = JSON.stringify(json);
      lastCache = new Date();
    }

    const resp = {
      statusCode: code,
      headers: makeHeaders(usingCache),
      body: cache,
    };
    return resp;
  } else {
    const resp = {
      statusCode: code,
      headers: makeHeaders(usingCache),
      body: JSON.stringify("{'error':'uh oh'}"),
    };
    return resp;
  }
}

function makeHeaders(usingCache) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Headers": "force-update",
    "Using-Cache": usingCache + ""
  }
}

function resetHttpOptions() {
  httpOptions = {
    hostname: host,
    path: url,
    headers: {
      "Accept": "text/csv",
      "User-Agent": "Mozilla",
      "Cookie": "troute=t1;"
    }
  }
}


function useCache(event) {
  console.log("headers: " + JSON.stringify(event.headers));
  console.log("cache: " + (cache != "" ? "exists" : "false"));
  if (cache == "" || new Date() - lastCache > msInHour) {
    console.log("Cache expired");
    return false;
  }

  if (!event.hasOwnProperty("headers") || !event.headers.hasOwnProperty(headerName) || event.headers[headerName] != "true") {
    console.log("Using cache");
    return true;
  };
  console.log("Force Update");
  return false;
}

function updateHttpOptions(location) {
  var loc = location.replace("https://", "");
  if (loc.split(".com").length != 2) {
    // TODO some errors
    console.log("Couldn't split url");
    return false;
  }

  httpOptions.hostname = loc.split(".com")[0] + ".com";
  httpOptions.path = loc.split(".com")[1];
  return true;
}
