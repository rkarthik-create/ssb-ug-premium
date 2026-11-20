// Builds ./docs (served by GitHub Pages) from ./src.
//   src/index.template.html, src/admission.template.html  -> docs/*.html   ({{A}} is replaced by ASSET_BASE)
//   src/assets/  (photos, logos, hero film downloaded from the reference site) -> docs/assets/
//   src/ph/      (placeholder photos) -> docs/ph/
// ASSET_BASE defaults to the local copy 'assets/'. Set ASSET_BASE to a full URL to hotlink instead.
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const BASE = process.env.ASSET_BASE || 'assets/';
const src = path.join(__dirname, 'src');
const out = path.join(__dirname, 'docs');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// cache-busting: GitHub Pages lets browsers keep CSS/JS for 10 minutes, which can leave a phone with new HTML but old styles.
// A short content hash in the URL forces a fresh download whenever the files change.
const hash = f => crypto.createHash('md5').update(fs.readFileSync(path.join(src, f))).digest('hex').slice(0, 8);
const V = { css: hash('styles.css'), js: hash('main.js') };
// If styles ever fail to load, the section strip stays hidden instead of showing as an unstyled list.
const SAFE = '<style>.section-nav{position:fixed;top:0;left:0;right:0;transform:translateY(-110%);visibility:hidden}.sticky-cta{position:fixed;left:0;right:0;bottom:0;visibility:hidden}</style>';

for (const [tpl, name] of [['index.template.html', 'index.html'], ['admission.template.html', 'admission.html']]) {
  let html = fs.readFileSync(path.join(src, tpl), 'utf8').split('{{A}}').join(BASE);
  html = html
    .replace('<link rel="stylesheet" href="styles.css">', SAFE + '\n<link rel="stylesheet" href="styles.css?v=' + V.css + '">')
    .replace('<script src="main.js"></script>', '<script src="main.js?v=' + V.js + '"></script>');
  fs.writeFileSync(path.join(out, name), html);
}
for (const f of ['styles.css', 'main.js']) fs.copyFileSync(path.join(src, f), path.join(out, f));
for (const d of ['assets', 'ph']) {
  if (fs.existsSync(path.join(src, d))) fs.cpSync(path.join(src, d), path.join(out, d), { recursive: true });
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('Built docs/ with asset base:', BASE);
