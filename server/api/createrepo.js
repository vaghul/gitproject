var fs=require('fs'),
path = require('path');

var createrepo= function (req, res) {

 


  var file=__dirname+'/../Repo_Files/'+req.param('user')+'/'+req.param('folder');
  

if(!fs.existsSync(file))
{
 mkdir(file);
 var parent={

 };
 
res.send("success");
console.log('created node '+req.param('user')+'/'+req.param('folder'));
}
else
{
res.status(404);
res.send();
console.log('Repo '+ req.param('user')+'/'+req.param('folder') +' already created');

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


exports.createrepo=createrepo;