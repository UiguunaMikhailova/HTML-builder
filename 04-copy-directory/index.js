const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const createCopyFolder = async (path) => {
  return new Promise((resolve, rejects) => fs.mkdir(path, { recursive: true }, (err) => {
    if (err) return rejects(err.message);
    resolve();
  }));
};

const deleteCopyFolder = async (path) => {
  return new Promise((resolve, rejects) => fs.rm(path, { recursive: true, force: true }, err => {
    if (err) return rejects(err.message);
    resolve();
  }));
};

const deleteFile = async (p) => {
  return new Promise((resolve, rejects) => fs.unlink(p, err => {
    if (err) return rejects(err.message);
    resolve();
  }));
};


// const deleteFiles = async (pathArg) => {

//   return new Promise((resolve, rejects) => fs.stat(pathArg, (err, stats) => {
//     if (!err) {
//       if (stats.isDirectory()) {

//         fs.readdir(pathArg, { withFileTypes: true }, (err, files) => {
//           if (err) throw err;
//           for (let i = 0; i < files.length; i++) {

//             if (files[i].isDirectory()) {
//               deleteFiles(path.join(pathArg, `${files[i].name}`)) .catch(err => console.log(`${err} поймали ошибку1`));

//             } else if (files[i].isFile()) {
//               deleteFile(path.join(pathArg, `${files[i].name}`)) .catch(err => console.log(`${err} поймали ошибку2`));
//             }
//           }
//         });

//       } else if (stats.isFile()) {
//         deleteFile(pathArg) .catch(err => console.log(`${err} поймали ошибку3`));
//       }

//       deleteCopyFolder(pathArg) .catch(err => console.log(`${err} поймали ошибку4`));
//       resolve();

//     } else {
//       return rejects(err.message);
//     }
//   }));
// };


const copyFolder = async (inputFolder, outputFolder) => {

  return new Promise((resolve, rejects) => fs.readdir(inputFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      return rejects(err.message);

    } else {

      files.forEach(file => {
        if (file.isDirectory()) {
          fs.promises.mkdir(path.join(outputFolder, `${file.name}`), { recursive: true }, (err) => {
            if (err) throw err;
          });
          copyFolder(path.join(inputFolder, `${file.name}`), path.join(outputFolder, `${file.name}`));

        } else if (file.isFile()) {
          let name = file.name;
          const input = fs.createReadStream(`${inputFolder}/${name}`, 'utf-8');
          const output = fs.createWriteStream(`${outputFolder}/${name}`);
          input.pipe(output);
        }
      });

      resolve();
    }
  }));
};


(async () => {
  await deleteCopyFolder(copyFolderPath);
  await createCopyFolder(copyFolderPath);
  await copyFolder(folderPath, copyFolderPath);
})().catch(err => console.log(`${err} поймали ошибку5`));






// function copyFolder(inputFolder, outputFolder) {
//   // fs.promises.mkdir(outputFolder, { recursive: true }, (err) => {
//   //   if (err) throw err;
//   // });
//   fs.readdir(inputFolder, { withFileTypes: true }, (err, files) => {
//     if (err) throw err;

//     fs.readdir(outputFolder, { withFileTypes: true }, (err, copies) => {
//       if (err) throw err;
//       copies.forEach(copy => {
//         if (copy.isDirectory()) {
//           fs.readdir(path.join(outputFolder, copy.name), { withFileTypes: true }, (err, files2) => {
//             if (err) throw err;
//             files2.forEach(file2 => {
//               fs.unlink(path.join(outputFolder, copy.name, file2.name), err => {
//                 if (err) throw err;
//                 fs.rmdir(path.join(outputFolder, copy.name), err => {
//                   if (err) throw err;
//                 });
//               });
//             });
//           });
//           fs.promises.mkdir(path.join(outputFolder, copy.name), { recursive: true }, (err) => {
//             if (err) throw err;
//           });
//         } else {
//           fs.unlink(path.join(outputFolder, copy.name), err => {
//             if (err) throw err;
//           });
//         }
//       });
//       files.forEach(file => {
//         if (file.isDirectory()) {
//           // fs.promises.mkdir(path.join(outputFolder, `${file.name}`), { recursive: true }, (err) => {
//           //   if (err) throw err;
//           // });
//           copyFolder(path.join(inputFolder, `${file.name}`), path.join(outputFolder, `${file.name}`));
//         } else {
//           let name = file.name;
//           const input = fs.createReadStream(`${inputFolder}/${name}`, 'utf-8');
//           const output = fs.createWriteStream(`${outputFolder}/${name}`);
//           input.pipe(output);
//         }
//       });
//     });
//   });
// }
// copyFolder(assetsFolder, projectAssetsFolder);




// fs.readdir(folder, { withFileTypes: true }, (err, files) => {
//   if (err) throw err;
//   fs.readdir(copyFolder, (err, copies) => {
//     if (err) throw err;
//     copies.forEach(copy => {
//       fs.unlink(path.join(copyFolder, copy), err => {
//         if (err) throw err;
//       });
//     });
//     files.forEach(file => {
//       let name = file.name;
//       const input = fs.createReadStream(`./04-copy-directory/files/${name}`, 'utf-8');
//       const output = fs.createWriteStream(`./04-copy-directory/files-copy/${name}`);
//       input.pipe(output);
//     });
//   });
// });




// fs.promises.mkdir(copyFolder, { recursive: true }, (err) => {
  // if (err) throw err;
// })