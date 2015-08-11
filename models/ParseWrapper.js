'use strict';

var Parse = require('parse').Parse;
var _ = require('underscore');

// Parse info
var javascriptKey = 'zmtHF2joVCAOOLOHZRogYCVCxgJHsaBHJ9m52jVc';
var appId = 'sC51qbtpTGmAuGNXHEQO61uvIYEoC7XClyIuIOb7';

Parse.initialize(appId, javascriptKey);

var Complaint = Parse.Object.extend({
	className: 'Complaint',

	initialize: function(attr, opts) {
		if (opts) {
			this.set('Category', opts.category);
			this.set('Name', opts.name);
			if (opts.diagnosis) {
				this.set('Diagnoses', [opts.diagnosis]);
			}
		}
	}
});

var Diagnosis = Parse.Object.extend({
	className: 'Diagnosis',

	initialize: function(attr, opts) {
		if (opts) {
			this.set('Category', opts.category);
			this.set('Name', opts.name);
			this.set('ComplaintName', opts.complaint);
		}
	}
});

var Test = Parse.Object.extend({
	className: 'Test',

	initialize: function(attr, opts) {
		this.set('Name', opts.name);
		this.set('Price', Number(opts.price));	
		this.set('ComplaintName', opts.complaint);
		if (opts.category) {
			this.set('Category', opts.category);
		}
	}
});

var Prescription = Parse.Object.extend({
	className: 'Prescription',

	initialize: function(attr, opts) {
		this.set('Name', opts.amount + opts.unit + Number(opts.price));
		this.set('Price', Number(opts.price));
		this.set('Amount', Number(opts.amount));
		this.set('Units', opts.unit);
		this.set('Treatment', opts.treatment);
	}
});

var Treatment = Parse.Object.extend({
	className: 'Treatment',

	initialize: function(attr, opts) {
		this.set('Category', opts.category);
		this.set('Name', opts.name);
		this.set('Price', Number(opts.price));
		this.set('DiagnosisName', opts.diagnosis);
		this.set('PrescriptionName', opts.prescription);
	}
});

var saveObjectsSequentially = function(objects, prevPromise) {
	var promise = (prevPromise) ? prevPromise : Parse.Promise.as();
	_.each(objects, function(object) {
		promise = promise.always(function() {
			return object.save();
		});
	});
	return promise;
};

var objectToParseObject = function(objects) {
	// console.log(objects);
	var complaints = _.map(objects, function(object) {
		if (object.complaint) {
			return new Complaint(null, object.complaint);
		}
	});

	complaints = _.compact(complaints);

	var tests = _.map(objects, function(object) {
		if (object.test) {
			return new Test(null, object.test);
		}
	});

	tests = _.compact(tests);

	var diagnoses = _.map(objects, function(object) {
		if (object.diagnosis && object.diagnosis.name) {
			return new Diagnosis(null, object.diagnosis);
		}
	});

	diagnoses = _.compact(diagnoses);

	var prescriptions = _.map(objects, function(object) {
		// console.log(object.prescription);
		console.log(object.prescription);
		if (object.prescription && object.prescription.amount) {
			return new Prescription(null, object.prescription);
		}
	});

	prescriptions = _.compact(prescriptions);

	var treatments = _.map(objects, function(object) {
		// console.log(object.treatment);
		if (object.treatment) {
			return new Treatment(null, object.treatment);
		}
	});

	treatments = _.compact(treatments);

	var complaintPromise = saveObjectsSequentially(complaints);
	var testPromise = saveObjectsSequentially(tests, complaintPromise);
	var diagnosesPromise = saveObjectsSequentially(diagnoses, testPromise);
	var treatmentsPromise = saveObjectsSequentially(treatments, diagnosesPromise);
	var prescriptionPromise = saveObjectsSequentially(prescriptions, treatmentsPromise);

	// return prescriptionPromise;
	return complaintPromise;
};

// var saveAllObjects = function(complaints, tests, diagno)

var ParseWrapper = {
	objectToParseObject: objectToParseObject,
};

module.exports = ParseWrapper;


