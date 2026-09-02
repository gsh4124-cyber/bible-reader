(() => {
  const lang = location.pathname.split('/').filter(Boolean).pop() || 'ko';
  const translations = {en:'kjv',fr:'lsg',de:'luth1912',zh:'cuv',ru:'synodal',la:'vulg',pt:'almeida1819',ar:'svd'};
  const translation = translations[lang] || 'krv1961';
  const base = '/bible-reader/';
  fetch(`${base}index.html`, {cache:'no-store'})
    .then(r => { if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(html => {
      const canonical = `https://gsh4124-cyber.github.io/bible-reader/${lang === 'ko' ? '' : lang + '/'}`;
      const bootstrap = `<script>window.__BIBLE_LANG__=${JSON.stringify(lang)};window.__BIBLE_TRANSLATION__=${JSON.stringify(translation)};try{localStorage.setItem('bible-reader-translation',${JSON.stringify(translation)})}catch(_){}</`+`script>`;
      html = html
        .replace('<head>', `<head><base href="${base}">${bootstrap}`)
        .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
      document.open(); document.write(html); document.close();
    })
    .catch(err => {
      console.error(err);
      document.body.innerHTML='<main style="font-family:system-ui;padding:32px"><h1>Bible Reader</h1><p>Loading failed. <a href="/bible-reader/">Open the main reader</a></p></main>';
    });
})();
