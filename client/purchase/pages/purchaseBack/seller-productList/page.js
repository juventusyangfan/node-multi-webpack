require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    var vm = new Vue({
        el: '#productList',
        data: {
            imgPath: config.filePath,
            loading: true,//loading图
            list: [],//商品列表
            count: 0,//商品总数
            current: 1,//当前分页
            parentCategoryId: 0,//父级分类id
            categoryId: 0,//分类id
            productName: 0,//商品名称
            brandId: 0,//品牌id
            warehouseId: 0,//仓库id
            status: ""//商品状态id
        },
        mounted() {
            this.getProduct(1);
        },
        methods: {
            getProduct(currentPage) {
                var vueObj = this;
                vueObj.parentCategoryId = $("select[name='parent_category_id']").val();
                vueObj.categoryId = $("select[name='category_id']").val();
                vueObj.productName = $("input[name='name']").val();
                vueObj.brandId = $("select[name='brand_id']").val();
                vueObj.warehouseId = $("select[name='warehouse_id']").val();
                vueObj.status = $("select[name='status']").val();
                var reqUrl = config.shopPath + "Seller/goods/indexAjax",
                    reqData = {
                        parent_category_id: vueObj.parentCategoryId,
                        category_id: vueObj.categoryId,
                        name: vueObj.productName,
                        brand_id: vueObj.brandId,
                        warehouse_id: vueObj.warehouseId,
                        status: vueObj.status,
                        p: currentPage
                    };
                $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                    if (dataObj.code == 2000) {
                        vueObj.count = dataObj.data.count;
                        vueObj.list = dataObj.data.list;
                        vueObj.loading = false;
                        vueObj.current = currentPage;
                        vueObj.$nextTick(() => {
                            $("input[type='checkbox']").initCheckbox();
                            changeBox();
                            $(".edit_container").find("input.cjy-input-").unbind().bind("input", function () {
                                libs.lenNumber(this, 2);
                            });
                        });
                    }
                }, function () {
                    vueObj.loading = false;
                    vueObj.list = [];
                    vueObj.count = 0;
                });
            },
            saveList(index) {
                var vueObj = this;
                var ajaxKey = true;
                $(".edit_container").eq(index).find("input.cjy-input-").each(function () {
                    if ($(this).val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "提交数据不能为空!"
                        });
                        $(this).initInput('error', '');
                        $(this).unbind().bind("blur", function () {
                            $(this).initInput();
                        });
                        ajaxKey = false;
                        return false;
                    }
                });
                if (ajaxKey) {
                    var reqUrl = config.shopPath + "Seller/goods/editGoodsBasicAjax",
                        reqData = $(".edit_container").eq(index).find("form").serialize();
                    $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
                            });
                            $(".product_tbody").find("tr").removeClass("open");
                            $(".product_tbody").find(".edit_container").hide(100);
                            vueObj.getProduct(vueObj.current);
                        }
                        else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                }
            }
        }
    });

    //设置修改虚框宽度高度
    function changeBox() {
        $(".edit_box").each(function () {
            var width = $(this).parent("td.price_num").width() - 2,
                height = $(this).parent("td.price_num").height() - 2;

            $(this).css({ "width": width + "px", "height": height + "px" });
        });
    }
    $(window).resize(function () {
        changeBox();
    });

    //设置价格库存
    $(".material_list").on("click", ".edit_box .edit_icon", function () {
        var boxH = $(this).parent().height();
        $(".product_tbody").find("tr").removeClass("open");
        $(".product_tbody").find(".edit_container").hide(100);
        $(this).parents("tr").addClass("open");
        $(this).parent().find(".edit_container").css("margin-top", (boxH - 15) + "px").show(100);
        $(".show_container").hide(100);
        return false;
    });
    //库存取消事件
    $(".material_list").on("click", ".edit_btn_cancel", function () {
        $(this).parents("tr").removeClass("open");
        $(this).parents(".edit_container").hide(100);
        return false;
    });

    //设置阶梯价框
    var timerInner = null;
    $(".material_list").on({
        mouseover: function () {
            var tdObj = $(this),
                trObj = tdObj.parent(),
                tableObj = tdObj.parents("table"),
                box = $(".change_box"),
                boxW = trObj.find("td.numTd").outerWidth() + trObj.find("td.priceTd").outerWidth(),
                boxH = trObj.outerHeight(),
                boxT = trObj.find("td.numTd")[0].offsetTop,
                boxL = trObj.find("td.numTd")[0].offsetLeft,
                rowIndex = trObj.attr("row");

            box.show();
            box.css({ "width": boxW + "px", "height": boxH + "px", "left": boxL + "px" });
            box.animate({ "top": (boxT + 15) + "px" }, 100);
            if (trObj.find("td.totalTd").length > 0) {
                box.find(".change_del").hide();
            }
            else {
                box.find(".change_del").show();
            }
            clearTimeout(timerInner);
            $(".change_box").unbind().bind({
                mouseover: function () {
                    clearTimeout(timerInner);
                },
                mouseout: function () {
                    box = $(".change_box");
                    timerInner = setTimeout(function () {
                        box.hide(100);
                    }, 50);
                }
            });
            //添加删除修改价格区间
            $(".change_add").unbind().bind("click", function () {
                var rowspan = tableObj.find("tr[row='" + rowIndex + "']").find("td[rowspan]").attr("rowspan") ? parseInt(tableObj.find("tr[row='" + rowIndex + "']").find("td[rowspan]").attr("rowspan")) : 1;
                tableObj.find("tr[row='" + rowIndex + "']").find("td").attr("rowspan", rowspan + 1);
                tableObj.find("tr[row='" + rowIndex + "']").find("td.numTd").attr("rowspan", "");
                tableObj.find("tr[row='" + rowIndex + "']").find("td.priceTd").attr("rowspan", "");
                var trHTML = '<tr row="' + rowIndex + '"><td class="numTd"><span class="textBlack3">起订量</span><input type="text" class="cjy-input-">及以上</td><td class="priceTd"><input type="text" class="cjy-input-"></td></tr>';
                trObj.after(trHTML);
                changeTableName(tableObj.eq(0).find("td.numTd input"), tableObj.eq(0).find("td.priceTd input"));
                box.hide(100);
                return false;
            });
            $(".change_del").unbind().bind("click", function () {
                var rowspan = parseInt(tableObj.find("tr[row='" + rowIndex + "']").find("td[rowspan]").attr("rowspan"));
                trObj.remove();
                tableObj.find("tr[row='" + rowIndex + "']").find("td").attr("rowspan", rowspan - 1);
                tableObj.find("tr[row='" + rowIndex + "']").find("td.numTd").attr("rowspan", "");
                tableObj.find("tr[row='" + rowIndex + "']").find("td.priceTd").attr("rowspan", "");
                changeTableName(tableObj.eq(0).find("td.numTd input"), tableObj.eq(0).find("td.priceTd input"));
                box.hide(100);
                return false;
            });
            function changeTableName(numArr, priceArr) {
                for (var i = 0; i < numArr.length; i++) {
                    numArr.eq(i).attr("name", "goods_info[step][nums][" + i + "][]");
                    priceArr.eq(i).attr("name", "goods_info[step][price][" + i + "][]");
                }
            }
        },
        mouseout: function () {
            box = $(".change_box");
            timerInner = setTimeout(function () {
                box.hide(100);
            }, 50);
        }
    }, "td.numTd,td.priceTd");

    //查看全部属性
    $(".material_list").on("click", ".show_attr", function () {
        if ($(this).parent().find(".show_container").is(":hidden")) {
            $(this).parent().find(".show_container").show(100);
        }
        else {
            $(this).parent().find(".show_container").hide(100);
        }
        return false;
    });
    $(document).on("click", function (e) {
        var _con = $('.cjy-show_attr,.show_container');   // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            $(".show_container").hide(100);
        }
    });

    //全选
    $(".material_list_header").on("change", "input[type='checkbox']", function () {
        if ($(this).prop("checked")) {
            $(".product_tbody").find("input[type='checkbox']").prop("checked", true);
        }
        else {
            $(".product_tbody").find("input[type='checkbox']").prop("checked", false);
        }
        $(".product_tbody").find("input[type='checkbox']").initCheckbox();
    });
    $(".product_tbody").on("change", "input[type='checkbox']", function () {
        if (!$(this).prop("checked")) {
            $(".material_list_header").find("input[type='checkbox']").prop("checked", false).initCheckbox();
        }
    });
    //上架、下架、删除
    function goodsHandle(idArr, url) {
        $.ajaxForJson(config.shopPath + "Seller/goods/" + url, {
            product_ids: idArr
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg
                });
                $(".product_tbody").find("tr").removeClass("open");
                $(".product_tbody").find(".edit_container").hide(100);
                vm.getProduct(vm.current);
            }
            else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg,
                    time: 2000
                });
            }
        });
    }
    $(".material_list").on("click", ".btn_shelf_s", function () {
        var trObj = $(this).parents("tr");
        $.cueDialog({
            title: "提示",
            content: "确认上架此商品？",// 主文本
            callback: function () {
                var idArr = [];
                var productId = trObj.find("input[name='product_id']").val();
                idArr.push(productId);
                goodsHandle(idArr, 'upGoods');
            }
        });
        return false;
    });
    $(".material_list").on("click", ".btn_shelf", function () {
        $.cueDialog({
            title: "提示",
            content: "确认上架这些商品？",// 主文本
            callback: function () {
                var idArr = [];
                $("tbody.product_tbody > tr").each(function () {
                    if ($(this).find("input[type='checkbox']").prop("checked")) {
                        var productId = $(this).find("input[name='product_id']").val();
                        idArr.push(productId);
                    }
                });
                goodsHandle(idArr, 'upGoods');
            }
        });
        return false;
    });
    $(".material_list").on("click", ".btn_obtained_s", function () {
        var trObj = $(this).parents("tr");
        $.cueDialog({
            title: "提示",
            content: "确认下架此商品？",// 主文本
            callback: function () {
                var idArr = [];
                var productId = trObj.find("input[name='product_id']").val();
                idArr.push(productId);
                goodsHandle(idArr, 'downGoods');
            }
        });
        return false;
    });
    $(".material_list").on("click", ".btn_obtained", function () {
        $.cueDialog({
            title: "提示",
            content: "确认下架这些商品？",// 主文本
            callback: function () {
                var idArr = [];
                $("tbody.product_tbody > tr").each(function () {
                    if ($(this).find("input[type='checkbox']").prop("checked")) {
                        var productId = $(this).find("input[name='product_id']").val();
                        idArr.push(productId);
                    }
                });
                goodsHandle(idArr, 'downGoods');
            }
        });
        return false;
    });
    $(".material_list").on("click", ".btn_delete_s", function () {
        var trObj = $(this).parents("tr");
        $.cueDialog({
            title: "提示",
            content: "确认删除此商品？",// 主文本
            callback: function () {
                var idArr = [];
                var productId = trObj.find("input[name='product_id']").val();
                idArr.push(productId);
                goodsHandle(idArr, 'delGoods');
            }
        });
        return false;
    });
    $(".material_list").on("click", ".btn_delete", function () {
        $.cueDialog({
            title: "提示",
            content: "确认删除这些商品？",// 主文本
            callback: function () {
                var idArr = [];
                $("tbody.product_tbody > tr").each(function () {
                    if ($(this).find("input[type='checkbox']").prop("checked")) {
                        var productId = $(this).find("input[name='product_id']").val();
                        idArr.push(productId);
                    }
                });
                goodsHandle(idArr, 'delGoods');
            }
        });
        return false;
    });

    //选择分类
    $("select[name='parent_category_id']").unbind().bind("change", function () {
        var id = $(this).val();
        $.ajaxForJson(config.shopPath + "Seller/goods/getListSearchAjax", {
            parent_category_id: id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var category_list = dataObj.data.category_list, brand_list = dataObj.data.brand_list;
                var categoryHTML = '<option value="0">请选择品名</option>';
                for (var i = 0; i < category_list.length; i++) {
                    categoryHTML += '<option value="' + category_list[i].code + '">' + category_list[i].name + '</option>';
                }
                $("select[name='category_id']").html(categoryHTML).attr("value", 0).initSelect();
                var brandHTML = '<option value="0">请选择品牌</option>';
                for (var key in brand_list) {
                    brandHTML += '<option value="' + key + '">' + brand_list[key] + '</option>';
                }
                $("select[name='brand_id']").html(brandHTML).attr("value", 0).initSelect();
            }
        });
    });
    //选择品名
    $("select[name='category_id']").unbind().bind("change", function () {
        var id = $(this).val();
        $.ajaxForJson(config.shopPath + "Seller/goods/getListSearchAjax", {
            category_id: id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var brand_list = dataObj.data.brand_list;
                var brandHTML = '<option value="0">请选择品牌</option>';
                for (var key in brand_list) {
                    brandHTML += '<option value="' + key + '">' + brand_list[key] + '</option>';
                }
                $("select[name='brand_id']").html(brandHTML).attr("value", 0).initSelect();
            }
        });
    });
    //搜索事件
    $(".back_btn_search").unbind().bind("click", function () {
        vm.getProduct(1);
        return false;
    });
    //清空事件
    $(".back_btn_clear").unbind().bind("click", function () {
        $(".back_main_search").find("select").attr("value", '0').initSelect();
        $(".back_main_search").find("input").val("");
        $(".back_main_search").find("select[name='status']").attr("value", '').initSelect();
        vm.getProduct(1);
        return false;
    });
});