(() => {
  const PROD_ORIGIN = 'https://gsh4124-cyber.github.io';
  const PROD_PATH = '/bible-reader/';
  const ENDPOINT = 'https://afiqaibosavbjzkffggr.supabase.co/functions/v1/bible-page-view';

  if (location.origin !== PROD_ORIGIN || !location.pathname.startsWith(PROD_PATH)) return;

  fetch(ENDPOINT, {
    method: 'POST',
    cache: 'no-store',
    credentials: 'omit',
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt Bible reading.
  });
})();
