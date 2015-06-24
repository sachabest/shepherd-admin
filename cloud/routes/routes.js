'use strict';

var CSVParser = require('csv-parse');
var Parse = require('models/ParseWrapper');
var fs = require('fs');

var processCSVFile = function(srcFile, columns, onNewRecord, errorHandler, done) {
	var source = fs.createReadStream(srcFile);

    var linesRead = 0;

    var parser = new CSVParser({
        delimiter: ',', 
        columns: columns
    });

    parser.on("readable", function(){
        var record;
        while ((record = parser.read())) {
            onNewRecord(record);
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
	var filePath = req.files.file.path;
    console.log(filePath);
    function onNewRecord(record){
        console.log(record);
    }

    function onError(error){
        console.log(error);
    }

    function done(linesRead){
        res.send(200, linesRead);
    }

    var columns = true; 
    processCSVFile(filePath, columns, Parse.recordToParseObject, onError, done);
};

var routes = {
	readCSVFile: readCSVFile
};

module.exports = routes;