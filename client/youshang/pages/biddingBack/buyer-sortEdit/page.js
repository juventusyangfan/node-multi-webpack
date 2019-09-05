require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require("libs");


$(() => {
    //选中类别
    $(".back_main_block").find("input[type='checkbox']").unbind().bind("change", function () {
        if ($(this).prop("checked")) {
            $(this).parents(".back_main_block").find(".back_info_select").show();
        } else {
            $(this).parents(".back_main_block").find(".back_info_select").hide();
        }
    });

    //确认提交
    $(".btn_confirm").unbind().bind("click", function () {
        var _idArr = [],
            _levelArr = [],
            ajaxKey = true;
        $("input[type='checkbox']:checked").each(function (n) {
            var _level = $("input[type='checkbox']:checked").eq(n).parents(".back_main_block").find(".back_info_select").length > 0 ? $("input[type='checkbox']:checked").eq(n).parents(".back_main_block").find("select").val() : $("input[type='checkbox']:checked").eq(n).parents(".back_main_block").find("input[name='supplier_level']").val();
            if (_level == "") {
                ajaxKey = false;
            }
            _idArr.push($("input[type='checkbox']:checked").eq(n).val());
            _levelArr.push(_level);
        });
        if (ajaxKey) {
            $.ajaxForJson(config.youshangPath + 'purchaser/index/editSupplierTypePost', {
                youshang_type_id: _idArr,
                supplier_level: _levelArr,
                id: $("input[name='id']").val(),
                circle_id: $("input[name='circle_id']").val()
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg,
                        callback: function () {
                            window.location.href = "/purchaser/index/supplierTypeList"
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: obj.msg
                    });
                }
            });
        } else {
            $.msgTips({
                type: "warning",
                content: "请选择供应商等级！"
            });
        }

        return false;
    });
});