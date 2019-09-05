require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    $(".inquiry_go").unbind().bind("click", function () {
        $.ajaxForJson(config.inquiryPath + "/supplier/quote/quoteTimes", null, function (dataObj) {
            if (dataObj.code == "2000") {
                window.location.href = "/supplier/quote/add?id=" + $("input[name='inquiry_id']").val();
            } else {
                $.dialog({
                    title: '',
                    content: '<div class="quote-service-box"><div class="quote-service-title">报价服务</div><div class="quote-service-inner"><div class="quote-cell cellChecked"><i class="iconGou"></i><div class="quote-cell-num"><i class="iconfont icon-jian8 quote_minus forbid_btn"></i><span class="quote-cell-txt"><span class="fontSize14 textBlack2 marginL10">报价</span><input type="text" class="quote-cell-input" value="10"><span class="fontSize14 textBlack2 marginR10 floatR">次</span></span><i class="iconfont icon-jiahao1 quote_add"></i></div><div class="quote-maney">￥<span class="fontSize32 textBlack1">100</span></div><div class="quote-price">10元/次</div></div><div class="quote-title">支付方式</div><div class="pay-con"><a href="javascript:;" class="pay-cell cellChecked" data-id="1"><i class="iconGou"></i>公对公转账</a></div><div class="quote-title">发票说明</div><div class="quote-des"><p>1、平台收取的报价服务费，开票方为湖北省楚建易网络科技有限公司。</p><p>2、您的累计报价消费金额不小于300元，可在平台申请开票。</p><p>3、申请开票方式：在供应商中心【报价管理】-【发票与报销】栏目申请开票。</p></div><a href="javascript:;" class="quote-more"><i class="iconfont icon-xiajiantou"></i>展开更多</a><div class="quote-service-btn"><a href="javascript:;" class="go-quote">去付款</a></div></div></div> ',//<a href="javascript:;" class="pay-cell cellChecked" data-id="2"><i class="iconGou"></i>融易付</a>     <div class="quote-agreement"><input type="checkbox" title="已阅读并同意"><a href="">《报价收费协议》</a></div>
                    width: 866,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    },
                    callback: function () {
                        // $("input[type='checkbox']").initCheckbox();

                        //展开说明
                        $(".quote-more").unbind().bind("click", function () {
                            if ($(this).hasClass("goUp")) {
                                $(this).removeClass("goUp");
                                $(".quote-des").css("height", "26px");
                            } else {
                                $(this).addClass("goUp");
                                $(".quote-des").css("height", "84px");
                            }
                            return false;
                        });

                        //勾选已阅读
                        // $(".quote-service-box input[type='checkbox']").unbind().bind("change", function () {
                        //     if ($(this).prop("checked")) {
                        //         $(".go-quote").removeClass("disabled");
                        //     } else {
                        //         $(".go-quote").addClass("disabled");
                        //     }
                        // });

                        //去付款
                        $(".go-quote").unbind().bind("click", function () {
                            if (!$(this).hasClass("disabled")) {
                                if ($(".pay-con").find(".cellChecked").attr("data-id") == "1") {
                                    $.ajaxForJson(config.inquiryPath + "/supplier/order/buyQuote", {
                                        buy_times: $("input.quote-cell-input").val(),
                                        pay_type: $(".pay-con").find(".cellChecked").attr("data-id")
                                    }, function (dataObj) {
                                        if (dataObj.code == "2000") {
                                            window.location.href = dataObj.data.url;
                                        } else {
                                            $.msgTips({
                                                type: "warning",
                                                content: dataObj.msg
                                            });
                                        }
                                    });
                                }
                                else{
                                    window.location.href = config.inquiryPath + "/supplier/order/easyPay?buy_times=" + $("input.quote-cell-input").val() + "&pay_type=" + $(".pay-con").find(".cellChecked").attr("data-id");
                                }
                            }
                            return false;
                        });

                        //选择支付方式
                        $(".pay-cell").unbind().bind("click", function () {
                            $(".pay-con").find(".pay-cell").removeClass("cellChecked");
                            $(this).addClass("cellChecked");
                            return false;
                        });

                        //报价次数
                        $("input.quote-cell-input").unbind("input").bind("input", function () {
                            libs.lenNumber(this, 0);
                            if (parseInt($(this).val()) >= 10) {
                                $(".quote_minus").removeClass("forbid_btn");
                            } else {
                                $(".quote_minus").addClass("forbid_btn");
                            }
                            $(".quote-maney").find("span").html(parseInt($(this).val()) * 10);
                        });
                        $("input.quote-cell-input").unbind("blur").bind("blur", function () {
                            if (parseInt($(this).val()) < 10) {
                                $(this).val(10);
                                $(".quote_minus").addClass("forbid_btn");
                                $(".quote-maney").find("span").html(parseInt($(this).val()) * 10);
                            }
                        });
                        $(".quote_minus").unbind().bind("click", function () {
                            var num = parseInt($("input.quote-cell-input").val()) - 1 < 0 ? 0 : parseInt($("input.quote-cell-input").val()) - 1;
                            if (num >= 10) {
                                $(this).removeClass("forbid_btn");
                                $("input.quote-cell-input").val(num);
                                $(".quote-maney").find("span").html(num * 10);
                            } else {
                                $(this).addClass("forbid_btn");
                            }
                            return false;
                        });
                        $(".quote_add").unbind().bind("click", function () {
                            var num = parseInt($("input.quote-cell-input").val()) + 1;
                            if (num >= 10) {
                                $(".quote_minus").removeClass("forbid_btn");
                            } else {
                                $(".quote_minus").addClass("forbid_btn");
                            }
                            $("input.quote-cell-input").val(num);
                            $(".quote-maney").find("span").html(num * 10);
                            return false;
                        });
                    }
                });
                $(".cjy-layer-inner").css("margin-top", "-20px");
            }
        })
        return false;
    });
});