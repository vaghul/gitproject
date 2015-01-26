var http = require('http');
var fs =require('fs');
path = require('path');
var util = require('util');
//var num = process.argv[2];

var user = {
  email: 'brandon@gmail.com'
};

var f;
var data = JSON.stringify(user);
//The url we want is `www.nodejitsu.com:1337/`
/*var options = {
  host: '127.0.0.1',
  path: '/git/add',
  //since we are listening on a custom port, we need to specify it by hand
  port: '3000',
  //This is what changes the request to a POST request
  method: 'POST',
  data:data,
  headers:
  {'Content-Type': 'application/json',
  'Content-Length': data.length
}
};*/
add();
/*callback = function(response) {
  var str = ''
console.log(response.statusCode);  
  response.on('data',function(msg)
{
str=new Buffer(msg,'base64').toString('binary');
console.log(str);
str=JSON.parse(str);
console.log(str.msg);
});
add();
}*/
function add() {

//console.log(mtime);
temp=fs.readFileSync(__dirname+"/json/test.json",'binary');
temp=JSON.parse(temp);
//console.log(JSON.stringify(temp));
//console.log(__dirname);
var json=dirTree('./json');
//console.log(json.children[0].name);
   fs.writeFileSync(__dirname+"/json/test.json",JSON.stringify(json,null,4),'binary', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});

t=fs.readFileSync(__dirname+"/json/test.json",'binary');
t=JSON.parse(t);

//console.log(util.inspect(dirTree('../json'), false, null));
//temp1=fs.readFileSync(__dirname+"/test.json",'binary');
//temp1=JSON.parse(temp1);

//temp1=fs.readFileSync(__dirname+"/test.json",'binary');
 //temp1=JSON.parse(temp1);

normalize(temp,t);
//console.log(util.inspect(t, {showHidden: false, depth: null}));
fs.writeFileSync(__dirname+"/json/test.json",JSON.stringify(t,null,4),'binary', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});

f=fs.readFileSync(__dirname+"/json/test.json",'binary');
f=JSON.parse(f);
changeTime(f);
//console.log(f);
fs.writeFileSync(__dirname+"/json/test.json",JSON.stringify(f,null,4),'binary', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});
function dirTree(filename) {

    var stats = fs.lstatSync(filename),
        info= {
            path: "/"+path.dirname(filename).slice(2),
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
        info.servertimestamp="00.00";
        info.localtimestamp=new Date().toString();
        info.modified="false";
    }

    return info;
}

function normalize(parent,parent1) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
if(parent1!=null)
  if(parent1.children!=null)
var child1=parent1.children[i];
            child.index = i;
if(child1!=null)
child1.index=i;
            if (!child.parentId) child.parentId = parent.id || '0';
            normalize(child,child1);
        }
    }
if(parent1!=null)
{
//console.log("b : "+parent1.servertimestamp);
//parent1.servertimestamp=parent.servertimestamp;
//console.log(parent.localtimestamp);
parent1.localtimestamp=parent.localtimestamp;
parent1.modified=parent.modified;
//console.log("a : "+parent1.servertimestamp);
}
}

function changeTime(parent)
{
if(parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
child.index = i;
if (!child.parentId) child.parentId = parent.id || '0';
            changeTime(child);
        }
    }
if(parent.type=="file")
{
var stat=fs.statSync("./"+parent.path+"/"+parent.name);
console.log(parent.localtimestamp);
//parent.servertimestamp=stat["mtime"].toString();
if(new Date(parent.localtimestamp)<stat["mtime"])
{
parent.localtimestamp=stat["mtime"].toString();
parent.modified="true";
}
//console.log("./"+parent.path+"/"+parent.name);
//fs.stat("./"+parent.path+"/"+parent.name,function(err,stats)
//{
//if(parent.localtimestamp<stats["mtime"])
//{
//console.log(parent.path+"/"+parent.name);

//parent.modified="true";
//}
//console.log(parent.path+"/"+parent.name+stats["mtime"]);
//});
}
//console.log(parent.path+"/"+parent.name+" : "+parent.localtimestamp);

}
}

/*var req = http.request(options);
//This is the data we are posting, it needs to be a string or a buffer
//req.connection.setTimeout(3000);
req.write(data);
req.end();
*/

//new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
//.toISOString().replace(/T/, ' ').replace(/\..+/, '')