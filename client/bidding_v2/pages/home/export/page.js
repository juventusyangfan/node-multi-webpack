require('cp');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');

$(() => {
    $("#uploadBtn").uppyUpload("#uploadBtn", function (name, url) {
        $("#uploadBtn").before(' <p class="fujian_con"><i class="iconfont icon-fujian"></i>' + name + '<a href="javascript:;" class="marginL10 textBlue js_download">下载</a><a href="javascript:;" class="marginL10 js_del">删除</a></p>');
    }, {
        processCon: "#process-files",
        btnStr: "上传开标记录表"
    });
    //删除附件
    $(".export_body").on("click", ".js_del", function () {
        $(this).parents(".fujian_con").remove();
        return false;
    });

    //展开收起
    $(".export_showMore").unbind().bind("click", function () {
        var _title = $(this).parents(".export_body_title"),
            _id = _title.attr("id");
        if (_title.hasClass("close")) {
            _title.removeClass("close");
            $(this).find("span").html("收起");
            $("[data-id='" + _id + "']").removeClass("closeCon");
        } else {
            _title.addClass("close");
            $(this).find("span").html("展开");
            $("[data-id='" + _id + "']").addClass("closeCon");
        }
        return false;
    });

    //锚点联动
    initScroll();

    function initScroll() {
        var anchorHTML = '';
        for (var i = 0; i < $(".export_head").length; i++) {
            var _body = $(".export_head").eq(i).next(".export_body"),
                _dispaly = i > 0 ? "display: none;" : "";

            anchorHTML += '<div class="export_anchor_cell">';
            anchorHTML += '<div class="export_anchor_title"><i class="anchor_circle_big"></i>' + $(".export_head").eq(i).text() + '</div>';
            anchorHTML += '<ul class="export_anchor_con" style="' + _dispaly + '">';
            for (var j = 0; j < _body.find(".export_body_title").length; j++) {
                var _act = i == 0 && j == 0 ? "active" : "";
                anchorHTML += '<li class="' + _act + '" data-href="' + _body.find(".export_body_title").eq(j).attr("id") + '"><i class="anchor_circle_small"></i>' + _body.find(".export_body_title > span").eq(j).html() + '</li>';
            }
            anchorHTML += '</ul>';
            anchorHTML += '</div>';
        }
        $(".export_anchor_warp").html(anchorHTML);

        //点击导航分类
        $(".export_anchor_title").unbind().bind("click", function () {
            $(".export_anchor_title").parent().find(".export_anchor_con").hide();
            $(this).parent().find(".export_anchor_con").show();
        });
        //点击导航条后滑动到相应的位置
        $(".export_anchor_warp").on("click", ".export_anchor_con li", function () {
            var barclass = $(this).attr('data-href');
            var top = $("#" + barclass).offset().top;

            $("#" + barclass).removeClass("close");
            $("div[data-id='" + barclass + "']").removeClass("closeCon");
            $("html,body").animate({
                scrollTop: top
            }, 500, function () {

            });
        });
        window.onscroll = scrollEvent
    };
    //滚动监听
    function scrollEvent() {
        var targetTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            targetTop = document.documentElement.scrollTop + 1;
        } else if (document.body) {
            targetTop = document.body.scrollTop + 1;
        }

        for (var i = 0; i < $(".export_body").length; i++) {
            var _body = $(".export_body").eq(i);
            for (var j = 0; j < _body.find(".export_body_title").length; j++) {
                var _id = _body.find(".export_body_title").eq(j).attr("id"),
                    _top = _body.find(".export_body_title").eq(j).offset().top;
                if (i >= $(".export_body").length - 1 && j >= _body.find(".export_body_title").length - 1) {//是否为最后一个节点
                    if (targetTop >= _top) {
                        $(".export_anchor_warp").find("li.active").removeClass("active");
                        $(".export_anchor_warp").find("li[data-href='" + _id + "']").addClass("active");
                        return false;
                    }
                } else {
                    var _topNext = 0;
                    if (j < _body.find(".export_body_title").length - 1) {
                        _topNext = _body.find(".export_body_title").eq(j + 1).offset().top;//正常下一个兄弟节点top
                    } else {
                        _topNext = $(".export_body").eq(i + 1).find(".export_body_title").eq(0).offset().top;//第一层到最后一个，取下一层第一个top
                    }
                    if (targetTop >= _top && targetTop < _topNext) {
                        $(".export_anchor_warp").find("ul.export_anchor_con").hide();
                        $(".export_anchor_warp").find("ul.export_anchor_con").eq(i).show();
                        $(".export_anchor_warp").find("li.active").removeClass("active");
                        $(".export_anchor_warp").find("li[data-href='" + _id + "']").addClass("active");
                        return false;
                    }
                }
            }
        }
    };
});