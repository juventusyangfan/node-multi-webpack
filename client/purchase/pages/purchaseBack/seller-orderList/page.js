require('cp');
require('cbp');
require('elem');
require('./page.css');
import Vue from 'vue';
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    var vm = new Vue({
        el: '#orderList',
        data: {
            imgPath: config.filePath,
            loading: true,//loading图
            list: [],//商品列表
            count: 0,//商品总数
            current: 1,//当前分页
            productName: "",//商品名称
            orderNumber: "",//订单号
            buyerName: "",//买家名称
            sellerName: "",//商家名称
            createdStart: "",//开始时间
            createdEnd: "",//结束时间
            status: 0,//商品状态id
            statusNumList: {},//状态选择计数
            timer: null
        },
        mounted() {
            this.getOrder(1);
        },
        methods: {
            getOrder(currentPage) {
                var vueObj = this;
                vueObj.productName = $("input[name='product_name']").val();
                vueObj.orderNumber = $("input[name='order_number']").val();
                vueObj.buyerName = $("input[name='buyer_name']").val();
                vueObj.sellerName = $("input[name='seller_name']").val();
                vueObj.createdStart = $("input[name='created_start']").val();
                vueObj.createdEnd = $("input[name='created_end']").val();
                vueObj.status = $("select[name='order_status']").val();
                var reqUrl = "/Seller/Order/sellerOrderData",
                    reqData = {
                        product_name: vueObj.productName,
                        order_number: vueObj.orderNumber,
                        buyer_name: vueObj.buyerName,
                        seller_name: vueObj.sellerName,
                        created_start: vueObj.createdStart,
                        created_end: vueObj.createdEnd,
                        order_status: vueObj.status,
                        p: currentPage
                    };
                $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                    if (dataObj.code == 2000) {
                        vueObj.count = dataObj.data.count;
                        vueObj.list = dataObj.data.data;
                        vueObj.loading = false;
                        vueObj.current = currentPage;
                        vueObj.statusNumList = dataObj.data.status[0];
                        vueObj.countdown();
                    }
                }, function () {
                    vueObj.loading = false;
                    vueObj.list = [];
                    vueObj.count = 0;
                });
            },
            countdown() {
                var vueObj = this;
                clearTimeout(vueObj.timer);
                for (var i = 0; i < vueObj.list.length; i++) {
                    if (vueObj.list[i].order_status != "1") {
                        continue;
                    }
                    if (vueObj.list[i].downtime != "") {
                        var timeArr = vueObj.list[i].downtime.split(":");
                        var sec = 0,min = 0,hr = 0;
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

                        if (parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                            vueObj.$set(vueObj.list[i], 'order_status', "6");
                        }
                        else {
                            hr = hr > 9 ? hr : '0' + hr
                            min = min > 9 ? min : '0' + min
                            sec = sec > 9 ? sec : '0' + sec
                            vueObj.$set(vueObj.list[i], 'downtime', hr + ':' + min + ':' + sec);
                            vueObj.$set(vueObj.list[i], 'timeStr', hr + '小时' + min + '分' + sec + '秒');
                        }
                    }
                    else {
                        vueObj.$set(vueObj.list[i], 'timeStr', "");
                        vueObj.$set(vueObj.list[i], 'order_status', "6");
                    }
                }
                // 一秒后递归
                vueObj.timer = setTimeout(function () {
                    vueObj.countdown();
                }, 1000);
            },
            changeStatus(status) {
                $("select[name='order_status']").attr("value", status).initSelect();
                this.getOrder(1);
            },
            changeTransport(ids, cost) {
                // 修改运费
                var vueObj = this;
                $.dialog({
                    title: "修改运费",
                    content: '<div class="fare-box clearfix"><label class="fare-label">*运费：</label><div class="fare-input"><input type="text" class="cjy-input-" name="transport_cost" value="' + cost + '"><span>&nbsp;元</span></div></div>',
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var transportCost = $.trim($("input[name='transport_cost']").val());
                            var totalCost = 0;
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
                                id: ids,
                                transport_cost: transportCost
                            }, function (json) {
                                if (json.code == 2000) {
                                    for (let i = 0; i < vueObj.list.length; i++) {
                                        if (ids === vueObj.list[i].id) {
                                            totalCost = parseFloat(vueObj.list[i].total_cost) - parseFloat(vueObj.list[i].transport_cost) + transportCost;
                                            vueObj.$set(vueObj.list[i], 'total_cost', totalCost.toFixed(3));
                                            vueObj.$set(vueObj.list[i], 'transport_cost', transportCost.toFixed(3));
                                            break;
                                        }
                                    }
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                    $.msgTips({
                                        type: "success",
                                        content: json.msg
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
                $("input[name='transport_cost']").off().on("input", function () {
                    var main = $(this);
                    libs.lenNumber(main[0], 2);
                    var curVal = main.val();
                    if (curVal.length>=2) {
                        if (curVal[1] !== "." && curVal[0] === "0") {
                            main.val(parseFloat(curVal));
                        }
                    }
                });
            },
            changeOrder(ids, oparate) {
                // 修改订单状态
                var reqUrl = '/Seller/Order/' + oparate;
                var isAlert = true;
                var mainTxt = '';
                if (oparate === "cancleOrder") {
                    mainTxt = '您确认取消订单？';
                } else if (oparate === "affirmReceive") {
                    mainTxt = '您确认已收到货款？';
                } else if (oparate === "back_payImg") {
                    mainTxt = '您确认退回凭证？';
                } else if (oparate === "send") {
                    mainTxt = '该订单确认发货？';
                } else if (oparate === "delOrder") {
                    mainTxt = '您确认删除订单？';
                } else {
                    isAlert = false;
                }
                if (isAlert) {
                    $.cueDialog({
                        title: "提示",
                        content: mainTxt,
                        hint: "",
                        callback: function () {
                            $.ajaxForJson(reqUrl, {
                                id: ids
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
                } else {
                    $.ajaxForJson(reqUrl, {
                        id: ids
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
            },
            viewPhoto(urls) {
                $.showPhoto(config.filePath + urls);
            }
        }
    });

    // 搜索
    $(".back_btn_search").off().on("click", function () {
        vm.getOrder(1);
    });

    // 清空
    $(".back_btn_clear").off().on("click", function () {
        $(".back_main_search").find("input").val("");
        $("select[name='order_status']").attr("value", "").initSelect();
    });
});