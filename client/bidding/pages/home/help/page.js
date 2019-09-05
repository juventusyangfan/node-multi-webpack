/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

$(() => {
    var checkHashFuc = function () {
        var hashArr = ['qs','reg','seller','buyer','video','wd'];
        if (location.hash !== "") {
            var idStr = location.hash.substr(1);
            for (let index = 0; index < hashArr.length; index++) {
                if (idStr === hashArr[index]) {
                    $(".help-menu dd").removeClass("act");
                    $('.help-menu dd[data-id=' + idStr + ']').addClass("act");
                    $(".help-title,.help-detail").removeClass("display-block");
                    $("#" + idStr).addClass("display-block");
                    $("#" + idStr).next().addClass("display-block");
                    break;
                }
            }
        }
    };
    checkHashFuc();
    
    //选择菜单
    $(".help-menu dd").unbind().bind("click", function () {
        var main = $(this);
        var dataId = null;
        if (main.attr("data-id") !== undefined) {
            dataId = main.attr("data-id");
            $(".help-menu dd").removeClass("act");
            main.addClass("act");
            $(".help-title,.help-detail").removeClass("display-block");
            $("#" + dataId).addClass("display-block");
            $("#" + dataId).next().addClass("display-block");
        }
    });

    //视频播放
    $(".js_video").unbind().bind("click", function () {
        var src = config.videoPath + $(this).attr("data-url");

        $(".video_box").html('<video id="video" style="object-fit: fill;width: 1200px;height: 680px;" controls><source src="' + src + '"></video>');
        $("body").append('<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>');
        $(".video_box").show();

        $(".cjy-bg").unbind().bind("click", function () {
            $(".cjy-bg").remove();
            $(".video_box video").remove();
            $(".video_box").hide();
        });
    });
});