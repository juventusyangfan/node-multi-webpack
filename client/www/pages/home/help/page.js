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
        var hashArr = ['qs', 'reg', 'seller', 'buyer', 'video', 'wd'];
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
    $(".help-menu dd.singleMenu").unbind().bind("click", function () {
        var main = $(this);
        var dataId = null;
        if (main.attr("data-id") !== undefined) {
            dataId = main.attr("data-id"), _title = main.text();
            $(".help-menu-child li").removeClass("active");
            $(".help-menu dd").removeClass("act");
            $(".help-menu dd.multipleMenu").removeClass("open");
            main.addClass("act");
            $(".help-title,.help-detail").removeClass("display-block");
            $("#" + dataId).addClass("display-block");
            $("#" + dataId).next().addClass("display-block");
            $("#" + dataId).find("span").html(_title);
            window.history.replaceState({}, "帮助中心", window.location.origin + window.location.pathname + '?id=' + dataId);
        }
    });
    //展开子菜单
    $(".help-menu dd.multipleMenu").unbind().bind("click", function (e) {
        if (e.target.nodeName.toLowerCase() != "li") {
            if ($(this).hasClass("open")) {
                $(this).removeClass("open");
            } else {
                $(".help-menu dd.multipleMenu").removeClass("open");
                $(this).addClass("open")
            }
        }
    });
    //选择子菜单
    $(".help-menu-child li").unbind().bind("click", function () {
        var main = $(this),
            parentId = main.parents("dd.multipleMenu").attr("data-id");
        var dataId = null;
        if (main.attr("data-id") !== undefined) {
            dataId = main.attr("data-id"), _title = main.text();
            $(".help-menu dd.singleMenu").removeClass("act");
            $(".help-menu ul.help-menu-child").find("li").removeClass("active");
            main.addClass("active");
            $(".help-title,.help-detail").removeClass("display-block");
            $("#" + parentId).addClass("display-block");
            $("#" + dataId).addClass("display-block");
            $("#" + parentId).find("span").html(_title);
            window.history.replaceState({}, "帮助中心", window.location.origin + window.location.pathname + '?id=' + dataId);
        }
    });

    //视频播放
    $(".js_video").unbind().bind("click", function () {
        var src = $(this).attr("data-url");

        $(".video_box").html('<video id="video" style="object-fit: fill;width: 1200px;height: 680px;" controls><source src="' + src + '"></video>').css("top", $(document).scrollTop());
        $("body").append('<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>');
        $(".video_box").show();

        $(".cjy-bg").unbind().bind("click", function () {
            $(".cjy-bg").remove();
            $(".video_box video").remove();
            $(".video_box").hide();
        });
    });

    //初始化展开内容
    var menuId = $(".warp").attr("menu-id");
    if (menuId != "") {
        if ($(".help-menu dd.singleMenu[data-id='" + menuId + "']").length > 0) {
            $(".help-menu dd.singleMenu[data-id='" + menuId + "']").trigger("click");
        } else if ($(".help-menu-child li[data-id='" + menuId + "']").length > 0) {
            $(".help-menu dd.multipleMenu").removeClass("open");
            $(".help-menu-child li[data-id='" + menuId + "']").parents("dd.multipleMenu").addClass("open");
            $(".help-menu-child li[data-id='" + menuId + "']").trigger("click");
        }
    }
});