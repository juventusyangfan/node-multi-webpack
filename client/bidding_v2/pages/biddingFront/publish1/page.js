require('cp');
require('elem');
require('../../../public-resource/css/componentPublish.css');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //选择标包信息
    $("input[name='pType']").unbind().bind("change", function () {
        if ($(this).val() == "single") {
            $(".package_single").show();
            $(".package_multi").hide();
        } else {
            $(".package_multi").show();
            $(".package_single").hide();
        }
    });

    //添加删除行
    $(".publish_table").on("click", ".add_multi,.row_add a", function () {
        var _tr = $(this).parents("tr"),
            projectArr = JSON.parse($("input[name='project']").val());
        var trHTML = '<tr class="js_show">';
        trHTML += '<td><input type="text" name="packageCode" class="cjy-input-" placeholder="包件编号，2-20个字" style="width:85%;"></td>';
        trHTML += '<td><input type="text" name="content" class="cjy-input-" placeholder="采购内容，2-20个字" style="width:90%;"></td>';
        trHTML += '<td><select name="projectId" value="" cjy-search-input>';
        for (var i = 0; i < projectArr.length; i++) {
            trHTML += '<option value="' + projectArr[i].id + '">' + projectArr[i].name + '</option>';
        }
        trHTML += '</select></td>';
        trHTML += '<td><span cjy-area></span></td>';
        trHTML += '<td><input type="text" name="address" class="cjy-input-" placeholder="请输入详细地址" style="width:88%;"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div></td>';
        trHTML += '</tr>';
        if ($(this).hasClass("add_multi")) {
            _tr.after(trHTML);
            _tr.next().find("select").initSelect();
            _tr.next().find("[cjy-area]").initAreaSelect();
        } else {
            _tr.before(trHTML);
            _tr.prev().find("select").initSelect();
            _tr.prev().find("[cjy-area]").initAreaSelect();
        }
        return false;
    });
    $(".publish_table").on("click", ".del_multi", function () {
        var _tr = $(this).parents("tr").remove();
        return false;
    });

    //选择采购类别
    $("input[name='cgClass']").unbind().bind("change", function () {
        if ($(this).val() == "1") {
            $(".js_blockShow").show();
        } else {
            $(".js_blockShow").hide();
        }
    });

    //填写预算金娥
    $("input[name='ysMoney']").unbind().bind("input", function () {
        libs.lenNumber(this, 2);
    });

    //发布下一步
    $(".btn_next").unbind().bind("click", function () {
        if ($(this).attr("type") == "no") {
            var _href = $(this).attr("href");
            window.location.href = _href;
        } else {
            var _data = null;
            if ($("input[name='pType']:checked").val() == "multi") {
                var _arr = [];
                $(".package_multi table").find("tr.js_show").each(function () {
                    var main = $(this);
                    var _obj = {
                        packageCode: main.find("input[name='packageCode']").val(),
                        content: main.find("input[name='content']").val(),
                        projectId: main.find("select[name='projectId']").val(),
                        province: main.find("input[name='province']").val(),
                        province_code: main.find("input[name='province_code']").val(),
                        city: main.find("input[name='city']").val(),
                        city_code: main.find("input[name='city_code']").val(),
                        area: main.find("input[name='area']").val(),
                        area_code: main.find("input[name='area_code']").val(),
                        address: main.find("input[name='address']").val()
                    }
                    _arr.push(_obj);
                });
                var _wzClass = $("input[name='cgClass']:checked").val() == "1" ? $("input[name='wzClass']:checked").val() : "";
                _data = {
                    cType: $("input[name='cType']").val(),
                    step: $("input[name='step']").val(),
                    draft: $("input[name='draft']").val(),
                    edit: $("input[name='edit']").val(),
                    tName: $("input[name='tName']").val(),
                    tCode: $("input[name='tCode']").val(),
                    tId: $("input[name='tId']").val(),
                    zsType: $("input[name='zsType']:checked").val(),
                    package: _arr,
                    cgClass: $("input[name='cgClass']:checked").val(),
                    wzClass: _wzClass,
                    ysMoney: $("input[name='ysMoney']").val(),
                    lxPeople: $("input[name='lxPeople']").val(),
                    mobile: $("input[name='mobile']").val(),
                    landline: $("input[name='landline']").val()
                }
            } else {
                var _wzClass = $("input[name='cgClass']:checked").val() == "1" ? $("input[name='wzClass']:checked").val() : "";
                _data = {
                    cType: $("input[name='cType']").val(),
                    step: $("input[name='step']").val(),
                    draft: $("input[name='draft']").val(),
                    edit: $("input[name='edit']").val(),
                    tName: $("input[name='tName']").val(),
                    tCode: $("input[name='tCode']").val(),
                    tId: $("input[name='tId']").val(),
                    zsType: $("input[name='zsType']:checked").val(),
                    content: $(".package_single").find("input[name='content']").val(),
                    projectId: $(".package_single").find("select[name='projectId']").val(),
                    province: $(".package_single").find("input[name='province']").val(),
                    province_code: $(".package_single").find("input[name='province_code']").val(),
                    city: $(".package_single").find("input[name='city']").val(),
                    city_code: $(".package_single").find("input[name='city_code']").val(),
                    area: $(".package_single").find("input[name='area']").val(),
                    area_code: $(".package_single").find("input[name='area_code']").val(),
                    address: $(".package_single").find("input[name='address']").val(),
                    cgClass: $("input[name='cgClass']:checked").val(),
                    wzClass: _wzClass,
                    ysMoney: $("input[name='ysMoney']").val(),
                    lxPeople: $("input[name='lxPeople']").val(),
                    mobile: $("input[name='mobile']").val(),
                    landline: $("input[name='landline']").val()
                }
            }
            $.ajaxForJson(config.wwwPath + "buyer/tender/addajax", _data, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: "成功",
                        callback: function () {
                            window.location.href = dataObj.data.url;
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
            });
        }
        return false;
    });

    //保存为草稿
    $(".btn_draft").unbind().bind("click", function () {
        $("input[name='draft']").val(1);
        $(".btn_next").trigger("click");
        return false;
    });
});