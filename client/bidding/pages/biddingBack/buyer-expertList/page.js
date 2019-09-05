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
        el: '#supplier',
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
            this.getSupplier(1);
        },
        methods: {
            getSupplier(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                var key = $.trim($("input[name='company_name']").val());
                $.ajaxForJson(config.wwwPath + 'BuyerCenter/expert/indexAjax', {
                    expert_source: $("select[name='expert_source']").val(),
                    group_id: $("select[name='group_id']").val(),
                    city_code: $("input[name='city_code']").val(),
                    real_name: key,
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;

                        for (var i = 0; i < that.list.length; i++) {
                            var _group = '',
                                _groupId = [];
                            for (var j = 0; j < that.list[i].group.length; j++) {
                                if (j == 0) {
                                    _group += that.list[i].group[j].group_title
                                } else {
                                    _group += "，" + that.list[i].group[j].group_title
                                }
                                _groupId.push(that.list[i].group[j].group_id);
                            }
                            that.$set(that.list[i], "groupStr", _group);
                            that.$set(that.list[i], "groupIdArr", _groupId);
                        }
                    }
                    that.loading = false;
                });
            },
            expertEdit(i) {
                var that = this;
                var _html = '<div class="expertDlg-content"><div class="expertDlg-block"><label><span class="textRed">*</span>专家账号：</label><div class="expertDlg-input"><input type="text" class="cjy-input-" name="user_mobile" placeholder="请输入专家手机号，将作为登录账号" value="' + that.list[i].user.user_mobile + '" disabled></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>专家姓名：</label><div class="expertDlg-input"><input type="text" class="cjy-input-" name="real_name" placeholder="请输入真实姓名" value="' + that.list[i].user.real_name + '" disabled></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>密码：</label><div class="expertDlg-input"><input type="password" class="cjy-input-" name="user_pwd" placeholder="8~20位数字及字母组合" value="a8888888" disabled></div></div>';
                var groupIds = that.list[i].groupIdArr.join(",");
                _html += '<div class="expertDlg-block"><label><span class="textRed">*</span>专业分类：</label><div class="expertDlg-input"><div class="cjy-select js_typeChoose" style="width: 364px;"><div class="cjy-select-title"><input type="hidden" name="group_id" value="' + groupIds + '"><input type="text" placeholder="请选择" value="' + that.list[i].groupStr + '" readonly="" class="cjy-select-input" style="width: 324px;"><i class="iconfont icon-xiajiantou"></i></div><dl style="width: 158px;">';
                for (var key in expertGroup) {
                    dlSlt = that.list[i].groupIdArr.indexOf(key) > -1 ? "sel-this" : "";
                    _html += '<dd data-value="' + key + '" class="' + dlSlt + '" title="' + expertGroup[key] + '" style="width: 344px;"><i class="iconfont icon-gou"></i>' + expertGroup[key] + '</dd>';
                }
                _html += '</dl></div></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>所在地区：</label><div class="expertDlg-input"><span cjy-city province-id="' + that.list[i].province_code + '" province-name="' + that.list[i].province + '" city-id="' + that.list[i].city_code + '" city-name="' + that.list[i].city + '"></span></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>邮箱：</label><div class="expertDlg-input"><input type="text" class="cjy-input-" name="user_email" placeholder="请输入邮箱，用于接收通知信息" value="' + that.list[i].user.user_email + '" disabled></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>专家来源：</label><div class="expertDlg-input"><select name="expert_source" value="' + that.list[i].expert_source + '"><option value="">请选择</option><option value="1">公司内部</option><option value="2">外聘</option></select></div></div><div class="expertDlg-block"><label>备注信息：</label><div class="expertDlg-input"><textarea class="cjy-textarea" maxLen="100" name="remarks">' + that.list[i].remarks + '</textarea></div></div></div>';
                $.dialog({
                    title: "编辑评标专家",
                    content: _html,
                    width: 800,
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    callback: function () {
                        $(".expertDlg-content").find("[cjy-city]").initCitySelect(); //初始化所在区域
                        //初始化专业分类
                        $(".js_typeChoose").find(".cjy-select-title").unbind().bind("click", function () {
                            if ($(".js_typeChoose").hasClass("cjy-selected")) {
                                $(".js_typeChoose").removeClass("cjy-selected");
                            } else {
                                $(".js_typeChoose").addClass("cjy-selected");
                            }
                            return false;
                        });
                        $(".js_typeChoose").on("click", "dl dd", function () {
                            var main = $(this);
                            if (main.hasClass("sel-this")) {
                                main.removeClass("sel-this");
                            } else {
                                main.addClass("sel-this");
                            }
                            var groupStr = "",
                                groupTitle = "请选择";
                            for (var i = 0; i < $(".js_typeChoose").find("dd.sel-this").length; i++) {
                                if ($(".js_typeChoose").find("dd.sel-this").eq(i).attr("data-value") != "") {
                                    if (i == 0) {
                                        groupStr += $(".js_typeChoose").find("dd.sel-this").eq(i).attr("data-value");
                                        groupTitle = $(".js_typeChoose").find("dd.sel-this").eq(i).attr("title");
                                    } else {
                                        groupStr += "," + $(".js_typeChoose").find("dd.sel-this").eq(i).attr("data-value");
                                        groupTitle += "，" + $(".js_typeChoose").find("dd.sel-this").eq(i).attr("title");
                                    }
                                }
                            }
                            $(".js_typeChoose").find("input[name='group_id']").val(groupStr);
                            $(".js_typeChoose").find("input.cjy-select-input").val(groupTitle);
                            return false;
                        });
                        //提交表单
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            if ($(".js_typeChoose").find("input[name='group_id']").length > 0 && ($.trim($(".js_typeChoose").find("input[name='group_id']").val()) == "")) {
                                $.msgTips({
                                    type: "warning",
                                    content: "请选择专家分类"
                                });
                                $(".js_typeChoose").addClass("cjy-selected");
                                return false;
                            } else if ($(".expertDlg-content").find("input[name='city_code']").length > 0 && $(".expertDlg-content").find("input[name='city_code']").val() == "") {
                                $.msgTips({
                                    type: "warning",
                                    content: "请选择所在区域"
                                });
                                $(".expertDlg-content").find(".cjy-multi").addClass("cjy-selected");
                                return false;
                            } else if ($(".expertDlg-content").find("select[name='expert_source']").length > 0 && $(".expertDlg-content").find("select[name='expert_source']").val() == "") {
                                $.msgTips({
                                    type: "warning",
                                    content: "请选择专家来源"
                                });
                                $(".expertDlg-content").find("select[name='expert_source']").focus();
                                return false;
                            }
                            var reqData = {
                                id: that.list[i].id,
                                expert_user_id: that.list[i].expert_user_id,
                                group_id: $(".js_typeChoose").find("input[name='group_id']").val(),
                                city_code: $(".expertDlg-content").find("input[name='city_code']").val(),
                                province_code: $(".expertDlg-content").find("input[name='province_code']").val(),
                                city: $(".expertDlg-content").find("input[name='city_name']").val(),
                                province: $(".expertDlg-content").find("input[name='province_name']").val(),
                                expert_source: $(".expertDlg-content").find("select[name='expert_source']").val(),
                                remarks: $("textarea[name='remarks']").val()
                            };
                            var reqUrl = config.wwwPath + "BuyerCenter/expert/edit";
                            $.ajaxForJson(reqUrl, reqData, function (json) {
                                if (json.code === 2000) {
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                    $.msgTips({
                                        type: "success",
                                        content: json.msg,
                                        callback: function () {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    $.msgTips({
                                        type: "warning",
                                        content: json.msg
                                    });
                                    return false;
                                }
                            });
                        });
                    }
                });
                $(".expertDlg-content select").initSelect();
                $(".expertDlg-content textarea").initTextarea();
            },
            expertDel(id) {
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '是否移除该专家？'],
                    content: '',
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $.ajaxForJson(config.wwwPath + 'BuyerCenter/expert/delete', {
                                expert_user_id: id
                            }, function (dataObj) {
                                if (dataObj.code == "2000") {
                                    $.msgTips({
                                        type: "success",
                                        content: dataObj.msg
                                    });
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 1000);
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
            }
        }

    });

    //检索供应商库
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getSupplier(1);
        return false;
    });
    $("input[name='company_name']").unbind().bind("keypress", function (event) {
        if (event.keyCode == "13") {
            $(".btn_confirm").trigger("click");
        }
    });
    //清除
    $(".btn_clear").unbind().bind("click", function () {
        $("input[name='company_name']").val("");
        $("select[name='expert_source']").initSelect();
        $("select[name='group_id']").initSelect("");
        $("input[name='city_code']").val("");
        $("input[name='city_name']").val("");
        $("[cjy-city]").initCitySelect();
        vm.getSupplier(1);
        return false;
    });

    // 添加评标专家
    $("a[name='expert_add']").unbind().bind("click", function () {
        var _html = '<div class="expertDlg-content"><div class="expertDlg-block"><label><span class="textRed">*</span>专家账号：</label><div class="expertDlg-input"><input type="text" class="cjy-input-" name="user_mobile" placeholder="请输入专家手机号，将作为登录账号"></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>专家姓名：</label><div class="expertDlg-input"><input type="text" class="cjy-input-" name="real_name" placeholder="请输入真实姓名"></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>密码：</label><div class="expertDlg-input"><input type="password" class="cjy-input-" name="user_pwd" placeholder="8~20位数字及字母组合"></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>专业分类：</label><div class="expertDlg-input"><div class="cjy-select js_typeChoose" style="width: 364px;"><div class="cjy-select-title"><input type="hidden" name="group_id"><input type="text" placeholder="请选择" value="请选择" readonly="" class="cjy-select-input" style="width: 324px;"><i class="iconfont icon-xiajiantou"></i></div><dl style="width: 158px;">';
        for (var key in expertGroup) {
            _html += '<dd data-value="' + key + '" class=" " title="' + expertGroup[key] + '" style="width: 344px;"><i class="iconfont icon-gou"></i>' + expertGroup[key] + '</dd>';
        }
        _html += '</dl></div></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>所在地区：</label><div class="expertDlg-input"><span cjy-city></span></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>邮箱：</label><div class="expertDlg-input"><input type="text" class="cjy-input-" name="user_email" placeholder="请输入邮箱，用于接收通知信息"></div></div><div class="expertDlg-block"><label><span class="textRed">*</span>专家来源：</label><div class="expertDlg-input"><select name="expert_source" value=""><option value="">请选择</option><option value="1">公司内部</option><option value="2">外聘</option></select></div></div><div class="expertDlg-block"><label>备注信息：</label><div class="expertDlg-input"><textarea class="cjy-textarea" maxLen="100" name="remarks"></textarea></div></div></div>';
        $.dialog({
            title: "添加评标专家",
            content: _html,
            width: 800,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".expertDlg-content").find("[cjy-city]").initCitySelect(); //初始化所在区域
                //初始化专业分类
                $(".js_typeChoose").find(".cjy-select-title").unbind().bind("click", function () {
                    if ($(".js_typeChoose").hasClass("cjy-selected")) {
                        $(".js_typeChoose").removeClass("cjy-selected");
                    } else {
                        $(".js_typeChoose").addClass("cjy-selected");
                    }
                    return false;
                });
                $(".js_typeChoose").on("click", "dl dd", function () {
                    var main = $(this);
                    if (main.hasClass("sel-this")) {
                        main.removeClass("sel-this");
                    } else {
                        main.addClass("sel-this");
                    }
                    var groupStr = "",
                        groupTitle = "请选择";
                    for (var i = 0; i < $(".js_typeChoose").find("dd.sel-this").length; i++) {
                        if ($(".js_typeChoose").find("dd.sel-this").eq(i).attr("data-value") != "") {
                            if (i == 0) {
                                groupStr += $(".js_typeChoose").find("dd.sel-this").eq(i).attr("data-value");
                                groupTitle = $(".js_typeChoose").find("dd.sel-this").eq(i).attr("title");
                            } else {
                                groupStr += "," + $(".js_typeChoose").find("dd.sel-this").eq(i).attr("data-value");
                                groupTitle += "，" + $(".js_typeChoose").find("dd.sel-this").eq(i).attr("title");
                            }
                        }
                    }
                    $(".js_typeChoose").find("input[name='group_id']").val(groupStr);
                    $(".js_typeChoose").find("input.cjy-select-input").val(groupTitle);
                    return false;
                });

                //输入手机号
                var inputObj = null;
                $("input[name='user_mobile']").unbind().bind("input", function () {
                    var main = $(this);
                    clearTimeout(inputObj);
                    inputObj = setTimeout(function () {
                        $.ajaxForJson(config.wwwPath + "BuyerCenter/expert/expertMobile", {
                            user_mobile: main.val()
                        }, function (dataObj) {
                            if (dataObj.code == 2000 && dataObj.data.user) {
                                $("input[name='real_name']").val(dataObj.data.user.real_name).attr("disabled", "disabled");
                                $("input[name='user_pwd']").val('a88888888').attr("disabled", "disabled");
                                $("input[name='user_email']").val(dataObj.data.user.user_email).attr("disabled", "disabled");
                            } else {
                                $("input[name='real_name']").val("").removeAttr("disabled");
                                $("input[name='user_pwd']").val("").removeAttr("disabled");
                                $("input[name='user_email']").val("").removeAttr("disabled");
                            }
                        });
                    }, 500);
                });
                //提交表单
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if ($("input[name='user_mobile']").length > 0 && ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val()))) {
                        $("input[name='user_mobile']").initInput("error", "请填写正确的手机");
                        $("input[name='user_mobile']").unbind().bind("blur", function () {
                            $("input[name='user_mobile']").initInput();
                        });
                        return false;
                    } else if ($("input[name='real_name']").length > 0 && ($.trim($("input[name='real_name']").val()) == "")) {
                        $("input[name='real_name']").initInput("error", "请输入专家姓名");
                        $("input[name='real_name']").unbind().bind("blur", function () {
                            $("input[name='real_name']").initInput();
                        });
                        return false;
                    } else if ($("input[name='user_pwd']").length > 0 && ($.trim($("input[name='user_pwd']").val()) == "" || !libs.checkPassword($("input[name='user_pwd']").val()))) {
                        $("input[name='user_pwd']").initInput("error", "8~20位数字及字母组合");
                        $("input[name='user_pwd']").unbind().bind("blur", function () {
                            $("input[name='user_pwd']").initInput();
                        });
                        return false;
                    } else if ($("input[name='user_email']").length > 0 && ($.trim($("input[name='user_email']").val()) == "" || !libs.checkEmail($("input[name='user_email']").val()))) {
                        $("input[name='user_email']").initInput("error", "请填写正确的邮箱");
                        $("input[name='user_email']").unbind().bind("blur", function () {
                            $("input[name='user_email']").initInput();
                        });
                        return false;
                    } else if ($(".js_typeChoose").find("input[name='group_id']").length > 0 && ($.trim($(".js_typeChoose").find("input[name='group_id']").val()) == "")) {
                        $.msgTips({
                            type: "warning",
                            content: "请选择专家分类"
                        });
                        $(".js_typeChoose").addClass("cjy-selected");
                        return false;
                    } else if ($(".expertDlg-content").find("input[name='city_code']").length > 0 && $(".expertDlg-content").find("input[name='city_code']").val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择所在区域"
                        });
                        $(".expertDlg-content").find(".cjy-multi").addClass("cjy-selected");
                        return false;
                    } else if ($(".expertDlg-content").find("select[name='expert_source']").length > 0 && $(".expertDlg-content").find("select[name='expert_source']").val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择专家来源"
                        });
                        $(".expertDlg-content").find("select[name='expert_source']").focus();
                        return false;
                    } else if ($("textarea[name='remarks']").val().length > 100) {
                        $.msgTips({
                            type: "warning",
                            content: "备注信息过长"
                        });
                        $("textarea[name='remarks']").focus();
                        return false;
                    }
                    var reqData = {
                        user_mobile: $("input[name='user_mobile']").val(),
                        real_name: $("input[name='real_name']").val(),
                        user_pwd: $("input[name='user_pwd']").val(),
                        user_email: $("input[name='user_email']").val(),
                        group_id: $(".js_typeChoose").find("input[name='group_id']").val(),
                        city_code: $(".expertDlg-content").find("input[name='city_code']").val(),
                        province_code: $(".expertDlg-content").find("input[name='province_code']").val(),
                        city: $(".expertDlg-content").find("input[name='city_name']").val(),
                        province: $(".expertDlg-content").find("input[name='province_name']").val(),
                        expert_source: $(".expertDlg-content").find("select[name='expert_source']").val(),
                        remarks: $("textarea[name='remarks']").val()
                    };
                    var reqUrl = config.wwwPath + "BuyerCenter/expert/add";
                    $.ajaxForJson(reqUrl, reqData, function (json) {
                        if (json.code === 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            $.msgTips({
                                type: "success",
                                content: json.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: json.msg
                            });
                            return false;
                        }
                    });
                });
            }
        });
        $(".expertDlg-content select").initSelect();
        $(".expertDlg-content textarea").initTextarea();
        return false;
    });
});