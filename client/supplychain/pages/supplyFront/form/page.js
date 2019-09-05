require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 客户姓名
    $("input[name='client_real_name']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 10) {
                $(this).val(curVal.substr(0, 10));
            }
        },
        blur: function () {
            $(this).initInput();
        }
    });

    // 客户电话
    $("input[name='client_mobile']").off().on({
        input: function () {
            libs.lenNumber($(this)[0], 0);
        },
        blur: function () {
            $(this).initInput();
        }
    });

    // 意向金额
    $("input[name='apply_amount']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 9) {
                $(this).val(curVal.substr(0, 9));
            }
            libs.lenNumber($(this)[0], 0);
        },
        blur: function () {
            $(this).initInput();
        }
    });

    // 期望年利率
    $("input[name='apply_rate']").off().on({
        input: function () {
            var curVal = $(this).val();
            libs.lenNumber($(this)[0], 2);
            if (curVal.length > 5) {
                $(this).val(curVal.substr(0, 5));
            }
        },
        blur: function () {
            $(this).initInput();
        }
    });

    // 还款期限
    $("input[name='apply_back_month']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 4) {
                $(this).val(curVal.substr(0, 4));
            }
            libs.lenNumber($(this)[0], 0);
        },
        blur: function () {
            $(this).initInput();
        }
    });

    // 放款时间
    $("input[name='apply_loan_day']").off().on({
        input: function () {
            var curVal = $(this).val();
            if (curVal.length > 6) {
                $(this).val(curVal.substr(0, 4));
            }
            libs.lenNumber($(this)[0], 0);
        },
        blur: function () {
            $(this).initInput();
        }
    });
    $(".confirm-btn").unbind().bind("click", function () {
        var apply_back = $("input[name='apply_back_month']").val();
        var apply_rate = $("input[name='apply_rate']").val();
        if ($.trim($("input[name='client_real_name']").val()) == "") {
            $("input[name='client_real_name']").initInput("error", "客户姓名不能为空");
            return false;
        } else if ($.trim($("input[name='client_mobile']").val()) == "" || !libs.checkMobile($("input[name='client_mobile']").val())) {
            $("input[name='client_mobile']").initInput("error", "请输入正确的电话号码");
            return false;
        } else if ($("input[name='project_name']").val() == null || $("input[name='project_name']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择融资项目"
            });
            return false;
        } else if ($.trim($("input[name='apply_amount']").val()) == "") {
            $("input[name='apply_amount']").initInput("error", "请输入正确的意向金额");
            return false;
        } else if ($.trim(apply_rate) == "") {
            $("input[name='apply_rate']").initInput("error", "请输入正确的期望年利率");
            return false;
        } else if (parseInt(apply_rate) > 99.99) {
            $("input[name='apply_rate']").initInput("error", "年利率为0.01~99.99");
            return false;
        } else if ($.trim(apply_back) == "") {
            $("input[name='apply_back_month']").initInput("error", "请输入合理的还款期限");
            return false;
        } else if (parseInt(apply_back) > 1200) {
            $("input[name='apply_back_month']").initInput("error", "最大还款期限为1200个月");
            return false;
        } else if ($.trim($("input[name='apply_loan_day']").val()) == "") {
            $("input[name='apply_loan_day']").initInput("error", "请输入合理的放款时间");
            return false;
        }
        var reqUrl = config.jcPath + 'Product/applyProduct';
        var reqData = $(".intention_form").serialize();
        $("input[name='bank_id_arr[]']:checked").each(function () {
            reqData += '&bank_name_arr[]=' + $(this).attr("title");
        });
        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.href = config.jcPath;
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
        return false;
    });
});