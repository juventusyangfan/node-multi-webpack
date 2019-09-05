require('cp');
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
            current: 1
        },
        mounted() {
            this.getProductList(1);
        },
        methods: {
            getProductList(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                var listCon = $(".list_sel_con").find("ul");
                var typeId = listCon.eq(0).find(".act").attr("type_id");
                var typeSon = listCon.eq(0).find(".act").attr("type_id_son") || listCon.eq(1).find(".act").attr("type_id_son");
                var backType = listCon.eq(2).find(".act").attr("back_type") || '';
                $.ajaxForJson(config.jcPath + 'Product/ajaxProductList', {
                    type_id: typeId,
                    type_id_son: typeSon,
                    back_type: backType,
                    p: vueObj.current,
                    limit: 12
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data.data;
                        vueObj.count = json.data.count;
                    }
                    vueObj.loading = false;
                    vueObj.$nextTick(function () {
                        $(".intention_btn").off().on("click", function () {
                            if ($(this).attr("login_val") === "-1") {
                                $.loginDialog();
                            } else {
                                $(this).intentionFormFuc();
                            }
                        });
                    });
                });
            }
        }
    });

    $(".list_sel_con").off().on("click", ".list_sel_item", function () {
        var main = $(this);
        var listCon = $(".list_sel_con").find("ul");
        if (listCon.index(main.parents("ul")) === 0) {
            if (main.attr("type_id_son") === "0") {
                $(".list_sel_line").eq(1).hide(400);
                main.parents("ul").find(".list_sel_item").removeClass("act");
                main.addClass("act");
                vm.getProductList(1);
            } else {
                $.ajaxForJson(config.jcPath + 'index/ajaxProType', {
                    type_id: main.attr("type_id")
                }, function (json) {
                    if (json.code == 2000) {
                        var typeArr = json.data.data;
                        var typeHtml = '<li class="list_sel_item act" type_id_son="0">不限</li>';
                        for (var i = 0; i < typeArr.length; i++) {
                            typeHtml += '<li class="list_sel_item" type_id_son="' + typeArr[i].type_id_son + '">' + typeArr[i].type_name + '</li>';
                        }
                        $(".list_sel_line").eq(1).find("ul").html(typeHtml);
                        $(".list_sel_line").eq(1).show(400);
                        main.parents("ul").find(".list_sel_item").removeClass("act");
                        main.addClass("act");
                        vm.getProductList(1);
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: json.msg
                        });
                    }
                });
            }
        } else {
            main.parents("ul").find(".list_sel_item").removeClass("act");
            main.addClass("act");
            vm.getProductList(1);
        }
    });
});