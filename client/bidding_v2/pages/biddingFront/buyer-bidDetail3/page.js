require('cp');
require('elem');
require('../../../public-resource/css/componentOther.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#bidList',
        data() {
            return {
                loading: true,
                list: [],
                tenderInfo: {},
                count: 0,
                filePath: config.filePath
            }
        },
        mounted() {
            this.getBidList();
        },
        methods: {
            getBidList() {
                var that = this;
                that.loading = true;
                $(".material_list table").hide();
                $.ajaxForJson(config.wwwPath + 'buyer/Tender/getDetailPackageAjax', {
                    tId: $(".keyUl li.act").find("a").attr("tId"),
                    pId: $(".keyUl li.act").find("a").attr("pId"),
                    viewStatus: $(".keyUl li.act").find("a").attr("viewStatus")
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.apply_info;
                        that.tenderInfo = dataObj.data.tender_info;
                    }
                    $(".material_list table").show();
                    that.loading = false;

                    that.$nextTick(function () {
                        $("input.seniority_status").parent().next(".cjy-radio").remove();
                        $("input.seniority_status").initRadio();
                    });
                });
            }
        }
    });

    //选择包件
    $(".keyUl").find("li a").unbind().bind("click", function () {
        var main = $(this);
        var _request = [];
        $("#bidList").find("tr").each(function () {
            if ($(this).find("input.seniority_status:checked").length > 0) {
                var obj = {
                    apply_id: $(this).attr("data-apply-id"),
                    status: $(this).find("input.seniority_status:checked").val(),
                    seniority_back_reason: $(this).find("textarea").val()
                }
                _request.push(obj)
            }
        });
        $.ajaxForJson(config.wwwPath + "buyer/Tender/seniorityPackageConfirmAjax", {
            pId: $(".keyUl li.act").find("a").attr("pId"),
            confirmData: _request
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                $(".keyUl").find("li a").parent().removeClass("act");
                main.parent().addClass("act");
                vm.getBidList();
            } else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });

    //开启资审文件
    $(".open_seniority").unbind().bind("click", function () {
        var html = '<div class="open_wrap">';
        html += '<div class="bid_detail_prompt"><i class="iconfont icon-i"></i>此操作不可逆，且仅能操作1次，仅谨慎操作！</div>';
        html += '<div class="open_block"><label>开启口令：</label><input type="text" name="openWord" class="cjy-input-" placeholder="请输入开启口令"><span class="open_tips floatR"></span></div>';
        html += '<div class="open_block"><label>开启密钥：</label><span class="js_upload"></span><a href="#" class="marginL30 cjy_file"></a><span class="open_tips floatR"></span></div><div id="process-files"></div>';
        html += '</div>';
        $.dialog({
            title: "开启资格预审文件",
            content: html,
            width: 800,
            confirm: {
                show: true,
                allow: false,
                name: "开启"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                //验证开启口令
                $("input[name='openWord']").unbind().bind("blur", function () {
                    var main = $(this);
                    if ($.trim(main.val()) != "") {
                        $.ajaxForJson(config.wwwPath + 'buyer/Tender/checkOpenSeniorityWord', {
                            tId: $(".keyUl li.act").find("a").attr("tId"),
                            openWord: $.trim(main.val())
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                main.parents(".open_block").find(".open_tips").html('<i class="iconfont icon-gou"></i>通过校验');
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg,
                                    callback: function () {
                                        main.parents(".open_block").find(".open_tips").html('<i class="iconfont icon-cha1"></i>校验失败');
                                    }
                                });
                            }
                            if ($(".open_wrap").find("i.icon-gou").length >= 2) {
                                $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-notallow-btn").addClass("cjy-confirm-btn");
                                $(".cjy-confirm-btn").unbind().bind("click", function () {
                                    if (!$(this).hasClass("cjy-notallow-btn")) {
                                        $.ajaxForJson(config.wwwPath + 'buyer/Tender/openSeniorityTender', {
                                            tId: $(".keyUl li.act").find("a").attr("tId")
                                        }, function (dataObj) {
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
                                                    content: dataObj.msg
                                                });
                                            }
                                        });
                                    }
                                    return false;
                                });
                            } else {
                                $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-confirm-btn").addClass("cjy-notallow-btn");
                            }
                        });
                    }
                });
                // 附件上传
                $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                    var main = $(".js_upload");
                    $(".cjy_file").html(name).attr("href", config.filePath + url);
                    $.ajaxForJson(config.wwwPath + 'buyer/Tender/checkOpenSenioritySecretKey', {
                        tId: $(".keyUl li.act").find("a").attr("tId"),
                        keyFileUrl: url
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            main.parents(".open_block").find(".open_tips").html('<i class="iconfont icon-gou"></i>通过校验');
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                        if ($(".open_wrap").find("i.icon-gou").length >= 2) {
                            $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-notallow-btn").addClass("cjy-confirm-btn");
                            $(".cjy-confirm-btn").unbind().bind("click", function () {
                                if (!$(this).hasClass("cjy-notallow-btn")) {
                                    $.ajaxForJson(config.wwwPath + 'buyer/Tender/openSeniorityTender', {
                                        tId: $(".keyUl li.act").find("a").attr("tId")
                                    }, function (dataObj) {
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
                                                content: dataObj.msg
                                            });
                                        }
                                    });
                                }
                                return false;
                            });
                        } else {
                            $(".cjy-layer-foot").find(".cjy-notallow-btn").removeClass("cjy-confirm-btn").addClass("cjy-notallow-btn");
                        }
                    });
                }, {
                    extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
                });
            }
        });
        return false;
    });

    //选择资审结果
    $("#bidList").on("change", "input.seniority_status", function () {
        if ($(this).val() == "0") {
            $(this).parents("td").next("td").html('<textarea></textarea>');
        } else {
            $(this).parents("td").next("td").html('——');
        }
    });

    //提交资审结果
    $(".publish_seniority").unbind().bind("click", function () {
        var _request = [];
        $("#bidList").find("tr").each(function () {
            if ($(this).find("input.seniority_status:checked").length > 0) {
                var obj = {
                    apply_id: $(this).attr("data-apply-id"),
                    status: $(this).find("input.seniority_status:checked").val(),
                    seniority_back_reason: $(this).find("textarea").val()
                }
                _request.push(obj)
            }
        });
        $.ajaxForJson(config.wwwPath + "buyer/Tender/seniorityPackageConfirmAjax", {
            pId: $(".keyUl li.act").find("a").attr("pId"),
            confirmData: _request
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                $.ajaxForJson(config.wwwPath + "buyer/Tender/seniorityResultConfirmAjax", {
                    tId: $(".keyUl li.act").find("a").attr("tId")
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        window.location.reload();
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: dataObj.msg
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
        return false;
    });
});