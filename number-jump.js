(() => {
  const chapterSelect = document.querySelector('#chapterSelect');
  const verseSelect = document.querySelector('#verseSelect');
  const chapterInput = document.querySelector('#chapterNumberInput');
  const verseInput = document.querySelector('#verseNumberInput');
  if (!chapterSelect || !verseSelect || !chapterInput || !verseInput) return;

  const LABELS = {
    ko:{chapter:'장 번호',verse:'절 번호'}, en:{chapter:'Chapter number',verse:'Verse number'},
    fr:{chapter:'Numéro du chapitre',verse:'Numéro du verset'}, de:{chapter:'Kapitelnummer',verse:'Versnummer'},
    zh:{chapter:'章节编号',verse:'经文编号'}, ru:{chapter:'Номер главы',verse:'Номер стиха'},
    la:{chapter:'Numerus capitis',verse:'Numerus versus'}, pt:{chapter:'Número do capítulo',verse:'Número do versículo'},
    ar:{chapter:'رقم الأصحاح',verse:'رقم الآية'}
  };

  function uiLang(){ return window.BibleI18n?.lang?.() || 'ko'; }
  function setLabels(){
    const labels = LABELS[uiLang()] || LABELS.en;
    chapterInput.setAttribute('aria-label', labels.chapter);
    chapterInput.title = labels.chapter;
    verseInput.setAttribute('aria-label', labels.verse);
    verseInput.title = labels.verse;
  }

  function optionValues(select){
    return [...select.options].map(option => Number(option.value)).filter(Number.isFinite);
  }

  function syncInput(select,input){
    const values = optionValues(select);
    const max = values.length ? Math.max(...values) : 1;
    input.min = '1';
    input.max = String(max);
    const selected = Number(select.value) || 1;
    if (document.activeElement !== input) input.value = String(Math.min(max, Math.max(1, selected)));
  }

  function syncAll(){
    syncInput(chapterSelect,chapterInput);
    syncInput(verseSelect,verseInput);
    setLabels();
  }

  function commit(input,select){
    const values = optionValues(select);
    const max = values.length ? Math.max(...values) : 1;
    let value = Number.parseInt(input.value,10);
    if (!Number.isFinite(value)) value = Number(select.value) || 1;
    value = Math.min(max,Math.max(1,value));
    input.value = String(value);
    if (select.value !== String(value)) {
      select.value = String(value);
      select.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }

  [[chapterInput,chapterSelect],[verseInput,verseSelect]].forEach(([input,select]) => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        commit(input,select);
        input.blur();
      }
    });
    input.addEventListener('change',() => commit(input,select));
    input.addEventListener('blur',() => commit(input,select));
    input.addEventListener('wheel',event => { if (document.activeElement === input) event.preventDefault(); },{passive:false});
  });

  const observer = new MutationObserver(syncAll);
  observer.observe(chapterSelect,{childList:true,subtree:true,attributes:true,attributeFilter:['value']});
  observer.observe(verseSelect,{childList:true,subtree:true,attributes:true,attributeFilter:['value']});
  chapterSelect.addEventListener('change',() => requestAnimationFrame(syncAll));
  verseSelect.addEventListener('change',() => requestAnimationFrame(syncAll));
  document.querySelector('#bookSelect')?.addEventListener('change',() => setTimeout(syncAll,0));
  document.querySelector('#translationSelect')?.addEventListener('change',() => setTimeout(syncAll,0));
  window.addEventListener('pageshow',syncAll);
  [0,80,250,700].forEach(ms => setTimeout(syncAll,ms));
})();
