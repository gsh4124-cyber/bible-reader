(() => {
  const title = document.querySelector('#chapterTitle');
  const bookSelect = document.querySelector('#bookSelect');
  const chapterSelect = document.querySelector('#chapterSelect');
  const verseSelect = document.querySelector('#verseSelect');
  if (!title || !bookSelect || !chapterSelect || !verseSelect) return;

  const OT_END_INDEX = 38;
  const LABELS = {
    ko:{title:'성경 빠른 이동',old:'구약',new:'신약',book:'성경책',chapter:'장',verse:'절',close:'닫기'},
    en:{title:'Quick Bible navigation',old:'Old Testament',new:'New Testament',book:'Book',chapter:'Chapter',verse:'Verse',close:'Close'},
    fr:{title:'Navigation rapide',old:'Ancien Testament',new:'Nouveau Testament',book:'Livre',chapter:'Chapitre',verse:'Verset',close:'Fermer'},
    de:{title:'Schnellnavigation',old:'Altes Testament',new:'Neues Testament',book:'Buch',chapter:'Kapitel',verse:'Vers',close:'Schließen'},
    zh:{title:'快速导航',old:'旧约',new:'新约',book:'书卷',chapter:'章',verse:'节',close:'关闭'},
    ru:{title:'Быстрый переход',old:'Ветхий Завет',new:'Новый Завет',book:'Книга',chapter:'Глава',verse:'Стих',close:'Закрыть'},
    la:{title:'Navigatio celeris',old:'Vetus Testamentum',new:'Novum Testamentum',book:'Liber',chapter:'Caput',verse:'Versus',close:'Claude'},
    pt:{title:'Navegação rápida',old:'Antigo Testamento',new:'Novo Testamento',book:'Livro',chapter:'Capítulo',verse:'Versículo',close:'Fechar'},
    ar:{title:'تنقل سريع',old:'العهد القديم',new:'العهد الجديد',book:'السفر',chapter:'الأصحاح',verse:'الآية',close:'إغلاق'}
  };

  let testament = Number(bookSelect.value) > OT_END_INDEX ? 'new' : 'old';
  const overlay = document.createElement('div');
  overlay.className = 'title-navigator-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="title-navigator" role="dialog" aria-modal="true" aria-labelledby="titleNavigatorHeading">
      <div class="title-navigator-head">
        <strong id="titleNavigatorHeading"></strong>
        <button type="button" class="title-navigator-close" aria-label="닫기">×</button>
      </div>
      <div class="title-navigator-tabs" role="tablist"></div>
      <section class="title-navigator-section">
        <div class="title-navigator-section-label" data-label="book"></div>
        <div class="title-navigator-grid title-navigator-books"></div>
      </section>
      <section class="title-navigator-section">
        <div class="title-navigator-section-label" data-label="chapter"></div>
        <div class="title-navigator-grid title-navigator-chapters"></div>
      </section>
      <section class="title-navigator-section">
        <div class="title-navigator-section-label" data-label="verse"></div>
        <div class="title-navigator-grid title-navigator-verses"></div>
      </section>
    </section>`;
  document.body.append(overlay);

  const dialog = overlay.querySelector('.title-navigator');
  const heading = overlay.querySelector('#titleNavigatorHeading');
  const closeButton = overlay.querySelector('.title-navigator-close');
  const tabs = overlay.querySelector('.title-navigator-tabs');
  const books = overlay.querySelector('.title-navigator-books');
  const chapters = overlay.querySelector('.title-navigator-chapters');
  const verses = overlay.querySelector('.title-navigator-verses');

  function lang(){ return window.BibleI18n?.lang?.() || window.__BIBLE_LANG__ || document.documentElement.lang || 'ko'; }
  function labels(){ return LABELS[lang()] || LABELS.en; }
  function selectOptions(select){ return [...select.options]; }

  function makeChoice(text, selected, onClick){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'title-navigator-choice';
    b.textContent = text;
    b.setAttribute('aria-pressed', String(selected));
    b.addEventListener('click', onClick);
    return b;
  }

  function renderTabs(){
    const l = labels();
    tabs.replaceChildren();
    [['old',l.old],['new',l.new]].forEach(([key,text]) => {
      const b = makeChoice(text, testament === key, () => { testament = key; renderBooks(); renderTabs(); });
      b.classList.add('title-navigator-tab');
      b.setAttribute('role','tab');
      b.setAttribute('aria-selected', String(testament === key));
      tabs.append(b);
    });
  }

  function renderBooks(){
    books.replaceChildren();
    selectOptions(bookSelect).forEach((option,index) => {
      const inCurrent = testament === 'old' ? index <= OT_END_INDEX : index > OT_END_INDEX;
      if (!inCurrent) return;
      books.append(makeChoice(option.textContent.trim(), option.value === bookSelect.value, () => {
        if (bookSelect.value !== option.value) {
          bookSelect.value = option.value;
          bookSelect.dispatchEvent(new Event('change',{bubbles:true}));
        }
        testament = Number(bookSelect.value) > OT_END_INDEX ? 'new' : 'old';
        renderAll();
      }));
    });
  }

  function renderNumberGrid(select, target){
    target.replaceChildren();
    selectOptions(select).forEach(option => {
      const value = option.value;
      target.append(makeChoice(value, value === select.value, () => {
        if (select.value !== value) {
          select.value = value;
          select.dispatchEvent(new Event('change',{bubbles:true}));
        }
        renderAll();
      }));
    });
  }

  function renderAll(){
    const l = labels();
    heading.textContent = l.title;
    closeButton.setAttribute('aria-label',l.close);
    overlay.querySelector('[data-label="book"]').textContent = l.book;
    overlay.querySelector('[data-label="chapter"]').textContent = l.chapter;
    overlay.querySelector('[data-label="verse"]').textContent = l.verse;
    testament = Number(bookSelect.value) > OT_END_INDEX ? 'new' : testament;
    if (Number(bookSelect.value) <= OT_END_INDEX && testament !== 'new') testament = 'old';
    renderTabs();
    renderBooks();
    renderNumberGrid(chapterSelect,chapters);
    renderNumberGrid(verseSelect,verses);
  }

  function open(){
    overlay.hidden = false;
    document.body.classList.add('title-navigator-open');
    testament = Number(bookSelect.value) > OT_END_INDEX ? 'new' : 'old';
    renderAll();
    requestAnimationFrame(() => dialog.focus?.());
  }
  function close(){
    overlay.hidden = true;
    document.body.classList.remove('title-navigator-open');
    title.focus?.({preventScroll:true});
  }

  title.setAttribute('role','button');
  title.setAttribute('tabindex','0');
  title.setAttribute('aria-haspopup','dialog');
  title.classList.add('chapter-title-navigator-trigger');
  title.addEventListener('click',open);
  title.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  closeButton.addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close();});

  const observer = new MutationObserver(() => { if (!overlay.hidden) requestAnimationFrame(renderAll); });
  observer.observe(bookSelect,{childList:true,subtree:true,attributes:true});
  observer.observe(chapterSelect,{childList:true,subtree:true,attributes:true});
  observer.observe(verseSelect,{childList:true,subtree:true,attributes:true});
  window.addEventListener('pageshow',()=>{ if(!overlay.hidden) renderAll(); });
})();