var http = require('http');
var fs =require('fs');
var path = require('path');

var pushfile=function (username,foldername)
{


if(fs.existsSync(__dirname+'/'+foldername+'/committest.json'))
  {
console.log('pushing '+foldername+' ....');
 var commitjson=fs.readFileSync('./'+foldername+'/committest.json');
 var testjson=fs.readFileSync('./'+foldername+'/test.json');
 testjson=JSON.parse(testjson);
  commitjson=JSON.parse(commitjson);
 testjson.commit=commitjson.commit;
 fs.writeFileSync('./'+foldername+'/test.json',JSON.stringify(testjson,null,4));
 changetime(commitjson);
var user = {
  email: 'brandon@gmail.com',
  user:username,
  folder:foldername,
  file:commitjson
};


var data = JSON.stringify(user);
//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: '127.0.0.1',
  path: '/git/pushtest',
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
     // console.log(str);
      //console.log(typeof str);
     fs.writeFileSync('./'+foldername+'/test.json',JSON.stringify(str,null,4));
 
      console.log('push '+foldername+' success !!!');


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
console.log('commit first');

}
};


function changetime(parent)
{

 if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
             changetime(child);
        }
    }
  if(parent.type == 'file')
  {
    parent.servertimestamp = new Date().toString();  
  }

 

};

exports.pushfile=pushfile;