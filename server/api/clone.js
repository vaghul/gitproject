var fs=require('fs'),
path = require('path');
var clone= function (req, res) {

 


  var file=__dirname+'/../Repo_Files/'+req.param('user')+'/'+req.param('folder')+'/'+req.param('file');
  
 // console.log(file);
fs.stat(file, function(err, stat) {  
if(err==null)
{

var test = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    var block= Buffer(test).toString('base64');


var user = {
  email: 'brandon@gmail.com',
  file: block
};
    res.json(user);
console.log("Clone Requested on file "+req.param('file') +" by "+ req.param('email'));

}
else
{
console.log(err);
res.status(404);
res.send();
console.log(req.param('file')+" File Not Found");

}
}); //end of fs.stat





};


exports.clone=clone;