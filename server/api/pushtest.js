var fs=require('fs'),
path = require('path');
var async=require('async');

var deleted=[];
var newfiles=[];
var oldfiles=[];
var pushtest= function (req, res) {
deleted=[];
newfiles=[];
oldfiles=[];

var file=__dirname+'/../Repo_Files/'+req.param('user')+'/'+req.param('folder')+'/';

if(fs.existsSync(file+'/test.json'))
  {

var oldjson=fs.readFileSync(file+'test.json','binary');


var commitjson=req.param('file');
commitarr=commitjson.commit;
commitnum=commitarr[commitarr.length-1].commitno;
async.waterfall([
    function(callback) {
	console.log('done1');
		createfolder(commitjson,__dirname+'/../Repo_Files/'+req.param('user'));
        callback(null,'one','two');
    },
    function(arg1,arg2,callback) {
	console.log('done2');
       createfile(commitjson,__dirname+'/../Repo_Files/'+req.param('user'));
	callback(null,'three');
    },
    function(arg1,callback) {
console.log('done3');
        addfilecontent(commitjson,req.param('user'));
		callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
	
oldjson=JSON.parse(oldjson);
loadoldfiles(oldjson);
loadnewfiles(commitjson);

	fs.writeFileSync(file+commitnum+'.json',JSON.stringify(commitjson,null,4));
parent=removecontent(commitjson);
//checkdelete(oldjson,parent);
fs.writeFileSync(file+'test.json',JSON.stringify(parent,null,4));

for(var key in oldfiles)
{
    var count=0;
    for(key2 in newfiles)
    {


        if((oldfiles[key].name==newfiles[key2].name)&&(oldfiles[key].path==newfiles[key2].path)){
     
            count++;
        }

    }

    if(count==0)
    {

        var obj={};
         obj['name']=oldfiles[key].name;
        obj['path']=oldfiles[key].path;
        deleted.push(obj);
    }

    
}
for(key in deleted)
{

    console.log('deleted node '+deleted[key].path+'/'+deleted[key].name);
    fs.unlink(__dirname+'/../Repo_Files/'+req.param('user')+deleted[key].path+'/'+deleted[key].name);
}

   res.json(parent);
res.status(200);

 
});





}// end of if
else
{
console.log('tet');

var commitjson=req.param('file');
commitarr=commitjson.commit;
commitnum=commitarr[commitarr.length-1].commitno;
//console.log(commitjson);
async.waterfall([
    function(callback) {
	console.log('done1');
		createfolder(commitjson,__dirname+'/../Repo_Files/'+req.param('user'));
        callback(null,'one','two');
    },
    function(arg1,arg2,callback) {
	console.log('done2');
       createfile(commitjson,__dirname+'/../Repo_Files/'+req.param('user'));
	callback(null,'three');
    },
    function(arg1,callback) {
console.log('done3');
        addfilecontent(commitjson,req.param('user'));
		callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
	fs.writeFileSync(file+commitnum+'.json',JSON.stringify(commitjson,null,4));
parent=removecontent(commitjson);
//checkdelete(oldjson,parent);
fs.writeFileSync(file+'test.json',JSON.stringify(parent,null,4));

console.log('done');    
  res.json(parent);
res.status(200);

});

}
};

function loadoldfiles(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            loadoldfiles(child);
        }
    }                     
    if(parent.type=='file') //include the true modifer 
    {
       var obj={};
        obj['name']=parent.name;
        obj['path']=parent.path;
        oldfiles.push(obj);

    }

     
     };

function loadnewfiles(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            loadnewfiles(child);
        }
    }
    if(parent.type=='file') //include the true modifer 
    {
       var obj={};
        obj['name']=parent.name;
        obj['path']=parent.path;
        newfiles.push(obj);

    }

     
     };

function addfilecontent(parent,file) {
	if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            addfilecontent(child,file);
        }
    }
    if((parent.type=='file')) //include the true modifer 
    {
	   
	   var str=fs.readFileSync(__dirname+'/../Repo_Files/'+file+parent.path+'/'+parent.name,'binary');
        str=Buffer(str).toString('base64');
        parent.content=str;
       

    }

     
     };
function removecontent(parent)
{
  if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            removecontent(child);
        }
    }

     if((parent.type=='file'))
     {
      	parent.content=null;
     	parent.modified='false';
      
     }
  

return parent;
};

function createfile(parent,path) {
	if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createfile(child,path);
        }
    }

     if((parent.type=='file')&&(parent.modified=='true'))
     {
	 
     	var content=new Buffer(parent.content,'base64').toString('binary');
		fs.writeFileSync(path+parent.path+"/"+ parent.name,content,'binary');
		console.log('node written'+parent.path+"/"+ parent.name);   
  }
     };


function createfolder(parent,path) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
			 if(parent.type!='file')
		{
			fs.mkdir(path+parent.path+"/"+ parent.name,function(error) {
			if(error){} 
			//console.log('created');
			});
		console.log('Creating '+ path+parent.path+"/"+ parent.name);
		}
            if (!child.parentId) child.parentId = parent.id || '0';
            createfolder(child,path);
        }
    }

   };

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



exports.pushtest=pushtest;