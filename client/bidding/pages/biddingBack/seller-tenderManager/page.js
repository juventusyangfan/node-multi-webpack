require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#tenderManager',
        data() {
            return {
                loading: true,
                list: [],
                count: 0,
                limit: 10,
                current: 1
            }
        },
        mounted() {
            this.getTenderManager(1);
        },
        methods: {
            getTenderManager(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var type = $("select").val();
                $.ajaxForJson(config.wwwPath + 'ajaxInvitList', {
                    type: type,
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        $(".back_list_info").find("span").html("共" + that.count + "条数据");
                    }
                    that.loading = false;
                });
            }
        }
    });

    //筛选确认按钮
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getTenderManager(1);
        return false;
    });

    //接受拒绝
    $(".back_main_content").on("click", ".back_item_pass", function () {
        var main = $(this);
        var type = 1,
            invitId = main.attr("invit-id"),
            tenderId = main.parents("tr").attr("tender-id");
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '确定接收该条邀请？'],
            content: '',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.get(config.wwwPath + 'ajaxEnrollPopup', {
                        tenderId: tenderId
                    }, function (json) {
                        var json = JSON.parse(json);
                        if (json.code == 2000) {
                            if (json.data.word === "") {
                                $.ajaxForJson(config.wwwPath + "/ajaxHandleInvit", {
                                    type: type,
                                    invitId: invitId,
                                    tenderId: tenderId
                                }, function (dataObj) {
                                    if (dataObj.code == "2000") {
                                        main.parents(".back_tender_Item").removeClass("hover_pass");
                                        if (main.hasClass("back_item_pass")) {
                                            main.parents(".back_tender_Item").find(".back_tips_waiting").addClass("back_tips_success").removeClass("back_tips_waiting").html("已接受");
                                        } else {
                                            main.parents(".back_tender_Item").find(".back_tips_waiting").addClass("back_tips_disabled").removeClass("back_tips_waiting").html("已拒绝");
                                        }
                                        $.msgTips({
                                            type: "success",
                                            content: dataObj.msg,
                                            callback: function () {
                                                vm.getTenderManager();
                                                $(".cjy-poplayer").remove();
                                                $(".cjy-bg").remove();
                                            }
                                        });
                                    } else {
                                        $.msgTips({
                                            type: "warning",
                                            content: dataObj.msg
                                        });
                                    }
                                });
                                return false;
                            }
                            if (json.data.word === "notVip") {
                                var strHtml = '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div><div class="sign_box"><i class="cjy-close iconfont icon-cha1" style="cursor: pointer;"></i><div class="sign_head">' + json.data.tender_name + '</div><div class="sign_body"><div class="sign_tips clearfix"><i class="iconfont icon-i"></i><p>营造公平、公正、公开的集采环境，提高采购效率和采购质量，根据<a class="textOrange" href="https://www.materialw.com/news/48.html" target="_blank">《生材网会员服务协议》</a> ，针对当前招标您需要缴纳信息服务保证金。若您成功中标，则按协议约定及实际成交金额收取相应信息服务费；若您未中标，生材网将全额返还您的信息服务保证金。</p></div><div class="sign_con"><span class="sign_price"><span class="fontSize30">' + json.data.service_fee + '</span>元</span><span class="sign_info"><span>账户名称：' + json.data.account.name + '</span><span>开户银行：' + json.data.account.bank + '</span><span>账户号码：' + json.data.account.account + '</span></span></div><div class="sign_des">支付成功后，生材网工作人员将在后台审核并通过您的报名信息。转账时，请在付款凭证备注中填写注册企业的全称，参与招标的招标名称。如有疑问，请致电：<span class="textRed">027-82815329</span></div></div>';
                                if (main.attr("id") != "showSignBox") {
                                    strHtml += '<div class="sign_foot clearfix"><a href="javascript:;" class="sign_confirm">确认报名</a><a href="javascript:;" class="sign_cancel">取消</a></div>';
                                }
                                strHtml += '</div>';
                                $("body").eq(0).append(strHtml);
                                var ele = $(".sign_box");
                                ele.css({
                                    "left": ($(window).outerWidth() - ele.outerWidth()) / 2 + "px",
                                    "top": $(document).scrollTop() + ($(window).outerHeight() - ele.outerHeight()) / 2 + "px",
                                    "z-index": 100
                                });
                                ele.fadeIn(400);

                                $(".sign_confirm").unbind().bind("click", function () {
                                    $.ajaxForJson(config.wwwPath + "/ajaxHandleInvit", {
                                        type: type,
                                        invitId: invitId,
                                        tenderId: tenderId
                                    }, function (dataObj) {
                                        if (dataObj.code == "2000") {
                                            main.parents(".back_tender_Item").removeClass("hover_pass");
                                            if (main.hasClass("back_item_pass")) {
                                                main.parents(".back_tender_Item").find(".back_tips_waiting").addClass("back_tips_success").removeClass("back_tips_waiting").html("已接受");
                                            } else {
                                                main.parents(".back_tender_Item").find(".back_tips_waiting").addClass("back_tips_disabled").removeClass("back_tips_waiting").html("已拒绝");
                                            }
                                            $.msgTips({
                                                type: "success",
                                                content: dataObj.msg
                                            });
                                            setTimeout(function () {
                                                $(".cjy-bg").remove();
                                                $(".sign_box").remove();
                                            }, 1000);
                                        } else {
                                            $.msgTips({
                                                type: "warning",
                                                content: dataObj.msg
                                            });
                                        }
                                    });
                                    return false;
                                });

                                $(".sign_cancel,.cjy-close ").unbind().bind("click", function () {
                                    $(".cjy-bg").remove();
                                    $(".sign_box").remove();
                                    return false;
                                });
                                return false;
                            }
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: json.msg
                            });
                        }
                    });
                    return false;
                });
            }
        });
        return false;
    });
    $(".back_main_content").on("click", ".back_item_noPass", function () {
        var main = $(this);
        var type = -1,
            invitId = main.attr("invit-id"),
            tenderId = main.parents("tr").attr("tender-id");
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '确定拒绝该条邀请？'],
            content: '',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + "/ajaxHandleInvit", {
                        type: type,
                        invitId: invitId,
                        tenderId: tenderId
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            main.parents(".back_tender_Item").removeClass("hover_pass");
                            if (main.hasClass("back_item_pass")) {
                                main.parents(".back_tender_Item").find(".back_tips_waiting").addClass("back_tips_success").removeClass("back_tips_waiting").html("已接受");
                            } else {
                                main.parents(".back_tender_Item").find(".back_tips_waiting").addClass("back_tips_disabled").removeClass("back_tips_waiting").html("已拒绝");
                            }
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    vm.getTenderManager();
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                    return false;
                });
            }
        });
        return false;
    });
});