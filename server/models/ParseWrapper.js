'use strict';

var Parse = require('parse').Parse;
var _ = require('underscore');

// Parse info
var javascriptKey = 'zmtHF2joVCAOOLOHZRogYCVCxgJHsaBHJ9m52jVc';
var appId = 'sC51qbtpTGmAuGNXHEQO61uvIYEoC7XClyIuIOb7';

Parse.initialize(appId, javascriptKey);

var Complaint = Parse.Object.extend({
	className: 'Complaint',

	initialize: function(opts) {
		this.Category = opts.category;
		this.Name = opts.name;
		this.Diagnoses = [opts.diagnosis];
	}
});

var Diagnosis = Parse.Object.extend({
	className: 'Diagnosis',

	initialize: function(opts, complaintReference) {
		this.Category = opts.category;
		this.Name = opts.name;
		if (complaintReference) {
			this.Complaint = complaintReference;
		}
	}
});

var Test = Parse.Object.extend({
	className: 'Test',

	initialize: function(opts, complaintReference) {
		this.Name = opts.name;
		this.Price = opts.price;
		if (complaintReference) {
			this.Complaint = complaintReference;
		}
	}
});

var Prescription = Parse.Object.extend({
	className: 'Prescription',

	initialize: function(opts) {
		this.Name = opts.name;
		this.Price = opts.price;
	}
});

var Treatment = Parse.Object.extend({
	className: 'Treatment',

	initialize: function(opts, diagnosisReference, prescriptionReference) {
		this.Category = opts.category;
		this.Name = opts.name;
		this.Price = opts.price;
		if (diagnosisReference) {
			this.Diagnosis = diagnosisReference;
		}
		if (prescriptionReference) {
			this.Prescription = prescriptionReference;
		}
	}
});

var objectToParseObject = function(objects) {
	var complaints = _.map(objects, function(object){
		return new Complaint(object.complaint);
	});

	var diagnoses = _.map(objects, function(object) {
		var complaint = _.find(complaints, function(compl) {
			if (compl.Name === object.diagnosis.complaint) {
				return compl;
			}
		});
		return new Diagnosis(object.diagnosis, complaint);
	});

	var tests = _.map(objects, function(object) {
		var complaint = _.find(complaints, function(compl) {
			if (compl.Name === object.test.complaint) {
				return compl;
			}
		});
		return new Test(object.test, complaint);
	});

	var prescriptions = _.map(objects, function(object) {
		return new Prescription(object.prescription);
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
		return new Treatment(object.treatment, diagnosis, prescription);
	});

	// console.log(complaints);
	// console.log(treatments);

	// Save objects

	var complaintsPromise;
	var prescriptionPromise;
	var diagnosesPromise;
	var testsPromise;
	var treatmentsPromise;


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

	var parsePromise = Parse.Object.saveAll(complaints);
	
	return parsePromise;
};

var ParseWrapper = {
	objectToParseObject: objectToParseObject,
};

module.exports = ParseWrapper;


