(() => {
  const toolbar = document.querySelector('.toolbar');
  if (!toolbar) return;

  const LABELS = {
    ko:['집중','집중 해제'], en:['Focus','Exit focus'], fr:['Focus','Quitter'], de:['Fokus','Beenden'], zh:['专注','退出专注'], ru:['Фокус','Выйти'], la:['Focus','Exi']
  };
  let enabled = localStorage.getItem('bible-reader-focus') === 'true';
  const button = document.createElement('button');
  button.id='focusToggle'; button.type='button'; button.className='quick-tool focus-tool';

  function lang(){
    if(window.BibleI18n?.lang) return window.BibleI18n.lang();
    const tr=window.TRANSLATIONS?.[document.querySelector('#translationSelect')?.value];
    return tr?.lang || (tr?.id==='krv1961'?'ko':'en');
  }
  function update(){
    document.body.classList.toggle('focus-reading', enabled);
    const labels=LABELS[lang()]||LABELS.en;
    button.textContent=enabled?labels[1]:labels[0];
    button.setAttribute('aria-pressed',String(enabled));
    localStorage.setItem('bible-reader-focus',String(enabled));
  }
  button.addEventListener('click',()=>{enabled=!enabled;update();});
  document.querySelector('#translationSelect')?.addEventListener('change',()=>setTimeout(update,200));
  toolbar.append(button);
  update();
})();