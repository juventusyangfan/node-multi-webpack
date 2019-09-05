/**
 * Created by yangfan on 2017/7/6.
 */
require('elem');
require('cp');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');

import Vue from 'vue';

const config = require('configModule');
const libs = require('libs');

$(() => {
    $("#app").find(".tender_content").show();
    var vm1 = new Vue({
        el: '#app',
        data: {
            loading: true,
            list: [],
            cate: ''
        },
        mounted() {
            this.changeProvince(this.cate);
        },
        methods: {
            changeProvince(code) {
                var vueObj = this;
                vueObj.loading = true;
                $("#app").find(".tender_content").hide();
                $.ajaxForJson(config.wwwPath + 'thirdbid/thirdbidlist', {
                    province_code: code,
                    page_size: 7,
                    is_json: 1
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data.list;
                        vueObj.cate = code;
                        $("#app").find(".tender_content").show();
                    }
                    vueObj.loading = false;
                });
            }
        }
    });

    $("#exclusive").find(".exclusive_list").show();
    var vm2 = new Vue({
        el: '#exclusive',
        data: {
            loading: true,
            list: [],
            type: 0
        },
        mounted() {
            this.changeExclusive(this.type);
        },
        methods: {
            changeExclusive(type) {
                var vueObj = this;
                vueObj.loading = true;
                $("#exclusive").find(".exclusive_list").hide();
                $.ajaxForJson(config.wwwPath + 'index/ajaxTenderList', {
                    collect_type: type,
                    is_json: 1
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data;
                        vueObj.type = type;
                        $("#exclusive").find(".exclusive_list").show();
                    }
                    vueObj.loading = false;
                });
            },
            showTips(val) {
                $.msgTips({
                    type: "warning",
                    content: val
                });
            }
        }
    });

    //banner轮播
    $(".js_slides").initPicPlayer();

    // 选择登陆角色
    $(".login_item strong").off().on("click", function () {
        var main = $(this);
        main.parent().find(".active").removeClass("active");
        main.addClass("active");
    });

    // 表单输入
    $(".login_item input").off().on("input", function () {
        var main = $(this);
        if (main.val() !== "" && main.hasClass("err_border")) {
            main.removeClass("err_border");
            $(".err_area").removeClass("display-block");
        } else if ($(".err_area").hasClass("display-block")) {
            $(".err_area").removeClass("display-block");
        }
    });

    // 按enter健登录
    $("input").bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".login_item button").triggerHandler("click");
            return false;
        }
    });

    // 登录
    $(".login_item button").off().on("click", function () {
        var main = $(this), formObj = $("form").eq(0);

        if ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val())) {
            $(".err_area span").html("请填写正确的手机");
            $("input[name='user_mobile']").addClass("err_border");
            $(".err_area").addClass("display-block");
            return false;
        }
        else if ($.trim($("input[name='user_pwd']").val()) == "" || !libs.checkPassword($("input[name='user_pwd']").val())) {
            $(".err_area span").html("请填写8-20位字及字母组合的密码");
            $("input[name='user_pwd']").addClass("err_border");
            $(".err_area").addClass("display-block");
            return false;
        }

        var reqUrl = config.accountPath + 'loginJsonp';
        var reqData = $(".login_box input").serialize() + '&role_type=' + $(".login_item .active").attr("data-type");

        $.ajaxJSONP(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                if (json.hasOwnProperty("msg")) {
                    $.msgTips({
                        type: "success",
                        content: json.msg
                    });
                } else {
                    if (json.data.hasOwnProperty("member_status")) {
                        if (json.data.member_status !== 1) {
                            $.memberDialog({
                                company_name: json.data.data.company_name,
                                real_name: json.data.data.real_name,
                                member_status: json.data.member_status
                            });
                            $.msgTips({
                                type: "success",
                                content: json.data.msg
                            });
                        } else {
                            $.msgTips({
                                type: "success",
                                content: json.data.msg,
                                callback: function () {
                                    location.href = json.data.url;
                                }
                            });
                        }
                    } else {
                        $.msgTips({
                            type: "success",
                            content: json.data.msg,
                            callback: function () {
                                location.href = json.data.url;
                            }
                        });
                    }
                }
            } else {
                $(".err_area span").html(json.msg);
                $(".err_area").addClass("display-block");
            }
        });
    });

    // 通知滚动效果
    var notifyScrollFuc = function () {
        var scrollTimer = null;
        var notifyList = $(".notify_list");
        var notifyItem = notifyList.find(".notify_item");
        var listLen = notifyItem.length;
        if (listLen === 0) {
            return false;
        }
        if (notifyList.outerWidth() < 1100) {
            var elseWidth = 1100 - notifyList.outerWidth();
            notifyItem.eq(listLen - 1).css("width", notifyItem.eq(listLen - 1).width() + elseWidth + 'px');
        }
        notifyList.append(notifyList.html());
        var totalWidth = 0;
        listLen = 2 * listLen;
        notifyItem = notifyList.find(".notify_item");
        for (let index = 0; index < listLen; index++) {
            totalWidth += notifyItem.eq(index).outerWidth();
        }
        notifyList.css("width", totalWidth + 'px');
        var notifyScrollAnition = function () {
            var leftVal = parseFloat(notifyList.css("left"));
            if (Math.abs(leftVal) >= (totalWidth / 2)) {
                notifyList.stop(true, true).css("left", "0px");
            } else {
                notifyList.stop(true, true).css("left", leftVal - 1 + 'px');
            }
            scrollTimer = setTimeout(notifyScrollAnition, 16);
        };
        scrollTimer = setTimeout(notifyScrollAnition, 16);
        $(".notify_list").off().on({
            mouseover: function () {
                clearTimeout(scrollTimer);
            },
            mouseout: function () {
                scrollTimer = setTimeout(notifyScrollAnition, 16);
            }
        });
    };
    notifyScrollFuc();

    //中标公示轮播
    var conWidth = 1200 * $(".marquee_box").find(".marquee_item").length / 4;
    $(".marquee_box").width(conWidth + "px");
    // btnShow();
    $(".btn_area .btn_left").unbind().bind("click", function () {
        if ($(".marquee_box").is(":animated")) {
            return false;
        }
        var left = $(".marquee_box").position().left + 1200;
        $(".marquee_box").animate({left: left + "px"}, 500, function () {
            btnShow();
        });
        return false;
    });
    $(".btn_area .btn_right").unbind().bind("click", function () {
        if ($(".marquee_box").is(":animated")) {
            return false;
        }
        var left = $(".marquee_box").position().left - 1200;
        $(".marquee_box").animate({left: left + "px"}, 500, function () {
            btnShow();
        });
        return false;
    });

    $(".marquee_wrap").off().on({
        mouseover: function () {
            btnShow();
        },
        mouseout: function () {
            $(".btn_area .btn_left").hide();
            $(".btn_area .btn_right").hide();
        }
    });

    function btnShow() {
        if ($(".marquee_box").position().left >= 0) {
            $(".btn_area .btn_left").hide();
        }
        else {
            $(".btn_area .btn_left").show();
        }
        if ($(".marquee_box").position().left <= 1200 - $(".marquee_box").width()) {
            $(".btn_area .btn_right").hide();
        }
        else {
            $(".btn_area .btn_right").show();
        }
    }

// 独家招标 三方招标列表
//     $(".module_cate").on("click", ".md_txt", function () {
//         var main = $(this);
//         var mdTxt = null, num = null;
//         if (main.attr("province_code") !== undefined) {
//             if (!main.hasClass("active")) {
//                 mdTxt = main.parents(".module_cate").find(".md_txt");
//                 num = mdTxt.index(main);
//                 if ($(".tender_content").eq(num).html() !== "") {
//                     main.parents(".module_cate").find(".active").removeClass("active");
//                     main.addClass("active");
//                     $(".tender_content").removeAttr("style");
//                     $(".tender_content").eq(num).css("display", "block");
//                 } else {
//                     $(".tender_content").eq(num).html('<div style="text-align: center;"><div class="page_loading"></div></div>');
//                     $.ajaxForJson(config.wwwPath + 'thirdbid/thirdbidlist', {
//                         province_code: main.attr("province_code"),
//                         page_size: 7,
//                         is_json: 1
//                     }, function (json) {
//                         if (json.code === 2000) {
//                             var jsonList = json.data.list;
//                             var listHtml = '';
//                             for (let i = 0; i < jsonList.length; i++) {
//                                 listHtml += '<li class="tender_item"><p class="tender_info"><i class="iconfont icon-youjiantou tender_icon"></i><a class="tender_title ellipsis" href="' + jsonList[i].href + '" target="_blank">' + jsonList[i].name + '</a><span class="tender_area">' + jsonList[i].province_name + '</span><span class="tender_company ellipsis">' + jsonList[i].bid_company + '</span><span class="tender_date">' + jsonList[i].release_time_format + '</span></p></li>';
//                             }
//                             main.parents(".module_cate").find(".active").removeClass("active");
//                             main.addClass("active");
//                             $(".tender_content").removeAttr("style");
//                             $(".tender_content").eq(num).css("display", "block").html(listHtml);
//                         }
//                     });
//                 }
//             }
//         } else if (main.attr("data-tender") === "tender") {
//             if (!main.hasClass("active")) {
//                 mdTxt = main.parents(".module_cate").find(".md_txt");
//                 num = mdTxt.index(main);
//                 if ($(".exclusive_list").eq(num).html() !== "") {
//                     main.parents(".module_cate").find(".active").removeClass("active");
//                     main.addClass("active");
//                     $(".exclusive_list").removeAttr("style");
//                     $(".exclusive_list").eq(num).css("display", "block");
//                 } else {
//                     $(".exclusive_list").eq(num).html('<div style="text-align: center;"><div class="page_loading"></div></div>');
//                     $.ajaxForJson(config.wwwPath + 'index/ajaxTenderList', {
//                         collect_type: main.attr("collect_type"),
//                     }, function (json) {
//                         main.parents(".module_cate").find(".active").removeClass("active");
//                         main.addClass("active");
//                         $(".exclusive_list").removeAttr("style");
//                         if (typeof json.data.list === "undefined") {
//                             $(".exclusive_list").eq(num).css("display", "block").html('<div class="page_list_noneBg" style="display: block;"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p>');
//                         } else {
//                             $(".exclusive_list").eq(num).css("display", "block").html(json.data.list);
//                         }
//                     });
//                 }
//             }
//         }
//     });
});