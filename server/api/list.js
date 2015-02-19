var http = require('http');
var fs=require('fs'),
path = require('path');
var dir = require('node-dir');
var url = require('url');
var list= function (req, res) {
var f="./Repo_Files/"; 
var user = {
		email: 'brandon@gmail.com',
		reg_id: 'something'
	};
if (fs.existsSync(f)) {
/*recursive(file, function (err, files) {
  // Files is an array of filename
  console.log(files);
});

fs.readdir(file, function(err, files) {
	if (err) return;
	files.forEach(function(f) {
		console.log('Files: ' + f);
	});
});

dir.readFiles(file, {
    exclude: /^\./
    }, function(err, content, next) {
        if (err) throw err;
        console.log('content:', content);
        next();
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:',files);
    });*/

dir.files(f,function(err, files) {
    if (err) throw err;
    if (fs.existsSync(f))
console.log(f);
res.render('index', { title: 'Home',path:files,cont:null });
});
}
};

var path= function (req, res) {
//var p=url.parse(req.url).pathname;
var p= req.param("id");
//console.log(p);
//console.log(req.param(fname));
fs.readFile(p, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
else
{
//console.log(data);
res.send({file:data});
}
//res.render('index', { title: 'Home',cont:data,path:null});
});
};

exports.list=list;
exports.path=path;
/*exports.list=function(req,res){
res.render('index', { title: 'Home' });
};*/