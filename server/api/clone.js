var fs=require('fs'),
path = require('path');
var clone= function (req, res) {

 


  var file=__dirname+'../../Repo_Files/'+req.param('reg_id');
  
  //console.log(file);
fs.stat(file, function(err, stat) {  
if(err==null)
{

var test = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    var block= Buffer(test).toString('base64');


var user = {
  email: 'brandon@gmail.com',
  reg_id: block
};
    res.json(user);
console.log("Clone Requested on file "+req.param('reg_id') +" by "+ req.param('email'));

}
else
{
res.status(404);
res.send();
console.log(req.param('reg_id')+" File Not Found");

}
}); //end of fs.stat





};


exports.clone=clone;