/**
 * Created by yangfan on 2017/7/5.
 */
const buildFileConfig = require('configDir/build-file.config');
const moduleExports = {
    DIRS: {
        BUILD_FILE: buildFileConfig
    },

    PAGE_ROOT_PATH: '../../'
};

/* 帮助确定ie下CORS的代理文件 */
moduleExports.DIRS.SERVER_API_URL = moduleExports.SERVER_API_URL;

/* global IS_PRODUCTION:true */
if (IS_PRODUCTION) {
    moduleExports.domainStr = 'materialw.com';
    moduleExports.wwwPath = 'https://dev.materialw.com/';
    moduleExports.accountPath = 'https://account.dev.materialw.com/';
    moduleExports.papiPath = 'https://api.dev.materialw.com/';
    moduleExports.filePath = 'https://file.dev.materialw.com/';
    moduleExports.staticPath = 'https://static.dev.materialw.com/';
    moduleExports.videoPath = 'https://video.dev.materialw.com/';
    moduleExports.jcPath = 'https://jc.dev.materialw.com/';
    moduleExports.upload = 'https://upload.dev.materialw.com/';
} else {
    moduleExports.domainStr = 'materialw.com';
    moduleExports.wwwPath = 'https://dev.materialw.com/';
    moduleExports.accountPath = 'https://account.dev.materialw.com/';
    moduleExports.papiPath = 'https://api.dev.materialw.com/';
    moduleExports.filePath = 'https://file.dev.materialw.com/';
    moduleExports.staticPath = 'https://static.dev.materialw.com/';
    moduleExports.videoPath = 'https://video.dev.materialw.com/';
    moduleExports.jcPath = 'https://jc.dev.materialw.com/';
    moduleExports.upload = 'https://upload.dev.materialw.com/';
}

module.exports = moduleExports;