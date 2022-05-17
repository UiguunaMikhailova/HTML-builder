const fs = require('fs');
const path = require('path');
const {
  stdout
} = process;

fs.open(path.join(__dirname, 'text.txt'), 'w', (err) => {
  if (err) throw err;
});

stdout.write('Введите текст: ');

process.stdin.on('data', (data) => {
  const str = data.toString();
  if (str.toLowerCase().trim() === 'exit') {
    console.log('До новых встреч!');
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), `${str}`, function (err) {
    if (err) throw err;
    console.log('Если хотите, можете добавить ещё пару строчек. Либо завершите ctrl + c');
  });
});

process.on('SIGINT', () => {
  console.log('До новых встреч!');
  process.exit(0);
});

// const fs = require('fs');
// const path = require('path');
// const {
//   stdin,
//   stdout
// } = process;

// fs.open(path.join(__dirname, 'text.txt'), 'w', (err) => {
//   if (err) throw err;
// });
// stdout.write('Введите текст: ');


// stdin.on('data', data => {
//   const str = data.toString();
//   const line = str.split(' ')[0];
//   if (line === 'exit') return process.exit();
//   fs.appendFile(path.join(__dirname, 'text.txt'), `${str}`, function (err) {
//     if (err) throw err;
//     console.log('Если хотите, можете добавить ещё пару строчек. Либо завершите ctrl + c');
//   });
// });
// process.on('SIGINT', () => {
//   console.log('До новых встреч!');
//   process.exit(0);
// });