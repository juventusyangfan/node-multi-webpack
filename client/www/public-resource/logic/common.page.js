/**
 * Created by yangfan on 2017/7/5.
 */
require('lessDir/base.less');
require('cssDir/reset.css');
require('cssDir/customPublic.css');
require('cssDir/component.css');
require('fontDir/iconfont.css');
const config = require('configModule');
const libs = require("libs");

$(() => {
    //公共弹框插件
    (function ($) {
        var timeObj = null;
        $.extend({
            msgTips: function (options) {
                var settings = {
                    type: "success",
                    icon: "",
                    content: "成功",
                    callback: null
                };
                $.extend(settings, options || {});
                var msgTipsHtml = '';
                if ($(".cjy-poplayer").length === 0) {
                    msgTipsHtml = '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div><div class="cjy-msgTips"><p class="cjy-msgTips-inner">';
                } else {
                    msgTipsHtml = '<div class="cjy-msgTips"><p class="cjy-msgTips-inner">';
                }
                if (settings.type === "success") {
                    settings.icon = "icon-gou";
                }
                else if (settings.type === "warning") {
                    settings.icon = "icon-gantanhao";
                }
                else if (settings.type === "error") {
                    settings.icon = "icon-cha1";
                }
                msgTipsHtml += '<i class="iconfont ' + settings.icon + ' ' + settings.type + '"></i><span>' + settings.content + '</span></p></div>';
                $("body").eq(0).append(msgTipsHtml);
                if ($(".cjy-poplayer").length !== 0) {
                    $(".cjy-bg").css("z-index", "101");
                }
                var ele = $(".cjy-msgTips");
                ele.css({
                    "left": ($(window).outerWidth() - ele.outerWidth()) / 2 + "px",
                    "top": $(document).scrollTop() + ele.outerHeight() + "px",
                    "z-index": 102
                });
                ele.fadeIn(400);
                setTimeout(function () {
                    ele.fadeOut(400, function () {
                        ele.remove();
                    });
                    if ($(".cjy-poplayer").length == 0) {
                        $(".cjy-bg").fadeOut(400, function () {
                            $(".cjy-bg").remove();
                        });
                    } else {
                        $(".cjy-bg").css("z-index", "99");
                    }
                    if (settings.callback !== null) {
                        settings.callback();
                    }
                }, 1000);
            },
            dialog: function dialog(options) {
                var settings = {
                    title: "",
                    topWords: [],
                    content: "",
                    width: 540,
                    url: "",
                    confirm: {
                        show: true,
                        allow: true,
                        name: "确认"
                    },
                    cancel: {
                        show: false,
                        name: "取消"
                    },
                    button: {
                        show: false,
                        html: ""
                    },
                    callback: null
                };
                $.extend(settings, options || {});
                if (settings.url) {
                    settings.content = $.ajax({
                        url: settings.url,
                        async: false
                    }).responseText;
                }
                var dialogNum = $(".cjy-poplayer").length;
                var dialogHTML = '';
                if (dialogNum === 0) {
                    dialogHTML += '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>';
                }
                dialogHTML += '<div class="cjy-poplayer"><div class="cjy-layer-wrap" style="width: ' + settings.width + 'px;">';
                dialogHTML += '<div class="cjy-layer-head"><h1>' + settings.title + '</h1><i class="cjy-close iconfont icon-cha1"></i></div>';
                dialogHTML += '<div class="cjy-layer-inner">';
                if (settings.topWords.length > 0) {
                    dialogHTML += '<div class="cjy-layer-center"><p class="cjy-tips"><i class="iconfont ' + settings.topWords[0] + '"></i>' + settings.topWords[1] + '</p></div>';
                }
                dialogHTML += '<div class="cjy-layer-body">' + settings.content + '</div></div>';
                if (settings.confirm.show || settings.cancel.show || settings.button.show) {
                    dialogHTML += '<div class="cjy-layer-foot">';
                    if (settings.cancel.show) {
                        dialogHTML += '<button class="cjy-cancel-btn">' + settings.cancel.name + '</button>';
                    }
                    if (settings.confirm.show) {
                        if (settings.confirm.allow) {
                            dialogHTML += '<button class="cjy-confirm-btn">' + settings.confirm.name + '</button>';
                        } else {
                            dialogHTML += '<button class="cjy-notallow-btn">' + settings.confirm.name + '</button>';
                            ;
                        }
                    }
                    if (settings.button.show) {
                        dialogHTML += settings.button.html;
                    }
                    dialogHTML += '</div>';
                }
                dialogHTML += '</div></div>';

                $("body").eq(0).append(dialogHTML);
                if (dialogNum !== 0) {
                    $(".cjy-bg").css("z-index", "101");
                    $(".cjy-poplayer").eq(1).css("z-index", "102");
                }

                _initDialog();
                //取消
                $(".cjy-close,.cjy-cancel-btn").unbind().bind("click", function () {
                    _closeDialog();
                });

                $(".cjy-layer-head").unbind().bind("mousedown", function (e) {

                    document.onselectstart = function () {
                        return false;
                    };
                    var main = $(this)[0].parentNode.parentNode;
                    var oEvent = e || event;

                    var disX = oEvent.clientX - main.offsetLeft;
                    var disY = oEvent.clientY - main.offsetTop;

                    document.onmousemove = function (ev) {
                        var oEvent = ev || event;

                        main.style.left = oEvent.clientX - disX + 'px';
                        main.style.top = oEvent.clientY - disY + 'px';

                        if (parseInt(main.style.left) < 0) {
                            main.style.left = '0px';
                        } else if (parseInt(main.style.left) > document.body.clientWidth - main.clientWidth) {
                            main.style.left = document.body.clientWidth - main.clientWidth + "px";
                        }
                    };

                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                        document.onselectstart = null;
                    };
                    $(".cjy-layer-head").unbind("mouseout").bind("mouseout", function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                        document.onselectstart = null;
                    });
                });

                //初始化弹框
                function _initDialog() {
                    //计算屏幕宽高
                    var windowWidth = $(window).width(),
                        windowHeight = $(window).height();
                    //计算页面的宽高
                    var bodyScrollTop = 0;
                    var bodyScrollLeft = 0;
                    if (document.documentElement && document.documentElement.scrollTop) {
                        bodyScrollTop = document.documentElement.scrollTop;
                        bodyScrollLeft = document.documentElement.scrollLeft;
                    } else if (document.body) {
                        bodyScrollTop = document.body.scrollTop;
                        bodyScrollLeft = document.body.scrollLeft;
                    }
                    //计算弹框宽高
                    var dialogHeight, dialogWidth;
                    if (dialogNum <= 0) {
                        dialogHeight = $(".cjy-poplayer")[0].clientHeight;
                        dialogWidth = $(".cjy-poplayer")[0].clientWidth;
                    } else {
                        dialogHeight = $(".cjy-poplayer").eq(1)[0].clientHeight;
                        dialogWidth = $(".cjy-poplayer").eq(1)[0].clientWidth;
                    }
                    //设置弹框在页面的展示位置
                    var PopupsFraTop = windowHeight / 2 - dialogHeight / 2 + bodyScrollTop >= 0 ? windowHeight / 2 - dialogHeight / 2 + bodyScrollTop : bodyScrollTop;
                    var PopupsFraLeft = windowWidth / 2 - dialogWidth / 2 + bodyScrollLeft >= 0 ? windowWidth / 2 - dialogWidth / 2 + bodyScrollLeft : 0;

                    if (dialogNum <= 0) {
                        $(".cjy-poplayer").css({
                            "top": PopupsFraTop,
                            "left": PopupsFraLeft
                        });
                    } else {
                        $(".cjy-poplayer").eq(1).css({
                            "top": PopupsFraTop,
                            "left": PopupsFraLeft
                        });
                    }

                    if (settings.callback) {
                        settings.callback();
                    }
                }

                //关闭弹框
                function _closeDialog() {
                    clearTimeout(timeObj);
                    if ($(".cjy-poplayer").length !== 1) {
                        $(".cjy-bg").css("z-index", "99");
                        $(".cjy-poplayer").eq(1).remove();
                    } else {
                        $(".cjy-poplayer").remove();
                        $(".cjy-bg").remove();
                    }
                }
            },
            messageDialog: function messageDialog(options) {
                var settings = {
                    title: "提示",
                    icon: "success",
                    content: "操作成功！",
                    time: 2000
                };
                $.extend(settings, options || {});
                var iClass = '';
                switch (settings.icon) {
                    case "success":
                        iClass = 'tips fa fa-check-circle';
                        break;
                    case "error":
                        iClass = 'tips fa fa-times-circle';
                        break;
                    case "warning":
                        iClass = 'tips fa fa-exclamation-circle';
                        break;
                    default:
                        break;
                }
                var dialogHTML = '<div class="dialog_tips_con clearFloat"><i class="' + iClass + '"></i><span>' + settings.content + '</span></div>';
                $.dialog({
                    title: settings.title,
                    content: dialogHTML,
                    width: 350,
                    url: "",
                    confirm: {
                        show: false,
                        name: "确认"
                    },
                    cancel: {
                        show: false,
                        name: "取消"
                    },
                    button: {
                        show: false,
                        html: ""
                    },
                    callback: null
                });
                if (settings.time > 0) {
                    timeObj = setTimeout(function () {
                        $(".js_dialog_close").trigger("click");
                    }, settings.time);
                }
            },
            cueDialog: function cueDialog(options) {
                var settings = {
                    title: "提示",
                    topWords: [],
                    content: "",
                    allow: true,
                    callback: null
                };
                $.extend(settings, options || {});
                $.dialog({
                    title: settings.title,
                    topWords: settings.topWords,
                    content: settings.content,
                    width: 540,
                    confirm: {
                        show: true,
                        allow: settings.allow,
                        name: "确认"
                    },
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    button: {
                        show: false,
                        html: ""
                    },
                    callback: function callback() {
                        $(".cjy-cancel-btn").unbind().bind("click", function () {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            return false;
                        });
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            if (settings.callback) {
                                settings.callback();
                            }
                            return false;
                        });
                    }
                });
            },
            loginDialog: function loginDialog() {
                var dialogCon = '<div class="login_box">';
                dialogCon += '<div class="login_item"><i class="iconfont icon-quanxian-shouxian pwd_icon"></i><input type="text" name="user_mobile" placeholder="请输入密码"></div>';
                dialogCon += '<div class="login_item"><i class="iconfont icon-quanxian-shouxian pwd_icon"></i><input type="password" name="user_pwd" placeholder="请输入密码"></div>';
                dialogCon += '<div class="err_area"><div class="err_tips"><i class="iconfont icon-cha1 err_icon"></i><span>账号错误</span></div></div>';
                dialogCon += '<div class="login_item"><button>登录生材网</button></div>';
                dialogCon += '<div class="login_item marginB30 clearfix"><a class="forget_pwd" href="https://account.materialw.com/find.html">忘记密码？</a><a class="sign_up" href="https://account.materialw.com/register.html">立即注册</a></div>';
                dialogCon += '</div>';
                $.dialog({
                    title: "登录",
                    content: dialogCon,
                    width: 402,
                    url: "",
                    confirm: {
                        show: true,
                        name: "登录"
                    },
                    cancel: {
                        show: true,
                        name: "注册"
                    },
                    button: {
                        show: false,
                        html: ""
                    },
                    callback: function callback() {
                        // 表单输入
                        $(".login_item input").off().on("input", function () {
                            var main = $(this);
                            if (main.val() !== "" && main.hasClass("err_border")) {
                                main.removeClass("err_border");
                                $(".err_area").removeClass("display-block");
                            } else if ($(".err_area").hasClass("display-block")) {
                                $(".err_area").removeClass("display-block");
                            }
                        });

                        // 按enter健登录
                        $("input").bind("keyup", function (event) {
                            if (event.keyCode == "13") {
                                $(".login_item button").triggerHandler("click");
                                return false;
                            }
                        });

                        // 登录
                        $(".login_item button").off().on("click", function () {
                            var main = $(this), formObj = $("form").eq(0);

                            if ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val())) {
                                $(".err_area span").html("请填写正确的手机");
                                $("input[name='user_mobile']").addClass("err_border");
                                $(".err_area").addClass("display-block");
                                return false;
                            }
                            else if ($.trim($("input[name='user_pwd']").val()) == "" || !libs.checkPassword($("input[name='user_pwd']").val())) {
                                $(".err_area span").html("请填写8-20位字及字母组合的密码");
                                $("input[name='user_pwd']").addClass("err_border");
                                $(".err_area").addClass("display-block");
                                return false;
                            }

                            var reqUrl = config.accountPath + 'loginJsonp';
                            var reqData = $(".login_box input").serialize();

                            $.ajaxJSONP(reqUrl, reqData, function (json) {
                                if (json.code == 2000) {
                                    if (json.hasOwnProperty("msg")) {
                                        $.msgTips({
                                            type: "success",
                                            content: json.msg
                                        });
                                    } else {
                                        if (json.data.hasOwnProperty("member_status")) {
                                            if (json.data.member_status !== 1) {
                                                $.memberDialog({
                                                    company_name: json.data.data.company_name,
                                                    real_name: json.data.data.real_name,
                                                    member_status: json.data.member_status
                                                });
                                                $.msgTips({
                                                    type: "success",
                                                    content: json.data.msg
                                                });
                                            } else {
                                                $.msgTips({
                                                    type: "success",
                                                    content: json.data.msg,
                                                    callback: function () {
                                                        location.href = json.data.url;
                                                    }
                                                });
                                            }
                                        } else {
                                            if (json.data.is_agreement == "0") {
                                                var strHtml = '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div><div class="cjy-poplayer" style="top: 154px; left: 50%; margin-left: -490px;"><div class="cjy-layer-wrap" style="width: 980px;"><div class="cjy-layer-head"><h1>服务协议更新</h1><i class="cjy-close iconfont icon-cha1"></i></div><div class="cjy-layer-inner"><div class="cjy-layer-body"><div class="inDialog" style="padding: 0 20px; height: 560px;overflow-y: auto;"><p style="text-indent:32px;line-height:150%"><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">提示条款</span></span></strong></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">欢迎您签署本《生材网平台服务协议》并使用生材网平台服务！</span></span></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">本协议为《生材网平台服务协议》修订版本，自本协议发布之日起，生材网平台各处所称</span>“生材网服务协议”均指本协议。</span></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px">&nbsp;</span></p><p style="text-indent:32px;line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">您经您所代表的公司或其他组织授权</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">（以下您和您所</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">代表</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">的公司</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">或其他组织</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">均简称为</span>“您”）</span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">与生材网的经营者湖北省楚建易网络科技有限公司</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">（</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">以下简称</span>“生材网”</span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">）</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">共同缔结</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">本协议</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">成为生材网平台</span></span><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">会员</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">本协议具有合同效力。本协议阐述之条款和条件（以下合称</span>“条款”）适用于您使用生材网，生材网依据以下条款为您提供所享有的服务，请仔细阅读并遵守。</span></p><p style=";line-height:150%"><span style=";font-family:楷体;line-height:150%;font-size:16px">&nbsp;</span></p><p style=";line-height:150%"><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">【</span></span></strong><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">审慎阅读</span></span></strong><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">】</span></span></strong><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">您在申请注册流程中点击同意本协议之前</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">应当认真阅读本协议</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">。</span></span><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">请您务必审慎阅读</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">、</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">充分理解</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">各</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">条款内容</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">，</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">特别是免除或限制责任的条款</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">、</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">法律适用和争议解决条款</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">。</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">免除或限制责任的条款将以粗体标识</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">，</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">您应重点阅读</span></span></span></strong><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">。</span></span></span></strong><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">如您对协议有任何疑问</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">可向生材网平台进行咨询</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">。</span></span></p><p style=";line-height:150%"><strong><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">【签约动作】</span></span></strong><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">，</span></span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">与生材网达成一致，成为生材网平台</span>“会员”</span><span style=";font-family:楷体;line-height:150%;font-size:16px"><span style="font-family:楷体">。</span></span><strong><span style="text-decoration:underline;"><span style="font-family: 楷体;line-height: 150%;font-size: 16px"><span style="font-family:楷体">阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。</span></span></span></strong></p><p><span style=";font-family:Calibri;font-size:14px">&nbsp;</span></p><p><br/></p><p><a href="https://account.materialw.com/buyerprotocol.html" target="_blank" style="color:#fc6940;text-decoration: underline;">《生材网平台服务协议（采购商类）》</a></p><p><a href="https://account.materialw.com/sellerprotocol.html" target="_blank" style="color:#fc6940;text-decoration: underline;">《生材网平台服务协议（供应商类）》</a></p><p><a href="https://www.materialw.com/about/private.html" target="_blank" style="color:#fc6940;text-decoration: underline;">《隐私声明》</a></p><p><br/></p><p style="text-align: center;"><a href="javascript:;" class="confirmAgreement confirmDisabled">同意协议<span>（10s）</span></a></p></div></div></div></div></div>';
                                                $(".cjy-bg,.cjy-poplayer").remove();
                                                $("body").eq(0).append(strHtml);
                                                var timer = null,
                                                    timeNum = 10;
                                                timer = setInterval(function () {
                                                    timeNum--;
                                                    $(".confirmAgreement").find("span").html("（" + timeNum + "s）");
                                                    if (timeNum <= 0) {
                                                        clearInterval(timer);
                                                        $(".confirmAgreement").removeClass("confirmDisabled");
                                                        $(".confirmAgreement").find("span").remove();
                                                    }
                                                }, 1000);
                                                $(".cjy-close").unbind().bind("click", function () {
                                                    window.location.href = config.accountPath + "quit.html";
                                                    return false;
                                                });
                                                $(".confirmAgreement").unbind().bind("click", function () {
                                                    if (!$(this).hasClass("confirmDisabled")) {
                                                        $.ajaxJSONP(config.accountPath + "isAgreementAjax", null, function (dataObj) {
                                                            if (dataObj.code == 2000) {
                                                                location.href = json.data.url;
                                                            } else {
                                                                $.msgTips({
                                                                    type: "warning",
                                                                    content: dataObj.data.msg
                                                                });
                                                            }
                                                        });
                                                    }
                                                    return false;
                                                });
                                            } else {
                                                $.msgTips({
                                                    type: "success",
                                                    content: json.data.msg,
                                                    callback: function () {
                                                        location.href = json.data.url;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    $(".err_area span").html(json.msg);
                                    $(".err_area").addClass("display-block");
                                }
                            });
                        });
                    }
                });
            },
            showPhoto: function (photoUrl) {
                var imgsize = {
                    width: 0,
                    height: 0
                };
                var image = new Image();
                image.src = photoUrl;
                image.onload = function () {//图片加载完成后执行
                    var _stemp = this;//将当前指针复制给新的变量，不然会导致变量共用
                    if (_stemp.width / _stemp.height > 1.36) {
                        imgsize.width = _stemp.width > 980 ? 980 : _stemp.width;
                        imgsize.height = (_stemp.height / _stemp.width) * imgsize.width;
                    }
                    else {
                        imgsize.height = _stemp.height > 720 ? 720 : _stemp.height;
                        imgsize.width = (_stemp.width / _stemp.height) * imgsize.height;
                    }
                    var showPhotoHtml = '';
                    if ($(".cjy-bg").length == 0) {
                        showPhotoHtml += '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>';
                    }
                    showPhotoHtml += '<div class="cjy-show-photo" style="left: ' + ($(window).outerWidth() - imgsize.width) / 2 + 'px;top: ' + ($(document).scrollTop() + ($(window).outerHeight() - imgsize.height) / 2) + 'px"><i class="cjy-photo-close iconfont icon-cha1"></i><div class="cjy-photo-inner"><div class="cjy-photo-area"><i class="iconfont icon-tupian"></i><img class="cjy-img" src="' + photoUrl + '" style="display: none;width: ' + imgsize.width + 'px;height: ' + imgsize.height + 'px;" /></div></div></div>';

                    $("body").eq(0).append(showPhotoHtml);
                    $(".cjy-img").off().on("load", function () {
                        $(".cjy-photo-area i").fadeOut(400, function () {
                            $(".cjy-photo-area i").remove();
                        });
                        $(".cjy-img").fadeIn(400);
                    });

                    $(".cjy-bg,.cjy-photo-close").off().on("click", function () {
                        var main = $(this);
                        $(".cjy-show-photo").fadeOut(400, function () {
                            $(".cjy-show-photo").remove();
                        });
                        if ($(".cjy-poplayer").length == 0) {
                            $(".cjy-bg").fadeOut(400, function () {
                                $(".cjy-bg").remove();
                            });
                        }
                    });
                };
            },
            memberDialog: function (options) {
                var settings = {
                    real_name: "",
                    company_name: "",
                    member_status: "",
                    role_id: ""
                };
                $.extend(settings, options || {});
                var strHtml = '<div class="sqhy-box"><div class="sqhy-bg"></div><div class="sqhy-inner"><p class="sqhy-head">Hello，' + settings.company_name + '，' + settings.real_name + '：</p><p class="sqhy-right"><strong>申请成为VIP会员</strong>将享有生材网<strong>独家集采信息</strong>的在线<strong>查看</strong>和<strong>参与报价</strong>权利哦~</p><div class="sqhy-description"><p><span class="sqhy-span"><i class="iconfont icon-qiandai"></i>VIP会员费用：</span><b>1.2万/年</b></p><p><span class="sqhy-span"><i class="iconfont icon-quanyi"></i>VIP会员权益：</span><b>申请成为生材网VIP会员后，将享有平台上海量独家招标的报名与投标权限。</b></p></div>';
                if (settings.member_status !== "") {
                    strHtml += '<p class="sqhy-foot">工作人员将在<strong>1-3个工作日</strong>内与你联系，并告知具体支付细节（<strong>027-82815329</strong>）</p><button class="cjy-notallow-btn">申请成为VIP会员</button><span style="margin-left: 20px;">您的申请已经成功提交！请耐心等待来电~</span></div></div>';
                } else {
                    // <p class="sqhy-xy"><input type="checkbox" name="" title="" class="sqhy_checkbox" />我已仔细阅读《<a href="javascript:;" target="_blank">生材网会员协议</a>》，并同意相关条款</p>
                    strHtml += '<p class="sqhy-foot">点击下方“申请成为VIP会员”按钮，递交申请，工作人员将在<strong>1-3个工作日</strong>内与你联系，并告知具体支付细节（<strong>027-82815329</strong>）</p><button class="sqhy-btn">申请成为VIP会员</button></div></div>';
                }
                $.dialog({
                    title: "申请VIP会员",
                    content: strHtml,
                    width: 866,
                    url: "",
                    confirm: {
                        show: false,
                        name: "确定"
                    },
                    cancel: {
                        show: false,
                        name: "取消"
                    },
                    button: {
                        show: false,
                        html: ""
                    },
                    callback: function () {
                        $(".sqhy-xy input").initCheckbox();
                        $(".sqhy-btn").off().on("click", function () {
                            var main = $(this);
                            $.ajaxJSONP(config.accountPath + 'addMember', {
                                role_id: settings.role_id
                            }, function (json) {
                                if (json.code == 2000) {
                                    if (json.hasOwnProperty("msg")) {
                                        $.msgTips({
                                            type: "success",
                                            content: json.msg
                                        });
                                        main.addClass("cjy-notallow-btn").after('<span style="margin-left: 20px;">您的申请已经成功提交！请耐心等待来电~</span>').removeClass("sqhy-btn");
                                        $(".sqhy-xy").remove();
                                        $(".sqhy-foot").html('工作人员将在<strong>1-3个工作日</strong>内与你联系，并告知具体支付细节（<strong>027-82813259</strong>）');
                                        setTimeout(function () {
                                            window.location.reload();
                                        }, 1000);
                                    }
                                } else {
                                    $.msgTips({
                                        type: "warning",
                                        content: json.msg
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    })(jQuery);

    //公共ajax方法
    (function ($) {
        $.extend({
            ajaxForJson: function ajaxForJson(requestUrl, requestData, successCallback, errorCallback, successPar) {
                // if (typeof (requestData) == "string") {
                //     var dataArr = requestData.split("&"), escapeArr = [];
                //     for (var i = 0; i < dataArr.length; i++) {
                //         var key = dataArr[i].split("=")[0],
                //             val = dataArr[i].split("=")[1];
                //         if (key != "editorValue") {
                //             val = libs.html2Escape(decodeURIComponent(val));
                //             val = encodeURIComponent(val);
                //         }
                //         escapeArr.push(key + "=" + val);
                //     }
                //     requestData = escapeArr.join("&");
                // }
                // else if (typeof (requestData) == "object") {
                //     for (var k in requestData) {
                //         requestData[k] = libs.html2Escape(requestData[k].toString());
                //     }
                // }
                $.ajax({
                    type: "POST",
                    url: requestUrl,
                    data: requestData,
                    // xhrFields: {
                    //     withCredentials: true
                    // },
                    // crossDomain: true,
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded",
                    success: function success(data) {
                        var dataObj = null;
                        try {
                            dataObj = eval('(' + data + ')');
                        } catch (ex) {
                            dataObj = data;
                        }
                        if (dataObj.data && dataObj.data.status == "not_login") {
                            //$.messageDialog({
                            //    title: "提示",
                            //    icon: "warning",
                            //    content: dataObj.msg,
                            //    time: 1000
                            //});
                            //setTimeout(function () {
                            //    window.location.href = dataObj.data;
                            //}, 1000);
                            $.loginDialog();
                        } else {
                            if (successCallback) {
                                successCallback(dataObj, successPar);
                            }
                        }
                    },
                    error: function error(err) {
                        if (errorCallback) {
                            errorCallback();
                        }
                    },
                    complete: function complete(XHR, TS) {
                        XHR = null;
                    }
                });
            },
            ajaxJSONP: function ajaxJSONP(requestUrl, requestData, callback, errorCallback, successPar) {
                $.ajax({
                    type: "get",
                    async: false,
                    url: requestUrl,
                    data: requestData,
                    // xhrFields: {
                    //    withCredentials: true
                    // },
                    // crossDomain: true,
                    dataType: "jsonp",
                    jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数吿(一般默认为:callback)
                    success: function success(json) {
                        if (json.data && json.data.status == "not_login") {
                            //$.messageDialog({
                            //    title: "提示",
                            //    icon: "warning",
                            //    content: dataObj.msg,
                            //    time: 1000
                            //});
                            //setTimeout(function () {
                            //    window.location.href = dataObj.data;
                            //}, 1000);
                            $.loginDialog();
                        } else {
                            if (callback) {
                                callback(json, successPar);
                            }
                        }
                    },
                    error: function error(err) {
                        err;
                    }
                });
            },
            cachedScript: function cachedScript(url, options) {
                var scriptsArray = new Array();
                //循环script标记数组
                for (var s in scriptsArray) {
                    //如果某个数组已经下载到了本地
                    if (scriptsArray[s] == url) {
                        return { //则返回一个对象字面量，其中的done之所以叫做done是为了与下面$.ajax中的done相对应
                            done: function done(method) {
                                if (typeof method == 'function') {
                                    //如果传入参数为一个方法
                                    method();
                                }
                            }
                        };
                    }
                }
                //这里是jquery官方提供类似getScript实现的方法，也就是说getScript其实也就是对ajax方法的一个拓展
                options = $.extend(options || {}, {
                    dataType: "script",
                    url: url,
                    cache: true //其实现在这缓存加与不加没多大区别
                });
                scriptsArray.push(url); //将url地址放入script标记数组中
                return $.ajax(options);
            }
        });
    })(jQuery);

    //ajax提交表单
    (function ($) {
        $.fn.ajaxForm = function (successCallback, errorCallback, successPar) {
            var requestUrl = $(this).parents("form").attr("action"),
                requestData = $(this).parents("form").serialize();

            $.ajaxForJson(requestUrl, requestData, successCallback, errorCallback, successPar);
        };
        //表单数据验证
        $.fn.requiredData = function () {
            var main = $(this);
            main.find("[required]").each(function () {
                var that = $(this);
                if ($.trim(that.val()) == "") {
                    that.initInput("error", "此项不能为空");
                    that.unbind().bind("blur", function () {
                        that.initInput();
                    });
                    return false;
                }
                var type = that.attr("cjy-required") || "";
                if (type == "number" && !libs.checkNumber(that.val())) {
                    that.initInput("error", "请输入正确的纯数字");
                    that.unbind().bind("blur", function () {
                        that.initInput();
                    });
                    return false;
                }
                else if (type == "money" && !libs.checkMoney(that.val())) {
                    that.initInput("error", "请输入两位小数的数字");
                    that.unbind().bind("blur", function () {
                        that.initInput();
                    });
                    return false;
                }
                else if (type == "weight" && !libs.checkWeight(that.val())) {
                    that.initInput("error", "请输入三位位小数的数字");
                    that.unbind().bind("blur", function () {
                        that.initInput();
                    });
                    return false;
                }
                else if (type == "mobile" && !libs.checkMobile(that.val())) {
                    that.initInput("error", "请输入正确的手机号");
                    that.unbind().bind("blur", function () {
                        that.initInput();
                    });
                    return false;
                }
                else if (type == "email" && !libs.checkEmail(that.val())) {
                    that.initInput("error", "请输入正确的电子邮箱");
                    that.unbind().bind("blur", function () {
                        that.initInput();
                    });
                    return false;
                }
                else if (type == "title" && $.trim(that.val().length < 2)) {
                    that.initInput("error", "输入内容过短");
                    that.unbind().bind("blur", function () {
                        that.initInput();
                    });
                    return false;
                }
            });
        };
    })(jQuery);

    //文件上上传jquery插件
    function getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }

    jQuery.extend({
        //handle error
        handleError: function handleError(s, xhr, status, e) {
            // If a local callback was specified, fire it
            if (s.error) s.error(xhr, status, e);
            // Fire the global callback
            if (s.global) jQuery.event.trigger("ajaxError", [xhr, s, e]);
        },
        createUploadIframe: function createUploadIframe(id, uri) {
            //create frame
            var frameId = 'jUploadFrame' + id;

            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ver = getInternetExplorerVersion();
                if (ver > 8.0) {
                    var io = document.createElement('iframe');
                    io.id = frameId;
                    io.name = frameId;
                } else if (ver <= 8.0) {
                    var io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
                    if (typeof uri == 'boolean') {
                        io.src = 'javascript:false';
                    } else if (typeof uri == 'string') {
                        io.src = "javascript:void((function(){document.open();document.domain='" + uri + "';document.close();})())";
                    }
                }
            } else {
                var io = document.createElement('iframe');
                io.id = frameId;
                io.name = frameId;
                if (typeof uri == 'string') {
                    io.src = "javascript:void((function(){document.open();document.domain='" + uri + "';document.close();})())";
                }
            }
            io.style.position = 'absolute';
            io.style.top = '-1000px';
            io.style.left = '-1000px';

            document.body.appendChild(io);

            return io;
        },
        createUploadForm: function createUploadForm(id, fileElementId, data) {
            //create form
            var formId = 'jUploadForm' + id;
            var fileId = 'jUploadFile' + id;
            var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
            var oldElement = $('#' + fileElementId);
            var newElement = $(oldElement).clone();
            $(oldElement).attr('id', fileId);
            $(oldElement).before(newElement);
            $(oldElement).appendTo(form);

            //增加文本参数的支持
            if (data) {
                for (var i in data) {
                    $('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
                }
            }

            //set attributes
            $(form).css('position', 'absolute');
            $(form).css('top', '-1200px');
            $(form).css('left', '-1200px');
            $(form).appendTo('body');
            return form;
        },

        ajaxFileUpload: function ajaxFileUpload(s) {
            // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
            s = jQuery.extend({}, jQuery.ajaxSettings, s);
            var id = new Date().getTime();
            var form = jQuery.createUploadForm(id, s.fileElementId, s.data);
            var io = jQuery.createUploadIframe(id, s.secureuri);
            var frameId = 'jUploadFrame' + id;
            var formId = 'jUploadForm' + id;
            // Watch for a new set of requests
            if (s.global && !jQuery.active++) {
                jQuery.event.trigger("ajaxStart");
            }
            var requestDone = false;
            // Create the request object
            var xml = {};
            if (s.global) jQuery.event.trigger("ajaxSend", [xml, s]);
            // Wait for a response to come back
            var uploadCallback = function uploadCallback(isTimeout) {
                var io = document.getElementById(frameId);
                try {
                    if (io.contentWindow) {
                        xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                        xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
                    } else if (io.contentDocument) {
                        xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                        xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                    }
                    try {
                        xml.responseText = $(xml.responseText).html();
                    } catch (e) {
                    }
                    //xml.responseText= xml.responseText.replace("<PRE>","").replace("</PRE>","").replace("<pre>","").replace("</pre>","");
                } catch (e) {
                    jQuery.handleError(s, xml, null, e);
                }
                if (xml || isTimeout == "timeout") {
                    requestDone = true;
                    var status;
                    try {
                        status = isTimeout != "timeout" ? "success" : "error";
                        // Make sure that the request was successful or notmodified
                        if (status != "error") {
                            // process the data (runs the xml through httpData regardless of callback)
                            var data = jQuery.uploadHttpData(xml, s.dataType);
                            // If a local callback was specified, fire it and pass it the data
                            if (s.success) s.success(data, status);

                            // Fire the global callback
                            if (s.global) jQuery.event.trigger("ajaxSuccess", [xml, s]);
                        } else jQuery.handleError(s, xml, status);
                    } catch (e) {
                        status = "error";
                        jQuery.handleError(s, xml, status, e);
                    }

                    // The request was completed
                    if (s.global) jQuery.event.trigger("ajaxComplete", [xml, s]);

                    // Handle the global AJAX counter
                    if (s.global && !--jQuery.active) jQuery.event.trigger("ajaxStop");

                    // Process result
                    if (s.complete) s.complete(xml, status);

                    jQuery(io).unbind();

                    setTimeout(function () {
                        try {
                            $(io).remove();
                            $(form).remove();
                        } catch (e) {
                            jQuery.handleError(s, xml, null, e);
                        }
                    }, 100);

                    xml = null;
                }
            };
            // Timeout checker
            if (s.timeout > 0) {
                setTimeout(function () {
                    // Check to see if the request is still happening
                    if (!requestDone) uploadCallback("timeout");
                }, s.timeout);
            }
            try {
                // var io = $('#' + frameId);
                var form = $('#' + formId);
                $(form).attr('action', s.url);
                $(form).attr('method', 'POST');
                $(form).attr('target', frameId);
                if (form.encoding) {
                    form.encoding = 'multipart/form-data';
                } else {
                    form.enctype = 'multipart/form-data';
                }
                $(form).submit();
            } catch (e) {
                jQuery.handleError(s, xml, null, e);
            }
            if (window.attachEvent) {
                document.getElementById(frameId).attachEvent('onload', uploadCallback);
            } else {
                document.getElementById(frameId).addEventListener('load', uploadCallback, false);
            }
            return {
                abort: function abort() {
                }
            };
        },

        uploadHttpData: function uploadHttpData(r, type) {
            var data = type == "xml" ? r.responseXML : r.responseText;
            // If the type is "script", eval it in global context
            if (type == "script") jQuery.globalEval(data);
            // Get the JavaScript object, if JSON is used.
            if (type == "json")
                //eval("data = \" "+data+" \" ");
                eval("data = " + data);
            // evaluate scripts within html
            if (type == "html") jQuery("<div>").html(data).evalScripts();
            //alert($('param', data).each(function(){alert($(this).attr('value'));}));
            return data;
        }
    });

    //日历控件
    (function ($) {
        var document = window.document,
            _box,
            addzero = /\b(\w)\b/g,
            _ie = !!window.ActiveXObject,
            _ie6 = _ie && !window.XMLHttpRequest,
            _$window = $(window),
            expando = 'JCA' + new Date().getTime(),
            _path = function (script, i) {
                var l = script.length,
                    path;

                for (; i < l; i++) {
                    path = !!document.querySelector ? script[i].src : script[i].getAttribute('src', 4);

                    if (path.substr(path.lastIndexOf('/')).indexOf('lhgcalendar') !== -1) break;
                }

                return path.substr(0, path.lastIndexOf('/') + 1);
            }(document.getElementsByTagName('script'), 0),
            iframeTpl = _ie6 ? '<iframe id="lhgcal_frm" hideFocus="true" ' + 'frameborder="0" src="about:blank" style="position:absolute;' + 'z-index:-1;width:100%;top:0px;left:0px;filter:' + 'progid:DXImageTransform.Microsoft.Alpha(opacity=0)"><\/iframe>' : '',
            calendarTpl = '<table class="lcui_border" border="0" cellspacing="0" cellpadding="0">' + '<tbody>' + '<tr>' + '<td class="lcui_lt"></td>' + '<td class="lcui_t"></td>' + '<td class="lcui_rt"></td>' + '</tr>' + '<tr>' + '<td class="lcui_l"></td>' + '<td>' + '<div class="lcui_head">' + '<table width="100%" cellspacing="0" cellpadding="0" border="0">' + '<tr>' + '<td width="27"><a class="cui_pm" href="javascript:void(0);"><i class="icon_arrLeft"></i></a></td>' + '<td width="40"><input class="cui_im" maxlength="4" value=""/>月</td>' + '<td width="32"><a class="cui_nm" href="javascript:void(0);"><i class="icon_arrRight"></i></a></td>' + '<td width="27"><a class="cui_py" href="javascript:void(0);"><i class="icon_arrLeft"></i></a></td>' + '<td width="60"><input class="cui_iy" maxlength="4" value=""/>年</td>' + '<td width="22"><a class="cui_ny" href="javascript:void(0);"><i class="icon_arrRight"></i></a></td>' + '</tr>' + '</table>' + '<div class="cui_ymlist" style="display:none;">' + '<table width="100%" cellspacing="1" cellpadding="0" border="0">' + '<thead class="cui_ybar"><tr>' + '<td><a class="cui_pybar" href="javascript:void(0);">«</a></td>' + '<td><a class="cui_cybar" href="javascript:void(0);">\xd7</a></td>' + '<td><a class="cui_nybar" href="javascript:void(0);">»</a></td>' + '</tr></thead>' + '<tbody class="cui_lbox">' + '</tbody>' + '</table>' + '</div>' + '</div>' + '<div class="lcui_body">' + '<table cellspacing="0" cellpadding="0" border="0">' + '<thead><tr>' + '<td>\u65E5</td><td>\u4E00</td><td>\u4E8C</td><td>\u4E09</td><td>\u56DB</td><td>\u4E94</td><td>\u516D</td>' + '</tr></thead>' + '<tbody class="cui_db">' + '</tbody>' + '</table>' + '</div>' + '<div class="cui_foot">' + '<table width="100%" cellspacing="0" cellpadding="0" border="0">' + '<tr>' + '<td align="center" class="lcui_today"><a class="cui_tbtn" href="javascript:void(0);">\u4ECA\u5929</a></td>' + '<td align="center" class="lcui_time"><input class="cui_hour" maxlength="2"/>:<input class="cui_minute" maxlength="2"/>:<input class="cui_second" maxlength="2"/></td>' + '<td align="center" class="lcui_empty"><a class="cui_dbtn" href="javascript:void(0);">\u6E05\u7A7A</a></td>' + '</tr>' + '</table>' + '</div>' + '</td>' + '<td class="lcui_r"></td>' + '</tr>' + '<tr>' + '<td class="lcui_lb"></td>' + '<td class="lcui_b"></td>' + '<td class="lcui_rb"></td>' + '</tr>' + '</tbody>' + '</table>' + iframeTpl;

        /*! 开启IE6 CSS背景图片缓存 */
        try {
            document.execCommand('BackgroundImageCache', false, true);
        } catch (e) {
        }

        function isDigit(ev) {
            var iCode = ev.keyCode || ev.charCode;

            return iCode >= 48 && iCode <= 57 || // Numbers
                iCode >= 37 && iCode <= 40 // Arrows
                || iCode == 8 // Backspace
                || iCode == 46 // Delete
                ;
        }

        function dateFormat(format) {
            var that = this,
                o = {
                    'M+': that.getMonth() + 1,
                    'd+': that.getDate(),
                    'h+': that.getHours() % 12 == 0 ? 12 : that.getHours() % 12,
                    'H+': that.getHours(),
                    'm+': that.getMinutes(),

                    's+': that.getSeconds(),
                    'q+': Math.floor((that.getMonth() + 3) / 3),
                    'w': '0123456'.indexOf(that.getDay()),
                    'S': that.getMilliseconds()
                };

            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (that.getFullYear() + '').substr(4 - RegExp.$1.length));

            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }

            return format;
        }

        function getDate(string, format) {
            var regexp,
                tmpnow = new Date();

            /** year : /yyyy/ */
            var y4 = '([0-9]{4})',


                /** year : /yy/ */
                y2 = '([0-9]{2})',


                /** index year */
                yi = -1,


                /** month : /MM/ */
                M2 = '(0[1-9]|1[0-2])',


                /** month : /M/ */
                M1 = '([1-9]|1[0-2])',


                /** index month */
                Mi = -1,


                /** day : /dd/ */
                d2 = '(0[1-9]|[1-2][0-9]|30|31)',


                /** day : /d/ */
                d1 = '([1-9]|[1-2][0-9]|30|31)',


                /** index day */
                di = -1,


                /** hour : /HH/ */
                H2 = '([0-1][0-9]|20|21|22|23)',


                /** hour : /H/ */
                H1 = '([0-9]|1[0-9]|20|21|22|23)',


                /** index hour */
                Hi = -1,


                /** minute : /mm/ */
                m2 = '([0-5][0-9])',


                /** minute : /m/ */
                m1 = '([0-9]|[1-5][0-9])',


                /** index minute */
                mi = -1,


                /** second : /ss/ */
                s2 = '([0-5][0-9])',


                /** second : /s/ */
                s1 = '([0-9]|[1-5][0-9])',


                /** index month */
                si = -1;

            if (validDate(string, format)) {
                var val = regexp.exec(string),
                    reDate,
                    index = getIndex(format),
                    year = index[0] >= 0 ? val[index[0] + 1] : tmpnow.getFullYear(),
                    month = index[1] >= 0 ? val[index[1] + 1] - 1 : tmpnow.getMonth(),
                    day = index[2] >= 0 ? val[index[2] + 1] : tmpnow.getDate(),
                    hour = index[3] >= 0 ? val[index[3] + 1] : tmpnow.getHours(),
                    minute = index[4] >= 0 ? val[index[4] + 1] : tmpnow.getMinutes(),
                    second = index[5] >= 0 ? val[index[5] + 1] : tmpnow.getSeconds(),
                    reDate = new Date(year, month, day, hour, minute, second);

                if (reDate.getDate() == day) return reDate; else return tmpnow;
            } else return tmpnow;

            function validDate(string, format) {

                var sting = $.trim(string);
                if (string === '') return;

                format = format.replace(/yyyy/, y4).replace(/yy/, y2).replace(/MM/, M2).replace(/M/, M1).replace(/dd/, d2).replace(/d/, d1).replace(/HH/, H2).replace(/H/, H1).replace(/mm/, m2).replace(/m/, m1).replace(/ss/, s2).replace(/s/, s1);

                format = new RegExp('^' + format + '$');
                regexp = format;

                return format.test(string);
            }

            function getIndex(format) {
                var ia = [],
                    i = 0,
                    ia2;

                yi = format.indexOf('yyyy');
                if (yi < 0) yi = format.indexOf('yy');
                if (yi >= 0) {
                    ia[i] = yi;
                    i++;
                }

                Mi = format.indexOf('MM');
                if (Mi < 0) Mi = format.indexOf('M');
                if (Mi >= 0) {
                    ia[i] = Mi;
                    i++;
                }

                di = format.indexOf('dd');
                if (di < 0) di = format.indexOf('d');
                if (di >= 0) {
                    ia[i] = di;
                    i++;
                }

                Hi = format.indexOf('HH');
                if (Hi < 0) Hi = format.indexOf('H');
                if (Hi >= 0) {
                    ia[i] = Hi;
                    i++;
                }

                mi = format.indexOf('mm');
                if (mi < 0) mi = format.indexOf('m');
                if (mi >= 0) {
                    ia[i] = mi;
                    i++;
                }

                si = format.indexOf('ss');
                if (si < 0) si = format.indexOf('s');
                if (si >= 0) {
                    ia[i] = si;
                    i++;
                }

                ia2 = [yi, Mi, di, Hi, mi, si];

                for (i = 0; i < ia.length - 1; i++) {
                    for (var j = 0; j < ia.length - 1 - i; j++) {
                        if (ia[j] > ia[j + 1]) {
                            var temp = ia[j];
                            ia[j] = ia[j + 1];
                            ia[j + 1] = temp;
                        }
                    }
                }

                for (i = 0; i < ia.length; i++) {
                    for (var j = 0; j < ia2.length; j++) {
                        if (ia[i] == ia2[j]) ia2[j] = i;
                    }
                }

                return ia2;
            }
        }

        function convertDate(date, format, day) {
            var tmpnow = new Date();

            if (/%/.test(date)) {
                day = day || 0;
                date = date.replace(/%y/, tmpnow.getFullYear()).replace(/%M/, tmpnow.getMonth() + 1).replace(/%d/, tmpnow.getDate() + day).replace(/%H/, tmpnow.getHours()).replace(/%m/, tmpnow.getMinutes()).replace(/%s/, tmpnow.getSeconds()).replace(addzero, '0$1');
            } else if (/^#[\w-]+$/.test(date)) {
                date = $.trim($(date)[0].value);

                if (date.length > 0 && format) date = dateFormat.call(getDate(date, format), 'yyyy-MM-dd');
            }

            return date;
        }

        /*!--------------------------------------------------------------*/

        var lhgcalendar = function lhgcalendar(config) {
            $("table.lcui_border").parent().css("display", "none");
            config = config || {};

            var setting = lhgcalendar.setting;

            for (var i in setting) {
                if (config[i] === undefined) config[i] = setting[i];
            }

            return _box ? _box._init(config) : new lhgcalendar.fn._init(config);
        };

        lhgcalendar.fn = lhgcalendar.prototype = {
            constructor: lhgcalendar,

            _init: function _init(config) {
                var that = this,
                    DOM,
                    evt = that._getEvent(that),
                    inpVal,
                    date;

                that.config = config;

                that.DOM = DOM = that.DOM || that._getDOM();
                that.evObj = evt.srcElement || evt.target;
                that.inpE = config.id ? $(config.id)[0] : that.evObj;

                if (!config.btnBar) DOM.foot[0].style.display = 'none'; else DOM.foot[0].style.display = '';

                if (config.minDate) config.minDate = convertDate(config.minDate, config.targetFormat, config.noToday ? 1 : 0);

                if (config.maxDate) config.maxDate = convertDate(config.maxDate, config.targetFormat, config.noToday ? -1 : 0);

                inpVal = $.trim(that.inpE.value);

                if (inpVal.length > 0) date = getDate(inpVal, config.format); else date = new Date();

                DOM.hour[0].value = (date.getHours() + '').replace(addzero, '0$1');
                DOM.minute[0].value = (date.getMinutes() + '').replace(addzero, '0$1');
                DOM.second[0].value = (date.getSeconds() + '').replace(addzero, '0$1');

                $('input', DOM.foot[0]).attr({ disabled: config.format.indexOf('H') >= 0 ? false : true });

                that._draw(date).show()._offset(that.evObj);

                _ie6 && $('#lhgcal_frm').css({ height: DOM.wrap[0].offsetHeight + 'px' });

                if (!_box) {
                    DOM.wrap[0].style.width = DOM.wrap[0].offsetWidth + 'px';
                    that._addEvent();
                    _box = that;
                }

                return that;
            },

            _draw: function _draw(date, day) {
                var that = this,
                    DOM = that.DOM,
                    firstDay,
                    befMonth,
                    curMonth,
                    arrDate = [],
                    inpYear,
                    inpMonth,
                    opt = that.config,
                    frag,
                    row,
                    cell,
                    n = 0,
                    curDateStr;

                that.year = inpYear = date.getFullYear();
                that.month = inpMonth = date.getMonth() + 1;
                that.day = day || date.getDate();

                DOM.iy[0].value = inpYear;
                DOM.im[0].value = inpMonth;

                firstDay = new Date(inpYear, inpMonth - 1, 1).getDay();
                befMonth = new Date(inpYear, inpMonth - 1, 0).getDate();
                curMonth = new Date(inpYear, inpMonth, 0).getDate();

                for (var i = 0; i < firstDay; i++) {
                    arrDate.push(befMonth);
                    befMonth--;
                }

                arrDate.reverse();

                for (var i = 1; i <= curMonth; i++) {
                    arrDate.push(i);
                }
                for (var i = 1; i <= 42 - curMonth - firstDay; i++) {
                    arrDate.push(i);
                }
                frag = document.createDocumentFragment();

                for (var i = 0; i < 6; i++) {
                    row = document.createElement('tr');
                    for (var j = 0; j < 7; j++) {
                        cell = document.createElement('td');
                        curDateStr = (inpYear + '-' + inpMonth + '-' + arrDate[n]).replace(addzero, '0$1');

                        if (n < firstDay || n >= curMonth + firstDay || opt.minDate && opt.minDate > curDateStr || opt.maxDate && opt.maxDate < curDateStr || opt.disWeek && opt.disWeek.indexOf(j) >= 0) {
                            that._setCell(cell, arrDate[n]);
                        } else if (opt.disDate) {
                            for (var m = 0, l = opt.disDate.length; m < l; m++) {
                                if (/%/.test(opt.disDate[m])) opt.disDate[m] = convertDate(opt.disDate[m]);

                                var regex = new RegExp(opt.disDate[m]),
                                    tmpre = opt.enDate ? !regex.test(curDateStr) : regex.test(curDateStr);

                                if (tmpre) break;
                            }

                            if (tmpre) that._setCell(cell, arrDate[n]); else that._setCell(cell, arrDate[n], true);
                        } else that._setCell(cell, arrDate[n], true);

                        row.appendChild(cell);
                        n++;
                    }
                    frag.appendChild(row);
                }

                while (DOM.db[0].firstChild) {
                    DOM.db[0].removeChild(DOM.db[0].firstChild);
                }
                DOM.db[0].appendChild(frag);

                return that;
            },

            _setCell: function _setCell(cell, num, enabled) {
                if (enabled) {
                    cell.innerHTML = '<a href="javascript:void(0);">' + num + '</a>';
                    cell.firstChild[expando + 'D'] = num + '';

                    if (num === this.day) $(cell).addClass('cui_today');
                } else cell.innerHTML = num + '';
            },

            _drawList: function _drawList(val, arr) {
                var DOM = this.DOM,
                    row,
                    cell,
                    frag = document.createDocumentFragment();

                for (var i = 0; i < 4; i++) {
                    row = document.createElement('tr');
                    for (var j = 0; j < 3; j++) {
                        cell = document.createElement('td');
                        cell.innerHTML = '<a href="javascript:void(0);">' + (arr ? arr[val] : val) + '</a>';
                        row.appendChild(cell);

                        if (arr) cell.firstChild[expando + 'M'] = val; else cell.firstChild[expando + 'Y'] = val;

                        val++;
                    }
                    frag.appendChild(row);
                }

                while (DOM.lbox[0].firstChild) {
                    DOM.lbox[0].removeChild(DOM.lbox[0].firstChild);
                }
                DOM.lbox[0].appendChild(frag);

                return this;
            },

            _showList: function _showList() {
                this.DOM.ymlist[0].style.display = 'block';
            },

            _hideList: function _hideList() {
                this.DOM.ymlist[0].style.display = 'none';
            },

            _offset: function _offset() {
                var that = this,
                    DOM = that.DOM,
                    ltop,
                    inpP = $(that.evObj).offset(),
                    inpY = inpP.top + that.evObj.offsetHeight,
                    ww = _$window.width(),
                    wh = _$window.height(),
                    dl = _$window.scrollLeft(),
                    dt = _$window.scrollTop(),
                    cw = DOM.wrap[0].offsetWidth,
                    ch = DOM.wrap[0].offsetHeight;

                if (inpY + ch > wh + dt) inpY = inpP.top - ch - 2;

                if (inpP.left + cw > ww + dl) inpP.left -= cw;

                DOM.wrap.css({ left: inpP.left + 'px', top: inpY + 'px' });

                ltop = DOM.im.offset().top + DOM.im[0].offsetHeight;
                DOM.ymlist[0].style.top = ltop - inpY + 'px';

                return that;
            },

            _getDOM: function _getDOM() {
                var wrap = document.createElement('div');

                wrap.style.cssText = 'position:absolute;display:none;z-index:' + this.config.zIndex + ';width:222px;';
                wrap.innerHTML = calendarTpl;

                var name,
                    i = 0,
                    DOM = { wrap: $(wrap) },
                    els = wrap.getElementsByTagName('*'),
                    len = els.length;

                for (; i < len; i++) {
                    name = els[i].className.split('cui_')[1];
                    if (name) DOM[name] = $(els[i]);
                }

                document.body.appendChild(wrap);

                return DOM;
            },

            _getEvent: function _getEvent(that) {
                //if (_ie) return window.event;
                //
                //var func = this._getEvent.caller;
                //
                //while (func != null) {
                //    var arg = func.arguments[0];
                //    if (arg && (arg + '').indexOf('Event') >= 0) return arg;
                //    func = func.caller;
                //}

                if (window.event) {
                    return window.event;
                }
                var f = arguments.callee.caller;
                do {
                    var e = f.arguments[0];
                    if (e && (e.constructor === Event || e.constructor === MouseEvent || e.constructor === KeyboardEvent)) {
                        return e;
                    }
                } while (f = f.caller);

                return null;
            },

            _setDate: function _setDate(day) {
                day = parseInt(day, 10);

                var that = this,
                    opt = that.config,
                    DOM = that.DOM,
                    tmpDate = new Date(that.year, that.month - 1, day);

                if (opt.format.indexOf('H') >= 0) {
                    var hourVal = parseInt(DOM.hour[0].value, 10),
                        minuteVal = parseInt(DOM.minute[0].value, 10),
                        secondVal = parseInt(DOM.second[0].value, 10);

                    tmpDate = new Date(that.year, that.month - 1, day, hourVal, minuteVal, secondVal);
                }

                that.day = day;

                opt.onSetDate && opt.onSetDate.call(that);
                that.inpE.value = dateFormat.call(tmpDate, opt.format);

                if (opt.real) {
                    var realFormat = opt.format.indexOf('H') >= 0 ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
                    $(opt.real)[0].value = dateFormat.call(tmpDate, realFormat);
                }

                that.hide();
            },

            _addEvent: function _addEvent() {
                var that = this,
                    DOM = that.DOM;

                DOM.wrap.bind('click', function (evt) {
                    var target = evt.target;

                    if (target[expando + 'D']) that._setDate(target[expando + 'D']); else if (target === DOM.pm[0] || target.parentNode === DOM.pm[0]) that._draw(new Date(that.year, that.month - 2), that.day); else if (target === DOM.nm[0] || target.parentNode === DOM.nm[0]) that._draw(new Date(that.year, that.month), that.day); else if (target === DOM.py[0] || target.parentNode === DOM.py[0]) that._draw(new Date(that.year - 1, that.month - 1), that.day); else if (target === DOM.ny[0] || target.parentNode === DOM.ny[0]) that._draw(new Date(that.year + 1, that.month - 1), that.day); else if (target === DOM.tbtn[0]) {
                        var today = new Date();
                        that.year = today.getFullYear();
                        that.month = today.getMonth() + 1;
                        that.day = today.getDate();
                        that._setDate(that.day);
                    } else if (target === DOM.dbtn[0]) {
                        var config = that.config;

                        if (config.onSetDate) {
                            that.year = '';
                            that.month = '';
                            that.day = '';
                            config.onSetDate.call(that);
                        }

                        that.inpE.value = '';
                        that.hide();

                        if (config.real) $(config.real)[0].value = '';
                    } else if (target === DOM.im[0]) {
                        var marr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                            x = DOM.im.offset().left - parseInt(DOM.wrap[0].style.left, 10);

                        DOM.im[0].select();
                        DOM.ybar[0].style.display = 'none';
                        DOM.ymlist[0].style.left = x + 'px';
                        that._drawList(0, marr)._showList();

                        return false;
                    } else if (target === DOM.iy[0]) {
                        var x = DOM.iy.offset().left - parseInt(DOM.wrap[0].style.left, 10);

                        DOM.iy[0].select();
                        DOM.ybar[0].style.display = '';
                        DOM.ymlist[0].style.left = x + 'px';
                        that._drawList(that.year - 4)._showList();

                        return false;
                    } else {
                        var today = new Date(),
                            m = DOM.im[0].value || today.getMonth() + 1,
                            y = DOM.iy[0].value || today.getFullYear();
                        that._draw(new Date(y, m - 1), that.day);
                    }

                    that._hideList();

                    return false;
                });

                DOM.ymlist.bind('click', function (evt) {
                    var target = evt.target;
                    if (target[expando + 'M'] >= 0) {
                        DOM.im[0].value = target[expando + 'M'] + 1;
                        that._draw(new Date(that.year, target[expando + 'M']), that.day)._hideList();
                    } else if (target[expando + 'Y']) {
                        DOM.iy[0].value = target[expando + 'Y'];
                        that._draw(new Date(target[expando + 'Y'], that.month - 1), that.day)._hideList();
                    } else if (target === DOM.pybar[0]) {
                        var p = $('a', DOM.lbox[0])[0][expando + 'Y'];
                        that._drawList(p - 12);
                    } else if (target === DOM.nybar[0]) {
                        var p = $('a', DOM.lbox[0])[0][expando + 'Y'];
                        that._drawList(p + 12);
                    } else if (target === DOM.cybar[0]) that._hideList();

                    return false;
                });

                DOM.im.bind('keypress', isDigit);
                DOM.iy.bind('keypress', isDigit);
                DOM.hour.bind('keypress', isDigit);
                DOM.minute.bind('keypress', isDigit);
                DOM.second.bind('keypress', isDigit);

                $(document).bind('click', function (evt) {
                    if (evt.target !== that.evObj) that.hide()._hideList();
                });
            },

            show: function show() {
                this.DOM.wrap[0].style.display = 'block';
                return this;
            },

            hide: function hide() {
                this.DOM.wrap[0].style.display = 'none';
                return this;
            },

            getDate: function getDate(type) {
                var that = this,
                    DOM = that.DOM,
                    h = parseInt(DOM.hour[0].value, 10),
                    m = parseInt(DOM.minute[0].value, 10),
                    s = parseInt(DOM.second[0].value, 10);

                if (that.year === '' && that.month === '' && that.day === '') return '';

                switch (type) {
                    case 'y':
                        return that.year;
                    case 'M':
                        return that.month;
                    case 'd':
                        return that.day;
                    case 'H':
                        return h;
                    case 'm':
                        return m;
                    case 's':
                        return s;
                    case 'date':
                        return that.year + '-' + that.month + '-' + that.day;
                    case 'dateTime':
                        return that.year + '-' + that.month + '-' + that.day + ' ' + h + ':' + m + ':' + s;
                }
            }
        };

        lhgcalendar.fn._init.prototype = lhgcalendar.fn;

        lhgcalendar.formatDate = function (date, format) {
            return dateFormat.call(date, format);
        };

        lhgcalendar.setting = {
            id: null,
            format: 'yyyy-MM-dd',
            minDate: null,
            maxDate: null,
            btnBar: true,
            targetFormat: null,
            disWeek: null,
            onSetDate: null,
            real: null,
            disDate: null,
            enDate: false,
            zIndex: 1978,
            noToday: false,
            linkageObj: null
        };

        $.fn.calendar = function (config, event) {
            event = event || 'click';

            this.bind(event, function () {
                lhgcalendar(config);
                return false;
            });

            return this;
        };

        window.lhgcalendar = $.calendar = lhgcalendar;
    })(jQuery);

    //打印插件
    (function ($) {
        var opt;

        $.fn.jqprint = function (options) {
            opt = $.extend({}, $.fn.jqprint.defaults, options);

            var $element = this instanceof jQuery ? this : $(this);

            var $iframe = $("<iframe  />");

            if (!opt.debug) {
                $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" });
            }

            $iframe.appendTo("body");
            var doc = $iframe[0].contentWindow.document;

            if (opt.importCSS) {
                if ($("link[media=print]").length > 0) {
                    $("link[media=print]").each(function () {
                        doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
                    });
                } else {
                    $("link").each(function () {
                        doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
                    });
                }
            }

            if (opt.printContainer) {
                doc.write($element.outer());
            } else {
                $element.each(function () {
                    doc.write($(this).html());
                });
            }

            doc.close();

            $iframe[0].contentWindow.focus();
            setTimeout(function () {
                $iframe[0].contentWindow.print();
            }, 1000);
        };

        $.fn.jqprint.defaults = {
            debug: false,
            importCSS: true,
            printContainer: true,
            operaSupport: true
        };
        jQuery.fn.outer = function () {
            return $($('<div></div>').html(this.clone())).html();
        };
    })(jQuery);

    //图片轮播公共方法
    $.fn.initPicPlayer = function () {
        var main = $(this);
        var btns = main.find(".js_pagination a");//滚动按钮
        var container = main.find(".js_slidesContainer");//轮播滚动的容器
        var left = main.find(".js_left");
        var right = main.find(".js_right");
        var imgWidth = main.width()//图片滚动宽度
        var iconClass = "active";//按钮选中样式
        var selectedBtn;//选中的按钿
        var playID;//自动播放的id
        var selectedIndex;//选中图片的索引

        //设置容器和图片宽度
        //container.css("width", imgWidth * btns.length + "px");
        //container.find("a").css("width", imgWidth + "px");
        container.find(".js_slidesCell").eq(0).css("display", "block");

        if (container.find(".js_slidesCell").length <= 1) {
            main.find(".js_left").remove();
            main.find(".js_right").remove();
        }

        for (var i = 0; i < btns.length; i++) {
            (function () {
                var index = i;
                btns[i].onclick = function () {
                    if (selectedBtn == this) {
                        return;
                    }
                    setSelectedItem(index);
                    return main;
                };
            })();
        }
        setSelectedItem(0);

        function setSelectedItem(index) {
            selectedIndex = index;
            clearInterval(playID);
            if (container.find(".js_slidesCell").is(":animated")) {
                return;
            }
            container.find(".js_slidesCell").css({ "zIndex": 0 })
            container.find(".js_slidesCell").eq(index).css("zIndex", 1).fadeIn(500, function () {
                container.find(".js_slidesCell").each(function (n) {
                    if (n != index) {
                        $(this).css({ "display": "none" })
                    }
                });
                //自动播放方法
                playID = setTimeout(function () {
                    if (btns.length == 1) { //如果只有一张图片 则不滚动。
                        return;
                    }
                    var index = selectedIndex + 1;
                    if (index >= btns.length) {
                        index = 0;
                    }
                    setSelectedItem(index);
                }, 5000);
            });

            if (selectedBtn) {
                $(selectedBtn).removeClass(iconClass);
            }
            selectedBtn = btns[parseInt(index)];
            btns.removeClass(iconClass);
            var that = btns[selectedIndex];
            $(that).addClass(iconClass);
        }

        main.bind({
            mouseover: function () {
                left.css("display", "block");
                right.css("display", "block");
                clearInterval(playID);
            },
            mouseout: function () {
                left.css("display", "none");
                right.css("display", "none");
                container.find(".js_slidesCell").each(function (n) {
                    if ($(this).css("display") == "block") {
                        setSelectedItem(n);
                    }
                });
            }
        });
        $(".js_slides").on("click", ".js_left", function () {
            if (container.is(":animated")) {
                return;
            }
            if (selectedIndex == 0) {
                selectedIndex = btns.length;
            }
            setSelectedItem(selectedIndex - 1);
            return false;
        });
        $(".js_slides").on("click", ".js_right", function () {
            if (container.is(":animated")) {
                return;
            }
            if (selectedIndex == btns.length - 1) {
                selectedIndex = -1;
            }
            setSelectedItem(parseInt(selectedIndex + 1));
            return false;
        });
        return main;
    };

    //分页ajax加载
    $.fn.ajxForPage = function (reqUrl, reqData, callback) {
        $(this).each(function () {
            var main = $(this);
            var curPage = 1;
            var size = main.attr("size"), total = main.attr("total"), count = Math.ceil(total / size);

            function getData() {
                var postData = $.extend({ p: curPage }, reqData || {});
                var parentDom = main.parent(), pageList = null;
                while (parentDom.find(".page_list").length <= 0) {
                    parentDom = parentDom.parent();
                }
                pageList = parentDom.find(".page_list");

                if (pageList.prop('tagName').toLowerCase() == "tbody") {
                    var col = pageList.parent().find("thead").find("tr th").length;
                    pageList.css("text-align", "center");
                    pageList.html('<tr><td colspan="' + col + '"><div class="page_loading"></div></td></tr>');
                }
                else {
                    pageList.css("text-align", "center").html('<div class="page_loading"></div>');
                }

                $.ajaxForJson(reqUrl, postData, function (dataObj) {
                    if (dataObj.code == 2000) {

                        if (dataObj.data.count == 0 || dataObj.data.data == "") {
                            if (pageList.prop('tagName').toLowerCase() == "tbody") {
                                var col = pageList.parent().find("thead").find("tr th").length;
                                pageList.css("text-align", "center");
                                pageList.html('<tr><td colspan="' + col + '"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr>');
                            }
                            else {
                                pageList.css("text-align", "center");
                                pageList.html('<div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p>');
                            }
                        }
                        else {
                            pageList.removeAttr("style").html(dataObj.data.data);
                        }
                        total = dataObj.data.count;
                        count = Math.ceil(total / size);
                        refreshNav();

                        // if ($(".cjy-poplayer").length <= 0) {
                        //     libs.goTop($(".page_list").offset().top);
                        // }

                        if (callback) {
                            callback(dataObj.data);
                        }
                    }
                });
            }

            function refreshNav() {//刷新分页样式
                var pageHTML = '<div class="page_container"><div class="page_container_nav"><a href="javascript:;" class="page_up">上一页</a><span class="pageNumCon">';
                pageHTML += '</span><a href="javascript:;" class="page_down">下一页</a>';
                pageHTML += '<span>跳转到：</span><span class="page_skip"><input type="text" class="page_count"></span><a href="javascript:;" class="page_confirm">GO</a></div></div>';
                main.html(pageHTML);

                if (count <= 1) {
                    main.find(".page_container").hide();
                }

                var navHTML = '';
                if (count > 5) {
                    if ((count - curPage) > 3) {
                        var sPage = curPage > 1 ? curPage - 1 : curPage;
                        for (var i = sPage; i <= sPage + 2; i++) {
                            var cur = i == curPage ? "page_cur" : "";
                            navHTML += '<a href="javascript:;" class="page_num ' + cur + '">' + i + '</a>';
                        }
                        navHTML += '<span class="page_elip">...</span>';
                        navHTML += '<a href="javascript:;" class="page_num">' + (count - 1) + '</a><a href="javascript:;" class="page_num">' + count + '</a>';
                    }
                    else {
                        var sPage = count - 4;
                        for (var i = sPage; i <= count; i++) {
                            var cur = i == curPage ? "page_cur" : "";
                            navHTML += '<a href="javascript:;" class="page_num ' + cur + '">' + i + '</a>';
                        }
                    }
                    main.find(".pageNumCon").html(navHTML);
                }
                else {
                    for (var i = 1; i <= count; i++) {
                        var cur = i == curPage ? "page_cur" : "";
                        navHTML += '<a href="javascript:;" class="page_num ' + cur + '">' + i + '</a>';
                    }
                    main.find(".pageNumCon").html(navHTML);
                }

                if (curPage <= 1) {
                    main.find(".page_up").addClass("page_negative");
                }
                else {
                    main.find(".page_up").removeClass("page_negative");
                }

                if (curPage >= count) {
                    main.find(".page_down").addClass("page_negative");
                }
                else {
                    main.find(".page_down").removeClass("page_negative");
                }


                //点击页数事件
                main.find("a.page_num").unbind().bind("click", function () {
                    var _main = $(this);
                    if (!_main.hasClass("page_cur")) {
                        curPage = parseInt(_main.html());
                        getData();
                        return false;
                    }
                    return false;
                });
                //点击上一页下一页事件
                main.find(".page_up").unbind().bind("click", function () {
                    if (curPage > 1) {
                        curPage--;
                        getData();
                    }
                    return false;
                });
                main.find(".page_down").unbind().bind("click", function () {
                    if (curPage < count) {
                        curPage++;
                        getData();
                    }
                    return false;
                });
                //跳转到事件
                main.find(".page_count").unbind().bind("input", function () {
                    if (this.value.length == 1) {
                        this.value = this.value.replace(/[^1-9]/g, '')
                    } else {
                        this.value = this.value.replace(/\D/g, '')
                    }
                    if (this.value > count) {
                        this.value = count;
                    }
                });
                main.find(".page_confirm").unbind().bind("click", function () {
                    if (main.find(".page_count").val() != "") {
                        curPage = parseInt(main.find(".page_count").val());
                        getData();
                    }
                    return false;
                });
            }

            getData();//async获取数据
        });
    };

    //移除数组指定元素
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    //首页切换身份
    $(".top_drop_down .drop_select").find("dd[data-role]").unbind().bind("click", function () {
        var main = $(this);
        if (!main.hasClass("selected")) {
            var roleId = $(this).attr("data-role");
            $.ajaxJSONP(config.accountPath + "/switchingIdentityJson", {
                role_id: roleId
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg,
                        callback: function () {
                            location.href = config.accountPath + dataObj.data.url;
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
        }
        return false;
    });

     //选择地区
     $(".website_location").find("a").unbind().bind("click", function () {
         var main = $(this),
             provinceId = main.attr("province_id");
         if (!main.hasClass("act")) {
             $.ajaxForJson(config.wwwPath + "/changeProvince", {
                 province_id: provinceId,
             }, function (dataObj) {
                 if (dataObj.code == 2000) {
                     $(".website_location").find("a").removeClass("act");
                     main.addClass("act");
                     $(".website_location").find(".location_value").html(main.html());
                     window.location.reload();
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


    //搜索招标名称
    $(".top_menu_right .top_search_sel").find("dl dd").unbind().bind("click", function () {
        $(".top_menu_right .top_search_sel > span").html($(this).html());
        return false;
    });
    $(".top_menu_right .top_search_btn").unbind().bind("click", function () {
        if ($(".top_menu_right .top_search_sel > span").html() == "招标名称") {
            window.location.href = config.bidPath + "exclusive.html?wordType=1&keyWord=" + encodeURIComponent($(".top_menu_right input.top_search_input").val());
        } else {
            window.location.href = config.bidPath + "exclusive.html?wordType=2&keyWord=" + encodeURIComponent($(".top_menu_right input.top_search_input").val());
        }
        return false;
    });
    $(".top_menu_right input.top_search_input").unbind().bind("keypress", function (e) {
        if (e.keyCode == "13") {
            $(".top_menu_right .top_search_btn").trigger("click");
        }
    });

    // 返回顶部
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {
            $('.backtop').parents(".toolbar-item").fadeIn(200);
        } else {
            $('.backtop').parents(".toolbar-item").fadeOut(200);
        }
    });
    $(".backtop").off().on("click", function () {
        $("body,html").animate({
            scrollTop: "0px"
        }, "fast");
    });
});