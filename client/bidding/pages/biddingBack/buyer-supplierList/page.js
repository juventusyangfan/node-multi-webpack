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
                var key = $.trim($("input[name='company_name']").val()), type = $("input[name='role_type']").val();
                $.ajaxForJson(config.wwwPath + 'companylibrary/indexPost', {
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

    // $(".page_container_wrap").ajxForPage(config.wwwPath + "/companylibrary/indexPost", {});

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

    // 审核
    $(".page_list").on("click", ".audit_sell", function () {
        var main = $(this);
        var sCompanyId = main.parents("tr").find("input[name='company_id']").val();
        var sId = main.parents("tr").find("input[name='id']").val();

        $.ajaxForJson(config.wwwPath + 'getCompanyInfo', {
            company_id: sCompanyId,
            id: sId
        }, function (json) {
            if (json.code == 2000) {
                var dialogHtml = '<li class="gys-item"><span class="gys-item-title">公司名称：</span><span class="gys-item-name ellipsis color_red" title="' + json.data.company_name + '">' + json.data.company_name + '</span></li><li class="gys-item"><span class="gys-item-title">企业类型：</span><span class="gys-item-name">' + json.data.company_type + '</span></li><li class="gys-item"><span class="gys-item-title">员工人数：</span><span class="gys-item-name">' + json.data.size + '</span></li><li class="gys-item"><span class="gys-item-title">纳税人类型：</span><span class="gys-item-name">' + json.data.taxpayer_type + '</span></li><li class="gys-item"><span class="gys-item-title">注册资金：</span><span class="gys-item-name">' + json.data.funds + '</span></li><li class="gys-item"><span class="gys-item-title">营业执照注册号：</span><span class="gys-item-name">' + json.data.credit_code + '</span></li><li class="gys-item"><span class="gys-item-title">公司联系方式：</span><span class="gys-item-name">' + json.data.company_phone + '</span></li><li class="gys-item"><span class="gys-item-title">公司地址：</span><span class="gys-item-name">' + json.data.province + '-' + json.data.city + '-' + json.data.area + '</span></li><li class="gys-item"><span class="gys-item-title">详细地址：</span><span class="gys-item-name ellipsis">' + json.data.detail_address + '</span></li>';
                var infoHTML = '<li class="gys-info"><span class="gys-item-title">加入方式：</span><span class="gys-item-name">' + json.data.join_way + '</span></li><li class="gys-info"><span class="gys-item-title">申请/邀请时间：</span><span class="gys-item-name">' + json.data.add_time + '</span></li><li class="gys-info"><span class="gys-item-title">审核材料提交时间：</span><span class="gys-item-name">' + json.data.last_time + '</span></li><li class="gys-info"><span class="gys-item-title">审核材料：</span><span class="gys-item-name">';
                var fileObj = libs.jsonToObj(json.data.supplier_file);
                for (var i = 0; i < fileObj.length; i++) {
                    var extend = fileObj[i].path.split(".")[1];
                    if (extend == "jpeg" || extend == "jpg" || extend == "png") {
                        infoHTML += ' <a href="javascript:;" class="showPic" data-url="' + fileObj[i].path + '">' + fileObj[i].name + '</a>';
                    }
                    else {
                        infoHTML += ' <a href="' + config.wwwPath + fileObj[i].path + '">' + fileObj[i].name + '</a>';
                    }
                }
                infoHTML += '</span></li>';

                var disSty = json.data.status == "3" ? "" : "display: none;";
                $.dialog({
                    title: '修改供应商',
                    content: '<div class="qygys-box"><div class="gys-basic"><div class="gys-basic-title"><h2>供应商基本信息</h2><span class="gys-line"></span></div><ul class="gysbasic-list clearfix">' + dialogHtml + '</ul></div><div class="gys-basic"><div class="gys-basic-title"><h2>供应商基本信息</h2><span class="gys-line"></span></div><ul class="gysbasic-list clearfix">' + infoHTML + '</ul></div><div class="gys-sel-area"><p><span>设置供应商状态：</span><select name="status" value="' + json.data.status + '"><option value="">请选择</option><option value="3">审核通过</option><option value="4">审核不通过</option><option value="5">拉黑</option></select></p><p class="level_p" style="' + disSty + '"><span>设置供应商等级：</span><select name="supplier_level" value="' + json.data.supplier_level + '"><option value="">请选择</option><option value="1">A</option><option value="2">B</option><option value="3">C</option><option value="4">D</option></select></p></div></div>',
                    width: 540,
                    confirm: {
                        show: true,
                        allow: true,
                        name: "确定"
                    },
                    callback: function () {
                        $(".gys-sel-area select[name='status']").unbind().bind("change", function () {
                            if ($(this).val() == "3") {
                                $(".gys-sel-area .level_p").css("display", "block");
                            }
                            else {
                                $(".gys-sel-area .level_p").css("display", "none");
                            }
                        });
                        $(".cjy-confirm-btn").off().on("click", function () {
                            if ($(".gys-sel-area select[name='status']").val() === "") {
                                $.msgTips({
                                    type: "warning",
                                    content: "供应商状态不能为空"
                                });
                                return false;
                            } else if ($(".gys-sel-area select[name='status']").val() === "3" && $(".gys-sel-area select[name='supplier_level']").val() === "") {
                                $.msgTips({
                                    type: "warning",
                                    content: "供应商等级不能为空"
                                });
                                return false;
                            }
                            $.ajaxForJson(config.wwwPath + 'auditlibrary', {
                                id: sId,
                                status: $(".gys-sel-area select[name='status']").val(),
                                supplier_level: $(".gys-sel-area select[name='supplier_level']").val()
                            }, function (obj) {
                                $.msgTips({
                                    type: "success",
                                    content: obj.msg,
                                    callback: function () {
                                        location.reload();
                                    }
                                });
                            });
                        });
                        //查看附件
                        $(".gys-basic").on("click", "li a.showPic", function () {
                            var path = $(this).attr("data-url");
                            $.showPhoto(config.filePath + path);
                            return false;
                        });
                    }
                });
                $(".gys-sel-area select").initSelect();
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });
});