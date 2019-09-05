require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    // //图片上传
    // $(document).on("click", "#logo", function () {
    //     $("input[name='uploadFile']").unbind().bind("change", function () {
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.accountPath + 'uploadFileForUser',
    //             secureuri: config.domainStr,
    //             fileElementId: "logo",
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     $("#logo").parents(".company_block").find("img").attr("src", config.filePath + dataObj.data.path).css("cursor", "pointer").unbind().bind("click", function () {
    //                         var path = $(this).attr("src");
    //                         $.showPhoto(path);
    //                         return false;
    //                     });
    //                     $("#logo").parents(".company_block").find("input[type='hidden']").val(dataObj.data.path);
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
    //修改基本信息
    $("#change_company").unbind().bind("click", function () {
        //编辑logo
        var logoUrl = $("img[name='logo']").attr("data-url");
        var logoHTML = '<div class="company_block"><span id="logo"></span><span class="noticeCon"><span class="noticeBg"><i class="iconfont icon-i"></i></span>支持jpg / jepg / png</span><div id="process-files-logo"></div><div class="company_img">';//<a class="company_btn" style="position: relative;" href="javascript:;">点击上传<input name="uploadFile" id="logo" style="position: absolute;width: 100%;height: 100%;top: 0;right: 0;opacity: 0;cursor: pointer;" type="file" accept="image/*"></a>
        if (logoUrl != "") {
            logoHTML += '<img src="' + config.filePath + logoUrl + '">';
        } else {
            logoHTML += '<img src="' + config.staticPath + 'account/static/img/4c58bb6c3601848d2c2bde905fd9f165.png">';
        }
        logoHTML += '<input name="logo" type="hidden" value="' + logoUrl + '"></div></div>';
        $("img[name='logo']").replaceWith(logoHTML);
        $("#logo").parents(".company_block").find("img").unbind().bind("click", function () {
            var path = $(this).attr("src");
            $.showPhoto(path);
            return false;
        });
        //图片上传
        $("#logo").uppyUpload("#logo", function (name, url) {
            $("#logo").parents(".company_block").find("img").attr("src", config.filePath + url).css("cursor", "pointer").unbind().bind("click", function () {
                var path = $(this).attr("src");
                $.showPhoto(path);
                return false;
            });
            $("#logo").parents(".company_block").find("input[type='hidden']").val(url);
        }, {
            allowedFileTypes: ['image/*'],
            processCon: "#process-files-logo",
            extArr: ['jpg', 'png', 'jpeg', 'bmp']
        });

        //编辑公司规模
        var sizeArr = [{
            key: "1",
            val: "50人以下"
        }, {
            key: "2",
            val: "50-150人"
        }, {
            key: "3",
            val: "151-500人"
        }, {
            key: "4",
            val: "501-1000人"
        }, {
            key: "5",
            val: "1000人以上"
        }];
        var sizeSel = '',
            selVal = "";
        for (var i = 0; i < sizeArr.length; i++) {
            if (sizeArr[i].val == $("label[name='size']").html()) {
                selVal = sizeArr[i].key;
            }
            sizeSel += '<option value="' + sizeArr[i].key + '">' + sizeArr[i].val + '</option>';
        }
        var sizeHTML = '<div class="company_block"><select name="size" value = "' + selVal + '"><option  value="">请选择员工人数</option>' + sizeSel + '</select></div>';
        $("label[name='size']").replaceWith(sizeHTML);
        $("select[name='size']").initSelect();

        //编辑类型
        var companyTypeArr = [];
        if ($("input[name='app_type']").val() == "2") {
            companyTypeArr = [{
                key: "1",
                val: "银行公司"
            }, {
                key: "2",
                val: "机构公司"
            }, {
                key: "3",
                val: "保理公司"
            }, {
                key: "4",
                val: "融资租赁公司"
            }];
        } else {
            companyTypeArr = [{
                    key: "1",
                    val: "国有企业"
                }, {
                    key: "2",
                    val: "集体企业"
                }, {
                    key: "3",
                    val: "股份合作企业"
                }, {
                    key: "4",
                    val: "联营企业"
                }, {
                    key: "5",
                    val: "有限责任公司"
                }, {
                    key: "6",
                    val: "股份有限公司"
                }, {
                    key: "7",
                    val: "私营企业"
                }, {
                    key: "8",
                    val: "其他企业"
                }, {
                    key: "9",
                    val: "港、澳、台商投资企业"
                }, {
                    key: "10",
                    val: "合资经营企业（港或澳、台资）"
                }, {
                    key: "11",
                    val: "合作经营企业（港或澳、台资）"
                }, {
                    key: "12",
                    val: "港、澳、台商独资经营企业"
                }, {
                    key: "13",
                    val: "港、澳、台商投资股份有限公司"
                }, {
                    key: "14",
                    val: "外商投资企业"
                }, {
                    key: "15",
                    val: "中外合资经营企业"
                }, {
                    key: "16",
                    val: "中外合作经营企业"
                }, {
                    key: "17",
                    val: "外商独资股份有限公司"
                },
                {
                    key: "18",
                    val: "事业单位"
                },
                {
                    key: "19",
                    val: "个体户"
                }
            ];
        }
        var companyTypeSel = '',
            companyTypeVal = "";
        for (var i = 0; i < companyTypeArr.length; i++) {
            if (companyTypeArr[i].val == $("label[name='company_type']").html()) {
                companyTypeVal = companyTypeArr[i].key;
            }
            companyTypeSel += '<option value="' + companyTypeArr[i].key + '">' + companyTypeArr[i].val + '</option>';
        }
        var companyTypeHTML = '<div class="company_block"><select name="company_type" value = "' + companyTypeVal + '"><option  value="">请选择企业类型</option>' + companyTypeSel + '</select></div>';
        $("label[name='company_type']").replaceWith(companyTypeHTML);
        $("select[name='company_type']").initSelect();

        //编辑年营业额
        var businessVolumeArr = [{
            key: "1",
            val: "100万以下"
        }, {
            key: "2",
            val: "100万-500万"
        }, {
            key: "3",
            val: "500万-1000万"
        }, {
            key: "4",
            val: "1000万-5000万"
        }, {
            key: "5",
            val: "5000万-1亿"
        }, {
            key: "6",
            val: "1亿-10亿"
        }, {
            key: "7",
            val: "10亿以上"
        }];
        var businessVolumeSel = '',
            businessVolumeVal = "";
        for (var i = 0; i < businessVolumeArr.length; i++) {
            if (businessVolumeArr[i].val == $("label[name='business_volume']").html()) {
                businessVolumeVal = businessVolumeArr[i].key;
            }
            businessVolumeSel += '<option value="' + businessVolumeArr[i].key + '">' + businessVolumeArr[i].val + '</option>';
        }
        var businessVolumeHTML = '<div class="company_block"><select name="business_volume" value = "' + businessVolumeVal + '"><option  value="">请选择年营业额</option>' + businessVolumeSel + '</select></div>';
        $("label[name='business_volume']").replaceWith(businessVolumeHTML);
        $("select[name='business_volume']").initSelect();

        //联系电话
        var companyPhone = $("label[name='company_phone']").html();
        $("label[name='company_phone']").replaceWith('<div class="company_block"><input name="company_phone" class="cjy-input-" type="text" value="' + companyPhone + '"></div>');

        //公司地址
        var areaObj = $("label[province_code]");
        var provinceCode = areaObj.attr("province_code"),
            cityCode = areaObj.attr("city_code"),
            areaCode = areaObj.attr("area_code");
        areaObj.replaceWith('<div class="company_block"><div cjy-area province="' + provinceCode + '" city="' + cityCode + '" area="' + areaCode + '"></div></div>');
        $("[cjy-area]").initAreaSelect();

        //详细地址
        var detailAddress = $("label[name='detail_address']").html();
        $("label[name='detail_address']").replaceWith('<div class="company_block"><input name="detail_address" class="cjy-input-" type="text" value="' + detailAddress + '"></div>');

        /**
         * 选择物资分类
         * */
        var proSpanObj = $("div[name='product']").find(".back_box_cell");
        var boxShow = proSpanObj.length > 0 ? "display:block;" : "";
        var productHTML = '<div class="company_block js_material"><a href="javascript:;" class="company_btn cata_dlg">点击选择</a><span class="noticeCon"><span class="noticeBg"><i class="iconfont icon-i"></i></span>完善供应物资信息可以让采购商更加容易找到企业</span><div class="register_box clearfix" style="' + boxShow + '">';
        for (var i = 0; i < proSpanObj.length; i++) {
            productHTML += '<span class="register_box_cell" data-name="' + proSpanObj.eq(i).html() + '" data-id="' + proSpanObj.eq(i).attr("product_id") + '">' + proSpanObj.eq(i).html() + '<input type="hidden" name="product_id[]" value="' + proSpanObj.eq(i).attr("product_id") + '"><i class="iconfont icon-cha1"></i></span>';
        }
        productHTML += '</div></div>';
        $("div[name='product']").replaceWith(productHTML);

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
        var opeSpanObj = $("div[name='operation']").find(".back_box_cell");
        var boxShow = opeSpanObj.length > 0 ? "display:block;" : "";
        var operationHTML = '<div class="company_block js_area"><div class="multiple-title"><span>请选择经营区域</span><i class="iconfont icon-xiajiantou"></i></div><div class="multiple-content"><ul class="area-list floatL js_province"></ul><ul class="area-list floatL js_city"></ul><div class="clear"></div><div class="area-btns"><a class="area-confirm" href="javascript:;">确定</a></div></div><div class="register_box clearfix" style="' + boxShow + '">';
        for (var i = 0; i < opeSpanObj.length; i++) {
            operationHTML += '<span class="register_box_cell" target_id="' + opeSpanObj.eq(i).attr("scope_operation") + '">' + opeSpanObj.eq(i).html() + '<input name="scope_operation[]" type="hidden" value="' + opeSpanObj.eq(i).attr("scope_operation") + '"><i class="iconfont icon-cha1"></i></span>';
        }
        operationHTML += '</div></div>';
        $("div[name='operation']").replaceWith(operationHTML);
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
                //选择物资
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
                                html += '<li title="' + obj.data[i].name + '" data-id="' + obj.data[i].id + '" data-name="' + obj.data[i].name + '"><i class="iconfont icon-gou ' + actClass + '"></i>' + obj.data[i].name + '</li>'
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

        //打开确认按钮
        $("#change_company").css("display", "none");
        $(".back_main_btns ").css("display", "block");
        return false;
    });

    //提交表单
    var ajaxKey = true;
    $(".btn_confirm").unbind().bind("click", function () {
        if ($("select[name='company_type']").length > 0 && $("select[name='company_type']").val() == "") {
            $.msgTips({
                type: "warning",
                content: "请选择企业类型"
            });
            return false;
        } else if ($("input[name='company_phone']").length > 0 && $.trim($("input[name='company_phone']").val()) == "") {
            $("input[name='company_phone']").initInput("error", "请填写公司联系方式");
            $("input[name='company_phone']").unbind().bind("blur", function () {
                $("input[name='company_phone']").initInput();
            });
            return false;
        } else if ($("input[name='detail_address']").length > 0 && $.trim($("input[name='detail_address']").val()) == "") {
            $("input[name='detail_address']").initInput("error", "请填写公司联系方式");
            $("input[name='detail_address']").unbind().bind("blur", function () {
                $("input[name='detail_address']").initInput();
            });
            return false;
        }
        if (ajaxKey) {
            var reqUrl = config.accountPath + "/account/changeCompanyInfo",
                reqData = $("form").serialize();
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == 2000) {
                    setTimeout(function () {
                        window.location.reload();
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

    //查看大图
    $(".back_info_item img").unbind().bind("click", function () {
        var path = $(this).attr("src");
        $.showPhoto(path);
        return false;
    });
});