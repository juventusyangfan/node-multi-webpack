require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 附件上传 品牌故事图片
    $(".js_upload").each(function (n) {
        var main = $(this),
            _id = main.attr("id");
        $("#" + _id).uppyUpload("#" + _id, function (name, url) {
            $("#" + _id).parent().find(".adv_img").find("img").attr("src", config.filePath + url);
            $("#" + _id).parent().find("input[type='hidden']").val(url);
        }, {
            allowedFileTypes: ['image/*'],
            processCon: "#process-files" + n,
            extArr: ['jpg', 'png', 'jpeg', 'bmp']
        });
    });
    // // 附件上传 品牌故事图片
    // $(document).on("click", ".upload_img", function () {
    //     var elId = $(this).find("input[type='file']").attr("id");
    //     var num = parseInt($(this).attr("data-num"));
    //     $("#" + elId).unbind().bind("change", function () {
    //         var main = $(this);
    //         var id = main.attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.jcPath + 'user/BankIndex/uploadFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code === 2000) {
    //                     $(".adv_img").eq(num).find("img").attr("src", dataObj.file_url);
    //                     $(".adv_img").eq(num).find("input").val(dataObj.data);
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.msg
    //                     });
    //                 }
    //             },
    //             error: function error(data, status, e) {
    //                 // 
    //             }
    //         });
    //         return false;
    //     });
    // });

    $(".js_upload_video").each(function (n) {
        var main = $(this),
            _id = main.attr("id");
        $("#" + _id).uppyUpload("#" + _id, function (name, url) {
            $("#" + _id).parent().find(".video_area").html('<span>' + name + '<input name="story_video_name_' + (n + 1) + '" type="hidden" value="' + name + '"><input name="story_video_path_' + (n + 1) + '" type="hidden" value="' + url + '"><a class="del_vedio" href="javascript:;" style="margin-left: 10px;color: #fc6940;">删除</a></span>');
        }, {
            allowedFileTypes: ['video/*'],
            processCon: "#process-files-video" + (n + 1)
        });
    });
    // $(document).on("click", ".upload_vedio", function () {
    //     var elId = $(this).find("input[type='file']").attr("id");
    //     var num = parseInt($(this).attr("data-num"));
    //     $("#" + elId).unbind().bind("change", function () {
    //         var main = $(this);
    //         var id = main.attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.jcPath + 'user/BankIndex/uploadFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code === 2000) {
    //                     $(".video_area").eq(num).html('<span>' + dataObj.name + '<input name="story_video_name_' + (num + 1) + '" type="hidden" value="' + dataObj.name + '"><input name="story_video_path_' + (num + 1) + '" type="hidden" value="' + dataObj.data + '"><a class="del_vedio" href="javascript:;" style="margin-left: 10px;color: #fc6940;">删除</a></span>');
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.msg
    //                     });
    //                 }
    //             },
    //             error: function error(data, status, e) {
    //                 // 
    //             }
    //         });
    //     });
    // });

    // 删除视频
    $(".video_area").off().on("click", ".del_vedio", function () {
        $(this).parents(".video_area").html("");
    });

    // 保存
    $(".btn_confirm").off().on("click", function (event) {
        event.preventDefault();
        var main = $(this);

        // 必填项
        if ($.trim($("input[name='story_img']").val()) == "") {
            $.msgTips({
                type: "warning",
                content: "请上传品牌故事图片"
            });
            return false;
        } else if ($.trim($("textarea[name='story_desc']").val()) == "") {
            $.msgTips({
                type: "warning",
                content: "请填写产品简介"
            });
            return false;
        }

        // 表单提交
        var reqUrl = $(".back_main").attr("action");
        var reqData = $(".back_main").serialize();
        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.reload();
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });
});