require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#project',
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
            this.getProject(1);
            $("[calendar]").initCalendar();
        },
        methods: {
            getProject(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var key = $.trim($("input[name='keyWord']").val()), time = $("input[name='time']").val();
                $.ajaxForJson(config.wwwPath + "/ajaxItemList", {
                    time: time,
                    keyWord: key,
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

    //条件搜索项目
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getProject(1);
        return false;
    });
    //回车事件
    $("input[name='keyWord']").unbind().bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".btn_confirm").triggerHandler("click");
            return false;
        }
    });

});