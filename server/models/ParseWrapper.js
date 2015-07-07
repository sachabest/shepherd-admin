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
		this.set('Category', opts.category);
		this.set('Name', opts.name);
		if (opts.diagnosis) {
			this.set('Diagnoses', [opts.diagnosis]);
		}
	}
});

var Diagnosis = Parse.Object.extend({
	className: 'Diagnosis',

	initialize: function(attr, opts, complaintReference) {
		this.set('Category', opts.category);
		this.set('Name', opts.name);
		this.set('Complaint', complaintReference);
	}
});

var Test = Parse.Object.extend({
	className: 'Test',

	initialize: function(attr, opts, complaintReference) {
		this.set('Name', opts.name);
		this.set('Price', opts.price);
		this.set('Complaint', complaintReference);		
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

var objectToParseObject = function(objects) {
	var complaints = _.map(objects, function(object){
		return new Complaint(null, object.complaint);
	});

	var diagnoses = _.map(objects, function(object) {
		var complaint = _.find(complaints, function(compl) {
			if (compl.Name === object.diagnosis.complaint) {
				return compl;
			}
		});
		return new Diagnosis(null, object.diagnosis, complaint);
	});

	var tests = _.map(objects, function(object) {
		var complaint = _.find(complaints, function(compl) {
			if (compl.Name === object.test.complaint) {
				return compl;
			}
		});
		return new Test(null, object.test, complaint);
	});

	var prescriptions = _.map(objects, function(object) {
		return new Prescription(null, object.prescription);
	});

	var treatments = _.map(objects, function(object) {
		var diagnosis = _.find(diagnoses, function(diag) {
			if (diag.Name === object.treatment.diagnosis) {
				return diag;
			}
		});
		var prescription;
		if (object.treatment.category === 'Pharmacotherapy') {
			prescription = _.find(prescriptions, function(pres) {
				if (pres.name === object.treatment.name) {
					return pres;
				}
			});
		}
		return new Treatment(null, object.treatment, diagnosis, prescription);
	});

	// console.log(complaints);
	// console.log(treatments);

	// Save object

	var complaintPromise = Parse.Promise.as();
	_.each(complaints, function(complaint) {
		complaintPromise = complaintPromise.then(function() {
			return complaint.save();
		});
	});

	// _.each()

	// var parsePromise = Parse.Object.saveAll(complaints)
	// 	.then(function() {
	// 		return Parse.Object.saveAll(prescriptions);
	// 	}, function(error) {
	// 		console.log(error);
	// 		return error;
	// 	})
	// 	.then(function() {
	// 		return Parse.Object.saveAll(diagnoses);
	// 	}, function(error) {
	// 		return Parse.Promise.error(error);
	// 	})
	// 	.then(function() {
	// 		return Parse.Object.saveAll(tests);
	// 	}, function(error) {
	// 		return Parse.Promise.error(error);
	// 	})
	// 	.then(function() {
	// 		return Parse.Object.saveAll(treatments);
	// 	}, function(error) {
	// 		return Parse.Promise.error(error);
	// 	});

	// var parsePromise = Parse.Object.saveAll(complaints);
	
	// return parsePromise;
	return complaintPromise;
};

var ParseWrapper = {
	objectToParseObject: objectToParseObject,
};

module.exports = ParseWrapper;


