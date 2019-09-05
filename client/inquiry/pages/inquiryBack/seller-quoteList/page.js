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
            inquiryName: "",//询价单名称
            companyName:"",//采购单位名称
            createdStart: "",//开始时间
            createdEnd: "",//结束时间
            status: libs.getUrlParam("status") || "9",//商品状态id
            statusNumList: {},//状态选择计数
            timer: null
        },
        mounted() {
            this.getOrder(1);
        },
        methods: {
            getOrder(currentPage) {
                var vueObj = this;
                vueObj.inquiryName = $("input[name='inquiry_name']").val();
                vueObj.companyName = $("input[name='inquiry_company_name']").val();
                vueObj.createdStart = $("input[name='start_time']").val();
                vueObj.createdEnd = $("input[name='end_time']").val();
                var reqUrl = config.inquiryPath + "/supplier/quote/indexAjax",
                    reqData = {
                        inquiry_name: vueObj.inquiryName,
                        inquiry_company_name: vueObj.companyName,
                        start_time: vueObj.createdStart,
                        end_time: vueObj.createdEnd,
                        status: vueObj.status,
                        p: currentPage
                    };
                $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                    if (dataObj.code == 2000) {
                        vueObj.count = dataObj.data.count;
                        vueObj.list = dataObj.data.data;
                        vueObj.statusNumList.all_count = dataObj.data.all_count;
                        vueObj.statusNumList.not_end_count = dataObj.data.not_end_count;
                        vueObj.statusNumList.quote_count = dataObj.data.quote_count;
                        vueObj.statusNumList.selected_count = dataObj.data.selected_count;
                        vueObj.statusNumList.not_selected_count = dataObj.data.not_selected_count;
                        vueObj.loading = false;
                        vueObj.current = currentPage;
                        for (var i = 0; i < vueObj.list.length; i++) {
                            if (vueObj.list[i].end_days != "") {
                                var timeArr = vueObj.list[i].end_days.split(":");
                                vueObj.$set(vueObj.list[i], 'days', timeArr[0]);
                                vueObj.$set(vueObj.list[i], 'hours', timeArr[1]);
                                vueObj.$set(vueObj.list[i], 'min', timeArr[2]);
                                if(timeArr[0]=="0"&&timeArr[1]=="0"&&timeArr[2]=="0"){
                                    vueObj.$set(vueObj.list[i], 'timeStatus', false);
                                }
                                else{
                                    vueObj.$set(vueObj.list[i], 'timeStatus', true);
                                }
                            }
                        }
                    }
                }, function () {
                    vueObj.loading = false;
                    vueObj.list = [];
                    vueObj.count = 0;
                });
            },
            changeStatus(status) {
                this.status = status;
                window.history.replaceState({}, "报价单管理", window.location.origin + window.location.pathname + '?status=' + status);
                this.getOrder(1);
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