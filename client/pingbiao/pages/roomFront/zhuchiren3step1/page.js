/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //选择评标方法
    $(".summary_type").find(".summary_cell").unbind().bind("click", function () {
        $(".summary_type").find(".summary_cell").removeClass("selected");
        $(this).addClass("selected");
        return false;
    });

    //下一步提交
    $(".summary_btn_next").unbind().bind("click", function () {
        var _method = $(".summary_type").find(".selected").attr("computing_method");
        $.ajaxForJson(config.pingbiaoPath + "CollectTender/computingMethodAjax", {
            computing_method: _method,
            tender_id: $("input[name='tender_id']").val()
        }, function (jsonObj) {
            if (jsonObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: jsonObj.msg,
                    callback: function () {
                        window.location.href = jsonObj.data;
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: jsonObj.msg
                });
            }
        });
        return false;
    });
});