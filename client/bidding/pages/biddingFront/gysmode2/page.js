require('cp');
require('elem');
require('../../../public-resource/css/tender-timeline.css');
require('./page.css');
const config = require('configModule');

$(() => {
    // 切换选项卡
    $(".zb_tabs_li").off().on("click", function () {
        var main = $(this);
        var oLi = $(".zb_tabs_li");
        var num = oLi.index(main);
        var oWrap = $(".zb_tabs_wrap");
        var oParent = main.parents(".zb_tabs_list");
        oParent.find(".active").removeClass("active");
        main.addClass("active");
        if (num !== 4) {
            $(".display-block").removeClass("display-block").addClass("display-none");
            oWrap.eq(num).addClass("display-block").removeClass("display-none");
        }
    });

    // 报名
    $(".takepart_btn").off().on("click", function () {
        var main = $(this);
        if (main.attr("data-name") === "enroll") {
            // 报名
            $.get(config.wwwPath + 'ajaxEnrollPopup', {
                tenderId: $("input[name='tenderId']").val()
            }, function (json) {
                var json = JSON.parse(json);
                if (json.code == 2000) {
                    if (json.data.word === "") {
                        $.cueDialog({
                            title: "报名",
                            content: '<div class="zhaobiao-pop"><p>招标名称：<span>'+json.data.tender_name+'</span></p><p>招标单位：<span>'+json.data.buyer_name+'</span></p></div>',
                            callback: function () {
                                $.ajaxForJson(config.wwwPath + 'ajaxTenderEnroll',{
                                    tenderId: $("input[name='tenderId']").val()
                                },function (dataObj) {
                                    if (dataObj.code === 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: json.msg
                                        });
                                    } else {
                                        $.msgTips({
                                            type: "warning",
                                            content: json.msg
                                        });
                                    }
                                });
                            }
                        });
                    }
                    if (json.data.word === "notVip") {
                        $.cueDialog({
                            allow: false,
                            title: "报名",
                            topWords: ["icon-i",'您所在的企业还不是会员，请先<a href="javascript:;">申请成为会员。</a>'],
                            content: '<div class="zhaobiao-pop"><p>招标名称：<span>'+json.data.tender_name+'</span></p><p>招标单位：<span>'+json.data.buyer_name+'</span></p></div>'
                        });
                    }
                    if (json.data.word === "notInvit") {
                        $.cueDialog({
                            allow: false,
                            title: "报名",
                            topWords: ["icon-i",'抱歉，贵单位不在本次邀请招标的单位之中，无法报名。'],
                            content: '<div class="zhaobiao-pop"><p>招标名称：<span>'+json.data.tender_name+'</span></p><p>招标单位：<span>'+json.data.buyer_name+'</span></p></div>'
                        });
                    }
                }
                else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                }
            });
        } else if (main.attr("data-name") === "bid") {
            // 在线投标
            if ($("input[name='quotation']").val() === "0") {
                $.dialog({
                    title: '在线投标/报价',
                    content: '<div class="online-bid-box"><form class="online-bid-form"><div class="online-bid-item clearfix"><label class="bid-item-title">截止时间：</label><div class="online-bid-block"><span class="dead-time">'+ $("input[name='bidEndTimes']").val() +'</span></div></div><div class="online-bid-item clearfix"><label class="bid-item-title">综合报价：</label><div class="online-bid-block"><input type="text" name="price" class="cjy-input-" placeholder="请输入综合报价"><span> 元</span></div></div><div class="online-bid-item clearfix"><label class="bid-item-title">投标文件：</label><div class="online-bid-block"><span class="js_upload"></span><span class="upload-tips"><i class="iconfont icon-i"></i>提示：支持doc/docx/xls/xlsx/pdf/jpg/jepg/png</span><div id="process-files"></div></div></div><div class="online-bid-item clearfix"><label class="bid-item-title"></label><div class="online-bid-block"><div class="showFileCon"><ul></ul></div></div></div></form><p>请确保您已支付投标保证金，并已在【供应商中心>企业全部投标】中上传评审哦~</p><button class="online-bid-btn">确定投标/报价</button></div>',//<label for="uploadFile2" class="upfile_btn2">上传投标文件</label><input type="file" id="uploadFile2" name="uploadFile">
                    width: 650,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    }
                });
            } else {
                $.dialog({
                    title: '在线投标/报价',
                    content: '<div class="online-bid-box"><form class="online-bid-form"><div class="online-bid-item clearfix"><label class="bid-item-title">截止时间：</label><div class="online-bid-block"><span class="dead-time">'+ $("input[name='bidEndTimes']").val() +'</span></div></div><div class="online-bid-item clearfix"><label class="bid-item-title">投标文件：</label><div class="online-bid-block"><span class="js_upload"></span><span class="upload-tips"><i class="iconfont icon-i"></i>提示：支持doc/docx/xls/xlsx/pdf/jpg/jepg/png</span><div id="process-files"></div></div></div><div class="online-bid-item clearfix"><label class="bid-item-title"></label><div class="online-bid-block"><div class="showFileCon"><ul></ul></div></div></div><a class="go-encroll" href="javascript:;">前往在线填写报价单</a><div class="online-bid-item clearfix"><label class="bid-item-title">综合报价：</label><div class="online-bid-block"><strong>812837.29</strong></div></div></form><button class="online-bid-btn">确定投标/报价</button></div>',
                    width: 650,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    }
                });
            }

            //附件上传
            $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                var html = '<li><input type="hidden" name="file[name][]" value="' + name + '"><input type="hidden" name="file[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
                $(".showFileCon").show();
                $(".showFileCon ul").append(html);

                //删除附件
                $(".showFileCon").find("li a").unbind().bind("click", function () {
                    $(this).parents("li").remove();
                    if ($(".showFileCon li").length <= 0) {
                        $(".showFileCon").hide();
                    }
                    return false;
                });
            }, {
                extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
            });

            // 确定报价
            $(".online-bid-btn").off().on("click", function () {
                var that = $(this);
                if ($.trim($("input[name='price']").val()) === "") {
                    $.msgTips({
                        type: "warning",
                        content: "请输入综合报价"
                    });
                    return false;
                } else if ($("input[name='file[name][]']").length === 0) {
                    $.msgTips({
                        type: "warning",
                        content: "请上传投标文件"
                    });
                    return false;
                }
                var reqData = that.parents(".online-bid-box").find("form").serialize() + '&tenderId=' + $("input[name='tenderId']").val();
                $.ajaxForJson(config.wwwPath + 'ajaxBid', reqData, function (json) {
                    if (dataObj.code === 2000) {
                        $.msgTips({
                            type: "success",
                            content: json.msg
                        });
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: json.msg
                        });
                    }
                });
            });
        }
    });

    // // 附件上传
    // $(document).on("click", ".upfile_btn2", function () {
    //     $("#uploadFile2").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.wwwPath + 'ajaxUploadTenderFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var html = '<li><input type="hidden" name="file[name][]" value="' + dataObj.name + '"><input type="hidden" name="file[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + dataObj.name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
    //                     $(".showFileCon").show();
    //                     $(".showFileCon ul").append(html);

    //                     //删除附件
    //                     $(".showFileCon").find("li a").unbind().bind("click", function () {
    //                         $(this).parents("li").remove();
    //                         if ($(".showFileCon li").length <= 0) {
    //                             $(".showFileCon").hide();
    //                         }
    //                         return false;
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {
    //                 $.msgTips({
    //                     type: "warning",
    //                     content: "文件不正确"
    //                 });
    //             }
    //         });
    //     });
    // });
});