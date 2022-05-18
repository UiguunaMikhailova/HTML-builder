const fs = require('fs');
const path = require('path');
const testFolder = path.join(__dirname, '/secret-folder/');

fs.readdir(testFolder, { withFileTypes: true }, (err, files) => {
  files.forEach(file => {
    if (!file.isDirectory()) {
      let name2 = path.join(__dirname, `/secret-folder/${file.name}`)
      let name = path.parse(file.name).name;
      let ext = path.extname(file.name);
      fs.stat(`${name2}`, (err, stats) => {
        if (!err) {
          let size = stats.size;
          console.log(`${name} - ${ext.slice(1)} - ${Math.floor(size / 1024)}kb`);
        }
      });
    }
  });
});