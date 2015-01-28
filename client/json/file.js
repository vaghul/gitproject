var fs = require('fs'),
    path = require('path');
    var json;
 json=fs.readFileSync(__dirname+"/test.json",'binary')
 json=JSON.parse(json,null,0);
 //console.log(json.children[0].name);
//var a=findObjectByLabel(json);
//console.log(a);
//test(json);
normalize(json);

function normalize(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            normalize(child);
        }
    }
	console.log(parent.path+"/"+ parent.name);
	if(parent.type!='file')
    mkdir(__dirname+parent.path+"/"+ parent.name);

}

function mkdir(dirPath, mode, callback) {
  //Call the standard fs.mkdir
  fs.mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      mkdir(path.dirname(dirPath), mode, callback);
      //And then the directory
      mkdir(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
};

