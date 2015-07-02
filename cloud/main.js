require('cloud/app.js');
var _ = require('underscore');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.beforeSave('Complaint', function(request, response) {
    var Complaint = Parse.Object.extend('Complaint');
    var query = new Parse.Query(Complaint);
    query.equalTo('name', request.object.get('name'));
    query.first()
    	.then(function(object) {
    		if (object) {
		        var diagnoses = object.get('diagnoses');
		        diagnoses = _.map(diagnoses, function(diagnosis) {
					return diagnosis.get('name');
		        });

		        var exist = _.contains(diagnoses, request.object.get('diagnosis').get('name'));
		        if (!exist) {
			      	object.add('diagnoses', request.object.get('diagnosis'));
		        	response.success();
		        }
		        else {
		        	response.error('Object already exist');
		        }
		    }
    	});
});


