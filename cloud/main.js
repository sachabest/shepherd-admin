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
	var query = new Parse.Query('Prescription');
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(object) {
			if (object) {
				response.error('Prescription already existed');
				// var treatmentQuery = new Parse.Query('Treatment');
				// treatmentQuery.equalTo('Name', request.object.get('TreatmentName'));
				// treatmentQuery.first()
				// 	.then(function(treatment) {
				// 		if (treatment) {
				// 			var relation = treatment.relation('Prescriptions');
				// 			relation.add(request.object);
				// 			treatment.save().then(function() {
				// 				response.error('Object already exist. Linked to requested treatment');
				// 			}, function() {
				// 				response.error('Object already exist but failed to link to requested treatment');
				// 			});
				// 		} else {
				// 			response.error('Treatment linked not found');
				// 		}
				// 	}, function() {
				// 		response.error('Error looking up treatment');
				// 	});
			} else {
				request.object.unset('Treatment');
				response.success();
			}	
		},
		function() {
			response.error('Shit happened to your prescription bro');
		});
});

Parse.Cloud.beforeSave('Treatment', function(request, response) {
	
	var query = new Parse.Query('Treatment');
	query.equalTo('Name', request.object.get('Name'));
	query.first()
		.then(function(object) {
			if (object) {
				response.error('Object already exist');
			}
			else {
				// Search for diagnosis
				var diagnosisName = request.object.get('DiagnosisName');
				var diagQuery = new Parse.Query('Diagnosis');
				diagQuery.equalTo('Name', diagnosisName);
				diagQuery.first()
					.then(function(diagnosis) {
						if (diagnosis) {
							request.object.set('Diagnosis', diagnosis);
							request.object.unset('DiagnosisName');
							var prescriptionName = request.object.get('PrescriptionName');
							var prescriptionQuery = new Parse.Query('Prescription');
							prescriptionQuery.equalTo('Name', prescriptionName);
							prescriptionQuery.first()
								.then(function(prescription) {
									if (prescription) {
										var relation = request.object.relation('Prescriptions');
										request.object.unset('PrescriptionName');
										relation.add(prescription);
										response.success();
									} else {
										response.error('Prescription linked not found');
									}
								}, function() {
									response.error('Error looking up prescription');
								});
						}
						else {
							response.error('Diagnosis linked not found');
						}
					}, function(error) {
						console.log(JSON.stringify(error));
						response.error('Failed to look up diagnosis');
					});
			}
		}, function() {
			response.error('Error looking up Treatment');
		}); 
});