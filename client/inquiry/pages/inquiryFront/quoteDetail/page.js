require('cp');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 展开基本信息
    $(".showMore").unbind().bind("click", function () {
        if ($(this).hasClass("showMore_up")) {
            $(".quote_base_con").css("max-height", "0");
            $(this).removeClass("showMore_up");
            $(this).find("span").html("展开更多基本信息");
        } else {
            $(".quote_base_con").css("max-height", "1000px");
            $(this).addClass("showMore_up");
            $(this).find("span").html("收起基本信息");
        }
        return false;
    });

    //查看大图
    $(".quote_base_con img").unbind().bind("click", function () {
        var url = $(this).attr("src");
        $.showPhoto(url);
    });
});