var _ = require('underscore');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.beforeSave('Complaint', function(request, response) {

	// Mad hacky but w/e man
    if (request.object.get('updating')) {
    	request.object.unset('updating');
    	response.success();
    }
    var query = new Parse.Query('Complaint');
    query.equalTo('Name', request.object.get('Name'));
    query.first()
    	.then(function(object) {
    		if (object) {
		        var diagnoses = object.get('Diagnoses');
		        diagnoses = _.map(diagnoses, function(diagnosis) {
					return diagnosis;
		        });

		        var inputDiagnoses = request.object.get('Diagnoses');

		        if (inputDiagnoses && inputDiagnoses.length > 0) {
		        	var exist = _.contains(diagnoses, inputDiagnoses[0]);
			        if (!exist) {
				      	object.add('Diagnoses', inputDiagnoses[0]);
				     	object.set('updating', true);
			        	object.save().then(function() {
			        		response.error('Object existed. Added new diagnoses');
			        	}, function(error) {
			        		console.log(JSON.stringify(error));
			        		response.error('Object existed. Failed to add new diagnoses');
			        	});
			        }
			        else {
			        	response.error('Object already exist');
			        }
		        }
		        else {
			        response.error('Object already exist');
			    }  
		    }
		    else {
		    	response.success();
		    }
    	}, function() {
    		response.error('Error during save');
    	});
});

Parse.Cloud.beforeSave('Test', function(request, response) {

	var query = new Parse.Query('Test');
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(test) {
			if (test) {
				response.error('Object already exist');
			}
			else {
				var complaintQuery = new Parse.Query('Complaint');
				var currentComplaint = request.object.get('ComplaintName');
				if (currentComplaint) {
					complaintQuery.equalTo('Name', currentComplaint);
					complaintQuery.first()
						.then(function(complaint) {
							if (complaint) {
								request.object.set('Complaint', complaint);
								request.object.unset('ComplaintName');
								response.success();
							} else {
								response.error('Complaint linked not found');
							}
						}, function() {
							response.error('Failed to add object');
						});
				} else {
					response.success();
				}
			}
			
		}, function() {
			response.error('Failed to add object');
		});
});

Parse.Cloud.beforeSave('Diagnosis', function(request, response) {
	var query = new Parse.Query('Diagnosis');
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(diagnosis) {
			if (diagnosis) {
				response.error('Diagnosis already exists');
			} else {
				var complaintQuery = new Parse.Query('Complaint');
				complaintQuery.equalTo('Name', request.object.get('ComplaintName'));
				complaintQuery.first()
					.then(function(complaint) {
						if (complaint) {
							request.object.set('Complaint', complaint);
							request.object.unset('ComplaintName');
							response.success();
						}
						else {
							response.error('Complaint linked not found');
						}
					}, function() {
						response.error('Error querying for complaint when updating Diagnosis');
					});
			}
			
		}, function() {
			response.error('Error querrying for existing diagnosis');
		});
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