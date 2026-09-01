(() => {
  const MARKS_KEY = 'bible-reader-verse-marks-v1';
  const CHAPTERS_KEY = 'bible-reader-chapter-bookmarks-v1';
  const RECORD_NOTES_KEY = 'bible-reader-record-notes-v1';
  const BACKUP_VERSION = 2;
  const readJson = key => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (_) { return {}; } };
  const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function recordNote(id){ return String(readJson(RECORD_NOTES_KEY)[id] || '').trim(); }
  function saveRecordNote(id, text){ const notes=readJson(RECORD_NOTES_KEY); const value=String(text||'').trim(); if(value) notes[id]=value; else delete notes[id]; writeJson(RECORD_NOTES_KEY,notes); }
  function button(text, handler){ const b=document.createElement('button'); b.type='button'; b.textContent=text; b.addEventListener('click',handler); return b; }

  async function goToVerse(item){
    const tr=item.tr || 'krv1961';
    if(typeof TRANSLATIONS!=='undefined' && TRANSLATIONS[tr]){
      activeTranslationId=tr;
      const select=document.querySelector('#translationSelect'); if(select) select.value=tr;
      localStorage.setItem('bible-reader-translation',tr);
    }
    if(typeof state!=='undefined'){ state.bookIndex=item.bookIndex; state.chapter=item.chapter; }
    document.querySelector('.notebook-close')?.click();
    if(typeof loadCurrent==='function') await loadCurrent({scrollTop:false});
    requestAnimationFrame(()=>{
      const row=document.querySelector(`#verses [data-verse="${item.verse}"]`);
      if(!row) return;
      row.classList.add('searched'); row.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(()=>row.classList.remove('searched'),1800);
    });
  }

  async function goToChapter(item){
    const tr=item.translation || item.tr || 'krv1961';
    if(typeof TRANSLATIONS!=='undefined' && TRANSLATIONS[tr]){
      activeTranslationId=tr;
      const select=document.querySelector('#translationSelect'); if(select) select.value=tr;
      localStorage.setItem('bible-reader-translation',tr);
    }
    if(typeof state!=='undefined'){ state.bookIndex=Number(item.bookIndex)||0; state.chapter=Number(item.chapter)||1; }
    document.querySelector('.notebook-close')?.click();
    if(typeof loadCurrent==='function') await loadCurrent({scrollTop:true});
  }

  function openRecordNoteEditor({id,title,onSaved}){
    document.querySelector('.record-note-editor')?.remove();
    const editor=document.createElement('div'); editor.className='verse-note-editor record-note-editor';
    const heading=document.createElement('strong'); heading.textContent=`메모 · ${title}`;
    const textarea=document.createElement('textarea'); textarea.value=recordNote(id); textarea.placeholder='메모를 입력하세요';
    const actions=document.createElement('div'); actions.className='verse-note-actions';
    actions.append(
      button('저장',()=>{saveRecordNote(id,textarea.value);editor.remove();onSaved?.();}),
      button('메모 삭제',()=>{saveRecordNote(id,'');editor.remove();onSaved?.();}),
      button('취소',()=>editor.remove())
    );
    editor.append(heading,textarea,actions); document.body.append(editor); requestAnimationFrame(()=>textarea.focus());
  }

  function noteBlock(id){
    const note=recordNote(id); if(!note) return null;
    const p=document.createElement('p'); p.className='record-note-text'; p.textContent=note; return p;
  }

  async function fillVerseText(item,target){
    if(item.mark?.savedText){target.textContent=item.mark.savedText;return;}
    try{
      const data=await fetchBook(BOOKS[item.bookIndex],item.tr);
      const chapter=data.chapters.find(c=>Number(c.chapter)===item.chapter);
      const verse=chapter?.verses.find(v=>Number(v.verse)===item.verse);
      target.textContent=verse?.text || '';
    }catch(_){target.textContent='본문을 불러오지 못했습니다.';}
  }

  function savedEntries(){
    return Object.entries(readJson(MARKS_KEY)).map(([key,mark])=>{
      const [tr,book,chapter,verse]=key.split(':');
      return {key,mark,tr,bookIndex:Number(book),chapter:Number(chapter),verse:Number(verse)};
    }).filter(item=>item.mark?.bookmark).sort((a,b)=>a.bookIndex-b.bookIndex||a.chapter-b.chapter||a.verse-b.verse);
  }

  function renderSaved(panel){
    const list=panel.querySelector('.notebook-list'); if(!list) return;
    const entries=savedEntries(); list.innerHTML='';
    if(!entries.length){list.innerHTML='<p class="notebook-empty">저장한 성구가 없습니다.</p>';return;}
    entries.forEach(item=>{
      const id=`verse:${item.key}`;
      const card=document.createElement('article'); card.className='notebook-item saved-record-item';
      const ref=document.createElement('strong'); ref.textContent=`${BOOKS[item.bookIndex]?.ko||''} ${item.chapter}:${item.verse}`;
      const body=document.createElement('p'); body.className='saved-verse-text'; body.textContent=item.mark.savedText||'본문을 불러오는 중…'; fillVerseText(item,body);
      const note=noteBlock(id);
      const actions=document.createElement('div'); actions.className='notebook-item-actions';
      actions.append(button('구절로 이동',()=>goToVerse(item)),button(recordNote(id)?'메모 수정':'메모 추가',()=>openRecordNoteEditor({id,title:ref.textContent,onSaved:()=>renderSaved(panel)})));
      card.append(ref,body); if(note) card.append(note); card.append(actions); list.append(card);
    });
  }

  function chapterEntries(){
    return Object.entries(readJson(CHAPTERS_KEY)).map(([key,item])=>({key,...item})).sort((a,b)=>(a.bookIndex-b.bookIndex)||(a.chapter-b.chapter));
  }

  function renderChapters(panel){
    const list=panel.querySelector('.notebook-list'); if(!list) return;
    const items=chapterEntries(); list.innerHTML='';
    if(!items.length){list.innerHTML='<p class="notebook-empty">저장한 장이 없습니다.</p>';return;}
    items.forEach(item=>{
      const id=`chapter:${item.key}`;
      const card=document.createElement('article'); card.className='notebook-item chapter-record-item';
      const title=document.createElement('strong'); title.textContent=item.label||`${BOOKS[item.bookIndex]?.ko||''} ${item.chapter}장`;
      const note=noteBlock(id);
      const actions=document.createElement('div'); actions.className='notebook-item-actions';
      actions.append(button('장으로 이동',()=>goToChapter(item)),button(recordNote(id)?'메모 수정':'메모 추가',()=>openRecordNoteEditor({id,title:title.textContent,onSaved:()=>renderChapters(panel)})));
      card.append(title); if(note) card.append(note); card.append(actions); list.append(card);
    });
  }

  function exportData(){
    const payload={app:'bible-reader',version:BACKUP_VERSION,exportedAt:new Date().toISOString(),verseMarks:readJson(MARKS_KEY),chapterBookmarks:readJson(CHAPTERS_KEY),recordNotes:readJson(RECORD_NOTES_KEY)};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`bible-reader-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function importData(file){
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const data=JSON.parse(reader.result);
        if(data?.app!=='bible-reader'||typeof data.verseMarks!=='object'||typeof data.chapterBookmarks!=='object') throw new Error('invalid');
        if(!confirm('현재 기록을 백업 파일의 기록으로 바꿀까요?')) return;
        writeJson(MARKS_KEY,data.verseMarks||{}); writeJson(CHAPTERS_KEY,data.chapterBookmarks||{}); writeJson(RECORD_NOTES_KEY,data.recordNotes||{}); location.reload();
      }catch(_){alert('올바른 성경 읽기 백업 파일이 아닙니다.');}
    };
    reader.readAsText(file);
  }

  function removeStandaloneMemoAction(){
    document.querySelectorAll('.verse-action-popover button').forEach(b=>{
      const text=b.textContent.trim();
      if(['메모','Note','Notiz','笔记','Заметка','Commentarium'].includes(text)) b.remove();
    });
  }

  function enhance(panel){
    if(!panel||panel.dataset.recordsEnhanced) return;
    panel.dataset.recordsEnhanced='true'; const tabs=panel.querySelector('.notebook-tabs'); if(!tabs) return;
    const notesTab=tabs.querySelector('[data-tab="notes"]'); if(notesTab) notesTab.hidden=true;
    const savedTab=tabs.querySelector('[data-tab="saved"]');
    const highlightTab=tabs.querySelector('[data-tab="highlights"]');
    const chapterTab=document.createElement('button'); chapterTab.type='button'; chapterTab.dataset.tab='chapters'; chapterTab.textContent='저장한 장'; chapterTab.setAttribute('role','tab');
    if(highlightTab) tabs.append(highlightTab);
    if(savedTab) tabs.append(savedTab);
    tabs.append(chapterTab);

    function select(tab){
      tabs.querySelectorAll('button:not([hidden])').forEach(b=>{const active=b===tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
      if(notesTab){notesTab.classList.remove('active');notesTab.setAttribute('aria-selected','false');}
    }
    highlightTab?.addEventListener('click',()=>setTimeout(()=>select(highlightTab),0));
    savedTab?.addEventListener('click',()=>setTimeout(()=>{select(savedTab);renderSaved(panel);},0));
    chapterTab.addEventListener('click',()=>{select(chapterTab);renderChapters(panel);});

    const tools=document.createElement('div'); tools.className='notebook-data-tools';
    const out=button('기록 백업',exportData);
    const input=document.createElement('input'); input.type='file'; input.accept='application/json,.json'; input.hidden=true;
    input.addEventListener('change',()=>{if(input.files?.[0]) importData(input.files[0]);input.value='';});
    const into=button('백업 복원',()=>input.click()); tools.append(out,into,input); tabs.insertAdjacentElement('afterend',tools);

    setTimeout(()=>highlightTab?.click(),0);
  }

  const observer=new MutationObserver(()=>{enhance(document.querySelector('.notebook-panel'));removeStandaloneMemoAction();});
  observer.observe(document.body,{childList:true,subtree:true}); enhance(document.querySelector('.notebook-panel')); removeStandaloneMemoAction();
})();