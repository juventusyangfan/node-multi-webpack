require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

var tinymce = require('tinymce/tinymce');
require('tinymce/themes/modern/theme');
require('../../../public-resource/tinymce/langs/zh_CN');
require('tinymce/plugins/paste');
require('tinymce/plugins/link');
require('tinymce/plugins/table');
require('tinymce/plugins/image');
require('../../../public-resource/tinymce/skins/lightgray/skin.min.css');
require('../../../public-resource/tinymce/skins/lightgray/content.min.css');
require('../../../public-resource/tinymce/skins/lightgray/content.inline.min.css');

$(() => {
    //富文本编辑器
    tinymce.init({
        selector: '#myEditor',
        width: 990,
        height: 420,
        plugins: 'image link table',
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table image",
        images_upload_url: config.upload + 'group1/upload',
        images_upload_handler: function (blobInfo, success, failure) {
            var token = "";

            function getToken() {
                $.ajax({
                    url: config.papiPath + "api/common/getToken",
                    async: false,
                    dataType: "json",
                    success: function (dataObj) {
                        token = dataObj.data.token;
                    },
                    error: function () {

                    }
                });
            }
            getToken();
            var formData;
            formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());
            formData.append("output", "json");
            formData.append("auth_token", token);
            $.ajax({
                url: `${config.upload}group1/upload`,
                type: 'post',
                async: false,
                processData: false,
                contentType: false,
                data: formData,
                dataType: 'json',
                success: function (dataObj) {
                    success(config.filePath + dataObj.src);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus + "---" + errorThrown);
                }
            });
        }
    });

    //上传项目文件
    $("#projectImg_src").uppyUpload("#projectImg_src", function (name, url) {
        if ($("#projectImg_src").parents(".back_main_block").find(".img_cell").length >= 8) {
            $.msgTips({
                type: "warning",
                content: "最多只能上传8张图片"
            });
            return false;
        }

        var imgHTML = '<div class="img_cell"><img src="' + config.filePath + url + '" style="cursor: pointer;"><i class="iconfont icon-cha1"></i><input type="hidden" name="image[url][]" value="' + url + '"><input type="hidden" name="image[name][]" value="' + name + '"></div>';
        $("#projectImg_src").parents(".back_main_block").find(".project_img").prepend(imgHTML);
        $("#projectImg_src").parents(".back_main_block").find(".img_cell img").unbind().bind("click", function () {
            var path = $(this).attr("src");
            $.showPhoto(path);
            return false;
        });
        //删除
        $(".img_cell").find("i").unbind().bind("click", function () {
            $(this).parent().remove();
        });
    }, {
        allowedFileTypes: ['image/*'],
        processCon: "#process-files-projectImg_src",
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });
    //修改时查看添加图片
    $("#projectImg_src").parents(".back_main_block").find(".img_cell img").unbind().bind("click", function () {
        var path = $(this).attr("src");
        $.showPhoto(path);
        return false;
    });
    //删除
    $(".img_cell").find("i").unbind().bind("click", function () {
        $(this).parent().remove();
    });

    //发布项目
    var ajaxKey = true;
    $(".btn_confirm").unbind().bind("click", function () {
        if ($.trim($("input[name='name']").val()) == "") {
            $("input[name='name']").focus();
            $.msgTips({
                type: "warning",
                content: "请填写项目名称"
            });
            return false;
        } else if ($("select[name='project_class']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择项目类型"
            });
            return false;
        } else if ($("input[name='area_code']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择项目所在地"
            });
            return false;
        } else if ($("input[name='address']").val() == "") {
            $("select[name='address']").focus();
            $.msgTips({
                type: "warning",
                content: "请填写详细地址"
            });
            return false;
        } else if ($("select[name='project_status']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择项目状态"
            });
            return false;
        } else if (tinymce.activeEditor.getContent() == "") {
            $.msgTips({
                type: "warning",
                content: "请选填写项目简介"
            });
            return false;
        }

        if (ajaxKey) {
            var reqUrl = config.wwwPath + "buyer/Project/saveAjax ",
                reqData = $("form[name='project_form']").serialize() + "&explain=" + encodeURIComponent(tinymce.activeEditor.getContent());
            // if ($("input[name='id']").length > 0 && $("input[name='id']").val()) {
            //     reqData = $.extend(reqData, {
            //         id: $("input[name='id']").val()
            //     })
            // }
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg,
                        callback: function () {
                            window.location.href = dataObj.data.redirect_url;
                        }
                    });
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