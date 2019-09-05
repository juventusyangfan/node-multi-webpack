require('cp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    $(".vip_apply").unbind().bind("click", function () {
        var main = $(this);
        $.ajaxForJson('/applyMember', null, function (dataObj) {
            if (dataObj.code == 2000) {
                main.removeClass("vip_apply").addClass("vip_none").html("已申请VIP");
                $.msgTips({
                    type: "success",
                    content: dataObj.msg
                });
            }
            else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});