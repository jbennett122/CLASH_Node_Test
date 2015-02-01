'use strict';

//Node application
//var 
  //http = require( 'http' ),
  //express = require( 'express' ),
  //app = express(),
  //url = require('url'),
  //io = require('socket.io'),

  //server = http.createServer( app );
  
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function(){
  console.log('Express server listening on port %d in %s mode',http.address().port, app.settings.env);
});
var sessionsConnections = {};


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

//test.html
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


io.on('connection', function(socket){

  sessionsConnections[socket.handshake.sessionID] = socket;
  console.log('connected to client\n')
  socket.on('text', function(msg){
    console.log('message recieved ' + msg);
    socket.emit('response', msg);
    console.log('message emitted ' + msg);
  });
});



