require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';

const config = require('configModule');
const libs = require('libs');

$(() => {
    var vm = new Vue({
        el: '#son',
        data() {
            return {
                loading: true,
                list: [],
                count: 0,
                limit: 10,
                current: 1
            }
        },
        mounted() {
            this.getSon(1);
        },
        methods: {
            getSon(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var key = $.trim($("input[name='company_name']").val()), type = $("input[name='role_type']").val();
                $.ajaxForJson(config.accountPath + "/subAccountPost", {
                    company_name: key,
                    role_type: type,
                    status: $("select[name='status']").val(),
                    join_way: $("select[name='join_way']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.list;
                    }
                    that.loading = false;
                });
            }
        }

    });

    //检索供应商库
    $(".btn_confirm").unbind().bind("click", function () {
        var key = $.trim($("input[name='company_name']").val()), type = $("input[name='role_type']").val();
        $(".page_container_wrap").ajxForPage(config.accountPath + "/subAccountPost", {
            company_name: key,
            role_type: type,
            status: $("select[name='status']").val(),
            join_way: $("select[name='join_way']").val()
        });
        return false;
    });
    $("input[name='company_name']").unbind().bind("keypress", function (event) {
        if (event.keyCode == "13") {
            $(".btn_confirm").trigger("click");
        }
    });

    // 添加子账号
    $(".back_main").on("click", ".back_title_btn,.change_status", function () {
        var dialogHTML = '', dialogTitle = '';
        if ($(this).hasClass("change_status")) {
            var obj = JSON.parse($(this).parents("tr").find("input[name='item_data']").val());
            var accountType = obj.account_type == "1" ? "企业管理员" : "项目管理员";
            var id = $(this).parents("tr").find("input[name='id']").val();
            dialogHTML = '<div class="son_account"><div class="son_account_form"><form action="' + config.accountPath + 'editCompanyRole" id="addSon"><input type="hidden" name="id" value="' + id + '"><input type="hidden" name="account_type" value="' + obj.account_type + '"><input type="hidden" name="user_item_id" value="' + obj.user_item_id + '">';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>姓名：</label><div class="son_account_block">' + obj.real_name + '</div></div>';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>手机：</label><div class="son_account_block">' + obj.user_mobile + '</div></div>';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>邮箱：</label><div class="son_account_block">' + obj.user_email + '</div></div>';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>账号类型：</label><div class="son_account_block">' + accountType + '</div></div>';
            if (obj.account_type == "2") {
                dialogHTML += '<div class="js_proCon"><div class="son_account_item"><label><span>*</span>分管项目：</label><div class="son_account_block js_material"><div class="multiple-title"><span>请选择项目</span><i class="iconfont icon-xiajiantou"></i></div><div class="multiple-content"><ul class="material-list"></ul><div class="material-btns"><a class="material-confirm" href="javascript:;">确定</a></div></div></div></div>';
                dialogHTML += '<div class="son_account_item"><label></label><div class="son_account_block" style="height: auto;"><div class="project_box"><ul>';
                for (var key in obj.item) {
                    dialogHTML += '<li target_id="' + key + '"><input type="hidden" name="item_id[]" value="' + key + '"><input type="hidden" name="item_name[]" value="' + obj.item[key] + '"><span class="ellipsis">' + obj.item[key] + '</span><a href="javascript:;" class="textOrange js_delPro">删除</a></li>'
                }
                dialogHTML += '</ul></div></div></div></div>';
            }
            var check1 = obj.role_status == "1" ? "checked" : "", check0 = obj.role_status == "0" ? "checked" : "";
            dialogHTML += '<div class="son_account_item"><label></label><div class="son_account_block"><input type="radio" name="role_status" title="启用" value="1" ' + check1 + '><input type="radio" name="role_status" title="禁用" value="0" ' + check0 + '></div></div>';
            dialogHTML += '</form></div></div>';

            dialogTitle = " 修改子账号";
        }
        else {
            dialogHTML = '<div class="son_account"><div class="son_account_form"><form action="' + config.accountPath + 'addSubaccount" id="addSon">';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>姓名：</label><div class="son_account_block"><input type="text" autocomplete="off" name="real_name" class="cjy-input-" placeholder="请填写真实姓名"></div></div>';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>手机：</label><div class="son_account_block"><input type="text" autocomplete="new-mobile" name="user_mobile"  class="cjy-input-" placeholder="请输入手机号码，将作为登录帐号"></div></div>';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>密码：</label><div class="son_account_block"><input type="password" autocomplete="new-password" name="user_pwd" class="cjy-input-" placeholder="8~20位数字及字母的组合"></div></div>';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>邮箱：</label><div class="son_account_block"><input type="text" autocomplete="off" name="user_email" class="cjy-input-" placeholder="请输入邮箱，用于接收通知信息"></div></div>';
            dialogHTML += '<div class="son_account_item"><label><span>*</span>账号类型：</label><div class="son_account_block"><select value="1" name="account_type" style="width: 298px;"><option value="1">企业管理员</option><option value="2">项目管理员</option></select></div></div>';
            dialogHTML += '<div class="js_proCon" style="display: none"><div class="son_account_item"><label><span>*</span>分管项目：</label><div class="son_account_block js_material"><div class="multiple-title"><span>请选择项目</span><i class="iconfont icon-xiajiantou" style="top:2px;"></i></div><div class="multiple-content"><ul class="material-list"></ul><div class="material-btns"><a class="material-confirm" href="javascript:;">确定</a></div></div></div></div>';
            dialogHTML += '<div class="son_account_item"><label></label><div class="son_account_block"><div class="project_box"><ul></ul></div></div></div></div>';
            dialogHTML += '<div class="son_account_item"><label></label><div class="son_account_block"><input type="radio" name="role_status" title="启用" value="1" checked><input type="radio" name="role_status" title="禁用" value="0"></div></div>';
            dialogHTML += '</form></div></div>';

            dialogTitle = "添加子账号";
        }

        $.dialog({
            title: dialogTitle,
            content: dialogHTML,
            width: 660,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            callback: function () {
                //选择账号类型
                $("select[name='account_type']").unbind().bind("change", function () {
                    if ($(this).val() == "2") {
                        $(".js_proCon").show();
                    }
                    else {
                        $(".js_proCon").hide();
                    }
                });
                //填写手机获取信息
                $("input[name='user_mobile']").unbind().bind("blur", function () {
                    $.ajaxForJson(config.accountPath + "/getAccount", {
                        user_mobile: $("input[name='user_mobile']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $("input[name='real_name']").val(dataObj.data.real_name).addClass("blackBg").attr("readonly", "readonly");
                            $("input[name='user_email']").val(dataObj.data.user_email).addClass("blackBg").attr("readonly", "readonly");
                            $("input[name='user_pwd']").val(dataObj.data.user_pwd).addClass("blackBg").attr("readonly", "readonly");
                        }
                        else{
                            $("input[name='real_name']").val('').removeClass("blackBg").removeAttr("readonly");
                            $("input[name='user_email']").val('').removeClass("blackBg").removeAttr("readonly");
                            $("input[name='user_pwd']").val('').removeClass("blackBg").removeAttr("readonly");
                        }
                    });
                });
                //提交表单
                $(".cjy-confirm-btn").off().on("click", function () {
                    if ($("input[name='real_name']").length > 0 && $.trim($("input[name='real_name']").val()) == "") {
                        $("input[name='real_name']").initInput("error", "请填写姓名");
                        $("input[name='real_name']").unbind().bind("blur", function () {
                            $("input[name='real_name']").initInput();
                        });
                        return false;
                    }
                    else if ($("input[name='user_mobile']").length > 0 && ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val()))) {
                        $("input[name='user_mobile']").initInput("error", "请填写正确的手机");
                        $("input[name='user_mobile']").unbind().bind("blur", function () {
                            $("input[name='user_mobile']").initInput();
                        });
                        return false;
                    }
                    else if ($("input[name='user_pwd']").length > 0 && ($.trim($("input[name='user_pwd']").val()) == "" || !libs.checkPassword($("input[name='user_pwd']").val()))) {
                        $("input[name='user_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
                        $("input[name='user_pwd']").unbind().bind("blur", function () {
                            $("input[name='user_pwd']").initInput();
                        });
                        return false;
                    }
                    else if ($("input[name='user_email']").length > 0 && ($.trim($("input[name='user_email']").val()) == "" || !libs.checkEmail($("input[name='user_email']").val()))) {
                        $("input[name='user_email']").initInput("error", "请填写正确的邮箱");
                        $("input[name='user_email']").unbind().bind("blur", function () {
                            $("input[name='user_email']").initInput();
                        });
                        return false;
                    }
                    else if ($("select[name='account_type']").val() == "2" && $("input[name='item_id[]']").length <= 0) {
                        $.msgTips({
                            type: "warning",
                            content: "请选择分管项目"
                        })
                    }

                    var reqUrl = $("#addSon").attr("action");
                    var reqData = $("#addSon").serialize();

                    $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
                        }
                        else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                });

                /**
                 * 选择项目
                 * */
                var materialArr = [];
                $(".project_box").find("li").each(function () {
                    var id = $(this).attr("target_id");
                    materialArr.push(id);
                });
                $.ajaxForJson(config.accountPath + "/itemLists", null, function (dataObj) {
                    if (dataObj.code == "2000") {
                        var liHTML = '';
                        if (dataObj.data.length <= 0) {
                            $("select[name='account_type']").html('<option value="1">企业管理员</option><option value="2" disabled>项目管理员</option>').initSelect();
                            var noticeHTML = '<div class="son_account_item"><label></label><div class="son_account_block"><div class="tips_wrap"><i class="iconfont icon-i"></i>如需添加项目管理员，请先维护企业项目库</div></div></div>';
                            $("select[name='account_type']").parents(".son_account_item").after(noticeHTML);
                        }
                        else {
                            for (var i = 0; i < dataObj.data.length; i++) {
                                var act = materialArr.indexOf(dataObj.data[i].item_id) > -1 ? "act" : "";
                                liHTML += '<li class="' + act + '" title="' + dataObj.data[i].item_name + '" data-id="' + dataObj.data[i].item_id + '" data-name="' + dataObj.data[i].item_name + '"><i class="iconfont icon-gou"></i>' + dataObj.data[i].item_name + '</li>'
                            }
                            $(".js_material").find("ul.material-list").html(liHTML);
                            //选择项目
                            $(".js_material").find("ul.material-list").find("li").unbind().bind("click", function () {
                                var targetId = $(this).attr("data-id");
                                if ($(this).hasClass("act")) {
                                    $(this).removeClass("act");
                                    $(".project_box").find("ul").find("li[target_id='" + targetId + "']").remove();
                                }
                                else {
                                    $(this).addClass("act");
                                    var cell = '<li target_id="' + targetId + '"><input type="hidden" name="item_id[]" value="' + targetId + '"><input type="hidden" name="item_name[]" value="' + $(this).attr("data-name") + '"><span class="ellipsis">' + $(this).attr("data-name") + '</span><a href="javascript:;" class="textOrange js_delPro">删除</a></li>';
                                    $(".project_box").find("ul").append(cell);

                                    //删除项目
                                    $(".js_delPro").unbind().bind("click", function () {
                                        var id = $(this).parent().attr("target_id");
                                        $(".js_material").find("li[data-id='" + id + "']").removeClass("act");
                                        $(this).parents("li").remove();
                                        return false;
                                    });
                                }
                                return false;
                            });
                        }
                    }
                });
                //选择项目的展开收起
                $(".js_material").find(".multiple-title").unbind().bind("click", function () {
                    if ($(".js_material").hasClass("js_selected")) {
                        $(".js_material").removeClass("js_selected");
                    }
                    else {
                        $(".js_material").addClass("js_selected");
                    }
                    return false;
                });
                //删除项目
                $(".js_delPro").unbind().bind("click", function () {
                    var id = $(this).parent().attr("target_id");
                    $(".js_material").find("li[data-id='" + id + "']").removeClass("act");
                    $(this).parents("li").remove();
                    return false;
                });
                //确认项目选择
                $(".js_material").on("click", ".material-confirm", function () {
                    $(".js_material").removeClass("js_selected");
                    return false;
                });

                $("select").initSelect();
                $("input[type='radio']").initRadio();
            }
        });
    });

    //点击空白区隐藏下拉框
    $(document).click(function (e) {
        var _con = $('.js_material');   // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
            $('.js_material').removeClass("js_selected");
        }
    });
});