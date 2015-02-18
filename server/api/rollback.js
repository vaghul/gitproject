var fs=require('fs'),
path = require('path');
var rollback= function (req, res) {

  var file=__dirname+'/../Repo_Files/'+req.param('user')+'/'+req.param('folder')+'/'+req.param('commitno')+'.json';
  console.log('Rolling back...');
 fs.exists(file,function(exists){
	var commitJS= fs.readFileSync(file);
	 var block= Buffer(commitJS).toString('base64');
	var user = {
		file: block
	};
	res.status(200);
    res.json(user);
 });
 
 //res.statusCode(404);
 //res.send('Commit Not Found');

};


exports.rollback=rollback;