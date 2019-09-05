require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    //检索供应商库
    $(".btn_confirm").unbind().bind("click", function () {
        var key = $.trim($("input[name='company_name']").val()), type = $("input[name='role_type']").val();
        $(".page_container_wrap").ajxForPage(config.wwwPath + "/companylibrary/dealAdd", {
            company_name: key,
            role_type: type
        });
        return false;
    });
    $("input[name='company_name']").unbind().bind("keypress", function (event) {
        if (event.keyCode == "13") {
            $(".btn_confirm").trigger("click");
        }
    });

    //申请成为友商
    $(".back_main_content").on("click", ".back_item_add", function () {
        var main = $(this);

        $.dialog({
            title: "提交申请",
            content: '<div class="apply_con"><div class="apply_tips"><div class="cjy-layer-center"><span class="msgCon" style="display: block;line-height: normal;margin-left: 0;"><span class="noticeBg"><i class="iconfont icon-i"></i></span>请保持电话通畅，采购商单位将根据实际情况进行进一步的资格审核！</span></div></div></div>',
            width: 540,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").off().on("click", function () {
                    $.ajaxForJson(config.wwwPath + "/library/addPost", {
                        join_way: $("input[name='join_way']").val(),
                        company_id: main.parents(".back_list_con").find("input[name='company_id']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            main.parents(".back_list_con").removeClass("hove_add").addClass("hover_done");
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                });
            }
        });
        return false;
    });
});