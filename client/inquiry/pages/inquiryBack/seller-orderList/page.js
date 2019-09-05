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
            loading: true, //loading图
            list: [], //商品列表
            count: 0, //商品总数
            current: 1, //当前分页
            productName: "", //商品名称
            orderNumber: "", //订单号
            companyName: "", //买家名称
            createdStart: "", //开始时间
            createdEnd: "", //结束时间
            status: libs.getUrlParam("status") || "9", //商品状态id
            statusNumList: {
                wait_pay_count: 0,
                wait_receive_count: 0,
                wait_send_count: 0
            }, //状态选择计数
            timer: null
        },
        mounted() {
            var vueObj = this;
            $("select[name='order_status']").attr("value", vueObj.status).initSelect();
            this.getOrder(1);
        },
        methods: {
            getOrder(currentPage) {
                var vueObj = this;
                vueObj.productName = $("input[name='product_name']").val();
                vueObj.orderNumber = $("input[name='order_number']").val();
                vueObj.companyName = $("input[name='quote_company_name']").val();
                vueObj.startTime = $("input[name='start_time']").val();
                vueObj.endTime = $("input[name='end_time']").val();
                vueObj.status = $("select[name='order_status']").val();
                var reqUrl = config.inquiryPath + "/supplier/order/indexAjax",
                    reqData = {
                        product_name: vueObj.productName,
                        order_number: vueObj.orderNumber,
                        company_name: vueObj.companyName,
                        start_time: vueObj.startTime,
                        end_time: vueObj.endTime,
                        status: vueObj.status,
                        p: currentPage
                    };
                $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                    if (dataObj.code == 2000) {
                        vueObj.count = dataObj.data.count;
                        vueObj.list = dataObj.data.data;
                        vueObj.loading = false;
                        vueObj.current = currentPage;
                        vueObj.statusNumList.all_count = dataObj.data.all_count;
                        vueObj.statusNumList.wait_pay_count = dataObj.data.wait_pay_count;
                        vueObj.statusNumList.wait_receive_count = dataObj.data.wait_receive_count;
                        vueObj.statusNumList.wait_send_count = dataObj.data.wait_send_count;
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
                    if (vueObj.list[i].status != "1") {
                        continue;
                    }
                    if (vueObj.list[i].end_time != "") {
                        var timeArr = vueObj.list[i].end_time.split(":");
                        var sec = 0,
                            min = 0,
                            hr = 0,
                            day = 0;
                        if (parseInt(timeArr[3]) == 0) {
                            if (parseInt(timeArr[2]) == 0) {
                                if (parseInt(timeArr[1]) == 0) {
                                    if (parseInt(timeArr[0]) == 0) {
                                        sec = 0;
                                        min = 0;
                                        hr = 0;
                                        day = 0;
                                    } else {
                                        sec = 59;
                                        min = 59;
                                        hr = 23;
                                        day = parseInt(timeArr[0]) - 1;
                                    }
                                } else {
                                    sec = 59;
                                    min = 59;
                                    hr = parseInt(timeArr[1]) - 1;
                                    day = parseInt(timeArr[0]);
                                }
                            } else {
                                sec = 59;
                                min = parseInt(timeArr[2]) - 1;
                                hr = parseInt(timeArr[1]);
                                day = parseInt(timeArr[0]);
                            }
                        } else {
                            sec = parseInt(timeArr[3]) - 1;
                            min = parseInt(timeArr[2]);
                            hr = parseInt(timeArr[1]);
                            day = parseInt(timeArr[0]);
                        }

                        if (parseInt(day) == 0 && parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                            vueObj.$set(vueObj.list[i], 'status', "0");
                            vueObj.$set(vueObj.list[i], 'status_title', "交易关闭");
                        } else {
                            day = day > 9 ? day : '0' + day
                            hr = hr > 9 ? hr : '0' + hr
                            min = min > 9 ? min : '0' + min
                            sec = sec > 9 ? sec : '0' + sec
                            vueObj.$set(vueObj.list[i], 'end_time', day + ':' + hr + ':' + min + ':' + sec);
                            vueObj.$set(vueObj.list[i], 'timeStr', day + '天' + hr + '小时' + min + '分' + sec + '秒');
                        }
                    } else {
                        vueObj.$set(vueObj.list[i], 'timeStr', "");
                        vueObj.$set(vueObj.list[i], 'status', "6");
                    }
                }
                // 一秒后递归
                vueObj.timer = setTimeout(function () {
                    vueObj.countdown();
                }, 1000);
            },
            changeStatus(status) {
                this.status = status;
                window.history.replaceState({}, "订单管理", window.location.origin + window.location.pathname + '?status=' + status);
                $("select[name='order_status']").attr("value", status).initSelect();
                this.getOrder(1);
            },
            changeOrder(ids, oparate) {
                // 修改订单状态
                var reqUrl = config.inquiryPath + '/supplier/order/dealOrder';
                var isAlert = true;
                var mainTxt = '';
                if (oparate === "0") {
                    $.dialog({
                        title: "取消订单",
                        content: '<div class="inquiry-box clearfix"><label class="inquiry-label">原因说明：</label><div class="inquiry-input"><textarea class="cjy-textarea" name="reason" placeholder="请填写取消订单原因" maxlen="100"></textarea></div></div>',
                        cancel: {
                            show: true,
                            name: "取消"
                        },
                        callback: function () {
                            $(".cjy-confirm-btn").unbind().bind("click", function () {
                                $.ajaxForJson(reqUrl, {
                                    id: ids,
                                    status: oparate,
                                    cancel_reason: $("textarea[name='reason']").val()
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
                                return false;
                            });
                        }
                    });
                    isAlert = false;
                } else if (oparate === "3") {
                    mainTxt = '是否确认发货？';
                    reqUrl = config.inquiryPath + '/supplier/order/confirmSend';
                } else if (oparate === "2") {
                    mainTxt = '确认拒绝退款？';
                } else if (oparate === "-1") {
                    mainTxt = '确认申请退款？<br>申请退款后，需等待商家确认';
                } else {
                    isAlert = false;
                }
                if (isAlert) {
                    $.cueDialog({
                        title: "提示",
                        content: mainTxt,
                        hint: "",
                        callback: function () {
                            $.loadingDialog();
                            $.ajaxForJson(reqUrl, {
                                id: ids,
                                status: oparate
                            }, function (json) {
                                if (json.code === 2000) {
                                    $(".cjy-bg").remove();
                                    $(".cjy-show-photo").remove();
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
                }
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