require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //展开收起
    $(".group_item_head").unbind().bind("click", function () {
        if ($(this).parents(".group_item_wrap").hasClass("group_open")) {
            $(this).parents(".group_item_wrap").removeClass("group_open");
            $(this).find(".group_show").find("span").html("展开");
        } else {
            $(this).parents(".group_item_wrap").addClass("group_open");
            $(this).find(".group_show").find("span").html("收起");
        }
        return false;
    });

    //删除分组
    $(".group_item_wrap").on("click", ".icon-cha1", function () {
        var main = $(this),
            groupId = main.parent().attr("data-id");
        $.ajaxForJson(config.youshangPath + "purchaser/group/getMemberByGroupId", {
            group_id: groupId
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var _msg = '';
                if (dataObj.data) {
                    _msg = '<div class="textRed" style="padding:20px 30px;">组内的供应商将会解除与该分组的关系确定删除该分组吗？</div>'
                }
                $.cueDialog({
                    title: "移除分组",
                    topWords: ["icon-i", '分组将被移除'],
                    content: _msg,
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $.ajaxForJson(config.youshangPath + "purchaser/group/delete", {
                                group_id: groupId
                            }, function (jsonObj) {
                                if (jsonObj.code == 2000) {
                                    $.msgTips({
                                        type: "success",
                                        content: jsonObj.msg
                                    });
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                    main.parents(".group_item_wrap").find(".group_num").html(main.parents(".group_item_wrap").find(".group_cell_wrap li").length - 1);
                                    if (main.parents(".group_item_wrap").find(".group_cell_wrap li").length <= 1) {
                                        main.parents(".group_item_wrap").find(".group_cell_wrap").html('<div style="text-align: center;"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%; margin-bottom: 60px; font-size: 24px; color: rgb(153, 153, 153); text-align: center;">没有找到相关内容</p></div>');
                                    }
                                    main.parent().remove();
                                } else {
                                    $.msgTips({
                                        type: "warning",
                                        content: jsonObj.msg
                                    });
                                }
                            });
                            return false;
                        });
                    }
                });
            }
        });
        return false;
    });

    //修改分组
    $(".group_item_wrap").on("click", ".icon-bianji", function () {
        var main = $(this),
            type_id = main.parents(".group_item_wrap").attr("youshang_type_id"),
            _id = main.parents("li").attr("data-id"),
            _name = main.parents("li").find("a").html();

        $.dialog({
            title: '修改分组',
            content: '<div class="groupAddWrap"><input type="text" class="cjy-input-" name="groupName" placeholder="请输入分组名称" value="' + _name + '"></div>',
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
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if ($.trim($("input[name='groupName']").val()) == _name) {
                        $(".cjy-poplayer").remove();
                        $(".cjy-bg").remove();
                    } else if ($.trim($("input[name='groupName']").val()) != "") {
                        $.ajaxForJson(config.youshangPath + "purchaser/group/groupPost", {
                            youshang_type_id: type_id,
                            id: _id,
                            name: $.trim($("input[name='groupName']").val())
                        }, function (jsonObj) {
                            if (jsonObj.code == 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: jsonObj.msg
                                });
                                main.parents("li").find("a").html($.trim($("input[name='groupName']").val()));
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
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

    //单个添加
    $(".group_add").unbind().bind("click", function () {
        var main = $(this),
            type_id = main.parents(".group_item_wrap").attr("youshang_type_id");

        $.dialog({
            title: '创建分组',
            content: '<div class="groupAddWrap"><input type="text" class="cjy-input-" name="groupName" placeholder="请输入分组名称" value=""></div>',
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
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if ($.trim($("input[name='groupName']").val()) != "") {
                        $.ajaxForJson(config.youshangPath + "purchaser/group/groupPost", {
                            youshang_type_id: type_id,
                            name: $("input[name='groupName']").val()
                        }, function (jsonObj) {
                            if (jsonObj.code == 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: jsonObj.msg
                                });
                                if (main.parents(".group_item_wrap").find(".group_cell_wrap").find("li").length <= 0) {
                                    main.parents(".group_item_wrap").find(".group_cell_wrap").html("");
                                }
                                main.parents(".group_item_wrap").find(".group_cell_wrap").append('<li data-id="' + jsonObj.data.group_id + '"><a href="javascript:;">' + $("input[name='groupName']").val() + '</a><i class="iconfont icon-cha1"></i><i class="iconfont icon-bianji"></i></li>');
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                                main.parents(".group_item_wrap").find(".group_num").html(main.parents(".group_item_wrap").find(".group_cell_wrap li").length);
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

    //批量添加
    $(".group_push").unbind().bind("click", function () {
        var main = $(this),
            type_id = main.parents(".group_item_wrap").attr("youshang_type_id");

        $.dialog({
            title: '批量创建分组',
            content: '<div class="groupAddWrap"><div class="groupTips"><i class="iconfont icon-gantanhao"></i><span>每行1个分组，每个分组名2~10个字</span></div><textarea name="groupName" placeholder="每行1个分组，每个分组名2~10个字" style="width:286px;height:160px;margin-top:10px;"></textarea></texteare></div>',
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
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if ($.trim($("textarea[name='groupName']").val()) != "") {
                        var groupArr = $("textarea[name='groupName']").val().split("\n"),
                            groupNew = [];
                        for (var i = 0; i < groupArr.length; i++) {
                            groupArr[i] = $.trim(groupArr[i]);
                            if (groupArr[i] != "" && groupNew.indexOf(groupArr[i]) <= -1) {
                                groupNew.push(groupArr[i]);
                            }
                        }
                        $.ajaxForJson(config.youshangPath + "purchaser/group/addGroupBath", {
                            youshang_type_id: type_id,
                            name: groupNew
                        }, function (jsonObj) {
                            if (jsonObj.code == 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: jsonObj.msg
                                });
                                if (main.parents(".group_item_wrap").find(".group_cell_wrap").find("li").length <= 0) {
                                    main.parents(".group_item_wrap").find(".group_cell_wrap").html("");
                                }
                                for (var i = 0; i < jsonObj.data.length; i++) {
                                    main.parents(".group_item_wrap").find(".group_cell_wrap").append('<li data-id="' + jsonObj.data[i].id + '"><a href="javascript:;">' + jsonObj.data[i].name + '</a><i class="iconfont icon-cha1"></i><i class="iconfont icon-bianji"></i></li>');
                                }
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                                main.parents(".group_item_wrap").find(".group_num").html(main.parents(".group_item_wrap").find(".group_cell_wrap li").length);
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
});