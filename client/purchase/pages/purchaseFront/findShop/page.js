require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#shopList',
        data: {
            imgPath: config.filePath,
            loading: true,
            list: [],
            count: 6,
            limit: 6,
            current: 1,
            companyName: libs.getUrlParam("company_name") || "",
            province_code: "",
            city_code: "",
            area_code: "",
            sort: 0
        },
        mounted() {
            this.getShopList(1);
        },
        methods: {
            getShopList(currentPage) {
                var vueObj = this;
                vueObj.current = currentPage || vueObj.current;
                $.ajaxForJson(config.shopPath + "searchShop", {
                    company_name: vueObj.companyName,
                    province_code: vueObj.province_code,
                    city_code: vueObj.city_code,
                    area_code: vueObj.area_code,
                    sort: vueObj.sort
                }, function (dataObj) {
                    if (dataObj.code === 2000) {
                        vueObj.count = dataObj.data.count;
                        if (vueObj.count == 0) {
                            vueObj.current = 0
                        }
                        vueObj.list = dataObj.data.list;
                        $(".all_shop_num").find("span").html(vueObj.count);
                    }
                    vueObj.loading = false;
                });
            }
        }
    });

    //选择人气排序
    $(".select_people").unbind().bind('click', function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            vm.sort = 0;
        }
        else {
            $(this).addClass("active");
            vm.sort = 1;
        }
        vm.getShopList(1);
        return false;
    });

    //监测选择区域
    $("[cjy-area]").initAreaSelect(function () {
        vm.province_code = $("input[name='province_code']").val();
        vm.city_code = $("input[name='city_code']").val();
        vm.area_code = $("input[name='area_code']").val();
        vm.getShopList(1);
    });
});