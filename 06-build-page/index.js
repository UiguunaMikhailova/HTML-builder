const fs = require('fs');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const projectAssetsFolder = path.join(__dirname, 'project-dist/assets');
const assetsFolder = path.join(__dirname, 'assets');
const arr = [];

fs.promises.mkdir(projectFolder, { recursive: true }, (err) => {
  if (err) throw err;
});

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

const createStyles = async (pathStyles, pathProjectFolder) => {
  return new Promise((resolve, reject) => fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
    if (err) reject(err.message);
    fs.readdir(pathProjectFolder, (err, projectFiles) => {
      if (err) throw err;
      projectFiles.forEach(projectFile => {
        if (path.extname(projectFile) === '.css') {
          fs.unlink(path.join(pathProjectFolder, projectFile), err => {
            if (err) throw err;
          });
        }
      });
      files.forEach(file => {
        if (path.extname(file.name) === '.css') {
          fs.readFile(path.join(stylesFolder, file.name), 'utf-8', (err, dataFile) => {
            if (err) throw err;
            const data = dataFile.split('/n');
            arr.push(data);
            const data2 = arr.flat().join('');
            fs.writeFile(path.join(projectFolder, 'style.css'), data2, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    });
    resolve();
  }));
};

async function createHTML() {
  const pathStream = path.join(__dirname, 'template.html');
  const rs = fs.createReadStream(pathStream);
  const str = await getString(rs);
  const arr = str.split('\n');
  const output = fs.createWriteStream(`${projectFolder}/index.html`);
  for (let string of arr) {
    if (string.trim().startsWith('{{') && string.trim().endsWith('}}')) {
      const nameOfComponent = string.trim();
      const name = nameOfComponent.slice(2, -2);
      const pathStreamComponents = path.join(__dirname, 'components', `${name}.html`);
      let rsComponents;
      rsComponents = fs.createReadStream(pathStreamComponents);
      await pipeComponent(rsComponents, output);
      output.write('\n');
    } else {
      output.write(string);
    }
  }
}

const getString = async (stream) => {
  return new Promise((resolve) => stream.on('data', (data) => {
    resolve(data.toString());
  }));
};

const pipeComponent = (rs, ws) => {
  rs.pipe(ws, { end: false });
  return new Promise((resolve) => rs.on('end', resolve));
};

(async () => {
  await deleteCopyFolder(projectAssetsFolder);
  await createCopyFolder(projectAssetsFolder);
  await copyDirectory(assetsFolder, projectAssetsFolder);
  await createStyles(stylesFolder, projectFolder);
  createHTML();
})().catch(err => console.log(err));

