(() => {
  const MARKS_KEY = 'bible-reader-verse-marks-v1';
  const CHAPTERS_KEY = 'bible-reader-chapter-bookmarks-v1';
  const BACKUP_VERSION = 1;
  const readJson = key => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (_) { return {}; } };

  async function goToChapter(item){
    const tr = item.translation || item.tr || 'krv1961';
    if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[tr]) {
      activeTranslationId = tr;
      const select = document.querySelector('#translationSelect');
      if (select) select.value = tr;
      localStorage.setItem('bible-reader-translation', tr);
    }
    if (typeof state !== 'undefined') {
      state.bookIndex = Number(item.bookIndex) || 0;
      state.chapter = Number(item.chapter) || 1;
    }
    document.querySelector('.notebook-close')?.click();
    if (typeof loadCurrent === 'function') await loadCurrent({scrollTop:true});
  }

  function renderChapters(panel){
    const list = panel.querySelector('.notebook-list');
    if (!list) return;
    const items = Object.values(readJson(CHAPTERS_KEY)).sort((a,b)=>(a.bookIndex-b.bookIndex)||(a.chapter-b.chapter));
    list.innerHTML = '';
    if (!items.length) { list.innerHTML = '<p class="notebook-empty">저장한 장이 없습니다.</p>'; return; }
    items.forEach(item => {
      const card = document.createElement('article'); card.className = 'notebook-item chapter-record-item';
      const title = document.createElement('strong');
      title.textContent = item.label || `${typeof BOOKS !== 'undefined' ? (BOOKS[item.bookIndex]?.ko || '') : ''} ${item.chapter}장`;
      const actions = document.createElement('div'); actions.className = 'notebook-item-actions';
      const go = document.createElement('button'); go.type = 'button'; go.textContent = '장으로 이동'; go.addEventListener('click', () => goToChapter(item));
      actions.append(go); card.append(title, actions); list.append(card);
    });
  }

  function exportData(){
    const payload = {app:'bible-reader',version:BACKUP_VERSION,exportedAt:new Date().toISOString(),verseMarks:readJson(MARKS_KEY),chapterBookmarks:readJson(CHAPTERS_KEY)};
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`bible-reader-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function importData(file){
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data?.app !== 'bible-reader' || typeof data.verseMarks !== 'object' || typeof data.chapterBookmarks !== 'object') throw new Error('invalid');
        if (!confirm('현재 기록을 백업 파일의 기록으로 바꿀까요?')) return;
        localStorage.setItem(MARKS_KEY, JSON.stringify(data.verseMarks || {}));
        localStorage.setItem(CHAPTERS_KEY, JSON.stringify(data.chapterBookmarks || {}));
        location.reload();
      } catch (_) { alert('올바른 성경 읽기 백업 파일이 아닙니다.'); }
    };
    reader.readAsText(file);
  }

  function enhance(panel){
    if (!panel || panel.dataset.recordsEnhanced) return;
    panel.dataset.recordsEnhanced = 'true'; const tabs = panel.querySelector('.notebook-tabs'); if (!tabs) return;
    const chapterTab = document.createElement('button');
    chapterTab.type='button'; chapterTab.dataset.tab='chapters'; chapterTab.textContent='저장한 장'; chapterTab.setAttribute('role','tab');
    chapterTab.addEventListener('click',()=>{tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===chapterTab));renderChapters(panel);});
    tabs.append(chapterTab);
    tabs.querySelectorAll('button:not([data-tab="chapters"])').forEach(button=>button.addEventListener('click',()=>chapterTab.classList.remove('active')));
    const tools=document.createElement('div'); tools.className='notebook-data-tools';
    const out=document.createElement('button'); out.type='button'; out.textContent='기록 백업'; out.addEventListener('click',exportData);
    const input=document.createElement('input'); input.type='file'; input.accept='application/json,.json'; input.hidden=true;
    input.addEventListener('change',()=>{if(input.files?.[0]) importData(input.files[0]);input.value='';});
    const into=document.createElement('button'); into.type='button'; into.textContent='백업 복원'; into.addEventListener('click',()=>input.click());
    tools.append(out,into,input); tabs.insertAdjacentElement('afterend',tools);
  }

  const observer=new MutationObserver(()=>enhance(document.querySelector('.notebook-panel')));
  observer.observe(document.body,{childList:true,subtree:true}); enhance(document.querySelector('.notebook-panel'));
})();
