require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    //发布项目
    var ajaxKey = true;
    $(".btn_confirm").unbind().bind("click", function () {
        if ($.trim($("textarea[name='content']").val()).length > $("textarea[name='content']").attr("maxlen")) {
            $.msgTips({
                type: "warning",
                content: "项目简介最多输入1000字"
            });
            return false;
        }

        if (ajaxKey) {
            var reqUrl = config.wwwPath + "/ajaxEditItem ",
                reqData = $("form").serialize();
            if ($("input[name='id']").length > 0 && $("input[name='id']").val()) {
                reqData = reqData + "&id=" + $("input[name='id']").val();
            }
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg
                    });
                    setTimeout(function () {
                        window.location.href = config.wwwPath + "/item/details.html?id=" + dataObj.data;
                    }, 1000);
                }
                else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    ajaxKey = true;
                }
            });
        }
        ajaxKey = false;
        return false;
    });
});