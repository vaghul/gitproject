var body = require('body-parser')
var express = require('express');
var app = express();
var fs =require('fs');

app.use(body.urlencoded({ extended: false }))
app.use(body.json());


console.log(__dirname);

app.post('/git/clone', function (req, res) {

  var file=__dirname+'/'+req.param('reg_id');
fs.stat(file, function(err, stat) {  
if(err==null)
{
res.sendFile(file);
  //console.log(req.headers);
 // console.log(req.headers.test);
 console.log(req.param('reg_id') +'  '+ req.param('email'));
//res.send("vaghul here");
}
else
{
res.send();
console.log(req.param('reg_id') +'  '+ req.param('email'));
}
}); //end of fs.stat

});

app.get('/git/clone', function (req, res) {
  
  var file=__dirname+'/img1.jpg'
res.sendFile(file);
 console.log("clone hit");
//res.send("vaghul here");

});
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});