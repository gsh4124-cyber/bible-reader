(() => {
  const form = document.querySelector("#searchForm");
  const input = document.querySelector("#searchInput");
  const button = document.querySelector("#searchButton");
  const panel = document.querySelector("#searchPanel");
  const summary = document.querySelector("#searchSummary");
  const resultsEl = document.querySelector("#searchResults");
  const translationSelect = document.querySelector("#translationSelect");
  if (!form || !input || !button || !panel || !summary || !resultsEl) return;

  let runId = 0;

  function renderExactResults(results, query, failed) {
    resultsEl.replaceChildren();
    panel.hidden = false;

    if (!results.length) {
      summary.textContent = failed
        ? `“${query}” 확인된 검색 결과 0개 · ${failed}권 로딩 실패`
        : `“${query}” 검색 결과 0개 · ${TRANSLATIONS[activeTranslationId].name}`;
      return;
    }

    summary.textContent = failed
      ? `“${query}” 확인된 ${results.length}개 결과 · ${TRANSLATIONS[activeTranslationId].name} · ${failed}권 로딩 실패`
      : `“${query}” 총 ${results.length}개 결과 · ${TRANSLATIONS[activeTranslationId].name}`;

    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "search-result";

      const ref = document.createElement("strong");
      ref.textContent = `${result.book.ko} ${result.chapter}:${result.verse}`;

      const text = document.createElement("span");
      text.textContent = result.text;

      item.append(ref, text);
      item.addEventListener("click", () => goToSearchResult(result));
      fragment.append(item);
    });
    resultsEl.append(fragment);
  }

  async function searchAll(query) {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return;

    const currentRun = ++runId;
    const results = [];
    let failed = 0;

    panel.hidden = false;
    resultsEl.replaceChildren();
    button.disabled = true;
    input.disabled = true;
    summary.textContent = `“${query}” 전체 성경 검색 준비 중…`;

    try {
      const batchSize = 6;
      for (let start = 0; start < BOOKS.length; start += batchSize) {
        if (currentRun !== runId) return;
        const batch = BOOKS.slice(start, start + batchSize);
        summary.textContent = `“${query}” 전체 검색 중… ${Math.min(start + batch.length, BOOKS.length)}/${BOOKS.length}권`;

        const loaded = await Promise.all(batch.map(async (book) => {
          try {
            return { book, data: await fetchBook(book, activeTranslationId) };
          } catch (error) {
            console.error(error);
            failed += 1;
            return null;
          }
        }));

        loaded.filter(Boolean).forEach(({ book, data }) => {
          data.chapters.forEach((chapter) => {
            chapter.verses.forEach((verse) => {
              if (String(verse.text).toLocaleLowerCase().includes(normalized)) {
                results.push({
                  book,
                  chapter: Number(chapter.chapter),
                  verse: Number(verse.verse),
                  text: verse.text
                });
              }
            });
          });
        });
      }

      if (currentRun === runId) renderExactResults(results, query, failed);
    } finally {
      if (currentRun === runId) {
        button.disabled = false;
        input.disabled = false;
        input.focus();
      }
    }
  }

  document.addEventListener("submit", (event) => {
    if (event.target !== form) return;
    const query = input.value.trim();
    if (!query) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    searchAll(query);
  }, true);

  translationSelect?.addEventListener("change", () => { runId += 1; });
})();