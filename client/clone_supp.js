var http = require('http');
var fs =require('fs');

/*var num = process.argv[2];
if(num==null)
{
  console.log("no parameter provided")
}*/
    
var callfun=function(data,username,foldername){
  //console.log(data.slice(6,data.length));
  //console.log(username+"/"+foldername);
var filename =data.slice(6,data.length);
var user = {
  email: 'brandon@gmail.com',
  user:username,
  folder:foldername,
  file: filename
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
      //console.log(str.reg_id);
      //console.log(str.reg_id);
      str=Buffer(str.file,'base64');
      //console.log(__dirname);
     if(filename=='test.json')
     {
      str=Buffer(str,'base64').toString('binary');
      var parent=JSON.parse(str);

      changejsontime(parent);
     
        fs.writeFileSync(__dirname+"/"+foldername+"/"+filename, JSON.stringify(parent,null,4));
     }
     else
     {   
      fs.writeFile(__dirname+"/"+foldername+"/"+filename, str,'binary', function(err) {
    if(err) 
        console.log(err);
     });
    }}
    else
      console.log("failure File not Found");
  });
}



var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
};


function changejsontime(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            changejsontime(child);
        }
    }

     if(parent.type=='file')
     {
    //console.log(parent.path+"/"+ parent.name);
    parent.localtimestamp=new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    
  }
     };


exports.callfun=callfun;