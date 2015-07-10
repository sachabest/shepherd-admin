'use strict';

var CSVParser = require('csv-parse');
var ParseWrapper = require('../models/ParseWrapper');
var _ = require('underscore');
var fs = require('fs');

var COMPLAINT_CATEGORY = 0;
var COMPLAINT_NAME = 1;
var DIAGNOSIS_STATUS = 2;
var DIAGNOSTIC_TEST = 3;
var DIAGNOSIS = 4;
var PHARMACOTHERAPY = 5;
var DOSAGE = 6;
var NON_PHARMACOTHERAPY = 7;


var recordToObject = function(record) {
    var parts;
    var complaint = {
        name: record[COMPLAINT_NAME],
        category: record[COMPLAINT_CATEGORY],
        diagnosis: record[DIAGNOSIS]
    };
    var diagnosis = {
        name: record[DIAGNOSIS],
        complaint: complaint.name
    };

    var test = {};
    var prescription = {};
    var treatment = {};

    if (record[DIAGNOSTIC_TEST]) {
        parts = record[DIAGNOSTIC_TEST].split(': $');
        test = {
            name: parts[0],
            price: parts[1],
            complaint: complaint.name
        };
    }
    
    if (record[PHARMACOTHERAPY]) {
        parts = record[PHARMACOTHERAPY].split(': $');

        treatment = {
            category: 'Pharmacotherapy',
            name: parts[0],
            price: parts[1],
            diagnosis: diagnosis.name
        };

        parts = record[DOSAGE].split(' ');
        prescription = {
            amount: parts[0],
            unit: parts[1],
            price: treatment.price,
            treatment: treatment.name
        };

    }

    if (record[NON_PHARMACOTHERAPY]) {
        parts = record[NON_PHARMACOTHERAPY].split(': $');
        treatment = {
            category: 'Non-Pharmacotherapy',
            name: parts[0],
            price: parts[1],
            diagnosis: diagnosis.name
        };
    }

    var result = {
        complaint: complaint,
        diagnosis: diagnosis,
        test: test,
        prescription: prescription,
        treatment: treatment
    };

    return result;
};

var processCSVFile = function(srcFile, columns, onNewRecord, errorHandler, done) {
	var source = fs.createReadStream(srcFile);

    var collection = [];

    var parser = new CSVParser({
        delimiter: ',', 
    });

    parser.on("readable", function(){
        var record;
        while ((record = parser.read())) {
            var object = onNewRecord(record);
            collection.push(object);
        }
    });

    parser.on("error", function(error){
        errorHandler(error);
    });

    parser.on("end", function() {
        done(collection);
    });

    source.pipe(parser);
};

var readCSVFile = function(req, res, next) {
	var filePath = req.files['csv-data'].path;

    function onError(error){
        console.log(error);
    }

    function done(collection){
        ParseWrapper.objectToParseObject(collection)
            .then(function() {
        	   res.render('confirm.ejs', {parse_items: collection});
            }, function(err) {
                res.status(200).send('Error occured ' + JSON.stringify(err));
            });
        // console.log(collection);
        // res.render('confirm.ejs', {parse_items: collection});
        // you can take this collection and render it
        // res.render('page', collection) // or something
    }

    var columns = true; 
    processCSVFile(filePath, columns, recordToObject, onError, done);
};

var saveManualEntries = function(req, res) {
    var data = req.body.data;
    console.log(req);
    console.log(data);
};

var routes = {
	readCSVFile: readCSVFile,
    saveManualEntries: saveManualEntries
};

module.exports = routes;
