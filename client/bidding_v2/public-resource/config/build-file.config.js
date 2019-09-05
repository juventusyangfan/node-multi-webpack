/**
 * Created by yangfan on 2017/7/5.
 */
require('!!file-loader?name=index.html!../../index.html');

module.exports={
    js: {
        jquery: require('!!file-loader?name=static/js/[name].[ext]!jquery/dist/jquery.min.js')
    }
};