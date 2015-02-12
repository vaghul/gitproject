var http = require('http');
var fs =require('fs');
path = require('path');
var util = require('util');

var clientarray= [];

var num = process.argv[2];
var message=process.argv[4];
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
    var a = 5;
var b = 6;
console.log("" + a + b);
temp=fs.readFileSync(__dirname+"/"+arr[1]+"/test.json",'binary');
var parent=JSON.parse(temp);
//console.log(parent);
//parent.commit={name: 'name', goals: 'vaghil'};
var commitnum=createcommitno(arr[0],arr[1]);
 parent.commit= addcommitno(parent,commitnum);
 console.log(parent.commit);

            addfilecontent(parent);
fs.writeFileSync(__dirname+"/committest.json",JSON.stringify(parent,null,4));
console.log('commit success');
};
function addcommitno(parent,num){
   result=[]; 
     if(parent.commit==null)
       result.push({
         commitno: num+(result.length+1),
         commitmsg: message,
         committime: new Date().toString()
     });
    else
    {
        result.push(parent.commit);
        result.push({
            commitno: num+(result.length+1),
         commitmsg: message,
         committime: new Date().toString()
        });
      
    }
return result;
}
function createcommitno(user,project)
{
    user=user.toLowerCase();
    project=project.toLowerCase();
    var key="";
for (var i = 0; i <user.length; i++) 
  key=key+user.charCodeAt(i);
for (var i = 0; i <project.length; i++) 
  key=key+project.charCodeAt(i);
return key
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
    if((parent.type=='file')&&(parent.name!='test.json')&&(parent.name!='.DS_Store')) //include the true modifer 
    {
        var str=fs.readFileSync(__dirname+parent.path+'/'+parent.name,'binary');
        //str=Buffer(str).toString('base64');
        fs.writeFileSync(__dirname+"/"+ parent.name+".txt",str);

       // console.log(str);
        parent.content=str;
     //   console.log(parent.content);
        //console.log(str);
        //str=Buffer(str,'base64').toString('binary');
        //console.log(str);



    }

     
     };