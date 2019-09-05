require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');
import Vue from 'vue'

$(() => {
    var vm = new Vue({
        el: '#supplier',
        data() {
            return {
                loading: false,
                list: [],
                count: 0,
                limit: 10,
                current: 1
            }
        },
        methods: {
            getSupplierAdd(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var key = $.trim($("input[name='company_name']").val()), type = $("input[name='role_type']").val();
                $.ajaxForJson(config.wwwPath + "/companylibrary/dealAdd", {
                    company_name: key,
                    role_type: type,
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.list;
                    }
                    that.loading = false;
                });
            }
        }

    });
    //检索供应商库
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getSupplierAdd(1);
        return false;
    });
    $("input[name='company_name']").unbind().bind("keypress", function (event) {
        if (event.keyCode == "13") {
            $(".btn_confirm").trigger("click");
        }
    });

    //申请成为友商
    $(".back_main_content").on("click", ".back_item_add", function () {
        var main = $(this);

        $.dialog({
            title: "发起邀请",
            content: '<div class="apply_con"><div class="apply_tips"><div class="cjy-layer-center"><span class="msgCon" style="display: block;line-height: normal;margin-left: 0;"><span class="noticeBg"><i class="iconfont icon-i"></i></span>采购商单位可进一步联系供应商单位，以协助供应商单位完成入驻材料的审核和上传！</span></div></div></div>',//<div class="apply_form"><div class="back_main_item"><label>联系人：</label><div class="back_main_block"><input type="text" name="name" class="cjy-input-"></div></div><div class="back_main_item"><label>联系方式：</label><div class="back_main_block"><input type="text" name="name" class="cjy-input-"></div></div></div>
            width: 540,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").off().on("click", function () {
                    $.ajaxForJson(config.wwwPath + "/library/addPost", {
                        join_way: $("input[name='join_way']").val(),
                        company_id: main.parents(".back_list_con").find("input[name='company_id']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            main.parents(".back_list_con").removeClass("hove_add").addClass("hover_done");
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
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
        return false;
    });
});