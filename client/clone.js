var http = require('http');
var fs =require('fs');

var num = process.argv[2];
if(num==null)
{
  console.log("no parameter provided")
}
var user = {
  email: 'brandon@gmail.com',
  reg_id: num
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
console.log(response.statusCode);  
  response.setEncoding('binary');

  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    if(str!="")
    {
      //console.log(str);
      
      str=JSON.parse(str);
      //console.log(str.reg_id);
      //console.log(str.reg_id);
      str=Buffer(str.reg_id,'base64');
      console.log(__dirname);
       try {
        fs.mkdirSync(__dirname+"/files");
        } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
          }
        
      fs.writeFile(__dirname+"/files/"+num, str,'binary', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});
    }
    else
      console.log("failure File not Found");
  });
}

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
