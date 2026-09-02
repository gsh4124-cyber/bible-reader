(() => {
  const LANGUAGE_TRANSLATIONS = [
    ['ko','한국어','krv1961'],['en','English','kjv'],['fr','Français','lsg'],['de','Deutsch','luth1912'],['zh','中文','cuv'],['ru','Русский','synodal'],['la','Latina','vulg'],['pt','Português','almeida1819'],['ar','العربية','svd']
  ];
  const params = new URLSearchParams(location.search);
  const requested = params.get('translation');
  const allowed = new Set(['krv1961','kjv','web','asv','lsg','luth1912','cuv','synodal','vulg','almeida1819','svd']);
  if (requested && allowed.has(requested)) {
    try { localStorage.setItem('bible-reader-translation', requested); } catch (_) {}
  }

  function currentTranslation() {
    if (requested && allowed.has(requested)) return requested;
    try { const saved = localStorage.getItem('bible-reader-translation'); if (allowed.has(saved)) return saved; } catch (_) {}
    return 'krv1961';
  }

  function addLanguageSelector() {
    const host = document.querySelector('.toolbar') || document.querySelector('.topbar-inner');
    if (!host || document.querySelector('#languageSelect')) return;
    const select = document.createElement('select');
    select.id = 'languageSelect';
    select.className = 'translation-select';
    select.setAttribute('aria-label','언어 / Language');
    const current = currentTranslation();
    LANGUAGE_TRANSLATIONS.forEach(([code,label,translation]) => {
      const option = document.createElement('option');
      option.value = translation;
      option.textContent = label;
      if (translation === current || (['web','asv'].includes(current) && translation === 'kjv')) option.selected = true;
      select.append(option);
    });
    select.addEventListener('change', () => {
      const translation = select.value;
      try { localStorage.setItem('bible-reader-translation', translation); } catch (_) {}
      const url = new URL(location.href);
      url.searchParams.set('translation', translation);
      location.href = url.toString();
    });
    host.prepend(select);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addLanguageSelector, {once:true});
  else addLanguageSelector();
})();