(() => {
  const BOOK_NAMES = [
    "창세기","출애굽기","레위기","민수기","신명기","여호수아","사사기","룻기","사무엘상","사무엘하",
    "열왕기상","열왕기하","역대상","역대하","에스라","느헤미야","에스더","욥기","시편","잠언","전도서","아가",
    "이사야","예레미야","예레미야애가","에스겔","다니엘","호세아","요엘","아모스","오바댜","요나","미가","나훔",
    "하박국","스바냐","학개","스가랴","말라기","마태복음","마가복음","누가복음","요한복음","사도행전","로마서",
    "고린도전서","고린도후서","갈라디아서","에베소서","빌립보서","골로새서","데살로니가전서","데살로니가후서",
    "디모데전서","디모데후서","디도서","빌레몬서","히브리서","야고보서","베드로전서","베드로후서","요한일서",
    "요한이서","요한삼서","유다서","요한계시록"
  ];

  const input = document.querySelector("#searchInput");
  const list = document.querySelector("#bookList");
  const select = document.querySelector("#bookSelect");
  const form = document.querySelector("#searchForm");
  if (!input || !list || !select || !form) return;

  BOOK_NAMES.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    list.append(option);
  });

  function findBookIndex(query) {
    const exactIndex = BOOK_NAMES.findIndex((name) => name === query);
    if (exactIndex >= 0) return exactIndex;
    const matches = BOOK_NAMES.filter((name) => name.includes(query));
    return matches.length === 1 ? BOOK_NAMES.indexOf(matches[0]) : -1;
  }

  async function chooseBook(query) {
    const index = findBookIndex(query.trim());
    if (index < 0) return false;

    if (typeof setTestament === "function" && activeTestament !== "all") {
      await setTestament("all");
      const testamentSelect = document.querySelector("#testamentSelect");
      if (testamentSelect) testamentSelect.value = "all";
    }

    select.value = String(index);
    select.dispatchEvent(new Event("change", { bubbles: true }));
    input.value = "";
    input.blur();
    return true;
  }

  document.addEventListener("submit", async (event) => {
    if (event.target !== form) return;
    const query = input.value.trim();
    if (!query || findBookIndex(query) < 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    await chooseBook(query);
  }, true);
})();
