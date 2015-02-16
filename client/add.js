var http = require('http');
var fs =require('fs');
path = require('path');
var util = require('util');

var clientarray= [];
var flag=0;
var num = process.argv[2];


if(num==null)
{
  console.log("no parameter provided")
}
else 
{
var arr = num.split("/");
if(arr.length==2)
{
if(fs.existsSync(__dirname+'/'+arr[1]+'/test.json'))
    add();
else
    addfirst();
}
}

function addfirst()
{
fs.writeFileSync(__dirname+"/"+arr[1]+"/test.json",'vaghul');
var parent=dirTreefirst('./'+arr[1]);
fs.writeFileSync(__dirname+"/"+arr[1]+"/test.json",JSON.stringify(parent,null,4));
console.log('add sucess');
console.log(flag);
};

function add() {
flag=0;
temp=fs.readFileSync(__dirname+"/"+arr[1]+"/test.json",'binary');
temp=JSON.parse(temp);
var parent=dirTree('./'+arr[1]);
//console.log(parent);
createoldarray(temp);
fs.writeFileSync(__dirname+"/"+arr[1]+"/test.json",JSON.stringify(parent,null,4));
//console.log(clientarray);
for(var key in clientarray)
    {
        //console.log(clientarray[key]['path']+clientarray[key]['name']);
        //console.log(clientarray);
        loadoldtonew(parent,clientarray[key]);
    
}
fs.writeFileSync(__dirname+"/"+arr[1]+"/test.json",JSON.stringify(parent,null,4));
console.log('Add success');
};



function dirTreefirst(filename) {

    var stats = fs.lstatSync(filename),
        info= {
            path: "/"+path.dirname(filename).slice(2),
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTreefirst(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
var stat=fs.statSync("./"+info.path+"/"+info.name);
        info.type = "file";
        info.servertimestamp="00.00";
        info.localtimestamp=stat.mtime.toString();
        info.modified="true";
    }

    return info;
}

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
        info.modified="true";
    }

    return info;
}


function createoldarray(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            createoldarray(child);
        }
    }
    //console.log(parent.name);
    
    var obj= {};
    obj['name']=parent.name;
    obj['path']=parent.path;
    obj['type']=parent.type;
    obj['localtimestamp']=parent.localtimestamp;
    obj['servertimestamp']=parent.servertimestamp;
    clientarray.push(obj);
    
}


function loadoldtonew(parent,array) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            loadoldtonew(child,array);
        }
    }
    if((array.path==parent.path)&&(array.name==parent.name))
    {   
        if(parent.type=='file')
        {
            var stat=fs.statSync("./"+parent.path+"/"+parent.name);
            //console.log(parent.localtimestamp);
            //console.log(stat['mtime']);
            //console.log(stat['atime']);
           // console.log(new Date(array.localtimestamp));
            if((new Date(array.localtimestamp)<=stat["mtime"])) 
            {
                console.log('Change sensed in '+parent.path+'/'+parent.name);
                   parent.servertimestamp=array.servertimestamp;
             
               // parent.localtimestamp=stat["mtime"].toString();
                parent.localtimestamp=array.localtimestamp;
               
                parent.modified="true";
             
            }
            else
            {
                parent.servertimestamp=array.servertimestamp;
                parent.localtimestamp=array.localtimestamp;
                parent.modified='false'
            }
        }



    }
     
     };
