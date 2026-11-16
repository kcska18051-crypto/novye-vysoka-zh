const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const cssPath = path.join(root, 'dist', 'interactive-map.css');
const scriptPath = path.join(root, 'dist', 'interactive-map.js');

test('loads interactive map assets in dependency order', () => {
  assert.match(html, /interactive-map\.css/);
  const data = html.indexOf('map-data.js');
  const model = html.indexOf('interactive-map-model.js');
  const controller = html.indexOf('interactive-map.js');
  assert.ok(data > 0 && model > data && controller > model);
});

test('provides the current accessible zoomable quarter explorer', () => {
  assert.doesNotMatch(html, /class="quarter-grid/);
  assert.doesNotMatch(html, /class="plan-draft/);
  assert.match(html, /class="quarter-explorer section"/);
  assert.match(html, /class="qe-map-viewport" tabindex="0" role="region" aria-label="[^" ]+/);
  assert.equal((html.match(/role="button" tabindex="0" data-map-quarter=/g) || []).length, 4);
  for (const id of ['qe-map-minus', 'qe-map-reset', 'qe-map-plus']) assert.ok(html.includes(`id="${id}"`));
  assert.match(html, /id="qe-quarter-popup" role="region" aria-label="已选片区" hidden/);
  assert.match(html, /<dialog id="qe-detail" aria-labelledby="qe-detail-title" hidden>/);
  assert.match(html, /aria-live="polite"/);
});

test('provides a labelled full-plan dialog and dynamic controller', () => {
  assert.match(html, /<dialog[^>]+id="quarter-plan-dialog"[^>]+aria-labelledby="quarter-plan-title"/i);
  assert.ok(fs.existsSync(cssPath));
  assert.ok(fs.existsSync(scriptPath));
  const script = fs.readFileSync(scriptPath, 'utf8');
  assert.match(script, /getVisibleItems/);
  assert.match(script, /data-map-item/);
  assert.match(script, /data-map-filter/);
});

test('delegates lead clicks so the dynamically rendered quarter CTA opens the popup', () => {
  const app = fs.readFileSync(path.join(root, 'dist', 'app.js'), 'utf8');
  assert.match(app, /closest\('\[data-lead-intent\]'\)/);
});

test('map markers expose hover tooltips and selected context', () => {
  const script = fs.readFileSync(scriptPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  assert.match(script, /role="tooltip"/);
  assert.match(script, /aria-describedby=/);
  assert.match(script, /dataset\.selectionKind/);
  assert.match(css, /map-marker:hover \.map-marker-label/);
  assert.match(css, /data-selection-kind="quarters"/);
});
