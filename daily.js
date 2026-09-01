(() => {
  const verseCard = document.querySelector("#dailyVerseCard");
  const verseRefEl = document.querySelector("#dailyVerseRef");
  const verseTextEl = document.querySelector("#dailyVerseText");
  const chapterCard = document.querySelector("#dailyChapterCard");
  const chapterRefEl = document.querySelector("#dailyChapterRef");
  if (!verseCard || !verseRefEl || !verseTextEl || !chapterCard || !chapterRefEl) return;

  const DAILY_VERSES = [
    ["시편", 23, 1], ["시편", 27, 1], ["시편", 46, 1], ["시편", 103, 2], ["시편", 119, 105],
    ["잠언", 3, 5], ["잠언", 16, 9], ["이사야", 40, 31], ["이사야", 41, 10], ["예레미야", 29, 11],
    ["마태복음", 5, 16], ["마태복음", 6, 33], ["마태복음", 11, 28], ["요한복음", 3, 16], ["요한복음", 8, 12],
    ["요한복음", 14, 6], ["요한복음", 14, 27], ["로마서", 5, 8], ["로마서", 8, 28], ["로마서", 12, 2],
    ["고린도전서", 13, 13], ["고린도후서", 5, 17], ["갈라디아서", 5, 22], ["빌립보서", 4, 6], ["빌립보서", 4, 13],
    ["데살로니가전서", 5, 16], ["히브리서", 11, 1], ["야고보서", 1, 5], ["베드로전서", 5, 7], ["요한일서", 4, 19],
    ["요한계시록", 21, 4]
  ];

  const DAILY_CHAPTERS = [
    ["창세기", 1], ["출애굽기", 20], ["신명기", 6], ["여호수아", 1], ["시편", 1], ["시편", 23], ["시편", 27],
    ["시편", 91], ["시편", 103], ["잠언", 3], ["전도서", 3], ["이사야", 40], ["이사야", 53], ["호세아", 11],
    ["마태복음", 5], ["마태복음", 6], ["마태복음", 7], ["누가복음", 15], ["요한복음", 1], ["요한복음", 3],
    ["요한복음", 14], ["로마서", 8], ["로마서", 12], ["고린도전서", 13], ["갈라디아서", 5], ["빌립보서", 4],
    ["히브리서", 11], ["야고보서", 1], ["요한일서", 4], ["요한계시록", 21], ["요한계시록", 22]
  ];

  function localDayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function hash(value) {
    let result = 0;
    for (let i = 0; i < value.length; i += 1) result = ((result << 5) - result + value.charCodeAt(i)) | 0;
    return Math.abs(result);
  }

  function findBook(name) {
    return BOOKS.find((book) => book.ko === name);
  }

  async function goTo(bookName, chapter, verse = null) {
    const book = findBook(bookName);
    if (!book) return;
    state.bookIndex = book.index;
    state.chapter = chapter;
    await loadCurrent();
    if (!verse) return;
    requestAnimationFrame(() => {
      const target = versesEl.querySelector(`[data-verse="${verse}"]`);
      if (!target) return;
      target.classList.add("searched");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => target.classList.remove("searched"), 1800);
    });
  }

  async function setup() {
    const key = localDayKey();
    const versePick = DAILY_VERSES[hash(`verse:${key}`) % DAILY_VERSES.length];
    const chapterPick = DAILY_CHAPTERS[hash(`chapter:${key}`) % DAILY_CHAPTERS.length];

    const [bookName, chapter, verse] = versePick;
    const book = findBook(bookName);
    verseRefEl.textContent = `${bookName} ${chapter}:${verse}`;
    verseTextEl.textContent = "본문을 불러오는 중…";

    if (book) {
      try {
        const data = await fetchBook(book);
        const chapterData = data.chapters.find((item) => Number(item.chapter) === chapter);
        const verseData = chapterData?.verses.find((item) => Number(item.verse) === verse);
        verseTextEl.textContent = verseData?.text || "오늘의 말씀을 본문에서 확인해 보세요.";
      } catch (_) {
        verseTextEl.textContent = "오늘의 말씀을 본문에서 확인해 보세요.";
      }
    }

    chapterRefEl.textContent = `${chapterPick[0]} ${chapterPick[1]}장`;
    verseCard.addEventListener("click", () => goTo(bookName, chapter, verse));
    chapterCard.addEventListener("click", () => goTo(chapterPick[0], chapterPick[1]));
  }

  setup();
})();
