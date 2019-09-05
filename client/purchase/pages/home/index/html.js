const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const kefuApp = require('./../../../public-resource/imgs/logo/qrcode_app.jpg');
const listDemo = require('./imgs/list_demo.png');
const banner1 = require('./imgs/banner01.jpg');
const floor01 = require('./imgs/floor_bg01.png');
const floor02 = require('./imgs/floor_bg02.png');
const floor03 = require('./imgs/floor_bg03.png');
const floor04 = require('./imgs/floor_bg04.png');
const floor05 = require('./imgs/floor_bg05.png');
const f1_cell01 = require('./imgs/floor1/cell01.png');
const f1_cell02 = require('./imgs/floor1/cell02.png');
const f1_cell03 = require('./imgs/floor1/cell03.png');
const f1_cell04 = require('./imgs/floor1/cell04.png');
const f1_cell05 = require('./imgs/floor1/cell05.png');
const f1_cell06 = require('./imgs/floor1/cell06.png');
const f1_cell07 = require('./imgs/floor1/cell07.png');
const f2_cell01 = require('./imgs/floor2/cell01.png');
const f2_cell02 = require('./imgs/floor2/cell02.png');
const f2_cell03 = require('./imgs/floor2/cell03.png');
const f2_cell04 = require('./imgs/floor2/cell04.png');
const f2_cell05 = require('./imgs/floor2/cell05.png');
const f2_cell06 = require('./imgs/floor2/cell06.png');
const f2_cell07 = require('./imgs/floor2/cell07.png');
const f3_cell01 = require('./imgs/floor3/cell01.png');
const f3_cell02 = require('./imgs/floor3/cell02.png');
const f3_cell03 = require('./imgs/floor3/cell03.png');
const f3_cell04 = require('./imgs/floor3/cell04.png');
const f3_cell05 = require('./imgs/floor3/cell05.png');
const f3_cell06 = require('./imgs/floor3/cell06.png');
const f3_cell07 = require('./imgs/floor3/cell07.png');
const f4_cell01 = require('./imgs/floor4/cell01.png');
const f4_cell02 = require('./imgs/floor4/cell02.png');
const f4_cell03 = require('./imgs/floor4/cell03.png');
const f4_cell04 = require('./imgs/floor4/cell04.png');
const f4_cell05 = require('./imgs/floor4/cell05.png');
const f4_cell06 = require('./imgs/floor4/cell06.png');
const f4_cell07 = require('./imgs/floor4/cell07.png');
const f5_cell01 = require('./imgs/floor5/cell01.png');
const f5_cell02 = require('./imgs/floor5/cell02.png');
const f5_cell03 = require('./imgs/floor5/cell03.png');
const f5_cell04 = require('./imgs/floor5/cell04.png');
const f5_cell05 = require('./imgs/floor5/cell05.png');
const f5_cell06 = require('./imgs/floor5/cell06.png');
const f5_cell07 = require('./imgs/floor5/cell07.png');
const noCart = require('./imgs/noCart.png');
const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {kefuApp,listDemo,banner1,floor01,floor02,floor03,floor04,floor05,f1_cell01,f1_cell02,f1_cell03,f1_cell04,f1_cell05,f1_cell06,f1_cell07,f2_cell01,f2_cell02,f2_cell03,f2_cell04,f2_cell05,f2_cell06,f2_cell07,f3_cell01,f3_cell02,f3_cell03,f3_cell04,f3_cell05,f3_cell06,f3_cell07,f4_cell01,f4_cell02,f4_cell03,f4_cell04,f4_cell05,f4_cell06,f4_cell07,f5_cell01,f5_cell02,f5_cell03,f5_cell04,f5_cell05,f5_cell06,f5_cell07,noCart});

module.exports = layout.init({
    pageTitle: '直采商城'
}).run(content(renderData));