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
            this.getTenderList(1);
        },
        methods: {
            getTenderList(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + "/ajaxTenderList", {
                    draft: 1,
                    status: $("select[name='status']").val(),
                    type: $("select[name='type']").val(),
                    time: $("input[name='time']").val(),
                    keyWord: $("input[name='keyWord']").val(),
                    sort: $(".back_list_nav").find("span.active").attr("value"),
                    menu: $("input[name='menu']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        $(".back_list_nav").find("span.floatR").html("共计：" + that.count);
                    }
                    that.loading = false;
                });
            },
            delTender(tenderId){
                var that = this;
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '确定删除此条招标信息吗？'],
                    content: '',
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $.ajaxForJson(config.wwwPath + "delDraft", {
                                tenderId: tenderId
                            }, function (dataObj) {
                                if (dataObj.code == "2000") {
                                    $.msgTips({
                                        type: "success",
                                        content: dataObj.msg,
                                        callback:function(){
                                            that.getTenderList();
                                            $(".cjy-bg").remove();
                                            $(".cjy-poplayer").remove();
                                        }
                                    });
                                } else {
                                    $.msgTips({
                                        type: "warning",
                                        content: dataObj.msg
                                    });
                                }
                            });
                        });
                    }
                });
            }
        }
    });

    //检索招标列表
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getTenderList(1);
        return false;
    });
});