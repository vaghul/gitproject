 var http= require('http'),
 fs = require('fs'),
 util = require('util');
 
 var mjson=[];
var pushVal= function(data){

//console.log(data);
var name=data[0];
var dat = "./"+data[1]+"/test.json";

fs.stat(dat, function(err, stat) {  
if(err==null)
{
var test = fs.readFileSync(dat);
    // convert binary data to base64 encoded string
 var block= Buffer(test).toString('base64');
	

var user = {
  email: 'brandon@gmail.com',
  reg_id: block,
  proj: data[1],
  name: name,
};


user= JSON.stringify(user);
 //console.log("Second Call");
 //console.log(data1);
	  var options = {
  host: '127.0.0.1',
  path: '/git/pushFirst',
  //since we are listening on a custom port, we need to specify it by hand
  port: '3000',
  //This is what changes the request to a POST request
  method: 'POST',
  data:user,
  headers:
  {'Content-Type': 'application/json'
  }
};

 callback = function(response) {
		var str;
		if(response.statusCode==700)
		{
		
		console.log('Creating Files ...');
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			str='';
		});
		
		// Call the JSON creation function
		traverse(JSON.parse(test));
		call(mjson,name,data[1]);
		}
}

	var req = http.request(options, callback);
	//This is the data we are posting, it needs to be a string or a buffer
	//req.connection.setTimeout(3000);
	req.write(user);
	req.end();

   
}
});
};

function traverse(parent) {
 if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            traverse(child);
        }
    }
	if(parent.type=='file')
	{
    console.log('create mode --> '+parent.path+"/"+ parent.name);
	var block=createBlock(parent.path+"/"+ parent.name);
	var obj = {};
	obj["path"]=parent.path+"/"+ parent.name;
	obj["content"]=block;	
	mjson.push(obj);
	}
}

function createBlock(key){
   var test = fs.readFileSync('.'+key);
    // convert binary data to base64 encoded string
	var block= Buffer(test).toString('base64');
	return block;
}

function call(mjson,name,proj){
var arr={
  array: mjson
};	
	arr['name']=name;
	arr['proj']=proj;
	//console.log(arr);
	//console.log(util.inspect(mjson, false, null));
	arr= JSON.stringify(arr);
	 mjson=[];  
	      var options = {
  host: '127.0.0.1',
  path: '/git/pushFiles',
  //since we are listening on a custom port, we need to specify it by hand
  port: '3000',
  //This is what changes the request to a POST request
  method: 'POST',
  data: arr,
  headers:
  {'Content-Type': 'application/json'
  }
};

 callback2 = function(response) {
		var str;
		if(response.statusCode==800)
		{
		
		console.log('Created Files and folders. Success');
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			str='';
		});
		
		}
}

	var req = http.request(options, callback2);
	//This is the data we are posting, it needs to be a string or a buffer
	//req.connection.setTimeout(3000);
	req.write(arr);
	req.end();

}




exports.pushVal= pushVal;