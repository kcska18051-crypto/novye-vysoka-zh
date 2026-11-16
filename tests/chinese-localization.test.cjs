const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'../dist'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('Chinese page has localized copy, accessibility and referenced assets',()=>{
 assert.match(html,/<html lang="zh-CN">/);assert.match(html,/chinese.css/);assert.match(html,/chinese-validation.js/);
 const content=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');
 const text=content.replace(/<[^>]*>/g,'');assert.doesNotMatch(text,/[А-Яа-яЁё]/);
 for(const m of content.matchAll(/\b(?:alt|title|aria-label|placeholder|data-video-title|data-video-description)="([^"]*)"/g))assert.doesNotMatch(m[1],/[А-Яа-яЁё]/);
 for(const m of html.matchAll(/\b(?:src|href|data-src)="([^"#][^"]*)"/g)){const ref=m[1].split('?')[0];if(/^(https?:|tel:|mailto:|data:)/.test(ref))continue;assert.ok(fs.existsSync(path.join(root,ref)),ref);}
});
test('Every route is Chinese while route IDs and factual destinations remain stable',()=>{
 const box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'transport-approved-data.js'),'utf8'),box);const data=box.window.TRIP_PLANNER_DATA;
 assert.equal(Object.keys(data.routes).length,12);assert.equal(data.cities.moscow,'莫斯科');
 for(const route of Object.values(data.routes))for(const step of route.steps){assert.doesNotMatch(step.title+step.text,/[А-Яа-яЁё]/);assert.match(step.title+step.text,/[\u3400-\u9fff]/);}
});
test('Localized plans and PDFs available; demo success remains backend-gated',()=>{
 for(const p of ['assets/situation-plan-zh.svg','assets/quarter-overview/degtyaritsy-plan-zh.svg','assets/quarter-overview/nikolo-plan-zh.svg','assets/quarter-overview/project-presentation.pdf'])assert.ok(fs.statSync(path.join(root,p)).size>1000);
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');assert.match(app,/addEventListener\('lead:success'/);assert.match(app,/网站正式上线前将接入提交功能/);assert.doesNotMatch(app,/fetch\(/);
});
