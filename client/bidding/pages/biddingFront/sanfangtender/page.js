require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    $("#tender").find(".exclusive_list").show();
    var vm = new Vue({
        el: '#tender',
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
            this.getTenders(1);
        },
        methods: {
            getTenders(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var elSelect = $(".tender_search_area select");
                var reqData = null;
                if (elSelect.val() === "name") {
                    reqData = {
                        name: $(".tender_search_area .cjy-input-").val(),
                        type: $(".tender_list").eq(1).find(".active").attr("type"),
                        province_code: $(".tender_list").eq(0).find(".active").attr("province_code"),
                        p: that.current
                    };
                } else {
                    reqData = {
                        bid_company: $(".tender_search_area .cjy-input-").val(),
                        type: $(".tender_list").eq(1).find(".active").attr("type"),
                        province_code: $(".tender_list").eq(0).find(".active").attr("province_code"),
                        p: that.current
                    };
                }
                $.ajaxForJson(config.wwwPath + 'thirdbid/thirdbidlist', reqData, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.list;
                    }
                    that.loading = false;
                });
            }
        }
    });

    // 获取分页列表
    var getThirdBidList = function (options) {
        var elSelect = $(".tender_search_area select");
        var reqData = null;
        if (elSelect.val() === "name") {
            reqData = {
                name: $(".tender_search_area .cjy-input-").val(),
                type: $(".tender_list").eq(1).find(".active").attr("type"),
                province_code: $(".tender_list").eq(0).find(".active").attr("province_code")
            };
        } else {
            reqData = {
                bid_company: $(".tender_search_area .cjy-input-").val(),
                type: $(".tender_list").eq(1).find(".active").attr("type"),
                province_code: $(".tender_list").eq(0).find(".active").attr("province_code")
            };
        }
        $("#pages").ajxForPage(config.wwwPath + 'thirdbid/thirdbidlist', reqData);
    };

    // 获取列表
    $(".tender_search button").off().on("click", function () {
        vm.getTenders(1);
    });

    //回车事件
    $(".tender_search_area .cjy-input-").unbind().bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".tender_search").find("button").triggerHandler("click");
            return false;
        }
    });

    // tab切换
    $(".tender_list a").off().on("click", function () {
        var main = $(this);

        if (!main.hasClass("active")) {
            main.parents(".tender_list").find(".active").removeClass("active");
            main.addClass("active");
            vm.getTenders(1);
        }
    });
});