require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
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
                apply: {},
                limit: 10,
                current: 1,
                status: '',
                statusOtherId: null,
                moneyStatus: {
                    '-1': '（<i class="status3"></i>凭证未通过）',
                    '1': '（<i class="status1"></i>待确认）',
                    '2': '（<i class="status4"></i>凭证已通过）'
                },
                statusOther: '更多'
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
                $.ajaxForJson(config.wwwPath + 'buyer/tender/listAjax', {
                    status: that.status,
                    type: $("select[name='type']").val(),
                    class: $("select[name='class']").val(),
                    tab: $("input[name='tab']").val(),
                    keyword: $("input[name='keyword']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        that.apply = dataObj.data.num;
                    }
                    that.loading = false;
                });
            },
            changeStatus(id, name) {
                if (id != null) {
                    this.status = id;
                }
                if (name) {
                    this.statusOther = name;
                    this.statusOtherId = id;
                } else {
                    this.statusOther = '更多';
                    this.statusOtherId = 0;
                }
                this.getTenderList(1);
            }
        }
    });


    //搜索确认事件
    $(".back_btn_search").unbind().bind("click", function () {
        vm.getTenderList(1);
        return false;
    });
    //清空搜索事件
    $(".back_btn_clear").unbind().bind("click", function () {
        $("input[name='keyword']").val("");
        $("select[name='type']").val("").initSelect();
        $("select[name='class']").val("").initSelect();
        vm.getTenderList(1);
        return false;
    });

    // 删除、归档
    $("#tenderList").on("click", ".js_del", function () {
        var that = $(this);
        var tender_id = that.parents("tr").attr("tender-id"),
            _type = that.attr("data-type");
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '是否' + that.html() + '该条招标信息？'],
            content: '',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + 'buyer/tender/statusAjax', {
                        tenderId: tender_id,
                        type: _type
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    vm.getTenderList();
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
    });

    //选择招标方式
    $(".back_btn_publish").unbind().bind("click", function () {
        $.dialog({
            title: '选择招标方式',
            content: '<div class="rateTypeDlg-content"><a href="javascript:;" class="rateType_cell selected" data-id="1"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i><i class="typeIcon gkzbIcon"></i><span class="typeName">公开招标</span></a><a href="javascript:;" class="rateType_cell" data-id="2"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i><i class="typeIcon yqzbIcon"></i><span class="typeName">邀请招标</span></a><a href="javascript:;" class="rateType_cell" data-id="4"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i><i class="typeIcon gkxbjIcon"></i><span class="typeName">公开询比价</span></a><a href="javascript:;" class="rateType_cell" data-id="5"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i><i class="typeIcon yqxbjIcon"></i><span class="typeName">邀请询比价</span></a><a href="javascript:;" class="rateType_cell" data-id="3"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i><i class="typeIcon jzxtpIcon"></i><span class="typeName">竞争性谈判</span></a></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
                name: "取消"
            },
            callback: function () {
                //选择评标方式
                $(".rateType_cell").unbind().bind("click", function () {
                    $(".rateType_cell").removeClass("selected");
                    $(this).addClass("selected");
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    var _id = $(".rateTypeDlg-content").find("a.selected").attr("data-id");
                    window.location.href = config.wwwPath + "buyer/tender/add/" + _id + "_1_0.html";
                });
            }
        });
        return false;
    });
});