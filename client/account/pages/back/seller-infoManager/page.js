require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

$(() => {
    $("a[name='role_id']").unbind().bind("click", function () {
        var role_id = $(this).attr("data-id");
        $.ajaxForJson("/register/checkCompany", {
            role_id: role_id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                window.location.href = dataObj.data.url;
            }
            else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
    //切换身份
    $("a[name='change_role']").unbind().bind("click", function () {
        var role_id = $(this).attr("data-id");
        $.ajaxForJson("/switchingIdentity", {
            role_id: role_id
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: "操作成功"
                });
                setTimeout(function () {
                    window.location.href = dataObj.data.url;
                }, 1000);
            }
            else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});