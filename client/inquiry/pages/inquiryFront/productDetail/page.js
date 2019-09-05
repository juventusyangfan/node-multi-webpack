/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 商品缩略图切换
    $(".pDetail_pic_list li").off().on("click", function () {
        var main = $(this);
        var bigPhoto = main.find("img").attr("big-img");
        var originPhoto = main.find("img").attr("default-img");
        $(".pDetail_pic_list li").removeClass("active");
        main.addClass("active");
        $(".big_photo").attr("src", bigPhoto);
        $(".magnifierImg img").attr("src", originPhoto);
    });

    // 放大镜
    $(".pDetail_pic_big").off().on({
        mouseover: function () {
            // 大图遮罩显示、放大镜显示
            $(".maskImg").css("display", "block");
            $(".magnifierImg").css("display", "block");
        },
        mouseout: function () {
            // 大图遮罩隐藏、放大镜隐藏
            $(".maskImg").css("display", "none");
            $(".magnifierImg").css("display", "none");
        },
        mousemove: function (e) {
            //得到商品相对于页面的横坐标、纵坐标
            var imgX = $(".pDetail_pic_big").offset().left;
            var imgY = $(".pDetail_pic_big").offset().top;
            // 得到鼠标相对于商品大图的横坐标、纵坐标
            var cursorX = e.pageX - imgX;
            var cursorY = e.pageY - imgY;
            //得到遮罩层的坐标，94.5是遮罩层边长的一半
            var maskX = (cursorX - 94.5) + "px";
            var maskY = (cursorY - 94.5) + "px";
            //保证遮罩层是完整的，遮罩的宽度加上遮罩一半的宽度
            if (cursorX < 94.5) {
                maskX = "0px";
            } else if (cursorX > 283) {
                maskX = "189px";
            }
            if (cursorY < 94.5) {
                maskY = "0px";
            } else if (cursorY > 283) {
                maskY = "189px";
            }
            //计算得到放大镜中图片的显示位置 小图移动的距离/小图最大移动距离 = 大图移动的距离/大图最大移动距离
            var maginfyX = -parseInt(maskX) * 2 + "px";
            var maginfyY = -parseInt(maskY) * 2 + "px";
            //设置遮罩层的位置
            $(".maskImg").css({
                left: maskX,
                top: maskY
            });
            //设置放大镜中图片的位置
            $(".magnifierImg img").css({
                left: maginfyX,
                top: maginfyY
            });
        }
    });

    // 起定价格左右切换
    var timer = null;
    $(".ladder_area").off().on("mouseover", function () {
        var wNum = 0;
        var ro = null;
        for (let i = 0; i < $(".money_con").length; i++) {
            ro = window.getComputedStyle($(".money_con").eq(i)[0]);
            wNum += parseFloat(ro.width);
        }
        $(".ladder_area").css("width", wNum + "px");
        if (wNum > 430) {
            $(".money_right,.money_left").css("display", "block");
        } else {
            $(".money_right,.money_left").css("display", "none");
        }
    });
    $(".money_right").off().on({
        mousedown: function () {
            var ladder = $(".ladder_area");
            var maxRoll = ladder.width() - 430;
            var leftFuc = function () {
                clearTimeout(timer);
                if (ladder.width() > 430) {
                    var leftVal = parseFloat(ladder.css("left"));
                    if (Math.abs(leftVal) < maxRoll) {
                        ladder.stop(true, true).css("left", leftVal - 1 + 'px');
                    }
                    timer = setTimeout(leftFuc, 16);
                }
            };
            timer = setTimeout(leftFuc, 16);
        },
        mouseup: function () {
            clearTimeout(timer);
        }
    });
    $(".money_left").off().on({
        mousedown: function () {
            var ladder = $(".ladder_area");
            var rightFuc = function () {
                clearTimeout(timer);
                if (ladder.width() > 430) {
                    var rightVal = parseFloat(ladder.css("left"));
                    if (rightVal < 0) {
                        ladder.stop(true, true).css("left", rightVal + 1 + 'px');
                    }
                    timer = setTimeout(rightFuc, 16);
                }
            };
            timer = setTimeout(rightFuc, 16);
        },
        mouseup: function () {
            clearTimeout(timer);
        }
    });

    // 组合属性
    var buildUpAttrFuc = function (el) {
        var arrEl = el;
        var species_arr = [];
        var speices_num = 0;
        var voidVal = 0;
        var selected = null;
        for (let i = 0; i < arrEl.length; i++) {
            selected = arrEl.eq(i).find(".checked");
            if (selected.length > 0) {
                species_arr.push(selected.attr("data-value"));
                speices_num = speices_num + 1;
            } else {
                species_arr.push("\\d+:\\d+");
                // 记录在数组的第几个值为空值，为查空值做准备
                voidVal = species_arr.length - 1;
            }
        }
        return {
            species_arr: species_arr,
            speices_num: speices_num,
            voidVal: voidVal
        };
    };

    // 起订量展示
    var stocksNum = $(".real_stock_num").html();// 记录产品总量
    var productPrice = $(".money").html();// 记录产品的起始单价
    var ladderPriceFuc = function (opt) {
        var sKey = opt;
        var ladderPrice = skuMap[sKey].step_price;
        var rangeArr = [];
        if (ladderPrice !== null && ladderPrice !== "") {
            // 有起订量
            for (const key in ladderPrice) {
                if (ladderPrice.hasOwnProperty(key)) {
                    rangeArr.push(key);
                }
            }
            rangeArr = rangeArr.sort(function (a, b) {
                return parseFloat(a) - parseFloat(b);
            });
            var liHtml = '';
            for (let i = 0; i < rangeArr.length; i++) {
                liHtml += '<li class="money_con"><p>￥<span class="money">' + ladderPrice[rangeArr[i]] + '</span></p><p class="fontSize12 textBlack1 stepPrice">≥' + rangeArr[i] + '</p></li>';
            }
            $(".ladder_area").html(liHtml);
        } else {
            $(".ladder_area").html('<li class="money_con"><p>￥<span class="money">' + skuMap[sKey].price + '</span></p><p class="fontSize12 textBlack1 stepPrice">≥1</p></li>');
        }
    };

    // 依据属性筛选产品
    $(".pDetail_filter").off().on("click", ".pDetail_cell", function () {
        var main = $(this);
        var arrUl = $(".pDetail_filter ul");
        var ulIndex = arrUl.index(main.parents("ul"));
        // 禁止选择
        if (main.find("a").hasClass("disable")) {
            return false;
        }
        // 可选择
        if (main.find("a").hasClass("checked")) {
            main.find("a").removeClass("checked");
        } else {
            main.parents("ul").find(".checked").removeClass("checked");
            main.find("a").addClass("checked");
            // 恢复被置灰的产品为可点击，同级的置灰线路不处理
            for (let n = 0; n < arrUl.length; n++) {
                if (n !== ulIndex) {
                    arrUl.eq(n).find(".disable").removeClass("disable");
                }
            }
        }
        var buildAttr = buildUpAttrFuc(arrUl);
        // 匹配的正则
        var reg = new RegExp(";" + buildAttr.species_arr.join(";") + ";");
        if (buildAttr.speices_num >= arrUl.length - 1) {
            if (buildAttr.speices_num === arrUl.length - 1) {
                // 还差一个属性匹配 产品总量显示为所有值
                for (const key in skuMap) {
                    if (skuMap.hasOwnProperty(key)) {
                        if (reg.test(key)) {
                            if (skuMap[key].real_stock_nums <= '0') {
                                // 查找出是哪个产品是空值
                                var arrSpeices = key.split(";");
                                $("a[data-value='" + arrSpeices[buildAttr.voidVal + 1] + "']").addClass("disable");
                            }
                            $(".real_stock_num").html(stocksNum);
                            // 采购数量 加减按钮
                            $("input[name='goods_amount']").val(1);
                            $(".goods_minus").addClass("disable");
                            $(".goods_add").removeClass("disable");
                            // 起订量
                            $(".ladder_area").html('<li class="money_con"><p>￥<span class="money">' + productPrice + '</span></p><p class="fontSize12 textBlack1 stepPrice">请选择规格后显示</p></li>');
                            $(".ladder_area").css({
                                left: "0px",
                                width: "1000px"
                            });
                            $(".money_right,.money_left").css("display", "block");
                        }
                    }
                }
            } else {
                // 点击了最后一个属性
                var species_str = ";" + buildAttr.species_arr.join(";") + ";";
                for (const sku in skuMap) {
                    if (skuMap.hasOwnProperty(sku)) {
                        if (sku.indexOf(species_str) >= 0) {
                            // 采购数量 加减按钮
                            $("input[name='goods_amount']").val(1);
                            $(".goods_minus").addClass("disable");
                            $(".ladder_area").css({
                                left: "0px",
                                width: "1000px"
                            });
                            $(".money_right,.money_left").css("display", "block");
                            // 计算剩余产品数量
                            ladderPriceFuc(species_str);
                            if (skuMap[sku].real_stock_nums == "0") {
                                species_str = species_str.split(";");
                                $("a[data-value='" + species_str[arrUl.length] + "']").removeClass("checked").addClass("disable");
                                $(".real_stock_num").html(stocksNum);
                                $(".goods_add").addClass("disable");
                                $(".ladder_area").html('<li class="money_con"><p>￥<span class="money">' + productPrice + '</span></p><p class="fontSize12 textBlack1 stepPrice">请选择规格后显示</p></li>');
                            } else {
                                $(".real_stock_num").html(skuMap[sku].real_stock_nums);
                                $(".goods_add").removeClass("disable");
                            }
                            break;
                        }
                    }
                }
            }
        } else {
            // 不止一个属性匹配
            $(".pDetail_filter").find(".disable").removeClass("disable");
            $(".real_stock_num").html(stocksNum);
            // 采购数量 加减按钮
            $("input[name='goods_amount']").val(1);
            $(".goods_minus").addClass("disable");
            $(".goods_add").removeClass("disable");
            // 起订量
            $(".ladder_area").html('<li class="money_con"><p>￥<span class="money">' + productPrice + '</span></p><p class="fontSize12 textBlack1 stepPrice">请选择规格后显示</p></li>');
            $(".ladder_area").css({
                left: "0px",
                width: "1000px"
            });
            $(".money_right,.money_left").css("display", "block");
        }
    });

    //展开规格属性
    $(".pDetail_item_con").each(function () {
        if ($(this).find("ul").height() <= 84) {
            $(this).find(".pDetail_getMore").hide();
        }
    });
    $(".pDetail_getMore").unbind().bind("click", function () {
        if ($(this).hasClass("goUp")) {
            $(this).parent().find("ul").css("max-height", "84px");
            $(this).removeClass("goUp");
        }
        else {
            $(this).parent().find("ul").css("max-height", "1000px");
            $(this).addClass("goUp");
        }
        return false;
    });

    // 加减
    $(".goods_minus").off().on("click", function () {
        var main = $(this);
        if (main.hasClass("disable")) {
            return false;
        }
        var inpVal = parseFloat($(".pDetail_num input").val());
        var kucun = parseFloat($(".real_stock_num").html());
        if (kucun <= 0) {
            $(".pDetail_num input").val(1);
            return false;
        }
        $(".pDetail_num input").val(inpVal - 1);
        $(".goods_add").removeClass("disable");
        if (inpVal - 1 <= 1) {
            main.addClass("disable");
        }
        // 检测属性是否选择完 组装属性
        var arrUl = $(".pDetail_filter ul");
        var selected = null;
        var species_arr = [];
        for (let i = 0; i < arrUl.length; i++) {
            selected = arrUl.eq(i).find(".checked");
            if (selected.length !== 0) {
                species_arr.push(selected.attr("data-value"));
            } else {
                return false;
            }
        }
        var species_str = ";" + species_arr.join(";") + ";";
        ladderPriceFuc(species_str);
    });
    $(".goods_add").off().on("click", function () {
        var main = $(this);
        if (main.hasClass("disable")) {
            return false;
        }
        var kucun = parseFloat($(".real_stock_num").html());
        var inpVal = parseFloat($(".pDetail_num input").val());
        if (kucun <= 0) {
            $(".pDetail_num input").val(1);
            return false;
        }
        if (isNaN(inpVal)) {
            $(".pDetail_num input").val(1);
        } else {
            $(".pDetail_num input").val(inpVal + 1);
            $(".goods_minus").removeClass("disable");
        }
        if (inpVal + 1 >= kucun) {
            main.addClass("disable");
        }
        // 检测属性是否选择完 组装属性
        var arrUl = $(".pDetail_filter ul");
        var selected = null;
        var species_arr = [];
        for (let i = 0; i < arrUl.length; i++) {
            selected = arrUl.eq(i).find(".checked");
            if (selected.length !== 0) {
                species_arr.push(selected.attr("data-value"));
            } else {
                return false;
            }
        }
        var species_str = ";" + species_arr.join(";") + ";";
        ladderPriceFuc(species_str);
    });

    // 数字输入
    $(".pDetail_num input").off().on("input", function () {
        var main = $(this);
        libs.lenNumber(main[0], 0);
        var curVal = parseFloat(main.val());
        var kucun = parseFloat($(".real_stock_num").html());
        if (kucun <= 0) {
            main.val(1);
            return false;
        }
        if (curVal >= kucun) {
            main.val(kucun);
            $(".goods_add").addClass("disable");
            $(".goods_minus").removeClass("disable");
        } else if (isNaN(curVal)) {
            $(".goods_minus").addClass("disable");
            $(".goods_add").removeClass("disable");
        } else if (curVal <= 1) {
            main.val(1);
            $(".goods_minus").addClass("disable");
            $(".goods_add").removeClass("disable");
        } else if (curVal > 1){
            $(".goods_add").removeClass("disable");
            $(".goods_minus").removeClass("disable");
        }
        // 检测属性是否选择完 组装属性
        var arrUl = $(".pDetail_filter ul");
        var selected = null;
        var species_arr = [];
        for (let i = 0; i < arrUl.length; i++) {
            selected = arrUl.eq(i).find(".checked");
            if (selected.length !== 0) {
                species_arr.push(selected.attr("data-value"));
            } else {
                return false;
            }
        }
        var species_str = ";" + species_arr.join(";") + ";";
        ladderPriceFuc(species_str);
    });

    // 加入购物车动画
    var addCartAni = function () {
        // 计算运动元素的位置、目的地元素的位置
        var ballLeft = $(".ball-wrap").offset().left;
        var ballTop = $(".ball-wrap").offset().top;
        var cartLeft = $(".shop-cart").offset().left;
        var cartTop = $(".shop-cart").offset().top;
        // 计算目的地的距离
        var aimLeft = (cartLeft - ballLeft) + "px";
        var aimTop = (cartTop - ballTop) + "px";
        // 运动曲线
        if (parseFloat(aimTop) < 0) {
            // 购物车在上面
            $(".ball-inner").css("transition-timing-function", "cubic-bezier(.44,1.45,.91,1.35)");
        }
        $(".ball-inner").css("visibility", "visible");
        $(".ball-wrap").css("transform", "translateX(" + aimLeft + ")");
        $(".ball-inner").css("transform", "translateY(" + aimTop + ")");
        // 到达目的地，隐藏元素，运动元素重置位置
        setTimeout(function () {
            $(".ball-inner").css("visibility", "hidden");
            $(".ball-inner").css("transition-timing-function", "cubic-bezier(0,-0.47,.47,-0.38)");
            $(".ball-wrap").css("transform", "translateX(0px)");
            $(".ball-inner").css("transform", "translateY(0px)");
        }, 500);
    };

    // 加入购物车 去购物车结算
    var isGoCart = true;
    $(".pDetail_goCart,.pDetail_goPay").off().on("click", function () {
        if (!isGoCart) {
            return false;
        }
        var main = $(this);
        var arrUl = $(".pDetail_filter ul");
        var selected = null;
        var num = parseFloat($(".pDetail_num input").val());
        var kucun = null;
        var species_arr = [];
        // 检测属性是否选择完 组装属性
        for (let i = 0; i < arrUl.length; i++) {
            selected = arrUl.eq(i).find(".checked");
            if (selected.length === 0) {
                $.msgTips({
                    type: "warning",
                    content: "请选择您要的商品信息！"
                });
                return false;
            } else {
                species_arr.push(selected.attr("data-value"));
            }
        }
        // 是否满足起订量
        var stepPrice = $(".stepPrice").eq(0).html();
        stepPrice = stepPrice.replace(/≥/, "");
        if (num < parseFloat(stepPrice)) {
            $.msgTips({
                type: "warning",
                content: "最小起订量是" + stepPrice
            });
            return false;
        }
        species_arr = ";" + species_arr.join(";") + ";";
        kucun = parseFloat(skuMap[species_arr].real_stock_nums);
        if (num <= 0 || isNaN(num)) {
            $.msgTips({
                type: "warning",
                content: "请填写正确的宝贝数量！"
            });
            return false;
        }
        if (kucun <= 0 || num > kucun) {
            $.msgTips({
                type: "warning",
                content: "库存不足！"
            });
            return false;
        }
        isGoCart = false;
        $.ajaxForJson(config.shopPath + 'ajaxLoginStatus', null, function (json) {
            if (json.code === 2000) {
                if (json.data.login_status === 1) {
                    $.ajaxForJson('/Buyer/Shop/ajaxAddCart', {
                        goods_id: skuMap[species_arr].id,
                        amout: num
                    }, function (json) {
                        if (json.code === 2000) {
                            if (main.hasClass("pDetail_goCart")) {
                                addCartAni();
                            }
                            $.initCartFuc();
                            if (main.hasClass("pDetail_goPay")) {
                                location.href = "/Buyer/Shop/index.html";
                            }
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: json.msg
                            });
                        }
                        isGoCart = true;
                    });
                } else {
                    $.loginDialog();
                    isGoCart = true;
                }
            }
        });
        return false;
    });

    // 查看地图
    $(".warehouse_point").off().on("click", function () {
        var pointStr = $(this).attr("data-point");
        if (pointStr !== "") {
            pointStr = pointStr.split(",");
            window.open('http://api.map.baidu.com/marker?location=' + pointStr[1] + ',' + pointStr[0] + '&title=仓库地址&content=' + $(".warehouse_name").html() + '&output=html&src=webapp.baidu.openAPIdemo', '_blank');
        } else {
            $.msgTips({
                type: "warning",
                content: "仓库地址数据缺失！"
            });
        }
    });

    // 选项卡切换
    $(".pDetail_tab_con li").off().on("click", function () {
        var main = $(this);
        var listItem = $(".pDetail_tab_con li");
        var curIndex = listItem.index(main);
        listItem.removeClass("active");
        main.addClass("active");
        if (curIndex === 0) {
            $(".pDetail_show_detail").css("display", "block");
            $(".pDetail_show_comment").css("display", "none");
        } else {
            $(".pDetail_show_detail").css("display", "none");
            $(".pDetail_show_comment").css("display", "block");
        }
    });

    //点击查看大图
    $(".pDetail_show_con").on("click", ".comment_detail .imgs a", function () {
        var imgUrl = $(this).find("img").attr("src");
        $(this).parent().find("a").removeClass("active");
        $(this).addClass("active");
        $(this).parents(".comment_detail").find(".showBimg img").attr("src", imgUrl);
        $(this).parents(".comment_detail").find(".showBimg").show();
        return false;
    });
    //点击空白关闭大图
    $(document).mouseup(function (e) {
        $(".comment_detail .imgs").find("a").removeClass("active");
        $(".comment_detail").find(".showBimg img").attr("src", "");
        $(".comment_detail").find(".showBimg").hide();
    });

    //评论列表
    var vm = new Vue({
        el: '#commentList',
        data: {
            imgPath: config.filePath,
            loading: true,//loading图
            list: [],//商品列表
            count: 0,//商品总数
            intLevel: 0,//总满意度整数
            floatLevel: 0,//总满意度小数
        },
        mounted() {
            this.getComment(1);
        },
        methods: {
            getComment(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                $.get(config.shopPath + 'goods/getEvaluateAjax?product_id=' + libs.getUrlParam("product_id"), function (dataObj) {
                    dataObj = JSON.parse(dataObj);
                    if (dataObj.code === 2000) {
                        vueObj.list = dataObj.data.list;
                        vueObj.count = dataObj.data.count;
                        vueObj.intLevel = parseInt(dataObj.data.average_level);
                        if (dataObj.data.average_level.toString().indexOf(".") > -1) {
                            vueObj.floatLevel = dataObj.data.average_level.split(".")[1];
                        }
                        $(".pDetail_tab_cell").find("span").html(vueObj.count);
                    }
                    vueObj.loading = false;
                });
            }
        }
    });
});