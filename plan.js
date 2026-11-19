'use strict';
(() => {
  const data = window.planData;
  const root = document.querySelector('#plot-picker');
  const svg = root.querySelector('svg');
  const card = root.querySelector('#plot-detail');
  const list = root.querySelector('#plot-list');
  const state = {quarter:'all',free:true,selected:null,view:'plan'};
  const quarter = id => data.quarters.find(q => q.id === id);
  root.querySelectorAll('[data-quarter-price]').forEach(label => {
    label.textContent = quarter(label.dataset.quarterPrice).price;
  });
  const results = () => data.plots.filter(p => (state.quarter === 'all' || p.quarter === state.quarter) && (!state.free || p.status === 'free'));
  const displayId = id => id.replace(/^\u0414\u0415\u041c\u041e-/, '演示-');
  const money = value => value == null ? '待确认' : new Intl.NumberFormat('zh-CN').format(value) + ' 卢布';
  function changeQuarter(id) {
    state.quarter=id; state.selected=null; state.view='plan'; render();
    root.querySelector('#quarter-summary').focus({preventScroll:true});
  }
  function choose(id) {
    const plot = results().find(p => p.id === id && p.status === 'free');
    if (!plot) return;
    state.selected=id; render();
    card.focus({preventScroll:true});
    if (matchMedia('(max-width:760px)').matches) card.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function render() {
    const visible = results();
    root.classList.toggle('overview-mode', state.quarter === 'all');
    if (!visible.some(p => p.id === state.selected)) state.selected=null;
    root.querySelectorAll('[data-quarter]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.quarter===state.quarter)));
    const q = quarter(state.quarter);
    card.hidden=!q;
    root.querySelector('.plan-toolbar').hidden=!q;
    root.querySelector('.plan-legend').hidden=!q;
    root.querySelector('#plan-help').textContent=q ? '选择图上的可用地块，或打开列表。' : '同一项目的三个片区。点击图上的片区，或在上方选择。';
    root.querySelector('#picker-catalog-link').textContent = state.selected ? '获取考虑已选地块的选集 →' : q ? '获取该片区的地块选集 →' : '获取地块选集 →';
    root.querySelector('#quarter-summary').textContent = q
      ? `${q.description} 具体地块的可用情况及限制根据文件确认。`
      : '尼科洛科尔马、杰格佳里齐和中央部分——“新维索卡”的三个片区。选择片区，进入地块。';
    svg.setAttribute('viewBox',q ? `${q.bounds[0]-20} ${q.bounds[1]-30} ${q.bounds[2]+40} ${q.bounds[3]+60}` : '0 0 900 480');
    svg.innerHTML = `<rect width="900" height="480" fill="#edf0e5"/><path d="M0 0H900V75Q600 110 0 70Z" fill="#c3d3bb"/><text x="450" y="42" text-anchor="middle" class="landmark">森林 · 示意位置</text><path d="M0 435Q450 400 900 435V480H0Z" fill="#bbd6df"/><text x="450" y="466" text-anchor="middle" class="landmark">水域 · 示意位置</text><path d="M10 420H890" stroke="#c4bda9" stroke-width="14"/><text x="450" y="424" text-anchor="middle" class="road-label">入口 · 示意</text>`;
    for (const district of data.quarters) {
      if(q && district.id!==q.id) continue;
      const [x,y,w,h]=district.bounds;
      svg.insertAdjacentHTML('beforeend',`<g class="district ${state.quarter!=='all' && state.quarter!==district.id?'outside':''}" role="button" tabindex="${state.quarter!=='all' && state.quarter!==district.id?'-1':'0'}" aria-label="放大片区 ${district.name}" data-zone="${district.id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/><text x="${x+w/2}" y="${q ? y+38 : y+h/2-15}" text-anchor="middle">${district.id==='ct'?'<tspan x="'+(x+w/2)+'" dy="-8">中央</tspan><tspan x="'+(x+w/2)+'" dy="34">区域</tspan>':district.name}</text>${q ? '' : '<text x="'+(x+w/2)+'" y="'+(y+h/2+65)+'" text-anchor="middle" class="quarter-map-action">查看地块 →</text>'}</g>`);
    }
    for (const plot of data.plots) {
      if(!q || !visible.includes(plot)) continue;
      const [x,y,w,h]=plot.rect;
      const active=plot.status==='free' && visible.includes(plot);
      const outside=state.quarter!=='all' && plot.quarter!==state.quarter;
      svg.insertAdjacentHTML('beforeend',`<g class="plot ${plot.status} ${state.selected===plot.id?'selected':''} ${outside?'outside':''}" ${active?`role="button" tabindex="0" data-plot="${plot.id}"`: 'role="img"'} aria-label="${displayId(plot.id)}, ${plot.area} 索特卡, ${plot.status==='free'?'可用':'已售'} — 示意数据"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/><text x="${x+w/2}" y="${y+h/2-5}" text-anchor="middle">${displayId(plot.id)}</text><text class="plot-status" x="${x+w/2}" y="${y+h/2+18}" text-anchor="middle">${plot.status==='free'?'可用':'已售'}</text></g>`);
    }
    root.querySelector('#result-count').textContent=q ? `示意地块： ${visible.length}. 可用： ${visible.filter(p=>p.status==='free').length}.` : '项目总体规划 · 3个片区';
    root.querySelector('#empty-plots').hidden=!q || visible.some(p=>p.status==='free');
    list.innerHTML=visible.map(p=>`<article class="list-plot"><div><h4>${displayId(p.id)}</h4><p>${quarter(p.quarter).name} · ${p.area} 索特卡（示意）</p><p>${p.status==='free'?'可用':'已售'} · 演示状态</p></div>${p.status==='free'?`<button type="button" class="button secondary" data-list-plot="${p.id}">选择地块</button>`:'<span class="small">不可选择</span>'}</article>`).join('');
    const plot=data.plots.find(p=>p.id===state.selected);
    card.innerHTML=plot ? `<button class="detail-close" type="button" aria-label="关闭地块信息卡">×</button><h3>${displayId(plot.id)}</h3><p>${quarter(plot.quarter).name}</p><p class="demo-status">可用 — 演示状态</p><dl class="plot-facts"><div><dt>面积（示意）</dt><dd>${plot.area} 索特卡</dd></div><div><dt>总价</dt><dd>${money(plot.total)}</dd></div><div><dt>每1索特卡价格</dt><dd>${money(plot.pricePerSotka)}</dd></div><div><dt>项目用途</dt><dd>个人住宅建设 · 地块信息根据不动产统一登记簿核实</dd></div></dl><div class="detail-photo">暂未提供地块照片</div><p class="small">编号、面积、边界和可用情况均为测试流程而虚构。这不是销售要约。</p><button type="button" class="text-link show-on-plan">在图上显示</button><a class="button tour-plot" href="#tour-form">预约查看地块 ↗</a>`
      : '<h3>选择可用地块</h3><p>点击图上或列表中的地块。此处将显示其参数。</p><p class="small">本区块中的所有地块和状态均为演示。</p>';
    root.querySelector('#plan-panel').hidden=state.view!=='plan';
    list.hidden=!q || state.view!=='list';
    root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
  }
  root.addEventListener('click',event=> {
    const button=event.target.closest('button,a,[data-zone],[data-plot]');
    if(!button) return;
    if(button.dataset.quarter) changeQuarter(button.dataset.quarter);
    else if(button.dataset.zone) changeQuarter(button.dataset.zone);
    else if(button.dataset.plot || button.dataset.listPlot) choose(button.dataset.plot || button.dataset.listPlot);
    else if(button.dataset.view) {state.view=button.dataset.view;render();}
    else if(button.classList.contains('detail-close')) {state.selected=null;render();root.querySelector('[data-view="'+state.view+'"]').focus();}
    else if(button.classList.contains('show-on-plan')) {state.view='plan';render();svg.scrollIntoView({block:'center',behavior:'smooth'});}
    else if(button.classList.contains('tour-plot')) window.setTourIntent('visit');
  });
  svg.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-zone],[data-plot]')){event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  root.querySelector('#free-only').addEventListener('change',event=>{state.free=event.target.checked;render();});
  card.addEventListener('keydown',event=>{if(event.key==='Escape'){state.selected=null;render();root.querySelector('[data-view="'+state.view+'"]').focus();}});
  let catalogPlanContext = null;
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-open-catalog], a[href="#catalog-form"], a[href="#tour-form"]');
    if (!link) return;
    const prefix = link.matches('[data-open-catalog], a[href="#catalog-form"]') ? 'catalog' : 'tour';
    if (prefix === 'catalog') {
      const context = state.quarter + ':' + (state.selected || '');
      if (catalogPlanContext === context) return;
      catalogPlanContext = context;
    }
    const plot = data.plots.find(p => p.id === state.selected);
    const q = plot ? quarter(plot.quarter) : quarter(state.quarter);
    document.querySelector('#' + prefix + '-selection').value = plot ? q.name + ' · ' + displayId(plot.id) + ' （示意地块）' : q ? q.name + ' · 尚未选择地块' : '尚未选择地块';
    if(prefix === 'catalog') document.querySelector('#territory').value = q ? q.name : '仍在选择';
    document.querySelector('#' + prefix + '-form .form-feedback').hidden = true;
  });
  document.addEventListener('clear-plan-selection', () => {state.selected=null;state.quarter='all';catalogPlanContext=null;render();});
  render();
})();
