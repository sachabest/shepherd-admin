'use strict';

var Parse = require('parse').Parse;

// Parse info
var clientKey = '6XbLtHBOgarLeMI7ISWqjBqZfBno6lffUsMxJklP';
var appId = 'sC51qbtpTGmAuGNXHEQO61uvIYEoC7XClyIuIOb7';

var COMPLAINT = 1;
var DIAGNOSIS_STATUS = 2;
var DIAGNOSIS = 3;
var DIAGNOSTIC_TEST = 4;
var PHARMA_TREATMENT = 6;
var NON_PHARMA_TREATMENT = 8;

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

var recordToParseObject = function(record) {

	// Parse record into objects
	var complaint = new Complaint(record[0], record[COMPLAINT]);
	var diagnosis;
	var dianosticTest;
	var treatment;
	var prescription;
	var parts;
	if (record[DIAGNOSIS_STATUS] === 'Has diagnosis') {
		diagnosis = new Diagnosis(record[DIAGNOSIS]);
		parts = record[PHARMA_TREATMENT].split(': ');
		prescription = new Prescription(parts[0], parts[1]);
		parts = record[NON_PHARMA_TREATMENT].split(': ');
		treatment = new Treatment(parts[0], parts[1]);
	} else {
		parts = record[DIAGNOSTIC_TEST].split(': ');
		dianosticTest = new DiagnosticTest(parts[0], parts[1]);
	}
	
	// Creating relationships
	if (diagnosis) {
		diagnosis.addTreatment();
	}

};

var ParseWrapper = {
	recordToParseObject: recordToParseObject,
};

module.exports = ParseWrapper;


