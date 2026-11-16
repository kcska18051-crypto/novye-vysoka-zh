const fs=require('fs');
const root='dist/';
const original=p=>require('child_process').execFileSync('git',['show','c2516d7:dist/'+p],{maxBuffer:20*1024*1024}).toString('utf8');
const family='Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif';
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g font-family="${family}">${body}</g></svg>`;
const text=(x,y,t,size=22,fill='#172d1b',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${t}</text>`;
const png=p=>'data:image/png;base64,'+fs.readFileSync(root+p).toString('base64');
// Keep the original icon and replace the outlined Russian wordmark with Chinese lettering.
const old=original('magazin-zemli-logo.svg');
const inner=old.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
fs.writeFileSync(root+'magazin-zemli-logo.svg',svg(597,168,`<defs><clipPath id="brand-mark"><rect width="175" height="168"/></clipPath></defs><g clip-path="url(#brand-mark)">${inner}</g>`+text(205,116,'土地商店',87,'white','font-weight="600" textLength="388" lengthAdjust="spacingAndGlyphs"')));
fs.writeFileSync(root+'assets/redstar-agency-credit.svg',svg(179,18,text(0,13,'网站设计 · Red Star Agency',11,'white')));
// Localized plan headers overlay the original image; plot geometry and numbers are unchanged.
for(const [id,title,price] of [['degtyaritsy','杰格佳里齐','70,000'],['nikolo','尼科洛科尔马','45,000']]){
 let body=`<image href="${png('assets/quarter-overview/'+id+'-plan.png')}" width="1680" height="1187"/><rect width="700" height="144" fill="white"/>`;
 body+=text(24,49,title,29,'#111');
 body+=`<rect x="22" y="75" width="49" height="22" fill="#ceff96" stroke="#333"/>`+text(82,95,`${price} 卢布起 / 100平方米`,20,'#111');
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
 [933,110,79,28,'餐厅',17],[892,157,120,31,'遛狗区',17],[843,210,169,30,'运动场',17],
 [869,258,144,30,'儿童游乐场',16],[841,298,173,30,'家园森林公园',16],
 [1051,447,139,29,'样板房',17],[1093,497,71,29,'商店',17],[958,602,67,30,'教堂',17],
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
// Fully vectorized localization of the regional route diagram, with original destinations/distances and route geometry.
let body='<rect width="1920" height="1080" fill="#e9dfd0"/><defs><pattern id="contours" width="170" height="150" patternUnits="userSpaceOnUse"><path d="M0 45Q50 10 120 55T230 20M-40 140Q30 70 110 115T220 100" fill="none" stroke="#cabead" stroke-width="2" opacity=".35"/></pattern></defs><rect width="1920" height="1080" fill="url(#contours)"/>';
body+='<path d="M0 690Q360 650 570 460T1050 230T1920 370M0 290Q380 380 740 530T1300 800T1920 750M150 1080Q440 780 530 0M1450 1080Q1170 630 1380 0" fill="none" stroke="#cfc5b7" stroke-width="3"/>';
body+='<g fill="none" stroke="#263b2b" stroke-width="3"><path d="M553 997L620 852L665 780L695 735L728 675L771 601L798 531L827 493L848 427L873 390L951 377L981 336L989 330L960 283L912 269L865 257L824 251L806 223L768 217L759 226"/><path d="M689 371L709 333L696 312L716 280L719 259"/><path d="M800 183L761 184"/><path d="M699 146L710 174L694 164"/></g>';
const city=(cx,cy,name,tx,ty,dist,align='start')=>{
 body+=`<circle cx="${cx}" cy="${cy}" r="${name==='新维索卡'?24:14}" fill="#386d1a" stroke="#d4d9b6" stroke-width="4"/>`;
 body+=text(tx,ty,name,name==='新维索卡'?54:31,name==='新维索卡'?'#386d1a':'#172d1b',`text-anchor="${align}" font-weight="600"`);
 if(dist){body+=`<rect x="${tx}" y="${ty+10}" width="140" height="46" fill="#182d1e" rx="2"/>`+text(tx+12,ty+42,dist+' 公里',27,'white');}
};
city(725,224,'新维索卡',685,246,null,'end');city(698,146,'科普里诺',539,96,'30');city(801,183,'雷宾斯克',825,139,'25');city(994,330,'雅罗斯拉夫尔',1020,342,'110');city(689,371,'乌格利奇',563,383,'45');city(553,997,'莫斯科',420,975,null);
body+='<rect x="742" y="676" width="157" height="48" fill="#182d1e"/>'+text(755,710,'300 公里',28,'white');
body+=text(1820,980,'项目区位图',48,'#172d1b','text-anchor="end"');
fs.writeFileSync(root+'assets/situation-plan-zh.svg',svg(1920,1080,body));
console.log('Localized SVG assets created.');
