/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //监测开标口令
    $("input[name='token']").unbind().bind("blur", function () {
        var main = $(this),
            _val = main.val();
        if ($.trim(_val) != "") {
            $.ajaxForJson(config.pingbiaoPath + "OpenTender/openTokenVerify", {
                token: _val,
                tender_id: $("input[name='tender_id']").val()
            }, function (dataObj) {
                main.parent().find(".input-tips").remove();
                if (dataObj.code == 2000) {
                    main.parent().append('<span class="input-tips"><i class="iconfont icon-gou"></i></span>');
                    if ($(".box_upload_con").find("i.icon-gou").length > 0) {
                        $(".room_box_confirm").removeClass("disNone");
                    }
                } else {
                    main.parent().append('<span class="input-tips"><i class="iconfont icon-cha1"></i></span>');
                    $(".room_box_confirm").addClass("disNone");
                }
            });
        }
    });

    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        $.ajaxForJson(config.pingbiaoPath + "OpenTender/openKeyVerify", {
            key_file_url: url,
            tender_id: $("input[name='tender_id']").val()
        }, function (json) {
            if (json.code == 2000) {
                $(".box_upload_con").html('<a target="_blank" href="' + config.filePath + url + '">' + name + '</a><span class="input-tips"><i class="iconfont icon-gou"></i><input name="key_file_url" type="hidden" value="' + url + '"></span>');
                if ($("input[name='token']").parent().find("i.icon-gou").length > 0) {
                    $(".room_box_confirm").removeClass("disNone");
                }
            } else {
                $(".box_upload_con").html('<a target="_blank" href="' + config.filePath + url + '">' + name + '</a><span class="input-tips"><i class="iconfont icon-cha1"></i></span>');
                $(".room_box_confirm").addClass("disNone");
            }
        });
    }, {
        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
    });

    //图片上传
    // $(document).on("click", "input[name='uploadFile']", function () {
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.pingbiaoPath + 'uploadFile',
    //             secureuri: config.domainStr,
    //             fileElementId: "uploadFile",
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     $.ajaxForJson(config.pingbiaoPath + "OpenTender/openKeyVerify", {
    //                         key_file_url: dataObj.data,
    //                         tender_id: $("input[name='tender_id']").val()
    //                     }, function (json) {
    //                         if (json.code == 2000) {
    //                             $(".box_upload_con").html('<a target="_blank" href="' + config.filePath + dataObj.data + '">' + dataObj.name + '</a><span class="input-tips"><i class="iconfont icon-gou"></i><input name="key_file_url" type="hidden" value="' + dataObj.data + '"></span>');
    //                             if ($("input[name='token']").parent().find("i.icon-gou").length > 0) {
    //                                 $(".room_box_confirm").removeClass("disNone");
    //                             }
    //                         } else {
    //                             $(".box_upload_con").html('<a target="_blank" href="' + config.filePath + dataObj.data + '">' + dataObj.name + '</a><span class="input-tips"><i class="iconfont icon-cha1"></i></span>');
    //                             $(".room_box_confirm").addClass("disNone");
    //                         }
    //                     });
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

    //开标
    $(".room_box_confirm").unbind().bind("click", function () {
        if (!$(this).hasClass("disNone")) {
            $.cueDialog({
                title: "提示",
                topWords: ["icon-i", '是否马上开标？开标后不可逆转操作。'],
                content: "",
                allow: true,
                callback: function () {
                    $.ajaxForJson(config.pingbiaoPath + "OpenTender/openAjax", {
                        key_file_url: $("input[name='key_file_url']").val(),
                        token: $("input[name='token']").val(),
                        tender_id: $("input[name='tender_id']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    window.location.href = dataObj.data;
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
            });
        }
        return false;
    });
});