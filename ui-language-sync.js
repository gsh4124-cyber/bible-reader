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

  const titleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
  const titleElement = document.querySelector('title');

  function uiPageTitle() {
    return window.BibleI18n?.text?.()?.pageTitle || titleElement?.textContent || '';
  }

  function writeUiTitle() {
    const desired = uiPageTitle();
    if (!desired || !titleDescriptor?.set) return;
    if (titleDescriptor.get.call(document) !== desired) {
      titleDescriptor.set.call(document, desired);
    }
  }

  /*
   * Some older runtime paths still try to write a Scripture-language title.
   * Intercept document.title so the browser title has one effective owner:
   * the current UI language. This prevents title tug-of-war/flicker.
   */
  if (titleDescriptor?.get && titleDescriptor?.set) {
    Object.defineProperty(document, 'title', {
      configurable: true,
      get() {
        return titleDescriptor.get.call(document);
      },
      set() {
        const desired = uiPageTitle();
        if (desired && titleDescriptor.get.call(document) !== desired) {
          titleDescriptor.set.call(document, desired);
        }
      },
    });
  }

  ['translationSelect','bookSelect','chapterSelect','verseSelect','languageSelect'].forEach(id => {
    document.querySelector(`#${id}`)?.addEventListener('change', () => requestAnimationFrame(writeUiTitle));
  });

  [0, 80, 250, 700, 1500].forEach(ms => setTimeout(writeUiTitle, ms));
})();
