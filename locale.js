(() => {
  const select=document.querySelector('#translationSelect');
  if(!select||typeof BOOKS==='undefined'||typeof TRANSLATIONS==='undefined') return;

  const STRINGS={
    ko:{all:'전체',old:'구약',new:'신약',chapter:n=>`${n}장`,verse:n=>`${n}절`,search:'검색',placeholder:'책 이름 · 단어 · 요 3:16',compare:'비교',prev:'← 이전 장',next:'다음 장 →',single:'한 면 보기',dual:'양면 보기',dailyVerse:'오늘의 성구',dailyChapter:'오늘의 묵상장',open:'열기 →',loading:'본문을 불러오는 중…',meditate:(b,c)=>`${b} ${c}장을 천천히 읽으며 묵상해 보세요.`,title:(b,c)=>`${b} ${c}장`},
    en:{all:'All',old:'Old Testament',new:'New Testament',chapter:n=>`Chapter ${n}`,verse:n=>`Verse ${n}`,search:'Search',placeholder:'Book · keyword · John 3:16',compare:'Compare',prev:'← Previous',next:'Next →',single:'Single view',dual:'Two-page view',dailyVerse:'Verse of the day',dailyChapter:'Today’s meditation',open:'Open →',loading:'Loading Scripture…',meditate:(b,c)=>`Read ${b} ${c} slowly and reflect on it.`,title:(b,c)=>`${b} ${c}`},
    fr:{all:'Tout',old:'Ancien Testament',new:'Nouveau Testament',chapter:n=>`Chapitre ${n}`,verse:n=>`Verset ${n}`,search:'Rechercher',placeholder:'Livre · mot · Jean 3:16',compare:'Comparer',prev:'← Précédent',next:'Suivant →',single:'Vue simple',dual:'Double page',dailyVerse:'Verset du jour',dailyChapter:'Méditation du jour',open:'Ouvrir →',loading:'Chargement…',meditate:(b,c)=>`Lisez lentement ${b} ${c} et méditez.`,title:(b,c)=>`${b} ${c}`},
    de:{all:'Alle',old:'Altes Testament',new:'Neues Testament',chapter:n=>`Kapitel ${n}`,verse:n=>`Vers ${n}`,search:'Suchen',placeholder:'Buch · Wort · Joh 3,16',compare:'Vergleichen',prev:'← Zurück',next:'Weiter →',single:'Einzelseite',dual:'Doppelseite',dailyVerse:'Vers des Tages',dailyChapter:'Heutige Andacht',open:'Öffnen →',loading:'Bibeltext wird geladen…',meditate:(b,c)=>`Lies ${b} ${c} langsam und denke darüber nach.`,title:(b,c)=>`${b} ${c}`},
    zh:{all:'全部',old:'旧约',new:'新约',chapter:n=>`第${n}章`,verse:n=>`第${n}节`,search:'搜索',placeholder:'书卷 · 关键词 · 约 3:16',compare:'对照',prev:'← 上一章',next:'下一章 →',single:'单页',dual:'双页',dailyVerse:'今日经文',dailyChapter:'今日默想',open:'打开 →',loading:'正在载入经文…',meditate:(b,c)=>`慢慢阅读并默想${b}第${c}章。`,title:(b,c)=>`${b} 第${c}章`},
    ru:{all:'Все',old:'Ветхий Завет',new:'Новый Завет',chapter:n=>`Глава ${n}`,verse:n=>`Стих ${n}`,search:'Поиск',placeholder:'Книга · слово · Ин 3:16',compare:'Сравнить',prev:'← Назад',next:'Далее →',single:'Одна страница',dual:'Две страницы',dailyVerse:'Стих дня',dailyChapter:'Размышление дня',open:'Открыть →',loading:'Загрузка текста…',meditate:(b,c)=>`Прочитайте ${b} ${c} медленно и поразмышляйте.`,title:(b,c)=>`${b} ${c}`},
    la:{all:'Omnia',old:'Vetus Testamentum',new:'Novum Testamentum',chapter:n=>`Caput ${n}`,verse:n=>`Versus ${n}`,search:'Quaere',placeholder:'Liber · verbum · Io 3:16',compare:'Compara',prev:'← Prior',next:'Proximus →',single:'Una pagina',dual:'Duae paginae',dailyVerse:'Versus diei',dailyChapter:'Meditatio diei',open:'Aperi →',loading:'Textus oneratur…',meditate:(b,c)=>`Lege ${b} ${c} lente et meditare.`,title:(b,c)=>`${b} ${c}`}
  };

  const NAMES={
    en:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'],
    fr:['Genèse','Exode','Lévitique','Nombres','Deutéronome','Josué','Juges','Ruth','1 Samuel','2 Samuel','1 Rois','2 Rois','1 Chroniques','2 Chroniques','Esdras','Néhémie','Esther','Job','Psaumes','Proverbes','Ecclésiaste','Cantique des cantiques','Ésaïe','Jérémie','Lamentations','Ézéchiel','Daniel','Osée','Joël','Amos','Abdias','Jonas','Michée','Nahum','Habacuc','Sophonie','Aggée','Zacharie','Malachie','Matthieu','Marc','Luc','Jean','Actes','Romains','1 Corinthiens','2 Corinthiens','Galates','Éphésiens','Philippiens','Colossiens','1 Thessaloniciens','2 Thessaloniciens','1 Timothée','2 Timothée','Tite','Philémon','Hébreux','Jacques','1 Pierre','2 Pierre','1 Jean','2 Jean','3 Jean','Jude','Apocalypse'],
    de:['Genesis','Exodus','Levitikus','Numeri','Deuteronomium','Josua','Richter','Rut','1 Samuel','2 Samuel','1 Könige','2 Könige','1 Chronik','2 Chronik','Esra','Nehemia','Ester','Hiob','Psalmen','Sprüche','Prediger','Hohelied','Jesaja','Jeremia','Klagelieder','Hesekiel','Daniel','Hosea','Joel','Amos','Obadja','Jona','Micha','Nahum','Habakuk','Zefanja','Haggai','Sacharja','Maleachi','Matthäus','Markus','Lukas','Johannes','Apostelgeschichte','Römer','1 Korinther','2 Korinther','Galater','Epheser','Philipper','Kolosser','1 Thessalonicher','2 Thessalonicher','1 Timotheus','2 Timotheus','Titus','Philemon','Hebräer','Jakobus','1 Petrus','2 Petrus','1 Johannes','2 Johannes','3 Johannes','Judas','Offenbarung'],
    zh:['创世记','出埃及记','利未记','民数记','申命记','约书亚记','士师记','路得记','撒母耳记上','撒母耳记下','列王纪上','列王纪下','历代志上','历代志下','以斯拉记','尼希米记','以斯帖记','约伯记','诗篇','箴言','传道书','雅歌','以赛亚书','耶利米书','耶利米哀歌','以西结书','但以理书','何西阿书','约珥书','阿摩司书','俄巴底亚书','约拿书','弥迦书','那鸿书','哈巴谷书','西番雅书','哈该书','撒迦利亚书','玛拉基书','马太福音','马可福音','路加福音','约翰福音','使徒行传','罗马书','哥林多前书','哥林多后书','加拉太书','以弗所书','腓立比书','歌罗西书','帖撒罗尼迦前书','帖撒罗尼迦后书','提摩太前书','提摩太后书','提多书','腓利门书','希伯来书','雅各书','彼得前书','彼得后书','约翰一书','约翰二书','约翰三书','犹大书','启示录'],
    ru:['Бытие','Исход','Левит','Числа','Второзаконие','Иисус Навин','Судьи','Руфь','1 Царств','2 Царств','3 Царств','4 Царств','1 Паралипоменон','2 Паралипоменон','Ездра','Неемия','Есфирь','Иов','Псалтирь','Притчи','Екклесиаст','Песнь Песней','Исаия','Иеремия','Плач Иеремии','Иезекииль','Даниил','Осия','Иоиль','Амос','Авдий','Иона','Михей','Наум','Аввакум','Софония','Аггей','Захария','Малахия','Матфей','Марк','Лука','Иоанн','Деяния','Римлянам','1 Коринфянам','2 Коринфянам','Галатам','Ефесянам','Филиппийцам','Колоссянам','1 Фессалоникийцам','2 Фессалоникийцам','1 Тимофею','2 Тимофею','Титу','Филимону','Евреям','Иаков','1 Петра','2 Петра','1 Иоанна','2 Иоанна','3 Иоанна','Иуда','Откровение'],
    la:['Genesis','Exodus','Leviticus','Numeri','Deuteronomium','Iosue','Iudicum','Ruth','1 Samuelis','2 Samuelis','1 Regum','2 Regum','1 Paralipomenon','2 Paralipomenon','Esdrae','Nehemiae','Esther','Iob','Psalmi','Proverbia','Ecclesiastes','Canticum Canticorum','Isaias','Ieremias','Lamentationes','Ezechiel','Daniel','Osee','Ioel','Amos','Abdias','Ionas','Michaeas','Nahum','Habacuc','Sophonias','Aggaeus','Zacharias','Malachias','Matthaeus','Marcus','Lucas','Ioannes','Actus Apostolorum','Romani','1 Corinthii','2 Corinthii','Galatae','Ephesii','Philippenses','Colossenses','1 Thessalonicenses','2 Thessalonicenses','1 Timotheus','2 Timotheus','Titus','Philemon','Hebraei','Iacobus','1 Petrus','2 Petrus','1 Ioannes','2 Ioannes','3 Ioannes','Iudas','Apocalypsis']
  };

  function lang(){const tr=TRANSLATIONS[select.value]||TRANSLATIONS.krv1961;return tr.id==='krv1961'?'ko':(tr.lang||'en')}
  function text(){return STRINGS[lang()]||STRINGS.en}
  function bookName(i){if(lang()==='ko') return BOOKS[i]?.ko||'';return (NAMES[lang()]||NAMES.en)[i]||BOOKS[i]?.ko||''}
  window.BibleI18n={lang,text,bookName};

  function setText(id,value){const el=document.querySelector(id);if(el)el.textContent=value}
  function localizeSelects(){
    const s=text();
    const ts=document.querySelector('#testamentSelect'); if(ts){ts.options[0].textContent=s.all;ts.options[1].textContent=s.old;ts.options[2].textContent=s.new;}
    const bs=document.querySelector('#bookSelect'); if(bs)[...bs.options].forEach(o=>{o.textContent=bookName(Number(o.value))});
    const cs=document.querySelector('#chapterSelect'); if(cs)[...cs.options].forEach(o=>{o.textContent=s.chapter(Number(o.value))});
    const vs=document.querySelector('#verseSelect'); if(vs)[...vs.options].forEach(o=>{o.textContent=s.verse(Number(o.value)||1)});
  }
  function localizeStatic(){
    const s=text(); document.documentElement.lang=lang();
    setText('#searchButton',s.search); const input=document.querySelector('#searchInput');if(input)input.placeholder=s.placeholder;
    setText('#compareToggle',s.compare);setText('#prevChapterTitle',s.prev);setText('#nextChapterTitle',s.next);setText('#prevChapterBottom',s.prev);setText('#nextChapterBottom',s.next);setText('#singlePageView',s.single);setText('#dualPageView',s.dual);
    const kickers=document.querySelectorAll('.daily-kicker');if(kickers[0])kickers[0].textContent=s.dailyVerse;if(kickers[1])kickers[1].textContent=s.dailyChapter;document.querySelectorAll('.daily-action').forEach(x=>x.textContent=s.open);
  }
  function localizeTitle(){if(typeof state==='undefined')return;const h=document.querySelector('#chapterTitle');if(h)h.textContent=text().title(bookName(state.bookIndex),state.chapter)}
  function localizeSearchRefs(){document.querySelectorAll('.search-result strong').forEach(el=>{const m=el.textContent.match(/^(.+?)\s+(\d+):(\d+)$/);if(!m)return;const i=BOOKS.findIndex(b=>b.ko===m[1]||NAMES.en?.[b.index]===m[1]);if(i>=0)el.textContent=`${bookName(i)} ${m[2]}:${m[3]}`})}
  async function localizeDaily(){
    const vr=document.querySelector('#dailyVerseRef'),vt=document.querySelector('#dailyVerseText'),cr=document.querySelector('#dailyChapterRef'),ct=document.querySelector('#dailyChapterText');if(!vr||!cr)return;
    if(!vr.dataset.bookIndex){const m=vr.textContent.match(/^(.+?)\s+(\d+):(\d+)$/);if(m){const i=BOOKS.findIndex(b=>b.ko===m[1]);if(i>=0){vr.dataset.bookIndex=i;vr.dataset.chapter=m[2];vr.dataset.verse=m[3]}}}
    if(!cr.dataset.bookIndex){const m=cr.textContent.match(/^(.+?)\s+(\d+)장$/);if(m){const i=BOOKS.findIndex(b=>b.ko===m[1]);if(i>=0){cr.dataset.bookIndex=i;cr.dataset.chapter=m[2]}}}
    if(vr.dataset.bookIndex){const i=Number(vr.dataset.bookIndex),c=Number(vr.dataset.chapter),v=Number(vr.dataset.verse);vr.textContent=`${bookName(i)} ${c}:${v}`;try{const d=await fetchBook(BOOKS[i],select.value);const ch=d.chapters.find(x=>Number(x.chapter)===c);const vv=ch?.verses.find(x=>Number(x.verse)===v);if(vt&&vv)vt.textContent=vv.text}catch(_){}}
    if(cr.dataset.bookIndex){const i=Number(cr.dataset.bookIndex),c=Number(cr.dataset.chapter),b=bookName(i);cr.textContent=text().chapter(c).includes(String(c))?`${b} ${text().chapter(c)}`:`${b} ${c}`;if(ct)ct.textContent=text().meditate(b,c)}
  }
  function apply(){localizeStatic();localizeSelects();localizeTitle();localizeSearchRefs();localizeDaily()}
  select.addEventListener('change',()=>setTimeout(apply,0));
  const observer=new MutationObserver(()=>{localizeSelects();localizeTitle();localizeSearchRefs()});
  ['#bookSelect','#chapterSelect','#verseSelect','#chapterTitle','#searchResults'].forEach(q=>{const el=document.querySelector(q);if(el)observer.observe(el,{childList:true,subtree:true})});
  setTimeout(apply,350);
})();