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
console.log('Creating '+arr[1]+' Repo');
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
  path: '/git/addrepo',
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
      
      console.log('Repo generation success !!!');


    }
    else
      console.log("Repo already available");
  });
}



var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();

}// end of arr. length
else
console.log('The parameter provided is false');
}

