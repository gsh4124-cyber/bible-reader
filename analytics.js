(() => {
  const PROD_ORIGIN = 'https://gsh4124-cyber.github.io';
  const PROD_PATH = '/bible-reader/';
  const ENDPOINT = 'https://afiqaibosavbjzkffggr.supabase.co/rest/v1/rpc/increment_bible_page_view';
  const PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaXFhaWJvc2F2Ymp6a2ZmZ2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODE0MTQsImV4cCI6MjA4NzY1NzQxNH0.8EP2sJgETxA5tCAZBolIclDWkvkAMXPCfIo3aMPo7IU';

  if (location.origin !== PROD_ORIGIN || !location.pathname.startsWith(PROD_PATH)) return;

  fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      apikey: PUBLIC_KEY,
      authorization: `Bearer ${PUBLIC_KEY}`,
      'content-type': 'application/json',
    },
    body: '{}',
    cache: 'no-store',
    credentials: 'omit',
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt Bible reading.
  });
})();
