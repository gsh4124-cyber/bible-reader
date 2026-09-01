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

  function verseLine(verseEl, overrideText = null) {
    const verseNumber = Number(verseEl?.dataset.verse);
    const text = (overrideText ?? verseEl?.querySelector(".verse-text")?.textContent ?? "").trim();
    return verseNumber && text ? `${verseNumber}절 ${text}` : "";
  }

  versesRoot.addEventListener("copy", (event) => {
    const selection = window.getSelection();
    const verseElements = selectedVerseElements(selection);
    if (!verseElements.length) return;

    const startVerse = Number(verseElements[0].dataset.verse);
    const endVerse = Number(verseElements[verseElements.length - 1].dataset.verse);
    if (!startVerse || !endVerse) return;

    let lines = [];
    if (verseElements.length === 1) {
      const selectedText = selection.toString().replace(/\s+/g, " ").trim();
      const line = verseLine(verseElements[0], selectedText);
      if (line) lines.push(line);
    } else {
      lines = verseElements.map((verseEl) => verseLine(verseEl)).filter(Boolean);
    }
    if (!lines.length) return;

    const text = `${makeReference(startVerse, endVerse)}\n${lines.join("\n")}`;
    event.preventDefault();
    event.clipboardData.setData("text/plain", text);
  });

  // 절 클릭 복사도 같은 형식: 제목 다음 줄부터 절 번호 + 본문.
  versesRoot.addEventListener("click", async (event) => {
    const textEl = event.target.closest(".verse-text");
    if (!textEl) return;
    const verseEl = textEl.closest(".verse");
    const verseNumber = Number(verseEl?.dataset.verse);
    if (!verseNumber) return;

    const copyText = `${makeReference(verseNumber)}\n${verseLine(verseEl)}`;
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
