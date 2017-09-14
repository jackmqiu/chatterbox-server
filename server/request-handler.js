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
var fs = require('fs');
var path = require('path');
var messages = [];
var requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log(request);
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  console.log(request.body);



  // The outgoing status.
  var statusCode = 200;

  // if request type is POST
    // get, parse request body
    // add to file fs.appendFile
  if (request.method === 'POST') {
    request.on('data', function(chunk) { // on receiving data
      // var data = [];
      // data.push(chunk);

      // convert data to object
      var body = chunk.toString();
      var message = {};
      var processMessage = body.split('&');
      for (var i = 0; i < processMessage.length; i++) {
        var array = processMessage[i].split('=');
        message[array[0]] = array[1];
      }

      var stringifiedMessageArray = '';

      // retrieve current messages in file
      fs.readFile('messages.json', 'utf8', (err, data) => {//look into messages.json
        if(err) {
          throw err;
        }

        console.log('Empty file undefined?', data === undefined);

        if(typeof data !== 'string') {
          var messageArray = JSON.parse(data);
        }


        if(!Array.isArray(messageArray)){
          messageArray = [];
        }

        console.log('Current contents of file: ', data);
        console.log('Parsed data?: ', typeof data);
        messageArray.push(message);//messageArray is in for ready to be sent back


        console.log('New contents of file: ', messageArray);
        stringifiedMessageArray = JSON.stringify(messageArray);
        console.log('Stringified: ', stringifiedMessageArray);

        fs.writeFile('messages.json', stringifiedMessageArray, function (err) {//update messages.json
          console.log('Writing: ', stringifiedMessageArray);
          if (err) {
            throw err;
          }
        });

      });

      // console.log('Outside scope: ', stringifiedMessageArray);
      // rewrite file with new message appended

    }).on('end', () => {});

    statusCode = 201;
  } //end of POST ********************************************************************

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  response.end(JSON.stringify({'results': ['hello', 'world']}));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports = requestHandler;
