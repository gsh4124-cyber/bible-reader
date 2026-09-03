import fs from 'node:fs';

const langs=['ko','en','fr','de','zh','ru','la','pt','ar'];
const requiredUiKeys=['chapter','verse','title','search','compare','prev','next','single','dual','notes','fontDown','fontUp','fontDownTitle','fontUpTitle','widthTitle','close','ad','loading','loadError','recordsTitle','highlights','savedVerses','savedChapters','backup','restore','goVerse','goChapter','addNote','editNote','deleteHighlight','deleteSaved','save','deleteNote','cancel','notePlaceholder','emptyHighlights','emptySaved','emptyChapters','backupConfirm','backupInvalid','source','description','pageTitle'];
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
if(index.indexOf('src="local-file-language.js"')>index.indexOf('src="i18n.js"')) throw new Error('local file language routing must load before i18n.js');
if(index.includes('id="testamentSelect"')) throw new Error('retired testament selector must not remain in index.html');
for(const file of ['app.js','book-finder.js','runtime-ui-i18n.js','ui-fix.css','styles.css']){
  const body=fs.readFileSync(file,'utf8');
  if(body.includes('testamentSelect')||body.includes('activeTestament')||body.includes('setTestament')||body.includes('booksForTestament')||body.includes('.testament-select')) throw new Error(`retired testament code remains in ${file}`);
}
if(fs.existsSync('testament-select.js')) throw new Error('retired testament-select.js must be deleted');

for(const lang of langs.filter(l=>l!=='ko')){
  const html=fs.readFileSync(`${lang}/index.html`,'utf8');
  if(!html.includes(`<html lang="${lang}"`)) throw new Error(`${lang}: html lang mismatch`);
  if(lang==='ar'&&html.includes('dir="rtl"')) throw new Error('ar: page shell must not force global RTL layout');
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
if(!runtime.includes('syncScriptureHeading')) throw new Error('runtime must synchronize scripture heading');
if(runtime.includes('syncScriptureAndBrowserTitles')) throw new Error('runtime must not own browser title');
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
if(!layout.includes('@media(min-width:1360px)')||!layout.includes('@media(max-width:760px)')) throw new Error('responsive multilingual header breakpoints missing');
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
const compare=fs.readFileSync('compare.js','utf8');
for(const lang of langs){if(!compare.includes(`${lang}:{loading:`))throw new Error(`comparison runtime messages missing for ${lang}`);}

// Regression guard: native mobile select pickers must not be rebuilt while open.
if(!src.includes("['SCRIPT','STYLE','SELECT','OPTION']")) throw new Error('i18n dynamic walker must skip SELECT/OPTION text nodes');
if(!src.includes("document.activeElement?.tagName==='SELECT'")) throw new Error('i18n must defer select option rewrites while a native picker is active');
const versePicker=fs.readFileSync('verse-picker.js','utf8');
if(versePicker.includes('observer.observe(chapterTitle')) throw new Error('verse picker must not rebuild options from chapter title mutations');
if(!versePicker.includes('document.activeElement===verseSelect')) throw new Error('verse picker must guard against rebuilding while its native picker is active');

for(const file of ['features.css','ui-fix.css']){
  const body=fs.readFileSync(file,'utf8');
  if(body.includes('daily-strip')||body.includes('daily-card')||body.includes('focus-reading')||body.includes('focus-tool')) throw new Error(`retired daily/focus CSS remains in ${file}`);
}

console.log('Multilingual integrity OK: 9 locales, 66 localized books each, Scripture/UI language separation, localized language routing with default translations, stable UI layout direction, local/public routing, navigation/search/records/compare hooks, copied scripture attribution, SEO entry points, and mobile native-select regression guards present.');
