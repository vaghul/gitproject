var http = require('http');
var fs =require('fs');

var num = process.argv[2];
var filepath = process.argv[3];

if(num==null && filepath==null)
{
  console.log("no parameter provided")
}
else 
{

var arr = num.split("/");
if(arr.length==2)
{
if(fs.existsSync(filepath+'/'+arr[1]+'/test.json'))
{
console.log('Showing'+arr[1]+' ....');

var commit = fs.readFileSync(filepath+'/'+arr[1]+'/test.json');
commit= JSON.parse(commit);
console.log('Listing commits');
console.log('        Commit ID                 CommitMsg                               Date');
console.log('----------------------------------------------------------------------------------------------------');
var commitArray= commit.commit;
//console.dir(commitArray);
for(var k in commitArray)
{
	console.log(commitArray[k]['commitno']+'   '+commitArray[k]['commitmsg']+'  '+commitArray[k]['committime']);
}
}
}
}
