(function () {
  const root = document.querySelector('[data-interactive-map]');
  const data = globalThis.NOVYE_VYSOKA_MAP_DATA;
  const model = globalThis.NOVYE_VYSOKA_MAP_MODEL;
  if (!root || !data || !model) return;

  const filters = root.querySelector('[data-map-filters]');
  const markers = root.querySelector('[data-map-markers]');
  const card = root.querySelector('[data-map-card]');
  const list = root.querySelector('[data-map-object-list]');
  const live = root.querySelector('[data-map-live]');
  const dialog = document.querySelector('#quarter-plan-dialog');
  const dialogTitle = dialog?.querySelector('#quarter-plan-title');
  const dialogImage = dialog?.querySelector('[data-quarter-plan-image]');
  const dialogClose = dialog?.querySelector('.quarter-plan-dialog-close');
  let category = 'all';
  let selectedId = null;
  let returnFocus = null;

  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const categoryIcon = { quarters: '⌂', nature: '♧', infrastructure: '◆', transport: '↔' };
  const categoryName = { quarters: '片区', nature: '自然', infrastructure: '配套设施', transport: '交通' };

  function renderFilters() {
    filters.innerHTML = data.categories.map((item) => `<button class="map-filter" type="button" data-map-filter="${item.id}" aria-pressed="${item.id === category}">${escapeHtml(item.label)}</button>`).join('');
  }

  function renderMedia(view) {
    if (!view.image) return '<div class="map-card-media is-fallback"></div>';
    return `<div class="map-card-media"><img src="${escapeHtml(view.image)}" data-fallback="${escapeHtml(view.imageFallback)}" alt="${escapeHtml(view.name)}" loading="lazy"></div>`;
  }

  function renderQuarter(view) {
    const metrics = [
      ['每1索特卡价格', view.metrics.pricePerSotka],
      ['可用', view.metrics.free],
      ['已预订', view.metrics.reserved],
      ['已售', view.metrics.sold]
    ];
    return `${renderMedia(view)}<button class="map-card-close" type="button" data-map-close aria-label="关闭信息卡">×</button><span class="map-card-type">项目片区</span><h3>${escapeHtml(view.name)}</h3><p class="map-card-description">${escapeHtml(view.description)}</p><div class="map-metrics">${metrics.map(([label,value]) => `<div class="map-metric"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div><div class="map-card-actions"><button class="button map-secondary" type="button" data-open-plan>打开总平面图</button><a class="button button-primary" href="#tour" data-lead-intent="selection">挑选地块</a></div>`;
  }

  function renderObject(view) {
    const facts = view.facts.length ? `<ul class="map-card-facts">${view.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join('')}</ul>` : '';
    const mapLink = view.mapUrl ? `<a class="map-card-maplink" href="${escapeHtml(view.mapUrl)}" target="_blank" rel="noopener noreferrer">在 Yandex 地图中打开 ↗</a>` : '';
    return `${renderMedia(view)}<button class="map-card-close" type="button" data-map-close aria-label="关闭信息卡">×</button><span class="map-card-type">${categoryName[model.getItemById(data, view.id).category]}</span><h3>${escapeHtml(view.name)}</h3><p class="map-card-description">${escapeHtml(view.description)}</p>${facts}${mapLink}`;
  }

  function bindMediaFallback() {
    const image = card.querySelector('.map-card-media img');
    image?.addEventListener('error', () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src !== new URL(fallback, location.href).href) image.src = fallback;
      else image.parentElement.classList.add('is-fallback');
    }, { once: true });
  }

  function render() {
    const visible = model.getVisibleItems(data, category);
    selectedId = model.nextSelection(data, category, selectedId);
    const selectedItem = selectedId ? model.getItemById(data, selectedId) : null;
    root.dataset.selectionKind = selectedItem?.category || '';
    renderFilters();
    markers.innerHTML = visible.map((item) => {
      const tooltipId = `map-tooltip-${item.id}`;
      return `<button class="map-marker" type="button" data-map-item="${item.id}" data-category="${item.category}" aria-label="打开： ${escapeHtml(item.name)}" aria-describedby="${tooltipId}" aria-pressed="${item.id === selectedId}" style="--x:${item.x}%;--y:${item.y}%"><span aria-hidden="true">${categoryIcon[item.category]}</span><span class="map-marker-label" id="${tooltipId}" role="tooltip">${escapeHtml(item.name)}</span></button>`;
    }).join('');
    list.innerHTML = visible.map((item) => `<button class="map-list-button" type="button" data-map-item="${item.id}" aria-pressed="${item.id === selectedId}">${escapeHtml(item.name)}</button>`).join('');
    root.classList.toggle('has-selection', Boolean(selectedId));
    if (!selectedId) {
      card.innerHTML = '<div class="map-card-empty"><span>点击点位</span><h3>选择地图上的片区或对象</h3><p>此处将显示总平面图、片区数据或地点简介。</p></div>';
      return;
    }
    const view = model.getCardModel(model.getItemById(data, selectedId));
    card.innerHTML = `<article class="map-card">${view.kind === 'quarter' ? renderQuarter(view) : renderObject(view)}</article>`;
    bindMediaFallback();
  }

  function selectItem(id, trigger) {
    selectedId = id;
    returnFocus = trigger || null;
    render();
    const item = model.getItemById(data, id);
    live.textContent = `已打开信息卡： ${item.name}`;
  }

  function closeCard() {
    selectedId = null;
    render();
    returnFocus?.focus({ preventScroll: true });
  }

  root.addEventListener('click', (event) => {
    const filter = event.target.closest('[data-map-filter]');
    if (filter) {
      category = filter.dataset.mapFilter;
      render();
      live.textContent = `地图筛选： ${filter.textContent}`;
      return;
    }
    const item = event.target.closest('[data-map-item]');
    if (item) {
      selectItem(item.dataset.mapItem, item);
      return;
    }
    if (event.target.closest('[data-map-close]')) closeCard();
    if (event.target.closest('[data-open-plan]')) {
      const view = model.getCardModel(model.getItemById(data, selectedId));
      if (!view || view.kind !== 'quarter' || !dialog) return;
      dialogTitle.textContent = `总平面图： ${view.name}`;
      dialogImage.src = view.image;
      dialogImage.alt = `片区总平面图 ${view.name}`;
      dialog.showModal();
    }
  });

  dialogClose?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog?.addEventListener('close', () => root.querySelector('[data-open-plan]')?.focus({ preventScroll: true }));
  render();
})();
