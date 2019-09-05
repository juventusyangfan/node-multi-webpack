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
                order_type: 1,
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
                $.ajaxForJson(config.youshangPath + 'purchaser/invitation/auditListAjax', {
                    supplier_name: key,
                    status: $("select[name='status']").val(),
                    join_way: $("select[name='join_way']").val(),
                    order_type: that.order_type,
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            },
            inviteDel(id, circleId) {
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '确认删除？'],
                    content: '<div style="padding:20px 30px;">删除后，将中断该供应商的加入流程；未审批通过的供应商需要重新申请或邀请。</div>',
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $.ajaxForJson(config.youshangPath + "purchaser/invitation/delete", {
                                id: id,
                                circle_id: circleId
                            }, function (dataObj) {
                                if (dataObj.code == "2000") {
                                    $.msgTips({
                                        type: "success",
                                        content: dataObj.msg
                                    });
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 1000);
                                } else {
                                    $.msgTips({
                                        type: "warning",
                                        content: dataObj.msg
                                    });
                                }

                            });
                            return false;
                        });
                    }
                });
            },
            changeSort() {
                if (this.order_type != 1) {
                    this.order_type = 1;
                } else {
                    this.order_type = 2;
                }
                this.getSupplier(1);
            }
        }

    });

    //搜索
    $(".btn_confirm").unbind().bind("click", function () {
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
    $(".btn_clear").unbind().bind("click", function () {
        $("select[name='status']").val("").initSelect();
        $("select[name='join_way']").val("").initSelect();
        $("input[name='company_name']").val("")
        vm.getSupplier(1);
        return false;
    });
});