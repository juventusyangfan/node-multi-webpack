/**
 * Created by yangfan on 2017/7/4.
 */
var path = require('path');
var dirVars = require('../base/dir-vars.config.js');

module.exports = {
    rules: [
        {
            test: /\.js$/,
            // include: dirVars.srcRootDir,
            include: [
                dirVars.srcRootDir,
                path.resolve(__dirname, '../../node_modules/browser-md5-file')//文件MD5，该模块使用了Class,需用babel转换以供低版本使用
            ],
            loader: 'babel-loader',
            options: {
                presets: [['es2015', {loose: true}]],
                cacheDirectory: true,
                plugins: ['transform-runtime', 'transform-remove-strict-mode']
            }
        },
        {
            test: /\.html$/,
            include: dirVars.srcRootDir,
            loader: 'html-loader'
        },
        {
            test: /\.ejs$/,
            include: dirVars.srcRootDir,
            loader: 'ejs-loader'
        },
        {
            test: /\.ts/,
            include: dirVars.srcRootDir,
            loader: 'ts-loader'
        },
        {
            test: /\.(woff|svg|eot|ttf)$/,
            include: dirVars.srcRootDir,
            loader: 'file-loader',
            options: {
                name: 'static/font/[name].[ext]'
            }
        },
        {
            // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            // 如下配置，将小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            include: dirVars.srcRootDir,
            loader: 'url-loader',
            options: {
                limit: 2048,
                name: 'static/img/[hash].[ext]'
            }
        }
    ]
};