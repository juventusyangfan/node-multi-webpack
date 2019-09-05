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
    $(".keyUl li").find("a").unbind().bind("click",function(){
        $(".keyUl li").removeClass("act");
        $(this).parents("li").addClass("act");
        vm.getBidList();
        return false;
    });
});