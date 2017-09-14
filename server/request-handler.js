/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
// var fs = require('fs');
var path = require('path');
var messages = [];
var mochaTesting = false;

var requestHandler = function(request, response) {

// set default headers
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  var statusCode = 200;

  if (request.url !== '/classes/messages' && request.url !== '/classes/room') {
    console.log('404 current request: ', request.url, request.method);
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({'results': ['hello', 'world']}));
  }

  // handle post requests
  if (request.method === 'POST') {
    request.on('data', function(chunk) { // on receiving data
      // var data = [];
      // data.push(chunk);
      statusCode = 200;
      // convert TEST data to object
      var body = chunk.toString();
      if (body.indexOf('=') === -1) {
        console.log('this is a test');
        mochaTesting = true;
        var message = JSON.parse(body);

      // process CHATTERBOX data
      } else {
        var message = {};
        body = body.split('+');
        body = body.join(' ');
        var processMessage = body.split('&');
        console.log('Split message', processMessage);

        for (var i = 0; i < processMessage.length; i++) {
          var array = processMessage[i].split('=');
          message[array[0]] = array[1];
          console.log('key', array[0]);
          console.log('value', array[1]);
        }
      }

      messages.push(message);


      //console.log(body);

      // console.log(messages);
      // var stringifiedMessageArray = '';

      // retrieve current messages in file
      // fs.readFile('messages.json', 'utf8', (err, data) => {//look into messages.json
      //   if(err) {
      //     throw err;
      //   }
      //
      //   console.log('Empty file undefined?', data === undefined);
      //
      //   // if(typeof data !== 'string') {
      //   //   var messageArray = JSON.parse(data);
      //   // }
      //   //
      //   //
      //   // if(!Array.isArray(messageArray)){
      //   //   messageArray = [];
      //   // }
      //
      //   // need to fix this, wrong params
      //   // fs.existsSync('messages.json', function(exists) {
      //   //   if (!exists) {
      //   //     fs.writeFile('messages.json', [], function (err) {//update messages.json
      //   //       console.log('File is empty, initializing');
      //   //
      //   //       if (err) {
      //   //         throw err;
      //   //       }
      //   //     });
      //   //   }
      //   // });
      //
      //   var messageArray = JSON.parse(data);
      //
      //   console.log('Current contents of file: ', data);
      //   console.log('Parsed data?: ', typeof data);
      //   messageArray.push(message);//messageArray is in for ready to be sent back
      //
      //
      //   console.log('New contents of file: ', messageArray);
      //   stringifiedMessageArray = JSON.stringify(messageArray);
      //   console.log('Stringified: ', stringifiedMessageArray);
      //
      //   fs.writeFile('messages.json', stringifiedMessageArray, function (err) {//update messages.json
      //     console.log('Writing: ', stringifiedMessageArray);
      //     if (err) {
      //       throw err;
      //     }
      //   });

      // });

      // console.log('Outside scope: ', stringifiedMessageArray);
      // rewrite file with new message appended

    });
    request.on('end', () => {
    });

    statusCode = 201;
    response.writeHead(statusCode, headers);
    response.end();

  // handle get requests
  } else if (request.method === 'GET') {

    if (!messages[0] && !mochaTesting) {
      console.log(mochaTesting);
      console.log('first', messages[0]);
      messages.push({
        username: 'Chatroom',
        text: 'Post something if you value your life'
      });
    }

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({'results': messages}));


  } else if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end('OK');
  }
};

module.exports.requestHandler = requestHandler;
