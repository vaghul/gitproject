var http = require('http'),
path = require('path');
var fs =require('fs');
util = require('util');
var pushValue= require('./pushVal');
var num = process.argv[2];
var res=num.split("/");
if(num==null)
{
  console.log("no parameter provided")
}
var oldJson= fs.readFileSync('./'+res[1]+'/test.json');
//fs.writeFileSync('./'+res[1]+'/test.json', 'Before map');
  //makeJSON('./'+res[1]);
  var readJS=fs.readFileSync('./'+res[1]+'/test.json');
//  console.log(util.inspect(JSON.parse(readJS), false, null));

var user = {
  email: 'brandon@gmail.com',
  reg_id: res,
  json: readJS
};


var data = JSON.stringify(user);
//The url we want is `www.nodejitsu.com:1337/`


var options = {
  host: '127.0.0.1',
  path: '/git/push',
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

  var str = '';
response.setEncoding('binary');
		if(response.statusCode == 530)
		{
		console.log('Creating Folders...');
		
		pushValue.pushVal(res);
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			str='';
		});
		}
		else if(response.statusCode == 200)
		{
		str='';
		response.on('data', function (chunk) {
		str += chunk;
		});
		response.on('end', function () {
		if(str!='')
		{
		str=JSON.parse(str);
		str=Buffer(str.reg_id,'base64').toString('binary');
		str=JSON.parse(str); // the test.json JSON file in server
		str=str.children[str.children.length-1].servertimestamp;
		oldJson=JSON.parse(oldJson);
		for(var k in oldJson.children)
		{
		
		if((oldJson.children[k]["name"]=="test.json") && (oldJson.children[k]["modified"]=="true") )
		{
		console.log(oldJson.children[k]["name"]);
		checkTime(str,oldJson);
		}
		else if((oldJson.children[k]["name"]=="test.json") && (oldJson.children[k]["modified"]=="false") )
		{
			console.log("Nothing to Push. Add First");
		}
		}
		//console.log(str);
		//console.log(util.inspect(str, false, null));
		}
		else
		console.log('not found');
		});
		}
};
var mjson = [];
function checkTime(serverTime, clientJson){

var pullCount=0,push =false;
traverse(serverTime,clientJson);


function traverse(parent,client) {
	var servertime= parent;
 if (client && client.children) {
        for (var j = 0, k = client.children.length; j < k ;++j) {
            var clientchild = client.children[j];
            clientchild.index = j;
            if (!clientchild.parentId) clientchild.parentId = client.id || '0';
			traverse(servertime,clientchild);
        }
    }
	if(client.type == 'file')
	{
		var date = new Date();
	
		client.servertimestamp =  date.toString();
		//client.localtimestamp = "00.00";
		
	//console.log("Server"+servertime);
	//console.log("Client"+client.servertimestamp);
	if(servertime > client.servertimestamp)
	{
	console.log('please pull');
		pullCount++;	// Please pull message
	}
	else if(client.modified == 'true')
	{
	console.log('modified file'+client.path+"/"+ client.name);
		client.modified = "false";
		var block=createBlock(client.path+"/"+ client.name);
		var obj = {};
		obj["path"]=client.path+"/"+ client.name;
		obj["content"]=block;	
		mjson.push(obj);
		push=true;
	}
	}
	//console.log(client.name);
}
fs.writeFileSync('./'+res[1]+'/test.json',JSON.stringify(clientJson,null,4));
//makeJSON('./'+res[1]);
  
if(pullCount !=0)
{
	console.log('Please Pull before push');
}
else
{
	console.log('Ready to push');
	//console.log(mjson); //array of files
for(var key in mjson)
{
if(mjson[key]['path']=='/'+res[1]+'/test.json')
{
var testJson=fs.readFileSync('./'+res[1]+'/test.json');
var block= Buffer(testJson).toString('base64');
mjson[key]['content'] = block;
}
}
//console.log(mjson); //array of files
replaceCall(mjson,res[0],res[1]);
}
	
	
function replaceCall(mjson,name,proj)
{
var arr={
  array: mjson
};	
	arr['name']=name;
	arr['proj']=proj;
	//console.log(arr);
	//console.log(util.inspect(mjson, false, null));
	arr= JSON.stringify(arr);
	   
	      var opt = {
  host: '127.0.0.1',
  path: '/git/pushReplace',
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
		if(response.statusCode==600)
		{
		//console.log(response.statusCode);
		console.log('Replaced Changed Files. Success');
		response.on('data', function (chunk) {
			str += chunk;
		});
		response.on('end', function () {
			str='';
		});
		
		}
}

	var req = http.request(opt, callback2);
	//This is the data we are posting, it needs to be a string or a buffer
	//req.connection.setTimeout(3000);
	req.write(arr);
	req.end();
}	
	
	


function createBlock(key){
   var test = fs.readFileSync('.'+key);
    // convert binary data to base64 encoded string
	var block= Buffer(test).toString('base64');
	return block;
}

}

function makeJSON(file){
var json=dirTree(file);
//console.log('json in making');
   fs.writeFileSync(file+"/test.json",JSON.stringify(json,null,4),'binary', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved ass!");
    }
});
//console.log(util.inspect(dirTree(file), false, null));

function dirTree(filename) {
	
    var stats = fs.lstatSync(filename),
        info= {
            path: '/'+path.dirname(filename).slice(2),
            name: path.basename(filename)
        };
		if(info.path=='/')
		info.path= '';
	//console.log(info.path);
    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
		var stat = fs.statSync(filename);
		//var mtime = stat["mtime"];
		var ctime = stat["ctime"];
		//console.log("File last modified at"+mtime);
		//console.log("File last created at"+ctime);
		
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
		var date=new Date();
		var mtime= date.toString();
        info.type = "file";
        info.servertimestamp=mtime;  // TODO: replace the time of system
        //info.localtimestamp="00.00";
        info.modified="false";
    }

    return info;
}

}

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
