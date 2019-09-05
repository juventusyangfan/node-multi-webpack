require('cp');
require('elem');
require('../../../public-resource/css/componentOther.css');
require('../../../public-resource/css/pageNav.css');
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
        width: 1100,
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
            $(".bid_fujian_list").append(' <p class="fujian_con"><i class="iconfont icon-fujian"></i><a href="' + config.wwwPath + url + '" class="fujian_link">' + name + '</a><a href="javascript:;" class="marginL20 textBlue fujian_del">删除</a><input type="hidden" name="file_path" value="' + url + '"><input type="hidden" name="file_name" value="' + name + '"></p>');
        }, {
            processCon: "#process-files"
        });
        //删除附件
        $(".bid_fujian_list").on("click", ".fujian_del", function () {
            $(this).parent().remove();
            return false;
        });
    }

    //发布下一步
    $(".bid_change_save").unbind().bind("click", function () {
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
            title: $("input[name='title']").val(),
            tId: $("input[name='tId']").val(),
            fIds: _fIds,
            content: tinymce.activeEditor.getContent()
        }

        $.ajaxForJson(config.wwwPath + "buyer/clarify/addAnswerAjax", _data, function (dataObj) {
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
        return false;
    });
});