require('cp');
require('cbp');
require('elem');
require('./page.css');
import Vue from 'vue';
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

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
            buyerName: "", //买家名称
            sellerName: "", //商家名称
            createdStart: "", //开始时间
            createdEnd: "", //结束时间
            status: 0, //商品状态id
            statusNumList: {}, //状态选择计数
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
                vueObj.sellerName = $("input[name='seller_name']").val();
                vueObj.createdStart = $("input[name='created_start']").val();
                vueObj.createdEnd = $("input[name='created_end']").val();
                vueObj.status = $("select[name='join_way']").val();
                var reqUrl = config.shopPath + "/Buyer/Order/ajaxOrderList",
                    reqData = {
                        product_name: vueObj.productName,
                        order_number: vueObj.orderNumber,
                        seller_name: vueObj.sellerName,
                        created_start: vueObj.createdStart,
                        created_end: vueObj.createdEnd,
                        order_status: vueObj.status,
                        p: currentPage,
                        limit: 10
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
                    if (vueObj.list[i].order_status != "2") {
                        continue;
                    }
                    if (vueObj.list[i].pay_img_status == "1") {
                        continue;
                    }
                    if (vueObj.list[i].downtime != "0") {
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
                        } else {
                            hr = hr > 9 ? hr : '0' + hr
                            min = min > 9 ? min : '0' + min
                            sec = sec > 9 ? sec : '0' + sec
                            vueObj.$set(vueObj.list[i], 'downtime', hr + ':' + min + ':' + sec);
                            vueObj.$set(vueObj.list[i], 'timeStr', hr + '小时' + min + '分' + sec + '秒');
                        }
                    } else {
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
                $("select[name='join_way']").attr("value", status).initSelect();
                this.getOrder(1);
            },
            changeMoney(ids) {
                // 付款
                var vueObj = this;
                $.ajaxForJson('/Buyer/Order/ajaxTransportCost', {
                    id: ids
                }, function (json) {
                    if (json.code === 2000) {
                        var status = '3';
                        if (json.data.is_transport_cost === 1) {
                            $.cueDialog({
                                title: "提示",
                                content: "卖家运费已修改哦~",
                                hint: "改前运费：￥" + json.data.transport_cost_old + ",改后运费：￥" + json.data.transport_cost,
                                callback: function () {
                                    $.ajaxForJson('/Buyer/Order/changeOrder', {
                                        id: ids,
                                        order_status: status
                                    }, function (json) {
                                        if (json.code === 2000) {
                                            for (let i = 0; i < vueObj.list.length; i++) {
                                                if (ids === vueObj.list[i].id) {
                                                    vueObj.$set(vueObj.list[i], 'order_status', status);
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
                                }
                            });
                        } else {
                            $.ajaxForJson('/Buyer/Order/changeOrder', {
                                id: ids,
                                order_status: status
                            }, function (json) {
                                if (json.code === 2000) {
                                    for (let i = 0; i < vueObj.list.length; i++) {
                                        if (ids === vueObj.list[i].id) {
                                            vueObj.$set(vueObj.list[i], 'order_status', status);
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
                        }
                    }
                });
            },
            uploadPhoto(ids) {
                // 上传付款凭证
                var vueObj = this;
                var status = '1';
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
                                    for (let i = 0; i < vueObj.list.length; i++) {
                                        if (ids === vueObj.list[i].id) {
                                            vueObj.$set(vueObj.list[i], 'pay_img_status', status);
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
                        });
                    }
                });
            },
            changeOrder(ids, status) {
                // 修改订单状态
                var vueObj = this;
                var mainTxt = null;
                var hintTxt = '';
                var reqData = {
                    id: ids,
                    order_status: status
                };
                var reqUrl = '/Buyer/Order/changeOrder';
                if (status === 5) {
                    mainTxt = '您确认已收到所有货物？';
                    hintTxt = '签收货物后，将无法在线申请退货退款哦，您还要继续吗？';
                } else if (status === 6 || status === 7) {
                    mainTxt = '您确认取消订单？';
                } else if (status === 8) {
                    mainTxt = '您确认申请退款？';
                } else if (status === 1) {
                    mainTxt = '您确认删除订单？';
                    reqData = {
                        id: ids,
                        buyer_delete: status
                    };
                    reqUrl = '/Buyer/Order/editPost';
                }
                $.cueDialog({
                    title: "提示",
                    content: mainTxt,
                    hint: hintTxt,
                    callback: function () {
                        $.ajaxForJson(reqUrl, reqData, function (json) {
                            if (json.code === 2000) {
                                for (let i = 0; i < vueObj.list.length; i++) {
                                    if (ids === vueObj.list[i].id) {
                                        if (status == "1") {
                                            vueObj.$set(vueObj.list[i], 'buyer_delete', status);
                                            vueObj.getOrder(vueObj.currentPage);
                                        } else {
                                            vueObj.$set(vueObj.list[i], 'order_status', status);
                                        }
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
                    }
                });
            }
        }
    });

    // 附件上传
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

    // 查看大图
    $(document).on("click", ".payment-link", function () {
        $.showPhoto($(this).attr("data-url"));
    });

    // 搜索
    $(".back_btn_search").off().on("click", function () {
        vm.getOrder(1);
    });

    // 清空
    $(".back_btn_clear").off().on("click", function () {
        $(".back_main_search").find("input").val("");
        $("select[name='join_way']").attr("value", "").initSelect();
    });
});