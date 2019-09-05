require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    //满意度打分
    var timer = null;
    $(".back_star_con i").unbind().bind({
        mouseover: function () {
            clearTimeout(timer);
            var index = $(this).index(),
                starCon = $(this).parent();
            starCon.find("i").removeClass("act");
            for (var i = 0; i <= index; i++) {
                starCon.find("i").eq(i).addClass("act");
            }
        },
        mouseout: function () {
            var starCon = $(this).parent(),
                point = starCon.attr("point");
            timer = setTimeout(function () {
                starCon.find("i").removeClass("act");
                for (var i = 1; i <= parseInt(point); i++) {
                    starCon.find("i").eq(i - 1).addClass("act");
                }
            }, 200);
        },
        click: function () {
            var index = $(this).index() + 1;
            $(this).parent().attr("point", index);
            var des = "";
            switch (index) {
                case 1:
                    des = "非常不满意";
                    break;
                case 2:
                    des = "不满意";
                    break;
                case 3:
                    des = "一般";
                    break;
                case 4:
                    des = "满意";
                    break;
                case 5:
                    des = "非常满意";
                    break;
            }
            $(this).parents(".back_comment_star").find(".starTxt").show().html(index + "星");
            $(this).parents(".back_comment_star").find(".starDes").show().html(des);
        }
    });

    //图片上传
    $(".js_upload").each(function (n) {
        var main = $(this),
            _id = main.attr("id");
        $("#" + _id).uppyUpload("#" + _id, function (name, url) {
            if (main.parents(".back_comment_imgs").find(".back_imgs_cell").length >= 9) {
                $.msgTips({
                    type: "warning",
                    content: "最多上传9张图片"
                });
                return false;
            }
            main.parents(".back_comment_imgs").before('<a href="javascript:;" class="back_imgs_cell"><i class="imgs_del iconfont icon-cha1"></i><img src="' + config.filePath + url + '"><input type="hidden" name="picPath" value="' + url + '"></a>');
        }, {
            allowedFileTypes: ['image/*'],
            processCon: "#process-files" + n,
            extArr: ['jpg', 'png', 'jpeg', 'bmp']
        });
    });

    // //图片上传
    // $(document).on("click", "input[name='uploadFile']", function () {
    //     if ($(this).parents(".back_comment_imgs").find(".back_imgs_cell").length >= 9) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传9张图片"
    //         });
    //         return false;
    //     }
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.shopPath + 'uploadImg',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     $("#" + id).parents(".back_imgs_add").before('<a href="javascript:;" class="back_imgs_cell"><i class="imgs_del iconfont icon-cha1"></i><img src="' + config.filePath + dataObj.data + '"><input type="hidden" name="picPath" value="' + dataObj.data + '"></a>');
    //                     $(".back_comment_con").on("click", ".imgs_del", function () {
    //                         $(this).parent().remove();
    //                         return false;
    //                     });
    //                 }
    //                 else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.msg
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {
    //                 $.msgTips({
    //                     type: "warning",
    //                     content: "系统错误"
    //                 });
    //             }
    //         });
    //     });
    // });

    //删除图片
    $(".back_comment_con").on("click", ".imgs_del", function () {
        $(this).parent().remove();
        return false;
    });

    //提交评论
    $(".comment_add").unbind().bind("click", function () {
        var evaluateArr = [],
            orderId = $("input[name='order_id']").val(),
            ajaxKey = true;
        if ($(".cjy-textarea-error").length > 0) {
            $.msgTips({
                type: "warning",
                content: "评论文字过长"
            });
            return false;
        }
        $(".back_comment_cell").each(function () {
            var main = $(this);
            var productId = main.attr("product_id"),
                goodsId = main.attr("goods_id"),
                level = main.find(".back_star_con").attr("point"),
                describe = main.find(".cjy-textarea").val();
            if (level == "0") {
                ajaxKey = false;
                return false;
            }
            var describeArr = [];
            for (var i = 0; i < main.find("input[name='picPath']").length; i++) {
                describeArr.push(main.find("input[name='picPath']").eq(i).val());
            }
            obj = {
                order_id: orderId,
                product_id: productId,
                goods_id: goodsId,
                satisfaction_level: level,
                describe: describe,
                describe_url: describeArr
            }
            evaluateArr.push(obj);
        });
        if (ajaxKey) {
            $.ajaxForJson(config.shopPath + "/evaluate/add", {
                evaluate: evaluateArr
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg
                    });
                    setTimeout(function () {
                        window.location.href = dataObj.data.url;
                    }, 1000);
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
            });
        } else {
            $.msgTips({
                type: "warning",
                content: "请评论完所有商品"
            });
        }
        return false;
    });
});