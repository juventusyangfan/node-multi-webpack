require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');
const libs = require("libs");
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#bidDetail',
        data() {
            return {
                detailObj: detail
            }
        }
    });

    //展开更多问题
    $(".question_more").unbind().bind("click", function () {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $(this).find("span").html("展开更多提问");
            $(".question_list").css({
                "overflow": "hidden",
                "width": "458px"
            });
        } else {
            $(this).addClass("open");
            $(this).find("span").html("收起更多提问");
            $(".question_list").css({
                "overflow": "auto",
                "width": "480px"
            });
        }
        return false;
    });

    //下载资审/招标文件
    $("#bidDetail").on("click", ".js_download", function () {
        var _tr = $(this).parents(".apply_id"),
            _btnStr = $(this).html().substr(2),
            _url = _btnStr == "资审文件" ? "supplier/apply/downQualifiedFile" : "supplier/apply/downTenderFile";
        $.ajaxForJson(config.wwwPath + _url, {
            apply_id: _tr.attr("apply_id")
        }, function (dataObj) {
            if (dataObj.code == 4000) {
                if (dataObj.data.error_status == 1) {
                    $.dialog({
                        title: "提示",
                        topWords: ["icon-i", '采购单位要求下载该文件需购买，请先完成购买事项哦'],
                        content: '<p style="line-height:1.5;padding:10px 30px;">若选择线下对公转账方式且已支付' + _btnStr + '费，需先上传支付凭证，待采购单位确认凭证无误后可在线下载' + _btnStr + '。如有疑问，请咨询<span class="textRed">' + dataObj.data.contact_info.name + '/' + dataObj.data.contact_info.mobile + '</span></p>',
                        confirm: {
                            show: true,
                            allow: true,
                            name: "立即购买"
                        },
                        cancel: {
                            show: true,
                            name: "取消"
                        },
                        callback: function () {
                            $(".cjy-confirm-btn").unbind().bind("click", function () {
                                window.location.href = config.wwwPath + "supplier/Payment/pay?apply_id=" + _tr.attr("apply_id");
                            });
                        }
                    });
                } else if (dataObj.data.error_status == 3 || dataObj.data.error_status == 4) {
                    var _tltStr = '',
                        _icon = '',
                        _reason = '';
                    if (dataObj.data.error_status == 3) {
                        _tltStr = '待确认！';
                        _icon = 'icon-dengdai';
                    } else if (dataObj.data.error_status == 4) {
                        _tltStr = '未通过确认！';
                        _icon = 'icon-cha1';
                        _reason = '<span class="textOrange">驳回原因：</span>' + dataObj.data.back_reason
                    }

                    var _html = '<p style="line-height:1.5;padding:10px 30px;">待采购单位确认凭证无误后才可在线下载' + _btnStr + '。如有疑问，请联系采购单位<span class="textRed">' + dataObj.data.contact_info.name + '/' + dataObj.data.contact_info.mobile + '</span></p>';
                    _html += '<div style="padding:10px 30px;"><form class="listForm">';
                    var _num = 0;
                    for (var key in dataObj.data.payment_vouchers) {
                        _html += '<div class="imgList marginB10"><a class="textBlue ellipsis" href="' + config.filePath + dataObj.data.payment_vouchers[key] + '" style="display:inline-block;width:380px;">' + key + '</a><span class="js_upload" id="img' + _num + '"></span><div id="process-files-img' + _num + '"></div><input type="hidden" name="file_name[]" value="' + key + '"><input type="hidden" name="file_path[]" value="' + dataObj.data.payment_vouchers[key] + '"></div>';
                        _num++;
                    }
                    _html += '</form></div><div style="padding:10px 30px;">' + _reason + '</div>';

                    $.dialog({
                        title: "提示",
                        topWords: [_icon, _btnStr + '费支付凭证' + _tltStr],
                        content: _html,
                        confirm: {
                            show: true,
                            allow: true,
                            name: "确认"
                        },
                        cancel: {
                            show: true,
                            name: "取消"
                        },
                        callback: function () {
                            $(".imgList").find("a").unbind().bind("click", function () {
                                var path = $(this).attr("href");
                                $.showPhoto(path);
                                return false;
                            });
                            //文件重新上传
                            $(".js_upload").each(function (n) {
                                var main = $(this),
                                    _id = main.attr("id");
                                $("#" + _id).uppyUpload("#" + _id, function (name, url) {
                                    $("#" + _id).parent().find("a").attr("href", config.filePath + url).html(name).unbind().bind("click", function () {
                                        var path = $(this).attr("href");
                                        $.showPhoto(path);
                                        return false;
                                    });
                                    $("#" + _id).parent().find("input[name='file_name[]']").val(name);
                                    $("#" + _id).parent().find("input[name='file_url[]']").val(url);
                                }, {
                                    allowedFileTypes: ['image/*'],
                                    processCon: "#process-files-" + _id,
                                    extArr: ['jpg', 'png', 'jpeg', 'bmp'],
                                    btnStr: '重新上传'
                                });
                            });
                            $(".cjy-confirm-btn").unbind().bind("click", function () {
                                var _requestData = $("form.listForm").serialize() + "&apply_id=" + _tr.attr("apply_id");
                                $.ajaxForJson(config.wwwPath + "supplier/Payment/reUpPaymentFile", _requestData, function (obj) {
                                    if (obj.code == 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: obj.msg,
                                            callback: function () {
                                                $(".cjy-cancel-btn").trigger("click");
                                                vm.getBidList();
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                } else if (dataObj.data.error_status == 5 || dataObj.data.error_status == 6) {
                    var _doStr = dataObj.data.error_status == 5 ? '<p style="padding:10px 30px;">采购单位设置开始下载开始时间为' + dataObj.data.start_time + '，请耐心等待~</p>' : '';
                    var _tltStr = dataObj.data.error_status == 5 ? '下载还未开始' : '下载已结束';
                    var _icon = dataObj.data.error_status == 5 ? 'icon-dengdai' : 'icon-cha1';
                    $.dialog({
                        title: "下载" + _btnStr,
                        topWords: [_icon, _tltStr],
                        content: _doStr,
                        confirm: {
                            show: false,
                            allow: true,
                            name: ""
                        },
                        cancel: {
                            show: true,
                            name: "取消"
                        },
                        callback: function () {

                        }
                    });
                } else if (dataObj.data.error_status == 7) { //下载状态标记失败
                    $.msgTips({
                        type: "error",
                        content: "操作失败"
                    });
                }
            }
        });
        return false;
    });

    //上传资审、投标文件
    $("#bidDetail").on("click", ".js_uploadList", function () {
        var _tr = $(this).parents(".apply_id"),
            _type = $(this).attr("data-type"),
            _name = _type == "seniority_file_src" ? "资审申请文件" : "投标/报价文件";
        $.ajaxForJson(config.wwwPath + "supplier/apply/getApplyFile", {
            apply_id: _tr.attr("apply_id"),
            type: _type
        }, function (dataObj) {
            var html = '<div class="upload_wrap"><form class="file_form">';
            if (_type == "bid_file_src") {
                html += '<div class="marginB10"><label>问题描述：</label><input type="text" name="synthetic_price" class="cjy-input-" placeholder="请输入综合报价" value="' + dataObj.data.synthetic_price + '"><span class="marginL4">元</span></div>';
            }
            html += '<div><label>上传' + _name + '：</label><span id="uploadBtn"></span><div id="process-files"></div></div>';
            html += '<div class="upload_notice_con marginT10 clearfix" style="margin-top: 10px;margin-left: 140px;"><span class="iconfont icon-i floatL" style="margin-top: 2px;"></span><p style="width: 590px;line-height: 1.5;float: left;">单个附件不超过100M，最多可上传8个附件。</p><p style="width: 590px;line-height: 1.5;margin-left: 23px;float: left;">格式支持jpg、jpeg、png、bmp、pdf、xls、xlsx、doc、docx、txt、zip、rar</p></div>';
            html += '<div class="upload_list">';
            for (var key in dataObj.data.file_src) {
                html += '<div class="upload_block"><i class="iconfont icon-fujian marginR10"></i><span>' + key + '</span><a href="javascript:;" class="textOrange marginL20 js_del">删除</a><input type="hidden" name="file_name[]" value="' + key + '"><input type="hidden" name="file_path[]" value="' + dataObj.data.file_src[key] + '"></div>';
            }
            html += '</div></form></div>';
            $.dialog({
                title: _name,
                content: html,
                width: 800,
                confirm: {
                    show: true,
                    allow: true,
                    name: "确定"
                },
                cancel: {
                    show: true,
                    name: "取消"
                },
                callback: function () {
                    $("input[name='synthetic_price']").unbind().bind("input", function () {
                        libs.lenNumber(this, 2);
                    });
                    //删除
                    $(".upload_list").on("click", ".js_del", function () {
                        $(this).parents(".upload_block").remove();
                        return false;
                    });
                    $("#uploadBtn").uppyUpload("#uploadBtn", function (name, url) {
                        $(".upload_list").append('<div class="upload_block"><i class="iconfont icon-fujian marginR10"></i><span>' + name + '</span><a href="javascript:;" class="textOrange marginL20 js_del">删除</a><input type="hidden" name="file_name[]" value="' + name + '"><input type="hidden" name="file_path[]" value="' + url + '"></div>');
                    }, {
                        processCon: "#process-files"
                    });

                    //确认事件
                    $(".cjy-confirm-btn").unbind().bind("click", function () {
                        if (_type == "bid_file_src" && ($("input[name='synthetic_price']").val() == "" || parseFloat($("input[name='synthetic_price']").val()) <= 0)) {
                            $.msgTips({
                                type: "warning",
                                content: "请填写综合报价"
                            });
                            $("input[name='synthetic_price']").focus();
                            return false;
                        }
                        var _url = _type == "seniority_file_src" ? "supplier/apply/upQualifiedFile" : "supplier/apply/upBidFile";
                        $.ajaxForJson(config.wwwPath + _url, $("form.file_form").serialize() + "&apply_id=" + _tr.attr("apply_id"), function (obj) {
                            if (obj.code == 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: obj.msg,
                                    callback: function () {
                                        $(".cjy-cancel-btn").trigger("click");
                                        vm.getBidList();
                                    }
                                });
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: obj.msg
                                });
                            }
                        });
                    });
                }
            });
        });
        return false;
    });

    //撤回资审、投标文件
    $("#bidDetail").on("click", ".js_recall", function () {
        var _tr = $(this).parents(".apply_id"),
            _type = $(this).attr("data-type"),
            _name = _type == "seniority_file_src" ? "资审申请" : "投标/报价",
            _url = _type == "seniority_file_src" ? "supplier/apply/withdrawQualifiedFile" : "supplier/apply/withdrawBidFile";

        $.cueDialog({
            title: "提示",
            topWords: ["icon-i", '确认撤回已递交的' + _name + '文件？'],
            content: '<p style="padding:10px 30px;">撤回' + _name + '文件，将视为退出' + _name + '</p>',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + _url, {
                        apply_id: _tr.attr("apply_id")
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    $(".cjy-cancel-btn").trigger("click");
                                    vm.getBidList();
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

    //接收拒绝邀请
    $("#bidDetail").on("click", ".js_invite,.js_noInvite", function () {
        var _tr = $(this).parents(".apply_id");
        var _str = $(this).hasClass("js_invite") ? "接受" : "拒绝",
            _status = $(this).hasClass("js_invite") ? "4" : "2";
        $.cueDialog({
            title: "提示",
            topWords: ["icon-i", '确认' + _str + '邀请？'],
            content: '',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + "supplier/apply/invitation", {
                        apply_id: _tr.attr("apply_id"),
                        invitation_status: _status
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    $(".cjy-cancel-btn").trigger("click");
                                    vm.getBidList();
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

    //查看未通过原因
    $("#bidDetail").on("click", ".js_reason", function () {
        var _reason = $(this).attr("reason");
        $.dialog({
            title: "提示",
            content: '<p class="clearfix" style="padding: 10px 30px;line-height: 1.5;"><label class="textOrange floatL">未通过原因：</label><span class="textBlack1 fontBold width390 floatL">' + _reason + '</span></p>',
            confirm: {
                show: false,
                allow: true,
                name: "确认"
            },
            cancel: {
                show: true,
                name: "取消"
            }
        })
        return false;
    });

    //澄清提问
    $("#bidDetail").on("click", ".js_question", function () {
        var _tr = $(this).parents(".apply_id");
        var html = '<div class="upload_wrap"><form class="question_form"><div class="marginB10"><label>问题描述：</label><textarea class="cjy-textarea" name="content" placeholder="请输入问题描述" maxlen="200" style="width:500px;"></textarea></div><div><label>上传附件：</label><span id="uploadBtn"></span><div id="process-files"></div></div>';
        html += '<div class="upload_notice_con marginT10 clearfix" style="margin-top: 10px;margin-left: 140px;"><span class="iconfont icon-i floatL" style="margin-top: 2px;"></span><p style="width: 590px;line-height: 1.5;float: left;">单个附件不超过100M，最多可上传8个附件。</p><p style="width: 590px;line-height: 1.5;margin-left: 23px;float: left;">格式支持jpg、jpeg、png、bmp、pdf、xls、xlsx、doc、docx、txt、zip、rar</p></div>';
        html += '<div class="upload_list"></div></form></div>';
        $.dialog({
            title: '澄清提问',
            content: html,
            width: 800,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $("textarea.cjy-textarea").initTextarea();
                //删除
                $(".upload_list").on("click", ".js_del", function () {
                    $(this).parents(".upload_block").remove();
                    return false;
                });
                $("#uploadBtn").uppyUpload("#uploadBtn", function (name, url) {
                    $(".upload_list").append('<div class="upload_block"><i class="iconfont icon-fujian marginR10"></i><span>' + name + '</span><a href="javascript:;" class="textOrange marginL20 js_del">删除</a><input type="hidden" name="file_name[]" value="' + name + '"><input type="hidden" name="file_path[]" value="' + url + '"></div>');
                }, {
                    processCon: "#process-files"
                });

                //确认事件
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + "supplier/apply/addClarify", $("form.question_form").serialize() + "&apply_id=" + _tr.attr("apply_id"), function (obj) {
                        if (obj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: obj.msg,
                                callback: function () {
                                    $(".cjy-cancel-btn").trigger("click");
                                    window.location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: obj.msg
                            });
                        }
                    });
                });
            }
        });
        return false;
    });

    //查看资审、投标文件
    $(".js_view").unbind().bind("click", function () {
        var _tr = $(this).parents(".apply_id"),
            _type = $(this).attr("data-type"),
            _name = _type == "seniority_file_src" ? "资审申请文件" : "投标/报价文件";
        $.ajaxForJson(config.wwwPath + "supplier/apply/getApplyFile", {
            apply_id: _tr.attr("apply_id"),
            type: _type
        }, function (dataObj) {
            var html = '<div class="upload_wrap">';
            html += '<div class="upload_list">';
            for (var key in dataObj.data.file_src) {
                html += '<div class="upload_block"><i class="iconfont icon-fujian marginR10"></i><span>' + key + '</span></div>';
            }
            html += '</div></div>';
            $.dialog({
                title: _name,
                content: html,
                width: 800,
                confirm: {
                    show: false,
                    allow: true,
                    name: "确定"
                },
                cancel: {
                    show: true,
                    name: "取消"
                },
                callback: function () {}
            });
        });
        return false;
    });

    //查看凭证
    $("a[data-url]").unbind().bind("click", function () {
        var _url = $(this).attr("data-url");
        $.showPhoto(config.filePath + _url);
        return false;
    });
});