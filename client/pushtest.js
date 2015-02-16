var http = require('http');
var fs =require('fs');
var path = require('path');

var num = process.argv[2];


if(num==null)
{
  console.log("no parameter provided")
}
else 
{
var arr = num.split("/");
if(arr.length==2)
{
if(fs.existsSync(__dirname+'/'+arr[1]+'/committest.json'))
  {
console.log('pushing '+arr[1]+' ....');
 var commitjson=fs.readFileSync('./'+arr[1]+'/committest.json');
 var testjson=fs.readFileSync('./'+arr[1]+'/test.json');
 testjson=JSON.parse(testjson);
  commitjson=JSON.parse(commitjson);
 testjson.commit=commitjson.commit;
 fs.writeFileSync('./'+arr[1]+'/test.json',JSON.stringify(testjson,null,4));
var user = {
  email: 'brandon@gmail.com',
  user:arr[0],
  folder:arr[1],
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
      //console.log(str);
      
     
      console.log('push '+arr[1]+' success !!!');


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
console.log(arr[1]+' Nothing to push ...');
console.log(' Did you mean  ?');
console.log('   KLON commit');
}
}// end of arr.length loop
else
console.log('The parameter provided is false');
}
