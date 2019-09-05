require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');

var tinymce = require('tinymce/tinymce');
require('tinymce/themes/modern/theme');
require('../../../public-resource/tinymce/langs/zh_CN');
require('tinymce/plugins/paste');
require('tinymce/plugins/link');
require('tinymce/plugins/table');
require('tinymce/plugins/image');
require('../../../public-resource/tinymce/skins/lightgray/skin.min.css');
require('../../../public-resource/tinymce/skins/lightgray/content.min.css');
require('../../../public-resource/tinymce/skins/lightgray/content.inline.min.css');

$(() => {
    //设置商品规格
    $(".setting_attr").unbind().bind("click", function () {
        $.ajaxPromise(config.shopPath + "/Seller/Goods/getCategorySpec", {
            category_id: $("input[name='category_id']").val()
        }).then(res => {
            getDailog(res);
        })

        function getDailog(dataObj) {
            if ($(".cjy-poplayer").length > 0) {
                $(".cjy-poplayer").show();
                $(".cjy-bg").show();
            }
            else {
                var specObj = specArr == "" ? null : JSON.parse(specArr);
                var dialogHTML = '<div class="set_attr_con"><div class="attr_con_left"><ul>';
                for (var i = 0; i < dataObj.data.length; i++) {
                    let actClass = i == 0 ? 'active' : '';
                    dialogHTML += '<li class="' + actClass + '"><a href="javascript:;" class="attr_name" code="' + dataObj.data[i].code + '" data-id="' + dataObj.data[i].id + '" data-name="' + dataObj.data[i].name + '">' + dataObj.data[i].name + '<i class="attr_num" style="display:none;">0</i><i class="iconfont icon-youjiantou"></i></a></li>';
                }
                dialogHTML += '</ul></div>';
                for (var i = 0; i < dataObj.data.length; i++) {
                    let showVal = i == 0 ? '' : 'style="display:none;"';
                    dialogHTML += '<div class="attr_con_right" data-id="' + dataObj.data[i].code + '" ' + showVal + '><div class="attr_selAll"><a href="javascript:;" class="checkAll checkIcon"><i class="iconfont icon-gou"></i>全选</a><a href="javascript:;" class="attr_val_add">增加自定义项</a></div><div class="attr_selCon clearfix"><ul>';
                    if (dataObj.data[i].value.length != 0) {
                        for (var key in dataObj.data[i].value) {
                            let checkStr = specObj && specObj[dataObj.data[i].code] && specObj[dataObj.data[i].code].indexOf(key) > -1 ? "checkedIcon" : "checkIcon";
                            dialogHTML += '<li class="attr_sel_cell"><a href="javascript:;" class="' + checkStr + '" data-id="' + key + '" data-name="' + dataObj.data[i].value[key] + '"><i class="iconfont icon-gou"></i>' + dataObj.data[i].value[key] + '</a></li>';
                        }
                    }
                    dialogHTML += '</ul></div><div class="attr_addCon clearfix"><ul></ul></div></div>';
                }
                dialogHTML += '</div>';
                $.dialog({
                    title: '设置商品规格',
                    content: dialogHTML,
                    width: 800,
                    confirm: {
                        show: true,
                        allow: true,
                        name: "生成货品"
                    },
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    callback: function () {
                        //选择分类
                        $(".attr_con_left").find("a.attr_name").unbind().bind("click", function () {
                            let index = $(this).parent().index();
                            $(".attr_con_left").find("li").removeClass("active");
                            $(this).parent().addClass("active");
                            $(".set_attr_con").find(".attr_con_right").hide();
                            $(".set_attr_con").find(".attr_con_right").eq(index).show();

                        });
                        //选择属性
                        $(".set_attr_con").on("click", ".checkIcon,.checkedIcon", function () {
                            if ($(this).hasClass("checkIcon")) {
                                $(this).removeClass("checkIcon").addClass("checkedIcon");
                            }
                            else {
                                $(this).removeClass("checkedIcon").addClass("checkIcon");
                                $(".attr_selAll").find("a.checkAll").removeClass("checkedIcon").addClass("checkIcon");
                            }
                        });
                        //全选
                        $(".attr_selAll").find("a.checkAll").unbind().bind("click", function () {
                            if ($(this).hasClass("checkIcon")) {
                                $(this).parents(".attr_con_right").find(".checkIcon").removeClass("checkIcon").addClass("checkedIcon");
                            }
                            else {
                                $(this).parents(".attr_con_right").find(".checkedIcon").removeClass("checkedIcon").addClass("checkIcon");
                            }
                            return false;
                        });
                        //添加自定义项
                        $(".attr_selAll").find("a.attr_val_add").unbind().bind("click", function () {
                            var addHTML = '<li class="attr_add_cell"><a href="javascript:;" class="checkedIcon"><i class="iconfont icon-gou"></i></a><input type="text" class="cjy-input-"><a href="javascript:;" class="iconfont icon-huishouxiang attr_del"></a></li>';
                            $(this).parents(".attr_con_right").find(".attr_addCon").find("ul").append(addHTML);
                            $(this).parents(".attr_con_right").find(".attr_addCon").find(".attr_del").unbind().bind("click", function () {
                                $(this).parent().remove();
                                return false;
                            });
                            return false;
                        });
                        $(".set_attr_con").on("input", ".attr_add_cell input[type='text']", function () {//自定义属性禁止输入,:
                            var val = $(this).val().replace(",", "").replace(":", "");
                            $(this).val(val)
                        });
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var attrTableArr = [];//记录生成table中属性的数组
                            var typeTableArr = [];//记录生成table中属性名的数组
                            var ajaxKey = true;
                            var attrLen = $(".attr_con_left").find("li").length, addAttrArr = [];
                            for (var i = 0; i < attrLen; i++) {
                                let attrId = $(".attr_con_left").find("li").eq(i).find("a.attr_name").attr("data-id"), attrArr = [];
                                $(".attr_con_right").eq(i).find(".attr_addCon").find(".attr_add_cell").each(function () {
                                    if ($(this).find(".checkedIcon").length > 0 && $(this).find("input").val() == "") {
                                        $.msgTips({
                                            type: "warning",
                                            content: "请填写增加的自定义项"
                                        });
                                        $(this).find("input").focus();
                                        ajaxKey = false;
                                        return false;
                                    }
                                    else {
                                        attrArr.push($(this).find("input").val());
                                    }
                                });
                                if (attrArr.length > 0) {
                                    addAttrArr.push({
                                        spec_id: attrId,
                                        spec_value_names: attrArr
                                    });
                                }
                            }

                            if (ajaxKey && $(".attr_addCon").find(".attr_add_cell").length > 0) {
                                $.ajaxForJson(config.shopPath + "/Seller/Goods/addCategorySpec", {
                                    specs: addAttrArr
                                }, function (dataObj) {
                                    if (dataObj.code == "2000") {
                                        var rightObj = $(".set_attr_con").find(".attr_con_right");
                                        $(".set_attr_con").find(".attr_addCon ul").html("");
                                        for (var i = 0; i < rightObj.length; i++) {
                                            var selArr = [];
                                            for (var j = 0; j < rightObj.eq(i).find(".attr_sel_cell a.checkedIcon").length; j++) {
                                                var attrVal = rightObj.eq(i).find(".attr_sel_cell a.checkedIcon").eq(j).attr("data-id") + ":" + rightObj.eq(i).find(".attr_sel_cell a.checkedIcon").eq(j).attr("data-name");
                                                selArr.push(attrVal);
                                            }
                                            for (var k = 0; k < dataObj.data.length; k++) {
                                                if (dataObj.data[k].code == $(".attr_con_left").find("li").eq(i).find("a").attr("data-id")) {
                                                    for (var key in dataObj.data[k].value) {
                                                        rightObj.eq(i).find(".attr_selCon ul").append('<li class="attr_sel_cell"><a href="javascript:;" class="checkedIcon" data-id="' + key + '" data-name="' + dataObj.data[k].value[key] + '"><i class="iconfont icon-gou"></i>' + dataObj.data[k].value[key] + '</a></li>');
                                                        var attrVal = key + ":" + dataObj.data[k].value[key];
                                                        selArr.push(attrVal);
                                                    }
                                                }
                                            }
                                            if (rightObj.eq(i).find("a.checkedIcon").length > 0) {
                                                typeTableArr.push({
                                                    id: $(".attr_con_left").find("li").eq(i).find("a").attr("code"),
                                                    name: $(".attr_con_left").find("li").eq(i).find("a").attr("data-name")
                                                });
                                            }
                                            if (selArr.length > 0) {
                                                attrTableArr.push(selArr);
                                            }
                                        }
                                        attrTableArr = doExchange(attrTableArr);
                                        getTable(typeTableArr, attrTableArr);

                                        $(".cjy-poplayer").hide();
                                        $(".cjy-bg").hide();
                                    }
                                    else {
                                        $.msgTips({
                                            type: "warning",
                                            content: dataObj.msg
                                        })
                                    }
                                });
                            }
                            else {
                                var rightObj = $(".set_attr_con").find(".attr_con_right");
                                for (var i = 0; i < rightObj.length; i++) {
                                    var selArr = [];
                                    for (var j = 0; j < rightObj.eq(i).find(".attr_sel_cell a.checkedIcon").length; j++) {
                                        var attrVal = rightObj.eq(i).find(".attr_sel_cell a.checkedIcon").eq(j).attr("data-id") + ":" + rightObj.eq(i).find(".attr_sel_cell a.checkedIcon").eq(j).attr("data-name");
                                        selArr.push(attrVal);
                                        if (j == 0) {
                                            typeTableArr.push({
                                                id: $(".attr_con_left").find("li").eq(i).find("a").attr("code"),
                                                name: $(".attr_con_left").find("li").eq(i).find("a").attr("data-name")
                                            });
                                        }
                                    }
                                    if (selArr.length > 0) {
                                        attrTableArr.push(selArr);
                                    }
                                }
                                attrTableArr = doExchange(attrTableArr);
                                getTable(typeTableArr, attrTableArr);

                                $(".cjy-poplayer").hide();
                                $(".cjy-bg").hide();
                            }
                            //数组合并方法
                            function doExchange(arr) {
                                var len = arr.length;
                                if (len == 0) {
                                    return arr;
                                }
                                else if (len >= 2) {
                                    var len1 = arr[0].length;
                                    var len2 = arr[1].length;
                                    var lenBoth = len1 * len2;
                                    var items = new Array(lenBoth);
                                    var index = 0;
                                    for (var i = 0; i < len1; i++) {
                                        for (var j = 0; j < len2; j++) {
                                            items[index] = arr[0][i] + "," + arr[1][j];
                                            index++;
                                        }
                                    }
                                    var newArr = new Array(len - 1);
                                    for (var i = 2; i < arr.length; i++) {
                                        newArr[i - 1] = arr[i];
                                    }
                                    newArr[0] = items;
                                    return doExchange(newArr);
                                }
                                else {
                                    return arr[0];
                                }
                            }
                            //渲染表格方法
                            function getTable(typeArr, attrArr) {
                                var oldTableData = [];
                                var _trs = $(".attr_table").find("tr.multi_tr");
                                for (var i = 0; i < _trs.length; i++) {
                                    var num_price = [], store_nums = _trs.eq(i).find("input[name='goods_info[store_nums][]']").val(), warning_nums = _trs.eq(i).find("input[name='goods_info[warning_nums][]']").val();
                                    for (var j = 0; j < _trs.eq(i).find(".multi_box").length; j++) {
                                        num_price.push({
                                            nums: _trs.eq(i).find(".multi_box").eq(j).find(".multi_left input").val(),
                                            price: _trs.eq(i).find(".multi_box").eq(j).find(".multi_right input").val()
                                        });
                                    }
                                    var oldObj = {
                                        key: _trs.eq(i).attr("data-key"),
                                        data: {
                                            num_price: num_price,
                                            store_nums: store_nums,
                                            warning_nums: warning_nums
                                        }
                                    }
                                    oldTableData.push(oldObj);
                                }
                                var idStr = '';
                                var tableHTML = '<table><colgroup>';
                                for (var i = 0; i < typeArr.length; i++) {
                                    let colLen = (32 / typeArr.length).toFixed(2);
                                    tableHTML += '<col width="' + colLen + '%">';
                                }
                                tableHTML += '<col width="24%"><col width="14%"><col width="12%"><col width="12%"><col width="6%"></colgroup>';
                                tableHTML += '<thead><tr>';
                                for (var i = 0; i < typeArr.length; i++) {
                                    tableHTML += '<th><span>' + typeArr[i].name + '</span></th>';
                                    if (i == 0) {
                                        idStr += typeArr[i].id;
                                    }
                                    else {
                                        idStr += "," + typeArr[i].id;
                                    }
                                }
                                tableHTML += '<th><span>购买数量</span><span class="color999">（计量单位）</span></th><th><span>单价<i class="iconfont icon-wenhao" title="单价不含运费"></i></span><span class="color999">（元/计量单价）</span></th><th><span>库存总量</span><span class="color999">（计量单位）</span></th><th><span>库存预警数<i class="iconfont icon-wenhao" title="设置库存预警数后，平台将以短信形式通知您及时更新库存"></i></span></th><th><span>操作</span></th></tr></thead>';
                                tableHTML += '<tbody>';
                                for (var i = 0; i < attrArr.length; i++) {
                                    var num_price = [{ nums: '', price: '' }], store_nums = '', warning_nums = '';
                                    for (var k = 0; k < oldTableData.length; k++) {
                                        if (attrArr[i] == oldTableData[k].key) {
                                            num_price = oldTableData[k].data.num_price;
                                            store_nums = oldTableData[k].data.store_nums;
                                            warning_nums = oldTableData[k].data.warning_nums;
                                        }
                                    }
                                    tableHTML += '<tr class="multi_tr" data-key="' + attrArr[i] + '"><input name="goods_info[spec_item][]" type="hidden" value="' + attrArr[i] + '">';
                                    var arr = attrArr[i].split(",")
                                    for (var j = 0; j < arr.length; j++) {
                                        tableHTML += '<td>' + arr[j].split(":")[1] + '</td>';
                                    }
                                    tableHTML += '<td colspan="2" class="multi_td">';
                                    for (var n = 0; n < num_price.length; n++) {
                                        tableHTML += '<div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><div class="multi_inner clearfix"><div class="multi_left"><span class="color999">起订量&nbsp;</span><input name="goods_info[step][nums][' + i + '][]" type="text" class="cjy-input-" maxlength="15" value="' + num_price[n].nums + '"><span>&nbsp;及以上</span></div><div class="multi_right"><input name="goods_info[step][price][' + i + '][]" type="text" class="cjy-input-" maxlength="15" value="' + num_price[n].price + '"></div></div></div>';
                                    }
                                    tableHTML += '</td><td><input name="goods_info[store_nums][]" type="text" class="cjy-input-" maxlength="15" value="' + store_nums + '"></td><td><input name="goods_info[warning_nums][]" type="text" class="cjy-input-" maxlength="15" value="' + warning_nums + '"></td><td><i class="iconfont icon-huishouxiang del_tr"></i></td></tr>';

                                }
                                tableHTML += '</tbody></table><input name="product_info[specs]" type="hidden" value="' + idStr + '">';
                                $(".attr_table").html(tableHTML);
                            }

                            return false;
                        });
                    }
                });
            }
        }

        return false;
    });

    // 展开收起
    $(".fold_span").off().on("click", function () {
        var main = $(this);
        var elI = main.find("i");
        var fillin = main.parents(".fillin_box").find(".fillin_wrap");
        if (elI.hasClass("icon-xiajiantou")) {
            // 展开
            fillin.slideDown();
            main.html('收起<i class="iconfont icon-shangjiantou"></i>');
        } else {
            // 收起
            fillin.slideUp();
            main.html('展开<i class="iconfont icon-xiajiantou"></i>');
        }
    });

    // 添加、删除属性
    $(".attr_table").on("click", ".add_multi", function () {
        var main = $(this);
        var multiTd = main.parents(".multi_td");
        var cloneDom = multiTd.find(".multi_box").eq(0).clone(true);
        var curTr = main.parents("tr");
        if (!curTr.hasClass("multi_tr")) {
            curTr.addClass("multi_tr");
        }
        cloneDom.find("input").val("");
        multiTd.append(cloneDom);
    });

    $(".attr_table").on("click", ".del_multi", function () {
        var main = $(this);
        var multiBox = main.parents(".multi_box");
        var multiTd = main.parents(".multi_td");
        var multiBoxes = multiTd.find(".multi_box");
        if (multiBoxes.length > 1) {
            multiBox.remove();
            multiBoxes = multiTd.find(".multi_box");
            if (multiBoxes.length < 2) {
                multiTd.parents("tr").removeClass("multi_tr");
            }
        }
    });

    // 删除行
    $(".attr_table").on("click", ".del_tr", function () {
        var main = $(this);
        var multiTr = main.parents("tbody").find("tr");
        var curTr = main.parents("tr");
        if (multiTr.length > 1) {
            curTr.remove();
        }
        $(".attr_table").find("tr.multi_tr").each(function (n) {
            $(this).find(".multi_left").find("input.cjy-input-").attr("name", "goods_info[step][nums][" + n + "][]");
            $(this).find(".multi_right").find("input.cjy-input-").attr("name", "goods_info[step][price][" + n + "][]");
        });
    });

    //table数据输入限制
    $(".attr_table").on("input", ".multi_right input", function () {
        var main = $(this);
        libs.lenNumber(main[0], 2);
    });
    $(".attr_table").on("input", ".multi_left input,td > input[type='text']", function () {
        var main = $(this);
        libs.lenNumber(main[0]);
    });

    //删除附件
    $(".goods_photo").find("i.del_this").unbind().bind("click", function () {
        $(this).parents(".goods_photo").remove();
        return false;
    });
    //图片上传
    $(".uploadImg").uppyUpload(".uploadImg", function (name, url) {
        if ($(".goods_photo").length >= 5) {
            $.msgTips({
                type: "warning",
                content: "最多上传5个附件"
            });
            return false;
        }
        var _name = $(".goods_photo").length < 1 ? "默认主图" : "图" + ($(".goods_photo").length + 1);
        var html = '<figure class="goods_photo"><input type="hidden" name="product_info[imgs][]" value="' + url + '"><img src="' + config.filePath + url + '" alt=""><figcaption>' + _name + '</figcaption><i class="iconfont icon-cha1 del_this"></i></figure>';
        $(".goods_box").show().append(html);

        //删除附件
        $(".goods_photo").find("i.del_this").unbind().bind("click", function () {
            $(this).parents(".goods_photo").remove();
            return false;
        });
    }, {
        allowedFileTypes: ['image/*'],
        processCon: '#process-files-img',
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });
    // //上传图片
    // $(document).on("click", "#uploadFile", function () {
    //     if ($(".goods_photo").length >= 5) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传5个附件"
    //         });
    //         return false;
    //     }
    //     $("#uploadFile").unbind().bind("change", function () {
    //         var id = "uploadFile";
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.shopPath + '/uploadImg',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var name = $(".goods_photo").length < 1 ? "默认主图" : "图" + ($(".goods_photo").length + 1);
    //                     var html = '<figure class="goods_photo"><input type="hidden" name="product_info[imgs][]" value="' + dataObj.data + '"><img src="' + config.filePath + dataObj.data + '" alt=""><figcaption>' + name + '</figcaption><i class="iconfont icon-cha1 del_this"></i></figure>';
    //                     $(".goods_box").show().append(html);

    //                     //删除附件
    //                     $(".goods_photo").find("i.del_this").unbind().bind("click", function () {
    //                         $(this).parents(".goods_photo").remove();
    //                         return false;
    //                     });
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

    //新增仓库
    $(".new_warehouse").unbind().bind("click", function () {
        $.dialog({
            title: '新增仓库',
            content: '<div class="new-warehouse-box"><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库名称：</label><div class="warehouse-input"><input type="text" placeholder="请输入2-6个字符" class="cjy-input-" name="warehouseName"></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库地址：</label><div class="warehouse-input warehouse-search"><input type="text" class="cjy-input-" id="ware_addr"></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"></label><div class="warehouse-input"><div id="baiduMap"></div><p class="default_address"><input type="checkbox" title="" name="isDefault">设置为默认仓库地址<i class="iconfont icon-wenhao"></i></p></div></div></div>',//<i class="iconfont icon-sousuo search-ware"></i>
            width: 800,
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
                var city = "", area = "", address = "", pointStr = "";
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    if ($("input[name='warehouseName']").val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写仓库名称"
                        });
                        return false;
                    }
                    else if (pointStr == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请从搜索列表中选中正确的仓库地址"
                        });
                        return false;
                    }
                    //添加仓库提交
                    var isDefault = $("input[name='isDefault']").prop("checked") ? 1 : 0;
                    $.ajaxForJson(config.shopPath + "/Seller/warehouse/saveWarehouseAjax", {
                        name: $("input[name='warehouseName']").val(),
                        city: city,
                        area: area,
                        address: address,
                        point: pointStr,
                        is_default: isDefault
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
                            });
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            $("select[name='product_info[warehouse_id]']").append('<option value="' + dataObj.data.id + '">' + dataObj.data.name + '</option>').initSelect();
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
                //输入仓库地址时删除地图信息
                $("#ware_addr").bind("input", function () {
                    city = "";
                    area = "";
                    address = "";
                    pointStr = "";
                });

                function initialize() {
                    // 百度地图API功能
                    var map = new BMap.Map("baiduMap");
                    var point = new BMap.Point(114.30752, 30.60629);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point); // 创建标注
                    map.addOverlay(marker); // 将标注添加到地图中
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); // 跳动的动画
                    map.enableScrollWheelZoom(true); // 启用滚轮放大缩小
                    // 建立一个自动完成的对象
                    var ac = new BMap.Autocomplete({
                        "input": "ware_addr",
                        "location": map
                    });
                    function setPlace() {
                        map.clearOverlays();// 清除地图上所有覆盖物
                        function myFun() {
                            var pp = local.getResults().getPoi(0).point;// 获取第一个智能搜索的结果
                            map.centerAndZoom(pp, 15);
                            var _marker = new BMap.Marker(pp);
                            map.addOverlay(_marker);// 添加标注
                            _marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                            pointStr = pp.lng + ',' + pp.lat;
                        }
                        var local = new BMap.LocalSearch(map, {
                            //智能搜索
                            onSearchComplete: myFun
                        });
                        local.search(myValue);
                    }
                    var myValue;
                    ac.addEventListener("onconfirm", function (e) {
                        // 鼠标点击下拉列表后的事件
                        var _value = e.item.value;
                        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                        city = _value.city;
                        area = _value.district;
                        address = _value.business;
                        setPlace();
                    });
                }
                initialize();
            }
        });
        return false;
    });

    //富文本编辑器
    tinymce.init({
        selector: '.tinymceCon',
        width: 960,
        height: 480,
        plugins: 'image link table',
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table image",
        images_upload_url: config.upload + 'group1/upload',
        images_upload_handler: function (blobInfo, success, failure) {
            var token = "";
            function getToken() {
                $.ajax({
                    url: config.papiPath + "api/common/getToken",
                    async: false,
                    dataType: "json",
                    success: function (dataObj) {
                        token = dataObj.data.token;
                    },
                    error: function () {

                    }
                });
            }
            getToken();
            var formData;
            formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());
            formData.append("output", "json");
            formData.append("auth_token", token);
            $.ajax({
                url: `${config.upload}group1/upload`,
                type: 'post',
                async: false,
                processData: false,
                contentType: false,
                data: formData,
                dataType: 'json',
                success: function (dataObj) {
                    success(config.filePath + dataObj.src);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus + "---" + errorThrown);
                }
            });
        }
    });

    //删除附件
    $(".file_del").unbind().bind("click", function () {
        $(this).parents("li").remove();
        return false;
    });

    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        if ($(".file_con").find("li").length >= 8) {
            $.msgTips({
                type: "warning",
                content: "最多上传8个附件"
            });
            return false;
        }
        var html = '<li><input type="hidden" name="product_info[qualification_doc][name][]" value="' + name + '"><input type="hidden" name="product_info[qualification_doc][path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><a href="' + config.filePath + url + '" target="_blank">' + name + '</a><a class="file_del">删除</a></li>';
        $(".file_con").show().append(html);

        //删除附件
        $(".file_del").unbind().bind("click", function () {
            $(this).parents("li").remove();
            return false;
        });
    }, {
        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
    });
    // //上传附件
    // $(document).on("click", "#uploadAffix", function () {
    //     if ($(".file_con").find("li").length >= 8) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传8个附件"
    //         });
    //         return false;
    //     }
    //     $("#uploadAffix").unbind().bind("change", function () {
    //         var id = "uploadAffix";
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.shopPath + '/uploadFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var html = '<li><input type="hidden" name="product_info[qualification_doc][name][]" value="' + dataObj.name + '"><input type="hidden" name="product_info[qualification_doc][path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><a href="' + config.filePath + dataObj.data + '" target="_blank">' + dataObj.name + '</a><a class="file_del">删除</a></li>';
    //                     $(".file_con").show().append(html);

    //                     //删除附件
    //                     $(".file_del").unbind().bind("click", function () {
    //                         $(this).parents("li").remove();
    //                         return false;
    //                     });
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

    //提交表单数据
    var ajaxConfirmKey = true;
    $("a.fillin_save,a.fillin_pub").unbind().bind("click", function () {
        if (ajaxConfirmKey) {
            var reqUrl = $("form").attr("action"),
                reqData = $("form").serialize() + "&product_info[summary]=" + encodeURIComponent(tinymce.activeEditor.getContent()) + "&product_info[status]=" + $(this).attr("status");
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == "2000") {
                    window.location.href = "/Seller/Goods/completeGoods";
                }
                else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
                ajaxConfirmKey = true;
            });
            ajaxConfirmKey = false;
        }
        return false;
    });
}); 