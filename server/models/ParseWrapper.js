'use strict';

var Parse = require('parse').Parse;

// Parse info
var clientKey = '6XbLtHBOgarLeMI7ISWqjBqZfBno6lffUsMxJklP';
var appId = 'sC51qbtpTGmAuGNXHEQO61uvIYEoC7XClyIuIOb7';

Parse.initialize(appId, clientKey);

var Complaint = Parse.Object.extend({
	className: 'Complaint',

	initialize: function(opts) {
		this.category = opts.category;
		this.complaint = opts.complaint;
		this.diagnoses = [];
	}
});

var Diagnosis = Parse.Object.extend({
	className: 'Diagnosis',

	initialize: function(opts) {
		this.category = opts.category;
		this.name = opts.name;
	}
});

var Test = Parse.Object.extend({
	className: 'Test',

	initialize: function(opts) {
		this.name = opts.name;
		this.price = opts.price;
	}
});

var Prescription = Parse.Object.extend({
	className: 'Prescription',

	initialize: function(opts) {
		this.name = opts.name;
		this.price = opts.price;
	}
});

var Treatment = Parse.Object.extend({
	className: 'Treatment',

	initialize: function(opts) {
		this.category = opts.category;
		this.name = opts.name;
		this.price = opts.price;
	}
});

var objectToParseObject = function(object) {
	var complaint = new Complaint(object.complaint);
	// var diagnosis = new Diagnosis(object.diagnosis);
	// var test = new Test(object.test);
	// var treatment = new Treatment(object.treatment);
	// var prescription = new Prescription(object.prescription);

	// Save objects
	console.log(complaint);
	complaint.save().then(function(object) {
		console.log('Saved ' + object);
	});
	// diagnosis.save();
	// test.save();
	// treatment.save();
	// prescription.save();
};

var ParseWrapper = {
	objectToParseObject: objectToParseObject,
};

module.exports = ParseWrapper;


