var body = require('body-parser')
var express = require('express');
var app = express();
var fs =require('fs'),
routescan = require('express-routescan');
app.use(body.urlencoded({ extended: false }))
app.use(body.json());

app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

//console.log(__dirname);


  routescan(app, {
      directory: [
          './routes'
      ]
  });


var server = app.listen(3000, function () {

  var host = app.get('ip');
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
  });



/*
app.post('/git/clone', function (req, res) {

  var file=__dirname+'/'+req.param('reg_id');
fs.stat(file, function(err, stat) {  
if(err==null)
{

var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    var block= Buffer(bitmap).toString('base64');


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

});*/