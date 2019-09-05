require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require("libs");


$(() => {
    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        var html = '<div class="affix_item"><input type="hidden" name="supplier_file[name][]" value="' + name + '"><input type="hidden" name="supplier_file[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
        $(".affixCon").show().append(html);
        //删除附件
        $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
            $(this).parents(".affix_item").remove();
            if ($(".affix_item").length <= 0) {
                $(".affixCon").hide();
            }
            return false;
        });
    }, {
        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
    });
    //附件上传
    var uploadKey = true; //上传开关
    // $(document).on("click", "#uploadFile", function () {
    //     if (uploadKey) {
    //         if ($(".affixCon").find(".affix_item").length >= 8) {
    //             $.msgTips({
    //                 type: "warning",
    //                 content: "最多上传8个附件"
    //             });
    //             return false;
    //         }
    //         $("#uploadFile").unbind().bind("change", function () {
    //             uploadKey = false;
    //             $(".js_upload").find("span").html("上传中...");
    //             var id = "uploadFile";
    //             document.domain = config.domainStr;
    //             $.ajaxFileUpload({
    //                 url: config.youshangPath + 'uploadFile',
    //                 secureuri: config.domainStr,
    //                 fileElementId: id,
    //                 data: {
    //                     name: "uploadFile"
    //                 },
    //                 success: function success(data) {
    //                     var dataObj = eval('(' + data + ')');
    //                     if (dataObj.code == 2000) {
    //                         var html = '<div class="affix_item"><input type="hidden" name="supplier_file[name][]" value="' + dataObj.name + '"><input type="hidden" name="supplier_file[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + dataObj.name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
    //                         $(".affixCon").show().append(html);

    //                         //删除附件
    //                         $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
    //                             $(this).parents(".affix_item").remove();
    //                             if ($(".affixCon").find(".affix_item").length <= 0) {
    //                                 $(".affixCon").hide();
    //                             }
    //                             return false;
    //                         });
    //                     } else {
    //                         $.msgTips({
    //                             type: "warning",
    //                             content: dataObj.message
    //                         });
    //                     }
    //                     uploadKey = true;
    //                     $(".js_upload").find("span").html("上传");
    //                 },
    //                 error: function error(data, status) {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: "文件过大或格式不正确"
    //                     });
    //                     uploadKey = true;
    //                     $(".js_upload").find("span").html("上传");
    //                 }
    //             });
    //         });
    //     }
    // });

    //申请弹框
    $(".js_invite").unbind().bind("click", function () {
        var inviteHTML = '<div class="inviteDialog"><div class="inviteDlgLeft"></div><div class="inviteDlgMiddle"><p class="sentTo">确认发送给</p><p class="sentName">' + $("label[name='company_name']").html() + '</p><p class="includeTo">—— 请先查看 ——</p><div class="includeWarp"><span class="includeCell"><i class="joinIcon"></i><a class="javascript:;">供应商加入要求</a><div class="includeTips"><span class="includeArrow"></span><span class="includeCon"><p>' + $("p[name='requirement']").html() + '</p>';
        $("p[name='requirement']").parent().find(".affix_item").each(function () {
            var _name = $(this).find(".ellipsis").html(),
                _src = $(this).find("a").attr("href");
            inviteHTML += '<div class="fujianCon"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + _name + '</span><a href="' + _src + '" target="_blank" class="down">下载</a></div>';
        });
        inviteHTML += '</span></div></span><span class="includeCell"><i class="summaryIcon"></i><a class="javascript:;">采购商商单位简介</a><div class="includeTips"><span class="includeArrow"></span><span class="includeCon"><span class="includeBlock"><label>公司名称：</label><span>' + $("label[name='company_name']").html() + '</span></span><span class="includeBlock"><label>联系方式：</label><span>' + $("label[name='link_phone']").html() + '</span></span><span class="includeBlock"><label>公司地址：</label><span>' + $("label[name='company_address']").html() + '</span></span><span class="includeBlock"><label>详细地址：</label><span>' + $("label[name='detail_address']").html() + '</span></span></span></div></span></div><div class="inviteFooter"><a href="javascript:;" class="invite_cancel">取消</a><a href="javascript:;" class="invite_confirm">提交申请</a></div></div><div class="inviteDlgRight"></div><div class="inviteDlgJie"></div></div>';
        $("body").append(inviteHTML);
        $("body").append('<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>');
        //发送邀请
        $(".invite_confirm").unbind().bind("click", function () {
            $.ajaxForJson(config.youshangPath + "supplier/apply/applyPost", $("form").serialize(), function (obj) {
                if (obj.code == 2000) {
                    $(".inviteDialog").addClass("close");
                    $(".inviteDlgJie").show(300);
                    $(".inviteDlgMiddle").css("z-index", "100");
                    $(".inviteDialog").hide(500);
                    setTimeout(function () {
                        window.location.href = "/supplier/apply/index";
                    }, 800);
                } else {
                    $.msgTips({
                        type: "warning",
                        content: obj.msg
                    });
                }
            });
        });
        $(".invite_cancel").unbind().bind("click", function () {
            $(".inviteDialog").remove();
            $(".cjy-bg").remove();
            return false;
        });
        return false;
    });
});