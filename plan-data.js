// Demo fixtures only. Replace geometry, records and status together with client material.
window.planData = {
  quarters: [
    { id:'nk', name:'尼科洛科尔马', description:'尼科洛科尔马村的独栋住宅建设用地，全年可通车。项目资料标注面积为900–2000平方米。所选地块与学校、商店和邻居住宅的位置关系请另行确认。', price:'45 000 卢布起/100平方米', bounds:[40,100,270,310] },
    { id:'dg', name:'杰格佳里齐', description:'住宅旁的独栋住宅建设用地，邻近松林与伏尔加河。项目网站标注面积为1100–2500平方米。', price:'70 000 卢布起/100平方米', bounds:[630,100,230,310] },
    { id:'ct', name:'中央区', description:'“维索科沃松林”营地附近面积为650–1950平方米的地块，连接杰格佳里齐与尼科洛科尔马。根据该片区页面，距沥青公路30米；地块平整，已做好建设准备。所选地块的实际状况及所需准备工作在实地查看时确认。', price:'价格待确认', bounds:[335,100,270,310] }
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
