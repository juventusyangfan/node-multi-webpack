require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    const letterArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

    var reqUrl = config.wwwPath + "/quotationadd";

    //初始化表格
    if (dataJson) {
        dataJson = JSON.parse(dataJson);
        reqUrl = config.wwwPath + "/editQuotation";
        var initHTML = '';
        for (var j = 0; j < dataJson.length; j++) {
            for (var i = 0; i < dataJson[j].product_data.length; i++) {
                initHTML += '<tr>';
                if (dataJson[j].product_data[i].product_id == "") {
                    initHTML += '<td class="js_index">' + (i + 1) + '</td>';//<td><select name="inType" value="2" style="width: 100px;"><option value="1">选择</option><option value="2">自定义</option></select></td>
                    initHTML += '<td class="td_product"><input type="hidden" name="product_id[]" value=""><input type="text" name="product_name[]" class="cjy-input-" value="' + dataJson[j].product_data[i].product_name + '" style="width: 180px;"></td>';
                    initHTML += '<td class="td_gg"><input type="text" name="gg[]" class="cjy-input-" value="' + dataJson[j].product_data[i].gg + '" style="width: 150px;"></td>';
                    initHTML += '<td class="td_unit"><input type="text" name="unit[]" class="cjy-input-" value="' + dataJson[j].product_data[i].unit + '" style="width: 100px;"></td>';
                }
                else {
                    initHTML += '<td>' + i + '</td>';//<td><select name="inType" value="1" style="width: 100px;"><option value="1">选择</option><option value="2">自定义</option></select></td>
                    initHTML += '<td class="td_product"><div cjy-multi data-id="' + dataJson[j].product_data[i].product_id + '" data-name="' + dataJson[j].product_data[i].product_name + '" style="margin-left: 30px;"></div></td>';
                    initHTML += '<td class="td_gg"><select name="gg[]" value="' + dataJson[j].product_data[i].gg + '" unit="' + dataJson[j].product_data[i].unit + '" style="width: 150px;"><option value="' + dataJson[j].product_data[i].gg + '">' + dataJson[j].product_data[i].gg + '</option></select></td>';
                    initHTML += '<td class="td_unit"><input type="hidden" name="unit[]" value="' + dataJson[j].product_data[i].unit + '"><span class="js_unit">' + dataJson[j].product_data[i].unit + '</span></td>';
                }
                initHTML += '<td><input class="cjy-input-" name="product_num[]" value="' + dataJson[j].product_data[i].product_num + '" style="width: 100px;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td><textarea class="cjy-textarea" name="describe[]" maxlen="50" rows="3">' + dataJson[j].product_data[i].describe + '</textarea></td><td><a href="javascript:;" class="js_rowDel"><i class="iconfont icon-huishouxiang fontSize24 textRed"></i></a></td>';
                initHTML += '</tr>';
            }
            initHTML += '<tr><td colspan="13" class="rowAdd js_rowAdd">+</td></tr><tr><td colspan="3">总计</td><td colspan="10"></td></tr><tr><td colspan="3">总计（大写）</td><td colspan="10"></td></tr><tr><td colspan="3">其他报价事项（选填）</td><td colspan="10"><input type="text" name="item" value="' + dataJson[j].item + '" class="cjy-input-" style="width: 1000px;"></td></tr>';
            $(".other_table").eq(j).find("tbody").html(initHTML);
            $(".other_table").eq(j).find("tbody").find("select").initSelect();
            $(".other_table").eq(j).find("tbody").find("textarea").initTextarea();
        }
    }
    initMulti($("[cjy-multi]"));


    //录入方式选择
    $(".other_main").on("change", "select[name='inType']", function () {
        var trObj = $(this).parents("tr");
        if ($(this).val() == "1") {
            trObj.find(".td_product").html('<div cjy-multi style="margin-left: 30px;"></div>');
            trObj.find(".td_gg").html('<select name="gg[]" value="" style="width: 150px;"><option value="">请选择规格型号</option></select>');
            trObj.find(".td_unit").html('<input type="hidden" name="unit[]"><span class="js_unit"></span>');
            trObj.find("select").initSelect();
            initMulti(trObj.find("[cjy-multi]"));
        }
        else {
            trObj.find(".td_product").html('<input type="hidden" name="product_id[]" value=""><input type="text" name="product_name[]" class="cjy-input-" style="width: 180px;">');
            trObj.find(".td_gg").html('<input type="text" name="gg[]" class="cjy-input-" style="width: 150px;">');
            trObj.find(".td_unit").html('<input type="text" name="unit[]" class="cjy-input-" style="width: 100px;">');
        }
    });

    //渲染物资名称
    function initMulti(obj) {
        obj.initMultiSelect(function () {
            var main = arguments[0];
            var id = main.find("input[name='product_id[]']").val();
            $.ajaxForJson(config.wwwPath + "/getSpecies", {
                id: id
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    var ggHTML = '<option value="">请选择规格型号</option>';
                    for (var i = 0; i < dataObj.data.length; i++) {
                        ggHTML += '<option value="' + dataObj.data[i].model + '" unit="' + dataObj.data[i].unit + '">' + dataObj.data[i].model + '</option>';
                    }
                    main.parents("tr").find("select[name='gg[]']").html(ggHTML).attr("value", "").initSelect();
                }
            });
        });
    }

    //选择规格型号
    $(".other_main").on("change", "select[name='gg[]']", function () {
        var unit = $(this).find("option:selected").attr("unit");
        $(this).parents("tr").find("span.js_unit").html(unit);
        $(this).parents("tr").find("input[name='unit[]']").val(unit);
    });

    //填写数量
    $(".other_main").on("input", "input[name='product_num[]']", function () {
        libs.lenNumber(this, 3);
    });


    $(".priceType_border").css({
        "width": $(".js_type").width() + 1 + "px",
        "height": $(".other_table table").height() - 40 + "px"
    }).show();
    $(".js_type").eq(0).find(".handle_con").css("left", $(".js_type").width() + "px").show();
    //展示综合单价类型下拉框
    $(".other_table").on("click", ".priceType i.icon-xiajiantou", function () {
        var main = $(this);
        if (main.parent().find(".priceType_con").css("display") == "none") {
            main.parent().find(".priceType_con").show();
        }
        else {
            main.parent().find(".priceType_con").hide();
        }
        return false;
    });
    $(".other_table").on("click", ".priceType_con li", function () {
        var main = $(this);
        main.parents(".priceType").find("input").val(main.html());
        main.parents(".priceType_con").find("li").removeClass("act");
        main.addClass("act");
        main.parents(".priceType_con").hide();
        return false;
    });

    //展示选中框
    $(".other_table").on("mouseover", ".js_type", function () {
        var main = $(this);
        var left = main.position().left + $(".other_table").scrollLeft(),
            top = main.position().top,
            width = main.width() + 1,
            height = main.parents("table").height() - 40;
        $(".priceType_border").css({
            "left": left + "px",
            "top": top + "px",
            "width": width + "px",
            "height": height + "px"
        });
        $(".other_table").find(".handle_con").hide();
        main.find(".handle_con").css("left", (width - 1) + "px").show();
    });

    //添加列
    $(".other_table").on("click", "a.handle_add", function () {
        var main = $(this), table = main.parents("table"), tbody = table.find("tbody"), thead = table.find("thead"),
            index = main.parents(".js_type").index();
        var th1 = main.parents(".js_type").clone();
        main.parents(".js_type").after(th1);
        var th2 = thead.find("tr").eq(2).find("th").eq(index + 1).clone();
        thead.find("tr").eq(2).find("th").eq(index + 1).after(th2);
        tbody.find("tr").each(function () {
            var td = $(this).find("td").eq(index + 6).clone();
            $(this).find("td").eq(index + 6).after(td)
        });

        $(".js_title").attr("colspan", parseInt($(".js_title").attr("colspan")) + 1);
        $(".js_rowAdd").attr("colspan", parseInt($(".js_rowAdd").attr("colspan")) + 1);
        //设置序号
        $(".js_letter").each(function (n) {
            $(this).html(letterArr[n]);
        });
        return false;
    });
    //删除列
    $(".other_table").on("click", "a.handle_del", function () {
        if ($(".js_type").length <= 1) {
            $.msgTips({
                type: "warning",
                content: "请至少保留一列综合单价"
            });
            return false;
        }
        var main = $(this), table = main.parents("table"), tbody = table.find("tbody"), thead = table.find("thead"),
            index = main.parents(".js_type").index();
        main.parents(".js_type").remove();
        thead.find("tr").eq(2).find("th").eq(index + 1).remove();
        tbody.find("tr").each(function () {
            $(this).find("td").eq(index + 6).remove();
        });

        $(".js_title").attr("colspan", parseInt($(".js_title").attr("colspan")) - 1);
        $(".js_rowAdd").attr("colspan", parseInt($(".js_rowAdd").attr("colspan")) - 1);
        //设置序号
        $(".js_letter").each(function (n) {
            $(this).html(letterArr[n]);
        });
        return false;
    });

    //添加行
    $(".js_rowAdd").unbind().bind("click", function () {
        if ($("input[name='type']").val() == "1") {
            var trHTML = '<tr><td class="js_index">1</td><td class="td_product"><div cjy-multi style="margin-left: 30px;"></div></td><td class="td_gg"><select name="gg[]" value="" style="width: 150px;"><option value="">请选择规格型号</option></select></td><td class="td_unit"><input type="hidden" name="unit[]"><span class="js_unit"></span></td><td><input class="cjy-input-" name="product_num[]" style="width: 100px;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td><textarea class="cjy-textarea" name="describe[]" maxlen="50" rows="3"></textarea></td><td><a href="javascript:;" class="js_rowDel"><i class="iconfont icon-huishouxiang fontSize24 textRed"></i></a></td></tr>';
        }
        else {
            var tr = $(this).parents("tr").prev().clone();
            $(this).parents("tr").before(tr);
            $(".priceType_border").css({
                "height": $(".other_table table").height() - 40 + "px"
            });
        }
        $(this).parents("tr").before(trHTML);
        $(this).parents("tr").prev().find("select").initSelect();
        $(this).parents("tr").prev().find("textarea").initTextarea();
        initMulti($(this).parents("tr").prev().find("[cjy-multi]"));
        setIndex();
        return false;
    });
    //删除行
    $(".other_table").on("click", "a.js_rowDel", function () {
        if ($(".js_rowDel").length <= 1) {
            $.msgTips({
                type: "warning",
                content: "请至少保留一行数据"
            });
            return false;
        }
        $(this).parents("tr").remove();
        $(".priceType_border").css({
            "height": $(".other_table table").height() - 40 + "px"
        });
        setIndex();
        return false;
    });

    //重置序号
    function setIndex() {
        $(".other_table").each(function () {
            var indexArr = $(this).find("td.js_index");
            for (var i = 1; i <= indexArr.length; i++) {
                indexArr.eq(i - 1).html(i);
            }
        });
    }

    //点击右箭头滑动
    $(".move_right").bind({
        "mousedown": function () {
            move("right");
            return false;
        },
        "mouseup": function () {
            $(".other_table").stop();
            return false;
        }
    });
    //点击左箭头滑动
    $(".move_left").bind({
        "mousedown": function () {
            move("left");
            return false;
        },
        "mouseup": function () {
            $(".other_table").stop();
            return false;
        }
    });

    function move(type) {
        if (type == "left") {
            var time = $(".other_table").scrollLeft();
            $(".other_table").animate({scrollLeft: 0}, time);

        }
        else if (type == "right") {
            var time = $(".other_table table").width() - $(".other_table").width() - $(".other_table").scrollLeft();
            $(".other_table").animate({scrollLeft: $(".other_table table").width() - $(".other_table").width()}, time);
        }
    }

    $(".other_table").bind("scroll", function () {
        var main = $(this);
        var scrollX = main.scrollLeft();

        if (scrollX <= 0) {
            main.removeClass("js_left");
        }
        else {
            main.addClass("js_left");
        }
        if (scrollX >= main.find("table").width() - main.width()) {
            main.removeClass("js_right");
        }
        else {
            main.addClass("js_right");
        }

        $(".move_left").css("left", scrollX + "px");
        $(".move_right").css("left", main.width() + scrollX - 48 + "px");
    });

    //提交表单
    $(".btn_confirm").unbind().bind("click", function () {
        if ($("textarea.cjy-textarea-error").length > 0) {
            $.msgTips({
                type: "warning",
                content: "描述文字过多"
            });
            $("textarea.cjy-textarea-error").focus();
            return false;
        }
        var reqData = $(".other_main form").serialize();
        $.ajaxForJson(reqUrl, reqData, function (dataObj) {
            if (dataObj.code == "2000") {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg
                });
                setTimeout(function () {
                    window.opener = null;
                    window.close();
                }, 1000)
            }
            else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});