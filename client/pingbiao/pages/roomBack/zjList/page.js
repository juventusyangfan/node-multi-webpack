require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    var vm = new Vue({
        el: '#supplier',
        data() {
            return {
                loading: true,
                list: [],
                count: 0,
                limit: 10,
                current: 1,
                sort_type: 1
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
                var reqObj = null;
                reqObj = {
                    key_word: key,
                    collect_type: $("select[name='collect_type']").val(),
                    tender_class: $("select[name='tender_class']").val(),
                    sort: that.sort_type,
                    p: that.current
                }
                $.ajaxForJson(config.pingbiaoPath + 'expert/' + $("input[name='actType']").val(), reqObj, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            },
            changeSort(type) {
                this.sort_type = type;
                this.getSupplier(1);
            }
        }

    });

    //搜索
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getSupplier(1);
        return false;
    });
    //清除
    $(".btn_clear").unbind().bind("click", function () {
        $("select[name='collect_type']").val("").initSelect();
        $("select[name='tender_class']").val("").initSelect();
        $("input[name='company_name']").val("")
        vm.getSupplier(1);
        return false;
    });
});