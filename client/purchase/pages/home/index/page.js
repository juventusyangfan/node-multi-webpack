/**
 * Created by yangfan on 2017/7/6.
 */
require('elem');
require('cp');
require('./page.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    //banner轮播
    $(".js_slides").initPicPlayer();

    // 最新动态滚动效果
    var btns = $(".hotnews_btn").find(".hotnews_point"),
        playID = null, selectedIndex = 0;
    setTimeout(function () {
        listScroll(1);
    }, 5000);
    function listScroll(index) {

        clearInterval(playID);
        if ($(".hotnews_warp").is(":animated")) {
            return;
        }
        if (selectedIndex <= index) {
            selectedIndex = index;
            $(".hotnews_warp").animate({ left: "-217px" }, 500, function () {
                var firstItem = $(".hotnews_warp").find("ul.hotnews_list").eq(0);
                $(".hotnews_warp").append(firstItem.outer());
                firstItem.remove();
                $(".hotnews_warp").css("left", "0");
                //自动播放方法
                playID = setTimeout(function () {
                    if (btns.length == 1) { //如果只有一张图片 则不滚动。
                        return;
                    }
                    var index = selectedIndex + 1;
                    if (index >= btns.length) {
                        index = 0;
                        selectedIndex = 0;
                    }
                    listScroll(index);
                }, 5000);
            });
        }
        else {
            selectedIndex = index;
            var firstItem = $(".hotnews_warp").find("ul.hotnews_list").eq($(".hotnews_warp").find("ul.hotnews_list").length - 1);
            $(".hotnews_warp").prepend(firstItem.outer());
            firstItem.remove();
            $(".hotnews_warp").css("left", "-217px");
            $(".hotnews_warp").animate({ left: "0" }, 500, function () {
                //自动播放方法
                playID = setTimeout(function () {
                    if (btns.length == 1) { //如果只有一张图片 则不滚动。
                        return;
                    }
                    var index = selectedIndex + 1;
                    if (index >= btns.length) {
                        index = 0;
                    }
                    listScroll(index);
                }, 5000);
            });
        }

        btns.removeClass("act_point");
        var that = btns[selectedIndex];
        $(that).addClass("act_point");
    }
    var timer = null;
    $(".hotnews_content").bind({
        mouseover: function () {
            clearInterval(playID);
            clearTimeout(timer);
        },
        mouseout: function (event) {
            var obj = event.toElement || event.relatedTarget;
            var pa = $(this)[0];
            if (pa.contains(obj)) {
                return false;
            }
            btns.each(function (n) {
                if ($(this).hasClass("act_point")) {
                    if ($(".hotnews_warp").is(":animated")) {
                        return;
                    }
                    timer = setTimeout(function () {
                        if (selectedIndex == btns.length - 1) {
                            selectedIndex = -1;
                        }
                        listScroll(selectedIndex + 1);
                    }, 5000);
                }
            });
        }
    });
    $(".hotnews_btn").find("i.icon-zuojiantou").off().on("click", function () {
        event.stopPropagation();
        if ($(".hotnews_warp").is(":animated")) {
            return;
        }
        if (selectedIndex == 0) {
            selectedIndex = btns.length;
        }
        listScroll(selectedIndex - 1);
        return false;
    });
    $(".hotnews_btn").find("i.icon-youjiantou").off().on("click", function () {
        event.stopPropagation();
        if ($(".hotnews_warp").is(":animated")) {
            return;
        }
        if (selectedIndex == btns.length - 1) {
            selectedIndex = -1;
        }
        listScroll(parseInt(selectedIndex + 1));
        return false;
    });

    //首页商品楼层展示
    var vm = new Vue({
        el: '#floorWrap',
        data: {
            staticPath: config.staticPath + "purchase",
            loading: true,
            list: []
        },
        mounted() {
            this.getFloorList(1);
        },
        methods: {
            getFloorList() {
                var vueObj = this;
                vueObj.loading = false;
                $.ajaxForJson(config.shopPath + "indexList", {}, function (dataObj) {
                    if (dataObj.code === 2000) {
                        vueObj.list = dataObj.data;
                    }
                    vueObj.loading = false;
                });
            }
        }
    });
});