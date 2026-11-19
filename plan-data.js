// Demo fixtures only. Replace geometry, records and status together with client material.
window.planData = {
  quarters: [
    { id:'nk', name:'尼科洛科尔马', description:'尼科洛科尔马村的个人住宅建设用地，全年可通行。根据项目资料，面积为9–20公亩。请确认所选地块相对于学校、商店和邻近住宅的位置。', price:'45 000 卢布起/100平方米', bounds:[40,100,270,310] },
    { id:'dg', name:'杰格佳里齐', description:'住宅旁的个人住宅建设用地，靠近松林和伏尔加河。项目网站标注的面积为11–25公亩。', price:'70 000 卢布起/100平方米', bounds:[630,100,230,310] },
    { id:'ct', name:'中央部分', description:'“维索科沃松林”营地附近面积为6.5–19.5公亩的地块连接杰格佳里齐和尼科洛科尔马。根据该片区页面的信息，距沥青道路30米；地块平整，已为建设做好准备。所选地块的状况及所需准备工作在查看时确认。', price:'价格待确认', bounds:[335,100,270,310] }
  ],
  plots: [
    {id:'ДЕМО-01',quarter:'nk',area:10,status:'free',pricePerSotka:null,total:null,rect:[70,175,90,85]},
    {id:'ДЕМО-02',quarter:'nk',area:12,status:'free',pricePerSotka:null,total:null,rect:[185,175,90,85]},
    {id:'ДЕМО-03',quarter:'nk',area:14,status:'sold',pricePerSotka:null,total:null,rect:[70,285,205,80]},
    {id:'ДЕМО-04',quarter:'dg',area:15,status:'free',pricePerSotka:null,total:null,rect:[660,175,170,85]},
    {id:'ДЕМО-05',quarter:'dg',area:11,status:'sold',pricePerSotka:null,total:null,rect:[660,285,170,80]},
    {id:'ДЕМО-06',quarter:'ct',area:16,status:'sold',pricePerSotka:null,total:null,rect:[365,175,205,190]}
  ]
};
