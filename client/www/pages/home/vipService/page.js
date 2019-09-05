/**
 * Created by yangfan on 2017/7/6.
 */
require('elem');
require('cp');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    $(".vip_apply").off().on("click", function () {
        $.ajaxForJson(config.wwwPath + 'supplier/addMember', null, function (json) {
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
                                member_status: json.data.member_status,
                                user_id: json.data.data.user_id
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
                        $.msgTips({
                            type: "success",
                            content: json.data.msg,
                            callback: function () {
                                location.href = json.data.url;
                            }
                        });
                    }
                }
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.data.msg
                });
            }
        });
    });
});