(() => {
  const translation = document.querySelector('#translationSelect');
  if (!translation || typeof BOOKS === 'undefined' || typeof TRANSLATIONS === 'undefined') return;

  const EN_BOOKS = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];

  const UI = {
    ko:{lang:'ko',all:'전체',old:'구약',new:'신약',chapter:n=>`${n}장`,verse:n=>`${n}절`,search:'검색',compare:'비교',prev:'← 이전 장',next:'다음 장 →',single:'한 면 보기',dual:'양면 보기',placeholder:'검색',loading:'본문을 불러오는 중…',title:(b,c)=>`${b} ${c}장`,book:i=>BOOKS[i]?.ko||'',notes:'메모장'},
    en:{lang:'en',all:'All',old:'Old Testament',new:'New Testament',chapter:n=>`Chapter ${n}`,verse:n=>`Verse ${n}`,search:'Search',compare:'Compare',prev:'← Previous',next:'Next →',single:'Single view',dual:'Two-page view',placeholder:'Search',loading:'Loading Scripture…',title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||'',notes:'Notes'},
    fr:{lang:'fr',all:'Tout',old:'Ancien Testament',new:'Nouveau Testament',chapter:n=>`Chapitre ${n}`,verse:n=>`Verset ${n}`,search:'Rechercher',compare:'Comparer',prev:'← Précédent',next:'Suivant →',single:'Vue simple',dual:'Double page',placeholder:'Rechercher',loading:'Chargement…',title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||'',notes:'Notes'},
    de:{lang:'de',all:'Alle',old:'Altes Testament',new:'Neues Testament',chapter:n=>`Kapitel ${n}`,verse:n=>`Vers ${n}`,search:'Suchen',compare:'Vergleichen',prev:'← Zurück',next:'Weiter →',single:'Einzelseite',dual:'Doppelseite',placeholder:'Suchen',loading:'Bibeltext wird geladen…',title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||'',notes:'Notizen'},
    zh:{lang:'zh',all:'全部',old:'旧约',new:'新约',chapter:n=>`第${n}章`,verse:n=>`第${n}节`,search:'搜索',compare:'对照',prev:'← 上一章',next:'下一章 →',single:'单页',dual:'双页',placeholder:'搜索',loading:'正在载入经文…',title:(b,c)=>`${b} 第${c}章`,book:i=>EN_BOOKS[i]||'',notes:'记录'},
    ru:{lang:'ru',all:'Все',old:'Ветхий Завет',new:'Новый Завет',chapter:n=>`Глава ${n}`,verse:n=>`Стих ${n}`,search:'Поиск',compare:'Сравнить',prev:'← Назад',next:'Далее →',single:'Одна страница',dual:'Две страницы',placeholder:'Поиск',loading:'Загрузка текста…',title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||'',notes:'Записи'},
    la:{lang:'la',all:'Omnia',old:'Vetus Testamentum',new:'Novum Testamentum',chapter:n=>`Caput ${n}`,verse:n=>`Versus ${n}`,search:'Quaere',compare:'Compara',prev:'← Prior',next:'Proximus →',single:'Una pagina',dual:'Duae paginae',placeholder:'Quaere',loading:'Textus oneratur…',title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||'',notes:'Notae'},
    pt:{lang:'pt',all:'Todos',old:'Antigo Testamento',new:'Novo Testamento',chapter:n=>`Capítulo ${n}`,verse:n=>`Versículo ${n}`,search:'Buscar',compare:'Comparar',prev:'← Anterior',next:'Próximo →',single:'Uma página',dual:'Duas páginas',placeholder:'Buscar',loading:'Carregando…',title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||'',notes:'Notas'},
    ar:{lang:'ar',all:'الكل',old:'العهد القديم',new:'العهد الجديد',chapter:n=>`إصحاح ${n}`,verse:n=>`آية ${n}`,search:'بحث',compare:'مقارنة',prev:'→ السابق',next:'التالي ←',single:'صفحة واحدة',dual:'صفحتان',placeholder:'بحث',loading:'جارٍ تحميل النص…',title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||'',notes:'السجلات'}
  };

  function languageKey() {
    const langSelect=document.querySelector('#languageSelect');
    if(langSelect && UI[langSelect.value]) return langSelect.value;
    const tr = TRANSLATIONS[translation.value] || TRANSLATIONS.krv1961;
    if (tr.id === 'krv1961') return 'ko';
    return UI[tr.lang] ? tr.lang : 'en';
  }
  function t() { return UI[languageKey()] || UI.en; }
  function setText(selector, value) { const el = document.querySelector(selector); if (el && el.textContent !== value) el.textContent = value; }

  function applyStatic() {
    const s=t();
    document.documentElement.lang=s.lang;
    document.documentElement.dir=s.lang==='ar'?'rtl':'ltr';
    setText('#searchButton',s.search); setText('#compareToggle',s.compare);
    setText('#prevChapterTitle',s.prev); setText('#nextChapterTitle',s.next);
    setText('#prevChapterBottom',s.prev); setText('#nextChapterBottom',s.next);
    setText('#singlePageView',s.single); setText('#dualPageView',s.dual);
    setText('#fontDown','A−'); setText('#fontUp','A+'); setText('#widthToggle','↔');
    setText('#notebookToggle',s.notes);
    const input=document.querySelector('#searchInput'); if(input) input.placeholder=s.placeholder;
    const fd=document.querySelector('#fontDown'); if(fd) fd.title='Decrease font size';
    const fu=document.querySelector('#fontUp'); if(fu) fu.title='Increase font size';
    const wt=document.querySelector('#widthToggle'); if(wt) wt.title='Reading width';
  }

  function applySelects() {
    const s=t();
    const testament=document.querySelector('#testamentSelect');
    if(testament && testament.options.length>=3){testament.options[0].textContent=s.all;testament.options[1].textContent=s.old;testament.options[2].textContent=s.new;}
    const books=document.querySelector('#bookSelect'); if(books) [...books.options].forEach(o=>{o.textContent=s.book(Number(o.value));});
    const chapters=document.querySelector('#chapterSelect'); if(chapters) [...chapters.options].forEach(o=>{o.textContent=s.chapter(Number(o.value));});
    const verses=document.querySelector('#verseSelect'); if(verses) [...verses.options].forEach(o=>{o.textContent=s.verse(Number(o.value)||1);});
  }

  function applyTitle() {
    if(typeof state==='undefined') return;
    const label=t().title(t().book(state.bookIndex),state.chapter);
    const title=document.querySelector('#chapterTitle'); if(title) title.textContent=label;
    document.title=`${label} · ${(TRANSLATIONS[translation.value]||TRANSLATIONS.krv1961).name}`;
  }

  function applyStatus() {
    const status=document.querySelector('#status');
    if(status && !status.hidden && /불러오는 중|Loading Scripture|Chargement|geladen|载入|Загрузка|oneratur|Carregando|تحميل/i.test(status.textContent)) status.textContent=t().loading;
  }

  function applyAll(){ applyStatic(); applySelects(); applyTitle(); applyStatus(); }
  window.BibleI18n = { apply:applyAll, lang:languageKey, text:t, bookName:i=>t().book(i) };

  function schedule(){ [0,100,300,700,1400,2200].forEach(ms=>setTimeout(applyAll,ms)); }
  translation.addEventListener('change',schedule);
  document.querySelector('#languageSelect')?.addEventListener('change',schedule);
  document.querySelector('#bookSelect')?.addEventListener('change',schedule);
  document.querySelector('#chapterSelect')?.addEventListener('change',schedule);
  document.querySelector('#testamentSelect')?.addEventListener('change',schedule);
  schedule();
})();