require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 负责人名称
    $("input[name='data[master_name]']").off().on("blur", function () {
        var main = $(this);
        main.initInput();
    });

    // 电话
    $("input[name='data[master_tel]']").off().on({
        input: function () {
            var main = $(this);
            if (!libs.checkMobile(main.val())) {
                $("input[name='data[master_tel]']").initInput("error", "手机号错误");
                return false;
            } else {
                main.initInput();
            }
        },
        blur: function () {
            var main = $(this);
            main.initInput();
        }
    });

    // 网站
    $("input[name='data[url]']").off().on({
        input: function () {
            var main = $(this);
            if (!libs.checkUrl(main.val())) {
                $("input[name='data[url]']").initInput("error", "网址错误");
                return false;
            } else {
                main.initInput();
            }
        },
        blur: function () {
            var main = $(this);
            main.initInput();
        }
    });

    // 保存
    $(".btn_confirm").off().on("click", function (event) {
        event.preventDefault();

        // 必填项
        var opt = {
            name: $("input[name='data[master_name]']").val(),
            tel: $("input[name='data[master_tel]']").val(),
            url: $("input[name='data[url]']").val()
        }
        if ($.trim(opt.name) == "") {
            $("input[name='data[master_name]']").initInput("error", "负责人名称不能为空");
            return false;
        } else if ($.trim(opt.tel) == "") {
            $("input[name='data[master_tel]']").initInput("error", "负责人电话不能为空");
            return false;
        } else if (!libs.checkMobile(opt.tel)) {
            $("input[name='data[master_tel]']").initInput("error", "手机号错误");
            return false;
        } else if ($.trim(opt.url) == "") {
            $("input[name='data[url]']").initInput("error", "企业官网不能为空");
            return false;
        } else if (!libs.checkUrl(opt.url)) {
            $("input[name='data[url]']").initInput("error", "网址错误");
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
                        location.reload();
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