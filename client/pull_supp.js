var http = require('http');
var fs =require('fs');

var folderarray=[];
/*var num = process.argv[2];
if(num==null)
{
  console.log("no parameter provided")
}*/
    
var sendfile=function(data,username,foldername){

  var test = fs.readFileSync(__dirname+'/'+foldername+'/test.json');
  test=JSON.parse(test);
   createfolderarray(test);
   console.log(folderarray);
  var user = {
  email: 'brandon@gmail.com',
  user:username,
  folder:foldername,
  file: data,
};


var data = JSON.stringify(user);
//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: '127.0.0.1',
  path: '/git/pullfiles',
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
      for(var key in str)
       {
      //  console.log(str[key]['path']);
        //console.log(str[key]['name']);
        //console.log(str[key]['file']);    
        var content=Buffer(str[key]['file'],'base64').toString('binary');
        //console.log(content);
        fs.writeFileSync(__dirname+"/"+str[key]['path']+"/"+str[key]['name'],content); 
       }

      
      }
     
});
}


var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
};

function createfolderarray(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createfolderarray(child);
        }
    }
  // console.log(parent.name);
    if(parent.type=='folder')
    {
    var obj= {};
    obj['name']=parent.name;
    obj['path']=parent.path;
     folderarray.push(obj);
    }
}


exports.sendfile=sendfile;