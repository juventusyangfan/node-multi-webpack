require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 倒计时
    var countdownFuc = function () {
        var timer = null;
        var countdown = $(".countdown").html();
        var sec = null,
            min = null,
            hr = null;
        var countdownAni = function () {
            var timeArr = countdown.split(":");
            if (parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                clearTimeout(timer);
                location.reload();
                return false;
            }
            if (parseInt(timeArr[2]) == 0) {
                if (parseInt(timeArr[1]) == 0) {
                    if (parseInt(timeArr[0]) == 0) {
                        sec = 0;
                        min = 0;
                        hr = 0;
                    } else {
                        sec = 59;
                        min = 59;
                        hr = parseInt(timeArr[0]) - 1;
                    }
                } else {
                    sec = 59;
                    min = parseInt(timeArr[1]) - 1;
                    hr = parseInt(timeArr[0]);
                }
            } else {
                sec = parseInt(timeArr[2]) - 1;
                min = parseInt(timeArr[1]);
                hr = parseInt(timeArr[0])
            }

            $(".countdown").html(hr + "时" + min + "分" + sec + "秒");
            countdown = hr + ':' + min + ':' + sec;
            timer = setTimeout(function () {
                countdownAni();
            }, 1000);
        };
        countdownAni();
    };
    if ($(".countdown").length > 0) {
        countdownFuc();
    }

    // 修改运费 - 商家
    $(".modify_cost").off().on("click", function () {
        $.dialog({
            title: "修改运费",
            content: '<div class="fare-box clearfix"><label class="fare-label">运费：</label><div class="fare-input"><input type="text" class="cjy-input-" name="new_cost" value="' + $("input[name='transport_cost']").val() + '"><span>&nbsp;元</span></div></div>',
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var transportCost = $.trim($("input[name='new_cost']").val());
                    if (transportCost !== "") {
                        transportCost = parseFloat(transportCost);
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: "运费不能为空！"
                        });
                        return false;
                    }
                    $.ajaxForJson('/Seller/Order/change_fee', {
                        id: $("input[name='id']").val(),
                        transport_cost: transportCost
                    }, function (json) {
                        if (json.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: json.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
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
        $("input[name='new_cost']").off().on("input", function () {
            var main = $(this);
            libs.lenNumber(main[0], 2);
            var curVal = main.val();
            if (curVal.length>=2) {
                if (curVal[1] !== "." && curVal[0] === "0") {
                    main.val(parseFloat(curVal));
                }
            }
        });
    });

    // 取消订单 确认订单 - 商家
    $(".cancle_order,.confirm_order").off().on("click", function () {
        var reqUrl = '/Seller/Order/affirmOrder';
        if ($(this).hasClass("cancle_order")) {
            reqUrl = '/Seller/Order/cancleOrder';
        }
        $.ajaxForJson(reqUrl, {
            id: $("input[name='id']").val()
        }, function (json) {
            if (json.code === 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.reload();
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });

    // 查看付款凭证 - 商家
    $(".click_fee").off().on("click", function () {
        $.showPhoto($(this).attr("data-url"));
    });

    // 取消订单 - 买家
    $(".cancel_order").off().on("click", function () {
        var ids = $("input[name='id']").val();
        var status = null;
        if ($(".buyer_fee").length > 0) {
            status = 7;
        } else {
            status = 6;
        }
        $.cueDialog({
            title: "提示",
            content: "您确认取消订单？",
            hint: "",
            callback: function () {
                $.ajaxForJson('/Buyer/Order/changeOrder', {
                    id: ids,
                    order_status: status
                }, function (json) {
                    if (json.code === 2000) {
                        $.msgTips({
                            type: "success",
                            content: json.msg,
                            callback: function () {
                                location.reload();
                            }
                        });
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: json.msg
                        });
                    }
                });
            }
        });
    });

    // 点击付款 - 买家
    // $(".buyer_fee").off().on("click", function () {
    //     var ids = $("input[name='id']").val();
    //     var status = 3;
    //     $.ajaxForJson('/Buyer/Order/ajaxTransportCost',{
    //         id: ids
    //     }, function (json) {
    //         if (json.code === 2000) {
    //             if (json.data.is_transport_cost === 1) {
    //                 $.cueDialog({
    //                     title: "提示",
    //                     content: "卖家运费已修改哦~",
    //                     hint: "改前运费：￥"+json.data.transport_cost_old+",改后运费：￥"+json.data.transport_cost,
    //                     callback: function () {
    //                         $.ajaxForJson('/Buyer/Order/changeOrder', {
    //                             id: ids,
    //                             order_status: status
    //                         }, function (json) {
    //                             if (json.code === 2000) {
    //                                 $.msgTips({
    //                                     type: "success",
    //                                     content: json.msg,
    //                                     callback: function () {
    //                                         location.reload();
    //                                     }
    //                                 });
    //                             } else {
    //                                 $.msgTips({
    //                                     type: "warning",
    //                                     content: json.msg
    //                                 });
    //                             }
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 $.ajaxForJson('/Buyer/Order/changeOrder', {
    //                     id: ids,
    //                     order_status: status
    //                 }, function (json) {
    //                     if (json.code === 2000) {
    //                         $.msgTips({
    //                             type: "success",
    //                             content: json.msg,
    //                             callback: function () {
    //                                 location.reload();
    //                             }
    //                         });
    //                     } else {
    //                         $.msgTips({
    //                             type: "warning",
    //                             content: json.msg
    //                         });
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // });
    // 上传付款凭证 - 买家
    $(".buyer_fee").off().on("click", function () {
        var ids = $("input[name='id']").val();
        $.dialog({
            title: "上传付款凭证",
            content: '<div class="payment-box clearfix"><label class="payment-title">上传付款凭证：</label><div class="payment-content"><div class="payment-region clearfix"><div class="payment-area"><label class="upload-payment" for="uploadFile">上传文件</label><input type="file" name="uploadFile" id="uploadFile"></div><p><i class="iconfont icon-i"></i>格式为jpg，jpeg，png</p></div><ul class="payment-list"></ul></div></div>',
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if ($("input[name='pay_img']").length<=0) {
                        $.msgTips({
                            type: "warning",
                            content: "请上传付款凭证！"
                        });
                        return false;
                    }
                    $.ajaxForJson('/Buyer/Order/editPost', {
                        id: ids,
                        pay_img: $("input[name='pay_img']").val()
                    }, function (json) {
                        if (json.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: json.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: json.msg
                            });
                        }
                    });
                });
            }
        });
    });

    // 附件上传 - 买家
    $(document).on("click", ".upload-payment", function () {
        $("#uploadFile").unbind().bind("change", function () {
            var id = $(this).attr("id");
            document.domain = config.domainStr;
            $.ajaxFileUpload({
                url: config.shopPath + 'uploadImg',
                secureuri: config.domainStr,
                fileElementId: id,
                data: {
                    name: "uploadFile"
                },
                success: function success(data) {
                    var dataObj = eval('(' + data + ')');
                    if (dataObj.code == 2000) {
                        var html = '<li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" href="javascript:;" data-url="' + config.filePath + dataObj.data + '" title="' + dataObj.name + '">' + dataObj.name + '</a><input type="hidden" name="pay_img" value="' + dataObj.data + '"></li>';
                        $(".payment-list").show();
                        $(".payment-list").html(html);
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: dataObj.message
                        });
                    }
                },
                error: function error(data, status) {}
            });
        });
    });

    // 查看大图 - 买家
    $(document).on("click", ".payment-link", function () {
        $.showPhoto($(this).attr("data-url"));
    });
});