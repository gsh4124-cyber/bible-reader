import fs from 'node:fs';

const langs=['ko','en','fr','de','zh','ru','la','pt','ar'];
const requiredUiKeys=['all','old','new','chapter','verse','title','search','compare','prev','next','single','dual','notes','fontDown','fontUp','fontDownTitle','fontUpTitle','widthTitle','close','ad','loading','loadError','recordsTitle','highlights','savedVerses','savedChapters','backup','restore','goVerse','goChapter','addNote','editNote','deleteHighlight','deleteSaved','save','deleteNote','cancel','notePlaceholder','emptyHighlights','emptySaved','emptyChapters','backupConfirm','backupInvalid','source','description','pageTitle'];
const src=fs.readFileSync('i18n.js','utf8');
const bookBlock=src.match(/const BOOK_NAMES = \{([\s\S]*?)\n  \};\n\n  const UI/);
if(!bookBlock) throw new Error('BOOK_NAMES block not found');
for(const lang of langs){
  const m=bookBlock[1].match(new RegExp(`\\n    ${lang}:\\[([\\s\\S]*?)\\](?:,|$)`));
  if(!m) throw new Error(`BOOK_NAMES.${lang} missing`);
  const count=(m[1].match(/'(?:\\'|[^'])*'/g)||[]).length;
  if(count!==66) throw new Error(`BOOK_NAMES.${lang} must contain 66 names; got ${count}`);
}
for(const lang of langs){
  const uiStart=src.indexOf(`    ${lang}:{`,src.indexOf('const UI ='));
  if(uiStart<0) throw new Error(`UI.${lang} missing`);
  const next=langs.map(l=>src.indexOf(`    ${l}:{`,uiStart+1)).filter(i=>i>uiStart).sort((a,b)=>a-b)[0] ?? src.indexOf('\n  };',uiStart);
  const block=src.slice(uiStart,next);
  for(const key of requiredUiKeys){if(!block.includes(`${key}:`))throw new Error(`UI.${lang}.${key} missing`);}
}

const index=fs.readFileSync('index.html','utf8');
if(index.indexOf('src="i18n.js"')>index.indexOf('src="reference.js"')) throw new Error('i18n.js must load before localized navigation helpers');
for(const lang of langs.filter(l=>l!=='ko')){
  const html=fs.readFileSync(`${lang}/index.html`,'utf8');
  if(!html.includes(`<html lang="${lang}"`) && !(lang==='ar'&&html.includes('<html lang="ar" dir="rtl"'))) throw new Error(`${lang}: html lang mismatch`);
  if(lang==='ar'&&!html.includes('dir="rtl"')) throw new Error('ar: RTL direction missing');
  if(!html.includes(`rel="canonical" href="https://gsh4124-cyber.github.io/bible-reader/${lang}/"`)) throw new Error(`${lang}: canonical mismatch`);
  if(!html.match(/<title>[^<]+<\/title>/)) throw new Error(`${lang}: title missing`);
  if(!html.match(/name="description" content="[^"]+"/)) throw new Error(`${lang}: description missing`);
  for(const alt of langs){
    const href=alt==='ko'?'https://gsh4124-cyber.github.io/bible-reader/':`https://gsh4124-cyber.github.io/bible-reader/${alt}/`;
    if(!html.includes(`hreflang="${alt}" href="${href}"`)) throw new Error(`${lang}: hreflang ${alt} missing`);
  }
}
for(const lang of langs){
  const href=lang==='ko'?'https://gsh4124-cyber.github.io/bible-reader/':`https://gsh4124-cyber.github.io/bible-reader/${lang}/`;
  if(!index.includes(`hreflang="${lang}" href="${href}"`)) throw new Error(`root hreflang ${lang} missing`);
}

const sitemap=fs.readFileSync('sitemap.xml','utf8');
for(const lang of langs){
  const url=lang==='ko'?'https://gsh4124-cyber.github.io/bible-reader/':`https://gsh4124-cyber.github.io/bible-reader/${lang}/`;
  if(!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`sitemap missing ${url}`);
}

const finder=fs.readFileSync('book-finder.js','utf8');
if(!finder.includes('BibleI18n?.bookNames')) throw new Error('book finder must use localized book names');
const reference=fs.readFileSync('reference.js','utf8');
if(!reference.includes('BibleI18n?.bookNames')) throw new Error('reference parser must accept localized book names');
const records=fs.readFileSync('records-enhancements.js','utf8');
if(!records.includes('const tr=currentTranslation')) throw new Error('records must render verse text using current translation');
const runtime=fs.readFileSync('runtime-ui-i18n.js','utf8');
for(const lang of langs){if(!runtime.includes(`${lang}:{translation:`))throw new Error(`runtime accessibility labels missing for ${lang}`);}
const layout=fs.readFileSync('i18n-layout.css','utf8');
if(!layout.includes('@media(min-width:1360px)')||!layout.includes('@media(max-width:760px)')) throw new Error('responsive multilingual header breakpoints missing');
if(!layout.includes('#testamentSelect{display:none!important}')) throw new Error('simplified primary topbar must hide the redundant testament selector');
if(!layout.includes('.location-controls .top-search{display:grid!important')) throw new Error('search input and action must render as one grouped control');

console.log('Multilingual integrity OK: 9 locales, 66 localized books each, navigation/search/records hooks and SEO entry points present.');
