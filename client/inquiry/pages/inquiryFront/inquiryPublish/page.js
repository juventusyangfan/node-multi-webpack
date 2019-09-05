require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

var tinymce = require('tinymce/tinymce');
require('tinymce/themes/modern/theme');
require('../../../public-resource/tinymce/langs/zh_CN');
require('tinymce/plugins/paste');
require('tinymce/plugins/link');
require('tinymce/plugins/table');
require('tinymce/plugins/image');
require('../../../public-resource/tinymce/skins/lightgray/skin.min.css');
require('../../../public-resource/tinymce/skins/lightgray/content.min.css');
require('../../../public-resource/tinymce/skins/lightgray/content.inline.min.css');

$(() => {
    $("[cjy-multi]").initMultiSelect();

    //富文本编辑器
    tinymce.PluginManager.add('placeholder', function (editor) {
        editor.on('init', function () {
            var label = new Label;
            onBlur();
            tinymce.DOM.bind(label.el, 'click', onFocus);
            editor.on('focus', onFocus);
            editor.on('blur', onBlur);
            editor.on('change', onBlur);
            editor.on('setContent', onBlur);

            function onFocus() {
                if (!editor.settings.readonly === true) {
                    label.hide();
                }
                editor.execCommand('mceFocus', false);
            }

            function onBlur() {
                if (editor.getContent() == '') {
                    label.show();
                } else {
                    label.hide();
                }
            }
        });
        var Label = function () {
            var placeholder_text = editor.getElement().getAttribute("placeholder") || editor.settings.placeholder;
            var placeholder_attrs = editor.settings.placeholder_attrs || {
                style: {
                    position: 'absolute',
                    top: '2px',
                    left: 0,
                    color: '#aaaaaa',
                    padding: '.25%',
                    margin: '5px',
                    width: '80%',
                    height: 'auto',
                    'font-size': '16px',
                    overflow: 'hidden',
                    'text-align': 'left',
                    'white-space': 'pre-wrap'
                }
            };
            var contentAreaContainer = editor.getContentAreaContainer();
            tinymce.DOM.setStyle(contentAreaContainer, 'position', 'relative');
            this.el = tinymce.DOM.add(contentAreaContainer, "label", placeholder_attrs, placeholder_text);
        }
        Label.prototype.hide = function () {
            tinymce.DOM.setStyle(this.el, 'display', 'none');
        }
        Label.prototype.show = function () {
            tinymce.DOM.setStyle(this.el, 'display', '');
        }
    });
    tinymce.init({
        selector: '.tinymceCon',
        width: 660,
        height: 300,
        plugins: 'image link table placeholder',
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table image",
        images_upload_url: config.upload + 'group1/upload',
        images_upload_handler: function (blobInfo, success, failure) {
            var token = "";
            function getToken() {
                $.ajax({
                    url: config.papiPath + "api/common/getToken",
                    async: false,
                    dataType: "json",
                    success: function (dataObj) {
                        token = dataObj.data.token;
                    },
                    error: function () {

                    }
                });
            }
            getToken();
            var formData;
            formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());
            formData.append("output", "json");
            formData.append("auth_token", token);
            $.ajax({
                url: `${config.upload}group1/upload`,
                type: 'post',
                async: false,
                processData: false,
                contentType: false,
                data: formData,
                dataType: 'json',
                success: function (dataObj) {
                    success(config.filePath + dataObj.src);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus + "---" + errorThrown);
                }
            });
        }
    });

    //风险弹框
    function riskDialog() {
        $.dialog({
            title: "温馨提示",
            content: '<div class="risk_con"><div class="risk_title"><i class="iconfont icon-i"></i>预估总价超过20万，请采用招投标平台完成采购信息发布！</div><div class="risk_tips"><div class="cjy-layer-center"><span class="msgCon textRed" style="display: block;line-height: normal;margin-left: 0;">请您如实填写预估总价，虚报预估价格有可能被视为分解工程、化整为零，需要承担审计风险。</span></div></div><a target="_blank" href="https://bid.materialw.com/buyer.html" class="risk_btn">前往招投标平台</a></div>',
            width: 546,
            confirm: {
                show: false,
                name: "确认"
            },
            cancel: {
                show: false,
                name: "取消"
            },
            callback: function () {

            }
        });
    }
    //预估总价
    $("input[name='inquiry_info[budget_price]']").bind({
        "input": function () {
            libs.lenNumber(this, 2);
        },
        "blur": function () {
            if (parseInt($(this).val()) >= 200000 || $.trim($(this).val()) == "") {
                riskDialog();
            }
        }
    })


    var step1Top, step2Top, step3Top, step4Top, step5Top;
    initScroll();

    function initScroll() {
        step1Top = $('#step1').offset().top;
        step2Top = $('#step2').offset().top;
        step3Top = $('#step3').offset().top;
        step4Top = $('#step4').offset().top;
        step5Top = $('#step5').offset().top;
        window.onscroll = scrollEvent
    };
    //滚动监听
    function scrollEvent() {
        var targetTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            targetTop = document.documentElement.scrollTop + 1;
        } else if (document.body) {
            targetTop = document.body.scrollTop + 1;
        }

        if (targetTop >= $(".publish_container").offset().top) {
            $(".publish_step_con").css({
                "position": "fixed",
                "left": "50%",
                "top": "100px",
                "margin-left": "-824px"
            });
            if (targetTop >= $(".publish_container").height()) {
                $(".publish_step_con").css({
                    "position": "absolute",
                    "left": "-142px",
                    "top": ($(".publish_container").height() - 300) + "px",
                    "margin-left": "0"
                });
            }
        } else {
            $(".publish_step_con").css({
                "position": "absolute",
                "left": "-142px",
                "top": "100px",
                "margin-left": "0"
            });
        }

        if (targetTop >= step1Top && targetTop < step2Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(0).find("a").addClass("active");
        } else if (targetTop >= step2Top && targetTop < step3Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(1).find("a").addClass("active");
        } else if (targetTop >= step3Top && targetTop < step4Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(2).find("a").addClass("active");
        } else if (targetTop >= step4Top && targetTop < step5Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(3).find("a").addClass("active");
        } else if (targetTop >= step5Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(4).find("a").addClass("active");
        }
    };
    // 点击导航条后滑动到相应的位置
    $(".publish_step_con").on("click", "a", function () {
        var barclass = $(this).attr('data-href');
        var top = $("#" + barclass).offset().top;
        $("html,body").animate({
            scrollTop: top
        }, 500);
    });

    //添加删除行
    $(".publish_table").on("click", ".add_multi", function () {
        var _tr = $(this).parents("tr");
        var trHTML = '<tr class="js_show"><td><select class="js_type" value="1" style="width:80px;"><option value="1">选择</option><option value="2">手动添加</option></select></td><td class="js_cata"><div cjy-multi></div></td><td><input type="text" class="cjy-input-" placeholder="请输入" style="width:140px;" name="inquiry_goods[brand_id][]"></td><td><input type="text" class="cjy-input-" placeholder="请输入" style="width:140px;" name="inquiry_goods[spec][]"></td><td class="num_unit"><input type="text" class="cjy-input-" placeholder="请输入" style="width:90px;float: left;" name="inquiry_goods[purchased_amount][]"><select value="吨" style="width:80px;" name="inquiry_goods[unit][]">';
        for (var i = 0; i < unitList.length; i++) {
            trHTML += '<option value="' + unitList[i] + '">' + unitList[i] + '</option>';
        }
        trHTML += '</select></td><td><input type="text" class="cjy-input-" placeholder="请备注详细信息" style="width:200px;" name="inquiry_goods[remark][]"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div></td></tr>';
        _tr.after(trHTML);
        _tr.next().find("[cjy-multi]").initMultiSelect();
        _tr.next().find("select").initSelect();
        return false;
    });
    $(".row_add a").unbind().bind("click", function () {
        var _tr = $(this).parents("tr");
        var trHTML = '<tr class="js_show"><td><select class="js_type" value="1" style="width:80px;"><option value="1">选择</option><option value="2">手动添加</option></select></td><td class="js_cata"><div cjy-multi></div></td><td><input type="text" class="cjy-input-" placeholder="请输入" style="width:140px;" name="inquiry_goods[brand_id][]"></td><td><input type="text" class="cjy-input-" placeholder="请输入" style="width:140px;" name="inquiry_goods[spec][]"></td><td class="num_unit"><input type="text" class="cjy-input-" placeholder="请输入" style="width:90px;float: left;" name="inquiry_goods[purchased_amount][]"><select value="吨" style="width:80px;" name="inquiry_goods[unit][]">';
        for (var i = 0; i < unitList.length; i++) {
            trHTML += '<option value="' + unitList[i] + '">' + unitList[i] + '</option>';
        }
        trHTML += '</select></td><td><input type="text" class="cjy-input-" placeholder="请备注详细信息" style="width:200px;" name="inquiry_goods[remark][]"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div></td></tr>';
        _tr.before(trHTML);
        _tr.prev().find("[cjy-multi]").initMultiSelect();
        _tr.prev().find("select").initSelect();
        return false;
    });
    $(".publish_table").on("click", ".del_multi", function () {
        var _tr = $(this).parents("tr").remove();
        return false;
    });

    //选择物资操作
    $(document).on("change", "select.js_type", function () {
        var main = this,
            _tr = $(main).parents("tr");
        if ($(main).val() == "1") {
            _tr.find("td.js_cata").html('<div cjy-multi></div>');
            _tr.find("[cjy-multi]").initMultiSelect();
        } else {
            _tr.find("td.js_cata").html('<input type="hidden" name="inquiry_goods[first_category_id][]" value="-1"><input type="hidden" name="inquiry_goods[parent_category_id][]" value="0"><input type="hidden" name="inquiry_goods[category_id][]" value="0"><input type="text" name="inquiry_goods[product_name][]" placeholder="请输入" class="cjy-input-" style="display:block;width:159px;" value="">');
        }
    });

    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        var html = '<li><input type="hidden" name="inquiry_attach_info[name][]" value="' + name + '"><input type="hidden" name="inquiry_attach_info[url][]" value="' + url + '"><i class="iconfont icon-fujian"></i><a href="' + url + '" target="_blank">' + name + '</a><a class="file_del">删除</a></li>';
        $(".file_con").show().append(html);

        //删除附件
        $(".file_del").unbind().bind("click", function () {
            $(this).parents("li").remove();
            return false;
        });
    }, {
        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
    });
    //删除附件
    $(".file_del").unbind().bind("click", function () {
        $(this).parents("li").remove();
        return false;
    });
    // //上传附件
    // $(document).on("click", "#uploadFile", function () {
    //     if ($(".file_con").find("li").length >= 8) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传8个附件"
    //         });
    //         return false;
    //     }
    //     $("#uploadFile").unbind().bind("change", function () {
    //         var id = "uploadFile";
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.inquiryPath + '/uploadFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var html = '<li><input type="hidden" name="inquiry_attach_info[name][]" value="' + dataObj.name + '"><input type="hidden" name="inquiry_attach_info[url][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><a href="' + config.filePath + dataObj.data + '" target="_blank">' + dataObj.name + '</a><a class="file_del">删除</a></li>';
    //                     $(".file_con").show().append(html);

    //                     //删除附件
    //                     $(".file_del").unbind().bind("click", function () {
    //                         $(this).parents("li").remove();
    //                         return false;
    //                     });
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.message
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {
    //                 $.msgTips({
    //                     type: "warning",
    //                     content: "文件不正确"
    //                 });
    //             }
    //         });
    //     });
    // });


    /**
     * 选择经营区域
     * */
    $.ajaxJSONP(config.papiPath + "/api/common/getProvince", null, function (dataObj) {
        if (dataObj.code == "2000") {
            var provinceArr = [];
            $(".js_area").find(".register_box_cell").each(function () {
                var id = $(this).attr("target_id");
                provinceArr.push(id);
            });
            var liHTML = '';
            for (var i = 0; i < dataObj.data.length; i++) {
                var actClass = provinceArr.indexOf(dataObj.data[i].id) > -1 ? "act" : "";
                liHTML += '<li title="' + dataObj.data[i].name + '" data-id="' + dataObj.data[i].id + '" data-name="' + dataObj.data[i].name + '"><i class="iconfont icon-gou ' + actClass + '"></i>' + dataObj.data[i].name + '</li>'
            }
            $(".js_area").find("ul.js_province").show().html(liHTML);
            //选择省市
            var timeObj = null;
            $(".js_area").find("ul.js_province").find("li").unbind().bind("click", function () {
                $(".js_area").find("ul.js_province").find("li").removeClass("act");
                $(this).addClass("act");
                var dataId = $(this).attr("data-id");

                $.ajaxJSONP(config.papiPath + "/api/common/getCity", {
                    pid: dataId
                }, function (obj) {
                    if (obj.code == "2000") {
                        var html = '';
                        var targetIdArr = [];
                        $(".js_area").find(".register_box .register_box_cell[parent_id]").each(function () {
                            var targetId = $(this).attr("target_id");
                            targetIdArr.push(targetId);
                        });
                        for (var i = 0; i < obj.data.length; i++) {
                            var actClass = targetIdArr.indexOf(obj.data[i].id) > -1 ? "act" : "";
                            html += '<li title="' + obj.data[i].name + '" data-id="' + obj.data[i].id + '" data-name="' + obj.data[i].name + '"><i class="iconfont icon-gou ' + actClass + '"></i>' + obj.data[i].name + '</li>';
                        }
                        $(".js_area").find("ul.js_city").show().html(html);
                        if ($(".js_area").find("ul.js_province").find("li.act").find("i").hasClass("act")) {
                            $(".js_area").find("ul.js_city").find("i").addClass("act");
                        } else {
                            $(".js_area").find("ul.js_city").find("i.icon-gou").unbind().bind("click", function () {
                                var id = $(this).parent().attr("data-id"),
                                    name = $(this).parent().attr("data-name"),
                                    cell = "";
                                if ($(this).hasClass("act")) {
                                    $(this).removeClass("act");
                                } else {
                                    $(this).addClass("act");
                                    var parentId = $(".js_area").find("ul.js_province").find("li.act").attr("data-id");
                                    cell += '<span class="register_box_cell" target_id="' + id + '" parent_id="' + parentId + '">' + name + '<input type="hidden" name="inquiry_item[supplier_management_scope][]" value="' + id + '"><i class="iconfont icon-cha1"></i></span>';
                                }
                                $(".js_area").find(".register_box_cell[target_id='" + id + "']").remove();
                                $(".js_area").find(".register_box").show().append(cell);
                                if ($(".js_area").find("ul.js_city").find("i").length == $(".js_area").find("ul.js_city").find("i.act").length) {
                                    $(".js_area").find("ul.js_province").find("li.act").find("i").trigger("click");
                                }
                                if ($(".js_area").find(".register_box .register_box_cell").length <= 0) {
                                    $(".js_area").find(".register_box").hide();
                                }
                                return false;
                            });
                        }
                    }
                });
                return false;
            });
            //选中省点击事件
            $(".js_area").find("ul.js_province").find("i.icon-gou").unbind().bind("click", function () {
                var main = $(this);
                var id = main.parent().attr("data-id"),
                    name = main.parent().attr("data-name"),
                    cell = "";
                if (main.hasClass("act")) {
                    main.removeClass("act");
                } else {
                    main.addClass("act");
                    cell = '<span class="register_box_cell" target_id="' + id + '">' + name + '<input type="hidden" name="inquiry_item[supplier_management_scope][]" value="' + id + '"><i class="iconfont icon-cha1"></i></span>';
                }
                main.parent().trigger("click");
                $(".js_area").find(".register_box_cell[target_id='" + id + "']").remove();
                $(".js_area").find(".register_box_cell[parent_id='" + id + "']").remove();
                $(".js_area").find(".register_box").show().append(cell);
                if ($(".js_area").find(".register_box .register_box_cell").length <= 0) {
                    $(".js_area").find(".register_box").hide();
                }
                return false;
            });
        }
    });
    //选择物资的展开收起
    $(".js_area").find(".multiple-title").unbind().bind("click", function () {
        if ($(".js_area").hasClass("js_selected")) {
            $(".js_area").removeClass("js_selected");
        } else {
            $(".js_area").addClass("js_selected");
        }
        return false;
    });
    //删除元素
    $(".js_area").on("click", ".register_box i.icon-cha1", function () {
        var targetId = $(this).parent().attr("target_id");
        $(".js_area").find("ul.js_province").find("li[data-id='" + targetId + "']").find("i").trigger("click");
        $(".js_area").find("ul.js_city").find("li[data-id='" + targetId + "']").find("i").removeClass("act");
        $(this).parent().remove();
        if ($(".js_area").find(".register_box .register_box_cell").length <= 0) {
            $(".js_area").find(".register_box").hide();
        }
    });
    //确认区域选择
    $(".js_area").on("click", ".area-confirm", function () {
        $(".js_area").removeClass("js_selected");
        return false;
    });

    //点击空白区隐藏下拉框
    $(document).click(function (e) {
        var _con = $('.js_material,.js_area'); // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
            $('.js_material,.js_area').removeClass("js_selected");
        }
    });

    //同意协议
    $(".rule_link").find("input[type='checkbox']").unbind().bind("change", function () {
        if ($(this).prop("checked")) {
            $("a.publish_none").removeClass("publish_none").addClass("publish_done");
        } else {
            $("a.publish_done").removeClass("publish_done").addClass("publish_none");
        }
    });
    //提交表单数据
    var ajaxConfirmKey = true;
    $(document).on("click", "a.publish_done,a.publish_save", function () {
        if (parseInt($("input[name='inquiry_info[budget_price]']").val()) >= 200000 || $.trim($("input[name='inquiry_info[budget_price]']").val()) == "") {
            riskDialog();
            return false;
        }
        var main = this;
        if (ajaxConfirmKey) {
            var reqUrl = $("input[name='inquiry_info[id]']").length > 0 ? "/purchaser/inquiry/editAjax" : "/purchaser/inquiry/addAjax",
                reqData = $("form").serialize() + "&inquiry_description_info=" + encodeURIComponent(tinymce.activeEditor.getContent()) + "&inquiry_info[status]=" + $(this).attr("data-status");
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == "2000") {
                    if ($(main).hasClass("publish_save")) {
                        window.location.href = "/purchaser/inquiry/index";
                    } else {
                        window.location.href = dataObj.data.url;
                    }
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
                ajaxConfirmKey = true;
            });
            ajaxConfirmKey = true;
        }
        return false;
    });
});