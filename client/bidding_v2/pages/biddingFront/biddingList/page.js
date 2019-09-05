require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#exclusive',
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
            this.getExclusive(1);
        },
        methods: {
            getExclusive(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $("#exclusive").find(".showAnimate").hide();
                var _data = null;
                if ($(".bidList_search_sel > span").html() == "公示名称") {
                    _data = {
                        search: {
                            notice_type: $("ul[name='sort']").find("li.active").attr("data-type"),
                            tender_name: $("input.bidList_search_input").val()
                        },
                        p: that.current
                    }
                } else {
                    _data = {
                        search: {
                            notice_type: $("ul[name='sort']").find("li.active").attr("data-type"),
                            company_name: $("input.bidList_search_input").val()
                        },
                        p: that.current
                    }
                }
                $.ajaxForJson(config.wwwPath + "winBidListAjax", _data, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        $("#exclusive").find(".showAnimate").show();
                    }
                    that.loading = false;
                });
            }
        }
    });

    //选择搜索类型
    $(".bidList_search").find("dd").unbind().bind("click", function () {
        $(".bidList_search").find("dd").removeClass("act");
        $(this).addClass("act");
        $(".bidList_search_sel > span").html($(this).html());
        $(".bidList_search").find("dl").hide();
    });
    $(".bidList_search_sel").unbind().bind({
        "mouseover": function () {
            $(".bidList_search_sel").find("dl").show();
        },
        "mouseleave": function () {
            $(".bidList_search_sel").find("dl").hide();
        }
    });

    //点击搜索事件
    $(".bidList_search").find("a.bidList_search_btn").unbind().bind("click", function () {
        vm.getExclusive(1);
        return false;
    });

    //清空搜索
    $(".tender_select").find("a.tender_clear_btn").unbind().bind("click", function () {
        $(".bidList_search").find("input.bidList_search_input").val("");
        vm.getExclusive(1);
        return false;
    });


    //回车事件
    $(".bidList_search").find("input.bidList_search_input").unbind().bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".bidList_search").find("a.bidList_search_btn").triggerHandler("click");
            return false;
        }
    });

    //排序事件
    $("ul[name='sort']").find("li a").unbind().bind("click", function () {
        var main = $(this);
        $("ul[name='sort']").find("li").removeClass("active");
        main.parent().addClass("active");
        vm.getExclusive(1);
        return false;
    });
});