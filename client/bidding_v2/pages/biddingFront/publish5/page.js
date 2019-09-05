require('cp');
require('elem');
require('../../../public-resource/css/componentPublish.css');
require('../../../public-resource/css/list.css');
require('./page.css');
const config = require('configModule');

$(() => {
    //费用输入数字
    $("input[name='bzjMoney']").unbind().bind("input", function () {
        libs.lenNumber(this, 2);
    });

    //发布下一步
    $(".btn_next").unbind().bind("click", function () {
        if ($(this).attr("type") == "no") {
            var _href = $(this).attr("href");
            window.location.href = _href;
        } else {
            var _data = null;
            var _payType = $("input[name='payType']:checked").length > 1 ? "3" : $("input[name='payType']:checked").val();

            if ($(".material_list").length > 0) {
                var _arr = [];
                $(".material_list table").find("tr").each(function () {
                    var main = $(this);
                    var _obj = {
                        pId: main.find("input[name='pId']").val(),
                        bzjMoney: main.find("input[name='bzjMoney']").val(),
                        remarks: main.find("textarea[name='remarks']").val()
                    }
                    _arr.push(_obj);
                });
                _data = {
                    tId: $("input[name='tId']").val(),
                    cType: $("input[name='cType']").val(),
                    step: $("input[name='step']").val(),
                    draft: $("input[name='draft']").val(),
                    edit: $("input[name='edit']").val(),
                    package: _arr,
                    payType: _payType,
                    khBank: $("input[name='khBank']").val(),
                    yhAccount: $("input[name='yhAccount']").val()
                }
            } else {
                _data = {
                    tId: $("input[name='tId']").val(),
                    cType: $("input[name='cType']").val(),
                    step: $("input[name='step']").val(),
                    draft: $("input[name='draft']").val(),
                    edit: $("input[name='edit']").val(),
                    pId: $("input[name='pId']").val(),
                    bzjMoney: $("input[name='bzjMoney']").val(),
                    remarks: $("textarea[name='remarks']").val(),
                    payType: _payType,
                    khBank: $("input[name='khBank']").val(),
                    yhAccount: $("input[name='yhAccount']").val()
                }
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