require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#supplier',
        data() {
            return {
                loading: true,
                list: [],
                count: 0,
                limit: 10,
                current: 1,
                key: ""
            }
        },
        mounted() {

        },
        methods: {
            getSupplier(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.youshangPath + 'purchaser/invitation/invitationAjax', {
                    company_name: that.key,
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            },
            goSearch() {
                $(".findgys_table").show();
                this.getSupplier(1);
            },
            goInvite(companyId) {
                $.ajaxForJson(config.youshangPath + "purchaser/invitation/demandList", {}, function (dataObj) {
                    if (dataObj.code == 2000) {
                        var _html = '<div style="padding:20px;">';
                        for (var i = 0; i < dataObj.data.length; i++) {
                            _html += '<div><input type="radio" name="typeRadio" data-id="'+dataObj.data[i].youshang_type_id+'" value="' + dataObj.data[i].id + '" title="' + dataObj.data[i].title + '"></div>';
                        }
                        _html += '</div>'
                        $.dialog({
                            title: '选择适用类别',
                            content: _html,
                            width: 400,
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
                                $("input[type='radio']").initRadio();

                                //确定按钮
                                $(".cjy-confirm-btn").unbind().bind("click", function () {
                                    var _id = $("input[name='typeRadio']:checked").val(),
                                        youshang_type_id = $("input[name='typeRadio']:checked").attr("data-id");
                                    if ($("input[name='typeRadio']:checked").length > 0) {
                                        //请求适用类型
                                        $.ajaxForJson(config.youshangPath + "purchaser/invitation/demandDetail", {
                                            id: _id,
                                            other_company_id: companyId
                                        }, function (jsonObj) {
                                            $(".cjy-cancel-btn").trigger("click");
                                            if (jsonObj.code == 2000) {
                                                //显示邀请函
                                                var inviteHTML = '<div class="inviteDialog"><div class="inviteDlgLeft"></div><div class="inviteDlgMiddle"><p class="sentTo">确认发送给</p><p class="sentName">' + jsonObj.data.company_name + '</p><p class="includeTo">—— 邀请函将包括 ——</p><div class="includeWarp"><span class="includeCell"><i class="joinIcon"></i><a class="javascript:;">供应商加入要求</a><div class="includeTips"><span class="includeArrow"></span><span class="includeCon"><p>' + jsonObj.data.requirement + '</p>';
                                                for (var key in jsonObj.data.describe_src) {
                                                    inviteHTML += '<div class="fujianCon"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + key + '</span><a href="' + config.filePath + jsonObj.data.describe_src[key] + '" target="_blank" class="down">下载</a></div>';
                                                }
                                                inviteHTML += '</span></div></span><span class="includeCell"><i class="summaryIcon"></i><a class="javascript:;">供应商单位简介</a><div class="includeTips"><span class="includeArrow"></span><span class="includeCon"><span class="includeBlock"><label>公司名称：</label><span>' + jsonObj.data.company_name + '</span></span><span class="includeBlock"><label>联系方式：</label><span>' + jsonObj.data.link_phone + '</span></span><span class="includeBlock"><label>公司地址：</label><span>' + jsonObj.data.company_address + '</span></span><span class="includeBlock"><label>详细地址：</label><span>' + jsonObj.data.detail_address + '</span></span></span></div></span></div><div class="inviteFooter"><a href="javascript:;" class="invite_cancel">取消</a><a href="javascript:;" class="invite_confirm">确认发送</a></div></div><div class="inviteDlgRight"></div><div class="inviteDlgJie"></div></div>';
                                                $("body").append(inviteHTML);
                                                $("body").append('<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>');
                                                //发送邀请
                                                $(".invite_confirm").unbind().bind("click", function () {
                                                    $.ajaxForJson(config.youshangPath + "purchaser/invitation/addInvitation", {
                                                        youshang_type_id: youshang_type_id,
                                                        other_company_id: companyId
                                                    }, function (obj) {
                                                        if (obj.code == 2000) {
                                                            $(".inviteDialog").addClass("close");
                                                            $(".inviteDlgJie").show(300);
                                                            $(".inviteDlgMiddle").css("z-index", "100");
                                                            $(".inviteDialog").hide(500);
                                                            setTimeout(function () {
                                                                window.location.reload();
                                                            }, 800);
                                                        } else {
                                                            $.msgTips({
                                                                type: "warning",
                                                                content: obj.msg
                                                            });
                                                        }
                                                    })
                                                });
                                                $(".invite_cancel").unbind().bind("click", function () {
                                                    $(".inviteDialog").remove();
                                                    $(".cjy-bg").remove();
                                                    return false;
                                                });
                                            }
                                        });
                                    } else {
                                        $.msgTips({
                                            type: "warning",
                                            content: "请选择适用类型！"
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        $.msgTips({
                            type: "warning",
                            time: 2000,
                            content: dataObj.msg,
                            callback: function () {
                                if (dataObj.data.url) {
                                    window.location.href = dataObj.data.url;
                                }
                            }
                        });
                    }
                });
            },
            reInvite(id) {
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '是否确认再次邀请该供应商？'],
                    content: '',
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $.ajaxForJson(config.youshangPath + "purchaser/invitation/addAgain", {
                                id: id
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
                            return false;
                        });
                    }
                });
            }
        }
    });
});