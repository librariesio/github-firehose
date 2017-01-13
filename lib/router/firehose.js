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

    if (req.query.actor && req.query.actor.length > 0){
      if (req.query.actor.toLowerCase() !== data.actor.login.toLowerCase()) {
        return;
      }
    }

    if (req.query.type && req.query.type.length > 0){
      if (req.query.type.toLowerCase() !== data.type.toLowerCase()) {
        return;
      }
    }

    if (req.query.repo && req.query.repo.length > 0){
      if (req.query.repo.toLowerCase() !== data.repo.name.toLowerCase()) {
        return;
      }
    }

    if (req.query.org && req.query.org.length > 0){
      if (typeof data.org === "undefined" || req.query.org.toLowerCase() !== data.org.login.toLowerCase()) {
        return;
      }
    }

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
