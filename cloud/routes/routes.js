'use strict';

var CSVParser = require('csv-parse');
var Parse = require('../models/ParseWrapper');
var fs = require('fs');

var COMPLAINT_CATEGORY = 0;
var COMPLAINT_NAME = 1;
var DIAGNOSIS_STATUS = 2;
var DIAGNOSTIC_TEST = 3;
var DIAGNOSIS = 4;
var PHARMACOTHERAPY = 5;
var NON_PHARMACOTHERAPY = 6;

var recordToObject = function(record) {
    var parts;
    var complaint = {
        name: record[COMPLAINT_NAME],
        category: record[COMPLAINT_CATEGORY]
    };
    var diagnosis = {
        name: record[DIAGNOSIS]
    };

    var test;
    var prescription;
    var treatment;

    if (record[DIAGNOSTIC_TEST]) {
        parts = record[DIAGNOSTIC_TEST].split(': ');
        test = {
            name: parts[0],
            price: parts[1]
        };
    }
    
    if (record[PHARMACOTHERAPY]) {
        parts = record[PHARMACOTHERAPY].split(': ');
        prescription = {
            name: parts[0],
            price: parts[1]
        };

        treatment = {
            category: 'Pharmacotherapy',
            name: parts[0],
            price: parts[1]
        };
    }

    if (record[NON_PHARMACOTHERAPY]) {
        parts = record[NON_PHARMACOTHERAPY].split(': ');
        treatment = {
            category: 'Non-Pharmacotherapy',
            name: parts[0],
            price: parts[1],
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
            collection.push(onNewRecord(record));
        }
    });

    parser.on("error", function(error){
        errorHandler(error);
    });

    parser.on("end", function() {
        console.log(collection);
        done('Parsed all records');
    });

    source.pipe(parser);
};

var readCSVFile = function(req, res, next) {
	var filePath = req.files['csv-data'].path;

    function onError(error){
        console.log(error);
    }

    function done(linesRead){
        res.status(200).send('' + linesRead);
    }

    var columns = true; 
    processCSVFile(filePath, columns, recordToObject, onError, done);
};

var routes = {
	readCSVFile: readCSVFile
};

module.exports = routes;