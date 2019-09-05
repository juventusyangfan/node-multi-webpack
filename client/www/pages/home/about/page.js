/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('./page.css');
const config = require('configModule');

$(() => {
    //视频播放
    $(".js_video").unbind().bind("click", function () {
        var src = $(this).attr("data-url");

        $(".video_box").html('<video id="video" style="object-fit: fill;width: 1200px;height: 680px;" controls><source src="' + src + '"></video>').css("top",$(document).scrollTop());
        $("body").append('<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>');
        $(".video_box").show();

        $(".cjy-bg").unbind().bind("click", function () {
            $(".cjy-bg").remove();
            $(".video_box video").remove();
            $(".video_box").hide();
        });
    });
});