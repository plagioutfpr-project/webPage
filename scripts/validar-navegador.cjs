// Playwright é ferramenta de teste opcional, não dependência do site.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const base = (process.env.SITE_URL || 'http://127.0.0.1:8765').replace(/\/$/, '');
const source = process.env.SOURCE_URL?.replace(/\/$/, ''); // opcional: referência original, somente leitura
const pages = ['index','landing','sobre','equipe','cartilha','parceiros','materiais','perguntas-frequentes'];
(async () => {
 const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH}: {})});
 const report = {browser:browser.version(),base,reference:source || null,cases:[],externalFailures:[],errors:[]};
 const url = name => `${base}/${name === 'index' ? '' : name+'.html'}`;
 const watch = page => {
  page.on('pageerror',e => report.errors.push(e.message));
  page.on('response',r => { if(r.url().startsWith(base+'/') && r.status()>=400) report.errors.push(`${r.status()} ${r.url()}`); });
  page.on('requestfailed',r => { if(r.url().startsWith(base+'/')) report.errors.push(r.url()); else report.externalFailures.push({url:r.url(),error:r.failure()?.errorText}); });
  page.on('request',r => {
   if(r.url().includes('/api/')) report.errors.push('API inesperada: '+r.url());
   if(new URL(r.url()).origin === new URL(base).origin && !r.url().startsWith(base+'/')) report.errors.push('Recurso fora do caminho-base: '+r.url());
  });
 };
 try {
  for (const width of [1440,390]) {
   const ctx = await browser.newContext({viewport:{width,height:900},colorScheme:'light',reducedMotion:'reduce'});
   const page = await ctx.newPage();
   ctx.on('page',watch);
   watch(page);
   for (const name of pages) {
    await page.goto(url(name),{waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    // Carregar imagens lazy antes de verificar e capturar a página inteira.
    await page.evaluate(async () => {
     for(const image of document.images) {image.loading='eager'; await image.decode().catch(()=>{});}
    });
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('a[aria-disabled="true"][href]').count(),0);
    assert.equal(await page.locator('a[href*="login"],a[href*="cadastro"]').count(),0);
    assert.equal(await page.locator('a[aria-disabled="true"]').count(),0);
    assert.equal(await page.getByRole('link', {name:/^(?:acessar (?:a )?plataforma|entrar|criar conta|login|cadastro|plataforma)$/i}).count(),0);
    assert.equal(await page.locator('.landing-hero__account, .landing-roots__actions').count(),0);
    assert.equal(await page.evaluate(() => [...document.images].every(i=>i.complete && i.naturalWidth>0)),true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth),true);
    if(width===390) {
     await page.locator('#landing-nav-toggle').click();
     assert.equal(await page.locator('#landing-nav-toggle').getAttribute('aria-expanded'),'true');
     await page.keyboard.press('Escape');
     assert.equal(await page.locator('#landing-nav-toggle').getAttribute('aria-expanded'),'false');
    }
    for(const theme of ['light','dark']) {
     await page.evaluate(t=>localStorage.setItem('autoria-theme',t),theme);
     await page.reload({waitUntil:'networkidle'});
     await page.evaluate(async () => {await document.fonts.ready; for(const i of document.images) {i.loading='eager';await i.decode().catch(()=>{});}});
     assert.equal(await page.locator('body').evaluate((el,t)=>el.classList.contains(t+'-mode'),theme),true);
     if(name==='index' && !process.env.REPORT_FILE) await page.screenshot({path:path.join(root,`docs/landing-${width}-${theme}.png`),fullPage:true,animations:'disabled'});
     let identical = null;
     // Comparação visual de todas as páginas, nos dois temas e tamanhos.
     if(source) {
      const ref = await ctx.newPage();
      await ref.goto(`${source}/${name === 'index' ? 'landing' : name}.html`,{waitUntil:'networkidle'});
      await ref.evaluate(async t=>{localStorage.setItem('autoria-theme',t); const m=await import('/js/theme.js'); m.applyTheme(t);await document.fonts.ready;for(const i of document.images){i.loading='eager';await i.decode().catch(()=>{});}},theme);
      const actual = await page.screenshot({fullPage:true,animations:'disabled'});
      const expected = await ref.screenshot({fullPage:true,animations:'disabled'});
      identical = actual.equals(expected);
      if(!identical && process.env.DEBUG_SCREENSHOTS) {fs.writeFileSync(path.join(process.env.DEBUG_SCREENSHOTS,'actual.png'),actual);fs.writeFileSync(path.join(process.env.DEBUG_SCREENSHOTS,'expected.png'),expected);}
      assert.equal(identical,true,`Diferença visual ${name} ${width} ${theme}`);
      await ref.close();
     }
     report.cases.push({page:name,width,theme,visualIdentical:identical});
    }
    // Alternância pelo controle existente e persistência após recarregar.
    if(width===390) await page.locator('#landing-nav-toggle').click();
    await page.locator('#theme-toggle').click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('autoria-theme')),'light');
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('light-mode')),true);
    if(name==='perguntas-frequentes') {
     const entries=page.locator('.faq-list details');
     for(let i=0;i<await entries.count();i++) {
      const entry=entries.nth(i);
      await entry.locator('summary').click();
      assert.equal(await entry.getAttribute('open'),'');
      await entry.locator('p').waitFor({state:'visible'});
      await entry.locator('summary').click();
      assert.equal(await entry.getAttribute('open'),null);
     }
     report.faq=true;
    }
    if(name==='materiais' && width===1440) {
     const downloads=page.locator('a[download]');
     report.downloads=0;
     for(let i=0;i<await downloads.count();i++) {
      const link=downloads.nth(i);
      const [download]=await Promise.all([page.waitForEvent('download'),link.click()]);
      assert.equal(await download.failure(),null);
      assert.ok(fs.readFileSync(await download.path()).equals(fs.readFileSync(path.join(root,await link.getAttribute('href')))));
      report.downloads++;
     }
     const previews=page.locator('.material-item__image-link');
     report.posterPreviews=0;
     for(let i=0;i<await previews.count();i++) {
      const link=previews.nth(i);
      const [popup]=await Promise.all([page.waitForEvent('popup'),link.click()]);
      await popup.waitForLoadState('load');
      assert.equal(popup.url(),`${base}/${await link.getAttribute('href')}`);
      assert.equal(await popup.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0),true);
      await popup.close();
      report.posterPreviews++;
     }
    }
   }
   await page.goto(url('index'),{waitUntil:'networkidle'});
   if(width===390) await page.locator('#landing-nav-toggle').click();
   await page.locator('#landing-navigation a[href="sobre.html"]').click();
   assert.equal(page.url(),`${base}/sobre.html`);
   await page.locator('.landing-nav__brand').click();
   assert.equal(page.url(),`${base}/index.html`);
   await ctx.close();
  }
  // Animação normal da árvore responde à rolagem.
  const ctx = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const page = await ctx.newPage();
  watch(page);
  await page.goto(url('index'),{waitUntil:'networkidle'});
  assert.ok(await page.locator('#landing-trunk-shape').getAttribute('points'));
  const before=Number(await page.locator('#landing-reveal-rect').getAttribute('height'));
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
  await page.waitForTimeout(300);
  assert.ok(Number(await page.locator('#landing-reveal-rect').getAttribute('height'))>before);
  report.scrollAnimation=true;
  await ctx.close();
  // Sem recursos externos: conteúdo local e scripts continuam operacionais.
  const offline = await browser.newContext({reducedMotion:'reduce'});
  await offline.route('**/*',route=>route.request().url().startsWith(base+'/') ? route.continue() : route.abort());
  const op = await offline.newPage();
  for(const name of pages) {
   await op.goto(url(name),{waitUntil:'networkidle'});
   assert.ok(await op.locator('h1').innerText());
   await op.evaluate(async()=>{for(const i of document.images){i.loading='eager';await i.decode().catch(()=>{});}});
   assert.equal(await op.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0)),true);
  }
  report.withoutExternalResources=true;
  await offline.close();
  assert.deepEqual(report.errors,[]);
 } catch(e) { report.errors.push(e.stack); process.exitCode=1; }
 finally {
  await browser.close();
  fs.writeFileSync(path.resolve(root,process.env.REPORT_FILE || 'docs/testes-navegador.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({cases:report.cases.length,errors:report.errors,externalFailures:report.externalFailures,scrollAnimation:report.scrollAnimation,withoutExternalResources:report.withoutExternalResources,faq:report.faq,downloads:report.downloads,posterPreviews:report.posterPreviews},null,2));
 }
})();
