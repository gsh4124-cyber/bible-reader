(() => {
  const ACCESS = {
    ko:{translation:'성경 버전',language:'언어',testament:'성경 범위',book:'성경책',chapter:'장',verse:'절',search:'성경 검색',tools:'읽기 도구',view:'보기 방식',compare:'역본 비교',left:'왼쪽 비교 역본',right:'오른쪽 비교 역본',swap:'좌우 역본 바꾸기',theme:'테마',verseActions:'구절 도구',copyHint:'클릭하면 이 절을 복사합니다.'},
    en:{translation:'Bible version',language:'Language',testament:'Bible section',book:'Bible book',chapter:'Chapter',verse:'Verse',search:'Bible search',tools:'Reading tools',view:'View mode',compare:'Translation comparison',left:'Left translation',right:'Right translation',swap:'Swap translations',theme:'Theme',verseActions:'Verse actions',copyHint:'Click to copy this verse.'},
    fr:{translation:'Version biblique',language:'Langue',testament:'Partie de la Bible',book:'Livre biblique',chapter:'Chapitre',verse:'Verset',search:'Recherche biblique',tools:'Outils de lecture',view:'Mode d’affichage',compare:'Comparaison des versions',left:'Version de gauche',right:'Version de droite',swap:'Permuter les versions',theme:'Thème',verseActions:'Actions du verset',copyHint:'Cliquez pour copier ce verset.'},
    de:{translation:'Bibelübersetzung',language:'Sprache',testament:'Bibelteil',book:'Bibelbuch',chapter:'Kapitel',verse:'Vers',search:'Bibelsuche',tools:'Lesewerkzeuge',view:'Ansicht',compare:'Übersetzungsvergleich',left:'Linke Übersetzung',right:'Rechte Übersetzung',swap:'Übersetzungen tauschen',theme:'Darstellung',verseActions:'Versaktionen',copyHint:'Klicken, um diesen Vers zu kopieren.'},
    zh:{translation:'圣经版本',language:'语言',testament:'圣经范围',book:'圣经书卷',chapter:'章',verse:'节',search:'圣经搜索',tools:'阅读工具',view:'显示方式',compare:'译本对照',left:'左侧译本',right:'右侧译本',swap:'交换译本',theme:'主题',verseActions:'经文操作',copyHint:'点击复制本节经文。'},
    ru:{translation:'Перевод Библии',language:'Язык',testament:'Раздел Библии',book:'Книга Библии',chapter:'Глава',verse:'Стих',search:'Поиск по Библии',tools:'Инструменты чтения',view:'Режим просмотра',compare:'Сравнение переводов',left:'Левый перевод',right:'Правый перевод',swap:'Поменять переводы',theme:'Тема',verseActions:'Действия со стихом',copyHint:'Нажмите, чтобы скопировать стих.'},
    la:{translation:'Versio Bibliae',language:'Lingua',testament:'Pars Bibliae',book:'Liber Bibliae',chapter:'Caput',verse:'Versus',search:'Quaestio Bibliae',tools:'Instrumenta lectionis',view:'Modus visus',compare:'Comparatio versionum',left:'Versio sinistra',right:'Versio dextra',swap:'Versiones permuta',theme:'Species',verseActions:'Actiones versus',copyHint:'Preme ut hunc versum copies.'},
    pt:{translation:'Versão da Bíblia',language:'Idioma',testament:'Parte da Bíblia',book:'Livro da Bíblia',chapter:'Capítulo',verse:'Versículo',search:'Pesquisar na Bíblia',tools:'Ferramentas de leitura',view:'Modo de visualização',compare:'Comparação de versões',left:'Versão à esquerda',right:'Versão à direita',swap:'Trocar versões',theme:'Tema',verseActions:'Ações do versículo',copyHint:'Clique para copiar este versículo.'},
    ar:{translation:'ترجمة الكتاب المقدس',language:'اللغة',testament:'قسم الكتاب المقدس',book:'سفر الكتاب المقدس',chapter:'الأصحاح',verse:'الآية',search:'البحث في الكتاب المقدس',tools:'أدوات القراءة',view:'طريقة العرض',compare:'مقارنة الترجمات',left:'الترجمة اليسرى',right:'الترجمة اليمنى',swap:'تبديل الترجمات',theme:'المظهر',verseActions:'إجراءات الآية',copyHint:'انقر لنسخ هذه الآية.'}
  };

  const ACTIONS = {
    pt:{'Copy':'Copiar','Highlight':'Destacar','Remove highlight':'Remover destaque','Save verse':'Salvar versículo','Remove saved verse':'Remover versículo salvo','Note':'Nota','Verse note':'Nota do versículo','Bookmark chapter':'Salvar capítulo','Remove chapter bookmark':'Remover capítulo salvo','Notes':'Notas','My records':'Meus registros','No saved notes.':'Nenhuma nota salva.','Verse actions':'Ações do versículo'},
    ar:{'Copy':'نسخ','Highlight':'تمييز','Remove highlight':'إلغاء التمييز','Save verse':'حفظ الآية','Remove saved verse':'إلغاء حفظ الآية','Note':'ملاحظة','Verse note':'ملاحظة الآية','Bookmark chapter':'حفظ الأصحاح','Remove chapter bookmark':'إلغاء حفظ الأصحاح','Notes':'السجلات','My records':'سجلاتي','No saved notes.':'لا توجد ملاحظات محفوظة.','Verse actions':'إجراءات الآية'}
  };

  const RIGHTS = {
    ko:{pd:'퍼블릭 도메인',expired:'저작재산권 만료'},en:{pd:'Public Domain',expired:'Copyright term expired'},fr:{pd:'Domaine public',expired:'Droits patrimoniaux expirés'},de:{pd:'Gemeinfrei',expired:'Urheberrechtliche Schutzfrist abgelaufen'},zh:{pd:'公有领域',expired:'著作财产权保护期已届满'},ru:{pd:'Общественное достояние',expired:'Срок имущественных прав истёк'},la:{pd:'Dominium publicum',expired:'Iura patrimonialia exspiraverunt'},pt:{pd:'Domínio público',expired:'Prazo patrimonial expirado'},ar:{pd:'ملكية عامة',expired:'انتهت مدة الحقوق المالية'}
  };

  function lang(){return window.BibleI18n?.lang?.() || 'ko';}
  function text(){return window.BibleI18n?.text?.() || {};}
  function access(){return ACCESS[lang()] || ACCESS.en;}

  function replaceEnglishFallbacks(root=document.body){
    const dict=ACTIONS[lang()];
    if(!dict || !root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(['SCRIPT','STYLE'].includes(node.parentElement?.tagName))return;
      const raw=node.nodeValue;const key=raw.trim();if(dict[key])node.nodeValue=raw.replace(key,dict[key]);
    });
    root.querySelectorAll?.('[aria-label],[title]').forEach(el=>{
      for(const attr of ['aria-label','title']){const value=el.getAttribute(attr);if(value&&dict[value])el.setAttribute(attr,dict[value]);}
    });
  }

  function applyAccess(){
    const a=access();
    const labels={translationSelect:a.translation,languageSelect:a.language,testamentSelect:a.testament,bookSelect:a.book,chapterSelect:a.chapter,verseSelect:a.verse,searchInput:a.search,leftTranslation:a.left,rightTranslation:a.right,themeToggle:a.theme};
    Object.entries(labels).forEach(([id,label])=>document.querySelector('#'+id)?.setAttribute('aria-label',label));
    document.querySelector('.location-controls')?.setAttribute('aria-label',a.search);
    document.querySelector('.toolbar')?.setAttribute('aria-label',a.tools);
    document.querySelector('.reader-view-controls')?.setAttribute('aria-label',a.view);
    document.querySelector('#comparePanel')?.setAttribute('aria-label',a.compare);
    const swap=document.querySelector('#swapTranslations');if(swap){swap.title=a.swap;swap.setAttribute('aria-label',a.swap);}
    document.querySelectorAll('.verse-actions-trigger').forEach(el=>el.setAttribute('aria-label',a.verseActions));
    document.querySelectorAll('.verse-text').forEach(el=>el.title=a.copyHint);
  }

  function localizeNotebook(){
    const t=text();const panel=document.querySelector('.notebook-panel');if(!panel)return;
    panel.setAttribute('aria-label',t.recordsTitle || access().tools);
    const title=panel.querySelector('.notebook-title');if(title)title.textContent=t.recordsTitle || title.textContent;
    const close=panel.querySelector('.notebook-close');if(close)close.textContent=t.close || close.textContent;
    const tabMap={highlights:'highlights',saved:'savedVerses',chapters:'savedChapters'};
    Object.entries(tabMap).forEach(([tab,key])=>{const el=panel.querySelector(`[data-tab="${tab}"]`);if(el&&!el.hidden)el.textContent=t[key] || el.textContent;});
    const tools=panel.querySelector('.notebook-data-tools');
    if(tools){const buttons=tools.querySelectorAll('button');if(buttons[0])buttons[0].textContent=t.backup||buttons[0].textContent;if(buttons[1])buttons[1].textContent=t.restore||buttons[1].textContent;}
    panel.querySelectorAll('textarea').forEach(el=>el.placeholder=t.notePlaceholder || el.placeholder);
  }

  function localizeRecordButtons(){
    const t=text();
    document.querySelectorAll('.notebook-item-actions').forEach(group=>{
      [...group.querySelectorAll('button')].forEach(button=>{
        const raw=button.textContent.trim();
        if(['구절로 이동','Go to verse'].includes(raw))button.textContent=t.goVerse||raw;
        else if(['장으로 이동','Go to chapter'].includes(raw))button.textContent=t.goChapter||raw;
        else if(['메모 추가','Add note'].includes(raw))button.textContent=t.addNote||raw;
        else if(['메모 수정','Edit note'].includes(raw))button.textContent=t.editNote||raw;
        else if(['하이라이트 삭제','Delete highlight'].includes(raw))button.textContent=t.deleteHighlight||raw;
        else if(['저장 삭제','Delete saved item'].includes(raw))button.textContent=t.deleteSaved||raw;
      });
    });
    document.querySelectorAll('.notebook-empty').forEach(el=>{
      const raw=el.textContent.trim();
      if(raw==='하이라이트한 성구가 없습니다.')el.textContent=t.emptyHighlights||raw;
      else if(raw==='저장한 성구가 없습니다.')el.textContent=t.emptySaved||raw;
      else if(raw==='저장한 장이 없습니다.')el.textContent=t.emptyChapters||raw;
    });
    const editor=document.querySelector('.record-note-editor');if(editor){
      const buttons=editor.querySelectorAll('.verse-note-actions button');
      if(buttons[0])buttons[0].textContent=t.save||buttons[0].textContent;
      if(buttons[1])buttons[1].textContent=t.deleteNote||buttons[1].textContent;
      if(buttons[2])buttons[2].textContent=t.cancel||buttons[2].textContent;
      const textarea=editor.querySelector('textarea');if(textarea)textarea.placeholder=t.notePlaceholder||textarea.placeholder;
    }
  }

  function localizeSearchSummary(){
    const el=document.querySelector('#searchSummary');if(!el)return;
    const raw=el.textContent.trim();if(!raw||lang()==='ko')return;
    const t=text();let m;
    m=raw.match(/^“(.+)” 검색 준비 중…$/);if(m){el.textContent=`“${m[1]}” ${t.search || 'Search'}…`;return;}
    m=raw.match(/^“(.+)” 검색 중… (\d+)\/(\d+)권$/);if(m){el.textContent=`“${m[1]}” ${t.search || 'Search'}… ${m[2]}/${m[3]}`;return;}
    m=raw.match(/^“(.+)” (\d+)(\+?)개 결과 · (.+?)(?: · (\d+)권 로딩 실패)?$/);
    if(m){
      const resultWord={en:'results',fr:'résultats',de:'Ergebnisse',zh:'个结果',ru:'результатов',la:'eventus',pt:'resultados',ar:'نتيجة'}[lang()]||'results';
      const count=lang()==='zh'?`${m[2]}${m[3]}${resultWord}`:`${m[2]}${m[3]} ${resultWord}`;
      el.textContent=`“${m[1]}” ${count} · ${m[4]}`;return;
    }
  }

  function localizeAttribution(){
    const el=document.querySelector('#translationAttribution');if(!el)return;
    const tr=typeof TRANSLATIONS!=='undefined'?TRANSLATIONS[document.querySelector('#translationSelect')?.value]:null;if(!tr)return;
    const rights=RIGHTS[lang()]||RIGHTS.en;
    if(tr.id==='krv1961'){el.textContent=`${tr.name} · ${tr.attribution||'대한성서공회'} · ${rights.expired}`;return;}
    el.textContent=`${tr.name} · ${tr.language} · ${rights.pd}`;
  }

  function apply(){
    applyAccess();localizeNotebook();localizeRecordButtons();localizeSearchSummary();localizeAttribution();replaceEnglishFallbacks();
  }
  let timer;const schedule=()=>{clearTimeout(timer);timer=setTimeout(apply,35)};
  new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title']});
  ['translationSelect','bookSelect','chapterSelect','verseSelect','leftTranslation','rightTranslation'].forEach(id=>document.querySelector('#'+id)?.addEventListener('change',schedule));
  [0,120,450,1000,1800].forEach(ms=>setTimeout(apply,ms));
})();