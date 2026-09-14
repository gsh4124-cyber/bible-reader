import fs from 'node:fs';

const langs=['en','fr','de','zh','ru','la','pt','ar'];
const requiredFiles=['index.html','full-reader.js','full-reader-loader.js','ui-language-sync.js','local-file-language.js','clipboard.js','exact-search.js','i18n-layout.css'];
for(const file of requiredFiles){if(!fs.existsSync(file))throw new Error(`missing required file: ${file}`);}
for(const lang of langs){if(!fs.existsSync(`${lang}/index.html`))throw new Error(`missing localized entry: ${lang}/index.html`);}

const root=fs.readFileSync('index.html','utf8');
if(!root.includes('<html lang="ko"')) throw new Error('root html lang must remain ko');
if(root.includes('lang="ar" dir="rtl"')) throw new Error('root must not become globally RTL');

for(const lang of langs){
  const html=fs.readFileSync(`${lang}/index.html`,'utf8');
  if(!html.includes(`lang="${lang}"`))throw new Error(`${lang} html lang mismatch`);
  if(!html.includes('full-reader-loader.js'))throw new Error(`${lang} loader missing`);
  if(!html.includes('ui-language-sync.js'))throw new Error(`${lang} UI language sync missing`);
  if(!html.includes('exact-search.js'))throw new Error(`${lang} exact search missing`);
  if(!html.includes('clipboard.js'))throw new Error(`${lang} clipboard missing`);
  if(!html.includes('i18n-layout.css'))throw new Error(`${lang} layout CSS missing`);
}

const runtime=fs.readFileSync('full-reader.js','utf8');
if(runtime.includes('attributes:true')||runtime.includes("attributeFilter:['aria-label','title']")) throw new Error('runtime i18n observer must not observe attributes it writes');

const uiSync=fs.readFileSync('ui-language-sync.js','utf8');
if(!uiSync.includes('Object.defineProperty(document, \'title\'')) throw new Error('UI title owner guard missing');
if(!uiSync.includes('enforceStableUiDirection')) throw new Error('stable UI direction guard missing');
if(!uiSync.includes("location.protocol !== 'file:'")||!uiSync.includes('location.assign(target)')) throw new Error('public UI language change must route to its localized reader URL');
for(const pair of ["ko: 'krv1961'","en: 'kjv'","fr: 'lsg'","de: 'luth1912'","zh: 'cuv'","ru: 'synodal'","la: 'vulg'","pt: 'almeida1819'","ar: 'svd'"]){if(!uiSync.includes(pair))throw new Error(`default translation mapping missing: ${pair}`);}
const localRoute=fs.readFileSync('local-file-language.js','utf8');
if(!localRoute.includes("url.searchParams.set('translation', translation)")) throw new Error('local language switch must update translation query');
const loader=fs.readFileSync('full-reader-loader.js','utf8');
if(loader.includes("lang==='ar'?' dir=\"rtl\"'")) throw new Error('localized entry loader must not force global RTL');
if(!loader.includes('const failure =')) throw new Error('localized loader failure messages missing');

const layout=fs.readFileSync('i18n-layout.css','utf8');
if(!layout.includes('.centered-nav .location-controls{display:grid!important')||!layout.includes('grid-template-rows:42px!important')||!layout.includes('@media(min-width:761px)')||!layout.includes('@media(max-width:760px)')) throw new Error('responsive multilingual header single-row contract missing');
if(!layout.includes('.location-controls .top-search{display:grid!important')) throw new Error('search input and action must render as one grouped control');
if(!layout.includes('word-spacing:normal!important')) throw new Error('chapter heading must preserve visible spacing between book name and chapter');

const clipboard=fs.readFileSync('clipboard.js','utf8');
if(!clipboard.includes('BibleI18n?.scriptureLang')) throw new Error('copied scripture references must follow translation language, not UI language');
if(!clipboard.includes('`[${translationName()}] ${refParts(startVerse, endVerse)}')) throw new Error('copied scripture must include the selected translation before the reference');
if(!clipboard.includes('${localizedPageName()} · ${SITE_URL}')) throw new Error('copied scripture must keep localized page name and site URL on one attribution line');
for(const lang of langs){if(!clipboard.includes(`${lang}:`)&&lang!=='ko')throw new Error(`clipboard localized page name missing for ${lang}`);}
const exactSearch=fs.readFileSync('exact-search.js','utf8');
if(!exactSearch.includes('BibleI18n?.bookName')) throw new Error('search result references must follow translation language');
for(const lang of langs){if(!exactSearch.includes(`${lang}:{prepare:`))throw new Error(`search runtime messages missing for ${lang}`);}

console.log('i18n validation passed');
