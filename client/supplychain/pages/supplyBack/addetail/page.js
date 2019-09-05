require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        $(".adv_img img").attr("src", config.filePath + url);
        $(".adv_img input").val(url);
    }, {
        allowedFileTypes: ['image/*'],
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });
    // // 附件上传
    // $(document).on("click", ".upload_img", function () {
    //     $("#uploadFile").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
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
    //                     $(".adv_img img").attr("src", dataObj.file_url);
    //                     $(".adv_img input").val(dataObj.data);
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

    // 保存
    $(".btn_confirm").off().on("click", function (event) {
        event.preventDefault();
        var main = $(this);

        // 必填项
        if ($.trim($("input[name='ad_img']").val()) == "") {
            $.msgTips({
                type: "warning",
                content: "请上传广告图片"
            });
            return false;
        } else if ($.trim($("input[name='ad_link']").val()) == "") {
            $.msgTips({
                type: "warning",
                content: "广告链接不能为空"
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
                        location.href = '/user/bankAd/index.html';
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