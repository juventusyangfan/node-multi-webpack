const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});


module.exports = layout.init({
    pageTitle: '产品服务',
    topItems: [{
        name: "首页",
        act: false
    }, {
        name: "产品服务",
        act: true
    }, {
        name: "服务商",
        act: false
    }]
}).run(content(renderData));