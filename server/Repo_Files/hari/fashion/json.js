var fs = require('fs'),
    path = require('path');
var util = require('util');

vaghul
var json=dirTree('../fashion');
//console.log(json.children[0].name);
   fs.writeFile(__dirname+"/test.json",JSON.stringify(json,null,4),'binary', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});
//console.log(util.inspect(dirTree('../json'), false, null));

function dirTree(filename) {

    var stats = fs.lstatSync(filename),
        info= {
            path: path.dirname(filename).slice(2),
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
        info.servertimestamp="00.00";
        info.localtimestamp=new Date().toString();
        info.modified="false";
    }

    return info;
}