const BOOKS = [
  ["창세기", "Genesis"], ["출애굽기", "Exodus"], ["레위기", "Leviticus"], ["민수기", "Numbers"], ["신명기", "Deuteronomy"],
  ["여호수아", "Joshua"], ["사사기", "Judges"], ["룻기", "Ruth"], ["사무엘상", "1Samuel"], ["사무엘하", "2Samuel"],
  ["열왕기상", "1Kings"], ["열왕기하", "2Kings"], ["역대상", "1Chronicles"], ["역대하", "2Chronicles"], ["에스라", "Ezra"],
  ["느헤미야", "Nehemiah"], ["에스더", "Esther"], ["욥기", "Job"], ["시편", "Psalms"], ["잠언", "Proverbs"],
  ["전도서", "Ecclesiastes"], ["아가", "SongofSolomon"], ["이사야", "Isaiah"], ["예레미야", "Jeremiah"], ["예레미야애가", "Lamentations"],
  ["에스겔", "Ezekiel"], ["다니엘", "Daniel"], ["호세아", "Hosea"], ["요엘", "Joel"], ["아모스", "Amos"],
  ["오바댜", "Obadiah"], ["요나", "Jonah"], ["미가", "Micah"], ["나훔", "Nahum"], ["하박국", "Habakkuk"],
  ["스바냐", "Zephaniah"], ["학개", "Haggai"], ["스가랴", "Zechariah"], ["말라기", "Malachi"],
  ["마태복음", "Matthew"], ["마가복음", "Mark"], ["누가복음", "Luke"], ["요한복음", "John"], ["사도행전", "Acts"],
  ["로마서", "Romans"], ["고린도전서", "1Corinthians"], ["고린도후서", "2Corinthians"], ["갈라디아서", "Galatians"], ["에베소서", "Ephesians"],
  ["빌립보서", "Philippians"], ["골로새서", "Colossians"], ["데살로니가전서", "1Thessalonians"], ["데살로니가후서", "2Thessalonians"],
  ["디모데전서", "1Timothy"], ["디모데후서", "2Timothy"], ["디도서", "Titus"], ["빌레몬서", "Philemon"], ["히브리서", "Hebrews"],
  ["야고보서", "James"], ["베드로전서", "1Peter"], ["베드로후서", "2Peter"], ["요한일서", "1John"], ["요한이서", "2John"],
  ["요한삼서", "3John"], ["유다서", "Jude"], ["요한계시록", "Revelation"]
].map(([ko, file], index) => ({
  ko,
  file,
  index,
  testament: index < 39 ? "old" : "new"
}));

const TRANSLATIONS = {
  krv1961: {
    id: "krv1961",
    name: "개역한글 1961",
    source: "https://raw.githubusercontent.com/bluesaurel/Korean-Bible-1961-KRV/main/data/",
    attribution: "대한성서공회"
  }
};

const $ = (selector) => document.querySelector(selector);
const bookSelect = $("#bookSelect");
const chapterSelect = $("#chapterSelect");
const chapterTitle = $("#chapterTitle");
const versesEl = $("#verses");
const statusEl = $("#status");
const prevButtons = [$("#prevChapter"), $("#prevChapterBottom")];
const nextButtons = [$("#nextChapter"), $("#nextChapterBottom")];
const testamentButtons = [...document.querySelectorAll(".testament-button")];
const searchForm = $("#searchForm");
const searchInput = $("#searchInput");
const searchButton = $("#searchButton");
const searchPanel = $("#searchPanel");
const searchSummary = $("#searchSummary");
const searchResults = $("#searchResults");

const cache = new Map();
const SEARCH_LIMIT = 100;
const SEARCH_BATCH_SIZE = 6;
let state = restoreLocation();
let currentBookData = null;
let activeTestament = "all";
let searchRun = 0;

function restoreLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem("bible-reader-location"));
    if (saved && Number.isInteger(saved.bookIndex) && Number.isInteger(saved.chapter)) {
      return {
        bookIndex: Math.max(0, Math.min(BOOKS.length - 1, saved.bookIndex)),
        chapter: Math.max(1, saved.chapter)
      };
    }
  } catch (_) {}
  return { bookIndex: BOOKS.findIndex((b) => b.file === "John"), chapter: 3 };
}

function saveLocation() {
  localStorage.setItem("bible-reader-location", JSON.stringify(state));
}

function booksForTestament(testament = activeTestament) {
  return testament === "all" ? BOOKS : BOOKS.filter((book) => book.testament === testament);
}

function updateTestamentButtons() {
  testamentButtons.forEach((button) => {
    const active = button.dataset.testament === activeTestament;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function setupBookSelect() {
  bookSelect.innerHTML = "";
  booksForTestament().forEach((book) => {
    const option = document.createElement("option");
    option.value = book.index;
    option.textContent = book.ko;
    bookSelect.append(option);
  });
  bookSelect.value = String(state.bookIndex);
}

function ensureBookVisible() {
  const book = BOOKS[state.bookIndex];
  if (activeTestament !== "all" && book.testament !== activeTestament) {
    activeTestament = "all";
    updateTestamentButtons();
    setupBookSelect();
  }
}

async function setTestament(testament) {
  if (!['all', 'old', 'new'].includes(testament) || testament === activeTestament) return;
  activeTestament = testament;
  updateTestamentButtons();

  const visibleBooks = booksForTestament();
  if (!visibleBooks.some((book) => book.index === state.bookIndex)) {
    state.bookIndex = visibleBooks[0].index;
    state.chapter = 1;
    setupBookSelect();
    await loadCurrent();
    return;
  }
  setupBookSelect();
}

async function fetchBook(book) {
  if (cache.has(book.file)) return cache.get(book.file);
  const translation = TRANSLATIONS.krv1961;
  const url = `${translation.source}${book.file}.json`;
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error(`${book.ko} 본문을 불러오지 못했습니다.`);
  const data = await response.json();
  cache.set(book.file, data);
  return data;
}

function setupChapterSelect(bookData) {
  chapterSelect.innerHTML = "";
  const count = bookData.chapters.length;
  for (let chapter = 1; chapter <= count; chapter += 1) {
    const option = document.createElement("option");
    option.value = chapter;
    option.textContent = `${chapter}장`;
    chapterSelect.append(option);
  }
  state.chapter = Math.max(1, Math.min(count, state.chapter));
  chapterSelect.value = String(state.chapter);
}

function setLoading(message = "본문을 불러오는 중…") {
  statusEl.hidden = false;
  statusEl.classList.remove("error");
  statusEl.textContent = message;
  versesEl.innerHTML = "";
}

function setError(message) {
  statusEl.hidden = false;
  statusEl.classList.add("error");
  statusEl.textContent = message;
}

function updateNavigationState(bookData = currentBookData) {
  if (!bookData) return;
  const chapterCount = bookData.chapters.length;
  const atStart = state.bookIndex === 0 && state.chapter === 1;
  const atEnd = state.bookIndex === BOOKS.length - 1 && state.chapter === chapterCount;

  prevButtons.forEach((button) => {
    button.disabled = atStart;
    button.setAttribute("aria-disabled", String(atStart));
  });
  nextButtons.forEach((button) => {
    button.disabled = atEnd;
    button.setAttribute("aria-disabled", String(atEnd));
  });
}

function renderVerses(bookData) {
  const book = BOOKS[state.bookIndex];
  const chapter = bookData.chapters.find((item) => Number(item.chapter) === state.chapter);
  chapterTitle.textContent = `${book.ko} ${state.chapter}장`;
  document.title = `${book.ko} ${state.chapter}장 · 성경 읽기`;

  if (!chapter) {
    setError("해당 장을 찾지 못했습니다.");
    return;
  }

  const fragment = document.createDocumentFragment();
  chapter.verses.forEach((verse) => {
    const p = document.createElement("p");
    p.className = "verse";
    p.dataset.verse = verse.verse;

    const number = document.createElement("span");
    number.className = "verse-number";
    number.textContent = verse.verse;

    const text = document.createElement("span");
    text.className = "verse-text";
    text.textContent = verse.text;
    text.title = "클릭하면 이 절을 복사합니다";
    text.addEventListener("click", () => copyVerse(p, verse));

    p.append(number, text);
    fragment.append(p);
  });

  statusEl.hidden = true;
  versesEl.replaceChildren(fragment);
  updateNavigationState(bookData);
}

async function copyVerse(element, verse) {
  const book = BOOKS[state.bookIndex];
  const copyText = `${book.ko} ${state.chapter}:${verse.verse} ${verse.text}`;
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
  element.classList.add("copied");
  setTimeout(() => element.classList.remove("copied"), 900);
}

async function loadCurrent({ scrollTop = true } = {}) {
  ensureBookVisible();
  const book = BOOKS[state.bookIndex];
  bookSelect.value = String(state.bookIndex);
  setLoading();
  try {
    currentBookData = await fetchBook(book);
    setupChapterSelect(currentBookData);
    renderVerses(currentBookData);
    saveLocation();
    if (scrollTop) window.scrollTo({ top: 0, behavior: "auto" });
  } catch (error) {
    console.error(error);
    setError("본문을 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.");
  }
}

async function moveChapter(delta) {
  if (!currentBookData) return;
  const chapterCount = currentBookData.chapters.length;
  const next = state.chapter + delta;

  if (next >= 1 && next <= chapterCount) {
    state.chapter = next;
    chapterSelect.value = String(next);
    renderVerses(currentBookData);
    saveLocation();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const nextBookIndex = state.bookIndex + (delta > 0 ? 1 : -1);
  if (nextBookIndex < 0 || nextBookIndex >= BOOKS.length) return;

  state.bookIndex = nextBookIndex;
  state.chapter = delta > 0 ? 1 : 999;
  await loadCurrent();
}

function renderSearchResults(results, query, failedBooks) {
  searchResults.innerHTML = "";
  searchPanel.hidden = false;

  if (!results.length) {
    searchSummary.textContent = `“${query}” 검색 결과가 없습니다.${failedBooks ? ` (${failedBooks}권 로딩 실패)` : ""}`;
    return;
  }

  const limited = results.length >= SEARCH_LIMIT;
  searchSummary.textContent = `“${query}” ${results.length}${limited ? "+" : ""}개 결과${failedBooks ? ` · ${failedBooks}권 로딩 실패` : ""}`;

  const fragment = document.createDocumentFragment();
  results.slice(0, SEARCH_LIMIT).forEach((result) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result";

    const ref = document.createElement("strong");
    ref.textContent = `${result.book.ko} ${result.chapter}:${result.verse}`;

    const text = document.createElement("span");
    text.textContent = result.text;

    button.append(ref, text);
    button.addEventListener("click", () => goToSearchResult(result));
    fragment.append(button);
  });
  searchResults.append(fragment);
}

async function searchBible(query) {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  if (!normalized) return;

  const run = ++searchRun;
  searchPanel.hidden = false;
  searchResults.innerHTML = "";
  searchSummary.textContent = `“${query.trim()}” 검색 준비 중…`;
  searchButton.disabled = true;
  searchInput.disabled = true;

  const results = [];
  let failedBooks = 0;

  try {
    for (let start = 0; start < BOOKS.length && results.length < SEARCH_LIMIT; start += SEARCH_BATCH_SIZE) {
      if (run !== searchRun) return;
      const batch = BOOKS.slice(start, start + SEARCH_BATCH_SIZE);
      searchSummary.textContent = `“${query.trim()}” 검색 중… ${Math.min(start + batch.length, BOOKS.length)}/${BOOKS.length}권`;

      const loaded = await Promise.all(batch.map(async (book) => {
        try {
          return { book, data: await fetchBook(book) };
        } catch (error) {
          console.error(error);
          failedBooks += 1;
          return null;
        }
      }));

      loaded.filter(Boolean).forEach(({ book, data }) => {
        if (results.length >= SEARCH_LIMIT) return;
        data.chapters.forEach((chapter) => {
          if (results.length >= SEARCH_LIMIT) return;
          chapter.verses.forEach((verse) => {
            if (results.length >= SEARCH_LIMIT) return;
            if (String(verse.text).toLocaleLowerCase("ko-KR").includes(normalized)) {
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

    if (run === searchRun) renderSearchResults(results, query.trim(), failedBooks);
  } finally {
    if (run === searchRun) {
      searchButton.disabled = false;
      searchInput.disabled = false;
      searchInput.focus();
    }
  }
}

async function goToSearchResult(result) {
  state.bookIndex = result.book.index;
  state.chapter = result.chapter;
  await loadCurrent();
  searchPanel.hidden = true;

  requestAnimationFrame(() => {
    const target = versesEl.querySelector(`[data-verse="${result.verse}"]`);
    if (!target) return;
    target.classList.add("searched");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => target.classList.remove("searched"), 1800);
  });
}

function setupControls() {
  bookSelect.addEventListener("change", async () => {
    state.bookIndex = Number(bookSelect.value);
    state.chapter = 1;
    await loadCurrent();
  });

  chapterSelect.addEventListener("change", () => {
    state.chapter = Number(chapterSelect.value);
    renderVerses(currentBookData);
    saveLocation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  testamentButtons.forEach((button) => {
    button.addEventListener("click", () => setTestament(button.dataset.testament));
  });

  prevButtons.forEach((button) =>
    button.addEventListener("click", () => moveChapter(-1))
  );
  nextButtons.forEach((button) =>
    button.addEventListener("click", () => moveChapter(1))
  );

  $("#fontDown").addEventListener("click", () => changeFont(-1));
  $("#fontUp").addEventListener("click", () => changeFont(1));
  $("#widthToggle").addEventListener("click", toggleWidth);
  $("#themeToggle").addEventListener("click", toggleTheme);

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBible(searchInput.value);
  });
  $("#closeSearch").addEventListener("click", () => {
    searchRun += 1;
    searchPanel.hidden = true;
    searchButton.disabled = false;
    searchInput.disabled = false;
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveChapter(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveChapter(1);
    }
    if (event.key === "/") {
      event.preventDefault();
      searchInput.focus();
    }
  });
}

function restoreReadingPreferences() {
  const fontSize = Number(localStorage.getItem("bible-reader-font-size")) || 21;
  document.documentElement.style.setProperty("--font-size", `${fontSize}px`);

  const width = localStorage.getItem("bible-reader-width") || "860";
  document.documentElement.style.setProperty("--reader-width", `${width}px`);

  const savedTheme = localStorage.getItem("bible-reader-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = theme;
}

function changeFont(delta) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--font-size");
  const current = parseFloat(raw) || 21;
  const next = Math.max(16, Math.min(32, current + delta));
  document.documentElement.style.setProperty("--font-size", `${next}px`);
  localStorage.setItem("bible-reader-font-size", String(next));
}

function toggleWidth() {
  const current = localStorage.getItem("bible-reader-width") || "860";
  const next = current === "860" ? "1080" : current === "1080" ? "720" : "860";
  document.documentElement.style.setProperty("--reader-width", `${next}px`);
  localStorage.setItem("bible-reader-width", next);
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("bible-reader-theme", next);
}

restoreReadingPreferences();
updateTestamentButtons();
setupBookSelect();
setupControls();
loadCurrent({ scrollTop: false });
