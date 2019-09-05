require('cssDir/componentBack.css');
const config = require('configModule');
$(()=> {
    //进入商城后台判断是否是vip
    $("#is-frame").unbind().bind("click", function () {
        $.msgTips({
            type: "warning",
            content: "贵公司还不是直采商城会员，请先申请会员后才能开通店铺哦~"
        });
        setTimeout(function () {
            window.location.href = config.wwwPath + "help/vip.html";
        }, 1000);
        return false;
    });
});