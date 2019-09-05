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
        el: '#financing',
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
            this.getFinancing(1);
        },
        methods: {
            getFinancing(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var key = $.trim($("input[name='company_name']").val());
                $.ajaxForJson(config.wwwPath + 'finance/applyList', {
                    do_apply_status: $("select[name='status']").val(),
                    key_words: $("input[name='company_name']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;

                        for (var i = 0; i < that.list.length; i++) {
                            var _status = '';
                            switch (that.list[i].do_apply_status) {
                                case "1":
                                    _status = "已提交";
                                    break;
                                case "2":
                                    _status = "已提交";
                                    break;
                                case "3":
                                    _status = "受理中";
                                    break;
                                case "4":
                                    _status = "审批拒绝";
                                    break;
                                case "5":
                                    _status = "受理中";
                                    break;
                                case "6":
                                    _status = "受理中";
                                    break;
                                case "7":
                                    _status = "审批通过";
                                    break;
                                case "8":
                                    _status = "放款中";
                                    break;
                                case "9":
                                    _status = "已放款";
                                    break;
                            }
                            that.$set(that.list[i], "statusStr", _status);
                        }
                    }
                    that.loading = false;
                });
            }
        }

    });

    //检索供应商库
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getFinancing(1);
        return false;
    });
    $("input[name='company_name']").unbind().bind("keypress", function (event) {
        if (event.keyCode == "13") {
            $(".btn_confirm").trigger("click");
        }
    });
    //清除
    $(".btn_clear").unbind().bind("click", function () {
        $("select[name='status']").val("").initSelect();
        $("input[name='company_name']").val("");
        vm.getFinancing(1);
        return false;
    });
});