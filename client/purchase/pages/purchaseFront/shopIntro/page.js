require('cp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    // 计算主营产品的高度
    $(".pro_dl dt").css("height", $(".w838").height() + 'px');

    // 认证资料
    var record_width = 0;
    $(".cert_wall").css("width", $(".cert_item").length *258 + 'px');
    //左右滑动
    $(".cert_right").unbind().bind("click", function () {
        if ($(".cert_wall").is(":animated")) {
            return false;
        }
        if ($(".cert_wall").position().left > 1030 - $(".cert_wall").width()) {
            var left = $(".cert_wall").position().left - 1030;
            $(".cert_wall").animate({ "left": left + "px" }, 300);
        }
        else{
            $.msgTips({
                type: "warning",
                content: "已是最后一页"
            });
        }
        return false;
    });
    $(".cert_left").unbind().bind("click", function () {
        if ($(".cert_wall").is(":animated")) {
            return false;
        }
        if($(".cert_wall").position().left<0){
            var left = $(".cert_wall").position().left + 1030;
            $(".cert_wall").animate({ "left": left + "px" }, 300);
        }
        else{
            $.msgTips({
                type: "warning",
                content: "已是第一页"
            });
        }
        return false;
    });
});