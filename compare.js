(() => {
  const BOOK_FILES = [
    "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1Samuel","2Samuel","1Kings","2Kings",
    "1Chronicles","2Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","SongofSolomon","Isaiah",
    "Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah",
    "Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1Corinthians","2Corinthians","Galatians",
    "Ephesians","Philippians","Colossians","1Thessalonians","2Thessalonians","1Timothy","2Timothy","Titus","Philemon","Hebrews",
    "James","1Peter","2Peter","1John","2John","3John","Jude","Revelation"
  ];
  const KJV_SOURCE = "https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/";
  const cache = new Map();
  const toggle = document.querySelector("#compareToggle");
  const panel = document.querySelector("#comparePanel");
  const rows = document.querySelector("#compareRows");
  const compareStatus = document.querySelector("#compareStatus");
  const singleReader = document.querySelector("#singleReader");
  const bookSelect = document.querySelector("#bookSelect");
  const chapterSelect = document.querySelector("#chapterSelect");
  const verses = document.querySelector("#verses");
  const chapterTitle = document.querySelector("#chapterTitle");
  if (!toggle || !panel || !rows || !singleReader) return;

  let enabled = localStorage.getItem("bible-reader-compare") === "true";
  let renderToken = 0;

  async function fetchKjv(bookIndex) {
    const file = BOOK_FILES[bookIndex];
    if (cache.has(file)) return cache.get(file);
    const response = await fetch(`${KJV_SOURCE}${file}.json`, { cache: "force-cache" });
    if (!response.ok) throw new Error("KJV 본문을 불러오지 못했습니다.");
    const data = await response.json();
    cache.set(file, data);
    return data;
  }

  function getKrvVerses() {
    return [...verses.querySelectorAll(".verse")].map((element) => ({
      verse: Number(element.dataset.verse),
      text: element.querySelector(".verse-text")?.textContent || ""
    }));
  }

  async function renderCompare() {
    if (!enabled) return;
    const token = ++renderToken;
    const bookIndex = Number(bookSelect.value);
    const chapter = Number(chapterSelect.value);
    if (!Number.isInteger(bookIndex) || !chapter) return;

    compareStatus.textContent = "비교 역본을 불러오는 중…";
    compareStatus.hidden = false;
    rows.replaceChildren();

    try {
      const kjvBook = await fetchKjv(bookIndex);
      if (token !== renderToken || !enabled) return;
      const kjvChapter = kjvBook.chapters.find((item) => Number(item.chapter) === chapter);
      const krvVerses = getKrvVerses();
      if (!kjvChapter || !krvVerses.length) throw new Error("비교할 장을 찾지 못했습니다.");

      const kjvMap = new Map(kjvChapter.verses.map((verse) => [Number(verse.verse), verse.text]));
      const allVerseNumbers = [...new Set([...krvVerses.map((v) => v.verse), ...kjvMap.keys()])].sort((a, b) => a - b);
      const krvMap = new Map(krvVerses.map((verse) => [verse.verse, verse.text]));
      const fragment = document.createDocumentFragment();

      allVerseNumbers.forEach((verseNumber) => {
        const row = document.createElement("div");
        row.className = "compare-row";
        row.dataset.verse = verseNumber;

        const left = document.createElement("div");
        const right = document.createElement("div");
        left.className = "compare-cell";
        right.className = "compare-cell compare-english";

        const leftNumber = document.createElement("span");
        const rightNumber = document.createElement("span");
        leftNumber.className = rightNumber.className = "compare-verse-number";
        leftNumber.textContent = rightNumber.textContent = verseNumber;

        const leftText = document.createElement("span");
        const rightText = document.createElement("span");
        leftText.textContent = krvMap.get(verseNumber) || "—";
        rightText.textContent = kjvMap.get(verseNumber) || "—";

        left.append(leftNumber, leftText);
        right.append(rightNumber, rightText);
        row.append(left, right);
        fragment.append(row);
      });

      rows.replaceChildren(fragment);
      compareStatus.hidden = true;
    } catch (error) {
      console.error(error);
      compareStatus.textContent = "비교 역본을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
    }
  }

  function applyMode() {
    toggle.classList.toggle("active", enabled);
    toggle.setAttribute("aria-pressed", String(enabled));
    panel.hidden = !enabled;
    singleReader.hidden = enabled;
    localStorage.setItem("bible-reader-compare", String(enabled));
    if (enabled) renderCompare();
  }

  toggle.addEventListener("click", () => {
    enabled = !enabled;
    applyMode();
  });

  const observer = new MutationObserver(() => {
    if (enabled) requestAnimationFrame(renderCompare);
  });
  observer.observe(chapterTitle, { childList: true, subtree: true, characterData: true });

  applyMode();
})();
