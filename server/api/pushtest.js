var fs=require('fs'),
path = require('path');


var pushtest= function (req, res) {

 

var commitjson=req.param('file');
commitarr=commitjson.commit;
commitnum=commitarr[commitarr.length-1].commitno;

createfolder(commitjson,__dirname+'/../Repo_Files/'+req.param('user'));
createfile(commitjson,__dirname+'/../Repo_Files/'+req.param('user'));
var file=__dirname+'/../Repo_Files/'+req.param('user')+'/'+req.param('folder')+'/';
//parent=removecontent(commitjson);
//fs.writeFileSync(file+'test.json',JSON.stringify(parent,null,4));

fs.writeFileSync(file+commitnum+'.json',JSON.stringify(commitjson,null,4));



res.status(200);
res.send("done");

 




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
            if (!child.parentId) child.parentId = parent.id || '0';
            createfolder(child,path);
        }
    }

     if(parent.type!='file')
    mkdir(path+parent.path+"/"+ parent.name);
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