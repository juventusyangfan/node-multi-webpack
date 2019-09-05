require('cp');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
// import JSZip from 'jszip';
// import {saveAs} from 'file-saver/FileSaver';

const config = require('configModule');
const libs = require('libs');

$(() => {

    //发布招标
    var webPullKey = true;
    $(".export_btn").unbind().bind("click", function () {
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '确认发布后将不可更改，请仔细核对询价单信息！'],
            content: '确认发布后将不可更改，请仔细核对询价单信息！',
            callback: function () {
                if (webPullKey) {
                    $.ajaxForJson("/purchaser/inquiry/inquiryPublish", {
                        inquiry_id: $("input[name='inquiry_id']").val()
                    }, function(dataObj){
                        if (dataObj.code == "2000") {
                            $.msgTips({
                                type: "success",
                                content: "发布成功！",
                                callback: function () {
                                    location.href = "/purchaser/inquiry/index";
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                        webPullKey = true;
                    });
                }
                webPullKey = false;
                return false;
            }
        });
    });
});