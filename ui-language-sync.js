(() => {
  const DEFAULT_TRANSLATION = {
    ko: 'krv1961',
    en: 'kjv',
    fr: 'lsg',
    de: 'luth1912',
    zh: 'cuv',
    ru: 'synodal',
    la: 'vulg',
    pt: 'almeida1819',
    ar: 'svd',
  };

  const languageSelect = document.querySelector('#languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', () => {
      const translation = DEFAULT_TRANSLATION[languageSelect.value];
      if (!translation) return;
      try { localStorage.setItem('bible-reader-translation', translation); } catch (_) {}
      window.__BIBLE_TRANSLATION__ = translation;
    }, true);
  }

  function enforceUiPageTitle() {
    const pageTitle = window.BibleI18n?.text?.()?.pageTitle;
    if (pageTitle && document.title !== pageTitle) document.title = pageTitle;
  }

  const title = document.querySelector('title');
  if (title) {
    new MutationObserver(enforceUiPageTitle).observe(title, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  ['translationSelect','bookSelect','chapterSelect','verseSelect','languageSelect'].forEach(id => {
    document.querySelector(`#${id}`)?.addEventListener('change', () => requestAnimationFrame(enforceUiPageTitle));
  });

  [0, 80, 250, 700, 1500].forEach(ms => setTimeout(enforceUiPageTitle, ms));
})();
