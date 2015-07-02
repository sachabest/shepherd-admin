'use strict';

var Parse = require('parse').Parse;

// Parse info
var clientKey = '6XbLtHBOgarLeMI7ISWqjBqZfBno6lffUsMxJklP';
var appId = 'sC51qbtpTGmAuGNXHEQO61uvIYEoC7XClyIuIOb7';

Parse.initialize(appId, clientKey);

var Complaint = Parse.Object.extend({
	className: 'Complaint',

	initialize: function(category, complaint) {
		this.category = category;
		this.complaint = complaint;
		this.diagnoses = [];
	},

	addDiagnosis: function(diagnosis) {
		this.diagnoses.push(diagnosis);
	}
});

var Diagnosis = Parse.Object.extend({
	className: 'Diagnosis',

	initialize: function(category, name) {
		this.category = category;
		this.name = name;
	},

	addTreatment: function(treatment) {

	},

	addPrescription: function(prescription) {

	}
});

var DiagnosticTest = Parse.Object.extend({
	className: 'DiagnosticTest',

	initialize: function(name, price) {
		this.name = name;
		this.price = price;
	}
});

var Prescription = Parse.Object.extend({
	className: 'Prescription',

	initialize: function(name, price) {
		this.name = name;
		this.price = price;
	}
});

var Treatment = Parse.Object.extend({
	className: 'Treatment',

	initialize: function(name, price) {
		this.name = name;
		this.price = price;
	}
});

var objectToParseObject = function(object) {

};

var ParseWrapper = {
	objectToParseObject: objectToParseObject,
};

module.exports = ParseWrapper;


