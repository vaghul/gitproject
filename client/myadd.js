var http = require('http');
var fs =require('fs');
path = require('path');
var util = require('util');

var clientarray= [];


add();

function add() {
temp=fs.readFileSync(__dirname+"/json/test.json",'binary');
temp=JSON.parse(temp);
var parent=dirTree('./json');
//console.log(parent);
createoldarray(temp);
//console.log(clientarray);
for(var key in clientarray)
    {
        //console.log(clientarray[key]['path']+clientarray[key]['name']);
        //console.log(clientarray);
        loadoldtonew(parent,clientarray[key]);
    
}
fs.writeFileSync(__dirname+"/json/test.json",JSON.stringify(parent,null,4));
console.log('Add success');

};


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
        info.localtimestamp="00.00";
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
           // console.log(stat['mtime']);
            //console.log(stat['atime']);
            
            if(new Date(array.localtimestamp)<stat["mtime"])
            {
                console.log('Change sensed in '+parent.path+'/'+parent.name);
                parent.localtimestamp=stat["mtime"].toString();
                parent.modified="true";
            }
            else
            {
                parent.localtimestamp=array.localtimestamp;
                parent.modified='false'
            }
        }



    }
     
     };
