var fs=require('fs'),
path = require('path'),
util = require('util');
var users;
 var clientarray= [];
 var serverarray= [];
var push= function (req, res) {
	var file=__dirname+'/../Repo_Files/'+req.param('reg_id')[0];
  
    users=req.param('reg_id')[0];
	var user = {
		email: 'brandon@gmail.com',
		reg_id: 'something'
	};

	if (fs.existsSync(file)) {
		var clientjs= req.param('json');
		console.log('Repository already available');
		var json= fs.readFileSync(file+'/'+req.param('reg_id')[1]+'/test.json'); 
		clientjs= Buffer(clientjs).toString('binary');
		 // Create arrays of client and server js 
		
		createclientArray(JSON.parse(clientjs));
		createserverArray(JSON.parse(json));
		createFolders(JSON.parse(clientjs),req.param('reg_id')[1],req.param('reg_id')[0]);
	
		console.log(clientarray);
		console.log(serverarray);
		serverarray.sort(function compare(a,b) {
		if (a.type < b.type)
			return -1;
		if (a.type > b.type)
			return 1;
		return 0;
		});
		console.log(serverarray);
		serverarray.forEach(function(obj){
			//console.log(obj);
			//console.log(file+'/'+req.param('reg_id')[1]);
			if(containsObject(obj,clientarray))
			{
			//console.log('present');
			}
			else
			{
			if(obj.type=='file')
			{
			fs.unlinkSync(file+'/'+obj.path+'/'+obj.name);
			makeJSON('../server/Repo_Files/'+req.param('reg_id')[0]+'/'+req.param('reg_id')[1]);
			console.log('Deleted' +obj.name+' from '+ obj.path);
			}
			else if(obj.type=='folder')
			{
			file+'/'+obj.path+'/'+obj.name
			fs.rmdirSync(file+'/'+obj.path+'/'+obj.name);
			makeJSON('../server/Repo_Files/'+req.param('reg_id')[0]+'/'+req.param('reg_id')[1]);
			console.log('delete');
			}
			
			}
		});
		
		var block= Buffer(json).toString('base64');
		 // and check for deleted files
		 // create folders
		 var user = {
		  email: 'brandon@gmail.com',
		  reg_id: json
		};
		serverarray=[];
		clientarray=[];
		 res.status(200);
		res.json(user);
	}
	else {
		console.log('User not Found.Creating Directory.First Push.. Creating Folder... ');
		fs.mkdirSync(file);
		res.status(530);
		res.send();
	 }
};

var pushFirst = function(req,res){
	console.log('Creating Folder structure...');
	var str = '',proj='',name='';
	proj=req.param('proj');
	name=req.param('name');
	str= new Buffer(req.param('reg_id'),'base64');
	str= str.toString();
	str=JSON.parse(str);
	createFolders(str,proj,name);
	res.status(700);
	res.send("SecondCall");
};

var pushFiles = function(req,res){
	console.log('Creating Files...');
	var str = '',path='',proj='',name='';
	proj=req.param('proj');
	name=req.param('name');
	var array= req.param('array');
	for(var key in array)
	{
		path=array[key]['path'];
		str= array[key]['content'].toString();
		str=Buffer(str,'base64');

		fs.writeFile(__dirname+'../../Repo_Files/'+name+'/'+path, str,'binary', function(err) {
			if(err) {
				//console.log("Error da");
				fs.exists(__dirname+'../../Repo_Files/'+name+'/'+path, function(exists) {
				if (exists) 
				console.log('exists');
				else
				{
				fs.writeFile(__dirname+'../../Repo_Files/'+name+'/'+path, str,'binary', function(err) {
				if(err) console.log(err);
				});
				}
			});
			} else {
			   // console.log("The file was saved!");
			}
		});
	}
	res.status(800);
	res.send("SecondCall");
};


var pushReplace = function(req,res){
	console.log('Replacing files');
	var str1 = '',path1='',proj1='',name1='';
	proj1=req.param('proj');
	name1=req.param('name');
	var array1= req.param('array');
	for(var key in array1)
	{
	path1=array1[key]['path'];
	//console.log(path1);
	str1= array1[key]['content'].toString();
	str1=Buffer(str1,'base64');

	fs.writeFile(__dirname+'../../Repo_Files/'+name1+'/'+path1, str1,'binary', function(err) {
		if(err) {
			//console.log("Error da");
			fs.exists(__dirname+'../../Repo_Files/'+name1+'/'+path1, function(exists) {
			if (exists) 
			console.log('exists');
			else
			{
			fs.writeFile(__dirname+'../../Repo_Files/'+name1+'/'+path1, str1,'binary', function(err) {
			if(err) console.log(err);
			});
			}
		});
		} else {
		    //console.log("The file was saved!");
		}
	});
	//console.log(util.inspect(str, false, null));
	}
		res.status(600);
		res.send("Replace Done.");
};

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
	
    if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
            return true;
        }
    }

    return false;
}

function makeJSON(file){
var json=dirTree(file);
//console.log('json in making');
	//console.log(file);
   fs.writeFileSync(file+'/test.json',JSON.stringify(json,null,4),'binary', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved ass!");
    }
});
//console.log(util.inspect(dirTree(file), false, null));

function dirTree(filename) {
	//console.log(filename);
    var stats = fs.lstatSync(filename),
        info= {
            path: path.dirname(filename).slice(2).replace('/server/Repo_Files/'+users,''),
            name: path.basename(filename)
        };

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
        info.localtimestamp="00.00";
        info.modified="false";
    }

    return info;
}

}

function createclientArray(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createclientArray(child);
        }
    }
	//console.log(parent.name);
	
	var obj= {};
	obj['name']=parent.name;
	obj['path']=parent.path;
	obj['type']=parent.type;
	clientarray.push(obj);
}
function createserverArray(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createserverArray(child);
        }
    }
	//console.log(parent.name);
	var obj= {};
	obj['name']=parent.name;
	obj['path']=parent.path;
	obj['type']=parent.type;
	serverarray.push(obj);
}

function createFolders(json,proj,name) {
	
	traverse(json);
	//console.log(name);
	function traverse(parent) {
		if (parent && parent.children) {
			for (var i = 0, l = parent.children.length; i < l; ++i) {
				var child = parent.children[i];
				child.index = i;
				if (!child.parentId) child.parentId = parent.id || '0';
				traverse(child);
			}
		}
		if(parent.type!='file')
		{
		//console.log(__dirname+'../../Repo_Files/'+name+'/'+parent.path+'/'+ parent.name);
		mkdir(__dirname+'../../Repo_Files/'+name+'/'+parent.path+'/'+ parent.name);
		}	
	}

	function mkdir(dirPath, mode, callback) {
	  fs.mkdir(dirPath, mode, function(error) {
		if (error && error.errno === 34) {
		  mkdir(path.dirname(dirPath), mode, callback);
		  mkdir(dirPath, mode, callback);
		}
		callback && callback(error);
	  });
	};
}


exports.push=push;

exports.pushFirst=pushFirst;

exports.pushFiles=pushFiles;

exports.pushReplace=pushReplace;