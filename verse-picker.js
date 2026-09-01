(() => {
  const verseSelect = document.querySelector("#verseSelect");
  const verses = document.querySelector("#verses");
  const comparePanel = document.querySelector("#comparePanel");
  const compareRows = document.querySelector("#compareRows");
  const chapterTitle = document.querySelector("#chapterTitle");
  if (!verseSelect || !verses || !chapterTitle) return;

  let highlightTimer = null;

  function populateVerseSelect() {
    const verseElements = [...verses.querySelectorAll(".verse[data-verse]")];
    const previous = verseSelect.value;
    verseSelect.innerHTML = '<option value="">절</option>';

    verseElements.forEach((element) => {
      const verse = Number(element.dataset.verse);
      if (!verse) return;
      const option = document.createElement("option");
      option.value = String(verse);
      option.textContent = `${verse}절`;
      verseSelect.append(option);
    });

    if (previous && verseElements.some((element) => element.dataset.verse === previous)) {
      verseSelect.value = previous;
    }
  }

  function clearHighlights() {
    document.querySelectorAll(".verse.verse-picked,.compare-row.verse-picked").forEach((node) => {
      node.classList.remove("verse-picked");
    });
    if (highlightTimer) clearTimeout(highlightTimer);
  }

  function jumpToVerse(verse) {
    clearHighlights();
    if (!verse) return;

    const compareVisible = comparePanel && !comparePanel.hidden;
    const selector = `[data-verse="${CSS.escape(String(verse))}"]`;
    const target = compareVisible
      ? compareRows?.querySelector(`.compare-row${selector}`)
      : verses.querySelector(`.verse${selector}`);

    if (!target) return;
    target.classList.add("verse-picked");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightTimer = setTimeout(() => target.classList.remove("verse-picked"), 3500);
  }

  verseSelect.addEventListener("change", () => jumpToVerse(verseSelect.value));

  const observer = new MutationObserver(() => {
    requestAnimationFrame(() => {
      populateVerseSelect();
      verseSelect.value = "";
    });
  });
  observer.observe(verses, { childList: true, subtree: true });
  observer.observe(chapterTitle, { childList: true, subtree: true, characterData: true });

  populateVerseSelect();
})();
