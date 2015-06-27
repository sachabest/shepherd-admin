'use strict';

var CSVParser = require('csv-parse');
var Parse = require('../models/ParseWrapper');
var fs = require('fs');

var processCSVFile = function(srcFile, columns, onNewRecord, errorHandler, done) {
	var source = fs.createReadStream(srcFile);

    var linesRead = 0;

    var parser = new CSVParser({
        delimiter: ',', 
    });

    parser.on("readable", function(){
        var record;
        while ((record = parser.read())) {
            onNewRecord(record);
            linesRead += 1;
        }
    });

    parser.on("error", function(error){
        errorHandler(error);
    });

    parser.on("end", function(){
        done(linesRead);
    });

    source.pipe(parser);
};

var readCSVFile = function(req, res, next) {
	var filePath = req.files['csv-data'].path;

    function onNewRecord(record){
        console.log(record);
    }

    function onError(error){
        console.log(error);
    }

    function done(linesRead){
        res.status(200).send('' + linesRead);
    }

    var columns = true; 
    processCSVFile(filePath, columns, onNewRecord, onError, done);
};

var routes = {
	readCSVFile: readCSVFile
};

module.exports = routes;