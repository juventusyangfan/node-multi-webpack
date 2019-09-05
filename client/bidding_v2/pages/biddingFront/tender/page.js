require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    //banner轮播
    $(".js_slides").initPicPlayer();

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
                $.ajaxForJson(config.wwwPath + "tenderAjax", {
                    cglx: $(".tender_type_wrap[data-type='cglx']").find("li.active").attr("data-id"),
                    cgzt: $(".tender_type_wrap[data-type='cgzt']").find("li.active").attr("data-id"),
                    cgfs: $(".tender_type_wrap[data-type='cgfs']").find("li.active").attr("data-id"),
                    stype: $(".tender_search").find("dl dd.act").attr("data-id"),
                    sword: $(".tender_search").find("input.tender_search_input").val(),
                    sort: $("ul[name='sort']").find("li.active").attr("data-id"),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        $("#exclusive").find(".showAnimate").show();
                    }
                    that.loading = false;
                });
            },
            showTips(val) {
                $.msgTips({
                    type: "warning",
                    content: val
                });
            }
        }
    });

    //选择类型
    $("div.tender_type_wrap li a").unbind().bind("click", function () {
        var main = $(this);
        main.parents(".tender_type_wrap").find("li").removeClass("active");
        main.parent().addClass("active");
        vm.getExclusive(1);
        return false;
    });

    //选择搜索类型
    $(".tender_search").find("dd").unbind().bind("click", function () {
        $(".tender_search").find("dd").removeClass("act");
        $(this).addClass("act");
        $(".tender_search_sel > span").html($(this).html());
        $(".tender_search").find("dl").hide();
    });
    $(".tender_search_sel").unbind().bind({
        "mouseover": function () {
            $(".tender_search_sel").find("dl").show();
        },
        "mouseleave": function () {
            $(".tender_search_sel").find("dl").hide();
        }
    });

    //点击搜索事件
    $(".tender_search").find("a.tender_search_btn").unbind().bind("click", function () {
        vm.getExclusive(1);
        return false;
    });

    //清空搜索
    $(".tender_select").find("a.tender_clear_btn").unbind().bind("click", function () {
        $(".tender_search").find("input.tender_search_input").val("");
        vm.getExclusive(1);
        return false;
    });


    //回车事件
    $(".tender_search").find("input.tender_search_input").unbind().bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".tender_search").find("a.tender_search_btn").triggerHandler("click");
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