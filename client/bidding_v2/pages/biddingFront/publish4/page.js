require('cp');
require('elem');
require('../../../public-resource/css/componentPublish.css');
require('../../../public-resource/css/list.css');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //文件重新上传
    $(".js_upload").each(function (n) {
        var main = $(this),
            _id = main.attr("id");
        $("#" + _id).uppyUpload("#" + _id, function (name, url) {
            if ($(".material_list").length > 0) {
                $("#" + _id).before('<p class="fujian_con"><i class="iconfont icon-fujian"></i><a href="' + config.wwwPath + url + '" class="fujian_link">' + name + '</a><a href="javascript:;" class="marginL20 textBlue fujian_del">删除</a><input type="hidden" name="file_path" value="' + url + '"><input type="hidden" name="file_name" value="' + name + '"></p>');
            } else {
                $("#" + _id).before('<p class="fujian_con" style="margin-top: 10px;margin-bottom: 10px;"><i class="iconfont icon-fujian"></i><a href="' + config.wwwPath + url + '" class="fujian_link" style="vertical-align: -2px;">' + name + '</a><a href="javascript:;" class="marginL20 textBlue fujian_del">删除</a><input type="hidden" name="file_path" value="' + url + '"><input type="hidden" name="file_name" value="' + name + '"></p>');
            }
        }, {
            processCon: "#process-files-" + _id,
            btnStr: '上传附件'
        });
    });
    //删除附件
    $("form[name='stepForm']").on("click", ".fujian_del", function () {
        $(this).parent().remove();
        return false;
    });

    //费用输入数字
    $("input[name='bsMoney']").unbind().bind("input", function () {
        libs.lenNumber(this, 2);
    });

    //发布下一步
    $(".btn_next").unbind().bind("click", function () {
        if ($(this).attr("type") == "no") {
            var _href = $(this).attr("href");
            window.location.href = _href;
        } else {
            var _data = null;
            var _payType = $("input[name='payType']:checked").length > 1 ? "3" : $("input[name='payType']:checked").val();

            if ($(".material_list").length > 0) {
                var _arr = [];
                $(".material_list table").find("tr").each(function () {
                    var main = $(this);
                    var _fIds = [];
                    main.find(".fujian_con").each(function () {
                        var _fileObj = $(this);
                        _file = {
                            name: _fileObj.find("input[name='file_name']").val(),
                            path: _fileObj.find("input[name='file_path']").val()
                        }
                        _fIds.push(_file);
                    });
                    var _obj = {
                        pId: main.find("input[name='pId']").val(),
                        bsMoney: main.find("input[name='bsMoney']").val(),
                        fIds: _fIds,
                        remarks: main.find("textarea[name='remarks']").val()
                    }
                    _arr.push(_obj);
                });
                _data = {
                    tId: $("input[name='tId']").val(),
                    cType: $("input[name='cType']").val(),
                    step: $("input[name='step']").val(),
                    draft: $("input[name='draft']").val(),
                    edit: $("input[name='edit']").val(),
                    package: _arr,
                    payType: _payType,
                    khBank: $("input[name='khBank']").val(),
                    yhAccount: $("input[name='yhAccount']").val()
                }
            } else {
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
                    pId: $("input[name='pId']").val(),
                    fIds: _fIds,
                    bsMoney: $("input[name='bsMoney']").val(),
                    remarks: $("textarea[name='remarks']").val(),
                    payType: _payType,
                    khBank: $("input[name='khBank']").val(),
                    yhAccount: $("input[name='yhAccount']").val()
                }
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