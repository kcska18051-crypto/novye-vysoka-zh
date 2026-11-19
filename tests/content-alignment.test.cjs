const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'dist', 'styles.css'), 'utf8');

test('uses the current approved Chinese hero and lifestyle message', () => {
  assert.match(html, /id="hero-title">熟悉的地方<br>新的可能性/);
  assert.match(html, /id="about-title">人们喜爱城外生活的一切 — 都在附近/);
  assert.match(html, /让人想要<br>在城外度过的日子/);
  assert.match(html, /选择一个片区<br>建造自己的家/);
});

test('keeps four-quarter scope with four confirmed named map regions', () => {
  assert.match(html, /<h2>4个片区<\/h2>/);
  assert.match(html, /“新维索卡”项目的四个片区/);
  const regions = [...html.matchAll(/data-map-quarter="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(regions, ['degtyaritsy', 'chernaya', 'vysoka', 'nikolo']);
  assert.doesNotMatch(html, /data-map-quarter="quarter-5"/);
  assert.doesNotMatch(html, /三个片区/);
});

test('keeps agreed route destinations and buyer questions', () => {
  const vm = require('node:vm');
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'dist', 'transport-approved-data.js'), 'utf8'), context);
  assert.deepEqual(Object.values(context.window.TRIP_PLANNER_DATA.cities), ['莫斯科', '雅罗斯拉夫尔', '雷宾斯克', '乌格利奇']);
  for (const question of ['还有哪些公用设施可用？', '价格包含什么？', '可以从另一个城市了解地块吗？']) assert.ok(html.includes(question));
  assert.doesNotMatch(html, /待确认<\/strong>/);
  assert.doesNotMatch(html, /从梅什金出发/);
});

test('shows qualified house-prize promotion with dates and participation action', () => {
  const promotion = html.match(/<aside class="house-promotion"[\s\S]*?<\/aside>/)?.[0] || '';
  assert.match(promotion, /我们抽奖送出<br>住宅，面向<br>购地客户/);
  assert.match(promotion, /2025年10月30日至2027年12月31日/);
  assert.match(promotion, /src="assets\/promotion\/modular-house\.webp"/);
  assert.match(promotion, /data-lead-intent="promotion"[^>]*>参加活动/);
  for (const phrase of ['在活动期间购买地块', '每购买一个地块 — 一张参与抽奖的票', '活动结束后举行住宅抽奖']) assert.ok(promotion.includes(phrase));
  assert.doesNotMatch(promotion, /保证获奖|购地即送住宅/);
  assert.doesNotMatch(css, /\.promotion-band:hover \.promotion-image/);
});

test('keeps current project features and minimum land price fact-led', () => {
  assert.match(html, /<h2>个人住宅建设用地<\/h2>/);
  assert.match(html, /“新维索卡”位于雷宾斯克区的森林之间/);
  assert.match(html, /class="hero-price"[^>]*>每1索特卡45 000卢布起/);
  assert.match(html, /<h2>直接向业主购买<\/h2>/);
  assert.match(html, /建设的可能性取决于具体地块的规则和限制/);
  assert.doesNotMatch(html, /200多块独立住宅建设用地|275公顷/);
  assert.doesNotMatch(html, /已建成餐厅|免费租船|保证升值/);
});

test('identifies Dmitry as founder and project lead without calling him director', () => {
  assert.match(html, /德米特里·罗季奥诺夫/);
  assert.match(html, /<strong>德米特里·罗季奥诺夫<\/strong><span>“土地商店”创始人，<br>“新维索卡”项目负责人<\/span>/);
  assert.doesNotMatch(html, /德米特里·罗季奥诺夫[\s\S]{0,120}土地商店总经理/);
});

test('distinguishes future infrastructure from existing surroundings', () => {
  const mapData = fs.readFileSync(path.join(__dirname, '..', 'dist', 'map-data.js'), 'utf8');
  assert.match(mapData, /项目构想中规划了一个/);
  assert.match(mapData, /未来设施的可视化效果图/);
});

test('presents direct purchase with 30 percent down and 12 equal payments', () => {
  const purchase = html.match(/<section class="purchase"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(purchase, /分期付款，无需银行参与/);
  assert.match(purchase, /<dt>首付款<\/dt><dd>30<span>%<\/span><\/dd>/);
  assert.match(purchase, /<dt>等额月付款<\/dt><dd>12<\/dd>/);
  assert.match(purchase, /data-lead-intent="installment"[^>]*>了解分期付款条件/);
  assert.match(purchase, /直接向业主购买/);
  assert.match(purchase, /href="#faq"/);
});

test('uses the supplied beach hero and accessible localized situation plan', () => {
  assert.match(html, /class="hero-image" src="assets\/client-october\/hero-beach\.webp"/);
  assert.match(html, /srcset="assets\/client-october\/hero-beach-mobile\.webp"/);
  assert.match(html, /href="assets\/situation-plan-zh\.svg" aria-haspopup="dialog" aria-controls="situation-plan-dialog"/);
  assert.match(html, /id="situation-plan-dialog"/);
  assert.match(html, /维索科沃松林和黑河附近/);
  assert.doesNotMatch(html, /class="route-diagram"/);
});
