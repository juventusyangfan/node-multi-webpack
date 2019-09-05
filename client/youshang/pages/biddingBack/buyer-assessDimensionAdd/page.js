require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        $(".affixCon").show().append('<div class="affix_item"><input type="hidden" name="credit_log_src[name][]" value="' + name + '"><input type="hidden" name="credit_log_src[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>');
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

    // var uploadKey = true; //上传开关
    // $(document).on("click", "#uploadFile", function () {
    //     if (uploadKey) {
    //         if ($(".affix_item").length >= 8) {
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
    //                         var html = '<div class="affix_item"><input type="hidden" name="credit_log_src[name][]" value="' + dataObj.name + '"><input type="hidden" name="credit_log_src[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + dataObj.name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
    //                         $(".affixCon").show().append(html);

    //                         //删除附件
    //                         $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
    //                             $(this).parents(".affix_item").remove();
    //                             if ($(".affix_item").length <= 0) {
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

    //确认提交
    $(".btn_confirm").unbind().bind("click", function () {
        var requestData = $("form").serialize();
        $.ajaxForJson(config.youshangPath + "purchaser/evaluate/addRecordPost", requestData, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg,
                    callback: function () {
                        location.href = "/purchaser/evaluate/index";
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});