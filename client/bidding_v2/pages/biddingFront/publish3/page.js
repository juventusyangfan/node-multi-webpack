require('cp');
require('elem');
require('../../../public-resource/css/componentPublish.css');
require('../../../public-resource/css/list.css');
require('./page.css');
const config = require('configModule');

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
        width: 1198,
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

    if ($("#uploadBtn").length > 0) {
        //附件上传
        $("#uploadBtn").uppyUpload("#uploadBtn", function (name, url) {
            $(".publish_fujian_list").append(' <p class="fujian_con"><i class="iconfont icon-fujian"></i><a href="' + config.wwwPath + url + '" class="fujian_link">' + name + '</a><a href="javascript:;" class="marginL20 textBlue fujian_del">删除</a><input type="hidden" name="file_path" value="' + url + '"><input type="hidden" name="file_name" value="' + name + '"></p>');
        }, {
            processCon: "#process-files"
        });
        //删除附件
        $(".publish_fujian_list").on("click", ".fujian_del", function () {
            $(this).parent().remove();
            return false;
        });
    }

    //预览公告正文
    $(".publish_view").unbind().bind("click", function () {
        var _html = '<div class="rich_text_dialog">' + tinymce.activeEditor.getContent() + '</div>';
        $.dialog({
            title: "采购公告（预览）",
            content: _html,
            width: 1240,
            confirm: {
                show: false,
                name: "取消"
            },
            cancel: {
                show: true,
                name: "取消"
            }
        });
        return false;
    });

    //发布下一步
    $(".btn_next").unbind().bind("click", function () {
        if ($(this).attr("type") == "no") {
            var _href = $(this).attr("href");
            window.location.href = _href;
        } else {
            var _data = null;
            var _fIds = [];
            $(".fujian_con").each(function () {
                var _fileObj = $(this);
                _file = {
                    name: _fileObj.find("input[name='file_name']").val(),
                    path: _fileObj.find("input[name='file_path']").val()
                }
                _fIds.push(_file);
            });
            _data = {
                tId: $("input[name='tId']").val(),
                cType: $("input[name='cType']").val(),
                step: $("input[name='step']").val(),
                draft: $("input[name='draft']").val(),
                edit: $("input[name='edit']").val(),
                fIds: _fIds,
                content: tinymce.activeEditor.getContent()
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