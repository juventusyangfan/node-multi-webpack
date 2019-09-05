require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');
const libs = require('libs');

$(() => {
    $("#exclusive").find(".exclusive_list").show();

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
            //初始化链接参数
            if (libs.getUrlParam("e")) {
                $("div[name='collectType']").find("a").removeClass("active");
                $("div[name='collectType']").find("a[data-id='" + libs.getUrlParam("e") + "']").addClass("active");
            }
            else if (libs.getUrlParam("s")) {
                $("div[name='tenderStatus']").find("a").removeClass("active");
                $("div[name='tenderStatus']").find("a[data-id='" + libs.getUrlParam("s") + "']").addClass("active");
            }
            else if (libs.getUrlParam("c")) {
                $("div[name='tenderClass']").find("a").removeClass("active");
                $("div[name='tenderClass']").find("a[data-id='" + libs.getUrlParam("c") + "']").addClass("active");
            }
            if (libs.getUrlParam("wordType")) {
                $("select[name='wordType']").attr("value", libs.getUrlParam("wordType")).initSelect();
            }
            if (libs.getUrlParam("keyWord")) {
                $("input[name='keyWord']").val(decodeURIComponent(libs.getUrlParam("keyWord")));
            }
            window.history.replaceState({}, "独家集采", window.location.origin + window.location.pathname);
            this.getExclusive(1);
        },
        methods: {
            getExclusive(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var collectType = $("div[name='collectType'] a.active").attr("data-id"),
                    tenderStatus = $("div[name='tenderStatus'] a.active").attr("data-id"),
                    tenderClass = $("div[name='tenderClass'] a.active").attr("data-id"),
                    wordType = $("select[name='wordType']").val(),
                    keyWord = $("input[name='keyWord']").val(),
                    sort = $("div[name='sort']").find("span.active").attr("data-id");
                $.ajaxForJson(config.wwwPath + "/ajaxExclusiveList", {
                    collectType: collectType,
                    tenderStatus: tenderStatus,
                    tenderClass: tenderClass,
                    wordType: wordType,
                    keyWord: keyWord,
                    sort: sort,
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
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
    $("div[name='collectType'] a,div[name='tenderStatus'] a,div[name='tenderClass'] a").unbind().bind("click", function () {
        var main = $(this);
        if (main.parent().attr("name") == "collectType") {
            var index = main.index();
            if (index > 2) {
                $("div[name='tenderStatus'] a").eq(2).html("报价中");
                $("div[name='tenderStatus'] a").eq(3).html("报价已截止");
                $("div[name='tenderStatus'] a").eq(4).html("已成交");
            }
            else {
                $("div[name='tenderStatus'] a").eq(2).html("投标中");
                $("div[name='tenderStatus'] a").eq(3).html("已截标");
                $("div[name='tenderStatus'] a").eq(4).html("已定标");
            }
        }
        main.parent().find("a").removeClass("active");
        main.addClass("active");
        vm.getExclusive(1);
        return false;
    });

    //点击搜索事件
    $(".tender_search").find("button").unbind().bind("click", function () {
        vm.getExclusive(1);
        return false;
    });

    //回车事件
    $("input[name='keyWord']").unbind().bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".tender_search").find("button").triggerHandler("click");
            return false;
        }
    });

    //排序事件
    $("div[name='sort']").find("span").unbind().bind("click", function () {
        var main = $(this);
        main.parent().find("span").removeClass("active");
        main.addClass("active");
        vm.getExclusive(1);
        return false;
    });
});