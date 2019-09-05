require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

// require('tinymce');
// require('tinymce/themes/modern/theme');
// require('tinymce/plugins/link/plugin');
// require('tinymce/plugins/lists/plugin');
// require('tinymce/plugins/charmap/plugin');
// require('tinymce/plugins/hr/plugin');
// require('tinymce/plugins/anchor/plugin');
// require('tinymce/plugins/wordcount/plugin');
// require('tinymce/plugins/table/plugin');
// require('tinymce/plugins/textcolor/plugin');
// require('../../../public-resource/tinymce/langs/zh_CN');
// require('../../../public-resource/tinymce/skins/lightgray/skin.min.css');
// require('../../../public-resource/tinymce/skins/lightgray/content.min.css');

$(() => {
    // tinymce.init({
    //     selector: "#demo",
    //     plugins: [
    //         "link lists charmap hr anchor",
    //         "wordcount",
    //         "table textcolor"
    //     ],

    //     toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
    //     toolbar2: " searchreplace | bullist numlist | outdent indent blockquote | link unlink | forecolor backcolor | table | hr removeformat",

    //     menubar: false,
    //     toolbar_items_size: 'small',

    //     style_formats: [
    //         {title: 'Bold text', inline: 'b'},
    //         {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
    //         {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
    //         {title: 'Example 1', inline: 'span', classes: 'example1'},
    //         {title: 'Example 2', inline: 'span', classes: 'example2'},
    //         {title: 'Table styles'},
    //         {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
    //     ],

    //     templates: [
    //         {title: 'Test template 1', content: 'Test 1'},
    //         {title: 'Test template 2', content: 'Test 2'}
    //     ],
    //     language: 'zh_CN'
    // });

    // 产品名称截取25个字符
    $("input[name='name']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 25) {
                $(this).val(curVal.substr(0, 25));
            }
        },
        blur: function () {
            var main = $(this);
            main.initInput();
        }
    });

    // 贷款金额
    $("input[name='loan_mix']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 23) {
                $(this).val(curVal.substr(0, 23));
            }
            libs.lenNumber($(this)[0], 2);
        },
        blur: function () {
            var main = $(this);
            var loanEnd = $("input[name='loan_max']");
            if (parseFloat(loanEnd.val()) !== "") {
                if (parseFloat(main.val()) > parseFloat(loanEnd.val())) {
                    main.val("");
                }
            }
            main.initInput();
        }
    });

    $("input[name='loan_max']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 23) {
                $(this).val(curVal.substr(0, 23));
            }
            libs.lenNumber($(this)[0], 2);
        },
        blur: function () {
            var main = $(this);
            var loanStart = $("input[name='loan_mix']");
            if (parseFloat(loanStart.val()) !== "") {
                if (parseFloat(main.val()) < parseFloat(loanStart.val())) {
                    main.val("");
                }
            }
            main.initInput();
        }
    });

    // 还款期限
    $("input[name='back_month_mix']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 4) {
                $(this).val(curVal.substr(0, 4));
            }
            libs.lenNumber($(this)[0], 0);
        },
        blur: function () {
            var main = $(this);
            var backEnd = $("input[name='back_month_max']");
            if (parseInt(backEnd.val()) !== "") {
                if (parseInt(main.val()) > parseInt(backEnd.val())) {
                    main.val("");
                }
            }
            main.initInput();
        }
    });

    $("input[name='back_month_max']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 4) {
                $(this).val(curVal.substr(0, 4));
            }
            libs.lenNumber($(this)[0], 0);
        },
        blur: function () {
            var main = $(this);
            var backStart = $("input[name='back_month_mix']");
            if (parseFloat(backStart.val()) !== "") {
                if (parseFloat(main.val()) < parseFloat(backStart.val())) {
                    main.val("");
                }
            }
            main.initInput();
        }
    });

    // 还款年利率
    $("input[name='loan_rate']").off().on({
        input: function () {
            var curVal = $(this).val();
            libs.lenNumber($(this)[0], 2);
            if (curVal.length > 5) {
                $(this).val(curVal.substr(0, 5));
            }
        },
        blur: function () {
            var main = $(this);
            var loanRate = $("input[name='loan_rate_max']");
            if (parseInt(loanRate.val()) !== "") {
                if (parseInt(main.val()) > parseInt(loanRate.val())) {
                    main.val("");
                }
            }
            main.initInput();
        }
    });

    $("input[name='loan_rate_max']").off().on({
        input: function () {
            var curVal = $(this).val();
            libs.lenNumber($(this)[0], 2);
            if (curVal.length > 5) {
                $(this).val(curVal.substr(0, 5));
            }
        },
        blur: function () {
            var main = $(this);
            var loanRate = $("input[name='loan_rate']");
            if (parseFloat(loanRate.val()) !== "") {
                if (parseFloat(main.val()) < parseFloat(loanRate.val())) {
                    main.val("");
                }
            }
            main.initInput();
        }
    });

    // 产品链接
    $("input[name='bank_link']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 200) {
                $(this).val(curVal.substr(0, 200));
            }
        },
        blur: function () {
            $(this).initInput();
        }
    });

    // 贷款类型
    $("select[name='type_id']").off().on("change", function () {
        var main = $(this);
        if (main.val() === "") {
            $("select[name='type_id']").html('').initSelect();
        } else {
            $.ajaxForJson(config.jcPath + 'index/ajaxProType', {
                type_id: main.val()
            }, function (json) {
                if (json.code == 2000) {
                    var typeArr = json.data.data;
                    var typeHtml = '<option value="">请选择</option>';
                    for (var i = 0; i < typeArr.length; i++) {
                        typeHtml += '<option value="' + typeArr[i].type_id_son + '">' + typeArr[i].type_name + '</option>';
                    }
                    $("select[name='type_id_son']").html(typeHtml).initSelect();
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                }
            });
        }
    });
    $("select[name='type_id']").triggerHandler("change");

    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        $(".adv_img img").attr("src", config.filePath + url);
        $(".adv_img input").val(url);
    }, {
        allowedFileTypes: ['image/*'],
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });
    // // 附件上传
    // $(document).on("click", ".upload_img", function () {
    //     $("#uploadFile").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.jcPath + 'user/BankIndex/uploadFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code === 2000) {
    //                     $(".adv_img img").attr("src", dataObj.file_url);
    //                     $(".adv_img input").val(dataObj.data);
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.msg
    //                     });
    //                 }
    //             },
    //             error: function error(data, status, e) {
    //                 // 
    //             }
    //         });
    //     });
    // });

    // 新增产品信息 保存
    $(".product_add,.product_save").off().on("click", function (event) {
        event.preventDefault();
        var main = $(this);

        // 必填项
        var loan_mix = $.trim($("input[name='loan_mix']").val());
        var loan_max = $.trim($("input[name='loan_max']").val());
        var month_max = $.trim($("input[name='back_month_max']").val());
        var month_mix = $.trim($("input[name='back_month_mix']").val());
        var loan_rate = $.trim($("input[name='loan_rate']").val());
        var rate_max = $.trim($("input[name='loan_rate_max']").val());
        if ($.trim($("input[name='name']").val()) == "") {
            $("input[name='name']").initInput("error", "产品名称不能为空");
            return false;
        } else if (loan_mix == "") {
            $("input[name='loan_mix']").initInput("error", "请输入正确的贷款金额");
            return false;
        } else if (loan_max == "") {
            $("input[name='loan_max']").initInput("error", "请输入正确的贷款金额");
            return false;
        } else if (month_mix == "") {
            $("input[name='back_month_mix']").initInput("error", "请输入合法的还款期限");
            return false;
        } else if (month_max == "") {
            $("input[name='back_month_max']").initInput("error", "请输入合法的还款期限");
            return false;
        } else if (parseInt(month_max) > 1200) {
            $("input[name='back_month_max']").initInput("error", "还款期限不能超过1200个月");
            return false;
        } else if (loan_rate == "") {
            $("input[name='loan_rate']").initInput("error", "请输入正确的还款年利率");
            return false;
        } else if (rate_max == "") {
            $("input[name='loan_rate_max']").initInput("error", "请输入正确的还款年利率");
            return false;
        } else if ($("select[name='type_id_son']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择贷款类型"
            });
            return false;
        } else if ($.trim($("input[name='product_img']").val()) == "") {
            $.msgTips({
                type: "warning",
                content: "请上传企业印象图片"
            });
            return false;
        } else if ($.trim($("textarea[name='product_desc']").val()) == "") {
            $.msgTips({
                type: "warning",
                content: "请填写产品简介"
            });
            return false;
        }

        // 表单提交
        var reqUrl = $(".back_main").attr("action");
        var reqData = $(".back_main").serialize();
        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.href = "/user/productManage/index.html";
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });
});