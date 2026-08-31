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
].map(([ko, file], index) => ({ ko, file, index }));

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

const cache = new Map();
let state = restoreLocation();
let currentBookData = null;

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

function setupBookSelect() {
  BOOKS.forEach((book, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = book.ko;
    bookSelect.append(option);
  });
  bookSelect.value = String(state.bookIndex);
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
setupBookSelect();
setupControls();
loadCurrent({ scrollTop: false });
