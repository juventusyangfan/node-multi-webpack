const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const noPic = require('../../../public-resource/imgs/noPic.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {noPic});

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));