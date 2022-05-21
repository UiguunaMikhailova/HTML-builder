const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const arr = [];

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  fs.readdir(projectFolder, (err, projectFiles) => {
    if (err) throw err;
    projectFiles.forEach(projectFile => {
      if (path.extname(projectFile) === '.css') {
        fs.unlink(path.join(projectFolder, projectFile), err => {
          if (err) throw err;
        });
      }
    });
    files.forEach(file => {
      if (path.extname(file.name) === '.css') {
        fs.readFile(path.join(folder, file.name), 'utf-8', (err, dataFile) => {
          if (err) throw err;
          const data = dataFile.split('/n');
          arr.push(data);
          const data2 = arr.flat().join('');
          fs.writeFile(path.join(projectFolder, 'bundle.css'), data2, (err) => {
            if (err) throw err;
          });
        });
      }
    });
  });
});