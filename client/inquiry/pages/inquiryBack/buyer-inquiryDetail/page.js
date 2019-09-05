require('cp');
require('cbp');
require('elem');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');
const libs = require('libs');

$(() => {
    //选择供应商
    $("input[name='inquiry_chose']").unbind().bind("change", function () {
        var companyName = $("input[name='inquiry_chose']:checked").parent().find(".inquiry_company").html();
        $(".back_main_btns").show();
        $(".btn_tips").find("span").html(companyName);
    });

    //创建订单
    $(".btn_confirm").unbind().bind("click", function () {
        $.dialog({
            title: "创建订单",
            content: '<div class="inquiry-box clearfix"><label class="inquiry-label">备注：</label><div class="inquiry-input"><textarea name="reason" placeholder="请描述选该商家（不选其他商家）原因"></textarea></div></div>',
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                var quoteId=$("input[name='inquiry_chose']:checked").val();
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson("/purchaser/inquiry/editChooseReasonAjax", {
                        quote_id: quoteId,
                        inquiry_id: $("input[name='inquiry_id']").val(),
                        reason: $("textarea[name='reason']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            window.location.href = "/purchaser/order/add?quote_id=" + quoteId;
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                    return false;
                });
                }
        });
        return false;
    });

    //金额排序
    $(".material_list").find("th a").unbind().bind("click", function () {
        var sort = 1,
            type = $(this).attr("sort-type");
        if (type == "1") {
            if ($(this).find("i").hasClass("arrDown")) {
                sort = 1;
            } else {
                sort = 2;
            }
        } else if (type == "2") {
            if ($(this).find("i").hasClass("arrDown")) {
                sort = 3;
            } else {
                sort = 4;
            }
        }
        if (window.location.href.indexOf("sort") > -1) {
            location.href = libs.replaceUrlParamVal(location.href, "sort", sort);
        } else {
            location.href = location.href + "&sort=" + sort;
        }
    });
});