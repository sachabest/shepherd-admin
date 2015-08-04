'use strict';

var CSVParser = require('csv-parse');
var ParseWrapper = require('../models/ParseWrapper');
var _ = require('underscore');
var _string = require('underscore.string');
var fs = require('fs');

var COMPLAINT_CATEGORY = 0;
var COMPLAINT_NAME = 1;
var DIAGNOSIS_STATUS = 2;
var DIAGNOSTIC_TEST = 3;
var DIAGNOSIS = 4;
var PHARMACOTHERAPY = 5;
var DOSAGE = 6;
var NON_PHARMACOTHERAPY = 7;

var lastManualRecords = [];


var recordToObject = function(record) {
    // Sanitize empty lines
    var compactedRecord = _.compact(record);
    if (_.size(compactedRecord) === 0) {
        return null;
    }
    var parts;
    var complaint = {
        name: record[COMPLAINT_NAME],
        category: record[COMPLAINT_CATEGORY],
        diagnosis: record[DIAGNOSIS]
    };
    var diagnosis = {
        name: record[DIAGNOSIS],
        category: record[COMPLAINT_CATEGORY],
        complaint: complaint.name
    };

    var test = {};
    var prescription = {};
    var treatment = {};

    // console.log(record);
    if (record[DIAGNOSTIC_TEST]) {
        // console.log(record[DIAGNOSTIC_TEST]);
        parts = record[DIAGNOSTIC_TEST].split(':');
        parts[0] = _string.trim(parts[0], ':');
        // console.log(parts);
        parts[1] = _string.trim(parts[1], ' $');
        test = {
            name: parts[0],
            price: parts[1],
            category: record[COMPLAINT_CATEGORY],
            complaint: complaint.name
        };
    }
    
    if (record[PHARMACOTHERAPY]) {
        parts = record[PHARMACOTHERAPY].split(':');
        parts[0] = _string.trim(parts[0], ':');
        parts[1] = _string.trim(parts[1], ' $');
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
        parts = record[NON_PHARMACOTHERAPY].split(':');
        parts[0] = _string.trim(parts[0], ' :');
        parts[1] = _string.trim(parts[1], ' $');
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
        // Remove the uploaded file
        fs.unlink(srcFile, function(err) {
            if (err) {
                console.log('Error deleting uploaded file: ' + err);
            }
            done(collection);
        });
    });

    source.pipe(parser);
};

var readCSVFile = function(req, res, next) {
	var filePath = req.files['csv-data'].path;

    function onError(error){
        console.log(error);
    }

    function done(collection){
        collection = _.compact(collection);
        // console.log(collection);
        ParseWrapper.objectToParseObject(collection)
            .always(function() {
        	   res.render('confirm.ejs', {parse_items: collection});
            });
        // res.render('confirm.ejs', {parse_items: collection});
        // console.log(collection);
        // res.render('confirm.ejs', {parse_items: collection});
        // you can take this collection and render it
        // res.render('page', collection) // or something
    }

    var columns = true; 
    processCSVFile(filePath, columns, recordToObject, onError, done);
};

var saveManualEntries = function(req, res, next) {
    var data = req.body.fullObjects;
    ParseWrapper.objectToParseObject(data)
        .always(function() {
            lastManualRecords = data;
            res.status(200).send(data);
        });
};

var getConfirmScreen = function(req, res) {
    res.render('confirm.ejs', {parse_items: lastManualRecords});
};

var routes = {
	readCSVFile: readCSVFile,
    saveManualEntries: saveManualEntries,
    getConfirmScreen: getConfirmScreen
};

module.exports = routes;
