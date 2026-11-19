const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'dist', 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'dist', 'styles.css'), 'utf8');

test('header identifies Novye Vysoka as a Magazin Zemli project', () => {
  assert.match(html, /class="brand-project"[^>]*>\s*“新维索卡”项目\s*</i);
});

test('hero offers land selection and an accessible location preview', () => {
  assert.match(html, /data-lead-intent="selection"[^>]*>选择地块</i);
  assert.match(html, /href="assets\/situation-plan-zh\.svg" aria-haspopup="dialog" aria-controls="situation-plan-dialog">查看位置</i);
});

test('reusable lead dialog supports selection and tour intents', () => {
  assert.match(html, /<dialog[^>]+id="lead-dialog"/i);
  assert.match(html, /<form[^>]+data-lead-form/i);
  assert.match(html, /value="selection"/i);
  assert.match(html, /value="tour"/i);
  assert.match(script, /closest\('\[data-lead-intent\]'\)/);
  assert.match(script, /leadDialog\.showModal\(\)/);
});

test('lead dialog is available at several points in the landing page', () => {
  const triggers = html.match(/data-lead-intent=/g) || [];
  assert.ok(triggers.length >= 5, `expected at least 5 static popup triggers, got ${triggers.length}`);
});

test('redundant section overlines are removed', () => {
  assert.doesNotMatch(html, /class="section-label"/i);
});

test('desktop header keeps six key links and a persistent selection action', () => {
  const nav = html.match(/<nav aria-label="页面各部分">([\s\S]*?)<\/nav>/i)?.[1] || '';
  assert.equal((nav.match(/<a /g) || []).length, 6);
  for (const label of ['关于项目', '城外生活', '如何到达', '地块', '购买条件', '关于团队']) assert.match(nav, new RegExp(label));
  assert.match(html, /class="header-cta"[^>]+data-lead-intent="selection"/);
});

test('faq starts closed and both accordions expose controlled state', () => {
  assert.doesNotMatch(html, /<details open>/);
  assert.match(html, /class="faq-list reveal"[^>]*data-accordion/);
  assert.match(html, /class="company-reason[^\"]*"[^>]+aria-expanded="false"/);
  assert.doesNotMatch(script, /mouseenter[^\n]+activateReason/);
  assert.match(css, /company-reason-toggle/);
});

test('lead choices are visible selectable cards and footer includes legal navigation', () => {
  assert.match(html, /前来查看/);
  assert.match(html, /获取地块视频/);
  assert.match(html, /class="footer-legal"/);
  assert.match(html, /landmarket\.biz\/privacy/);
});

test('final form names the result of the selected action', () => {
  assert.match(html, /data-tour-submit[^>]*>预约参观/);
  assert.match(script, /syncTourSubmit/);
  assert.match(script, /获取地块视频/);
});

test('company reasons address five distinct buyer concerns', () => {
  for (const reason of ['法律透明', '直接购买', '了解区域', '交易协助', '业主提供分期付款']) {
    assert.match(html, new RegExp(reason));
  }
});

test('faq covers ownership, access, viewing, and purchase terms in concise answers', () => {
  for (const question of ['谁出售地块？', '地块的进出道路如何安排？', '可以前来查看地块吗？', '如何提供分期付款？']) {
    assert.match(html, new RegExp(question.replace(/[?]/g, '\\?')));
  }
  const faq = html.match(/<div class="faq-list reveal"[\s\S]*?<\/div>\s*<\/section>/)?.[0] || '';
  const answers = [...faq.matchAll(/<details><summary>[^<]+<\/summary><p>([^<]+)<\/p><\/details>/g)].map((match) => match[1]);
  assert.ok(answers.length >= 8);
  assert.ok(answers.every((answer) => answer.length <= 260), `long FAQ answer: ${Math.max(...answers.map((answer) => answer.length))}`);
});

test('journey supports explicit controls, directional transitions, and adjacent image preload', () => {
  assert.match(html, /data-journey-prev/);
  assert.match(html, /data-journey-next/);
  assert.match(script, /dataset\.direction/);
  assert.match(script, /preloadJourneyNeighbors/);
  assert.match(css, /journey-control/);
});

test('project image stays clean without technical notes or connector artifacts', () => {
  assert.equal((html.match(/class="project-hotspot/g) || []).length, 0);
  assert.doesNotMatch(html, /class="visual-note"/);
  assert.doesNotMatch(html, /方向示意图/);
  assert.doesNotMatch(html, /参考素材中的临时音频/);
  assert.doesNotMatch(css, /\.purchase-steps::before/);
});

test('play and close controls are geometrically centered', () => {
  const mapCss = fs.readFileSync(path.join(__dirname, '..', 'dist', 'interactive-map.css'), 'utf8');
  assert.match(css, /\.project-film > \.video-play[^\{]*\{[^\}]*top:\s*50%[^\}]*left:\s*50%[^\}]*translate\(-50%,-50%\)/s);
  assert.match(css, /\.lead-dialog-close::before[\s\S]*transform:\s*rotate\(45deg\)/);
  assert.match(css, /\.video-dialog-close::after[\s\S]*transform:\s*rotate\(-45deg\)/);
  assert.match(mapCss, /\.map-card-close::before[\s\S]*transform:\s*rotate\(45deg\)/);
  assert.match(mapCss, /\.quarter-plan-dialog-close::after[\s\S]*transform:\s*rotate\(-45deg\)/);
});

test('sticky header exposes compact and active-section states', () => {
  assert.match(script, /syncHeaderState/);
  assert.match(script, /aria-current/);
  assert.match(css, /\.site-header\.is-scrolled/);
  assert.match(css, /\.site-header nav a\[aria-current="location"\]/);
});

test('forms provide phone input metadata, inline errors, and submission states', () => {
  const phones = html.match(/<input type="tel"[^>]+>/g) || [];
  assert.ok(phones.length >= 2);
  for (const phone of phones) {
    assert.match(phone, /inputmode="tel"/);
    assert.match(phone, /autocomplete="tel"/);
    assert.match(phone, /required/);
  }
  assert.match(script, /formatPhone/);
  assert.match(script, /aria-invalid/);
  assert.match(script, /is-loading/);
  assert.match(css, /\.lead-form\.is-success/);
  assert.match(css, /\.lead-form\.is-error/);
});

test('hero content uses a staged reveal and motion has a reduced-motion fallback', () => {
  assert.match(css, /\.hero-content\.is-visible > \*/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('secondary video reel supports pointer drag without changing the modal contract', () => {
  assert.match(script, /enableDragScroll/);
  assert.match(script, /setPointerCapture/);
  assert.match(css, /\.reels-track[^\{]*\{[^\}]*cursor:\s*grab/s);
  assert.match(css, /\.reels-track\.is-dragging/);
});
