require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    //获取物资分类树
    $.ajaxForJson(config.wwwPath + "supplier/index/catalogTree", null, function (dataObj) {
        if (dataObj.code == 2000) {
            for (var dataId in dataObj.data) {
                var _html = '<div class="menu_tree_con clearfix">';
                var _firstHTML = '',
                    _otherHTML = '';

                var _parent = dataObj.data[dataId];
                for (var i = 0; i < _parent.length; i++) {
                    var _liClass = "",
                        _divSty = "display:none;";
                    if (i == 0) {
                        _liClass = "act";
                        _divSty = "display:block;"
                    }
                    _firstHTML += '<li class="' + _liClass + '" data-id="' + _parent[i].value + '"><a href="javascript:;">' + _parent[i].label + '<i class="iconfont icon-youjiantou"></i></a></li>';
                    _otherHTML += '<div class="menu_tree_lvlOther" show-id="' + _parent[i].value + '" style="' + _divSty + '">';
                    var _children = _parent[i].children;
                    if (typeof (_children) != "undefined") {
                        for (var j = 0; j < _children.length; j++) {
                            _otherHTML += '<div class="menu_tree_block clearfix"><a href="javascript:;" class="tree_lvlOther_title" data-id="' + _children[j].value + '"><span class="ellipsis">' + _children[j].label + '</span><i class="iconfont icon-youjiantou"></i></a><div class="tree_lvlOther_con">';
                            var _child = _children[j].children;
                            if (typeof (_child) != "undefined") {
                                for (var k = 0; k < _child.length; k++) {
                                    _otherHTML += '<a href="javasript:;" data-id="' + _child[k].value + '">' + _child[k].label + '</a>';
                                }
                            }
                            _otherHTML += '</div></div>';
                        }
                    }
                    _otherHTML += '</div>';
                }
                _html += '<div class="menu_tree_lvlFirst"><ul>' + _firstHTML + '</ul></div>' + _otherHTML;

                $(".findgys_menu_cell[data-type='" + dataId + "']").find(".findgys_menu_tree").html(_html);
            }
        }
    });
    //选择物资大类
    $(".findgys_menu_cell").unbind().bind({
        "mouseover": function () {
            var _id = $(this).attr("data-type");
            switch (_id) {
                case "0":
                    $(this).find("i.js_active").removeClass("icon-quanbuleixing").addClass("icon-quanbuleixing1");
                    break;
                case "1":
                    $(this).find("i.js_active").removeClass("icon-wuzicaigou1").addClass("icon-wuzicaigou2");
                    break;
                case "2":
                    $(this).find("i.js_active").removeClass("icon-laowufenbao").addClass("icon-laowufenbao1");
                    break;
                case "3":
                    $(this).find("i.js_active").removeClass("icon-zhuanyefenbao").addClass("icon-zhuanyefenbao1");
                    break;
                case "4":
                    $(this).find("i.js_active").removeClass("icon-shigongzongchengbao").addClass("icon-shigongzongchengbao1");
                    break;
                case "5":
                    $(this).find("i.js_active").removeClass("icon-shejizixunfuwu").addClass("icon-shejizixunfuwu1");
                    break;
            }
            $(this).addClass("open");
        },
        "mouseleave": function () {
            var _id = $(this).attr("data-type");
            switch (_id) {
                case "0":
                    $(this).find("i.js_active").removeClass("icon-quanbuleixing1").addClass("icon-quanbuleixing");
                    break;
                case "1":
                    $(this).find("i.js_active").removeClass("icon-wuzicaigou2").addClass("icon-wuzicaigou1");
                    break;
                case "2":
                    $(this).find("i.js_active").removeClass("icon-laowufenbao1").addClass("icon-laowufenbao");
                    break;
                case "3":
                    $(this).find("i.js_active").removeClass("icon-zhuanyefenbao1").addClass("icon-zhuanyefenbao");
                    break;
                case "4":
                    $(this).find("i.js_active").removeClass("icon-shigongzongchengbao1").addClass("icon-shigongzongchengbao");
                    break;
                case "5":
                    $(this).find("i.js_active").removeClass("icon-shejizixunfuwu1").addClass("icon-shejizixunfuwu");
                    break;
            }
            $(this).removeClass("open");
        },
        "click": function (evt) {
            var _con = evt.srcElement || evt.target;
            if (_con.className.indexOf("js_active") > -1) {
                vm.product_id = [];
                var _liList = $(this).find(".menu_tree_lvlFirst li");
                _liList.each(function () {
                    var _id = $(this).attr("data-id");
                    vm.product_id.push(_id);
                });
                $(".findgys_menu_cell").removeClass("active");
                $(this).addClass("active");
                vm.getGys(1);
            }

            return false;
        }
    });
    //选择一级分类
    $(".findgys_menu_tree").on("mouseover", ".menu_tree_lvlFirst li", function () {
        var _id = $(this).attr("data-id");
        $(this).parents(".menu_tree_lvlFirst").find("li").removeClass("act");
        $(this).addClass("act");
        $(this).parents(".menu_tree_con").find(".menu_tree_lvlOther").hide();
        $(this).parents(".menu_tree_con").find(".menu_tree_lvlOther[show-id='" + _id + "']").show();
    });
    $(".findgys_menu_tree").on("click", ".menu_tree_lvlFirst a", function () {
        var _id = $(this).parent().attr("data-id");
        vm.product_id = [_id];
        vm.getGys(1);
        $(this).parents(".findgys_menu_cell").removeClass("open");
        $(".findgys_menu_cell").removeClass("active");
        $(this).parents(".findgys_menu_cell").addClass("active");
        return false;
    });
    //选择二级三级
    $(".findgys_menu_tree").on("click", ".menu_tree_lvlOther a", function () {
        var _id = $(this).attr("data-id");
        vm.product_id = [_id];
        vm.getGys(1);
        $(this).parents(".findgys_menu_cell").removeClass("open");
        $(".findgys_menu_cell").removeClass("active");
        $(this).parents(".findgys_menu_cell").addClass("active");
        return false;
    });

    //渲染列表
    var vm = new Vue({
        el: '#findgys',
        data() {
            return {
                loading: true,
                list: [],
                product_id: [],
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

                var requestData = null;
                if ($(".findgys_search_type .active").attr("data-type") == "company_name") {
                    requestData = {
                        product_id: that.product_id,
                        company_name: $(".findgys_search_input").val(),
                        order_type: $(".findgys_select_wrap > a.active ").attr("data-type"),
                        province_code: $("dl[name='province_code'] dd.active").attr("value"),
                        city_code: $("dl[name='city_code'] dd.active").attr("value"),
                        p: that.current
                    }
                } else if ($(".findgys_search_type .active").attr("data-type") == "product_name") {
                    requestData = {
                        product_id: that.product_id,
                        product_name: $(".findgys_search_input").val(),
                        order_type: $(".findgys_select_wrap > a.active ").attr("data-type"),
                        province_code: $("dl[name='province_code'] dd.active").attr("value"),
                        city_code: $("dl[name='city_code'] dd.active").attr("value"),
                        p: that.current
                    }
                }
                $.ajaxForJson(config.wwwPath + 'supplier/index/lookupAjax', requestData, function (dataObj) {
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

    //选择搜索类型
    $(".findgys_search_nav").unbind().bind("click", function () {
        $(".findgys_search_nav").removeClass("active");
        $(this).addClass("active");
        return false;
    });
    $(".findgys_search_con .icon-sousuo").unbind().bind("click", function () {
        vm.getGys(1);
        return false;
    });
    $(".findgys_search_input").unbind().bind("keypress", function (event) {
        if (event.keyCode == 13) {
            vm.getGys(1);
        }
    });
    //清空
    $(".findgys_search_clear").unbind().bind("click", function () {
        $(".findgys_search_input").val("");
        vm.getGys(1);
        return false;
    });

    //选择省市
    var getProvinceFuc = function () {
        $.ajaxJSONP(config.papiPath + "api/common/getProvince", null, function (json) {
            if (json.code == "2000") {
                var optHtml = '<dd class="active" value="">不限省份</dd>';
                for (let i = 0; i < json.data.length; i++) {
                    optHtml += '<dd value="' + json.data[i].id + '">' + json.data[i].name + '</dd>';
                }
                $(".findgys_select_wrap .findgys_select dl").eq(0).html(optHtml);
            }
        }, "json");
    };
    getProvinceFuc();
    $("dl[name='province_code']").off().on("click", "dd", function () {
        var main = $(this);
        if (main.attr("value") !== "") {
            $.ajaxJSONP(config.papiPath + "/api/common/getCity", {
                pid: main.attr("value")
            }, function (json) {
                if (json.code == "2000") {
                    $("dl[name='province_code']").find("dd").removeClass("active");
                    main.addClass("active");
                    $("dl[name='province_code']").parent().find("span").html(main.html());
                    var optHtml = '<dd class="active" value="">不限市/州</dd>';
                    for (let i = 0; i < json.data.length; i++) {
                        optHtml += '<dd value="' + json.data[i].id + '">' + json.data[i].name + '</dd>';
                    }
                    $(".findgys_select_wrap .findgys_select dl").eq(1).html(optHtml);
                    vm.getGys(1);
                }
            }, "json");
        } else {
            $(".findgys_select_wrap .findgys_select dl").eq(1).html('<dd value="">不限市/州</dd>');
            vm.getGys(1);
        }
    });
    $("dl[name='city_code']").off().on("click", "dd", function () {
        var main = $(this);
        $("dl[name='city_code']").find("dd").removeClass("active");
        main.addClass("active");
        $("dl[name='city_code']").parent().find("span").html(main.html());
        vm.getGys(1);
    });

    //排序
    $(".findgys_sort").unbind().bind("click", function () {
        $(".findgys_sort").removeClass("active");
        $(this).addClass("active");
        vm.getGys(1);
        return false;
    });
});