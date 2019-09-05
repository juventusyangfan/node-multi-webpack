require('cp');
require('elem');
require('../../../public-resource/css/componentPublish.css');
require('../../../public-resource/css/list.css');
require('./page.css');
const config = require('configModule');

$(() => {
    //选择开标方式
    $("input[name='kbType']").unbind().bind("change", function () {
        if ($(this).val() == "1") {
            $(".js_blockShow").show();
        } else {
            $(".js_blockShow").hide();
        }
    });

    //发布下一步
    $(".btn_next").unbind().bind("click", function () {
        if ($(this).attr("type") == "no") {
            var _href = $(this).attr("href");
            window.location.href = _href;
        } else {
            var _data = {
                tId: $("input[name='tId']").val(),
                cType: $("input[name='cType']").val(),
                step: $("input[name='step']").val(),
                draft: $("input[name='draft']").val(),
                edit: $("input[name='edit']").val(),
                kbType: $("input[name='kbType']:checked").val()
            };
            var _zsObj = {},
                _kbObj = {};
            if ($("select[name='zsOpenUser']").length > 0) {
                _zsObj = {
                    zsOpenUser: $("select[name='zsOpenUser']").val()
                }
            }
            if ($("input[name='kbType']:checked").val() == "1") {
                _kbObj = {
                    cbType: $("input[name='cbType']:checked").val(),
                    kbUser: $("select[name='kbUser']").val()
                }
            }

            _data = $.extend(_data, _zsObj);
            _data = $.extend(_data, _kbObj);
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
        }
        return false;
    });
    //保存为草稿
    $(".btn_draft").unbind().bind("click", function () {
        $("input[name='draft']").val(1);
        $(".btn_next").trigger("click");
        return false;
    });
});