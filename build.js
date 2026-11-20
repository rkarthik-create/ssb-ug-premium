// Builds ./docs from ./src.
// ASSET_BASE decides where images/logos/video load from.
//   default  -> the reference site (hotlinked, works with no downloads)
//   ASSET_BASE=./ -> use a local ./docs/ copy of the asset folders once you have them
const fs = require('fs');
const path = require('path');

const BASE = process.env.ASSET_BASE || 'https://pereirastephan94.github.io/ad-intel/';
const src = path.join(__dirname, 'src');
const out = path.join(__dirname, 'docs');

fs.mkdirSync(out, { recursive: true });
const html = fs.readFileSync(path.join(src, 'index.template.html'), 'utf8').split('{{A}}').join(BASE);
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const f of ['styles.css', 'main.js']) fs.copyFileSync(path.join(src, f), path.join(out, f));
console.log('Built docs/ with asset base:', BASE);
