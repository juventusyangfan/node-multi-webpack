require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    $(".cate_wrap").on("click", "li.cate_item", function () {
        var main = $(this);
        var cateId = main.find("a.cate_link").attr("data-id"),
            index = main.parents(".cate_inner").index(),
            reqUrl = config.shopPath + '/Seller/Goods/categorySelectAjax',
            reqData = null;

        main.parent().find("li.cate_item").removeClass("cate_active");
        main.addClass("cate_active");
        if (index == 0) {
            reqData = {
                first_category_id: cateId
            };
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == "2000") {
                    var listHTML = '<ul class="cate_menu">';
                    for (var key in dataObj.data) {
                        listHTML += '<li class="cate_item"><a class="cate_link ellipsis" href="javascript:;" data-id=' + key + '>' + dataObj.data[key] + '</a><i class="iconfont icon-youjiantou"></i></li>';
                    }
                    listHTML += '</ul>';
                    $(".cate_wrap").find(".cate_inner").eq(1).html(listHTML);
                    $(".cate_wrap").find(".cate_inner").eq(2).html('<p>请先选择二级分类</p>');
                    $(".next_box").find("a").removeClass("next_btn").unbind("click");
                    $(".cate_result").find("b").html($(".cate_wrap").find(".cate_inner").eq(0).find(".cate_active a").html());
                }
            });
        }
        else if (index == 1) {
            reqData = {
                product_pid: cateId
            };
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == "2000") {
                    var listHTML = '<ul class="cate_menu">';
                    for (var key in dataObj.data) {
                        listHTML += '<li class="cate_item"><a class="cate_link ellipsis" href="javascript:;" data-id=' + key + '>' + dataObj.data[key] + '</a><i class="iconfont icon-gou"></i></li>';
                    }
                    listHTML += '</ul>';
                    $(".cate_wrap").find(".cate_inner").eq(2).html(listHTML);
                    $(".next_box").find("a").removeClass("next_btn").unbind("click");
                    $(".cate_result").find("b").html($(".cate_wrap").find(".cate_inner").eq(0).find(".cate_active a").html() + '&nbsp;&gt;&nbsp;' + $(".cate_wrap").find(".cate_inner").eq(1).find(".cate_active a").html());
                }
            });
        }
        else if (index == 2) {
            $(".cate_result").find("b").html($(".cate_wrap").find(".cate_inner").eq(0).find(".cate_active a").html() + '&nbsp;&gt;&nbsp;' + $(".cate_wrap").find(".cate_inner").eq(1).find(".cate_active a").html() + '&nbsp;&gt;&nbsp;' + $(".cate_wrap").find(".cate_inner").eq(2).find(".cate_active a").html());
            $(".next_box").find("a").addClass("next_btn").unbind().bind("click", function () {
                window.location.href = "/Seller/Goods/addGoods?category_id=" + cateId;
            })
        }
    });

        //上传清单弹框
        $("#goods_list").unbind().bind("click", function () {
            var listName = "",
                listPath = "";
            var goodsListHTML = '<div class="payment-box clearfix"><div class="payment-content"><div class="payment-region clearfix"><div class="payment-area"><span class="js_upload"></span></div></div><div id="process-files-dlg" style="width: 480px;margin-top: 10px;"></div><ul class="payment-list" style="display:none;"></ul></div></div>';//<label class="upload-payment">上传文件<input type="file" name="uploadFile" id="uploadVoucher" style="position: absolute;width: 100%;height: 100%;top: 0;right: 0;opacity: 0;cursor: pointer;"></label>
    
            $.dialog({
                title: "上传清单",
                content: goodsListHTML,
                cancel: {
                    show: true,
                    name: "取消"
                },
                callback: function callback() {
                    //图片上传
                    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                        listName = name;
                        listPath = url;
                        var html = '<li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" target="_blank" href="' + config.filePath + url + '" title="' + name + '">' + name + '</a></li>';
                        $(".payment-content ul").show().html(html);
                    }, {
                        processCon: "#process-files-dlg",
                        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
                    });
                    $(".cjy-confirm-btn").unbind().bind("click", function () {
                        if (listName == "" && listPath == "") {
                            $.msgTips({
                                type: "warning",
                                content: "请上传清单后再点击确认！"
                            });
                            return false;
                        }
                        $.ajaxForJson(config.shopPath + 'commodities', {
                            name: listName,
                            path: listPath
                        }, function (dataObj) {
                            if (dataObj.code == "2000") {
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
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
                        return false;
                    });
                }
            });
            return false;
        });

    //上传清单弹框
    $("#upBill").unbind().bind("click", function () {
        var listName = "", listPath = "";
        var goodsListHTML = '<div class="payment-box clearfix"><div class="payment-content"><div class="payment-region clearfix"><div class="payment-area"><span class="js_upload"></span></div></div><div id="process-files-dlg" style="width: 480px;margin-top: 10px;"></div><ul class="payment-list" style="display:none;"></ul></div></div>'//<label class="upload-payment">上传文件<input type="file" name="uploadFile" id="uploadVoucher" style="position: absolute;width: 100%;height: 100%;top: 0;right: 0;opacity: 0;cursor: pointer;"></label>

        $.dialog({
            title: "上传清单",
            content: goodsListHTML,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                    listName = name;
                    listPath = url;
                    var html = '<li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" target="_blank" href="' + config.filePath + url + '" title="' + name + '">' + name + '</a></li>';
                    $(".payment-content ul").show().html(html);
                }, {
                    processCon: "#process-files-dlg",
                    extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
                });
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if (listName == "" && listPath == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请上传清单后再点击确认！"
                        });
                        return false;
                    }
                    $.ajaxForJson(config.shopPath + 'commodities', {
                        name: listName,
                        path: listPath
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
                            });
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
            }
        });
        return false;
    });
});