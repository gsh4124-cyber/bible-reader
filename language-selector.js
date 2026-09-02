(() => {
  const LANGS = {
    ko:{label:'한국어',translation:'krv1961'},
    en:{label:'English',translation:'kjv'},
    fr:{label:'Français',translation:'lsg'},
    de:{label:'Deutsch',translation:'luth1912'},
    zh:{label:'中文',translation:'cuv'},
    ru:{label:'Русский',translation:'synodal'},
    la:{label:'Latina',translation:'vulg'},
    pt:{label:'Português',translation:'almeida1819'},
    ar:{label:'العربية',translation:'svd'}
  };
  const translationSelect=document.querySelector('#translationSelect');
  if(!translationSelect) return;
  const wrap=document.createElement('span');
  wrap.className='language-selector-wrap';
  wrap.style.cssText='display:inline-flex;align-items:center;gap:6px;';
  const select=document.createElement('select');
  select.id='languageSelect';
  select.className='language-select';
  select.setAttribute('aria-label','언어');
  for(const [code,cfg] of Object.entries(LANGS)){
    const option=document.createElement('option');
    option.value=code; option.textContent=cfg.label; select.append(option);
  }
  function codeForTranslation(id){
    return Object.entries(LANGS).find(([,cfg])=>cfg.translation===id)?.[0] || 'ko';
  }
  select.value=codeForTranslation(translationSelect.value);
  select.addEventListener('change',()=>{
    const cfg=LANGS[select.value];
    if(!cfg) return;
    try{localStorage.setItem('bible-reader-translation',cfg.translation);}catch(_){}
    const base='/bible-reader/';
    const target=select.value==='ko'?base:`${base}${select.value}/`;
    location.href=target;
  });
  translationSelect.addEventListener('change',()=>{select.value=codeForTranslation(translationSelect.value)});
  wrap.append('🌐',select);
  translationSelect.insertAdjacentElement('afterend',wrap);
})();
