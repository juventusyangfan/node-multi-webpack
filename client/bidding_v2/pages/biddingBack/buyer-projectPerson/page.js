require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/list.css');
require('./page.css');
const config = require('configModule');

$(() => {
    //添加操作人员
    $(".project_operator_add").unbind().bind("click", function () {
        $.ajaxForJson(config.wwwPath + "buyer/ProjectUser/getSubAccountAjax", {
            id: $(".back_main_content").attr("project_id")
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var _html = '<div class="account_dialog">';
                _html += '<div class="material_list" id="companyList"><table><colgroup><col width="100"><col width="100"><col width="100"><col width="100"></colgroup>';
                _html += '<thead><th>姓名</th><th>账号信息</th><th>账号类型</th><th>操作</th></tr></thead>';
                _html += '<tbody>';
                for (var i = 0; i < dataObj.data.length; i++) {
                    var typeStr = dataObj.data[i].user_type == "2" ? "企业管理员" : "操作员",
                        _isSelect = dataObj.data[i].is_selected == "1" ? '<i class="iconfont icon-quanxian-shouxian"></i>' : '<a href="javascript:;" class="textBlue js_choose">设为项目操作员</a><a href="javascript:;" class="textRed js_cancel">取消</a>';
                    _html += '<tr data-id="' + dataObj.data[i].role_id + '"><td>' + dataObj.data[i].real_name + '</td><td>' + dataObj.data[i].user_mobile + '</td><td>' + typeStr + '</td><td>' + _isSelect + '</td></tr>';
                }
                _html += '</tbody>';
                _html += '</table></div>';
                _html += '</div>';
                $.dialog({
                    title: '选择项目管理员',
                    content: _html,
                    width: 880,
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
                        //设为项目操作员
                        $(".js_choose").unbind().bind("click", function () {
                            $(this).parents("tr").addClass("js_select");
                            return false;
                        });
                        $(".js_cancel").unbind().bind("click", function () {
                            $(this).parents("tr").removeClass("js_select");
                            return false;
                        });

                        //确认事件
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var roleId = [];
                            if ($(".account_dialog").find("tr.js_select").length > 0) {
                                $(".account_dialog").find("tr.js_select").each(function () {
                                    var _id = $(this).attr("data-id");
                                    roleId.push(_id);
                                });
                                $.ajaxForJson(config.wwwPath + "buyer/ProjectUser/saveAjax", {
                                    id: $(".back_main_content").attr("project_id"),
                                    role_id: roleId
                                }, function (obj) {
                                    if (obj.code == 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: obj.msg,
                                            callback: function () {
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
                            } else {
                                $(".cjy-cancel-btn").trigger("click");
                            }

                            return false;
                        });
                    }
                });
            }
        });
        return false;
    });

    //移除操作人员
    $(".project_operator_cell").find(".icon-cha1").unbind().bind("click", function () {
        var _name = $(this).parent().find("span").eq(0).html(),
            _id = $(this).parent().attr("role_id"),
            _project = $(".project_name").find("span").html();
        $.ajaxForJson(config.wwwPath + "buyer/ProjectUser/delCheckAjax", {
            id: $(".back_main_content").attr("project_id"),
            role_id: _id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var _html = '<div class="remove_dialog"><div>正在执行将操作员“<span class="textRed fontBold">' + _name + '</span>”从项目“<span class="textBlue fontBold">' + _project + '</span>”中移除的操作。</div>';
                if (dataObj.data.total > 0) {
                    _html += '<div class="marginT10">（经办招标<span class="textBlue fontBold">' + dataObj.data.total + '</span>笔）</div>'
                    _html += '<div class="remove_handler"><div><input type="radio" name="exchangeType" value="1" title="移交“' + _name + '”在该项目下经办的招标至：" checked><select name="exchangeId" value=""><option value="">请选择移交对象</option>';
                    for (var j = 0; j < dataObj.data.handle_user_info.length; j++) {
                        _html += '<option value="' + dataObj.data.handle_user_info[j].role_id + '">' + dataObj.data.handle_user_info[j].real_name + '</option>';
                    }
                    _html += '</select></div>';
                    _html += '<div><input type="radio" name="exchangeType" value="0" title="不移交"></div></div>'
                }
                _html += '</div>';
                $.dialog({
                    title: '移除操作员',
                    content: _html,
                    width: 660,
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
                        $("select[name='exchangeId']").initSelect();
                        $("input[type='radio']").initRadio();
                        //确认事件
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var _exchange = "";
                            if ($(".remove_handler").length > 0 && $("input[name='exchangeType']:checked").val() == "1") {
                                if ($("select[name='exchangeId']").val() == "") {
                                    $.msgTips({
                                        type: "warning",
                                        content: "请选择移交对象"
                                    });
                                    return false;
                                }
                                _exchange = $("select[name='exchangeId']").val();
                            }
                            $.ajaxForJson(config.wwwPath + "buyer/ProjectUser/delAjax", {
                                id: $(".back_main_content").attr("project_id"),
                                role_id: _id,
                                tender_ids: dataObj.data.tender_ids,
                                exchange_role_id: _exchange
                            }, function (obj) {
                                if (obj.code == 2000) {
                                    $.msgTips({
                                        type: "success",
                                        content: obj.msg,
                                        callback: function () {
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
                            return false;
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