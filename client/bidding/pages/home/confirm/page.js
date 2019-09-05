require('cp');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
// import JSZip from 'jszip';
// import {saveAs} from 'file-saver/FileSaver';

const config = require('configModule');
const libs = require('libs');

$(() => {
    //提交确认
    $(".export_btn").unbind().bind("click", function () {
        $.ajaxForJson("/ajaxDoTenderDoc", {
            tenderId: $("input[name='tenderId']").val(),
            linkman: $("input[name='linkman']").val(),
            linkManTel: $("input[name='linkManTel']").val(),
            day: $("input[name='day']").val(),
            address: $("input[name='address']").val()
        }, function (json) {
            if (json.code === 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        window.location.href = "/tender/lists.html";
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
        return false;
    });
});