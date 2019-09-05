require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#payList',
        data() {
            return {
                loading: true,
                list: [],
                package: null,
                cueNum: 0,
                paymentType: $(".back_main_title").find("span.active").attr("data-type")
            }
        },
        mounted() {
            this.getPayList();
        },
        methods: {
            getPayList() {
                var that = this;
                that.loading = true;
                $.ajaxForJson(config.wwwPath + 'buyer/Payment/detailAjax', {
                    tId: $("#payList").attr("tId"),
                    paymentType: that.paymentType,
                    pId: $(".back_main_nav").find("li.active").attr("pId"),
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.list = dataObj.data.supplier_info;
                        that.package = dataObj.data.package_info;
                    }
                    that.loading = false;
                });
            }
        }
    });

    //搜索事件
    $(".back_btn_search").unbind().bind("click", function () {
        vm.getPayList(1);
        return false;
    });

    //清除事件
    $(".back_btn_clear").unbind().bind("click", function () {
        $("select[name='status']").val("0").initSelect();
        $("input[name='tenderName']").val("");
        $("input[name='isNeedPay']").attr("checked", false).initCheckbox();
        vm.getPayList(1);
        return false;
    });

    //确认资审文件费、标书文件费
    $("#payList").on("click", ".js_money", function () {
        var _title = $(this).html(),
            _id = $(this).attr("data-id"),
            _name = $(this).attr("data-name");
        $.ajaxForJson(config.wwwPath + "buyer/Payment/getPaymentInfo", {
            id: _id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var html = '<div class="payment_wrap">';
                html += '<div class="payment_block"><label>' + _name + '费用：</label><div class="payment_item">' + dataObj.data.pay_money + ' 元</div></div>';
                html += '<div class="payment_block"><label>缴费单位：</label><div class="payment_item">' + dataObj.data.supplier_name + '</div></div>';
                html += '<div class="payment_block"><label>缴费凭证：</label>';
                for (var key in dataObj.data.payment_vouchers) {
                    html += '<div class="payment_item"><a href="javascript:;" data-url="' + config.filePath + dataObj.data.payment_vouchers[key] + '" class="textBlue fontNormal js_show">' + key + '</a><span class="textBlack3 fontNormal marginL30">' + dataObj.data.pay_time_str + '  上传</span></div>';
                }
                html += '</div>';
                html += '<div class="payment_block"><label>当前状态：</label><div class="payment_item">' + dataObj.data.status_str + '</div></div>';
                html += '<div class="payment_block"><label></label><div class="payment_item"><input name="passType" type="radio" title="通过" value="2" checked><input name="passType" type="radio" title="不通过" value="-1"></div></div>';
                html += '<div class="payment_block js_remark" style="display:none;"><label></label><div class="payment_item"><textarea placeholder="请输入不通过的原因，将反馈给供应商"></textarea></div></div>';
                html += '</div>';
                $.dialog({
                    title: _title,
                    content: html,
                    width: 640,
                    confirm: {
                        show: true,
                        allow: true,
                        name: "确定"
                    },
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    callback: function () {
                        $("input[type='radio']").initRadio();
                        $("input[type='radio']").unbind().bind("change", function () {
                            if ($(this).val() == "-1") {
                                $(".js_remark").show();
                            } else {
                                $(".js_remark").hide();
                            }
                        });
                        //查看图片
                        $(".js_show").unbind().bind("click", function () {
                            var path = $(this).attr("data-url");
                            $.showPhoto(path);
                            return false;
                        });
                        //确认事件
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var _data = null;
                            if ($("input[name='passType']:checked").val() == "-1") {
                                _data = {
                                    id: _id,
                                    status: $("input[name='passType']:checked").val(),
                                    back_reason: $(".js_remark").find("textarea").val()
                                }
                            } else {
                                _data = {
                                    id: _id,
                                    status: $("input[name='passType']:checked").val()
                                }
                            }
                            $.ajaxForJson(config.wwwPath + "buyer/Payment/confirmPaymentStatusAjax", _data, function (obj) {
                                if (obj.code == 2000) {
                                    $.msgTips({
                                        type: "success",
                                        content: obj.msg,
                                        callback: function () {
                                            $(".cjy-cancel-btn").trigger("click");
                                            vm.getPayList();
                                        }
                                    });
                                } else {
                                    $.msgTips({
                                        type: "warning",
                                        content: obj.msg
                                    });
                                }
                            });
                            return false;
                        });
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
    //退还保证金
    $("#payList").on("click", ".js_return", function () {
        var _id = $(this).attr("data-id"),
            _name = $(this).attr("data-name"),
            _money = $(this).attr("data-money"),
            _status = $(this).attr("data-status");
        var html = '<div class="payment_wrap">';
        html += '<div class="payment_block"><label>保证金金额：</label><div class="payment_item fontNormal textBlack2">' + _money + ' 元</div></div>';
        html += '<div class="payment_block"><label>缴费单位：</label><div class="payment_item fontNormal textBlue">' + _name + '</div></div>';
        html += '<div class="payment_block"><label>中标情况：</label><div class="payment_item fontNormal textBlack2">' + _status + '</div></div>';
        html += '<div class="payment_block"><label></label><div class="payment_item"><input name="passType" type="radio" title="退还保证金" value="0"><input name="passType" type="radio" title="转为履约保证金" value="1"></div></div>';
        html += '</div>';
        $.dialog({
            title: '退还保证金',
            content: html,
            width: 640,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $("input[type='radio']").initRadio();
                //确认事件
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.cueDialog({
                        title: "确认框",
                        topWords: ["icon-i", '确定<span class="textBlack1 fontBold">' + $("input[name='passType']:checked").attr("title") + '</span>操作吗？'],
                        content: '',
                        callback: function () {
                            $(".cjy-confirm-btn").eq(1).unbind().bind("click", function () {
                                var _url = "";
                                if ($("input[name='passType']:checked").val() == "0") {
                                    _url = "buyer/Payment/agreeRefund";
                                } else {
                                    _url = "buyer/Payment/depositExchangePerformance";
                                }
                                $.ajaxForJson(config.wwwPath + _url, {
                                    id: _id
                                }, function (obj) {
                                    if (obj.code == 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: obj.msg,
                                            callback: function () {
                                                $(".cjy-cancel-btn").trigger("click");
                                                vm.getPayList();
                                            }
                                        });
                                    } else {
                                        $(".cjy-cancel-btn").trigger("click");
                                        $.msgTips({
                                            type: "warning",
                                            content: obj.msg
                                        });
                                    }
                                });
                            });
                        }
                    });

                    return false;
                });
            }
        });
        return false;
    });
    //查看详情
    $("#payList").on("click", ".js_view", function () {
        var _title = $(this).html(),
            _id = $(this).attr("data-id"),
            _name = $(this).attr("data-name");
        $.ajaxForJson(config.wwwPath + "buyer/Payment/getPaymentInfo", {
            id: _id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var html = '<div class="payment_wrap">';
                html += '<div class="payment_block"><label>' + _name + '费用：</label><div class="payment_item">' + dataObj.data.pay_money + ' 元</div></div>';
                html += '<div class="payment_block"><label>缴费单位：</label><div class="payment_item">' + dataObj.data.supplier_name + '</div></div>';
                html += '<div class="payment_block"><label>缴费凭证：</label>';
                for (var key in dataObj.data.payment_vouchers) {
                    if (dataObj.data.payment_method == 1) {
                        html += '<div class="payment_item"><a href="javascript:;" data-url="' + config.filePath + dataObj.data.payment_vouchers[key] + '" class="textBlue fontNormal js_show">' + key + '</a><span class="textBlack3 fontNormal marginL30">' + dataObj.data.pay_time_str + '  上传</span></div>';
                    } else {
                        html += '<div class="payment_item"><span>在线支付（融易付）</span><span class="textBlack3 fontNormal marginL30">' + dataObj.data.pay_time_str + '  支付</span></div>';
                    }
                }
                html += '</div>';
                html += '<div class="payment_block"><label>确认状态：</label><div class="payment_item">' + dataObj.data.status_str + '<span class="textBlack3 fontNormal marginL30">' + dataObj.data.confirm_time_str + '  审核</span></div></div>';
                if (dataObj.data.status == -1) {
                    html += '<div class="payment_block"><label>驳回原因：</label><div class="payment_item">' + dataObj.data.back_reason + '</div></div>';
                }
                html += '</div>';
                $.dialog({
                    title: _title,
                    content: html,
                    width: 640,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    },
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    callback: function () {
                        $("input[type='radio']").initRadio();
                        $("input[type='radio']").unbind().bind("change", function () {
                            if ($(this).val() == "-1") {
                                $(".js_remark").show();
                            } else {
                                $(".js_remark").hide();
                            }
                        });
                        //查看图片
                        $(".js_show").unbind().bind("click", function () {
                            var path = $(this).attr("data-url");
                            $.showPhoto(path);
                            return false;
                        });
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
});