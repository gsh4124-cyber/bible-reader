(() => {
  const verses = document.querySelector('#verses');
  if (!verses) return;

  const STORE_KEY = 'bible-reader-verse-marks-v1';
  const LABELS = {
    ko:{copy:'복사',highlight:'하이라이트',bookmark:'북마크',removeHighlight:'강조 해제',removeBookmark:'북마크 해제'},
    en:{copy:'Copy',highlight:'Highlight',bookmark:'Bookmark',removeHighlight:'Remove highlight',removeBookmark:'Remove bookmark'},
    fr:{copy:'Copier',highlight:'Surligner',bookmark:'Signet',removeHighlight:'Retirer le surlignage',removeBookmark:'Retirer le signet'},
    de:{copy:'Kopieren',highlight:'Markieren',bookmark:'Lesezeichen',removeHighlight:'Markierung entfernen',removeBookmark:'Lesezeichen entfernen'},
    zh:{copy:'复制',highlight:'高亮',bookmark:'书签',removeHighlight:'取消高亮',removeBookmark:'取消书签'},
    ru:{copy:'Копировать',highlight:'Выделить',bookmark:'Закладка',removeHighlight:'Убрать выделение',removeBookmark:'Убрать закладку'},
    la:{copy:'Copia',highlight:'Nota',bookmark:'Signum',removeHighlight:'Notam remove',removeBookmark:'Signum remove'}
  };

  let marks = loadMarks();
  let activeToolbar = null;

  function lang() {
    if (window.BibleI18n?.lang) return window.BibleI18n.lang();
    const tr = window.TRANSLATIONS?.[document.querySelector('#translationSelect')?.value];
    return tr?.lang || (tr?.id === 'krv1961' ? 'ko' : 'en');
  }
  function labels(){ return LABELS[lang()] || LABELS.en; }
  function loadMarks(){ try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) { return {}; } }
  function saveMarks(){ localStorage.setItem(STORE_KEY, JSON.stringify(marks)); }
  function currentKey(verse){
    const tr = document.querySelector('#translationSelect')?.value || 'krv1961';
    const book = typeof state !== 'undefined' ? state.bookIndex : 0;
    const chapter = typeof state !== 'undefined' ? state.chapter : 1;
    return `${tr}:${book}:${chapter}:${verse}`;
  }
  function currentReference(verse){
    const bookName = window.BibleI18n?.bookName ? window.BibleI18n.bookName(state.bookIndex) : BOOKS[state.bookIndex].ko;
    return `${bookName} ${state.chapter}:${verse}`;
  }
  function markFor(key){ return marks[key] || {highlight:false,bookmark:false}; }

  function applyMarks(){
    verses.querySelectorAll('.verse').forEach(row => {
      const key = currentKey(row.dataset.verse);
      const mark = markFor(key);
      row.classList.toggle('user-highlight', !!mark.highlight);
      row.classList.toggle('user-bookmarked', !!mark.bookmark);
      ensureTrigger(row);
    });
  }

  function ensureTrigger(row){
    if (row.querySelector('.verse-actions-trigger')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'verse-actions-trigger';
    button.textContent = '⋯';
    button.setAttribute('aria-label', 'Verse actions');
    button.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation(); openToolbar(row, button);
    });
    row.append(button);
  }

  function closeToolbar(){ activeToolbar?.remove(); activeToolbar = null; }
  function actionButton(text, handler){
    const b=document.createElement('button'); b.type='button'; b.textContent=text;
    b.addEventListener('click', e=>{e.preventDefault();e.stopPropagation();handler();});
    return b;
  }

  function openToolbar(row, anchor){
    closeToolbar();
    const verse = Number(row.dataset.verse);
    const key = currentKey(verse);
    const mark = markFor(key);
    const l = labels();
    const bar=document.createElement('div');
    bar.className='verse-action-popover';
    const rect=anchor.getBoundingClientRect();
    bar.style.top=`${window.scrollY + rect.bottom + 6}px`;
    bar.style.left=`${Math.min(window.scrollX + rect.left - 130, window.scrollX + window.innerWidth - 330)}px`;

    bar.append(
      actionButton(l.copy, async()=>{
        const text=row.querySelector('.verse-text')?.textContent?.trim() || '';
        try { await navigator.clipboard.writeText(`${currentReference(verse)}\n${text}`); } catch (_) {}
        closeToolbar();
      }),
      actionButton(mark.highlight?l.removeHighlight:l.highlight, ()=>{
        const next=markFor(key); next.highlight=!next.highlight; marks[key]=next; saveMarks(); applyMarks(); closeToolbar();
      }),
      actionButton(mark.bookmark?l.removeBookmark:l.bookmark, ()=>{
        const next=markFor(key); next.bookmark=!next.bookmark; marks[key]=next; saveMarks(); applyMarks(); closeToolbar();
      })
    );
    document.body.append(bar); activeToolbar=bar;
  }

  document.addEventListener('click', e=>{ if(activeToolbar && !activeToolbar.contains(e.target)) closeToolbar(); });
  window.addEventListener('scroll', closeToolbar, {passive:true});
  window.addEventListener('resize', closeToolbar);
  document.querySelector('#translationSelect')?.addEventListener('change', ()=>setTimeout(applyMarks, 350));
  const observer=new MutationObserver(()=>requestAnimationFrame(applyMarks));
  observer.observe(verses,{childList:true});
  applyMarks();
})();