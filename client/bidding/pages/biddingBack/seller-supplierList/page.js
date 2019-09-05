require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';

const config = require('configModule');
const libs = require("libs");

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
                $.ajaxForJson(config.wwwPath + "/business/indexPost", {
                    company_name: key,
                    role_type: type,
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
        vm.getSupplier(1);
        return false;
    });
    $("input[name='company_name']").unbind().bind("keypress", function (event) {
        if (event.keyCode == "13") {
            $(".btn_confirm").trigger("click");
        }
    });

    //提交审核材料
    $(".back_main_content").on("click", ".upload_file", function () {
        var main = $(this);
        var id = main.parents("tr").find("input[name='id']").val();
        var imgHTML = '';
        if (main.parents("tr").find("input[name='supplier_file']").val() != "") {
            var imgObj = libs.jsonToObj(main.parents("tr").find("input[name='supplier_file']").val());
            for (var i = 0; i < imgObj.length; i++) {
                imgHTML += '<li><input type="hidden" name="file[name][]" value="' + imgObj[i].name + '"><input type="hidden" name="file[path][]" value="' + imgObj[i].path + '"><i class="iconfont icon-fujian"></i><a href="javascript:;" class="showPic ellipsis">' + imgObj[i].name + '</a><a href="javascript:;" class="textBlue js_del">删除</a></li>';
            }
        }
        $.dialog({
            title: "提交审核材料",
            content: '<div class="apply_con"><div class="apply_tips"><div class="cjy-layer-center"><span class="msgCon" style="display: block;line-height: normal;margin-left: 0;"><span class="noticeBg floatL"><i class="iconfont icon-i"></i></span><span style="display: inline-block;height: 38px;width: 436px;">请上传与采购单位已确认的审核材料，以供采购单位在平台上进行确认和留存！</span></span></div><div class="apply_form"><div class="back_main_item"><label>审核材料：</label><div class="back_main_block"><a href="javascript:;" class="itemBtn js_upload" style="position: relative;">上传文件<input type="file" accept="image/*" id="uploadFile" name="uploadFile" style="position: absolute;width: 100%;height: 100%;top: 0;right: 0;opacity: 0;cursor: pointer;"></a><span class="msgCon"><span class="noticeBg"><i class="iconfont icon-i"></i></span>最多可上传8个附件,支持jpg、png、jpeg、bmp、pdf、xls、xlsx、doc、docx、txt</span></div></div><div class="back_main_item"><label></label><div class="back_main_block"><div class="showFileCon"><ul>' + imgHTML + '</ul></div></div></div></div></div></div>',
            width: 540,
            callback: function () {
                if (imgHTML != '') {//显示图片容器
                    $(".showFileCon").show();
                }
                //附件上传
                $(document).on("click", "input[name='uploadFile']", function () {
                    if ($("input[name='file[name][]']").length >= 8) {
                        $.msgTips({
                            type: "warning",
                            content: "最多上传8个附件"
                        });
                        return false;
                    }
                    $("input[name='uploadFile']").unbind().bind("change", function () {
                        var id = $(this).attr("id");
                        document.domain = config.domainStr;
                        $.ajaxFileUpload({
                            url: config.wwwPath + 'ajaxUploadTenderFile',
                            secureuri: config.domainStr,
                            fileElementId: id,
                            data: {
                                name: "uploadFile"
                            },
                            success: function success(data) {
                                var dataObj = eval('(' + data + ')');
                                if (dataObj.code == 2000) {
                                    var html = '<li><input type="hidden" name="file[name][]" value="' + dataObj.name + '"><input type="hidden" name="file[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><a href="javascript:;" class="showPic ellipsis">' + dataObj.name + '</a><a href="javascript:;" class="textBlue js_del">删除</a></li>';
                                    $(".showFileCon").show();
                                    $(".showFileCon ul").append(html);
                                } else {
                                    $.msgTips({
                                        type: "warning",
                                        content: dataObj.message
                                    });
                                }
                            },
                            error: function error(data, status) {
                                $.msgTips({
                                    type: "warning",
                                    content: "文件不正确"
                                });
                            }
                        });
                    });
                });
                //查看附件
                $(".showFileCon").on("click", "li a.showPic", function () {
                    var path = $(this).parents("li").find("input[name='file[path][]']").val();
                    $.showPhoto(config.filePath + path);
                    return false;
                });
                //删除附件
                $(".showFileCon").on("click", "li a.js_del", function () {
                    $(this).parents("li").remove();
                    if ($(".showFileCon li").length <= 0) {
                        $(".showFileCon").hide();
                    }
                    return false;
                });

                $(".cjy-confirm-btn").off().on("click", function () {
                    var sellFileArr = [];
                    for (var i = 0; i < $("input[name='file[name][]']").length; i++) {
                        var obj = {
                            name: $("input[name='file[name][]']").eq(i).val(),
                            path: $("input[name='file[path][]']").eq(i).val()
                        };
                        sellFileArr.push(obj);
                    }
                    $.ajaxForJson(config.wwwPath + "/supplier/addFile", {
                        id: id,
                        sell_file: sellFileArr
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
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
                    })
                });
            }
        });
        return false;
    });
});