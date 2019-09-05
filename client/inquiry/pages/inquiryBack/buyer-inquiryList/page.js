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
            title: "",//询价单名称
            createdStart: "",//开始时间
            createdEnd: "",//结束时间
            status: libs.getUrlParam("status") || "", //商品状态id
            statusNumList: [],//状态选择计数
            statusname: ['全部询价单', '我的草稿箱', '等待报价中', '待选供应商', '已生成订单'], //状态名称
            timer: null
        },
        mounted() {
            this.getOrder(1);
        },
        methods: {
            getOrder(currentPage) {
                var vueObj = this;
                vueObj.title = $("input[name='title']").val();
                vueObj.createdStart = $("input[name='created_start']").val();
                vueObj.createdEnd = $("input[name='created_end']").val();
                var reqUrl = config.inquiryPath + "/purchaser/inquiry/indexAjax",
                    reqData = {
                        title: vueObj.title,
                        start_time: vueObj.createdStart,
                        end_time: vueObj.createdEnd,
                        status: vueObj.status,
                        p: currentPage
                    };
                $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                    if (dataObj.code == 2000) {
                        vueObj.count = dataObj.data.inquiry_list.count;
                        vueObj.list = dataObj.data.inquiry_list.data;
                        vueObj.statusNumList = dataObj.data.inquiry_status_count;
                        for (var i = 0; i < vueObj.statusNumList.length; i++) {
                            vueObj.$set(vueObj.statusNumList[i], 'status_Name', vueObj.statusname[i]);
                        }
                        vueObj.loading = false;
                        vueObj.current = currentPage;
                    }
                }, function () {
                    vueObj.loading = false;
                    vueObj.list = [];
                    vueObj.count = 0;
                });
            },
            changeStatus(status) {
                this.status = status;
                window.history.replaceState({}, "询价单管理", window.location.origin + window.location.pathname + '?status=' + status);
                this.getOrder(1);
            },
            changeOrder(ids) {
                // 修改订单状态
                var reqUrl = '/purchaser/inquiry/delete';
                $.cueDialog({
                    title: "提示",
                    content: "您确认删除该询价单？",
                    hint: "",
                    callback: function () {
                        $.ajaxForJson(reqUrl, {
                            inquiry_id: ids
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
        vm.getOrder(1);
    });
});