var http = require('http');
var fs =require('fs');
path = require('path');
var util = require('util');

var clientarray= [];

var num = process.argv[2];


if(num==null)
{
  console.log("no parameter provided")
}
else 
{
var arr = num.split("/");
if(arr.length==2)
commit();
}
function commit() {
temp=fs.readFileSync(__dirname+"/"+arr[1]+"/test.json",'binary');
var parent=JSON.parse(temp);
//console.log(parent);
addfilecontent(parent);
fs.writeFileSync(__dirname+"/"+arr[1]+"/fulltest.json",JSON.stringify(parent,null,4));
console.log('commit success');
};

function addfilecontent(parent) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            addfilecontent(child);
        }
    }
    if((parent.type=='file')&&(parent.name!='test.json')&&(parent.name!='.DS_Store'))
    {
        console.log(__dirname);
        console.log(parent.path);
        console.log(parent.name);
        var str=fs.readFileSync(__dirname+parent.path+'/'+parent.name,'binary');
        str=Buffer(str).toString('base64');
        parent.content=str;
        //console.log(str);
        //str=Buffer(str,'base64').toString('binary');
        //console.log(str);



    }

     
     };
