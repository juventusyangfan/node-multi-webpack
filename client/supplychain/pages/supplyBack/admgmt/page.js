require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 上移 下移
    $(".admgmt_table").on("click", "button", function () {
        var main = $(this);
        $.ajaxForJson(config.jcPath + 'user/BankAd/ajaxChangeOrder', {
            id: main.attr("id_val"),
            type: main.attr("type_val"),
            ad_order: main.attr("ad_order_val"),
        }, function (json) {
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

    // 上架、下架
    $(".shelf_btn").off().on("click", function () {
        var main = $(this);
        $.ajaxForJson(config.jcPath + 'user/bankAd/ajaxBankAdStatus', {
            id: main.attr("id_val"),
            status: main.attr("status_val")
        }, function (json) {
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