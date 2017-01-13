/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var express      = require('express');
var router       = require('./lib/router');
var cors         = require('cors')

var app = express();
app.use(express.static('public'))

var Firehose = require('./lib/github-firehose');

//Create a new instance
var firehose = new Firehose(process.env.ACCESS_TOKEN);

//Add event handler
firehose.on('event', router.firehose.rx);

//Start consuming
firehose.start();

app.get('/events', cors(), router.firehose.tx);

var port = process.env.PORT || 5001;
app.listen(port, function() {
  console.log('Listening on', port);
});
