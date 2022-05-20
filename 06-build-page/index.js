const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const projectAssetsFolder = path.join(__dirname, 'project-dist/assets');
const assetsFolder = path.join(__dirname, 'assets');
const arr = [];

fs.promises.mkdir(projectFolder, { recursive: true }, (err) => {
  if (err) throw err;
});

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
  await deleteCopyFolder(projectAssetsFolder);
  await createCopyFolder(projectAssetsFolder);
  await copyFolder(assetsFolder, projectAssetsFolder);
})().catch(err => console.log(`${err} поймали ошибку5`));


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