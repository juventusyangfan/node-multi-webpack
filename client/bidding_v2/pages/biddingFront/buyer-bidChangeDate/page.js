require('cp');
require('elem');
require('../../../public-resource/css/componentOther.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');

$(() => {
    $("input[calendar]").each(function () {
        $(this).initCalendar({
            format: 'yyyy-MM-dd HH:mm',
            targetFormat: 'yyyy-MM-dd HH:mm'
        });
    });

    //保存
    $(".bid_change_save").unbind().bind("click", function () {
        var _data = $("#changeDate").serialize();
        $.ajaxForJson(config.wwwPath + "buyer/alter/timeAjax", _data, function (dataObj) {
            if (dataObj.code == 2000) {
                var dialogHTML = '<div class="dialog_tips_con"><i class="iconfont icon-gou ' + dataObj.data.type + '"></i><span>' + dataObj.data.msg + '</span></div>';
                $.dialog({
                    title: '保存成功！',
                    content: dialogHTML,
                    width: 600,
                    confirm: {
                        show: true,
                        allow: true,
                        name: "发布变更公告"
                    },
                    cancel: {
                        show: true,
                        name: "暂不发布"
                    },
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            window.location.href = dataObj.data.url;
                        });
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});