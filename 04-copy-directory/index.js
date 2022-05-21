const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

const deleteCopyFolder = async (path) => {
  return new Promise((resolve, reject) => fs.rm(path, { recursive: true, force: true }, err => {
    if (err) reject(err.message);
    resolve();
  }));
};

const createCopyFolder = async (path) => {
  return new Promise((resolve, reject) => fs.mkdir(path, { recursive: true }, (err) => {
    if (err) reject(err.message);
    resolve();
  }));
};

const copyDirectory = async (inputFolder, outputFolder) => {
  return new Promise((resolve, reject) => fs.readdir(inputFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      reject(err.message);

    } else {

      files.forEach(file => {
        if (file.isDirectory()) {
          fs.promises.mkdir(path.join(outputFolder, file.name), { recursive: true }, (err) => {
            if (err) throw err;
          });
          copyDirectory(path.join(inputFolder, file.name), path.join(outputFolder, `${file.name}`));

        } else if (file.isFile()) {
          const input = fs.createReadStream(path.join(inputFolder, file.name));
          const output = fs.createWriteStream(path.join(outputFolder, file.name));
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
  await copyDirectory(folderPath, copyFolderPath);
})().catch(err => console.log(err));
