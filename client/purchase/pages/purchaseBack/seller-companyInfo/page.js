require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //信息展开收起
    $(".showCon").unbind().bind("click", function () {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $(this).find("span").html("展开");
            $(this).parent().next(".cInfo_cell_con").css({
                "max-height": "0",
                "padding": "0",
                "border-bottom": "none"
            });
        } else {
            $(this).addClass("open");
            $(this).find("span").html("收起");
            $(this).parent().next(".cInfo_cell_con").css({
                "max-height": "1000px",
                "padding": "20px",
                "border-bottom": "solid 1px #e5e5e5"
            });
        }
        return false;
    });
    //查看大图
    $(".img_default img").unbind().bind("click", function () {
        var path = $(this).attr("src");
        $.showPhoto(path);
        return false;
    });
    //logo上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        $(".js_upload").parents(".cInfo_cell_block").find(".img_default img").attr("src", config.filePath + url).css("cursor", "pointer").unbind().bind("click", function () {
            var path = $(this).attr("src");
            $.showPhoto(path);
            return false;
        });
        $(".js_upload").parents(".cInfo_cell_block").find("input[type='hidden']").val(url);
    }, {
        allowedFileTypes: ['image/*'],
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });
    // //logo上传
    // $(document).on("click", "#logo", function () {
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.shopPath + 'uploadImg',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     $("#" + id).parents(".cInfo_cell_block").find(".img_default img").attr("src", config.filePath + dataObj.data).css("cursor", "pointer").unbind().bind("click", function () {
    //                         var path = $(this).attr("src");
    //                         $.showPhoto(path);
    //                         return false;
    //                     });
    //                     $("#" + id).parents(".cInfo_cell_block").find("input[type='hidden']").val(dataObj.data);
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.msg
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {
    //                 $.msgTips({
    //                     type: "warning",
    //                     content: "系统错误"
    //                 });
    //             }
    //         });
    //     });
    // });

    //表单提交
    var ajaxKey = true; //防重复提交开关
    $("a.cInfo_btn_save").unbind().bind("click", function () {
        if ($("input[name='seller_product[]']").length <= 0) {
            $(".cjy-auto-input").focus();
            $.msgTips({
                type: "warning",
                content: "请填写主营产品"
            });
            return false;
        } else if ($.trim($("textarea[name='brief_introduction']").val()) == "") {
            $("textarea[name='brief_introduction']").focus();
            $.msgTips({
                type: "warning",
                content: "请填写公司简介"
            });
            return false;
        } else if ($.trim($("textarea[name='brief_introduction']").val()).length > 800) {
            $("textarea[name='brief_introduction']").focus();
            $.msgTips({
                type: "warning",
                content: "公司简介内容过长"
            });
            return false;
        } else if ($.trim($("input[name='account_name']").val()) == "") {
            $("input[name='account_name']").initInput("error", "");
            $("input[name='account_name']").unbind().bind("blur", function () {
                $("input[name='account_name']").initInput();
            });
            return false;
        } else if ($.trim($("input[name='bank_account']").val()) == "") {
            $("input[name='bank_account']").initInput("error", "");
            $("input[name='bank_account']").unbind().bind("blur", function () {
                $("input[name='bank_account']").initInput();
            });
            return false;
        } else if ($.trim($("input[name='bank_branch']").val()) == "") {
            $("input[name='bank_branch']").initInput("error", "");
            $("input[name='bank_branch']").unbind().bind("blur", function () {
                $("input[name='bank_branch']").initInput();
            });
            return false;
        } else if ($.trim($("input[name='linkman']").val()) == "") {
            $("input[name='linkman']").initInput("error", "请填写联系人");
            $("input[name='linkman']").unbind().bind("blur", function () {
                $("input[name='linkman']").initInput();
            });
            return false;
        } else if (libs.checkNameCH($("input[name='linkman']").val())) {
            $("input[name='linkman']").initInput("error", "请填写中文联系人");
            $("input[name='linkman']").unbind().bind("blur", function () {
                $("input[name='linkman']").initInput();
            });
            return false;
        } else if ($.trim($("input[name='cellphone']").val()) == "" || !libs.checkMobile($("input[name='cellphone']").val())) {
            $("input[name='cellphone']").initInput("error", "请填写正确的手机号");
            $("input[name='cellphone']").unbind().bind("blur", function () {
                $("input[name='cellphone']").initInput();
            });
            return false;
        } else if ($.trim($("input[name='qq']").val()) == "" || !libs.checkQQ($("input[name='qq']").val())) {
            $("input[name='qq']").initInput("error", "请填写正确的QQ号");
            $("input[name='qq']").unbind().bind("blur", function () {
                $("input[name='qq']").initInput();
            });
            return false;
        }
        if (ajaxKey) {
            var reqUrl = config.shopPath + 'fillCompany',
                reqData = $("form").serialize();
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg
                    });
                    setTimeout(function () {
                        window.location.href = "/seller.html";
                    }, 1000);
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    ajaxKey = true;
                }
            });
        }
        ajaxKey = false;
        return false;
    });
});