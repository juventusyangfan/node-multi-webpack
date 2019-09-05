require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

$(() => {
    $(".cjy-textarea").focus();
    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        if ($("input[name='tenderFile[name][]']").length >= 8) {
            $.msgTips({
                type: "warning",
                content: "最多上传8个附件"
            });
            return false;
        }
        var html = '<li><input type="hidden" name="tenderFile[name][]" value="' + name + '"><input type="hidden" name="tenderFile[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
        $(".showFileCon").show();
        $(".showFileCon ul").append(html);

        //删除附件
        $(".showFileCon").find("li a").unbind().bind("click", function () {
            $(this).parents("li").remove();
            if ($(".showFileCon li").length <= 0) {
                $(".showFileCon").hide();
            }
            return false;
        }, {
            extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
        });
    });
    // //附件上传
    // $(document).on("click", "input[name='uploadFile']", function () {
    //     if ($("input[name='tenderFile[name][]']").length >= 8) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传8个附件"
    //         });
    //         return false;
    //     }
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.wwwPath + 'ajaxUploadTenderFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var html = '<li><input type="hidden" name="tenderFile[name][]" value="' + dataObj.name + '"><input type="hidden" name="tenderFile[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + dataObj.name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
    //                     $(".showFileCon").show();
    //                     $(".showFileCon ul").append(html);

    //                     //删除附件
    //                     $(".showFileCon").find("li a").unbind().bind("click", function () {
    //                         $(this).parents("li").remove();
    //                         if ($(".showFileCon li").length <= 0) {
    //                             $(".showFileCon").hide();
    //                         }
    //                         return false;
    //                     });
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.message
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {
    //                 $.msgTips({
    //                     type: "warning",
    //                     content: "文件不正确"
    //                 });
    //             }
    //         });
    //     });
    // });
    //删除附件
    $(".showFileCon").find("li a").unbind().bind("click", function () {
        $(this).parents("li").remove();
        if ($(".showFileCon li").length <= 0) {
            $(".showFileCon").hide();
        }
        return false;
    });

    //预览
    $(".preview_btn").unbind().bind("click", function () {
        var main = $(this);
        if ($("select[name='tenderOpenPerson']").length > 0 && $("select[name='tenderOpenPerson']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "经办人不能为空！"
            });
        } else if ($(".showFileCon").find("li").length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请上传招标文件！"
            });
        } else {
            var reqData = $("form").serialize();
            reqData += "&draft=1";
            $.ajaxForJson(config.wwwPath + "/ajaxEidtTenderFile", reqData, function (dataObj) {
                if (dataObj.code == 2000) {
                    window.location.href = main.attr("data-href");
                } else {
                    var obj = $("[name='" + dataObj.data + "']");
                    if (obj.length > 0 && obj[0].tagName.toUpperCase() == "INPUT") {
                        obj.focus();
                    } else if (obj.length > 0 && obj[0].tagName.toUpperCase() == "SELECT") {
                        obj.next(".cjy-select").find("input.cjy-select-input").focus().trigger("click");
                    }
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
            });
        }
        return false;
    });

    //第二步确认事件
    $(".btn_confirm").unbind().bind("click", function () {
        var main = $(this);
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '确认发布后将不可更改，请仔细核对招标信息！'],
            content: '',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var reqData = $("form").serialize();
                    $.ajaxForJson(config.wwwPath + "/ajaxEidtTenderFile", reqData, function (dataObj) {
                        if (dataObj.code == 2000) {
                            // $.msgTips({
                            //     type: "success",
                            //     content: dataObj.msg
                            // });
                            // setTimeout(function () {
                            window.location.href = "/exclusive/details/" + dataObj.data + ".html";
                            // }, 1000);
                        } else {
                            var obj = $("[name='" + dataObj.data + "']");
                            if (obj.length > 0 && obj[0].tagName.toUpperCase() == "INPUT") {
                                obj.focus();
                            } else if (obj.length > 0 && obj[0].tagName.toUpperCase() == "SELECT") {
                                obj.next(".cjy-select").find("input.cjy-select-input").focus().trigger("click");
                            }
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                    return false;
                });
            }
        });
        return false;
    });
    //第二步草稿
    $(".btn_draft").unbind().bind("click", function () {
        var main = $(this);
        var reqData = $("form").serialize();
        if (main.hasClass("btn_draft")) {
            reqData += "&draft=" + main.attr("draft");
        }
        $.ajaxForJson(config.wwwPath + "/ajaxEidtTenderFile", reqData, function (dataObj) {
            if (dataObj.code == 2000) {
                // $.msgTips({
                //     type: "success",
                //     content: dataObj.msg
                // });
                // setTimeout(function () {
                    window.location.href = "/tender/lists.html";
                // }, 1000);
            } else {
                var obj = $("[name='" + dataObj.data + "']");
                if (obj.length > 0 && obj[0].tagName.toUpperCase() == "INPUT") {
                    obj.focus();
                } else if (obj.length > 0 && obj[0].tagName.toUpperCase() == "SELECT") {
                    obj.next(".cjy-select").find("input.cjy-select-input").focus().trigger("click");
                }
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});