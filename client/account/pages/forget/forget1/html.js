const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});

module.exports = layout.init({
    pageTitle: '生材网',
    topItems: [{
        name: "忘记密码",
        act: true
    }],
    showLogin: "false"
}).run(content(renderData));