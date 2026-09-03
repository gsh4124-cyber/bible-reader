import { chromium } from 'playwright';

const base = 'https://gsh4124-cyber.github.io/bible-reader';
const browser = await chromium.launch({ headless: true });
const problems = [];
function assert(ok, message) { if (!ok) problems.push(message); }

async function open(path) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e)));
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('#translationSelect').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#bookSelect').waitFor({ state: 'visible', timeout: 15000 });
  return { page, pageErrors };
}

{
  const { page, pageErrors } = await open('/');
  const initialPlaceholder = await page.locator('#searchInput').getAttribute('placeholder');
  assert((await page.locator('html').getAttribute('lang')) === 'ko', 'root: html lang must remain ko');
  await page.locator('#translationSelect').selectOption('kjv');
  await page.waitForTimeout(800);
  assert((await page.locator('#translationSelect').inputValue()) === 'kjv', 'root: KJV selection failed');
  assert((await page.locator('html').getAttribute('lang')) === 'ko', 'root: translation switch changed UI language');
  assert((await page.locator('#searchInput').getAttribute('placeholder')) === initialPlaceholder, 'root: translation switch changed Korean UI placeholder');
  const title = (await page.locator('#chapterTitle').innerText()).trim();
  assert(/[A-Za-z]/.test(title), `root: KJV should control chapter heading language, got ${title}`);
  assert(pageErrors.length === 0, `root: page errors: ${pageErrors.join(' | ')}`);
  await page.close();
}

{
  const { page, pageErrors } = await open('/en/');
  const initialPlaceholder = await page.locator('#searchInput').getAttribute('placeholder');
  assert((await page.locator('html').getAttribute('lang')) === 'en', 'en: html lang must be en');
  await page.locator('#translationSelect').selectOption('cuv');
  await page.waitForTimeout(800);
  assert((await page.locator('#translationSelect').inputValue()) === 'cuv', 'en: CUV selection failed');
  assert((await page.locator('html').getAttribute('lang')) === 'en', 'en: translation switch changed UI language');
  assert((await page.locator('#searchInput').getAttribute('placeholder')) === initialPlaceholder, 'en: translation switch changed English UI placeholder');
  const title = (await page.locator('#chapterTitle').innerText()).trim();
  assert(/[\u3400-\u9fff]/.test(title), `en: CUV should control chapter heading language, got ${title}`);
  assert(pageErrors.length === 0, `en: page errors: ${pageErrors.join(' | ')}`);
  await page.close();
}

{
  const { page, pageErrors } = await open('/ar/');
  assert((await page.locator('html').getAttribute('lang')) === 'ar', 'ar: html lang must be ar');
  assert((await page.locator('html').getAttribute('dir')) === 'ltr', 'ar: UI shell direction must stay ltr');
  assert((await page.locator('#translationSelect').inputValue()) === 'svd', 'ar: default Arabic Bible version must be SVD');
  const title = (await page.locator('#chapterTitle').innerText()).trim();
  assert(/[\u0600-\u06ff]/.test(title), `ar: SVD should control chapter heading language, got ${title}`);
  assert(pageErrors.length === 0, `ar: page errors: ${pageErrors.join(' | ')}`);
  await page.close();
}

await browser.close();
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('Production browser QA passed: Korean/English UI stayed independent from selected Bible version; Arabic kept the stable LTR UI shell while SVD controlled Scripture heading language.');
