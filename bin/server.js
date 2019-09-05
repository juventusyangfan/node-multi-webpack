#!/usr/bin/env node

'use strict';

global.Promise = require('bluebird');

const utils = require('../src/utils');
const https = require('https');
const fs = require('fs');


const args = utils.parseArg();
const config = global.config = require('../src/config')(args);

const app = require('../src/app')


var options = {
    key: fs.readFileSync('./bin/214970209450200.key'),  //ssl文件路径
    cert: fs.readFileSync('./bin/214970209450200.pem')  //ssl文件路径
};
https.createServer(options, app.callback()).listen(config.site.port, () => {
    console.log('starting at port ' + config.site.port)
});
