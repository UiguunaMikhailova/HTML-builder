const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

fs.promises.mkdir(copyFolder, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  fs.readdir(copyFolder, (err, copies) => {
    if (err) throw err;
    copies.forEach(copy => {
      fs.unlink(path.join(copyFolder, copy), err => {
        if (err) throw err;
      });
    });
    files.forEach(file => {
      let name = file.name;
      const input = fs.createReadStream(`./04-copy-directory/files/${name}`, 'utf-8');
      const output = fs.createWriteStream(`./04-copy-directory/files-copy/${name}`);
      input.pipe(output);
    });
  });
});

