require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';
const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#receipt',
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
            this.getReceipt(1);
        },
        methods: {
            getReceipt(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + "/ajaxReceiptList", {
                    reviewStatus: $("select").val(),
                    keyWord: $("input[name='word']").val(),
                    type: $("input[name='type']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            }
        }
    });

    //条件搜索确认
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getReceipt(1);
        return false;
    });


    //审核弹框
    $(".back_list_con").on("click", "a[name='checkVoucher'],a[name='editVoucher']", function () {
        var main = $(this);
        var enrollId = main.attr("enroll-id"), type = $("input[name='type']").val();

        $.dialog({
            title: '审核支付凭证',
            content: '<div class="qygys-box"><div class="gys-basic"><div class="gys-basic-title"><h2>供应商基本信息</h2><span class="gys-line"></span></div><ul class="gysbasic-list clearfix"><li class="gys-item"><span class="gys-item-title">公司名称：</span><span name="company_name" class="gys-item-name ellipsis color_red" title=""></span></li><li class="gys-item"><span class="gys-item-title">企业类型：</span><span name="company_type" class="gys-item-name"></span></li><li class="gys-item"><span class="gys-item-title">员工人数：</span><span name="size" class="gys-item-name"></span></li><li class="gys-item"><span class="gys-item-title">是否一般纳税人：</span><span name="taxpayer_type" class="gys-item-name"></span></li><li class="gys-item"><span class="gys-item-title">注册资金：</span><span name="business_volume" class="gys-item-name"></span></li><li class="gys-item"><span class="gys-item-title">公司联系方式：</span><span name="company_phone" class="gys-item-name"></span></li><li class="gys-item"><span class="gys-item-title">公司地址：</span><span name="address" class="gys-item-name"></span></li><li class="gys-item"><span class="gys-item-title">详细地址：</span><span name="detail_address" class="gys-item-name ellipsis"></span></li></ul></div><div class="gys-sel-area"><p><span class="block_title">凭证提交时间：</span><b name="time" class="font_normal"></b></p><p><span class="block_title">支付凭证：</span><a name="voucherName" class="color_blue" href="javascript:;" data-path=""></a></p><p><span class="block_title">是否通过：</span><select name="reviewStatus" value="0"><option value="0">请选择状态</option><option value="1">已通过</option><option value="-1">未通过</option><option value="2">待审核</option></select></p></div></div>',
            width: 540,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            callback: function () {
                $.ajaxForJson(config.wwwPath + "/ajaxGetOneReceipt", {
                    enrollId: enrollId,
                    type: type
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        $("span[name='company_name']").html(dataObj.data.supplier.company_name).attr("title", dataObj.data.supplier.company_name);
                        $("span[name='company_type']").html(dataObj.data.supplier.company_type);
                        $("span[name='size']").html(dataObj.data.supplier.size);
                        $("span[name='taxpayer_type']").html(dataObj.data.supplier.taxpayer_type);
                        $("span[name='business_volume']").html(dataObj.data.supplier.business_volume);
                        $("span[name='company_phone']").html(dataObj.data.supplier.company_phone);
                        $("span[name='address']").html(dataObj.data.supplier.address);
                        $("span[name='detail_address']").html(dataObj.data.supplier.detail_address);
                        $("[name='time']").html(dataObj.data.time);
                        $("a[name='voucherName']").html(dataObj.data.voucherName).attr("data-path", config.filePath + dataObj.data.voucherPath);
                        $("select[name='reviewStatus']").attr("value", dataObj.data.reviewStatus).initSelect();

                        //查看图片
                        $("a[name='voucherName']").unbind().bind("click", function () {
                            $.showPhoto($(this).attr("data-path"));
                            return false;
                        });

                    }
                });

                $(".cjy-confirm-btn").off().on("click", function () {
                    $.ajaxForJson(config.wwwPath + "/ajaxEditReceipt", {
                        enrollId: enrollId,
                        type: type,
                        reviewStatus: $("select[name='reviewStatus']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
                        }
                        else {
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

    //查看凭证
    $(".back_list_con").on("click", "a[name='bookUrl']", function () {
        $.showPhoto(config.filePath + $(this).attr("url"));
        return false;
    });
});