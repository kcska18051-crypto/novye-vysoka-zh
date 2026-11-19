(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.NOVYE_VYSOKA_MAP_DATA = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const unknown = '请咨询';
  const quarters = [
    { id: 'quarter-1', name: '片区 1', category: 'quarters', x: 33, y: 28, image: 'assets/quarters/quarter-1.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: '总平面图的北部。打开图纸查看地块位置。' },
    { id: 'quarter-2', name: '片区 2', category: 'quarters', x: 30, y: 51, image: 'assets/quarters/quarter-2.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: '总平面图的西部。打开图纸查看地块位置。' },
    { id: 'quarter-3', name: '片区 3', category: 'quarters', x: 51, y: 66, image: 'assets/quarters/quarter-3.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: '中央道路沿线的地块。请向项目团队咨询最新可售情况。' },
    { id: 'quarter-4', name: '片区 4', category: 'quarters', x: 76, y: 72, image: 'assets/quarters/quarter-4.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: '总平面图的东部。打开图纸查看地块位置。' },
    { id: 'quarter-5', name: '片区 5', category: 'quarters', x: 83, y: 88, image: 'assets/quarters/quarter-5.webp', pricePerSotka: unknown, free: unknown, reserved: unknown, sold: unknown, distances: [], description: '总平面图的东南部。请向项目团队咨询最新可售情况。' }
  ];

  const objects = [
    { id: 'forest', name: '维索科沃松林', category: 'nature', x: 43, y: 43, image: 'assets/forest-path.webp', description: '项目旁的松林，适合散步、采蘑菇和享受宁静周末。', facts: ['松林', '散步路线'] },
    { id: 'beach', name: '沙滩', category: 'nature', x: 8, y: 31, image: 'assets/quiet-beach.webp', description: '宽阔水域旁的沙岸，适合散步与夏日休闲。', facts: ['伏尔加河岸', '具体位置待确认'] },
    { id: 'pier', name: '码头', category: 'infrastructure', x: 9, y: 46, image: 'assets/forest-v2/pier-client.webp', description: '项目概念规划中设有水边停船及伏尔加河游览地点。', facts: ['项目概念规划', '位置尚待确认'] },
    { id: 'restaurant', name: '餐厅', category: 'infrastructure', x: 62, y: 23, image: 'assets/map-objects/restaurant.webp', imageFallback: 'assets/terrace-family.webp', description: '未来亲近自然、与家人用餐聚会场所的概念图。', facts: ['未来设施的效果图'] },
    { id: 'camp', name: '“维索科沃松林”儿童营地', category: 'infrastructure', x: 25, y: 37, image: 'assets/forest-water.webp', description: '伏尔加河岸松林中的儿童度假营地。', facts: ['杰格佳里齐村101号'] },
    { id: 'school', name: '尼科洛科尔马教育中心', category: 'infrastructure', x: 91, y: 76, imageFallback: 'assets/territory-panorama.jpg', description: '以 G. A. 特罗伊茨基命名的教育园区。', facts: ['尼科利斯科耶村和平街18号'] },
    { id: 'shop-five', name: 'Pyaterochka', category: 'infrastructure', x: 94, y: 67, imageFallback: 'assets/territory-panorama.jpg', description: '项目附近的食品商店。', facts: ['尼科洛科尔马村光明街22号'] },
    { id: 'shop-ryzhik', name: 'Ryzhik', category: 'infrastructure', x: 92, y: 83, imageFallback: 'assets/territory-panorama.jpg', description: '尼科利斯科耶村的食品商店。', facts: ['尼科利斯科耶村中央街42号'] },
    { id: 'church-nicholas', name: '圣尼古拉教堂', category: 'infrastructure', x: 88, y: 79, imageFallback: 'assets/territory-panorama.jpg', description: '尼科洛科尔马的圣尼古拉教堂。', facts: ['尼科洛科尔马'] },
    { id: 'church-presentation', name: '圣母入堂教堂', category: 'infrastructure', x: 86, y: 74, imageFallback: 'assets/territory-panorama.jpg', description: '项目附近的圣母入堂教堂。', facts: ['具体位置见地图'] },
    { id: 'bus-stop', name: '“杰格佳里齐”公交站', category: 'transport', x: 56, y: 17, imageFallback: 'assets/route-map.png', description: '78N-0704公路上的公交站。', facts: ['190路公交车', '前往雷宾斯克的路线'], mapUrl: 'https://yandex.ru/maps/?ll=38.516917%2C57.911129&z=16.61' }
  ];

  return Object.freeze({
    categories: Object.freeze([
      { id: 'all', label: '全部' },
      { id: 'quarters', label: '片区' },
      { id: 'nature', label: '自然' },
      { id: 'infrastructure', label: '配套设施' },
      { id: 'transport', label: '交通' }
    ]),
    quarters: Object.freeze(quarters),
    objects: Object.freeze(objects)
  });
});
