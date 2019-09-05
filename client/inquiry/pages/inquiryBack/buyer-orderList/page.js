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
            companyName: "", //商家名称
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
                vueObj.companyName = $("input[name='inquiry_company_name']").val();
                vueObj.startTime = $("input[name='start_time']").val();
                vueObj.endTime = $("input[name='end_time']").val();
                vueObj.status = $("select[name='order_status']").val();
                var reqUrl = config.inquiryPath + "/purchaser/order/indexAjax",
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
                var reqUrl = config.inquiryPath + '/purchaser/order/dealOrder';
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
                } else if (oparate === "4") {
                    mainTxt = '确认收货后，被冻结的货款将会打至商家账户，您还要继续吗？';
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
            },
            commentDialog(orderId) {
                var commentHTML = '<div class="back_comment_right"><div class="back_comment_star"><span>商品满意度</span><span class="back_star_con" point="0"><i></i><i></i><i></i><i></i><i></i></span><span class="starTxt">4星</span><span class="starDes">满意</span></div><textarea class="cjy-textarea" maxlen="200" style="width: 730px;height: 90px;" placeholder="请您根据本次交易，给予真实、客观、仔细的评价，您的评价将是其他采购商的参考，也将影响卖家的信用"></textarea><div class="back_comment_imgs"><span class="js_upload"><i class="iconfont icon-shangchuanzhaopian"></i></span><div id="process-files"></div></div></div>'//<a href="javascript:;" class="back_imgs_add"><input type="file" id="uploadFile1" name="uploadFile" style="position: absolute;width: 100%;height: 100%;top: 0;right: 0;padding: 0;opacity: 0;cursor: pointer;"><i class="iconfont icon-shangchuanzhaopian"></i></a>
                $.dialog({
                    title: "供应商评价",
                    content: commentHTML,
                    width: 800,
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    callback: function () {
                        $(".back_comment_right textarea.cjy-textarea").initTextarea();
                        //满意度打分
                        var timer = null;
                        $(".back_star_con i").unbind().bind({
                            mouseover: function () {
                                clearTimeout(timer);
                                var index = $(this).index(),
                                    starCon = $(this).parent();
                                starCon.find("i").removeClass("act");
                                for (var i = 0; i <= index; i++) {
                                    starCon.find("i").eq(i).addClass("act");
                                }
                            },
                            mouseout: function () {
                                var starCon = $(this).parent(),
                                    point = starCon.attr("point");
                                timer = setTimeout(function () {
                                    starCon.find("i").removeClass("act");
                                    for (var i = 1; i <= parseInt(point); i++) {
                                        starCon.find("i").eq(i - 1).addClass("act");
                                    }
                                }, 200);
                            },
                            click: function () {
                                var index = $(this).index() + 1;
                                $(this).parent().attr("point", index);
                                var des = "";
                                switch (index) {
                                    case 1:
                                        des = "非常不满意";
                                        break;
                                    case 2:
                                        des = "不满意";
                                        break;
                                    case 3:
                                        des = "一般";
                                        break;
                                    case 4:
                                        des = "满意";
                                        break;
                                    case 5:
                                        des = "非常满意";
                                        break;
                                }
                                $(this).parents(".back_comment_star").find(".starTxt").show().html(index + "星");
                                $(this).parents(".back_comment_star").find(".starDes").show().html(des);
                            }
                        });

                        //图片上传
                        $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                            if ($(".back_comment_imgs").find(".back_imgs_cell").length >= 9) {
                                $.msgTips({
                                    type: "warning",
                                    content: "最多上传9张图片"
                                });
                                return false;
                            }
                            $(".js_upload").before('<a href="javascript:;" class="back_imgs_cell"><i class="imgs_del iconfont icon-cha1"></i><img src="' + config.filePath + url + '"><input type="hidden" name="picPath" value="' + url + '"></a>');
                            $(".back_comment_imgs").on("click", ".imgs_del", function () {
                                $(this).parent().remove();
                                return false;
                            });
                        }, {
                            allowedFileTypes: ['image/*'],
                            extArr: ['jpg', 'png', 'jpeg', 'bmp']
                        });
                        //图片上传
                        // $(document).on("click", "input[name='uploadFile']", function () {
                        //     if ($(this).parents(".back_comment_imgs").find(".back_imgs_cell").length >= 9) {
                        //         $.msgTips({
                        //             type: "warning",
                        //             content: "最多上传9张图片"
                        //         });
                        //         return false;
                        //     }
                        //     $("input[name='uploadFile']").unbind().bind("change", function () {
                        //         var id = $(this).attr("id");
                        //         document.domain = config.domainStr;
                        //         $.ajaxFileUpload({
                        //             url: config.inquiryPath + 'uploadImg',
                        //             secureuri: config.domainStr,
                        //             fileElementId: id,
                        //             data: {
                        //                 name: "uploadFile"
                        //             },
                        //             success: function success(data) {
                        //                 var dataObj = eval('(' + data + ')');
                        //                 if (dataObj.code == 2000) {
                        //                     $("#" + id).parents(".back_imgs_add").before('<a href="javascript:;" class="back_imgs_cell"><i class="imgs_del iconfont icon-cha1"></i><img src="' + config.filePath + dataObj.data + '"><input type="hidden" name="picPath" value="' + dataObj.data + '"></a>');
                        //                     $(".back_comment_imgs").on("click", ".imgs_del", function () {
                        //                         $(this).parent().remove();
                        //                         return false;
                        //                     });
                        //                 } else {
                        //                     $.msgTips({
                        //                         type: "warning",
                        //                         content: dataObj.msg
                        //                     });
                        //                 }
                        //             },
                        //             error: function error(data, status) {
                        //                 $.msgTips({
                        //                     type: "warning",
                        //                     content: "系统错误"
                        //                 });
                        //             }
                        //         });
                        //     });
                        // });

                        //删除图片
                        $(".back_comment_con").on("click", ".imgs_del", function () {
                            $(this).parent().remove();
                            return false;
                        });

                        //提交评论
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var main = $(".back_comment_right"),
                                level = main.find(".back_star_con").attr("point"),
                                ajaxKey = true;
                            if ($(".cjy-textarea-error").length > 0) {
                                ajaxKey = false;
                                $.msgTips({
                                    type: "warning",
                                    content: "评论文字过长"
                                });
                                return false;
                            }
                            if (level == "0") {
                                ajaxKey = false;
                                $.msgTips({
                                    type: "warning",
                                    content: "请给商品满意度进行评分！"
                                });
                                return false;
                            }
                            var describeArr = [];
                            for (var i = 0; i < main.find("input[name='picPath']").length; i++) {
                                describeArr.push(main.find("input[name='picPath']").eq(i).val());
                            }
                            if (ajaxKey) {
                                $.ajaxForJson(config.inquiryPath + "/purchaser/order/addEvaluate", {
                                    order_id: orderId,
                                    satisfaction_level: level,
                                    describe_url: describeArr,
                                    describe: main.find(".cjy-textarea").val()
                                }, function (dataObj) {
                                    if (dataObj.code == 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: dataObj.msg
                                        });
                                        setTimeout(function () {
                                            window.location.reload();
                                        }, 1000);
                                    } else {
                                        $.msgTips({
                                            type: "warning",
                                            content: dataObj.msg
                                        });
                                    }
                                });
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: "请评论完所有商品"
                                });
                            }
                            return false;
                        });
                    }
                });
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