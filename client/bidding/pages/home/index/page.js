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
                        if (json.data.is_agreement == "0") {
                            var strHtml = '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div><div class="cjy-poplayer" style="top: 154px; left: 50%; margin-left: -490px;"><div class="cjy-layer-wrap" style="width: 980px;"><div class="cjy-layer-head"><h1>服务协议更新</h1><i class="cjy-close iconfont icon-cha1"></i></div><div class="cjy-layer-inner"><div class="cjy-layer-body"><div class="inDialog" style="padding: 0 20px; height: 560px;overflow-y: auto;"><p style="text-indent:32px;line-height:150%"><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">提示条款</span></span></strong></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">欢迎您签署本《生材网平台服务协议》并使用生材网平台服务！</span></span></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">本协议为《生材网平台服务协议》修订版本，自本协议发布之日起，生材网平台各处所称</span>“生材网服务协议”均指本协议。</span></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px">&nbsp;</span></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">您经您所代表的公司或其他组织授权</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">（以下您和您所</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">代表</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">的公司</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">或其他组织</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">均简称为</span>“您”）</span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">与生材网的经营者湖北省楚建易网络科技有限公司</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">（</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">以下简称</span>“生材网”</span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">）</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">共同缔结</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">本协议</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">成为生材网平台</span></span><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">会员</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">本协议具有合同效力。本协议阐述之条款和条件（以下合称</span>“条款”）适用于您使用生材网，生材网依据以下条款为您提供所享有的服务，请仔细阅读并遵守。</span></p><p style=";line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px">&nbsp;</span></p><p style=";line-height:150%"><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">【</span></span></strong><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">审慎阅读</span></span></strong><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">】</span></span></strong><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">您在申请注册流程中点击同意本协议之前</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">应当认真阅读本协议</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">。</span></span><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">请您务必审慎阅读</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">、</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">充分理解</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">各</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">条款内容</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">，</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">特别是免除或限制责任的条款</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">、</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">法律适用和争议解决条款</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">。</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">免除或限制责任的条款将以粗体标识</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">，</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">您应重点阅读</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">。</span></span></span></strong><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">如您对协议有任何疑问</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">可向生材网平台进行咨询</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">。</span></span></p><p style=";line-height:150%"><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">【签约动作】</span></span></strong><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">与生材网达成一致，成为生材网平台</span>“会员”</span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">。</span></span><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。</span></span></span></strong></p><p><span style=";font-family:Calibri;font-size:14px">&nbsp;</span></p><p><br/></p><p><a href="https://account.materialw.com/buyerprotocol.html" target="_blank" style="color:#fc6940;text-decoration: underline;">《生材网平台服务协议（采购商类）》</a></p><p><a href="https://account.materialw.com/sellerprotocol.html" target="_blank" style="color:#fc6940;text-decoration: underline;">《生材网平台服务协议（供应商类）》</a></p><p><a href="https://www.materialw.com/about/private.html" target="_blank" style="color:#fc6940;text-decoration: underline;">《隐私声明》</a></p><p><br/></p><p style="text-align: center;"><a href="javascript:;" class="confirmAgreement confirmDisabled">同意协议<span>（10s）</span></a></p></div></div></div></div></div>';
                            $("body").eq(0).append(strHtml);
                            var timer = null,
                                timeNum = 10;
                            timer = setInterval(function () {
                                timeNum--;
                                $(".confirmAgreement").find("span").html("（" + timeNum + "s）");
                                if (timeNum <= 0) {
                                    clearInterval(timer);
                                    $(".confirmAgreement").removeClass("confirmDisabled");
                                    $(".confirmAgreement").find("span").remove();
                                }
                            }, 1000);
                            $(".cjy-close").unbind().bind("click", function () {
                                window.location.href = config.accountPath + "quit.html";
                                return false;
                            });
                            $(".confirmAgreement").unbind().bind("click", function () {
                                if (!$(this).hasClass("confirmDisabled")) {
                                    $.ajaxJSONP(config.accountPath + "isAgreementAjax", null, function (dataObj) {
                                        if (dataObj.code == 2000) {
                                            location.href = json.data.url;
                                        } else {
                                            $.msgTips({
                                                type: "warning",
                                                content: dataObj.data.msg
                                            });
                                        }
                                    });
                                }
                                return false;
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