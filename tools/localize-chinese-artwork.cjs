const fs=require('fs');
const cp=require('child_process');
const root='dist/';
const sourceBuffer=p=>{const archive='source-assets/original-russian-artwork/'+p.split('/').pop();return fs.existsSync(archive)?fs.readFileSync(archive):cp.execFileSync('git',['show','c2516d7:dist/'+p],{maxBuffer:32*1024*1024});};
const original=p=>sourceBuffer(p).toString('utf8');
const family='Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif';
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g font-family="${family}">${body}</g></svg>`;
const text=(x,y,t,size=22,fill='#172d1b',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${t}</text>`;
const png=p=>'data:image/png;base64,'+sourceBuffer(p).toString('base64');
// Keep the original icon and replace the outlined Russian wordmark with Chinese lettering.
const old=original('magazin-zemli-logo.svg');
const inner=old.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
fs.writeFileSync(root+'magazin-zemli-logo.svg',svg(597,168,`<defs><clipPath id="brand-mark"><rect width="175" height="168"/></clipPath></defs><g clip-path="url(#brand-mark)">${inner}</g>`+text(205,116,'土地商店',87,'white','font-weight="600" textLength="388" lengthAdjust="spacingAndGlyphs"')));
fs.writeFileSync(root+'assets/redstar-agency-credit.svg',svg(179,18,text(0,13,'网站设计 · Red Star Agency',11,'white')));
// Localized plan headers overlay the original image; plot geometry and numbers are unchanged.
for(const [id,title,price] of [['degtyaritsy','杰格佳里齐','70,000'],['nikolo','尼科洛科尔马','45,000']]){
 let body=`<image href="${png('assets/quarter-overview/'+id+'-plan.png')}" width="1680" height="1187"/><rect width="700" height="144" fill="white"/>`;
 body+=text(24,49,title,29,'#111');
 body+=`<rect x="22" y="75" width="49" height="22" fill="#ceff96" stroke="#333"/>`+text(82,95,`${price} 卢布起 / 索特卡`,20,'#111');
 if(id==='degtyaritsy')body+=`<rect x="22" y="115" width="49" height="22" fill="#ffae46" stroke="#333"/>`+text(82,134,'特别价格',20,'#111');
 body+=`<rect x="1620" y="98" width="60" height="26" fill="white"/>`+text(1620,117,'200 米',17,'#111');
 if(id==='nikolo'){
  body+=`<rect x="1160" y="1040" width="124" height="23" fill="#a8ae9d"/>`+text(1164,1057,'尼科洛科尔马',16,'#3b4936');
  body+=`<path d="M1544 1045l136-57v37l-121 52Z" fill="#a9b09e"/>`+text(1571,1056,'雷宾斯克',15,'#3b4936','transform="rotate(-24 1571 1056)"');
 }
 fs.writeFileSync(root+'assets/quarter-overview/'+id+'-plan-zh.svg',svg(1680,1187,body));
}
// The overview is already an SVG: replace its baked labels with vector Chinese labels.
let overview=original('assets/quarter-overview/overview-clean.svg');
const labels=[
 [197,197,52,30,'沙滩',17],[197,316,64,30,'码头',17],
 [933,110,79,28,'餐厅',17],[892,157,120,31,'犬类活动场',17],[843,210,169,30,'运动场',17],
 [869,258,144,30,'儿童游乐场',16],[841,298,173,30,'“家中森林”公园',16],
 [1051,447,139,29,'展示住宅',17],[1093,497,71,29,'商店',17],[958,602,67,30,'教堂',17],
 [372,25,66,18,'杰格佳里齐',11],[216,370,63,18,'杰格佳里齐',11],[294,536,104,20,'维索科沃松林',11],
 [684,650,56,18,'瓦利佐沃',11],[1102,634,88,19,'尼科洛科尔马',11]
];
let patch='<g transform="scale(1.4)" font-family="'+family+'">';
for(const [x,y,w,h,t,size]of labels){patch+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h>23?10:2}" fill="#34442b" fill-opacity="1"/>`+text(x+w/2,y+h*.71,t,size,'#fff9e9','text-anchor="middle"');}
// Road labels in the source are rotated; cover only those labels, not the road.
patch+=`<path d="M466 0l71 61-11 15-70-66Z" fill="#697356"/>`+text(482,24,'科普里诺 30公里',11,'#fff9e9','transform="rotate(43 482 24)"');
patch+=`<path d="M1117 618l83-57v24l-74 49Z" fill="#667054"/>`+text(1136,617,'雷宾斯克 25公里',10,'#fff9e9','transform="rotate(-34 1136 617)"');
patch+=`<path d="M895 841l25-87 16 5-25 87Z" fill="#687452"/>`+text(907,832,'乌格利奇 45公里',10,'#fff9e9','transform="rotate(-74 907 832)"');
patch+='</g>';
overview=overview.replace(/<\/svg>\s*$/,patch+'</svg>');fs.writeFileSync(root+'assets/quarter-overview/overview-clean.svg',overview);
// Preserve the original basemap and routes; cover only prominent Russian captions.
let body='<image href="'+png('assets/situation-plan-client.png')+'" width="1920" height="1080"/>';
const k=1920/1100;
const captions=[[122,109,273,33,'新维索卡',31,'#386d1a'],[309,41,91,20,'科普里诺',18,'#111'],[470,63,92,20,'雷宾斯克',18,'#111'],[581,177,123,23,'雅罗斯拉夫尔',17,'#111'],[322,203,70,20,'乌格利奇',18,'#111'],[237,542,76,21,'莫斯科',18,'#111'],[725,532,321,32,'区位图',27,'#172d1b']];
for(const [x,y,w,h,t,size,colour]of captions)body+='<rect x="'+(x*k)+'" y="'+(y*k)+'" width="'+(w*k)+'" height="'+(h*k)+'" fill="#e9dfd0"/>'+text((x+2)*k,(y+h*.82)*k,t,size*k,colour);
for(const [x,y,w,t]of [[310,62,79,'30 公里'],[472,85,78,'25 公里'],[584,200,78,'110 公里'],[322,224,78,'45 公里'],[424,387,78,'300 公里']])body+='<rect x="'+(x*k)+'" y="'+(y*k)+'" width="'+(w*k)+'" height="'+(28*k)+'" fill="#182d1e"/>'+text((x+6)*k,(y+21)*k,t,18*k,'white');
fs.writeFileSync(root+'assets/situation-plan-zh.svg',svg(1920,1080,body));
console.log('Chinese artwork created.');
