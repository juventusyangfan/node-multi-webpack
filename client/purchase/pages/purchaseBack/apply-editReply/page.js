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
                            for (var i = 0; i < jData.length; i++) {
                                liHtml += '<li class="cate_item"><i class="iconfont icon-gou"></i><a class="cate_link ellipsis" product_code=' + jData[i].code + ' product_pid="' + jData[i].pid + '" href="javascript:;">' + jData[i].name + '</a><i class="iconfont icon-youjiantou" style="display:none;"></i></li>';
                            }
                            liHtml += '</ul>';
                            $(".cate_inner").eq(1).html(liHtml);
                            main.parents(".cate_menu").find(".cate_active").removeClass("cate_active");
                            main.addClass("cate_active");
                            var sort = $(".sort_box").find(".sort_item");
                            for (var j = 0; j < sort.length; j++) {
                                var curEl = $(".cate_link[product_code='" + sort.eq(j).attr("product_code") + "']");
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
        var stepVal = parseInt(main.attr("step_val"));

        if ($(".sort_item").length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请选择商品类目！"
            });
            return false;
        } else {
            $(".step" + stepVal).hide();
            $(".step" + (stepVal + 1)).show();
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

    // // 上传文件
    // $(document).on("click", ".uploadImg", function () {
    //     if ($(".applyentry_cell").length >= 11) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传11份材料"
    //         });
    //         return false;
    //     }
    //     $("#logo").unbind().bind("change", function () {
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
    //                     var shtml = '<div class="applyentry_cell"><img src="' + config.filePath + dataObj.data + '"><a href="javascript:;" class="iconfont icon-cha1"></a><input type="hidden" name="filePath" value="' + dataObj.data + '"></div>';
    //                     $(".applyentry_con").prepend(shtml);
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.message
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {}
    //         });
    //     });
    // });
    //图片上传
    $(".uploadImg").uppyUpload(".uploadImg", function (name, url) {
        if ($(".applyentry_cell").length >= 11) {
            $.msgTips({
                type: "warning",
                content: "最多上传10份材料"
            });
            return false;
        }
        var shtml = '<div class="applyentry_cell"><img src="' + config.filePath + url + '"><a href="javascript:;" class="iconfont icon-cha1"></a><input type="hidden" name="filePath" value="' + url + '"></div>'
        $(".applyentry_con").prepend(shtml);
    }, {
        allowedFileTypes: ['image/*'],
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });

    //删除附件
    $(".applyentry_con").on("click", ".icon-cha1", function () {
        $(this).parents(".applyentry_cell").remove();
    });

    // 查看大图
    $(".applyentry_con").on("click", "img", function () {
        $.showPhoto($(this).attr("src"));
    });

    // 上一步
    $(".applyentry_btn_up").off().on("click", function () {
        var main = $(this);
        var stepVal = parseInt(main.attr('step_val'));
        $(".step" + stepVal).hide();
        $(".step" + (stepVal - 1)).show();
    });

    //查看资质文件类型
    $(".applyentry_tips a").unbind().bind("click", function () {
        var dialogHTML = '<div class="material_list clearfix"><table><colgroup><col width="100"><col width="400"></colgroup><thead><tr><th>序号</th><th>入驻资质文件名称</th></tr></thead><tbody><tr><td>1</td><td>经销代理资格证明</td></tr><tr><td>2</td><td>经营许可证</td></tr><tr><td>3</td><td>生产许可证</td></tr><tr><td>4</td><td>安全生产许可证</td></tr><tr><td>5</td><td>质量认证证书</td></tr><tr><td>6</td><td>品牌所有权证书或授权书</td></tr><tr><td>7</td><td>职业健康安全认证证书</td></tr><tr><td>8</td><td>环境管理体系认证证书</td></tr><tr><td>9</td><td>特殊行业资质证书</td></tr><tr><td>10</td><td>原产地证明公司</td></tr><tr><td>11</td><td>其他资质及荣誉文件</td></tr></tbody></table></div>';
        $.dialog({
            title: '资质文件名称',
            content: dialogHTML,
            width: 600,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function callback() {}
        });
        return false;
    });

    // 去签署协议
    $(".applyentry_btn_go").off().on("click", function () {
        var main = $(this);
        var stepVal = parseInt(main.attr('step_val'));

        if (stepVal == 3) {
            //提交
            console.log(1);
            //step1
            var codeArr = [],
                pidArr = [],
                fileArr = [];
            for (var i = 0; i < $(".sort_item").length; i++) {
                codeArr.push($(".sort_item").eq(i).attr("product_code"));
                pidArr.push($(".sort_item").eq(i).attr("product_pid"));
            }

            //step2
            var len = $(".applyentry_cell").length;

            // if (len <= 1) {
            //     $.msgTips({
            //         type: "warning",
            //         content: "请上传资质文件！",
            //     });
            //     return false;
            // }

            for (var i = 0; i < len - 1; i++) {
                fileArr.push($(".applyentry_cell").eq(i).find("input").val());
            }

            var reqData = {
                product_pid: pidArr,
                product_code: codeArr,
                qualifications_src: fileArr,
            };

            //publish
            $.ajaxForJson(config.shopPath + 'editReplyPost', reqData, function (json) {
                if (json.code === 2000) {
                    location.href = '/' + json.data.url;
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                    return false;
                }
            });


        } else {
            $(".step" + stepVal).hide();
            $(".step" + (stepVal + 1)).show();
        }
    });
});