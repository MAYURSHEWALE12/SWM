const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

const styleEnd = html.indexOf('</style>');
const extraStyles = `
  /* Enhanced Design Improvements */
  .auth-card, .form-card, .detail-card, .stat, .role-card, .ccard {
    box-shadow: 0 4px 24px rgba(27,67,50,.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .ccard:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(232,163,61,.15);
  }
  .topbar {
    background: rgba(27,67,50, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .btn-block {
    background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest) 100%);
    box-shadow: 0 4px 16px rgba(27,67,50,.2);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn-block:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(27,67,50,.3);
  }
  input, select, textarea {
    transition: all 0.2s ease;
  }
  input:focus, select:focus, textarea:focus {
    box-shadow: 0 0 0 4px rgba(232,163,61,.2);
  }
  h2, h3, .brand {
    letter-spacing: -0.02em;
  }
`;

const newHtml = html.substring(0, styleEnd) + extraStyles + html.substring(styleEnd);
fs.writeFileSync(file, newHtml);
console.log('Styles enhanced!');
