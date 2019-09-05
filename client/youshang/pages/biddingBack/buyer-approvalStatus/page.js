require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        var html = '<div class="affix_item"><input type="hidden" name="audit_file[name][]" value="' + name + '"><input type="hidden" name="audit_file[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
        $(".affixCon").show().append(html);
        //删除附件
        $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
            $(this).parents(".affix_item").remove();
            if ($(".affix_item").length <= 0) {
                $(".affixCon").hide();
            }
            return false;
        });
    }, {
        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
    });
    //删除附件
    $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
        $(this).parents(".affix_item").remove();
        if ($(".affixCon").find(".affix_item").length <= 0) {
            $(".affixCon").hide();
        }
        return false;
    });
    // var uploadKey = true; //上传开关
    // $(document).on("click", "#uploadFile", function () {
    //     if (uploadKey) {
    //         if ($(".affixCon").find(".affix_item").length >= 8) {
    //             $.msgTips({
    //                 type: "warning",
    //                 content: "最多上传8个附件"
    //             });
    //             return false;
    //         }
    //         $("#uploadFile").unbind().bind("change", function () {
    //             uploadKey = false;
    //             $(".js_upload").find("span").html("上传中...");
    //             var id = "uploadFile";
    //             document.domain = config.domainStr;
    //             $.ajaxFileUpload({
    //                 url: config.youshangPath + 'uploadFile',
    //                 secureuri: config.domainStr,
    //                 fileElementId: id,
    //                 data: {
    //                     name: "uploadFile"
    //                 },
    //                 success: function success(data) {
    //                     var dataObj = eval('(' + data + ')');
    //                     if (dataObj.code == 2000) {
    //                         var html = '<div class="affix_item"><input type="hidden" name="audit_file[name][]" value="' + dataObj.name + '"><input type="hidden" name="audit_file[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + dataObj.name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
    //                         $(".affixCon").show().append(html);

    //                         //删除附件
    //                         $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
    //                             $(this).parents(".affix_item").remove();
    //                             if ($(".affixCon").find(".affix_item").length <= 0) {
    //                                 $(".affixCon").hide();
    //                             }
    //                             return false;
    //                         });
    //                     } else {
    //                         $.msgTips({
    //                             type: "warning",
    //                             content: dataObj.message
    //                         });
    //                     }
    //                     uploadKey = true;
    //                     $(".js_upload").find("span").html("上传");
    //                 },
    //                 error: function error(data, status) {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: "文件过大或格式不正确"
    //                     });
    //                     uploadKey = true;
    //                     $(".js_upload").find("span").html("上传");
    //                 }
    //             });
    //         });
    //     }
    // });

    //选择加入状态
    $("input[name='status']").unbind().bind("change", function () {
        if ($("input[name='status']:checked").val() == "5") {
            $("#is_show_reason").show();
            $("#is_show").hide();
        } else {
            $("#is_show_reason").hide();
            $("#is_show").show();
        }
    });
    //选择供应商类别
    $("input[name='youshang_type_id[]']").unbind().bind("change", function () {
        if ($(this).prop("checked")) {
            $(this).parents(".back_main_block").find(".back_info_select").show();
            $(this).parents(".back_main_block").find(".back_info_select select").removeAttr("disabled");
        } else {
            $(this).parents(".back_main_block").find(".back_info_select").hide();
            $(this).parents(".back_main_block").find(".back_info_select select").attr("disabled", "disabled");
        }
    });

    //提交表单
    $(".btn_confirm").unbind().bind("click", function () {
        ajaxKey = true;
        if ($("input[name='status']:checked").val() == "4") {
            $("input[name='youshang_type_id[]']:checked").each(function (n) {
                var _level = $("input[name='youshang_type_id[]']:checked").eq(n).parents(".back_main_block").find("select").val();
                if (_level == "") {
                    ajaxKey = false;
                }
            });
        }
        if ($("input[name='youshang_type_id[]']:checked").length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请至少选择一个供应商类别！"
            });
        } else if (!ajaxKey) {
            $.msgTips({
                type: "warning",
                content: "请设置供应商等级！"
            });
        } else {
            $.ajaxForJson(config.youshangPath + 'purchaser/invitation/auditSupplierPost', $("form").serialize(), function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg,
                        callback: function () {
                            window.location.href = "/purchaser/invitation/auditList";
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
});