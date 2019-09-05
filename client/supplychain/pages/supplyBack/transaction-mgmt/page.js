require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');
import Vue from 'vue';

$(() => {
    // 筛选查询
    $(".btn_confirm").off().on("click", function () {
        var sBegin = new Date($("input[name='pStartTime']").val()).getTime();
        var sEnd = new Date($("input[name='pEndTime']")).getTime();
        if (sBegin > sEnd) {
            $.msgTips({
                type: "warning",
                content: '公示发布起始时间不能大于结束时间'
            });
            return false;
        }
        vm.getProductList(1);
    });
    //清空查询
    $(".btn_clear").off().on("click",function(){
        $("input[name='tName']").val("");
        $("input[name='pStartTime']").val("");
        $("input[name='pEndTime']").val("")
        $("select[name='gsStatus']").val("").initSelect();
        vm.getProductList(1);
        return false;
    });

    // 获取产品列表
    var vm = new Vue({
        el: '#productList',
        data: {
            loading: true,
            list: [],
            count: 0,
            limit: 10,
            current: 1,
            inputIdArr: []
        },
        mounted() {
            this.getProductList(1);
        },
        methods: {
            getProductList(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                $.ajaxForJson(config.jcPath + 'user/bankIndex/tenderListAjax', {
                    tName: $.trim($("input[name='tName']").val()),
                    pStartTime: $.trim($("input[name='pStartTime']").val()),
                    pEndTime: $.trim($("input[name='pEndTime']").val()),
                    gsStatus: $("select[name='gsStatus']").val(),
                    p: vueObj.current,
                    limit: vueObj.limit
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data.data;
                        vueObj.count = json.data.count;
                    }
                    vueObj.loading = false;
                });
            }
        }
    });

});