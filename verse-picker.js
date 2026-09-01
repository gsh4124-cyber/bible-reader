(() => {
  const verseSelect=document.querySelector("#verseSelect"),verses=document.querySelector("#verses"),comparePanel=document.querySelector("#comparePanel"),compareRows=document.querySelector("#compareRows"),chapterTitle=document.querySelector("#chapterTitle");
  if(!verseSelect||!verses||!chapterTitle)return;
  let highlightTimer=null;

  function populateVerseSelect(){
    const verseElements=[...verses.querySelectorAll(".verse[data-verse]")];
    const previous=verseSelect.value;
    verseSelect.innerHTML="";
    verseElements.forEach(element=>{const verse=Number(element.dataset.verse);if(!verse)return;const option=document.createElement("option");option.value=String(verse);option.textContent=`${verse}절`;verseSelect.append(option)});
    if(!verseElements.length){const option=document.createElement("option");option.value="1";option.textContent="1절";verseSelect.append(option);verseSelect.value="1";return;}
    const stillExists=previous&&verseElements.some(element=>element.dataset.verse===previous);
    verseSelect.value=stillExists?previous:"1";
  }

  function clearHighlights(){document.querySelectorAll(".verse.verse-picked,.compare-row.verse-picked").forEach(node=>node.classList.remove("verse-picked"));if(highlightTimer)clearTimeout(highlightTimer)}
  function jumpToVerse(verse){clearHighlights();if(!verse)return;const compareVisible=comparePanel&&!comparePanel.hidden,selector=`[data-verse="${CSS.escape(String(verse))}"]`,target=compareVisible?compareRows?.querySelector(`.compare-row${selector}`):verses.querySelector(`.verse${selector}`);if(!target)return;target.classList.add("verse-picked");target.scrollIntoView({behavior:"smooth",block:"center"});highlightTimer=setTimeout(()=>target.classList.remove("verse-picked"),3500)}

  verseSelect.addEventListener("change",()=>jumpToVerse(verseSelect.value));
  const observer=new MutationObserver(()=>requestAnimationFrame(populateVerseSelect));
  observer.observe(verses,{childList:true,subtree:true});
  observer.observe(chapterTitle,{childList:true,subtree:true,characterData:true});
  populateVerseSelect();
})();