(() => {
  const select = document.querySelector("#testamentSelect");
  const buttons = [...document.querySelectorAll(".testament-button")];
  if (!select || !buttons.length) return;

  function syncFromButtons() {
    const active = buttons.find((button) => button.classList.contains("active"));
    if (active) select.value = active.dataset.testament || "all";
  }

  select.addEventListener("change", () => {
    const target = buttons.find((button) => button.dataset.testament === select.value);
    target?.click();
  });

  const observer = new MutationObserver(syncFromButtons);
  buttons.forEach((button) => observer.observe(button, { attributes: true, attributeFilter: ["class", "aria-pressed"] }));
  syncFromButtons();
})();
