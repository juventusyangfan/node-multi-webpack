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
                count: 0
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
                });
            }
        }
    });

    //选择包件
    $(".keyUl").find("li a").unbind().bind("click", function () {
        $(".keyUl").find("li a").parent().removeClass("act");
        $(this).parent().addClass("act");
        vm.getBidList();
        return false;
    });

    //确认资审文件费、标书文件费
    $(".material_list").on("click", ".js_money", function () {
        var _title = $(this).html(),
            _id = $(this).attr("data-id");
        $.ajaxForJson(config.wwwPath + "buyer/Payment/getPaymentInfo", {
            id: _id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var html = '<div class="payment_wrap">';
                html += '<div class="payment_block"><label>资审文件费用：</label><div class="payment_item">' + dataObj.data.pay_money + ' 元</div></div>';
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
    $(".material_list").on("click", ".js_view", function () {
        var _title = $(this).html(),
            _id = $(this).attr("data-id");
        $.ajaxForJson(config.wwwPath + "buyer/Payment/getPaymentInfo", {
            id: _id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var html = '<div class="payment_wrap">';
                html += '<div class="payment_block"><label>资审文件费用：</label><div class="payment_item">' + dataObj.data.pay_money + ' 元</div></div>';
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