var http = require('http');
var fs =require('fs');
var path = require('path');
var util = require('util');

var num = process.argv[2];
var commitno = process.argv[3];
var filepath = process.argv[4];

if(num==null && filepath==null)
{
  console.log("no parameter provided")
}
else 
{
var arr = num.split("/");
if(arr.length==2)
{
if(fs.existsSync(filepath+'/'+arr[1]+'/test.json'))
{

var commit = fs.readFileSync(filepath+'/'+arr[1]+'/test.json');
commit= JSON.parse(commit);
commitArray=commit.commit;

var user = {
  email: 'brandon@gmail.com',
  user:arr[0],
  folder:arr[1],
  commitno: commitno,
// oldArray: commitArray
};


var data = JSON.stringify(user);
//The url we want is `www.nodejitsu.com:1337/`
var options = {
  host: '127.0.0.1',
  path: '/git/rollback',
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
  if(response.statusCode== 200 )
  {
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    if(str!="")
    {
   
      str=JSON.parse(str);
      str=Buffer(str.file,'base64').toString('binary');
      var commitjson=JSON.parse(str);
	  console.log(util.inspect(commitjson,false,null));
	  //deleteFolderRecursive(filepath+'/'+arr[1]);
	  //createfolder(commitjson);
      //createfile(commitjson);

	  traverse(commitjson,commitno);
	  var testJS=fs.readFileSync(filepath+'/'+arr[1]+'/test.json');
	  testJS=JSON.parse(testJS);
	  testJS.commit= commitArray;
	  fs.writeFileSync(filepath+'/'+arr[1]+'/test.json',JSON.stringify(testJS,null,4));
	  console.log('Rolling back...');

    }
  });
  }
  else
  {
   console.log('No such commit found'); 
  }
}



var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
}
}// end of arr.length loop
else
console.log('The parameter provided is false');
}
/*
function deleteFolderRecursive(path) {
		if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file,index){
		var curPath = path + "/" + file;
		if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
	}
	};

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
    writeFile(parent);
	}
     };

	 
	 function writeFile(parent){
	 if(parent.type=='file')
     {
	 
     	var content=new Buffer(parent.content,'base64').toString('binary');
		fs.writeFileSync(path+parent.path+"/"+ parent.name,content,'binary');
		console.log('Created File '+parent.path+"/"+ parent.name);   
		}
	 }
	 

*/
function traverse(parent,commitno) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            traverse(child);
        }
    }
	//COPY OLD OBJECT TO NEW TEST
	if(parent.type=='file')
	{
	//console.log(parent.commitnum);
     if(parent.commitnum != commitno)
	 {
		var content=new Buffer(parent.content,'base64').toString('binary');
		fs.writeFileSync(filepath+'/'+parent.path+"/"+ parent.name,content,'binary');
		console.log('Modified File '+parent.path+"/"+ parent.name);   
		}
	 }
	 }
/*
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
*/