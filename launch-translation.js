(() => {
  const params = new URLSearchParams(location.search);
  const requested = params.get('translation');
  const allowed = new Set(['krv1961','kjv','web','asv','lsg','luth1912','cuv','synodal','vulg']);
  if (!requested || !allowed.has(requested)) return;
  try { localStorage.setItem('bible-reader-translation', requested); } catch (_) {}
})();
