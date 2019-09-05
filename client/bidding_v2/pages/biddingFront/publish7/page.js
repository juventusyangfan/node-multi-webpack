require('cp');
require('elem');
require('../../../public-resource/css/componentPublish.css');
require('../../../public-resource/css/list.css');
require('./page.css');
const config = require('configModule');

$(() => {
    //展示收起更多时间项
    $(".js_showMore").unbind().bind("click", function () {
        if ($(this).hasClass("open")) {
            $(".date_show").removeClass("date_open");
            $(this).removeClass("open");
            $(this).find("span").html("展开设置更多时间项");
        } else {
            $(this).addClass("open");
            $(".date_show").addClass("date_open");
            $(this).find("span").html("收起时间项");
        }
        return false;
    });

    $("input[calendar]").each(function () {
        $(this).initCalendar({
            format: 'yyyy-MM-dd HH:mm',
            targetFormat: 'yyyy-MM-dd HH:mm'
        });
    });

    //发布下一步
    $(".btn_next,.btn_back").unbind().bind("click", function () {
        var _data = $("form[name='stepForm']").serialize();
        if ($(this).hasClass("btn_back")) {
            _data += '&entire=1';
        }
        $.ajaxForJson(config.wwwPath + "buyer/tender/addajax", _data, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: "成功",
                    callback: function () {
                        window.location.href = dataObj.data.url;
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
    //保存为草稿
    $(".btn_draft").unbind().bind("click", function () {
        $("input[name='draft']").val(1);
        $(".btn_next").trigger("click");
        return false;
    });
});