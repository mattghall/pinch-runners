const host = "docs.google.com";
const url = "/spreadsheets/d/1tU3qY3sGw-D4hWGDx-eSQy2-Mn9rXPO55iXp9aITcwQ/export?format=csv&id=1tU3qY3sGw-D4hWGDx-eSQy2-Mn9rXPO55iXp9aITcwQ&gid=1607198460";

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
      }
      var ho = loc.split(".com")[0] + ".com"
      var pa = loc.split(".com")[1];

      options.hostname = loc.split(".com")[0] + ".com";
      options.path = loc.split(".com")[1];

      // GET the redirect
      https.get(options, (response) => {
        if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
          callback(null, buildResp(response.statusCode, "Likely redirected more than once"));
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
          }
          console.log("error");
          callback(null, buildResp(500, "error"));
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

function buildResp(code, body) {
  if (code == 200) {
    const resp = {
      statusCode: code,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: body,
    };
    return resp;
  } else {
    const resp = {
      statusCode: code,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: body,
    };
    return resp;
  }

}
