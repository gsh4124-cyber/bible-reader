(() => {
  const versesRoot = document.querySelector('#verses');
  if (!versesRoot || typeof BOOKS === 'undefined' || typeof state === 'undefined') return;

  function currentBookName() {
    try { return window.BibleI18n?.bookName?.(state.bookIndex) || BOOKS[state.bookIndex]?.ko || 'Bible'; }
    catch (_) { return BOOKS[state.bookIndex]?.ko || 'Bible'; }
  }

  function refParts(startVerse, endVerse = startVerse) {
    const lang = window.BibleI18n?.lang?.() || 'ko';
    const book = currentBookName();
    const chapter = state.chapter;
    if (lang === 'ko') return startVerse === endVerse ? `${book} ${chapter}장 ${startVerse}절` : `${book} ${chapter}장 ${startVerse}–${endVerse}절`;
    if (lang === 'zh') return startVerse === endVerse ? `${book} 第${chapter}章 第${startVerse}节` : `${book} 第${chapter}章 第${startVerse}–${endVerse}节`;
    if (lang === 'ru') return startVerse === endVerse ? `${book}, глава ${chapter}, стих ${startVerse}` : `${book}, глава ${chapter}, стихи ${startVerse}–${endVerse}`;
    if (lang === 'pt') return startVerse === endVerse ? `${book} ${chapter}:${startVerse}` : `${book} ${chapter}:${startVerse}–${endVerse}`;
    if (lang === 'fr') return startVerse === endVerse ? `${book} ${chapter}:${startVerse}` : `${book} ${chapter}:${startVerse}–${endVerse}`;
    if (lang === 'de') return startVerse === endVerse ? `${book} ${chapter},${startVerse}` : `${book} ${chapter},${startVerse}–${endVerse}`;
    if (lang === 'la') return startVerse === endVerse ? `${book} ${chapter}:${startVerse}` : `${book} ${chapter}:${startVerse}–${endVerse}`;
    if (lang === 'ar') return startVerse === endVerse ? `${book} ${chapter}:${startVerse}` : `${book} ${chapter}:${startVerse}–${endVerse}`;
    return startVerse === endVerse ? `${book} ${chapter}:${startVerse}` : `${book} ${chapter}:${startVerse}–${endVerse}`;
  }

  function selectedVerseElements(selection) {
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return [];
    const range = selection.getRangeAt(0);
    return [...versesRoot.querySelectorAll('.verse')].filter((verse) => {
      try { return range.intersectsNode(verse); } catch (_) { return false; }
    });
  }

  function verseLine(verseEl, overrideText = null) {
    const verseNumber = Number(verseEl?.dataset.verse);
    const text = (overrideText ?? verseEl?.querySelector('.verse-text')?.textContent ?? '').trim();
    if (!verseNumber || !text) return '';
    const lang = window.BibleI18n?.lang?.() || 'ko';
    if (lang === 'ko') return `${verseNumber}절 ${text}`;
    if (lang === 'zh') return `${verseNumber}节 ${text}`;
    if (lang === 'ru') return `${verseNumber} ${text}`;
    if (lang === 'ar') return `${verseNumber} ${text}`;
    return `${verseNumber} ${text}`;
  }

  versesRoot.addEventListener('copy', (event) => {
    const selection = window.getSelection();
    const verseElements = selectedVerseElements(selection);
    if (!verseElements.length) return;
    const startVerse = Number(verseElements[0].dataset.verse);
    const endVerse = Number(verseElements[verseElements.length - 1].dataset.verse);
    if (!startVerse || !endVerse) return;
    let lines = [];
    if (verseElements.length === 1) {
      const selectedText = selection.toString().replace(/\s+/g, ' ').trim();
      const line = verseLine(verseElements[0], selectedText);
      if (line) lines.push(line);
    } else {
      lines = verseElements.map((verseEl) => verseLine(verseEl)).filter(Boolean);
    }
    if (!lines.length) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', `${refParts(startVerse, endVerse)}\n${lines.join('\n')}`);
  });

  versesRoot.addEventListener('click', async (event) => {
    const textEl = event.target.closest('.verse-text');
    if (!textEl) return;
    const verseEl = textEl.closest('.verse');
    const verseNumber = Number(verseEl?.dataset.verse);
    if (!verseNumber) return;
    const copyText = `${refParts(verseNumber)}\n${verseLine(verseEl)}`;
    try { await navigator.clipboard.writeText(copyText); }
    catch (_) {
      const textarea = document.createElement('textarea');
      textarea.value = copyText; document.body.append(textarea); textarea.select(); document.execCommand('copy'); textarea.remove();
    }
  }, true);
})();
