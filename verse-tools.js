(() => {
  const verses = document.querySelector('#verses');
  const heading = document.querySelector('.chapter-heading');
  if (!verses) return;

  const STORE_KEY = 'bible-reader-verse-marks-v1';
  const CHAPTER_KEY = 'bible-reader-chapter-bookmarks-v1';
  const LABELS = {
    ko:{copy:'복사',highlight:'하이라이트',saveVerse:'구절 저장',removeVerse:'구절 저장 해제',note:'메모',noteTitle:'구절 메모',save:'저장',removeNote:'메모 삭제',cancel:'취소',chapterBookmark:'장 북마크',removeChapterBookmark:'장 북마크 해제'},
    en:{copy:'Copy',highlight:'Highlight',saveVerse:'Save verse',removeVerse:'Remove saved verse',note:'Note',noteTitle:'Verse note',save:'Save',removeNote:'Delete note',cancel:'Cancel',chapterBookmark:'Bookmark chapter',removeChapterBookmark:'Remove chapter bookmark'},
    fr:{copy:'Copier',highlight:'Surligner',saveVerse:'Enregistrer',removeVerse:'Retirer',note:'Note',noteTitle:'Note du verset',save:'Enregistrer',removeNote:'Supprimer',cancel:'Annuler',chapterBookmark:'Ajouter ce chapitre',removeChapterBookmark:'Retirer ce chapitre'},
    de:{copy:'Kopieren',highlight:'Markieren',saveVerse:'Vers speichern',removeVerse:'Vers entfernen',note:'Notiz',noteTitle:'Versnotiz',save:'Speichern',removeNote:'Notiz löschen',cancel:'Abbrechen',chapterBookmark:'Kapitel merken',removeChapterBookmark:'Kapitel entfernen'},
    zh:{copy:'复制',highlight:'高亮',saveVerse:'保存经文',removeVerse:'取消保存',note:'笔记',noteTitle:'经文笔记',save:'保存',removeNote:'删除笔记',cancel:'取消',chapterBookmark:'收藏本章',removeChapterBookmark:'取消收藏本章'},
    ru:{copy:'Копировать',highlight:'Выделить',saveVerse:'Сохранить стих',removeVerse:'Удалить стих',note:'Заметка',noteTitle:'Заметка к стиху',save:'Сохранить',removeNote:'Удалить заметку',cancel:'Отмена',chapterBookmark:'Закладка главы',removeChapterBookmark:'Убрать закладку'},
    la:{copy:'Copia',highlight:'Nota',saveVerse:'Serva versum',removeVerse:'Remove versum',note:'Commentarium',noteTitle:'Commentarium versus',save:'Serva',removeNote:'Remove',cancel:'Claude',chapterBookmark:'Serva caput',removeChapterBookmark:'Remove caput'}
  };

  let marks = loadJson(STORE_KEY);
  let chapterBookmarks = loadJson(CHAPTER_KEY);
  let activeToolbar = null;
  let noteEditor = null;

  function lang() {
    if (window.BibleI18n?.lang) return window.BibleI18n.lang();
    const tr = window.TRANSLATIONS?.[document.querySelector('#translationSelect')?.value];
    return tr?.lang || (tr?.id === 'krv1961' ? 'ko' : 'en');
  }
  function labels(){ return LABELS[lang()] || LABELS.en; }
  function loadJson(key){ try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (_) { return {}; } }
  function saveMarks(){ localStorage.setItem(STORE_KEY, JSON.stringify(marks)); }
  function saveChapterBookmarks(){ localStorage.setItem(CHAPTER_KEY, JSON.stringify(chapterBookmarks)); }
  function translation(){ return document.querySelector('#translationSelect')?.value || 'krv1961'; }
  function bookIndex(){ return typeof state !== 'undefined' ? state.bookIndex : 0; }
  function chapterNumber(){ return typeof state !== 'undefined' ? state.chapter : 1; }
  function currentKey(verse){ return `${translation()}:${bookIndex()}:${chapterNumber()}:${verse}`; }
  function currentChapterKey(){ return `${translation()}:${bookIndex()}:${chapterNumber()}`; }
  function currentBookName(){ return window.BibleI18n?.bookName ? window.BibleI18n.bookName(bookIndex()) : BOOKS[bookIndex()].ko; }
  function currentReference(verse){ return `${currentBookName()} ${chapterNumber()}:${verse}`; }
  function markFor(key){ return marks[key] || {highlight:false,bookmark:false,note:''}; }

  function applyMarks(){
    verses.querySelectorAll('.verse').forEach(row => {
      const key = currentKey(row.dataset.verse);
      const mark = markFor(key);
      row.classList.toggle('user-highlight', !!mark.highlight);
      row.classList.toggle('user-bookmarked', !!mark.bookmark);
      row.classList.toggle('user-noted', !!mark.note?.trim());
      ensureTrigger(row);
    });
    ensureChapterBookmark();
    updateChapterBookmark();
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

  function ensureChapterBookmark(){
    if (!heading || heading.querySelector('.chapter-bookmark-button')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chapter-bookmark-button';
    button.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation();
      const key = currentChapterKey();
      if (chapterBookmarks[key]) delete chapterBookmarks[key];
      else chapterBookmarks[key] = {translation:translation(),bookIndex:bookIndex(),chapter:chapterNumber(),label:`${currentBookName()} ${chapterNumber()}장`,savedAt:Date.now()};
      saveChapterBookmarks();
      updateChapterBookmark();
    });
    const title = heading.querySelector('h1');
    title?.insertAdjacentElement('afterend', button);
  }

  function updateChapterBookmark(){
    const button = heading?.querySelector('.chapter-bookmark-button');
    if (!button) return;
    const saved = !!chapterBookmarks[currentChapterKey()];
    const l = labels();
    button.textContent = saved ? '★' : '☆';
    button.classList.toggle('active', saved);
    button.title = saved ? l.removeChapterBookmark : l.chapterBookmark;
    button.setAttribute('aria-label', saved ? l.removeChapterBookmark : l.chapterBookmark);
    button.setAttribute('aria-pressed', saved ? 'true' : 'false');
  }

  function closeToolbar(){ activeToolbar?.remove(); activeToolbar = null; }
  function closeNoteEditor(){ noteEditor?.remove(); noteEditor = null; }
  function actionButton(text, handler){
    const b=document.createElement('button'); b.type='button'; b.textContent=text;
    b.addEventListener('click', e=>{e.preventDefault();e.stopPropagation();handler();});
    return b;
  }

  function openNoteEditor(row, key){
    closeToolbar(); closeNoteEditor();
    const l = labels();
    const mark = markFor(key);
    const editor = document.createElement('div');
    editor.className = 'verse-note-editor';
    const title = document.createElement('strong'); title.textContent = `${l.noteTitle} · ${currentReference(Number(row.dataset.verse))}`;
    const textarea = document.createElement('textarea'); textarea.value = mark.note || ''; textarea.placeholder = l.note;
    const actions = document.createElement('div'); actions.className = 'verse-note-actions';
    const save = actionButton(l.save, ()=>{
      const next = markFor(key); next.note = textarea.value.trim(); marks[key] = next; saveMarks(); applyMarks(); closeNoteEditor();
    });
    const remove = actionButton(l.removeNote, ()=>{
      const next = markFor(key); next.note = ''; marks[key] = next; saveMarks(); applyMarks(); closeNoteEditor();
    });
    const cancel = actionButton(l.cancel, closeNoteEditor);
    actions.append(save, remove, cancel);
    editor.append(title, textarea, actions);
    document.body.append(editor); noteEditor = editor;
    requestAnimationFrame(()=>textarea.focus());
  }

  function openToolbar(row, anchor){
    closeToolbar(); closeNoteEditor();
    const verse = Number(row.dataset.verse);
    const key = currentKey(verse);
    const mark = markFor(key);
    const l = labels();
    const bar=document.createElement('div');
    bar.className='verse-action-popover';
    const rect=anchor.getBoundingClientRect();
    bar.style.top=`${window.scrollY + rect.bottom + 6}px`;
    bar.style.left=`${Math.max(12, Math.min(window.scrollX + rect.left - 220, window.scrollX + window.innerWidth - 420))}px`;

    bar.append(
      actionButton(l.copy, async()=>{
        const text=row.querySelector('.verse-text')?.textContent?.trim() || '';
        try { await navigator.clipboard.writeText(`${currentReference(verse)}\n${text}`); } catch (_) {}
        closeToolbar();
      }),
      actionButton(mark.highlight?labels().removeHighlight || '강조 해제':l.highlight, ()=>{
        const next=markFor(key); next.highlight=!next.highlight; marks[key]=next; saveMarks(); applyMarks(); closeToolbar();
      }),
      actionButton(l.note, ()=>openNoteEditor(row,key)),
      actionButton(mark.bookmark?l.removeVerse:l.saveVerse, ()=>{
        const next=markFor(key); next.bookmark=!next.bookmark; marks[key]=next; saveMarks(); applyMarks(); closeToolbar();
      })
    );
    document.body.append(bar); activeToolbar=bar;
  }

  document.addEventListener('click', e=>{
    if(activeToolbar && !activeToolbar.contains(e.target)) closeToolbar();
    if(noteEditor && !noteEditor.contains(e.target)) closeNoteEditor();
  });
  window.addEventListener('scroll', closeToolbar, {passive:true});
  window.addEventListener('resize', closeToolbar);
  ['translationSelect','bookSelect','chapterSelect'].forEach(id=>document.querySelector(`#${id}`)?.addEventListener('change', ()=>setTimeout(applyMarks, 350)));
  const observer=new MutationObserver(()=>requestAnimationFrame(applyMarks));
  observer.observe(verses,{childList:true});
  applyMarks();
})();