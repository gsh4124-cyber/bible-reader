(() => {
  const translation = document.querySelector('#translationSelect');
  if (!translation || typeof BOOKS === 'undefined' || typeof TRANSLATIONS === 'undefined') return;

  const EN_BOOKS = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];

  const UI = {
    ko:{lang:'ko',all:'전체',old:'구약',new:'신약',chapter:n=>`${n}장`,verse:n=>`${n}절`,search:'검색',compare:'비교',prev:'← 이전 장',next:'다음 장 →',single:'한 면 보기',dual:'양면 보기',placeholder:'책 이름 · 단어 · 요 3:16',dailyVerse:'오늘의 성구',dailyChapter:'오늘의 묵상장',open:'열기 →',loading:'본문을 불러오는 중…',meditate:(b,c)=>`${b} ${c}장을 천천히 읽으며 묵상해 보세요.`,title:(b,c)=>`${b} ${c}장`,book:i=>BOOKS[i]?.ko||''},
    en:{lang:'en',all:'All',old:'Old Testament',new:'New Testament',chapter:n=>`Chapter ${n}`,verse:n=>`Verse ${n}`,search:'Search',compare:'Compare',prev:'← Previous',next:'Next →',single:'Single view',dual:'Two-page view',placeholder:'Book · keyword · John 3:16',dailyVerse:'Verse of the day',dailyChapter:'Today’s meditation',open:'Open →',loading:'Loading Scripture…',meditate:(b,c)=>`Read ${b} ${c} slowly and reflect on it.`,title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||''},
    fr:{lang:'fr',all:'Tout',old:'Ancien Testament',new:'Nouveau Testament',chapter:n=>`Chapitre ${n}`,verse:n=>`Verset ${n}`,search:'Rechercher',compare:'Comparer',prev:'← Précédent',next:'Suivant →',single:'Vue simple',dual:'Double page',placeholder:'Livre · mot · Jean 3:16',dailyVerse:'Verset du jour',dailyChapter:'Méditation du jour',open:'Ouvrir →',loading:'Chargement…',meditate:(b,c)=>`Lisez ${b} ${c} lentement et méditez.`,title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||''},
    de:{lang:'de',all:'Alle',old:'Altes Testament',new:'Neues Testament',chapter:n=>`Kapitel ${n}`,verse:n=>`Vers ${n}`,search:'Suchen',compare:'Vergleichen',prev:'← Zurück',next:'Weiter →',single:'Einzelseite',dual:'Doppelseite',placeholder:'Buch · Wort · Joh 3,16',dailyVerse:'Vers des Tages',dailyChapter:'Andacht des Tages',open:'Öffnen →',loading:'Bibeltext wird geladen…',meditate:(b,c)=>`Lies ${b} ${c} langsam und denke darüber nach.`,title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||''},
    zh:{lang:'zh',all:'全部',old:'旧约',new:'新约',chapter:n=>`第${n}章`,verse:n=>`第${n}节`,search:'搜索',compare:'对照',prev:'← 上一章',next:'下一章 →',single:'单页',dual:'双页',placeholder:'书卷 · 关键词 · 约 3:16',dailyVerse:'今日经文',dailyChapter:'今日默想',open:'打开 →',loading:'正在载入经文…',meditate:(b,c)=>`慢慢阅读并默想${b}第${c}章。`,title:(b,c)=>`${b} 第${c}章`,book:i=>EN_BOOKS[i]||''},
    ru:{lang:'ru',all:'Все',old:'Ветхий Завет',new:'Новый Завет',chapter:n=>`Глава ${n}`,verse:n=>`Стих ${n}`,search:'Поиск',compare:'Сравнить',prev:'← Назад',next:'Далее →',single:'Одна страница',dual:'Две страницы',placeholder:'Книга · слово · Ин 3:16',dailyVerse:'Стих дня',dailyChapter:'Размышление дня',open:'Открыть →',loading:'Загрузка текста…',meditate:(b,c)=>`Прочитайте ${b} ${c} медленно и поразмышляйте.`,title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||''},
    la:{lang:'la',all:'Omnia',old:'Vetus Testamentum',new:'Novum Testamentum',chapter:n=>`Caput ${n}`,verse:n=>`Versus ${n}`,search:'Quaere',compare:'Compara',prev:'← Prior',next:'Proximus →',single:'Una pagina',dual:'Duae paginae',placeholder:'Liber · verbum · Io 3:16',dailyVerse:'Versus diei',dailyChapter:'Meditatio diei',open:'Aperi →',loading:'Textus oneratur…',meditate:(b,c)=>`Lege ${b} ${c} lente et meditare.`,title:(b,c)=>`${b} ${c}`,book:i=>EN_BOOKS[i]||''}
  };

  function languageKey() {
    const tr = TRANSLATIONS[translation.value] || TRANSLATIONS.krv1961;
    if (tr.id === 'krv1961') return 'ko';
    return UI[tr.lang] ? tr.lang : 'en';
  }
  function t() { return UI[languageKey()] || UI.en; }
  function setText(selector, value) { const el = document.querySelector(selector); if (el && el.textContent !== value) el.textContent = value; }

  function applyStatic() {
    const s=t();
    document.documentElement.lang=s.lang;
    setText('#searchButton',s.search); setText('#compareToggle',s.compare);
    setText('#prevChapterTitle',s.prev); setText('#nextChapterTitle',s.next);
    setText('#prevChapterBottom',s.prev); setText('#nextChapterBottom',s.next);
    setText('#singlePageView',s.single); setText('#dualPageView',s.dual);
    const input=document.querySelector('#searchInput'); if(input) input.placeholder=s.placeholder;
    const kickers=document.querySelectorAll('.daily-kicker'); if(kickers[0]) kickers[0].textContent=s.dailyVerse; if(kickers[1]) kickers[1].textContent=s.dailyChapter;
    document.querySelectorAll('.daily-action').forEach(el=>{el.textContent=s.open;});
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
    if(status && !status.hidden && /불러오는 중|Loading Scripture|Chargement|geladen|载入|Загрузка|oneratur/i.test(status.textContent)) status.textContent=t().loading;
  }

  function captureDailyRefs() {
    const vr=document.querySelector('#dailyVerseRef'), cr=document.querySelector('#dailyChapterRef');
    if(vr && !vr.dataset.bookIndex){const m=vr.textContent.match(/^(.+?)\s+(\d+):(\d+)$/);if(m){const i=BOOKS.findIndex(b=>b.ko===m[1]||EN_BOOKS[b.index]===m[1]);if(i>=0){vr.dataset.bookIndex=i;vr.dataset.chapter=m[2];vr.dataset.verse=m[3];}}}
    if(cr && !cr.dataset.bookIndex){const m=cr.textContent.match(/^(.+?)\s+(\d+)(?:장)?$/);if(m){const i=BOOKS.findIndex(b=>b.ko===m[1]||EN_BOOKS[b.index]===m[1]);if(i>=0){cr.dataset.bookIndex=i;cr.dataset.chapter=m[2];}}}
  }

  async function applyDaily() {
    captureDailyRefs();
    const vr=document.querySelector('#dailyVerseRef'), vt=document.querySelector('#dailyVerseText'), cr=document.querySelector('#dailyChapterRef'), ct=document.querySelector('#dailyChapterText');
    const s=t();
    if(vr?.dataset.bookIndex){const i=Number(vr.dataset.bookIndex), c=Number(vr.dataset.chapter), v=Number(vr.dataset.verse);vr.textContent=`${s.book(i)} ${c}:${v}`;try{const data=await fetchBook(BOOKS[i],translation.value);const chapter=data.chapters.find(x=>Number(x.chapter)===c);const verse=chapter?.verses.find(x=>Number(x.verse)===v);if(vt&&verse)vt.textContent=verse.text;}catch(_){}}
    if(cr?.dataset.bookIndex){const i=Number(cr.dataset.bookIndex), c=Number(cr.dataset.chapter), b=s.book(i);cr.textContent=s.title(b,c);if(ct)ct.textContent=s.meditate(b,c);}
  }

  function applyAll(){ applyStatic(); applySelects(); applyTitle(); applyStatus(); applyDaily(); }
  window.BibleI18n = { apply:applyAll, lang:languageKey, text:t, bookName:i=>t().book(i) };

  function schedule(){ [0,100,300,700,1400,2200].forEach(ms=>setTimeout(applyAll,ms)); }
  translation.addEventListener('change',schedule);
  document.querySelector('#bookSelect')?.addEventListener('change',schedule);
  document.querySelector('#chapterSelect')?.addEventListener('change',schedule);
  document.querySelector('#testamentSelect')?.addEventListener('change',schedule);
  schedule();
})();