var fs=require('fs'),
path = require('path');
var clone= function (req, res) {

 


  var file=__dirname+'../../files/'+req.param('reg_id');
  
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
console.log(req.param('reg_id') +'  '+ req.param('email'));

}
else
{
res.send();
console.log(req.param('reg_id') +'  '+ req.param('email'));
}
}); //end of fs.stat





};


exports.clone=clone;