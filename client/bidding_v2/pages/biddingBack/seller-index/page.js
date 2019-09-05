require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    // 
    $(".add_member").off().on("click", function () {
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
                                role_id: json.data.data.role_id
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