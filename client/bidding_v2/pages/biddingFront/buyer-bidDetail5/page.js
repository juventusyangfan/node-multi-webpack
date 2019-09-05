require('cp');
require('elem');
require('../../../public-resource/css/componentOther.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');

$(() => {
    //开启资审文件
    $(".openBidTable").unbind().bind("click", function () {
        var _tId = $(this).attr("tId"),
            _title = $(this).attr("tname");
        var html = '<div class="open_wrap">';
        html += '<div class="bid_detail_prompt"><i class="iconfont icon-i"></i>此操作不可逆，且仅能操作1次，仅谨慎操作！</div>';
        html += '<div class="open_block"><label>开标口令：</label><input type="text" name="openWord" class="cjy-input-" placeholder="请输入开启口令"><span class="open_tips floatR"></span></div>';
        html += '<div class="open_block"><label>开标密钥：</label><span class="js_upload"></span><a href="#" class="marginL30 cjy_file"></a><span class="open_tips floatR"></span></div><div id="process-files"></div>';
        html += '</div>';
        $.dialog({
            title: _title,
            content: html,
            width: 800,
            confirm: {
                show: true,
                allow: false,
                name: "开启"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                //验证开标口令
                $("input[name='openWord']").unbind().bind("blur", function () {
                    var main = $(this);
                    if ($.trim(main.val()) != "") {
                        $.ajaxForJson(config.wwwPath + 'buyer/Tender/checkOpenWord', {
                            tId: _tId,
                            openBidWord: $.trim(main.val())
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                main.parents(".open_block").find(".open_tips").html('<i class="iconfont icon-gou"></i>通过校验');
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg,
                                    callback: function () {
                                        main.parents(".open_block").find(".open_tips").html('<i class="iconfont icon-cha1"></i>校验失败');
                                    }
                                });
                            }
                            if ($(".open_wrap").find("i.icon-gou").length >= 2) {
                                $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-notallow-btn").addClass("cjy-confirm-btn");
                                $(".cjy-confirm-btn").unbind().bind("click", function () {
                                    if (!$(this).hasClass("cjy-notallow-btn")) {
                                        $.ajaxForJson(config.wwwPath + 'buyer/Tender/openSeniorityTender', {
                                            tId: $(".keyUl li.act").find("a").attr("tId")
                                        }, function (dataObj) {
                                            if (dataObj.code == 2000) {
                                                $.msgTips({
                                                    type: "success",
                                                    content: dataObj.msg,
                                                    callback: function () {
                                                        window.location.reload();
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
                            } else {
                                $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-confirm-btn").addClass("cjy-notallow-btn");
                            }
                        });
                    }
                });
                // 附件上传
                $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                    var main = $(".js_upload");
                    $(".cjy_file").html(name).attr("href", config.filePath + url);
                    $.ajaxForJson(config.wwwPath + 'buyer/Tender/checkOpenSecretKey', {
                        tId: _tId,
                        keyFileUrl: url
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            main.parents(".open_block").find(".open_tips").html('<i class="iconfont icon-gou"></i>通过校验');
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                        if ($(".open_wrap").find("i.icon-gou").length >= 2) {
                            $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-notallow-btn").addClass("cjy-confirm-btn");
                            $(".cjy-confirm-btn").unbind().bind("click", function () {
                                if (!$(this).hasClass("cjy-notallow-btn")) {
                                    $.ajaxForJson(config.wwwPath + 'buyer/Tender/openTender', {
                                        tId: _tId
                                    }, function (dataObj) {
                                        if (dataObj.code == 2000) {
                                            $.msgTips({
                                                type: "success",
                                                content: dataObj.msg,
                                                callback: function () {
                                                    window.location.reload();
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
                        } else {
                            $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-confirm-btn").addClass("cjy-notallow-btn");
                        }
                    });
                }, {
                    extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
                });
            }
        });
        return false;
    });

    //选择招标方式
    $(".js_type").unbind().bind("click", function () {
        var _id = $(this).attr("evaluate_type") ? $(this).attr("evaluate_type") : "0";
        var _sel1 = _id == "1" ? " selected" : "",
            _sel2 = _id == "2" ? " selected" : "",
            _sel3 = _id == "3" ? " selected" : ""
        $.dialog({
            title: '选择评标方式',
            content: '<div class="rateTypeDlg-content"><a href="javascript:;" class="rateType_cell' + _sel1 + '" data-id="1"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>线下评标</a><a href="javascript:;" class="rateType_cell' + _sel2 + '" data-id="2"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>在线评标</a><a href="javascript:;" class="rateType_cell' + _sel3 + '" data-id="3"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>机器人评标</a></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
                name: "取消"
            },
            callback: function () {
                //选择评标方式
                $(".rateType_cell").unbind().bind("click", function () {
                    $(".rateType_cell").removeClass("selected");
                    $(this).addClass("selected");
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    $.ajaxForJson(config.wwwPath + "buyer/Tender/evaluationTypeAjax", {
                        tId: $(".other_wrapper").attr("tId"),
                        evaluationType: $(".rateTypeDlg-content").find("a.selected").attr("data-id")
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    window.location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                });
            }
        });
        return false;
    });
});