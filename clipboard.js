(() => {
  const versesRoot = document.querySelector("#verses");
  if (!versesRoot || typeof BOOKS === "undefined" || typeof state === "undefined") return;

  function currentBookName() {
    return BOOKS[state.bookIndex]?.ko || "성경";
  }

  function makeReference(startVerse, endVerse = startVerse) {
    const book = currentBookName();
    if (startVerse === endVerse) return `${book} ${state.chapter}장 ${startVerse}절`;
    return `${book} ${state.chapter}장 ${startVerse}–${endVerse}절`;
  }

  function selectedVerseElements(selection) {
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return [];
    const range = selection.getRangeAt(0);
    return [...versesRoot.querySelectorAll(".verse")].filter((verse) => {
      try {
        return range.intersectsNode(verse);
      } catch (_) {
        return false;
      }
    });
  }

  versesRoot.addEventListener("copy", (event) => {
    const selection = window.getSelection();
    const verseElements = selectedVerseElements(selection);
    if (!verseElements.length) return;

    const startVerse = Number(verseElements[0].dataset.verse);
    const endVerse = Number(verseElements[verseElements.length - 1].dataset.verse);
    if (!startVerse || !endVerse) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const text = `${makeReference(startVerse, endVerse)}\n${selectedText}`;
    event.preventDefault();
    event.clipboardData.setData("text/plain", text);
  });

  // 기존 '절 클릭 복사'도 같은 형식으로 맞춘다.
  versesRoot.addEventListener("click", async (event) => {
    const textEl = event.target.closest(".verse-text");
    if (!textEl) return;
    const verseEl = textEl.closest(".verse");
    const verseNumber = Number(verseEl?.dataset.verse);
    if (!verseNumber) return;

    const copyText = `${makeReference(verseNumber)}\n${textEl.textContent.trim()}`;
    try {
      await navigator.clipboard.writeText(copyText);
    } catch (_) {
      const textarea = document.createElement("textarea");
      textarea.value = copyText;
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  }, true);
})();
