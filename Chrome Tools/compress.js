const UglifyJS = require("uglify-js");
const Uglifycss = require("uglifycss");
const fs = require('fs');

var minifedFolder = "minified";
var jsFolder = "js";
var cssFolder = "css";
var htmlFolder = "html";

fs.readFile(htmlFolder + "/background.html", function (err, data) {
    if (err) {
      return console.error(err);
    }
    var contents = data.toString();
    var index = 0;
    var filenames = [];
    var pattern = /<script src=\"(.*)\"><\/script>\r\n/;
    var backgroundFileName = "background.js"
    var result;
    var startIndex = 0;
    while (result = pattern.exec(contents)) {
        contents = contents.substring(0,result.index) + contents.substring(result.index + result[0].length);
        filenames.push(result[1].substring(1)); //remove leading slash
        startIndex = result.index;
    }
    var result = UglifyJS.minify(filenames,{mangle:{toplevel:true},output:{ascii_only:true}});
    fs.writeFile(minifedFolder + "/" + jsFolder + "/" + backgroundFileName, result.code, function() {
        if (err) {
          return console.error(err);
        }
    });
    contents = contents.substring(0,startIndex) + "<script src=\"/" + jsFolder + "/" + backgroundFileName + "\"></script>" + contents.substring(startIndex);
    fs.writeFile(minifedFolder + "/" + htmlFolder + "/background.html", contents, function() {
        if (err) {
          return console.error(err);
        }
    });
    fs.readdir(jsFolder, function(err, files) {
        for (var i = 0 ; i < filenames.length ; i++) {
            for (var j = 0 ; j < files.length ; j++) {
                //remove leading js/ if jsFolder changes, change
                if (files[j] === filenames[i].substring(3)) {
                    files.splice(j,1);
                    break;
                }
            }
        }
        for (var i = 0 ; i < files.length ; i++) {
            var mini = UglifyJS.minify(filenames,{mangle:{toplevel:true},output:{ascii_only:true}});
            fs.writeFile(minifedFolder + "/" + jsFolder + "/" + files[i], mini.code, function() {
                if (err) {
                  return console.error(err);
                }
            });
        }
    });
    fs.readdir(htmlFolder, function(err, files) {
        for (var j = 0 ; j < files.length ; j++) {
            //remove leading js/ if jsFolder changes, change
            if (files[j] === "background.html") {
                files.splice(j,1);
                break;
            }
        }
        for (var i = 0 ; i < files.length ; i++) {
        	fs.readFile(htmlFolder + "/" + files[i], function (err, data) {
			    if (err) {
			      return console.error(err);
			    }
	            fs.writeFile(minifedFolder + "/" + htmlFolder + "/" + files[i], data.toString, function() {
	                if (err) {
	                  return console.error(err);
	                }
	            });
        	});
        }
    });
});

fs.readdir(cssFolder, function(err, files) {
    for (var i = 0 ; i < files.length ; i++) {
        var mini = Uglifycss.processFiles([cssFolder + "/" + files[i]]);
        fs.writeFile(minifedFolder + "/" + cssFolder + "/" + files[i], mini, function() {
            if (err) {
              return console.error(err);
            }
        });
    }
});
