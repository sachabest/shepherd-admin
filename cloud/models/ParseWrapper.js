'use strict';

var Parse = require('parse');

// Parse info
var clientKey = '6XbLtHBOgarLeMI7ISWqjBqZfBno6lffUsMxJklP';
var appId = 'sC51qbtpTGmAuGNXHEQO61uvIYEoC7XClyIuIOb7';

Parse.initialize(appId, clientKey);

var recordToParseObject = function(record) {

};

var ParseWrapper = {
	recordToParseObject: recordToParseObject,
};

module.exports = ParseWrapper;


