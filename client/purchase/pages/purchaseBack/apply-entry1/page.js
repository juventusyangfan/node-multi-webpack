require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    // 获取二级分类
    $(".cate_wrap").off().on("click", ".cate_item", function () {
        var main = $(this);
        if (main.parents(".cate_inner").index() < 2) {
            var propid = main.find("a").attr("product_pid");
            var proCode = main.find("a").attr("product_code");
            var aName = main.find("a").html();
            if (main.parents(".cate_menu").hasClass("offset_margin")) {
                // 二级
                if (main.hasClass("cate_active")) {
                    main.removeClass("cate_active");
                    $(".sort_item[product_code='" + proCode + "']").remove();
                } else {
                    main.addClass("cate_active");
                    $(".sort_box").append('<b class="sort_item" product_code=' + proCode + ' product_pid="' + propid + '">' + aName + '<i class="iconfont icon-cha1"></i></b>');
                }
            } else {
                // 一级
                if (!main.hasClass("cate_active")) {
                    $.ajaxForJson(config.shopPath + 'catlist', {
                        id: proCode
                    }, function (json) {
                        if (json.code === 2000) {
                            var jData = json.data;
                            liHtml = '<ul class="cate_menu offset_margin">';
                            for (let i = 0; i < jData.length; i++) {
                                liHtml += '<li class="cate_item"><i class="iconfont icon-gou"></i><a class="cate_link ellipsis" product_code=' + jData[i].code + ' product_pid="' + jData[i].pid + '" href="javascript:;">' + jData[i].name + '</a><i class="iconfont icon-youjiantou" style="display:none;"></i></li>'
                            }
                            liHtml += '</ul>';
                            $(".cate_inner").eq(1).html(liHtml);
                            main.parents(".cate_menu").find(".cate_active").removeClass("cate_active");
                            main.addClass("cate_active");
                            var sort = $(".sort_box").find(".sort_item");
                            for (let j = 0; j < sort.length; j++) {
                                var curEl = $(".cate_link[product_code='" + sort.eq(j).attr("product_code") + "']")
                                curEl.parents(".cate_item").addClass("cate_active");
                            }
                        }
                    });
                }
            }
        }
    });
    var timer = null;
    //获取三级分类
    $(".cate_wrap").off("mouseover").on("mouseover", ".offset_margin .cate_item", function () {
        var main = $(this);
        var proCode = main.find("a").attr("product_code");
        main.parents(".offset_margin").find("i.icon-youjiantou").hide();
        main.find("i.icon-youjiantou").show();
        main.parents(".offset_margin").find(".cate_item").removeClass("mouseShow");
        main.addClass("mouseShow");
        clearTimeout(timer);
        timer = setTimeout(function () {
            $.ajaxForJson(config.shopPath + 'catlist', {
                id: proCode
            }, function (json) {
                if (json.code === 2000) {
                    var jData = json.data;
                    liHtml = '<ul class="cate_menu">';
                    for (let i = 0; i < jData.length; i++) {
                        liHtml += '<li class="cate_item" style="cursor: help;"><a class="cate_link ellipsis" product_code=' + jData[i].code + ' product_pid="' + jData[i].pid + '" href="javascript:;" style="cursor: help;">' + jData[i].name + '</a></li>'
                    }
                    liHtml += '</ul>';
                    $(".cate_inner").eq(2).html(liHtml);
                }
            });
        }, 200);
    });

    // 删除类目
    $(".sort_box").off().on("click", ".icon-cha1", function () {
        $(this).parents(".sort_item").remove();
    });

    // 跳转
    $(".next_box").off().on("click", ".next_btn", function () {
        var main = $(this);
        if ($(".sort_item").length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请选择商品类目！",
            });
            return false;
        } else {
            var codeArr = [],
                pidArr = [],
                reqData = {};;
            var admissionId = main.attr("data-id");
            for (let i = 0; i < $(".sort_item").length; i++) {
                codeArr.push($(".sort_item").eq(i).attr("product_code"));
                pidArr.push($(".sort_item").eq(i).attr("product_pid"));
            }
            if (admissionId !== "0") {
                reqData = {
                    admission_id: admissionId,
                    product_pid: pidArr,
                    product_code: codeArr,
                    step: main.attr("step_val")
                };
            } else {
                reqData = {
                    product_pid: pidArr,
                    product_code: codeArr,
                    step: main.attr("step_val")
                };
            }
            $.ajaxForJson(config.shopPath + 'admissionPost', reqData, function (json) {
                if (json.code === 2000) {
                    location.href = '/' + json.data.url;
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg,
                    });
                    return false;
                }
            });
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
                // $(document).on("click", "#uploadVoucher", function () {
                //     $("#uploadVoucher").unbind().bind("change", function () {
                //         var id = $(this).attr("id");
                //         document.domain = config.domainStr;
                //         $.ajaxFileUpload({
                //             url: config.shopPath + 'uploadFile',
                //             secureuri: config.domainStr,
                //             fileElementId: id,
                //             data: {
                //                 name: "uploadFile"
                //             },
                //             success: function success(data) {
                //                 var dataObj = eval('(' + data + ')');
                //                 if (dataObj.code == 2000) {
                //                     listName = dataObj.name;
                //                     listPath = dataObj.data;
                //                     var html = '<li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" target="_blank" href="' + config.filePath + dataObj.data + '" title="' + dataObj.name + '">' + dataObj.name + '</a></li>';
                //                     $(".payment-content ul").show().html(html);
                //                 } else {
                //                     $.msgTips({
                //                         type: "warning",
                //                         content: dataObj.message
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
});