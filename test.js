'use strict';

//Node application
var 
  http = require( 'http' ),
  express = require( 'express' ),
  app = express(),
  url = require('url'),
  io = require('socket.io'),

  server = http.createServer( app );
  

//Express Middleware
var 
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');

  app.use(morgan('combined'));
  app.use(bodyParser.json());
  app.use(methodOverride('X-HTTP-Method-Override'));
  
  morgan('combined',{
  	skip: function(req,res) {return res.statusCode < 400} 
  });


  
  app.get( '/', function ( request, response ) {
  	//response.sendStatus(200);
  	response.send( 'Hello World from Node with Express and nodemon!' );
});

  app.get('/test.html', function (request, response){
    var options = {
    	root: __dirname,// + '/public/',
    	dotfiles: 'deny',
    	headers: {
        	'x-timestamp': Date.now(),
        	'x-sent': true
    	}
  };	

    var fileName = '/test.html';
    
   response.sendFile(fileName, options, function (err) {
     if(err) {
    	if (err.code === "ECONNABORT" && response.statusCode == 304) {
      		// No problem, 304 means client cache hit, so no data sent
      		console.log('304 cache hit for ' + fileName);
      		return;
    	}
    console.error("SendFile error:", err, " (status: " + err.status + ")");
    
	if (err.status) {
	      response.status(err.status).end();
    	}
  }
  else {
    console.log('Sent:', fileName);
  }
  });

});

//Recieve Post from Website


app.post('/sendtext', function(request, response) {
	console.log("button press recieved");
  	response.send('You sent the name "' + request.body.form + '".');
	
});


server.listen( 3000 );
console.log('Express server listening on port %d in %s mode',server.address().port, app.settings.env);

//Socket.IO
var websock = io.listen(server);
websock.on('connection', function(socket){
    socket.emit('message', {'message': 'hello world from socket.io'});
});
