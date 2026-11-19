const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../dist/app.js'), 'utf8');
const start = source.indexOf('  const formatPhone =');
const end = source.indexOf("  document.querySelectorAll('[data-demo-form]')", start);
const helpers = vm.runInNewContext(`${source.slice(start, end)}; ({formatPhone, isInternationalPhone: typeof isInternationalPhone === 'function' ? isInternationalPhone : () => false})`);

test('phone editing preserves international codes and does not truncate numbers', () => {
  for (const value of ['+86 138 0013 8000', '+7 (999) 123-45-67', '+44 20 7946 0958', '+852 2123 4567', '13800138000', '']) {
    assert.equal(helpers.formatPhone(value), value);
  }
});

test('international phone validation accepts common countries and formatted input', () => {
  for (const value of ['+86 138 0013 8000', '+7 (999) 123-45-67', '+44 20 7946 0958', '+852 2123 4567', '+1 202 555 0123']) {
    assert.equal(helpers.isInternationalPhone(value), true, value);
  }
});

test('phone validation rejects missing codes, letters, misplaced plus and excessive length', () => {
  for (const value of ['', '+', '+86', '13800138000', '+0123456789', '++8613800138000', '+86abc13800138000', '+86138001380001234', '+86 138 +0013 8000']) {
    assert.equal(helpers.isInternationalPhone(value), false, value);
  }
});
