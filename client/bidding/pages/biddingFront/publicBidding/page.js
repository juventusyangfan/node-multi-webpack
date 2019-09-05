require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';
const config = require('configModule');

$(() => {
    $("#bidding").find(".exclusive_list").show();
    var vm = new Vue({
        el: '#bidding',
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
            this.getBidding(1);
        },
        methods: {
            getBidding(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var bidStatus = $(".tender_list").find("a.active").attr("data-value"),
                    wordType = $(".tender_search_area").find("select").val(),
                    wordKey = $.trim($("input[name='wordKey']").val());
                $.ajaxForJson(config.wwwPath + '/ajaxAnnounceList', {
                    bidStatus: bidStatus,
                    wordType: wordType,
                    wordKey: wordKey,
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

    // tab切换
    $(".tender_list a").off().on("click", function () {
        var main = $(this);

        if (!main.hasClass("active")) {
            main.parents(".tender_list").find(".active").removeClass("active");
            main.addClass("active");
            vm.getBidding(1);
        }
    });

    //搜索事件
    $(".tender_search").find("button").unbind().bind("click", function () {
        vm.getBidding(1);
        return false;
    });
    //回车事件
    $("input[name='wordKey']").unbind().bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".tender_search").find("button").triggerHandler("click");
            return false;
        }
    });
});