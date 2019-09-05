require('cp');
require('elem');
require('../../../public-resource/css/componentOther.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#bidList',
        data() {
            return {
                loading: true,
                list: [],
                tenderInfo: {},
                count: 0,
                filePath: config.filePath
            }
        },
        mounted() {
            this.getBidList();
        },
        methods: {
            getBidList() {
                var that = this;
                that.loading = true;
                $(".material_list table").hide();
                $.ajaxForJson(config.wwwPath + 'buyer/Tender/getDetailPackageAjax', {
                    tId: $(".keyUl li.act").find("a").attr("tId"),
                    pId: $(".keyUl li.act").find("a").attr("pId"),
                    viewStatus: $(".keyUl li.act").find("a").attr("viewStatus")
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.apply_info;
                        that.tenderInfo = dataObj.data.tender_info;
                    }
                    $(".material_list table").show();
                    that.loading = false;

                    that.$nextTick(function () {
                        $("input[name='seniority_status']").parent().next(".cjy-radio").remove();
                        $("input[name='seniority_status']").initRadio();
                    });
                });
            }
        }
    });

    //切换包件
    $(".keyUl li").find("a").unbind().bind("click", function () {
        $(".keyUl li").removeClass("act");
        $(this).parents("li").addClass("act");
        vm.getBidList();
        return false;
    });

    //确认资审文件费、标书文件费
    $(".material_list").on("click", ".confirmPay", function () {
        var _title = $(this).html(),
            _id = $(this).attr("data-id"),
            _name = $(this).attr("data-title");
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
                                            vm.getBidList();
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

    //查看详情
    $(".material_list").on("click", ".viewPayDetail", function () {
        var _title = $(this).html(),
            _id = $(this).attr("data-id"),
            _name = $(this).attr("data-title");
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

    //选择招标方式
    $(".js_type").unbind().bind("click", function () {
        var _id = $(this).attr("evaluate_type") ? $(this).attr("evaluate_type") : "0";
        var _sel1 = _id == "1" ? " selected" : "",
            _sel2 = _id == "2" ? " selected" : "",
            _sel3 = _id == "3" ? " selected" : ""
        $.dialog({
            title: '选择评标方式',
            content: '<div class="rateTypeDlg-content"><a href="javascript:;" class="rateType_cell' + _sel1 + '" data-id="1"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>线下评标</a><a href="javascript:;" class="rateType_cell' + _sel2 + '" data-id="2"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>在线评标</a><a href="javascript:;" class="rateType_cell' + _sel3 + '" data-id="3"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>机器人评标</a></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
                name: "取消"
            },
            callback: function () {
                //选择评标方式
                $(".rateType_cell").unbind().bind("click", function () {
                    $(".rateType_cell").removeClass("selected");
                    $(this).addClass("selected");
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    $.ajaxForJson(config.wwwPath + "buyer/Tender/evaluationTypeAjax", {
                        tId: $(".keyUl li.act").find("a").attr("tId"),
                        evaluationType: $(".rateTypeDlg-content").find("a.selected").attr("data-id")
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    window.location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                });
            }
        });
        return false;
    });
});