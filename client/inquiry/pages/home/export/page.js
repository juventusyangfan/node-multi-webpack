require('cp');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
// import JSZip from 'jszip';
// import {saveAs} from 'file-saver/FileSaver';

const config = require('configModule');
const libs = require('libs');

$(() => {

    //导出pdf
    var webPullKey = true;
    $(".export_btn").unbind().bind("click", function () {
        var main = this;
        if (webPullKey) {
            $.ajaxForJson("/printRecord", {
                inquiry_id: $(".exportCon").attr("inquiry_id")
            }, null);
            var pull = new libs.webPull({
                channel: $("input[name='channel']").val(),
                signUrl: $("input[name='sign_url']").val(),
                subUrl: $("input[name='sub_url']").val(),
                callback: function (content, type) {
                    try {
                        content = eval('(' + content + ')');
                    } catch (ex) {
                        content = content;
                    }
                    $(main).html("导出中" + content.pro + "...");
                    if (content.pro == "100%") {
                        window.location.href = content.name;
                        webPullKey = true;
                        $(main).html("导出完成");
                    }
                }
            });
        }
        $(main).html("导出中0%...");
        webPullKey = false;
    });
});