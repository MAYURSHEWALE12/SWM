const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// Revert to the original warm cream and paper colors the user liked
html = html.replace('--cream:#F8FAFC;', '--cream:#F6F2E7;'); 
html = html.replace('--paper:#FFFFFF;', '--paper:#FFFDF8;'); 

fs.writeFileSync(file, html);
console.log('Colors reverted to the original warm theme!');
