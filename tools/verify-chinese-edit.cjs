const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '../dist');
const base = 'https://kcska18051-crypto.github.io/novye-vysoka-zh/';
const out = path.resolve(__dirname, '../tmp/chinese-edit-qa');
fs.mkdirSync(out, {recursive:true});
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [320,390,1440]) {
      const context = await browser.newContext({viewport:{width,height:900},locale:'zh-CN',reducedMotion:'reduce'});
      const page = await context.newPage(), errors=[], posts=[];
      page.on('pageerror', e => errors.push(e.message));
      page.on('request', r => {if(!['GET','HEAD'].includes(r.method()))posts.push(r.url())});
      if(!process.env.CHECK_LIVE) await page.route(base+'**', async route => {
        const relative = new URL(route.request().url()).pathname.slice(new URL(base).pathname.length)||'index.html';
        const file = path.join(root,relative);
        if(/\.(js|css)$/.test(relative)||relative==='index.html') return route.fulfill({path:file});
        return route.continue();
      });
      const response = await page.goto(base,{waitUntil:'networkidle'});assert.equal(response.status(),200);
      console.log(`Loaded ${width}`);
      const scan = async () => {const size=await page.evaluate(()=>({w:innerWidth,s:document.documentElement.scrollWidth}));assert.ok(size.s<=size.w+1,JSON.stringify(size))};
      await scan();
      for(const city of ['moscow','yaroslavl','rybinsk','uglich']) {
        await page.locator(`[data-route-options="city"] [data-value="${city}"]`).click();
        for(const mode of ['car','bus','train']) {await page.locator(`[data-route-options="mode"] [data-value="${mode}"]`).click();await scan();}
      }
      for(const tab of await page.locator('.journey-tab').all())await tab.click();
      for(const id of ['degtyaritsy','nikolo','vysoka','chernaya']) {
        const region=page.locator(`[data-map-quarter="${id}"]`);await region.focus();await region.press('Enter');
        await page.locator('#qe-open-selected').click();await page.locator('#qe-plan').evaluate(i=>i.decode());
        await page.locator('#qe-plus').click();assert.equal(await page.locator('#qe-reset').innerText(),'150%');
        await scan();await page.locator('#qe-back').click();
      }
      for(const tab of await page.locator('[data-around-category]').all())await tab.click();
      await page.locator('.hero-actions [data-lead-intent="selection"]').click();
      for(const selector of ['#lead-dialog form','#tour form']) {
        const form=page.locator(selector),phone=form.locator('input[type="tel"]');
        await form.locator('[name="personal-data"]').check();await form.locator('[name="terms"]').check();
        for(const value of ['+86 138 0013 8000','+7 (999) 123-45-67','+44 20 7946 0958']) {
          await phone.fill(value);assert.equal(await phone.inputValue(),value);
          await form.locator('button[type="submit"]').click();
          await page.waitForFunction(s=>document.querySelector(s+' .form-status').textContent.includes('接入提交功能'),selector);
          assert.equal(await form.locator('.form-success').isVisible(),false);
        }
        await phone.fill('13800138000');await form.locator('button[type="submit"]').click();
        assert.equal(await phone.getAttribute('aria-invalid'),'true');
        assert.match(await phone.evaluate(e=>e.validationMessage),/国家区号/);
        await phone.fill('+86 138 0013 8000');assert.equal(await phone.evaluate(e=>e.validationMessage),'');
        await scan();
        if(selector.startsWith('#lead')) {await page.screenshot({path:path.join(out,width+'-form.png')});await page.locator('.lead-dialog-close').click();}
      }
      await page.locator('.cinema-card').first().click();assert.equal(await page.locator('#video-dialog').evaluate(d=>d.open),true);await page.locator('.video-dialog-close').click();
      await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,width+'-hero.png')});
      assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
      console.log(`PASS ${width}: HTTP, 12 routes, 9 scenes, 4 plans, both international forms, validation, video, layout, no JS errors or submissions`);
      await context.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
