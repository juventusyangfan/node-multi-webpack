const config = require('configModule');
const header = require('../../../public-resource/components/header/html.ejs');
const footer = require('../../../public-resource/components/footer/html.ejs');
const content = require('./content.ejs');

module.exports = content({
    header: header(Object.assign({}, config, {
        pageTitle: '生材网'
    })),
    footer: footer(Object.assign({}, config))
})

