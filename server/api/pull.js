var fs=require('fs'),
path = require('path');
var serverarray=[];

var pull= function (req, res) {
 


  var file=__dirname+'/../Repo_Files/'+req.param('user')+'/'+req.param('folder')+'/'+req.param('file');
  

var temp = fs.readFileSync(file);
temp=JSON.parse(temp);
createoldarray(temp);
//console.log(temp);
var servertime=serverarray[0]['servertimestamp'];
console.log(servertime);
var test = fs.readFileSync(__dirname+'/../Repo_Files/'+req.param('user')+'/'+req.param('folder')+'/test.json');
    
    var block= Buffer(test).toString('base64');


var user = {
  servertime:servertime,
  file: block
};
    res.json(user);

	
console.log("pull Requested on project "+req.param('folder') +" by "+ req.param('email'));
serverarray=[];
};

var pullfiles= function (req, res) {
var fileobj=[];


var files=req.param('file');
for(var key in files)
       {
var obj={};

 var file=__dirname+'/../Repo_Files/'+req.param('user')+'/'+files[key]['path']+'/'+files[key]['name'];
 var temp=fs.readFileSync(file,'binary');
 var block= Buffer(temp).toString('base64');
 obj['path']=files[key]['path'];
 obj['name']=files[key]['name'];
 obj['file']=block;
 fileobj.push(obj);
 console.log('loading file'+files[key]['path']+'/'+files[key]['name'])
}

//console.log(fileobj.length);


    res.json(fileobj);
console.log("pull Requested on project "+req.param('folder') +" responded");



};

function createoldarray(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createoldarray(child);
        }
    }
    //console.log(parent.name);
    if(parent.type!='folder')
    {
    var obj= {};
    obj['name']=parent.name;
    obj['servertimestamp']=parent.servertimestamp;
    serverarray.push(obj);
    }
}



exports.pull=pull;
exports.pullfiles=pullfiles;