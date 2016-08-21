/*jshint strict:true, trailing:false, unused:true, node:true */
'use strict';

var EventEmitter = require('eventemitter3');
var emitter = new EventEmitter();

var rx = function(data) {
  emitter.emit('event', data);
};

var tx = function(req, res) {
  res.writeHead(200, {
    'Content-Type':   'text/event-stream',
    'Cache-Control':  'no-cache',
    'Connection':     'keep-alive'
  });

  // Heartbeat
  var nln = function() {
    res.write('\n');
  }
  var hbt = setInterval(nln, 15000);

  var onEvent = function(data){
    res.write("retry: 500\n");
    res.write(`event: event\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.on('event', onEvent);

  // Clear heartbeat and listener
  req.on('close', function() {
    clearInterval(hbt);
    emitter.removeListener('event', onEvent);
  });
};

module.exports = {
  rx: rx,
  tx: tx
};
