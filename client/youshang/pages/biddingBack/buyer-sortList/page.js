require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#supplier',
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
            this.getSupplier(1);
        },
        methods: {
            getSupplier(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var key = $.trim($("input[name='company_name']").val());
                $.ajaxForJson(config.youshangPath + 'purchaser/index/supplierTypeListAjax', {
                    supplier_name: key,
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
    //搜索
    $(".btn_confirm").unbind().bind("click",function(){
        vm.getSupplier(1);
        return false;
    });
    //输入名称回车事件
    $("input[name='company_name']").unbind().bind("keyup",function(){
        if (event.keyCode == "13") {
            vm.getSupplier(1);
            return false;
        }
    });
    //清除
    $(".btn_clear").unbind().bind("click",function(){
        $("input[name='company_name']").val("")
        vm.getSupplier(1);
        return false;
    });
});