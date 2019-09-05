require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    $("#findgys").find(".findgys_item_content").show();
    var vm = new Vue({
        el: '#findgys',
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
            this.getGys(1);
        },
        methods: {
            getGys(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var elActive = $(".side_nav_ul").find(".active");
                var materialId = "", orders = null;
                if (elActive.length !== 0) {
                    materialId = elActive.attr("cata_id");
                }
                orders = $(".tabs_select .active").attr("order");
                $.ajaxForJson(config.wwwPath + 'supply/supplylist', {
                    id: materialId,
                    order: orders,
                    company_name: $.trim($("input[name='company_name']").val()),
                    province_code: $("select[name='province_code']").val(),
                    city_code: $("select[name='city_code']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.list;
                        that.$nextTick(function () {
                            getHeightFuc();
                        });
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

    // 计算高度
    var getHeightFuc = function () {
        $(".side_nav_ul").removeAttr("style");
        var listH = $(".findgys_list").outerHeight();
        var sideH = $(".side_nav_ul").outerHeight();
        if (listH > sideH) {
            $(".side_nav_ul").css("min-height", listH + "px");
        }
    };

    // 轮播
    $(".js_slides").initPicPlayer();

    // 修改公司展示页面的box的宽
    var changeCompanylist = function () {
        var rollEl = $(".company_position_inner");
        var widthEl = rollEl.find(".company_position_item");
        var totalWidth = widthEl.eq(0).outerWidth() * widthEl.length;
        rollEl.css({
            "width": totalWidth + "px",
            "left": '0px'
        });

        if (totalWidth > 1180) {
            $(".company_position_area").off().on({
                mouseover: function () {
                    $(".scroll_btn").css("display", "block");
                },
                mouseout: function () {
                    $(".scroll_btn").css("display", "none");
                }
            });
        }
    }
    changeCompanylist();

    // 广告
    $(".scroll_btn span").off().on("click", function () {
        var main = $(this);
        var rollEl = $(".company_position_inner");
        var len = rollEl.find(".company_position_item").length;
        if (len <= 5) {
            return false;
        }
        var widthEl = rollEl.find(".company_position_item").eq(0).outerWidth();
        var cloneDom = null;
        if (main.hasClass("scroll_left")) {
            widthEl = parseInt(widthEl);
            cloneDom = rollEl.find(".company_position_item").eq(len - 1).clone(true, true);
            rollEl.find(".company_position_item").eq(len - 1).remove();
            rollEl.prepend(cloneDom).css({
                "left": -+widthEl + 'px'
            });
            rollEl.stop(true, true).animate({
                "left": '0px'
            }, 500);
        } else {
            widthEl = parseInt(-+widthEl);
            rollEl.stop(true, true).animate({
                "left": widthEl + 'px'
            }, 500, function () {
                cloneDom = rollEl.find(".company_position_item").eq(0).clone(true, true);
                rollEl.find(".company_position_item").eq(0).remove();
                rollEl.append(cloneDom).css({
                    "left": '0px'
                });
            });
        }
    });

    // ajax方法 - 物资分类
    var getmMterialFuc = function (options) {
        var elActive = $(".side_nav_ul").find(".active");
        var materialId = "", orders = null;
        if (elActive.length !== 0) {
            materialId = elActive.attr("cata_id");
        }
        orders = $(".tabs_select .active").attr("order");
        $(".page_container_wrap").ajxForPage(config.wwwPath + 'supply/supplylist', {
            id: materialId,
            order: orders,
            company_name: $.trim($("input[name='company_name']").val()),
            province_code: $("select[name='province_code']").val(),
            city_code: $("select[name='city_code']").val()
        }, function () {
            getHeightFuc();
        });
    };
    //getmMterialFuc();

    var getProvinceFuc = function () {
        $.ajaxJSONP(config.papiPath + "api/common/getProvince", null, function (json) {
            if (json.code == "2000") {
                var optHtml = '<option value="">不限省份</option>';
                for (let i = 0; i < json.data.length; i++) {
                    optHtml += '<option value="' + json.data[i].id + '">' + json.data[i].name + '</option>';
                }
                $(".finggys_search select").eq(0).html(optHtml);
                $(".finggys_search select").eq(0).initSelect();
            }
        }, "json");
    };
    getProvinceFuc();

    $("select[name='province_code']").off().on("change", function () {
        var main = $(this);
        if (main.val() !== "") {
            $.ajaxJSONP(config.papiPath + "/api/common/getCity", {
                pid: main.val()
            }, function (json) {
                if (json.code == "2000") {
                    var optHtml = '<option value="">不限市/州</option>';
                    for (let i = 0; i < json.data.length; i++) {
                        optHtml += '<option value="' + json.data[i].id + '">' + json.data[i].name + '</option>';
                    }
                    $(".finggys_search select").eq(1).html(optHtml);
                    $(".finggys_search select").eq(1).initSelect();
                    vm.getGys(1);
                }
            }, "json");
        } else {
            $(".finggys_search select").eq(1).html('<option value="">不限市/州</option>').initSelect();
            vm.getGys(1);
        }
    });
    $("select[name='city_code']").off().on("change", function () {
        vm.getGys(1);
    });


    $(".finggys_search button").off().on("click", function () {
        vm.getGys(1);
    });

    $("input[name='company_name']").unbind().bind("keyup", function (event) {
        if (event.keyCode == "13") {
            $(".finggys_search button").triggerHandler("click");
            return false;
        }
    });

    // 展开第一层
    $(".side_nav_alink").off().on("click", function () {
        var main = $(this);
        var oUl = $(".side_nav_ul");
        var oParent = main.parents(".side_nav_one");
        var animateEl = null;
        var strHeight = null;
        if (oParent.hasClass("layer_one")) {
            animateEl = oParent.find(".side_nav_dl");
            animateEl.animate({ "height": "0px" }, 400, function () {
                animateEl.removeAttr("style");
                oParent.removeClass("layer_one");
                main.find("i").removeClass("icon-shangjiantou").addClass("icon-xiajiantou");
            });
        } else {
            if (oParent.find(".side_nav_dl").length > 0) {
                animateEl = oParent.find(".side_nav_dl");
                strHeight = animateEl.height();
                animateEl.css("height", "0px");
                oParent.addClass("layer_one");
                main.find("i").removeClass("icon-xiajiantou").addClass("icon-shangjiantou");
                animateEl.animate({ "height": strHeight + 'px' }, 400, function () {
                    animateEl.removeAttr("style");
                });
            }
            //  else {
            //     // 发起ajax请求
            //     oUl.find(".active").removeClass("active");
            //     main.addClass("active");
            //     getmMterialFuc();
            // }
        }
        if (!main.hasClass("active")) {
            // 发起ajax请求
            oUl.find(".active").removeClass("active");
            main.addClass("active");
            vm.getGys(1);
        }
    });


    // 展开第二层
    $(".side_two_alink").off().on("click", function () {
        var main = $(this);
        var oUl = $(".side_nav_ul");
        var oParent = main.parents(".side_nav_two");
        var animateEl = null;
        var strHeight = null;
        if (oParent.hasClass("layer_two")) {
            animateEl = oParent.find(".side_nav_three");
            animateEl.animate({ "height": "0px" }, 400, function () {
                animateEl.removeAttr("style");
                oParent.removeClass("layer_two");
                main.find("i").removeClass("icon-shangjiantou").addClass("icon-xiajiantou");
            });
        } else {
            if (oParent.find(".side_nav_three").length > 0) {
                animateEl = oParent.find(".side_nav_three");
                strHeight = animateEl.height();
                animateEl.css("height", "0px");
                oParent.addClass("layer_two");
                main.find("i").removeClass("icon-xiajiantou").addClass("icon-shangjiantou");
                animateEl.animate({ "height": strHeight + 'px' }, 400, function () {
                    animateEl.removeAttr("style");
                });
            }
            //  else {
            //     // 发起ajax请求
            //     oUl.find(".active").removeClass("active");
            //     main.addClass("active");
            //     getmMterialFuc();
            // }
        }
        if (!main.hasClass("active")) {
            // 发起ajax请求
            oUl.find(".active").removeClass("active");
            main.addClass("active");
            vm.getGys(1);
        }
    });

    // 物资分类请求
    $(".side_nav_three a").off().on("click", function () {
        var main = $(this);
        var oUl = $(".side_nav_ul");
        if (!main.hasClass("active")) {
            // 发起ajax请求
            oUl.find(".active").removeClass("active");
            main.addClass("active");
            vm.getGys(1);
        }
    });

    // 排序筛选
    $(".tabs_select span").off().on("click", function () {
        var main = $(this);
        var oTabs = $(".tabs_select");
        if (!main.hasClass("active")) {
            // 发起ajax请求
            oTabs.find(".active").removeClass("active");
            main.addClass("active");
            vm.getGys(1);
        }
    });
});