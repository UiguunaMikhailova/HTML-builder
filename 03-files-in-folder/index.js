const fs = require('fs');
const path = require('path');
const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (file.isFile()) {
      const pathFile = path.join(secretFolderPath, file.name);
      const name = path.parse(file.name).name;
      const ext = path.extname(file.name).slice(1);
      getSize(pathFile, name, ext);
    }
  });
});

const getSize = (path, name, ext) => {
  fs.stat(path, (err, stats) => {
    if (err) throw err;
    const size = (stats.size / 1024).toFixed(3);
    console.log(`${name} - ${ext} - ${size}kb`);
  });
};