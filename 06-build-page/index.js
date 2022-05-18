const fs = require('fs');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const arr = [];
const projectAssetsFolder = path.join(__dirname, 'project-dist/assets');
const assetsFolder = path.join(__dirname, 'assets');

fs.promises.mkdir(projectFolder, { recursive: true }, (err) => {
  if (err) throw err;
  // fs.promises.mkdir(projectAssetsFolder, { recursive: true }, (err) => {
  //   if (err) throw err;
  // });
});


// fs.readdir(assetsFolder, { withFileTypes: true }, (err, files) => {
//   if (err) throw err;
//   fs.readdir(projectAssetsFolder, (err, copies) => {
//     if (err) throw err;
//     copies.forEach(copy => {
//       fs.unlink(path.join(copyFolder, copy), err => {
//         if (err) throw err;
//       });
//     });
//     files.forEach(file => {
//       if (file.isDirectory) {
//         console.log(1)
//       } else {
//         let name = file.name;
//         const input = fs.createReadStream(`./04-copy-directory/files/${name}`, 'utf-8');
//         const output = fs.createWriteStream(`./04-copy-directory/files-copy/${name}`);
//         input.pipe(output);
//       }
//     });
//   });
// });

function copyFolder(inputFolder, outputFolder) {
  fs.promises.mkdir(outputFolder, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdir(inputFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    fs.readdir(outputFolder, { withFileTypes: true }, (err, copies) => {
      if (err) throw err;
      copies.forEach(copy => {
        if (copy.isDirectory()) {
          fs.readdir(path.join(outputFolder, copy.name), { withFileTypes: true }, (err, files2) => {
            if (err) throw err;
            files2.forEach(file2 => {
              fs.unlink(path.join(outputFolder, copy.name, file2.name), err => {
                if (err) throw err;
                fs.rmdir(path.join(outputFolder, copy.name), err => {
                  if (err) throw err;
                });
              });
            });
          });
        } else {
          fs.unlink(path.join(outputFolder, copy.name), err => {
            if (err) throw err;
          });
        }
      });
      files.forEach(file => {
        if (file.isDirectory()) {
          copyFolder(path.join(inputFolder, `${file.name}`), path.join(outputFolder, `${file.name}`));
        } else {
          let name = file.name;
          const input = fs.createReadStream(`${inputFolder}/${name}`, 'utf-8');
          const output = fs.createWriteStream(`${outputFolder}/${name}`);
          input.pipe(output);
        }
      });
    });
  });
}
copyFolder(assetsFolder, projectAssetsFolder);




fs.readdir(stylesFolder, { withFileTypes: true }, (err, files) => {
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
        const name = file.name;
        fs.readFile(`./06-build-page/styles/${name}`, 'utf-8', (err, dataFile) => {
          if (err) throw err;
          const data = dataFile.split('/n');
          arr.push(data);
          const data2 = arr.flat().join('');
          fs.writeFile('./06-build-page/project-dist/style.css', data2, (err) => {
            if (err) throw err;
          });
        });
      }
    });
  });
});