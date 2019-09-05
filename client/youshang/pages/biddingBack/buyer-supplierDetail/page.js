require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require("libs");


$(() => {
    var _statusId = $("select[name='status']").val(),
        _statusText = $("select[name='status']").find("option:selected").text();

    //选择供应商状态
    $("select[name='status']").unbind().bind("change", function () {
        if (_statusId == $(this).val()) {
            $("span[name='statusTxt']").html("");
            $("textarea[name='describe']").val("").parents(".back_info_item").hide();
        } else {
            $("span[name='statusTxt']").html(_statusText + '<i class="iconfont icon-youjiantou-" style="margin:0 10px;"></i><span class="textRed">' + $("select[name='status']").find("option:selected").text());
            $("textarea[name='describe']").parents(".back_info_item").show();
        }
    });

    $(".btn_confirm").unbind().bind("click", function () {
        $.ajaxForJson(config.youshangPath + 'purchaser/index/editSupplierPost', {
            id: $("input[name='id']").val(),
            circle_id: $("input[name='circle_id']").val(),
            describe: $("textarea[name='describe']").val(),
            remark: $("textarea[name='remark']").val(),
            relation_status: $("select[name='status']").val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg,
                    callback: function () {
                        location.href = "/purchaser/index/index?youshang_type_id=" + $("input[name='youshang_type_id']").val() + "&group_id=" + $("input[name='group_id']").val();
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

    //修改分组信息
    $(".groupEdit").unbind().bind("click", function () {
        $.ajaxForJson(config.youshangPath + "purchaser/group/getGroupAndMember", {
            youshang_type_id: $("input[name='youshang_type_id']").val(),
            circle_id: $("input[name='circle_id']").val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var _html = '<div class="groupDlgWrap"><div class="groupDlg_head"><a href="javascript:;" class="groupAdd">创建分组</a></div><ul class="groupDlg_con clearfix">';
                for (var i = 0; i < dataObj.data.length; i++) {
                    let _act = dataObj.data[i].is_selected == 1 ? "act" : "";
                    _html += '<li class="' + _act + '" data-id="' + dataObj.data[i].id + '"><a href="javascript:;">' + dataObj.data[i].name + '</a><i class="iconfont icon-gou"></i></li>';
                }
                _html += '</ul></div>'
                $.dialog({
                    title: '修改分组信息',
                    content: _html,
                    width: 800,
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
                        //创建分组
                        $(".groupAdd").unbind().bind("click", function () {
                            $.dialog({
                                title: '创建分组',
                                content: '<div class="groupAddWrap"><input type="text" class="cjy-input-" name="groupName"></div>',
                                width: 360,
                                confirm: {
                                    show: true,
                                    allow: true,
                                    name: "提交"
                                },
                                cancel: {
                                    show: true,
                                    allow: true,
                                    name: "取消"
                                },
                                callback: function () {
                                    $(".cjy-poplayer").eq(1).find(".cjy-confirm-btn").unbind().bind("click", function () {
                                        if ($.trim($("input[name='groupName']").val()) != "") {
                                            $.ajaxForJson(config.youshangPath + "purchaser/group/groupPost", {
                                                youshang_type_id: $("input[name='youshang_type_id']").val(),
                                                name: $("input[name='groupName']").val()
                                            }, function (jsonObj) {
                                                if (jsonObj.code == 2000) {
                                                    $(".groupDlg_con").append('<li class="act" data-id="' + dataObj.data.group_id + '"><a href="javascript:;">' + $("input[name='groupName']").val() + '</a><i class="iconfont icon-gou"></i></li>');
                                                    $(".cjy-poplayer").eq(1).remove();
                                                    $(".cjy-bg").css("z-index", "99");
                                                } else {
                                                    $.msgTips({
                                                        type: "warning",
                                                        content: jsonObj.msg
                                                    });
                                                }
                                            });
                                        } else {
                                            $.msgTips({
                                                type: "warning",
                                                content: "请输入分组名称！"
                                            });
                                        }
                                        return false;
                                    });
                                }
                            });
                            return false;
                        });
                        //选择分组
                        $(".groupDlg_con").find("li").unbind().bind("click", function () {
                            if ($(this).hasClass("act")) {
                                $(this).removeClass("act");
                            } else {
                                $(this).addClass("act");
                            }
                        });
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var groupCellHTML = '',
                                groupId = [],
                                params = null;
                            $(".groupDlg_con").find("li.act").each(function () {
                                let _id = $(this).attr("data-id"),
                                    _name = $(this).find("a").html();
                                groupId.push(_id);
                                groupCellHTML += '<span class="groupCell">' + _name + '<input type="hidden" name="group_id" value="' + _id + '"></span>';
                            });
                            if (groupId.length > 0) {
                                params = {
                                    circle_id: $("input[name='circle_id']").val(),
                                    group_id: groupId
                                }
                            } else {
                                params = {
                                    youshang_type_id: $("input[name='youshang_type_id']").val(),
                                    circle_id: $("input[name='circle_id']").val(),
                                    group_id: "null"
                                }
                            }
                            $.ajaxForJson(config.youshangPath + "purchaser/group/addMemberGroup", params, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                    $(".groupWarp").html(groupCellHTML);
                                    $.msgTips({
                                        type: "success",
                                        content: dataObj.msg
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
                        $(".cjy-cancel-btn").unbind().bind("click", function () {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                        });
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
});