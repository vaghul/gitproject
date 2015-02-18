var http = require('http');
var fs =require('fs');
var path = require('path');

var num = process.argv[2];
var time,pull=0,pullup=0;
var pushfiles=require('./pushtest_supp');

if(num==null)
{
  console.log("no parameter provided")
}
else 
{
var arr = num.split("/");
if(arr.length==2)
{
if(fs.existsSync(__dirname+'/'+arr[1]+'/test.json'))
  {

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
  path: '/git/push/json',
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
      str=Buffer(str.file,'base64').toString('binary');
      var parent=JSON.parse(str);
      getservertime(parent);
      traverse(parent);
      if(pull==0)
        console.log('Repo  upto-date ');
      else    
       pushfiles.pushfile(arr[0],arr[1]);
     


    }
    else
     {
	 console.log('first push');
	 pushfiles.pushfile(arr[0],arr[1]);
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
{
console.log(arr[1]+' Nothing to push ...');
console.log(' Did you mean  ?');
console.log('   KLON commit');
}
}// end of arr.length loop
else
console.log('The parameter provided is false');
}




function traverse(parent)
{

 if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            traverse(child);
        }
    }
  if(parent.type == 'file')
  {
    var date = new Date();
    if( parent.servertimestamp =="00.00")
      parent.servertimestamp =parent.localtimestamp;
   
   
  if((time > parent.servertimestamp))
  {
  //console.log('please pull');// pull message
  pull=0;
  }
  else
    pull=1;
 
  }

 

};





function getservertime(parent)
{
 if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            getservertime(child);
        }
    }
  if(parent.type == 'file')
  {
    time= parent.servertimestamp;

  }
};