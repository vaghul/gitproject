var http = require('http');
var fs =require('fs');
var path = require('path');

var num = process.argv[2];
var filepath = process.argv[3];


if(num==null && filepath==null)
{
  console.log("no parameter provided")
}
else 
{
var arr = num.split("/");
if(arr.length==2)
{
if(!fs.existsSync(filepath+'/'+arr[1]+'/test.json'))
  {
console.log('Cloning '+arr[1]+' ....');

//console.log(arr[0]);
//console.log(arr[1]);
var t = require('./clone_supp');
var user = {
  email: 'brandon@gmail.com',
  user:arr[0],
  folder:arr[1],
  file:'test.json'
};


var data = JSON.stringify(user);
//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: '127.0.0.1',
  path: '/git/clone',
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
      //console.log(str);
      
      str=JSON.parse(str);
      str=Buffer(str.file,'base64').toString('binary');
      var json=JSON.parse(str);
      //console.log(typeof json);
      createfolder(json);
      //console.log(arr[0]);
      createfile(json);
      //file('test.txt');
      //t.callfun('test.txt');
      console.log('Cloning '+arr[1]+' success !!!');


    }
    else
      console.log("Failure KLON file not found");
  });
}



var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
}
else
{
console.log(arr[1]+' Repo already cloned ...');
console.log(' Did you mean  ?');
console.log('   KLON Pull');
}
}// end of arr.length loop
else
console.log('The parameter provided is false');
}


function createfile(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createfile(child);
        }
    }

     if(parent.type=='file')
     {
    //console.log(parent.path+"/"+ parent.name);
    t.callfun(parent.path+"/"+ parent.name,arr[0],arr[1],filepath);
  }
     };



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
    mkdir(filepath+parent.path+"/"+ parent.name);
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
