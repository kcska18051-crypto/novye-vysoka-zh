(() => {
  const root = document.querySelector('[data-around]');
  if (!root) return;

  const groups = {
    life: [
      { title: '商店', image: 'shop-pyaterochka-client.webp', position: 'center 90%', alt: 'Pyaterochka 超市。客户实拍，已修除路面上的电线杆阴影。' },
      { title: '公交站点', image: 'stop-degtyaritsy.png' },
      { title: '教育机构', image: 'school-green-v2.webp', alt: '绿树环绕的教育机构，经艺术处理的照片' },
      { title: '道路与入口', image: 'road-pines-client-v2.webp', position: 'center 65%', alt: '客户实拍的松林道路。' }
    ],
    rest: [
      { title: '维索科沃松林', image: 'forest-client-natural.webp', position: 'center 75%', alt: '维索科沃松林及松树间的水面。客户照片，经过轻微调色。' },
      { title: '码头', image: 'river-edited.webp' },
      { title: '伏尔加河沙滩', image: 'shore-client-natural.webp', position: 'center 78%', alt: '松林旁的伏尔加河沙岸。客户照片，经过轻微调色。' },
      { title: '雷宾斯克', image: 'rybinsk-sunset-v2.webp', alt: '雷宾斯克日落，经艺术处理的照片' },
      { title: '“维索科沃松林”儿童营地', image: 'camp-edited.webp' }
    ]
  };
  const tabs = [...root.querySelectorAll('[data-around-category]')];
  const gallery = root.querySelector('[data-around-gallery]');
  let category = 'rest';

  function render() {
    gallery.dataset.count = String(groups[category].length);
    tabs.forEach(tab => {
      const selected = tab.dataset.aroundCategory === category;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    gallery.classList.remove('is-changing');
    void gallery.offsetWidth;
    gallery.classList.add('is-changing');
    gallery.replaceChildren(...groups[category].map(item => {
      const card = document.createElement('figure');
      card.className = 'around-card';
      if (item.image === 'stop-degtyaritsy.png') card.classList.add('around-card--stop');
      if (item.image === 'river-edited.webp') card.classList.add('around-card--river');
      const photo = document.createElement('div');
      photo.className = 'around-photo';
      const image = document.createElement('img');
      image.src = `assets/around/${item.image}`;
      image.alt = item.alt || item.title;
      if (item.position) image.style.objectPosition = item.position;
      image.loading = 'lazy';
      image.decoding = 'async';
      photo.append(image);
      const caption = document.createElement('figcaption');
      caption.className = 'around-caption';
      caption.textContent = item.title;
      card.append(photo, caption);
      return card;
    }));
    gallery.scrollLeft = 0;
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    if (category === tab.dataset.aroundCategory) return;
    category = tab.dataset.aroundCategory;
    render();
  }));
  tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    category = tabs[next].dataset.aroundCategory;
    render();
    tabs[next].focus({ preventScroll: true });
  }));
  render();
})();
