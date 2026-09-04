(() => {
  const PROD_ORIGIN = 'https://bible-reader-1iz.pages.dev';
  const PROD_PATH = '/';
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
