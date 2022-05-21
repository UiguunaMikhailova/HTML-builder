const fs = require('fs');
const path = require('path');
const pathFile = path.join(__dirname, 'text.txt');
const {
  stdout, stdin
} = process;

fs.open(pathFile, 'w', (err) => {
  if (err) throw err;
});

stdout.write('Введите текст:  ');

stdin.on('data', (data) => {
  const str = data.toString();
  if (str.toLowerCase().trim() === 'exit') {
    process.emit('SIGINT');
  }
  fs.appendFile(pathFile, `${str}`, function (err) {
    if (err) throw err;
    console.log('Добавьте текст, либо выйдите CTRL + C / exit:  ');
  });
});

process.on('SIGINT', () => {
  console.log('До новых встреч!');
  process.exit(0);
});