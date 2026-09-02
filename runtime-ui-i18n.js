(() => {
  const EXTRA = {
    pt:{'Copy':'Copiar','Highlight':'Destacar','Remove highlight':'Remover destaque','Save verse':'Salvar versículo','Remove saved verse':'Remover versículo salvo','Note':'Nota','Verse note':'Nota do versículo','Bookmark chapter':'Salvar capítulo','Remove chapter bookmark':'Remover capítulo salvo','No saved notes.':'Nenhuma nota salva.','Verse actions':'Ações do versículo'},
    ar:{'Copy':'نسخ','Highlight':'تمييز','Remove highlight':'إلغاء التمييز','Save verse':'حفظ الآية','Remove saved verse':'إلغاء حفظ الآية','Note':'ملاحظة','Verse note':'ملاحظة الآية','Bookmark chapter':'حفظ الأصحاح','Remove chapter bookmark':'إلغاء حفظ الأصحاح','No saved notes.':'لا توجد ملاحظات محفوظة.','Verse actions':'إجراءات الآية'}
  };
  const ACCESS = {
    ko:{translation:'성경 버전',language:'언어',testament:'성경 범위',book:'성경책',chapter:'장',verse:'절',search:'성경 검색',tools:'읽기 도구',view:'보기 방식',compare:'역본 비교',left:'왼쪽 비교 역본',right:'오른쪽 비교 역본',swap:'좌우 역본 바꾸기',theme:'테마'},
    en:{translation:'Bible version',language:'Language',testament:'Bible section',book:'Bible book',chapter:'Chapter',verse:'Verse',search:'Bible search',tools:'Reading tools',view:'View mode',compare:'Translation comparison',left:'Left translation',right:'Right translation',swap:'Swap translations',theme:'Theme'},
    fr:{translation:'Version biblique',language:'Langue',testament:'Partie de la Bible',book:'Livre biblique',chapter:'Chapitre',verse:'Verset',search:'Recherche biblique',tools:'Outils de lecture',view:'Mode d’affichage',compare:'Comparaison des versions',left:'Version de gauche',right:'Version de droite',swap:'Permuter les versions',theme:'Thème'},
    de:{translation:'Bibelübersetzung',language:'Sprache',testament:'Bibelteil',book:'Bibelbuch',chapter:'Kapitel',verse:'Vers',search:'Bibelsuche',tools:'Lesewerkzeuge',view:'Ansicht',compare:'Übersetzungsvergleich',left:'Linke Übersetzung',right:'Rechte Übersetzung',swap:'Übersetzungen tauschen',theme:'Darstellung'},
    zh:{translation:'圣经版本',language:'语言',testament:'圣经范围',book:'圣经书卷',chapter:'章',verse:'节',search:'圣经搜索',tools:'阅读工具',view:'显示方式',compare:'译本对照',left:'左侧译本',right:'右侧译本',swap:'交换译本',theme:'主题'},
    ru:{translation:'Перевод Библии',language:'Язык',testament:'Раздел Библии',book:'Книга Библии',chapter:'Глава',verse:'Стих',search:'Поиск по Библии',tools:'Инструменты чтения',view:'Режим просмотра',compare:'Сравнение переводов',left:'Левый перевод',right:'Правый перевод',swap:'Поменять переводы',theme:'Тема'},
    la:{translation:'Versio Bibliae',language:'Lingua',testament:'Pars Bibliae',book:'Liber Bibliae',chapter:'Caput',verse:'Versus',search:'Quaestio Bibliae',tools:'Instrumenta lectionis',view:'Modus visus',compare:'Comparatio versionum',left:'Versio sinistra',right:'Versio dextra',swap:'Versiones permuta',theme:'Species'},
    pt:{translation:'Versão da Bíblia',language:'Idioma',testament:'Parte da Bíblia',book:'Livro da Bíblia',chapter:'Capítulo',verse:'Versículo',search:'Pesquisar na Bíblia',tools:'Ferramentas de leitura',view:'Modo de visualização',compare:'Comparação de versões',left:'Versão à esquerda',right:'Versão à direita',swap:'Trocar versões',theme:'Tema'},
    ar:{translation:'ترجمة الكتاب المقدس',language:'اللغة',testament:'قسم الكتاب المقدس',book:'سفر الكتاب المقدس',chapter:'الأصحاح',verse:'الآية',search:'البحث في الكتاب المقدس',tools:'أدوات القراءة',view:'طريقة العرض',compare:'مقارنة الترجمات',left:'الترجمة اليسرى',right:'الترجمة اليمنى',swap:'تبديل الترجمات',theme:'المظهر'}
  };
  function lang(){return window.BibleI18n?.lang?.()||'ko';}
  function replaceLegacyText(root=document.body){
    const dict=EXTRA[lang()]; if(!dict)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{if(['SCRIPT','STYLE'].includes(node.parentElement?.tagName))return;const raw=node.nodeValue;const s=raw.trim();if(dict[s])node.nodeValue=raw.replace(s,dict[s]);});
    root.querySelectorAll?.('[aria-label],[title]').forEach(el=>{const a=el.getAttribute('aria-label');const t=el.getAttribute('title');if(a&&dict[a])el.setAttribute('aria-label',dict[a]);if(t&&dict[t])el.setAttribute('title',dict[t]);});
  }
  function applyAccess(){
    const a=ACCESS[lang()]||ACCESS.en;
    const labels={translationSelect:a.translation,languageSelect:a.language,testamentSelect:a.testament,bookSelect:a.book,chapterSelect:a.chapter,verseSelect:a.verse,searchInput:a.search,leftTranslation:a.left,rightTranslation:a.right,themeToggle:a.theme};
    Object.entries(labels).forEach(([id,label])=>document.querySelector('#'+id)?.setAttribute('aria-label',label));
    document.querySelector('.location-controls')?.setAttribute('aria-label',a.search);
    document.querySelector('.toolbar')?.setAttribute('aria-label',a.tools);
    document.querySelector('.reader-view-controls')?.setAttribute('aria-label',a.view);
    document.querySelector('#comparePanel')?.setAttribute('aria-label',a.compare);
    const swap=document.querySelector('#swapTranslations');if(swap){swap.title=a.swap;swap.setAttribute('aria-label',a.swap);}
  }
  function apply(){replaceLegacyText();applyAccess();}
  let timer;const schedule=()=>{clearTimeout(timer);timer=setTimeout(apply,25)};
  new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title']});
  [0,150,600,1400].forEach(ms=>setTimeout(apply,ms));
})();
