(() => {
  const select = document.querySelector("#testamentSelect");
  if (!select || typeof setTestament !== "function") return;

  select.value = activeTestament;
  select.addEventListener("change", async () => {
    await setTestament(select.value);
    select.value = activeTestament;
  });
})();
