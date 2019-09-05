require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    $("#exclusive").find(".tender_main_content").show();
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
        },
        methods: {
            getProject(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + "buyer/Project/indexAjax", {
                    projectClass: $("select[name='projectClass']").val(),
                    projectStatus: $("select[name='projectStatus']").val(),
                    projectTitle: $.trim($("input[name='projectTitle']").val()),
                    projectUser: $.trim($("input[name='projectUser']").val()),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            },
            delProject(id) {
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '确定删除此项目吗？'],
                    content: '',
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $.ajaxForJson(config.wwwPath + "buyer/Project/deleteAjax", {
                                id: id
                            }, function (obj) {
                                if (obj.code == 2000) {
                                    $.msgTips({
                                        type: "success",
                                        content: obj.msg,
                                        callback: function () {
                                            $(".cjy-cancel-btn").trigger("click");
                                            vm.getProject();
                                        }
                                    });
                                } else {
                                    $(".cjy-cancel-btn").trigger("click");
                                    $.msgTips({
                                        type: "warning",
                                        content: obj.msg
                                    });
                                }
                            });
                        });
                    }
                });
            }
        }
    });

    //搜索事件
    $(".back_btn_search").unbind().bind("click", function () {
        vm.getProject(1);
        return false;
    });

    //清除事件
    $(".back_btn_clear").unbind().bind("click", function () {
        $("select[name='projectClass']").val("").initSelect();
        $("select[name='projectStatus']").val("").initSelect();
        $("input[name='projectTitle']").val("");
        $("input[name='projectUser']").val("");
        vm.getProject(1);
        return false;
    });

});