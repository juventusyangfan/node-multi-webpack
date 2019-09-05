require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 注册资金只能数字
    $("input[name='funds']").off().on("input", function () {
        var main = $(this);
        libs.lenNumber(main[0], 3);
    });

    //查看示例图片
    $(".img_demo").unbind().bind("click", function () {
        var path = $(this).find("img").attr("src");
        $.showPhoto(path);
        return false;
    });

    //图片上传
    $(".js_upload").each(function (n) {
        var main = $(this),
            _id = main.attr("id");
        $("#" + _id).uppyUpload("#" + _id, function (name, url) {
            $("#" + _id).parents(".register_block").find(".img_default img").attr("src", config.filePath + url).css("cursor", "pointer").unbind().bind("click", function () {
                var path = $(this).attr("src");
                $.showPhoto(path);
                return false;
            });
            $("#" + _id).parents(".register_block").find("input[type='hidden']").val(url);
        }, {
            allowedFileTypes: ['image/*'],
            processCon: "#process-files-" + _id,
            extArr: ['jpg', 'png', 'jpeg', 'bmp']
        });
    });

    //图片上传
    // $(document).on("click", "#logo,#business_licence_src,#bank_permit_src", function () {
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.accountPath + 'uploadFileForUser',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     $("#" + id).parents(".register_block").find(".img_default img").attr("src", config.filePath + dataObj.data.path).css("cursor", "pointer").unbind().bind("click", function () {
    //                         var path = $(this).attr("src");
    //                         $.showPhoto(path);
    //                         return false;
    //                     });
    //                     $("#" + id).parents(".register_block").find("input[type='hidden']").val(dataObj.data.path);
    //                 } else {
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

    //授权委托书上传
    $("#authorization_src").uppyUpload("#authorization_src", function (name, url) {
        if ($("#authorization_src").parents(".register_block").find(".img_cell").length >= 3) {
            $.msgTips({
                type: "warning",
                content: "最多只能上传3张图片"
            });
            return false;
        }
        $("#authorization_src").parents(".register_block").find(".img_default").hide();
        var imgHTML = '<div class="img_cell"><img src="' + config.filePath + url + '" style="cursor: pointer;"><i class="iconfont icon-cha1"></i><input type="hidden" name="authorization_src[]" value="' + url + '"></div>';
        $("#authorization_src").parents(".register_block").find(".register_img").prepend(imgHTML);
        $("#authorization_src").parents(".register_block").find(".img_cell img").unbind().bind("click", function () {
            var path = $(this).attr("src");
            $.showPhoto(path);
            return false;
        });
        //删除
        $(".img_cell").find("i").unbind().bind("click", function () {
            $(this).parent().remove();
            if ($("#authorization_src").parents(".register_block").find(".img_cell").length <= 0) {
                $("#authorization_src").parents(".register_block").find(".img_default").show();
            }
        });
    }, {
        allowedFileTypes: ['image/*'],
        processCon: "#process-files-authorization_src",
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });
    // //授权委托书上传
    // $(document).on("click", "#authorization_src", function () {
    //     if ($("#authorization_src").parents(".register_block").find(".img_cell").length >= 3) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多只能上传3张图片"
    //         });
    //         return false;
    //     }
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.accountPath + 'uploadFileForUser',
    //             secureuri: config.domainStr,
    //             fileElementId: "authorization_src",
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     $("#authorization_src").parents(".register_block").find(".img_default").hide();
    //                     var imgHTML = '<div class="img_cell"><img src="' + config.filePath + dataObj.data.path + '" style="cursor: pointer;"><i class="iconfont icon-cha1"></i><input type="hidden" name="authorization_src[]" value="' + dataObj.data.path + '"></div>';
    //                     $("#authorization_src").parents(".register_block").find(".register_img").prepend(imgHTML);
    //                     $("#authorization_src").parents(".register_block").find(".img_cell img").unbind().bind("click", function () {
    //                         var path = $(this).attr("src");
    //                         $.showPhoto(path);
    //                         return false;
    //                     });
    //                     //删除
    //                     $(".img_cell").find("i").unbind().bind("click", function () {
    //                         $(this).parent().remove();
    //                         if ($("#authorization_src").parents(".register_block").find(".img_cell").length <= 0) {
    //                             $("#authorization_src").parents(".register_block").find(".img_default").show();
    //                         }
    //                     });
    //                 } else {
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

    //上传资质文件
    if ($("#qualifications_src").length > 0) {
        $("#qualifications_src").uppyUpload("#qualifications_src", function (name, url) {
            if ($("#qualifications_src").parents(".register_block").find(".img_cell").length >= 10) {
                $.msgTips({
                    type: "warning",
                    content: "最多只能上传10张图片"
                });
                return false;
            }
            $("#qualifications_src").parents(".register_block").find(".img_default").hide();
            var imgHTML = '<div class="img_cell"><img src="' + config.filePath + url + '" style="cursor: pointer;"><i class="iconfont icon-cha1"></i><input type="hidden" name="qualifications_src[]" value="' + url + '"></div>';
            $("#qualifications_src").parents(".register_block").find(".register_img").prepend(imgHTML);
            $("#qualifications_src").parents(".register_block").find(".img_cell img").unbind().bind("click", function () {
                var path = $(this).attr("src");
                $.showPhoto(path);
                return false;
            });
            //删除
            $(".img_cell").find("i").unbind().bind("click", function () {
                $(this).parent().remove();
                if ($("#qualifications_src").parents(".register_block").find(".img_cell").length <= 0) {
                    $("#qualifications_src").parents(".register_block").find(".img_default").show();
                }
            });
        }, {
            allowedFileTypes: ['image/*'],
            processCon: "#process-files-qualifications_src",
            extArr: ['jpg', 'png', 'jpeg', 'bmp']
        });
    }
    // //上传资质文件
    // $(document).on("click", "#qualifications_src", function () {
    //     if ($("#qualifications_src").parents(".register_block").find(".img_cell").length >= 10) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多只能上传10张图片"
    //         });
    //         return false;
    //     }
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.accountPath + 'uploadFileForUser',
    //             secureuri: config.domainStr,
    //             fileElementId: "qualifications_src",
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     $("#qualifications_src").parents(".register_block").find(".img_default").hide();
    //                     var imgHTML = '<div class="img_cell"><img src="' + config.filePath + dataObj.data.path + '" style="cursor: pointer;"><i class="iconfont icon-cha1"></i><input type="hidden" name="qualifications_src[]" value="' + dataObj.data.path + '"></div>';
    //                     $("#qualifications_src").parents(".register_block").find(".register_img").prepend(imgHTML);
    //                     $("#qualifications_src").parents(".register_block").find(".img_cell img").unbind().bind("click", function () {
    //                         var path = $(this).attr("src");
    //                         $.showPhoto(path);
    //                         return false;
    //                     });
    //                     //删除
    //                     $(".img_cell").find("i").unbind().bind("click", function () {
    //                         $(this).parent().remove();
    //                         if ($("#qualifications_src").parents(".register_block").find(".img_cell").length <= 0) {
    //                             $("#qualifications_src").parents(".register_block").find(".img_default").show();
    //                         }
    //                     });
    //                 } else {
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

    $(".img_cell img").unbind().bind("click", function () {
        var path = $(this).attr("src");
        $.showPhoto(path);
        return false;
    });
    //删除
    $(".img_cell").find("i").unbind().bind("click", function () {
        $(this).parent().remove();
        if ($("#authorization_src").parents(".register_block").find(".img_cell").length <= 0) {
            $("#authorization_src").parents(".register_block").find(".img_default").show();
        }
    });

    /**
     * 选择物资分类
     * */
    var cataTree = null;
    $(".cata_dlg").unbind().bind("click", function () {
        var dialogHTML = '<div class="classify_dlg"><div class="classify_head"><input type="text" class="classify_search_input" placeholder="请输入物资设备/劳务/专业名称进行查找"><a href="javascript:;" class="classify_search_btn iconfont icon-sousuo"></a><a href="javascript:;" class="classify_search_clear">清除</a></div>';
        dialogHTML += '<div class="classify_body js_material"><div class="classify_nav js_cateOne"></div><div class="classify_nav js_cateTwo"><span class="classify_none">请选择一级分类</span></div><div class="classify_nav js_cateThree"><span class="classify_none">请选择二级分类</span></div></div>';
        dialogHTML += '<div class="classify_search" style="display:none;"></div>';
        dialogHTML += '<div class="classify_result clearfix"><label>您当前选择的分类：</label><div class="classify_result_box clearfix"></div></div>';
        dialogHTML += '</div>';
        $.dialog({
            title: '选择物资分类',
            content: dialogHTML,
            width: 1080,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                var productIdArr = [],
                    productNameArr = [];
                $(".js_material").find(".register_box_cell").each(function () {
                    let _id = $(this).attr("data-id"),
                        _name = $(this).attr("data-name");
                    productIdArr.push(_id);
                    productNameArr.push(_name);
                });

                function initTree() {
                    var cata1HTML = '<ul class="clearfix">',
                        cata2HTML = '<span class="classify_none">请选择一级分类</span>',
                        cata3HTML = '<span class="classify_none">请选择二级分类</span>';

                    for (var i = 0; i < cataTree.length; i++) {
                        cata1HTML += '<li title="' + cataTree[i].label + '" data-id="' + cataTree[i].value + '" data-name="' + cataTree[i].label + '" class=""><a href="javascript:;" class="classify_cell">' + cataTree[i].label + '<i class="iconfont icon-youjiantou floatR"></i></a></li>';

                        cata2HTML += '<ul class="clearfix" style="display:none;">';
                        if (cataTree[i].children.length > 0) {
                            for (var j = 0; j < cataTree[i].children.length; j++) {
                                let act = productIdArr.indexOf(cataTree[i].children[j].value) > -1 ? "act" : "",
                                    hasChild = typeof (cataTree[i].children[j].children) != "undefined" ? 'hasChild' : '',
                                    jtIcon = typeof (cataTree[i].children[j].children) != "undefined" ? '<i class="iconfont icon-youjiantou floatR"></i>' : '',
                                    gouIcon = typeof (cataTree[i].children[j].children) == "undefined" ? '<i class="iconfont icon-gou"></i>' : '';
                                cata2HTML += '<li title="' + cataTree[i].children[j].label + '" data-id="' + cataTree[i].children[j].value + '" data-name="' + cataTree[i].children[j].label + '" data-lvl="' + i + '-' + j + '" class="' + act + hasChild + '"><a href="javascript:;" class="classify_cell">' + gouIcon + cataTree[i].children[j].label + jtIcon + '</a></li>';

                                cata3HTML += '<ul class="clearfix" style="display:none;" level="' + i + '-' + j + '">'
                                if (cataTree[i].children[j].children) {
                                    for (var k = 0; k < cataTree[i].children[j].children.length; k++) {
                                        let act = productIdArr.indexOf(cataTree[i].children[j].children[k].value) > -1 ? "act" : ""
                                        cata3HTML += '<li title="' + cataTree[i].children[j].children[k].label + '" data-id="' + cataTree[i].children[j].children[k].value + '" data-name="' + cataTree[i].children[j].children[k].label + '" class="' + act + '"><a href="javascript:;" class="classify_cell"><i class="iconfont icon-gou"></i>' + cataTree[i].children[j].children[k].label + '</a></li>';
                                    }
                                }

                                cata3HTML += '</ul>';
                            }
                        }

                        cata2HTML += '</ul>';
                    }
                    cata1HTML += '</ul>';
                    $(".js_cateOne").html(cata1HTML);
                    $(".js_cateTwo").html(cata2HTML);
                    $(".js_cateThree").html(cata3HTML);


                    for (var i = 0; i < productIdArr.length; i++) {
                        choseCata(productIdArr[i], productNameArr[i]);
                    }
                }

                if (cataTree) {
                    initTree();
                } else {
                    $.ajaxForJson(config.accountPath + "/catalogTree", null, (dataObj) => {
                        if (dataObj.code == "2000") {
                            cataTree = dataObj.data;
                            initTree();
                        }
                    });
                }

                //选择物资
                $(".js_material").on("click", ".js_cateOne li", function () { //一级物资选择
                    var main = $(this),
                        index = main.index();
                    $(".js_material").find(".js_cateOne").find("li").removeClass("act");
                    main.addClass("act");
                    $(".js_material").find(".js_cateTwo").find(".classify_none").hide();
                    $(".js_material").find(".js_cateTwo").find("ul").hide();
                    $(".js_material").find(".js_cateTwo").find("ul").eq(index).show();
                    $(".js_material").find(".js_cateThree").find(".classify_none").show();
                    $(".js_material").find(".js_cateThree").find("ul").hide();
                    return false;
                });
                $(".js_material").on("click", ".js_cateTwo li", function () { //二级物资选择
                    var main = $(this),
                        level = main.attr("data-lvl");
                    if (main.find("i.icon-gou").length <= 0) {
                        main.parents("ul").find("li.hasChild").removeClass("act");
                        main.addClass("act");
                        $(".js_material").find(".js_cateThree").find(".classify_none").hide();
                        $(".js_material").find(".js_cateThree").find("ul").hide();
                        $(".js_material").find(".js_cateThree").find("ul[level='" + level + "']").show();
                    } else {
                        if (main.hasClass("act")) {
                            main.removeClass("act");
                            $(".classify_result_cell[target_id='" + main.attr("data-id") + "']").remove();
                        } else {
                            main.addClass("act");
                            $(".js_material").find(".js_cateThree").find(".classify_none").show();
                            $(".js_material").find(".js_cateThree").find("ul").hide();
                            choseCata(main.attr("data-id"), main.attr("data-name"));
                        }
                    }
                    return false;
                });
                $(".js_material").on("click", ".js_cateThree li", function () { //三级物资选择
                    var main = $(this);
                    if (main.hasClass("act")) {
                        main.removeClass("act");
                        $(".classify_result_cell[target_id='" + main.attr("data-id") + "']").remove();
                    } else {
                        main.addClass("act");
                        choseCata(main.attr("data-id"), main.attr("data-name"));
                    }
                    return false;
                });

                //选中分类
                function choseCata(id, name) {
                    var cellHtml = '<span class="classify_result_cell" target_id="' + id + '" target_name="' + name + '">' + name + '<input type="hidden" name="product_id[]" value="' + id + '"><i class="iconfont icon-cha1"></i></span>';
                    $(".classify_result_box").append(cellHtml);
                }
                //删除分类
                $(".classify_result_box").on("click", ".classify_result_cell i", function () {
                    var id = $(this).parent().attr("target_id");
                    $(this).parent().remove();
                    $("li[data-id='" + id + "']").removeClass("act");
                    return false;
                });

                //搜索物资
                var timer = null;
                $(".classify_search_input").unbind().bind("input", function () {
                    var main = $(this);
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if ($.trim(main.val()) != "") {
                            $(".classify_body").hide();
                            $.ajaxForJson(config.accountPath + "/catalogSearch", {
                                product_name: $.trim(main.val())
                            }, (dataObj) => {
                                if (dataObj.code == "2000") {
                                    var cellHTML = '';
                                    if (dataObj.data.length <= 0) {
                                        cellHTML = '<p class="page_list_noneCon" style="width: 100%;margin-top: 180px;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p>';
                                    } else {
                                        cellHTML = '<ul class="clearfix">';
                                        for (var i = 0; i < dataObj.data.length; i++) {
                                            var _arr = dataObj.data[i].path.split(">");
                                            var act = $(".classify_result_cell[target_id='" + dataObj.data[i].code + "']").length > 0 ? "act" : "";
                                            cellHTML += '<li data-id="' + dataObj.data[i].code + '" data-name="' + _arr[_arr.length - 1] + '" class="' + act + '"><a href="javascript:;" class="classify_item">';
                                            for (var j = 0; j < _arr.length; j++) {
                                                var _name = _arr[j].replace($.trim(main.val()), '<span class="textOrange">' + $.trim(main.val()) + '</span>');
                                                if (j == 0) {
                                                    cellHTML += '<i class="iconfont icon-gou"></i>';
                                                } else {
                                                    cellHTML += '<i class="iconfont icon-youjiantou"></i>';
                                                }
                                                cellHTML += _name;
                                            }
                                            cellHTML += '</a></li>';
                                        }
                                        cellHTML += '</ul>';
                                    }
                                    $(".classify_search").html(cellHTML).show();
                                }
                            });
                        } else {
                            $(".classify_body").show();
                            $(".classify_search").hide();
                        }
                    }, 500);
                });
                $(".classify_search").on("click", "li", function () { //三级物资选择
                    var main = $(this);
                    if (main.hasClass("act")) {
                        main.removeClass("act");
                        $(".classify_result_cell[target_id='" + main.attr("data-id") + "']").remove();
                    } else {
                        main.addClass("act");
                        choseCata(main.attr("data-id"), main.attr("data-name"));
                    }
                    return false;
                });
                //清除筛选
                $(".classify_search_clear").unbind().bind("click",function(){
                    $(".classify_search_input").val("");
                    $(".classify_body").show();
                    $(".classify_search").html("").hide();
                    return false;
                });

                //确定按钮
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var resultHTML = '';
                    $(".classify_result_box").find(".classify_result_cell").each(function () {
                        resultHTML += '<span class="register_box_cell" data-name="' + $(this).attr("target_name") + '" data-id="' + $(this).attr("target_id") + '">' + $(this).attr("target_name") + '<input type="hidden" name="product_id[]" value="' + $(this).attr("target_id") + '"><i class="iconfont icon-cha1"></i></span>';
                    });
                    $(".js_material .register_box").html(resultHTML).show();
                    $(".cjy-cancel-btn").trigger("click");
                });
            }
        });
        return false;
    });

    //删除元素
    $(".js_material").on("click", ".register_box i.icon-cha1", function () {
        var id = $(this).parent().attr("target_id");
        $(".js_material").find("li[data-id='" + id + "']").removeClass("act");
        $(".js_material").find("li[data-id='" + id + "']").find("i").trigger("click");
        $(this).parent().remove();
        if ($(".js_material").find(".register_box .register_box_cell").length <= 0) {
            $(".js_material").find(".register_box").hide();
        }
    });


    /**
     * 选择经营区域
     * */
    $.ajaxJSONP(config.papiPath + "/api/common/getProvince", null, function (dataObj) {
        if (dataObj.code == "2000") {
            var provinceArr = [];
            $(".js_area").find(".register_box_cell").each(function () {
                var id = $(this).attr("target_id");
                provinceArr.push(id);
            });
            var liHTML = '';
            for (var i = 0; i < dataObj.data.length; i++) {
                var actClass = provinceArr.indexOf(dataObj.data[i].id) > -1 ? "act" : "";
                liHTML += '<li title="' + dataObj.data[i].name + '" data-id="' + dataObj.data[i].id + '" data-name="' + dataObj.data[i].name + '"><i class="iconfont icon-gou ' + actClass + '"></i>' + dataObj.data[i].name + '</li>'
            }
            $(".js_area").find("ul.js_province").show().html(liHTML);
            //选择省市
            var timeObj = null;
            $(".js_area").find("ul.js_province").find("li").unbind().bind("click", function () {
                $(".js_area").find("ul.js_province").find("li").removeClass("act");
                $(this).addClass("act");
                var dataId = $(this).attr("data-id");

                $.ajaxJSONP(config.papiPath + "/api/common/getCity", {
                    pid: dataId
                }, function (obj) {
                    if (obj.code == "2000") {
                        var html = '';
                        var targetIdArr = [];
                        $(".js_area").find(".register_box .register_box_cell[parent_id]").each(function () {
                            var targetId = $(this).attr("target_id");
                            targetIdArr.push(targetId);
                        });
                        for (var i = 0; i < obj.data.length; i++) {
                            var actClass = targetIdArr.indexOf(obj.data[i].id) > -1 ? "act" : "";
                            html += '<li title="' + obj.data[i].name + '" data-id="' + obj.data[i].id + '" data-name="' + obj.data[i].name + '"><i class="iconfont icon-gou ' + actClass + '"></i>' + obj.data[i].name + '</li>';
                        }
                        $(".js_area").find("ul.js_city").show().html(html);
                        if ($(".js_area").find("ul.js_province").find("li.act").find("i").hasClass("act")) {
                            $(".js_area").find("ul.js_city").find("i").addClass("act");
                        } else {
                            $(".js_area").find("ul.js_city").find("i.icon-gou").unbind().bind("click", function () {
                                var id = $(this).parent().attr("data-id"),
                                    name = $(this).parent().attr("data-name"),
                                    cell = "";
                                if ($(this).hasClass("act")) {
                                    $(this).removeClass("act");
                                } else {
                                    $(this).addClass("act");
                                    var parentId = $(".js_area").find("ul.js_province").find("li.act").attr("data-id");
                                    cell += '<span class="register_box_cell" target_id="' + id + '" parent_id="' + parentId + '">' + name + '<input type="hidden" name="scope_operation[]" value="' + id + '"><i class="iconfont icon-cha1"></i></span>';
                                }
                                $(".js_area").find(".register_box_cell[target_id='" + id + "']").remove();
                                $(".js_area").find(".register_box").show().append(cell);
                                if ($(".js_area").find("ul.js_city").find("i").length == $(".js_area").find("ul.js_city").find("i.act").length) {
                                    $(".js_area").find("ul.js_province").find("li.act").find("i").trigger("click");
                                }
                                if ($(".js_area").find(".register_box .register_box_cell").length <= 0) {
                                    $(".js_area").find(".register_box").hide();
                                }
                                return false;
                            });
                        }
                    }
                });
                return false;
            });
            //选中省点击事件
            $(".js_area").find("ul.js_province").find("i.icon-gou").unbind().bind("click", function () {
                var main = $(this);
                var id = main.parent().attr("data-id"),
                    name = main.parent().attr("data-name"),
                    cell = "";
                if (main.hasClass("act")) {
                    main.removeClass("act");
                } else {
                    main.addClass("act");
                    cell = '<span class="register_box_cell" target_id="' + id + '">' + name + '<input type="hidden" name="scope_operation[]" value="' + id + '"><i class="iconfont icon-cha1"></i></span>';
                }
                main.parent().trigger("click");
                $(".js_area").find(".register_box_cell[target_id='" + id + "']").remove();
                $(".js_area").find(".register_box_cell[parent_id='" + id + "']").remove();
                $(".js_area").find(".register_box").show().append(cell);
                if ($(".js_area").find(".register_box .register_box_cell").length <= 0) {
                    $(".js_area").find(".register_box").hide();
                }
                return false;
            });
        }
    });
    //选择物资的展开收起
    $(".js_area").find(".multiple-title").unbind().bind("click", function () {
        if ($(".js_area").hasClass("js_selected")) {
            $(".js_area").removeClass("js_selected");
        } else {
            $(".js_area").addClass("js_selected");
        }
        return false;
    });
    //删除元素
    $(".js_area").on("click", ".register_box i.icon-cha1", function () {
        var targetId = $(this).parent().attr("target_id");
        $(".js_area").find("ul.js_province").find("li[data-id='" + targetId + "']").find("i").trigger("click");
        $(".js_area").find("ul.js_city").find("li[data-id='" + targetId + "']").find("i").removeClass("act");
        $(this).parent().remove();
        if ($(".js_area").find(".register_box .register_box_cell").length <= 0) {
            $(".js_area").find(".register_box").hide();
        }
    });
    //确认区域选择
    $(".js_area").on("click", ".area-confirm", function () {
        $(".js_area").removeClass("js_selected");
        return false;
    });

    //点击空白区隐藏下拉框
    $(document).click(function (e) {
        var _con = $('.js_material,.js_area'); // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
            $('.js_material,.js_area').removeClass("js_selected");
        }
    });


    //提交表单
    var ajaxKey = true;
    $(".btn_confirm").unbind().bind("click", function () {
        if ($.trim($("input[name='company_name']").val()) == "") {
            $("input[name='company_name']").initInput("error", "请填写公司名称");
            $("input[name='company_name']").unbind().bind("blur", function () {
                $("input[name='company_name']").initInput();
            });
            return false;
        } else if ($("input[name='funds']").length > 0 && ($.trim($("input[name='funds']").val()) == "" || !libs.checkNumber($("input[name='funds']").val()))) {
            $("input[name='funds']").initInput("error", "请填写注册资金（纯数字）");
            $("input[name='funds']").unbind().bind("blur", function () {
                $("input[name='funds']").initInput();
            });
            return false;
        } else if ($("select[name='company_type']").length > 0 && $("select[name='company_type']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择企业类型"
            });
            return false;
        } else if ($("select[name='taxpayer_type']").length > 0 && $("select[name='taxpayer_type']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择纳税人类型"
            });
            return false;
        } else if ($("input[name='company_phone']").length > 0 && $.trim($("input[name='company_phone']").val()) == "") {
            $("input[name='company_phone']").initInput("error", "请填写公司联系方式");
            $("input[name='company_phone']").unbind().bind("blur", function () {
                $("input[name='company_phone']").initInput();
            });
            return false;
        } else if ($("input[name='detail_address']").length > 0 && $.trim($("input[name='detail_address']").val()) == "") {
            $("input[name='detail_address']").initInput("error", "请填写公司地址");
            $("input[name='detail_address']").unbind().bind("blur", function () {
                $("input[name='detail_address']").initInput();
            });
            return false;
        } else if ($("input[name='credit_code']").length > 0 && ($.trim($("input[name='credit_code']").val()) == "" || !libs.checkCode($.trim($("input[name='credit_code']").val())))) {
            $("input[name='credit_code']").initInput("error", "请输入正确的统一社会信用代码");
            $("input[name='credit_code']").unbind().bind("blur", function () {
                $("input[name='credit_code']").initInput();
            });
            return false;
        } else if ($("input[name='bank_permit_src']").length > 0 && $("input[name='bank_permit_src']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请上传开户银行许可证"
            });
            return false;
        } else if ($("input[name='business_licence_src']").length > 0 && $("input[name='business_licence_src']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请上传营业执照"
            });
            return false;
        } else if ($("input[name='authorization_src']").length > 0 && $("input[name='authorization_src']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请上传公司授权书"
            });
            return false;
        }
        if (ajaxKey) {
            var reqUrl = config.accountPath + $("form").attr("action"),
                reqData = $("form").serialize();
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == 2000) {
                    setTimeout(function () {
                        window.location.href = dataObj.data.url;
                    }, 1000);
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    ajaxKey = true;
                }
            });
        }
        ajaxKey = false;
        return false;
    });
});