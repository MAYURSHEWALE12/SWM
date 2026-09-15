const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Update CSS background colors for a purer, professional white
html = html.replace('--cream:#F6F2E7;', '--cream:#F8FAFC;'); // Clean, professional light background
html = html.replace('--paper:#FFFDF8;', '--paper:#FFFFFF;'); // Pure white for cards

// 2. Update the brand text from SMG to SWM
html = html.replace('<title>SMG — Smart Waste Management</title>', '<title>SWM — Smart Waste Management</title>');
html = html.replace('SMG</text></svg>', 'SWM</text></svg>');
html = html.replace('<span class="mark">SMG</span>', '<span class="mark">SWM</span>');
html = html.replace('<p>SMG connects citizens', '<p>SWM connects citizens');
html = html.replace('SMG (Smart Waste Management)', 'SWM (Smart Waste Management)');
html = html.replace('SMG (Smart Waste Management)', 'SWM (Smart Waste Management)'); // Replace multiple occurrences just in case

fs.writeFileSync(file, html);
console.log('Design updated!');
