require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#tenderList',
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
            this.getBidList(1);
        },
        methods: {
            getBidList(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + 'buyer/Payment/refundIndexAjax', {
                    tenderName:$("input[name='tenderName']").val(),
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

    //搜索事件
    $(".back_btn_search").unbind().bind("click", function () {
        vm.getBidList(1);
        return false;
    });

    //清除事件
    $(".back_btn_clear").unbind().bind("click", function () {
        $("input[name='tenderName']").val("");
        vm.getBidList(1);
        return false;
    });
});