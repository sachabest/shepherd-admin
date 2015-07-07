var _ = require('underscore');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.beforeSave('Complaint', function(request, response) {
    var Complaint = Parse.Object.extend('Complaint');
    var query = new Parse.Query(Complaint);
    query.equalTo('Name', request.object.get('Name'));
    query.first()
    	.then(function(object) {
    		if (object) {
		        var diagnoses = object.get('Diagnoses');
		        diagnoses = _.map(diagnoses, function(diagnosis) {
					return diagnosis.get('Name');
		        });

		        var exist = _.contains(diagnoses, request.object.get('Diagnoses').get('Name'));
		        if (!exist) {
			      	object.add('Diagnoses', request.object.get('Diagnosis'));
			      	return object.save();
		        	// object.save();
		        	// 	.then(function() {
		        	// 		response.error('Object existed. Added new diagnosis');
		        	// 	}, function() {
		        	// 		response.error('Objected existed and failed to add new diagnosis');
		        	// 	});
		        	// response.error();
		        }
		        else {
		        	return Parse.Promise.as(false);
		        }
		    }
    	}).then(function(object) {
    		if (object) {
    			response.error('Object existed');
    		} else {
    			response.success();
    		}
    	},  function(error) {
    		response.error('Error performing save');
    	})

});


Parse.Cloud.beforeSave('Prescription', function(request, response) {
	var Prescription = Parse.Object.extend('Prescription');
	var query = new Parse.Query(Prescription);
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(object) {
			response.error('Object already exist');
		},
		function() {
			response.success();
		});
});


Parse.Cloud.beforeSave('Diagnosis', function(request, response) {
	var Diagnosis = Parse.Object.extend('Diagnosis');
	var Complaint = Parse.Object.extend('Complaint');
	var query = new Parse.Query(Diagnosis);
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(diagnosis) {
			response.error('Object already exist');
		}, function() {
			var complaintQuery = new Parse.Query(Complaint);
			complaintQuery.equalTo('Name', request.object.get('Complaint').get('Name'));
			complaintQuery.first()
				.then(function(complaint) {
					request.object.set('Complaint', complaint);
					response.success();
				}, function() {
					response.success();
				})
		});
});

Parse.Cloud.beforeSave('Test', function(request, response) {
	var Test = Parse.Object.extend('Test');
	var Complaint = Parse.Object.extend('Complaint');
	var query = new Parse.Query(Test);
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(test) {
			response.error('Object already exist');
		}, function() {
			var complaintQuery = new Parse.Query(Complaint);
			complaintQuery.equalTo('Name', request.object.get('Complaint').get('Name'));
			complaintQuery.first()
				.then(function(complaint) {
					request.object.set('Complaint', complaint);
					response.success();
				}, function() {
					response.success();
				});
		});
});

Parse.Cloud.beforeSave('Treatment', function(request, response) {
	var Treatment = Parse.Object.extend('Treatment');
	var Diagnosis = Parse.Object.extend('Diagnosis');
	var Prescription = Parse.Object.extend('Prescription');
	var query = new Parse.Query(Treatment);

	var updatePrescription = function() {
		var prescriptionQuery = new Parse.Query(Prescription);
		prescriptionQuery.equalTo('Name', request.object.get('Prescription').get('Name'));
		prescriptionQuery.first()
			.then(function(prescription) {
				request.object.set('Prescription', prescription);
				response.success();
			}, function() {
				response.success();
			});
	};
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(test) {
			response.error('Object already exist');
		}, function() {
			var diagnosisQuery = new Parse.Query(Diagnosis);
			diagnosisQuery.equalTo('Name', request.object.get('Diagnosis').get('Name'));
			diagnosisQuery.first()
				.then(function(diagnosis) {
					request.object.set('Diagnosis', diagnosis);
					updatePrescription();
				}, function() {
					updatePrescription();
				});
		})
});