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
		if (opts.name) {
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
	}
});

var Prescription = Parse.Object.extend({
	className: 'Prescription',

	initialize: function(attr, opts) {
		this.set('Category', opts.category);
		this.set('Price', opts.price);
	}
});

var Treatment = Parse.Object.extend({
	className: 'Treatment',

	initialize: function(attr, opts, diagnosisReference, prescriptionReference) {
		this.set('Category', opts.category);
		this.set('Name', opts.name);
		this.set('Price', opts.price);
		this.set('Diagnosis', diagnosisReference);
		this.set('Prescription', prescriptionReference);
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
	var complaints = _.map(objects, function(object){
		return new Complaint(null, object.complaint);
	});

	var tests = _.map(objects, function(object) {
		return new Test(null, object.test);
	});

	var diagnoses = _.map(objects, function(object) {
		if (object.diagnosis.name) {
			return new Diagnosis(null, object.diagnosis);
		}
	});

	diagnoses = _.filter(diagnoses, function(diagnosis) {
		if (diagnosis) {
			return diagnosis;
		}
	});

	// var prescriptions = _.map(objects, function(object) {
	// 	return new Prescription(null, object.prescription);
	// });

	// var treatments = _.map(objects, function(object) {
	// 	var diagnosis = _.find(diagnoses, function(diag) {
	// 		if (diag.Name === object.treatment.diagnosis) {
	// 			return diag;
	// 		}
	// 	});
	// 	var prescription;
	// 	if (object.treatment.category === 'Pharmacotherapy') {
	// 		prescription = _.find(prescriptions, function(pres) {
	// 			if (pres.name === object.treatment.name) {
	// 				return pres;
	// 			}
	// 		});
	// 	}
	// 	return new Treatment(null, object.treatment, diagnosis, prescription);
	// });

	// Save object

	// var complaintPromise = saveObjectsSequentially(complaints);

	// var testPromise = saveObjectsSequentially(tests, complaintPromise);
	console.log(diagnoses);

	var diagnosesPromise = saveObjectsSequentially(diagnoses);

	return diagnosesPromise;
};

var ParseWrapper = {
	objectToParseObject: objectToParseObject,
};

module.exports = ParseWrapper;


