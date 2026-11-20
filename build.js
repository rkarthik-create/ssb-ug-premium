// Builds ./docs (served by GitHub Pages) from ./src.
//   src/index.template.html, src/admission.template.html  -> docs/*.html   ({{A}} is replaced by ASSET_BASE)
//   src/assets/  (photos, logos, hero film downloaded from the reference site) -> docs/assets/
//   src/ph/      (placeholder photos) -> docs/ph/
// ASSET_BASE defaults to the local copy 'assets/'. Set ASSET_BASE to a full URL to hotlink instead.
const fs = require('fs');
const path = require('path');

const BASE = process.env.ASSET_BASE || 'assets/';
const src = path.join(__dirname, 'src');
const out = path.join(__dirname, 'docs');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const [tpl, name] of [['index.template.html', 'index.html'], ['admission.template.html', 'admission.html']]) {
  const html = fs.readFileSync(path.join(src, tpl), 'utf8').split('{{A}}').join(BASE);
  fs.writeFileSync(path.join(out, name), html);
}
for (const f of ['styles.css', 'main.js']) fs.copyFileSync(path.join(src, f), path.join(out, f));
for (const d of ['assets', 'ph']) {
  if (fs.existsSync(path.join(src, d))) fs.cpSync(path.join(src, d), path.join(out, d), { recursive: true });
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('Built docs/ with asset base:', BASE);
