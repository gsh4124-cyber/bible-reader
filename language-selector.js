(() => {
  const LANGS = {
    ko:{label:'한국어',translation:'krv1961',note:'외국어 역본은 공개 도메인 또는 자유 재배포가 확인된 데이터만 제공합니다.'},
    en:{label:'English',translation:'kjv',note:'Foreign-language editions are provided only when public-domain or free redistribution rights are confirmed.'},
    fr:{label:'Français',translation:'lsg',note:'Les éditions étrangères sont proposées uniquement lorsque le domaine public ou la libre redistribution est confirmé.'},
    de:{label:'Deutsch',translation:'luth1912',note:'Fremdsprachige Ausgaben werden nur angeboten, wenn Gemeinfreiheit oder freie Weiterverbreitung bestätigt ist.'},
    zh:{label:'中文',translation:'cuv',note:'仅提供已确认属于公有领域或允许自由再分发的外语版本。'},
    ru:{label:'Русский',translation:'synodal',note:'Иноязычные издания предоставляются только при подтверждённом общественном достоянии или праве свободного распространения.'},
    la:{label:'Latina',translation:'vulg',note:'Versiones peregrinae tantum praebentur cum dominium publicum vel libera redistributio comprobata est.'},
    pt:{label:'Português',translation:'almeida1819',note:'Versões em outros idiomas são oferecidas somente quando o domínio público ou a redistribuição livre está confirmado.'},
    ar:{label:'العربية',translation:'svd',note:'لا تُعرض الترجمات الأجنبية إلا عند تأكيد الملكية العامة أو السماح بإعادة التوزيع بحرية.'}
  };
  const translationSelect=document.querySelector('#translationSelect');
  if(!translationSelect) return;

  // Keep the first control about Bible editions only; language is controlled separately.
  const cleanLabels={krv1961:'개역한글',kjv:'KJV',web:'WEB',asv:'ASV',lsg:'Louis Segond 1910',luth1912:'Lutherbibel 1912',cuv:'和合本 CUV',synodal:'Синодальный',vulg:'Vulgata',almeida1819:'Almeida 1819',svd:'Smith–Van Dyck'};
  const cleanTranslationLabels=()=>{[...translationSelect.options].forEach(o=>{if(cleanLabels[o.value])o.textContent=cleanLabels[o.value]});};
  cleanTranslationLabels();

  const wrap=document.createElement('span');
  wrap.className='language-selector-wrap';
  wrap.style.cssText='display:inline-flex;align-items:center;gap:6px;';
  const select=document.createElement('select');
  select.id='languageSelect';
  select.className='language-select';
  select.setAttribute('aria-label','Language');
  for(const [code,cfg] of Object.entries(LANGS)){
    const option=document.createElement('option');
    option.value=code; option.textContent=cfg.label; select.append(option);
  }
  function codeForTranslation(id){return Object.entries(LANGS).find(([,cfg])=>cfg.translation===id)?.[0] || 'ko';}
  function applyLocale(code){
    const cfg=LANGS[code]||LANGS.ko;
    document.documentElement.lang=code;
    if(code==='ar')document.documentElement.dir='rtl'; else document.documentElement.removeAttribute('dir');
    const note=document.querySelector('.source-note'); if(note)note.textContent=cfg.note;
    cleanTranslationLabels();
  }
  select.value=codeForTranslation(translationSelect.value);
  applyLocale(select.value);
  select.addEventListener('change',()=>{
    const cfg=LANGS[select.value]; if(!cfg)return;
    try{localStorage.setItem('bible-reader-translation',cfg.translation);}catch(_){}
    const base='/bible-reader/';
    location.href=select.value==='ko'?base:`${base}${select.value}/`;
  });
  translationSelect.addEventListener('change',()=>{select.value=codeForTranslation(translationSelect.value);applyLocale(select.value);});
  wrap.append('🌐',select);
  translationSelect.insertAdjacentElement('afterend',wrap);
  [100,500,1200].forEach(ms=>setTimeout(()=>{cleanTranslationLabels();applyLocale(select.value)},ms));
})();
