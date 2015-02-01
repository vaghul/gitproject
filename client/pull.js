var http = require('http');
var fs =require('fs');
var path = require('path');
var pullsupp=require('./pull_supp');
var num = process.argv[2];

var clientarray=[];
var pullfiles=[];
if(num==null)
{
  console.log("no parameter provided")
}
else 
{
var arr = num.split("/");
if(arr.length==2)
{
  var file=__dirname+"/"+arr[1]+"/test.json";
  fs.stat(file, function(err, stat) {  
if(err==null)
{
temp=fs.readFileSync(file,'binary');
temp=JSON.parse(temp);
createoldarray(temp);
var user = {
  email: 'brandon@gmail.com',
  user:arr[0],
  folder:arr[1],
  file:'test.json',
};
var data = JSON.stringify(user);
//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: '127.0.0.1',
  path: '/git/pull',
  //since we are listening on a custom port, we need to specify it by hand
  port: '3000',
  //This is what changes the request to a POST request
  method: 'POST',
  data:data,
  headers:
  {'Content-Type': 'application/json',
  'Content-Length': data.length
}
};

callback = function(response) {
  var str = ''
//console.log(response.statusCode);  
  response.setEncoding('binary');

  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    if(str!="")
    {

str=JSON.parse(str);
var json=JSON.parse(Buffer(str.file,'base64').toString('binary'));
createfolder(json);
      for(var key in clientarray)
       {
        // console.log(str.servertime+'  '+ clientarray[key]['servertimestamp']);

        if(new Date(str.servertime)>new Date(clientarray[key]['servertimestamp'])){
          var obj= {};
          obj['path']=clientarray[key]['path'];
          obj['name']=clientarray[key]['name'];
          pullfiles.push(obj);

        }
        }
        if(pullfiles.length!=0)
        pullsupp.sendfile(pullfiles,arr[0],arr[1]);
        else
          console.log('Repo upto date');

    }
  });
}

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
}
else
console.log('project does not exist');
});
}
else
console.log('The parameter provided is false');
}


function createfolder(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createfolder(child);
        }
    }

     if(parent.type!='file')
    mkdir(__dirname+parent.path+"/"+ parent.name);
     };

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
    obj['path']=parent.path;
    obj['servertimestamp']=parent.servertimestamp;
    clientarray.push(obj);
    }
}
