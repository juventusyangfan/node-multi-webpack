require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#productList',
        data: {
            loading: true,
            list: [],
            count: 0,
            limit: 10,
            current: 1,
            inputIdArr: []
        },
        mounted() {
            this.getProductList();
        },
        methods: {
            getProductList(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                $.ajaxForJson(config.jcPath + 'user/productManage/ajaxProductList', {
                    name: $.trim($("input[name='name']").val()),
                    product_status: $("select[name='product_status']").val(),
                    p: vueObj.current,
                    limit: vueObj.limit
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data.data;
                        vueObj.count = json.data.count;
                        // vueObj.$nextTick(function () {
                        //     $(".select_all").prop("checked", false).initCheckbox();
                        //     $("#productList input[type='checkbox']").prop("checked", false).initCheckbox();
                        // });
                    }
                    vueObj.loading = false;
                });
            }
        }
    });

    // 全选
    // $(".select_all").off().on("change", function () {
    //     var inputArr = $(".customer_table table").find("input[type='checkbox']");
    //     if ($(this).is(":checked")) {
    //         inputArr.prop("checked", true).initCheckbox();
    //     } else {
    //         inputArr.prop("checked", false).initCheckbox();
    //     }
    // });

    // 删除选中
    // $(".del_selected").off().on("click", function () {
    //     var inputArr = $(".customer_table table").find("input[type='checkbox']");
    //     var delId = [];
    //     for (let i = 0; i < inputArr.length; i++) {
    //         if (inputArr.eq(i).is(":checked")) {
    //             delId.push(inputArr.eq(i).attr("data-id"));
    //         }
    //     }
    //     if (delId.length <= 0) {
    //         return false;
    //     }
    //     $.dialog({
    //         title: '提示',
    //         content: '<p style="padding: 0 20px;font-size: 14px;color: #333;">确定要删除选中的产品吗，删除后无法恢复哦~</p>',
    //         width: 400,
    //         confirm: {
    //             show: true,
    //             allow: true,
    //             name: "确认"
    //         },
    //         cancel: {
    //             show: true,
    //             name: "取消"
    //         },
    //         callback: function () {
    //             $(".cjy-cancel-btn").unbind().bind("click", function () {
    //                 $(".cjy-poplayer").remove();
    //                 $(".cjy-bg").remove();
    //                 return false;
    //             });
    //             $(".cjy-confirm-btn").unbind().bind("click", function () {
    //                 $.ajaxForJson(config.jcPath + 'user/ProductOrder/ajaxDelProductOrder', {
    //                     id: delId,
    //                     status: -1
    //                 }, function (json) {
    //                     if (json.code == 2000) {
    //                         for (let j = 0; j < inputArr.length; j++) {
    //                             if (inputArr.eq(j).is(":checked")) {
    //                                 inputArr.eq(j).parents("tr").remove();
    //                             }
    //                         }
    //                         $(".cjy-poplayer").remove();
    //                         $(".cjy-bg").remove();
    //                         $.msgTips({
    //                             type: "success",
    //                             content: json.msg
    //                         });
    //                     } else {
    //                         $(".cjy-poplayer").remove();
    //                         $(".cjy-bg").remove();
    //                         $.msgTips({
    //                             type: "warning",
    //                             content: json.msg
    //                         });
    //                     }
    //                 });
    //                 return false;
    //             });
    //         }
    //     });
    // });

    // 选择条数
    // $("select[name='choose_num']").off().on("change", function () {
    //     vm.limit = $("select[name='choose_num']").val();
    //     vm.getProductList(1);
    // });

    // 筛选查询
    $(".result_btn").off().on("click", function () {
        vm.getProductList(1);
    });

    // 点击行跳转编辑页面
    // $("#productList tbody").on("click", "tr", function (event) {
    //     var main = $(this);
    //     if (event.target.tagName !== "I" && event.target.tagName !== "A") {
    //         window.open(main.attr("data-url"), "_blank");
    //     }
    // });

    // 上架、下架
    $("#productList tbody").on("click", ".upordown", function (event) {
        var main = $(this);
        $.ajaxForJson(config.jcPath + 'user/productManage/ajaxProductStatus', {
            id: main.attr("data-id"),
            product_status: main.attr("data-product_status")
        }, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.reload();
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });

    // 禁止编辑
    $("#productList tbody").on("click", ".no_edit", function () {
        $.msgTips({
            type: "warning",
            content: $(this).attr("data-title")
        });
    });
});