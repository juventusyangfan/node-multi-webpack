require('cp');
require('elem');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    //展开更多时间
    $(".date_change").unbind().bind("click", function () {
        $(this).addClass("open");
        return false;
    });
    //收起更多时间
    $(".js_hideDate").unbind().bind("click", function () {
        $(this).parents(".date_change").removeClass("open");
        return false;
    });

    //展开项目信息
    $(".js_open").unbind().bind("click", function () {
        $(this).parents(".tender_project_cell").addClass("showFull");
        return false;
    });
    //收起项目信息
    $(".js_close").unbind().bind("click", function () {
        $(this).parents(".tender_project_cell").removeClass("showFull");
        return false;
    });
    //查看更多包件费用
    $(".js_morePackage").unbind().bind("click", function () {
        var _type = $(this).attr("type"),
            _title = "";
        switch (_type) {
            case "1":
                _title = "查看资审文件费";
                break;
            case "2":
                _title = "查看招标/询价文件费";
                break;
            case "3":
                _title = "查看投标/报价保证金";
                break;
        }
        $.ajaxForJson(config.wwwPath + "exclusive/packageCostAjax", {
            type: _type,
            tId: $("input[name='tId']").val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var _html = '';
                _html += '<div class="enroll_dialog clearfix"><div class="material_list clearfix"><table><colgroup><col width="120"><col width="160"><col width="160"><col width="240"><col width="120"></colgroup>';
                _html += '<thead><tr><th>包件号</th><th>采购内容</th><th>资审文件费用(单位：元)</th><th>备注信息</th></tr></thead>';
                _html += '<tbody>';
                for (var i = 0; i < dataObj.data.length; i++) {
                    _html += '<tr><td class="textOrange">' + dataObj.data[i].code + '</td><td>' + dataObj.data[i].content + '</td><td>' + dataObj.data[i].money + '</td><td>' + dataObj.data[i].remarks + '</td>';
                    _html += '</tr>';
                }
                _html += '</tbody>';
                _html += '</table>';
                _html += '</div><div class="marginT20">资审文件费收款账户：<span class="textBlue">' + dataObj.data[0].account + '</span></div></div>';
                $.dialog({
                    title: _title,
                    content: _html,
                    width: 980,
                    confirm: {
                        show: true,
                        allow: true,
                        name: "确定"
                    },
                    cancel: {
                        show: false,
                        name: "取消"
                    },
                    callback: function () {
                        //确认事件
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $(".cjy-cancel-btn").trigger("click");
                            return false;
                        });
                    }
                });
            } else {

            }
        });

        return false;
    });

    //招标操作切换
    var _navId = $(".tender_step_nav").find("a.active").attr("name");
    $(".tender_step_con[data-id='" + _navId + "']").show();
    $(".tender_step_nav").find("a").unbind().bind("click", function () {
        var _id = $(this).attr("name");
        $(".tender_step_nav").find("a").removeClass("active");
        $(this).addClass("active");
        $(".tender_step_con").hide();
        $(".tender_step_con[data-id='" + _id + "']").show();
        return false;
    });

    //下载资审/招标文件
    $(".tender_step_section").on("click", ".js_download", function () {
        var _tr = $(this),
            _btnStr = $(this).attr("data-name"),
            _url = "exclusive/downloadAccessAjax";
        $.ajaxForJson(config.wwwPath + _url, {
            type: _tr.attr("type"),
            applyId: _tr.attr("apply_id"),
            tenderId: _tr.attr("tender_id"),
            packageId: _tr.attr("package_id")
        }, function (dataObj) {
            if (dataObj.code == 4000) {
                if (dataObj.data.error_status == 1) {
                    $.dialog({
                        title: "提示",
                        topWords: ["icon-i", '采购单位要求下载该文件需购买，请先完成购买事项哦'],
                        content: '<p style="line-height:1.5;padding:10px 30px;">若选择线下对公转账方式且已支付' + _btnStr + '费，需先上传支付凭证，待采购单位确认凭证无误后可在线下载' + _btnStr + '。如有疑问，请咨询<span class="textRed">' + dataObj.data.contact_info.name + '/' + dataObj.data.contact_info.mobile + '</span></p>',
                        confirm: {
                            show: false,
                            allow: false,
                            name: "确认"
                        },
                        cancel: {
                            show: true,
                            name: "取消"
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
                    for (var key in dataObj.data.payment_vouchers) {
                        _html += '<div class="imgList marginB10"><a class="textBlue ellipsis" href="' + config.filePath + dataObj.data.payment_vouchers[key] + '" style="display:inline-block;width:380px;">' + key + '</a></div>';
                    }
                    _html += '</form></div><div style="padding:10px 30px;">' + _reason + '</div>';

                    $.dialog({
                        title: "提示",
                        topWords: [_icon, _btnStr + '费支付凭证' + _tltStr],
                        content: _html,
                        confirm: {
                            show: false,
                            allow: false,
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
            } else if (dataObj.code == 2000) {
                window.location.href = dataObj.data.url;
            }
        });
        return false;
    });

    //继续报名
    $(".btn_bidding").unbind().bind("click", function () {
        $.ajaxForJson(config.wwwPath + "exclusive/enrollPopAjax", {
            tId: $("input[name='tId']").val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                if (dataObj.data.package) {
                    var _html = '<div class="enroll_dialog clearfix"><div class="enroll_tips"><span class="textBlack1 fontBold">招标名称：</span>' + dataObj.data.tenderName + '</div>';
                    _html += '<div class="material_list"><table><colgroup><col width="160"><col width="140"><col width="300"><col width="200"><col width="120"></colgroup>';
                    _html += '<thead><tr><th>包件编号</th><th>采购内容</th><th>项目信息</th><th>交付地点</th><th>操作</th></tr></thead>';
                    _html += '<tbody>';
                    for (var i = 0; i < dataObj.data.package.length; i++) {
                        _html += '<tr packageId="' + dataObj.data.package[i].packageId + '" buyerName="' + dataObj.data.buyerName + '" tenderName="' + dataObj.data.tenderName + '" access="' + dataObj.data.package[i].access + '" applyId="' + dataObj.data.package[i].applyId + '"><td class="textOrange">' + dataObj.data.package[i].code + '</td><td>' + dataObj.data.package[i].content + '</td><td>' + dataObj.data.package[i].project + '</td><td>' + dataObj.data.package[i].address + '</td>';
                        if (dataObj.data.package[i].access == "") {
                            if (dataObj.data.package[i].isEnroll == 1) {
                                _html += '<td><a href="javascript:;" class="enroll_btn disabled_btn">已报名</a></td>';

                            } else {
                                var _class = dataObj.data.type == "public" ? "js_enroll" : "js_invite";
                                _html += '<td><a href="javascript:;" class="enroll_btn ' + _class + '">报名</a></td>';
                            }
                        } else {
                            _html += '<td title="' + dataObj.data.package[i].access + '"><span class="textRed" title="' + dataObj.data.package[i].access + '">未被邀请</span></td>';
                        }
                        _html += '</tr>';
                    }
                    _html += '</tbody>';
                    _html += '</table>';
                    _html += '</div>';
                    $.dialog({
                        title: '报名',
                        content: _html,
                        width: 980,
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
                            //报名事件
                            $(".enroll_btn").unbind().bind("click", function () {
                                if (!$(this).hasClass("disabled_btn")) {
                                    var main = $(this);
                                    var packageId = main.parents("tr").attr("packageId"),
                                        code = main.parents("tr").find("td").eq(0).html(),
                                        tenderName = main.parents("tr").attr("tenderName"),
                                        buyerName = main.parents("tr").attr("buyerName"),
                                        access = main.parents("tr").attr("access"),
                                        applyId = main.parents("tr").attr("applyId");

                                    enrollDialog(main, packageId, code, tenderName, buyerName, access, applyId);
                                }
                                return false;
                            });
                            //确认事件
                            $(".cjy-confirm-btn").unbind().bind("click", function () {
                                $(".cjy-cancel-btn").trigger("click");
                                return false;
                            });
                        }
                    });
                } else {
                    if (dataObj.data.type == "public") {
                        $(".btn_bidding").removeClass("js_enroll js_invite");
                        $(".btn_bidding").addClass("js_enroll");
                    } else if (dataObj.data.type == "invite") {
                        $(".btn_bidding").removeClass("js_enroll js_invite");
                        $(".btn_bidding").addClass("js_invite");
                    }
                    enrollDialog($(".btn_bidding"), dataObj.data.packageId, "", dataObj.data.tenderName, dataObj.data.buyerName, dataObj.data.access, dataObj.data.applyId)
                }
            } else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });

    function enrollDialog(main, packageId, code, tenderName, buyerName, access, applyId) {
        var btnStr = "确定报名";
        var _confirmHTML = '<div class="enroll_confirm_dialog clearfix"><div class="confirm_dialog_block clearfix"><label>招标名称：</label><div class="confirm_dialog_item">' + tenderName + '</div></div>';
        if (code != "") {
            _confirmHTML += '<div class="confirm_dialog_block clearfix"><label>包件编号：</label><div class="confirm_dialog_item textOrange">' + code + '</div></div>';
        }
        _confirmHTML += '<div class="confirm_dialog_block clearfix"><label>招标名称：</label><div class="confirm_dialog_item">' + buyerName + '</div></div>';
        if (access) {
            _confirmHTML += '<div class="marginT20 textC textRed">' + access + '</div></div>';
            btnStr = "确定";
        }
        $.dialog({
            title: '报名',
            content: _confirmHTML,
            width: 520,
            confirm: {
                show: true,
                allow: true,
                name: btnStr
            },
            cancel: {
                show: false,
                name: "取消"
            },
            callback: function () {
                if (code != "") {
                    //确认事件
                    $(".cjy-confirm-btn").eq(1).unbind().bind("click", function () {
                        var _dialogObj = $(this).parents(".cjy-poplayer");
                        var _url = "",
                            _request = null;
                        if (main.hasClass("js_enroll")) {
                            _url = "supplier/Apply/apply";
                            _request = {
                                package_id: packageId
                            };
                        } else if (main.hasClass("js_invite")) {
                            _url = "supplier/Apply/invitation";
                            _request = {
                                apply_id: applyId,
                                invitation_status: "11"
                            };
                        }
                        $.ajaxForJson(config.wwwPath + _url, _request, function (dataObj) {
                            if (dataObj.code == 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: dataObj.msg,
                                    callback: function () {
                                        _dialogObj.find(".cjy-close").trigger("click");
                                        main.addClass("disabled_btn").html("已报名");
                                    }
                                });
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg,
                                    callback: function () {
                                        _dialogObj.find(".cjy-close").trigger("click");
                                    }
                                });
                            }
                        });
                        return false;
                    });
                } else {
                    if (access) {
                        //确认事件
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $(".cjy-poplayer").find(".cjy-close").trigger("click");
                            return false;
                        });
                    } else {
                        //确认事件
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var _url = "",
                                _request = null;
                            if (main.hasClass("js_enroll")) {
                                _url = "supplier/Apply/apply";
                                _request = {
                                    package_id: packageId
                                };
                            } else if (main.hasClass("js_invite")) {
                                _url = "supplier/Apply/invitation";
                                _request = {
                                    apply_id: applyId,
                                    invitation_status: "11"
                                };
                            }
                            $.ajaxForJson(config.wwwPath + _url, _request, function (dataObj) {
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
                                        content: dataObj.msg,
                                        callback: function () {
                                            $(".cjy-poplayer").find(".cjy-close").trigger("click");
                                        }
                                    });
                                }
                            });
                            return false;
                        });
                    }
                }
            }
        });
    }
});