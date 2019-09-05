require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 防止频繁触发AJAX
    var debounce = null;

    // 校验库存是否不合理
    var kucunFuc = function () {
        var goodsEl = $(".goods_info");
        var kucun = null;
        for (let i = 0; i < goodsEl.length; i++) {
            kucun = parseFloat(goodsEl.eq(i).find(".max_kucun").html());
            if (kucun <= 0) {
                goodsEl.eq(i).find("input").attr("disabled", "disabled");
                goodsEl.eq(i).find(".goods_minus").addClass("forbid_btn");
                goodsEl.eq(i).find(".goods_add").addClass("forbid_btn");
            }
        }
    };
    kucunFuc();

    // 计算所有商品的起订量
    var calcWholesaleFuc = function () {
        var unitLi = $(".unit_li");
        var stepPrice = null;
        var rangeArr = [];
        for (let i = 0; i < unitLi.length; i++) {
            stepPrice = unitLi.eq(i).attr("data-price");
            if (stepPrice === "") {
                // 没有起订量，从1开始
                unitLi.eq(i).attr("data-range", "");
            } else {
                // 有起订量
                stepPrice = JSON.parse(stepPrice);
                rangeArr = wholesaleArr = [];
                for (const key in stepPrice) {
                    if (stepPrice.hasOwnProperty(key)) {
                        rangeArr.push(key);
                    }
                }
                rangeArr = rangeArr.sort(function (a, b) {
                    return parseFloat(a) - parseFloat(b);
                });
                unitLi.eq(i).attr("data-range", rangeArr);
            }
        }
    };
    calcWholesaleFuc();

    // 已勾选商品的总价计算
    var priceCalcFuc = function (el) {
        var goodsList = el.parents(".goods_item").find(".goods_info");
        var arrUl = goodsList.find("ul");
        var totalMoney = 0;
        var unitPrice = null;
        var goodsAmount = null;
        var tempMoney = null;
        var status = false;
        for (let i = 0; i < arrUl.length; i++) {
            status = arrUl.eq(i).find(".order_check").is(":checked");
            if (status) {
                unitPrice = arrUl.eq(i).find(".unit_li span").html();
                unitPrice = parseFloat(unitPrice.replace("￥", ""));
                goodsAmount = arrUl.eq(i).find(".num_calc input").val();
                if (goodsAmount !== "") {
                    goodsAmount = parseFloat(goodsAmount);
                } else {
                    goodsAmount = 0;
                }
                tempMoney = (unitPrice * goodsAmount).toFixed(2);
                // arrUl.eq(i).find(".subtotal_li span").html("￥" + tempMoney);
                totalMoney += parseFloat(tempMoney);
            }
        }
        return totalMoney.toFixed(2);
    };

    // 单个商品计算价格（已勾选、未勾选都参与）
    var singlePrice = function (el) {
        var single = el.parents(".num_calc").find("input").val();
        if (single !== "") {
            single = parseFloat(single);
        } else {
            single = 0;
        }
        var unitLi = el.parents("ul").find(".unit_li");
        var stepPrice = unitLi.attr("data-price");
        var unitPrice = null;
        var rangeArr = [];
        if (stepPrice === "") {
            // 单一价
            unitPrice = parseFloat(unitLi.find("span").html().replace("￥", ""));
            singleMoney = single * unitPrice;
        } else {
            // 比较数量和起订量的关系
            stepPrice = JSON.parse(stepPrice);
            rangeArr = unitLi.attr("data-range");
            rangeArr = rangeArr.split(",");
            var isEnter = false;
            for (let i = 0; i < rangeArr.length; i++) {
                if (single >= parseFloat(rangeArr[i])) {
                    unitPrice = stepPrice[rangeArr[i]];
                    isEnter = true;
                } else {
                    if (!isEnter) {
                        unitPrice = stepPrice[rangeArr[0]];
                    }
                }
            }
            unitLi.find("span").html("￥" + unitPrice);
            singleMoney = single * parseFloat(unitPrice);
        }
        el.parents("ul").find(".subtotal_li span").html("￥" + singleMoney.toFixed(2));
    };

    // 单个商品修改数量及状态
    var goodsModifyFuc = function (el) {
        var oUl = el.parents("ul");
        var idStr = null, amountStr = null, checkedStr = null, status = null;
        status = oUl.find(".order_check").is(":checked");
        idStr = oUl.find(".goods_checkbox").attr("id_val");
        amountStr = oUl.find(".num_calc input").val();
        var rangeArr = oUl.find(".unit_li").attr("data-range");
        var minNum = 1;
        if (rangeArr !== "") {
            rangeArr = rangeArr.split(",");
            minNum = parseFloat(rangeArr[0]);
        }
        if (parseFloat(amountStr) < minNum) {
            return false;
        }
        if (status) {
            checkedStr = 1;
        } else {
            checkedStr = 0;
        }
        $.ajaxForJson('/Buyer/Shop/ajaxChangeCart', {
            id: idStr,
            amount: amountStr,
            checked: checkedStr
        }, function (json) {
            if (json.code !== 2000) {
                $.cueDialog({
                    title: "提示",
                    content: json.msg
                });
            }
        });
    };

    // 多个商品修改状态
    var multigoodsStatusFuc = function (el) {
        var goodsList = el.parents(".goods_item").find(".goods_info");
        var arrUl = goodsList.find("ul");
        var idArr = [], checked = null;
        for (let i = 0; i < arrUl.length; i++) {
            if (arrUl.eq(i).hasClass("off_shelf")) {
                continue;
            }
            var status = arrUl.eq(i).find(".order_check").is(":checked");
            idArr.push(arrUl.eq(i).find(".goods_checkbox").attr("id_val"));
            if (status) {
                checked = 1;
            } else {
                checked = 0;
            }
        }
        if (idArr.length <= 0) {
            return false;
        }
        $.ajaxForJson('/Buyer/Shop/ajaxChangeCart', {
            id: idArr,
            checked: checked
        }, function (json) {
            if (json.code !== 2000) {
                $.cueDialog({
                    title: "提示",
                    content: json.msg
                });
            }
        });
    };

    // 选中
    $(".order_check").off().on("change", function () {
        var main = $(this);
        var isSelected = true;
        var checkOpt = main.parents(".goods_item").find(".goods_info").find("ul");
        for (let i = 0; i < checkOpt.length; i++) {
            if (checkOpt.eq(i).find(".order_check").is(":checked")) {
                continue;
            } else {
                isSelected = false;
                break;
            }
        }
        if (isSelected) {
            main.parents(".goods_item").find(".all_goods_check").prop("checked", true);
        } else {
            main.parents(".goods_item").find(".all_goods_check").prop("checked", false);
        }
        $("input[type='checkbox']").initCheckbox();
        var curTotal = main.parents(".goods_item").find(".subtotal_funds strong");
        if (debounce) {
            clearTimeout(debounce);
        }
        debounce = setTimeout(function () {
            curTotal.html(priceCalcFuc(main));
            goodsModifyFuc(main);
        }, 300);
    });

    // 全选
    $(".all_goods_check").off().on("change", function () {
        var main = $(this);
        var checkOpt = main.parents(".goods_item").find(".goods_info").find("ul");
        if (main.is(":checked")) {
            for (let i = 0; i < checkOpt.length; i++) {
                if (checkOpt.eq(i).find(".order_check").length > 0) {
                    checkOpt.eq(i).find(".order_check").prop("checked", true);
                    // checkOpt.eq(i).addClass("goods_checked");
                }
            }
            main.parents(".goods_item").find(".all_goods_check").prop("checked", true);
        } else {
            for (let i = 0; i < checkOpt.length; i++) {
                checkOpt.eq(i).find(".order_check").prop("checked", false);
                // checkOpt.eq(i).removeClass("goods_checked");
            }
            main.parents(".goods_item").find(".all_goods_check").prop("checked", false);
        }
        $("input[type='checkbox']").initCheckbox();
        var curTotal = main.parents(".goods_item").find(".subtotal_funds strong");
        if (debounce) {
            clearTimeout(debounce);
        }
        debounce = setTimeout(function () {
            curTotal.html(priceCalcFuc(main));
            multigoodsStatusFuc(main);
        }, 300);
    });

    // 加减
    $(".goods_minus").off().on("click", function () {
        var main = $(this);
        if (main.hasClass("forbid_btn")) {
            return false;
        }
        var numBox = main.parents(".num_box");
        var inpVal = parseFloat(numBox.find("input").val());
        var rangeArr = main.parents("ul").find(".unit_li").attr("data-range");
        var minNum = 1;
        if (rangeArr !== "") {
            rangeArr = rangeArr.split(",");
            minNum = parseFloat(rangeArr[0]);
        }
        numBox.find("input").val(inpVal - 1);
        numBox.find(".goods_add").removeClass("forbid_btn");
        if (inpVal - 1 <= minNum) {
            main.addClass("forbid_btn");
        }
        var curTotal = main.parents(".goods_item").find(".subtotal_funds strong");
        if (debounce) {
            clearTimeout(debounce);
        }
        debounce = setTimeout(function () {
            singlePrice(main);
            curTotal.html(priceCalcFuc(main));
            goodsModifyFuc(main);
            $.initCartFuc();
        }, 300);
    });
    $(".goods_add").off().on("click", function () {
        var main = $(this);
        if (main.hasClass("forbid_btn")) {
            return false;
        }
        var numBox = main.parents(".num_box");
        var kucun = parseFloat(numBox.find(".max_kucun").html());
        var inpVal = numBox.find("input").val();
        var rangeArr = main.parents("ul").find(".unit_li").attr("data-range");
        var minNum = 1;
        if (inpVal !== "") {
            inpVal = parseFloat(inpVal);
            numBox.find("input").val(inpVal + 1);
            numBox.find(".goods_minus").removeClass("forbid_btn");
        } else {
            inpVal = 0;
            numBox.find("input").val(1);
            numBox.find(".num_tooltips").remove();
        }
        if (rangeArr !== "") {
            rangeArr = rangeArr.split(",");
            minNum = parseFloat(rangeArr[0]);
        }
        if (isNaN(inpVal)) {
            numBox.append('<div class="num_tooltips">最小起订量是'+ minNum +'</div>');
            numBox.find(".goods_minus").addClass("forbid_btn");
            numBox.find(".goods_add").removeClass("forbid_btn");
        }
        if (inpVal + 1 <= minNum) {
            if (inpVal + 1 !== minNum) {
                numBox.append('<div class="num_tooltips">最小起订量是'+ minNum +'</div>');
            } else {
                numBox.find(".num_tooltips").remove();
            }
            numBox.find(".goods_minus").addClass("forbid_btn");
        }
        if (inpVal + 1 >= kucun) {
            main.addClass("forbid_btn");
        }
        var curTotal = main.parents(".goods_item").find(".subtotal_funds strong");
        if (debounce) {
            clearTimeout(debounce);
        }
        debounce = setTimeout(function () {
            singlePrice(main);
            curTotal.html(priceCalcFuc(main));
            goodsModifyFuc(main);
            $.initCartFuc();
        }, 300);
    });

    // 数字输入
    $(".num_calc input").off().on("input", function () {
        var main = $(this);
        var numBox = main.parents(".num_box");
        libs.lenNumber(main[0], 0);
        var curVal = parseFloat(main.val());
        var kucun = parseFloat(numBox.find(".max_kucun").html());
        var rangeArr = main.parents("ul").find(".unit_li").attr("data-range");
        var minNum = 1;
        if (rangeArr !== "") {
            rangeArr = rangeArr.split(",");
            minNum = parseFloat(rangeArr[0]);
        }
        if (curVal >= kucun) {
            main.val(kucun);
            numBox.find(".goods_add").addClass("forbid_btn");
            numBox.find(".goods_minus").removeClass("forbid_btn");
        } else if (isNaN(curVal)) {
            numBox.append('<div class="num_tooltips">最小起订量是'+ minNum +'</div>');
            numBox.find(".goods_minus").addClass("forbid_btn");
            numBox.find(".goods_add").removeClass("forbid_btn");
        } else if (curVal <= minNum) {
            main.val(curVal);
            if (curVal !== minNum) {
                numBox.append('<div class="num_tooltips">最小起订量是'+ minNum +'</div>');
            } else {
                numBox.find(".num_tooltips").remove();
            }
            numBox.find(".goods_minus").addClass("forbid_btn");
            numBox.find(".goods_add").removeClass("forbid_btn");
        } else if (curVal > minNum) {
            main.val(curVal);
            numBox.find(".num_tooltips").remove();
            numBox.find(".goods_minus").removeClass("forbid_btn");
            numBox.find(".goods_add").removeClass("forbid_btn");
        }
        var curTotal = main.parents(".goods_item").find(".subtotal_funds strong");
        if (debounce) {
            clearTimeout(debounce);
        }
        debounce = setTimeout(function () {
            singlePrice(main);
            curTotal.html(priceCalcFuc(main));
            goodsModifyFuc(main);
            $.initCartFuc();
        }, 300);
    });

    // 删除全部
    $(".del_all,.goods_del").off().on("click", function () {
        var main = $(this);
        var goodsList = main.parents(".goods_item").find(".goods_info");
        var arrUl = null;
        var idArr = [];
        if (main.hasClass("del_all")) {
            // 删除全部
            arrUl = goodsList.find("ul");
            for (let i = 0; i < arrUl.length; i++) {
                var status = arrUl.eq(i).find(".order_check").is(":checked");
                if (status) {
                    idArr.push(arrUl.eq(i).find(".goods_checkbox").attr("id_val"));
                }
            }
        } else {
            // 删除一个
            idArr.push(main.parents("ul").find(".goods_checkbox").attr("id_val"));
        }
        if (idArr.length === 0) {
            $.msgTips({
                type: "warning",
                content: "请选择需要删除的商品"
            });
            return false;
        } else {
            $.cueDialog({
                title: "提示",
                content: "确定删除该商品吗？",
                callback: function () {
                    $.ajaxForJson('/Buyer/Shop/ajaxDelCart', {
                        id: idArr
                    }, function (json) {
                        if (json.code === 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            $.msgTips({
                                type: "success",
                                content: "删除成功！",
                                callback: function () {
                                    location.reload();
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    // 提交订单
    $(".confirm_order").off().on("click", function () {
        var main = $(this);
        var goodsList = main.parents(".goods_item").find(".goods_info");
        var arrUl = goodsList.find("ul");
        var idArr = [];
        var isApply = true;
        var wholesale = 1;
        var num_calc = kucun = rangeArr = null;
        for (let i = 0; i < arrUl.length; i++) {
            var status = arrUl.eq(i).find(".order_check").is(":checked");
            if (status) {
                idArr.push(arrUl.eq(i).find(".goods_checkbox").attr("id_val"));
                // 判断起订量、购买数量、库存是否合理
                rangeArr = arrUl.eq(i).find(".unit_li").attr("data-range");
                num_calc = arrUl.eq(i).find(".num_calc input").val();
                if (num_calc !== "") {
                    num_calc = parseFloat(num_calc);
                } else {
                    num_calc = 0;
                }
                kucun = parseFloat(arrUl.eq(i).find(".max_kucun").html());
                if (num_calc <= 0) {
                    isApply = false;
                    wholesale = "请填写正确的宝贝数量！";
                    break;
                }
                if (kucun <= 0 || num_calc > kucun) {
                    isApply = false;
                    wholesale = "库存不足！";
                    break;
                }
                if (rangeArr !== "") {
                    rangeArr = rangeArr.split(",");
                    if (num_calc < parseFloat(rangeArr[0])) {
                        isApply = false;
                        wholesale = arrUl.eq(i).find(".goods_name p").html() + "的起订量是" + rangeArr[0] + "以上";
                        break;
                    }
                }
            }
        }
        if (idArr.length === 0) {
            $.msgTips({
                type: "warning",
                content: "请勾选要购买的商品！"
            });
            return false;
        } else if (!isApply) {
            // 起订量、购买数量、库存不合格
            $.msgTips({
                type: "warning",
                content: wholesale
            });
            return false;
        } else {
            location.href = "/Buyer/Order/add.html?shopcart_id=" + idArr.join("_");
        }
    });
});