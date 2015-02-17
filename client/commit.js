var http = require('http');
var fs =require('fs');
path = require('path');
var util = require('util');

var clientarray= [];

var num = process.argv[2];
var message=process.argv[4];
var filepath = process.argv[5];

var iscommit;
if(message==null)
{
console.log('provide a console message');
console.log("   commit username/project -m 'message'");
}
else if(num==null)
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
  temp=fs.readFileSync(filepath+"/"+arr[1]+"/test.json",'binary');
var parent=JSON.parse(temp);
//console.log(parent);
//parent.commit={name: 'name', goals: 'vaghil'};
var commitnum=createcommitno(arr[0],arr[1]);
 parent.commit= addcommitno(parent,commitnum);
 //console.log(parent.commit);
iscommit=0;
addfilecontent(parent,commitnum,parent.commit.length);
if(iscommit!=0)
{
fs.writeFileSync(filepath+'/'+arr[1]+"/committest.json",JSON.stringify(parent,null,4));
console.log('commit success');
}
else
    console.log('nothing to commit');
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
        for(var i=0;i<parent.commit.length;i++)
        result.push(parent.commit[i]);
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




function addfilecontent(parent,num,length) {
    if (parent && parent.children) {
        for (var i = 0, l = parent.children.length; i < l; ++i) {
            var child = parent.children[i];
            child.index = i;
            if (!child.parentId) child.parentId = parent.id || '0';
            addfilecontent(child,num,length);
        }
    }
    if((parent.type=='file')&&(parent.modified=='true')) //include the true modifer 
    {
        iscommit++;
        var str=fs.readFileSync(filepath+parent.path+'/'+parent.name,'binary');
        str=Buffer(str).toString('base64');
        console.log('File commited '+parent.name);
       // console.log(str);
        parent.content=str;
        parent.commitnum=num+length;
          var stat=fs.statSync("./"+parent.path+"/"+parent.name);
        parent.localtimestamp=stat["mtime"].toString();
      //console.log(parent.content);
        
        //console.log(str);
        //str=Buffer(str,'base64').toString('binary');
        //console.log(str);


    }

     
     };