var events = require('events');
var https = require('https');
var util = require('util');

/**
 * Manages http requests so only one unique url is requested at a time
 *
 * @returns Requests
 */
function Firehose(accessToken) {
	events.EventEmitter.call(this);

	//Access token
	this.accessToken = accessToken === undefined ? false : accessToken.toString();

	//Most recent event
	this.lastEvent = 0;

	//Interval time (once a second)
	this.intervalTime = 1 * 1000;
	this.interval = null;

}

util.inherits(Firehose, events.EventEmitter);

/**
 * Start sending events
 *
 * @returns void
 */
Firehose.prototype.start = function() {
	//Stop if running already
	this.stop();

	//Start the polling interval
	this.interval = setInterval(function(){
		this.makeRequest();
	}.bind(this), this.intervalTime);
}

/**
 * Stop consuming sending events
 *
 * @returns void
 */
Firehose.prototype.stop = function() {
	//Clear any previous interval
	if (this.interval !== null) {
		clearInterval(this.interval);
	}
}

/**
 * Make a request to the Github event API
 *
 * @returns void
 */
Firehose.prototype.makeRequest = function() {

	//Request options
	var options = {
		host: 'api.github.com',
		port: 443,
		path: '/events?page=1&per_page=100&rand=' + Math.random(),
		method: 'GET',
		headers: {
			'user-agent': 'firehose',
			'Content-Type': 'application/json; charset=utf-8',
			'Accept': 'application/json',
			'Host': 'api.github.com',
			'Authorization': 'token ' + this.accessToken
		}
	}

	//Response
	var request = https.request(options, function(response) {

		//Collect the body
		var body = '';
		response.on('data', function (chunk) {
			body += chunk.toString('utf8');
		});

		//Respond with whole body
		response.on('end', function () {
			//JSON
			var json = JSON.parse(body);
			var lowestTime = 0;
			if(json){
				json.forEach(function(event){
					//Get the event
					var eventTime = Date.parse(event.created_at);

					//Process if the event is new
					if (eventTime > this.lastEvent) {
						this.emit('event', event);
					}

					//Get the lowest time from the request
					if (lowestTime < eventTime) {
						lowestTime = eventTime;
					}
				}.bind(this));
			}

			//Set the last event
			this.lastEvent = lowestTime;


		}.bind(this));

		//Error with response
		response.on('error', function(e) {
			this.emit('error', new Error('Response error: ' . e.message));
		}.bind(this));

	}.bind(this));

	//Request error handler
	request.on('error', function(e) {
		this.emit('error', new Error('Request error: ' . e.message));
	}.bind(this));

	//End the request and start receiving the response
	request.end();

}


module.exports = Firehose;
