import fs from 'node:fs';

const langs=['ko','en','fr','de','zh','ru','la','pt','ar'];
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
  if(!src.includes(`${lang}:{`)) throw new Error(`UI.${lang} missing`);
}
const index=fs.readFileSync('index.html','utf8');
for(const lang of langs.filter(l=>l!=='ko')){
  const html=fs.readFileSync(`${lang}/index.html`,'utf8');
  if(!html.includes(`<html lang="${lang}"`) && !(lang==='ar'&&html.includes('<html lang="ar" dir="rtl"'))) throw new Error(`${lang}: html lang mismatch`);
  if(!html.includes(`rel="canonical" href="https://gsh4124-cyber.github.io/bible-reader/${lang}/"`)) throw new Error(`${lang}: canonical mismatch`);
  if(!html.includes('name="description"')) throw new Error(`${lang}: description missing`);
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
console.log('Multilingual integrity OK: 9 locales, 66 books each, SEO entry points present.');
