const path = require('path');
const fs = require('fs');
fs.readFile(path.join(__dirname, 'text.txt'),'utf-8', function(error,data){
  if(error) throw error;
  console.log(data);
});