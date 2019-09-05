/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');

const config = require('configModule');
const libs = require('libs');

$(() => {
    //展开收起地址、发票抬头
    $(".order_warp").on("click", "a.adr_more", function () {
        var listCon = $(this).parent().parent().parent();
        if ($(this).hasClass("goUp")) {
            var checkedObj = listCon.find(".adr_list").find(".checked"),
                defaultObj = listCon.find(".adr_list").find(".default");
            if (!checkedObj.hasClass("default")) {
                listCon.find(".adr_list").prepend(defaultObj.outer());
            }
            listCon.find(".adr_list").prepend(checkedObj.outer());
            defaultObj.remove();
            checkedObj.remove();
            listCon.find(".adr_list").css("height", "32px");
            $(this).removeClass("goUp");
            if ($(this).hasClass("fp_btn")) {
                $(this).find("span").html("展开更多");
            } else {
                $(this).find("span").html("展开地址");
            }
        }
        else {
            listCon.find(".adr_list").css("height", "auto");
            $(this).addClass("goUp");
            if ($(this).hasClass("fp_btn")) {
                $(this).find("span").html("收起更多");
            } else {
                $(this).find("span").html("收起地址");
            }
        }
        return false;
    });

    // 防止频繁触发AJAX
    var debounce = null;
    //设置默认收货地址
    $("a[name='setDefault']").off().on("click", function (event) {
        event.stopPropagation();
        var main = $(this);
        main.parents(".line_con").find(".adr_item").removeClass("default");
        main.parents(".adr_item").addClass("default");
        if (debounce) {
            clearTimeout(debounce);
        }
        debounce = setTimeout(function () {
            $.ajaxForJson('/Buyer/Address/ajaxEditPost', {
                id: main.parents(".adr_item").attr("address_val"),
                checked: 1
            }, function (json) {
                if (json.code === 2000) {
                    $.msgTips({
                        type: "success",
                        content: "设置默认地址成功",
                        callback: function () {
                            main.parents(".adr_list").find(".checked").removeClass("checked");
                            main.parents(".adr_item").addClass("checked");
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                    return false;
                }
            });
        }, 300);
        return false;
    });

    //选中收货地址 发票抬头
    $(".adr_item").off().on("click", function () {
        $(this).parents(".adr_list").find(".checked").removeClass("checked");
        $(this).addClass("checked");
        return false;
    });

    //显示tips
    $(".delivery_item").find(".icon-wenhao").unbind().bind({
        mouseover: function () {
            $(".order_delivery").find(".tagBox").show();
        },
        mouseout: function () {
            $(".order_delivery").find(".tagBox").hide();
        }
    });

    // 获取省份
    var getProvinceFuc = function (status) {
        $.ajaxJSONP(config.papiPath + "api/common/getProvince", null, function (json) {
            if (json.code == "2000") {
                var optHtml = '<option value="">请选择</option>';
                $("select[name='city_code']").html(optHtml);
                $("select[name='area_code']").html(optHtml);
                for (let i = 0; i < json.data.length; i++) {
                    optHtml += '<option value="' + json.data[i].id + '">' + json.data[i].name + '</option>';
                }
                $("select[name='province_code']").html(optHtml);
                $("select[name='province_code']").initSelect();
                $("select[name='city_code']").initSelect();
                $("select[name='area_code']").initSelect();
                if (status !== undefined) {
                    // 修改
                    $("select[name='province_code']").triggerHandler("change");
                }
            }
        }, "json");
    };

    // 获取市州
    var getCityFuc = function (opt) {
        $.ajaxJSONP(config.papiPath + "api/common/getCity", {
            pid: opt.id
        }, function (json) {
            if (json.code == "2000") {
                var optHtml = '<option value="">请选择</option>';
                $("select[name='area_code']").html(optHtml);
                for (let i = 0; i < json.data.length; i++) {
                    optHtml += '<option value="' + json.data[i].id + '">' + json.data[i].name + '</option>';
                }
                $("select[name='city_code']").html(optHtml);
                $("select[name='city_code']").initSelect();
                $("select[name='area_code']").initSelect();
                if (opt.status !== undefined) {
                    // 修改
                    $("select[name='city_code']").triggerHandler("change");
                }
            }
        }, "json");
    };

    // 获取地区
    var getAreaFuc = function (opt) {
        $.ajaxJSONP(config.papiPath + "api/common/getArea", {
            pid: opt
        }, function (json) {
            if (json.code == "2000") {
                var optHtml = '<option value="">请选择</option>';
                for (let i = 0; i < json.data.length; i++) {
                    optHtml += '<option value="' + json.data[i].id + '">' + json.data[i].name + '</option>';
                }
                $("select[name='area_code']").html(optHtml);
                $("select[name='area_code']").initSelect();
            }
        }, "json");
    };

    // 收货地址
    var addressFuc = function (options) {
        var opts = null;
        if (options.status === "add") {
            opts = {
                dialogTitle: "新增收货地址",
                consignee: '',
                province: '',
                province_code: '',
                city: '',
                city_code: '',
                area: '',
                area_code: '',
                detail_address: '',
                consignee_mobile: '',
                consignee_telphone: '',
                checked: "0"
            };
        } else {
            opts = {
                dialogTitle: "编辑收货地址",
                id: options.id,
                consignee: options.consignee,
                province: options.province,
                province_code: options.province_code,
                city: options.city,
                city_code: options.city_code,
                area: options.area,
                area_code: options.area_code,
                detail_address: options.detail_address,
                consignee_mobile: options.consignee_mobile,
                consignee_telphone: options.consignee_telphone,
                checked: options.checked
            };
        }
        var addrHtml = '<div class="shipping-box"><div class="shipping-item clearfix"><label class="shipping-label"><span>*</span>收货人：</label><div class="shipping-input"><input type="text" class="cjy-input-" name="consignee" value="' + opts.consignee + '"></div></div><div class="shipping-item clearfix"><label class="shipping-label"><span>*</span>所在地区：</label><div class="shipping-input"><select name="province_code" value="' + opts.province_code + '"><option value="">请选择</option></select><select name="city_code" value="' + opts.city_code + '"><option value="">请选择</option></select><select name="area_code" value="' + opts.area_code + '"><option value="">请选择</option></select></div></div><div class="shipping-item clearfix"><label class="shipping-label"><span>*</span>详细地址：</label><div class="shipping-input"><input type="text" class="cjy-input-" name="detail_address" value="' + opts.detail_address + '"></div></div><div class="shipping-item clearfix"><label class="shipping-label"><span>*</span>手机：</label><div class="shipping-input"><input type="text" class="cjy-input-" name="consignee_mobile" value="' + opts.consignee_mobile + '"></div></div><div class="shipping-item clearfix"><label class="shipping-label">固定电话：</label><div class="shipping-input"><input type="text" class="cjy-input-" name="consignee_telphone" value="' + opts.consignee_telphone + '"></div></div><p class="default_address">';
        if (opts.checked === "0") {
            addrHtml += '<input type="checkbox" title="设置为默认收货地址" name="checked" value="1">';
        } else {
            addrHtml += '<input type="checkbox" title="设置为默认收货地址" name="checked" value="1" checked>';
        }
        addrHtml += '</p></div>';
        $.dialog({
            title: opts.dialogTitle,
            content: addrHtml,
            width: 800,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var mobile = $.trim($("input[name='consignee_mobile']").val());
                    var phone = $.trim($("input[name='consignee_telphone']").val());
                    if ($.trim($("input[name='consignee']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写收货人"
                        });
                        return false;
                    } else if ($("select[name='province_code']").val() === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择所在地区"
                        });
                        return false;
                    } else if ($("select[name='city_code']").val() === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择所在地区"
                        });
                        return false;
                    } else if ($("select[name='area_code']").val() === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择所在地区"
                        });
                        return false;
                    } else if ($.trim($("input[name='detail_address']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写详细地址"
                        });
                        return false;
                    } else if (mobile === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写手机号"
                        });
                        return false;
                    } else if (!libs.checkMobile(mobile)) {
                        $.msgTips({
                            type: "warning",
                            content: "手机号格式错误"
                        });
                        return false;
                    }
                    if (phone !== "") {
                        if (!libs.checkPhone(phone)) {
                            $.msgTips({
                                type: "warning",
                                content: "固定电话格式错误"
                            });
                            return false;
                        }
                    }
                    var reqData = {
                        consignee: $.trim($("input[name='consignee']").val()),
                        province: $("select[name='province_code'] option:selected").html(),
                        province_code: $("select[name='province_code']").val(),
                        city: $("select[name='city_code'] option:selected").html(),
                        city_code: $("select[name='city_code']").val(),
                        area: $("select[name='area_code'] option:selected").html(),
                        area_code: $("select[name='area_code']").val(),
                        detail_address: $.trim($("input[name='detail_address']").val()),
                        consignee_mobile: $.trim($("input[name='consignee_mobile']").val()),
                        consignee_telphone: $.trim($("input[name='consignee_telphone']").val()),
                        checked: $("input[name='checked']").is(":checked") ? 1 : 0
                    };
                    var reqUrl = '/Buyer/Address/ajaxAddPost';
                    if (options.status !== "add") {
                        reqData.id = opts.id;
                        reqUrl = '/Buyer/Address/ajaxEditPost';
                    }
                    $.ajaxForJson(reqUrl, reqData, function (json) {
                        if (json.code === 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            $.msgTips({
                                type: "success",
                                content: json.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: json.msg
                            });
                            return false;
                        }
                    });
                });
            }
        });
        $(".shipping-box input[type='checkbox']").initCheckbox();
        $(".shipping-box select").initSelect();
        if (options.status === "add") {
            getProvinceFuc();
        } else {
            getProvinceFuc("edit");
        }
        $("select[name='province_code']").off().on("change", function () {
            if ($(this).val() !== "") {
                if (options.status === "add") {
                    getCityFuc({
                        id: $(this).val()
                    });
                } else {
                    getCityFuc({
                        id: $(this).val(),
                        status: "edit"
                    });
                }
            } else {
                $("select[name='city_code']").html('<option value="">请选择</option>');
                $("select[name='area_code']").html('<option value="">请选择</option>');
                $("select[name='city_code']").initSelect();
                $("select[name='area_code']").initSelect();
            }
        });
        $("select[name='city_code']").off().on("change", function () {
            if ($(this).val() !== "") {
                getAreaFuc($(this).val());
            } else {
                $("select[name='area_code']").html('<option value="">请选择</option>');
                $("select[name='area_code']").initSelect();
            }
        });
    };

    // 发票地址
    var invoiceFuc = function (options) {
        var opts = null;
        if (options.status === "add") {
            opts = {
                dialogTitle: "新增发票地址",
                type: options.typeStr,
                title: '',
                tax_id: '',
                register_addr: '',
                register_phone: '',
                bank: '',
                bank_account: '',
                province: '',
                province_code: '',
                city: '',
                city_code: '',
                area: '',
                area_code: '',
                recive_addr: '',
                recive_name: '',
                recive_phone: ''
            };
        } else {
            opts = {
                dialogTitle: "编辑发票地址",
                id: options.id,
                type: options.typeStr,
                title: options.title,
                tax_id: options.tax_id,
                register_addr: options.register_addr,
                register_phone: options.register_phone,
                bank: options.bank,
                bank_account: options.bank_account,
                province: options.province,
                province_code: options.province_code,
                city: options.city,
                city_code: options.city_code,
                area: options.area,
                area_code: options.area_code,
                recive_addr: options.recive_addr,
                recive_name: options.recive_name,
                recive_phone: options.recive_phone
            };
        }
        var invocieHtml = '<div class="invoice-box"><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>发票抬头：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="title" value="' + opts.title + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>纳税人识别号：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="tax_id" value="' + opts.tax_id + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>注册地址：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="register_addr" value="' + opts.register_addr + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>注册电话：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="register_phone" value="' + opts.register_phone + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>开户银行：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="bank" value="' + opts.bank + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>开户银行账号：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="bank_account" value="' + opts.bank_account + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>邮寄地址：</label><div class="invoice-input"><select name="province_code" value="' + opts.province_code + '"><option value="">请选择</option></select><select name="city_code" value="' + opts.city_code + '"><option value="">请选择</option></select><select name="area_code" value="' + opts.area_code + '"><option value="">请选择</option></select></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>详细收票地址：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="recive_addr" value="' + opts.recive_addr + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>收票人：</label><div class="invoice-input"><input type="text"class="cjy-input-" id="receipts-name" name="recive_name" placeholder="收票人姓名" value="' + opts.recive_name + '"><input type="text"class="cjy-input-" placeholder="联系手机号" id="receipts-phone" name="recive_phone" value="' + opts.recive_phone + '"></div></div></div>';
        $.dialog({
            title: opts.dialogTitle,
            content: invocieHtml,
            width: 800,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var mobile = $.trim($("input[name='recive_phone']").val());
                    if ($.trim($("input[name='title']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写发票抬头"
                        });
                        return false;
                    } else if ($.trim($("input[name='tax_id']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写纳税人识别号"
                        });
                        return false;
                    } else if ($.trim($("input[name='register_addr']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写注册地址"
                        });
                        return false;
                    } else if ($.trim($("input[name='register_phone']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写注册电话"
                        });
                        return false;
                    } else if ($.trim($("input[name='bank']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写开户银行"
                        });
                        return false;
                    } else if ($.trim($("input[name='bank_account']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写开户银行账号"
                        });
                        return false;
                    } else if ($("select[name='province_code']").val() === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择邮寄地址"
                        });
                        return false;
                    } else if ($("select[name='city_code']").val() === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择邮寄地址"
                        });
                        return false;
                    } else if ($("select[name='area_code']").val() === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择邮寄地址"
                        });
                        return false;
                    } else if ($.trim($("input[name='recive_addr']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写收票地址"
                        });
                        return false;
                    } else if ($.trim($("input[name='recive_name']").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写收票人"
                        });
                        return false;
                    } else if (mobile === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写联系手机号"
                        });
                        return false;
                    } else if (!libs.checkMobile(mobile)) {
                        $.msgTips({
                            type: "warning",
                            content: "手机号格式错误"
                        });
                        return false;
                    }
                    var reqData = {
                        type: opts.type,
                        title: $.trim($("input[name='title']").val()),
                        tax_id: $.trim($("input[name='tax_id']").val()),
                        register_addr: $.trim($("input[name='register_addr']").val()),
                        register_phone: $.trim($("input[name='register_phone']").val()),
                        bank: $.trim($("input[name='bank']").val()),
                        bank_account: $.trim($("input[name='bank_account']").val()),
                        province: $("select[name='province_code'] option:selected").html(),
                        province_code: $("select[name='province_code']").val(),
                        city: $("select[name='city_code'] option:selected").html(),
                        city_code: $("select[name='city_code']").val(),
                        area: $("select[name='area_code'] option:selected").html(),
                        area_code: $("select[name='area_code']").val(),
                        recive_addr: $.trim($("input[name='recive_addr']").val()),
                        recive_name: $.trim($("input[name='recive_name']").val()),
                        recive_phone: $.trim($("input[name='recive_phone']").val()),
                        checked: 0
                    };
                    var reqUrl = '/Buyer/Invoice/invoicePost';
                    if (options.status !== "add") {
                        reqData.id = opts.id;
                        reqUrl = '/Buyer/Invoice/invoiceEdit';
                    }
                    $.ajaxForJson(reqUrl, reqData, function (json) {
                        if (json.code === 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            $.msgTips({
                                type: "success",
                                content: json.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: json.msg
                            });
                            return false;
                        }
                    });
                });
            }
        });
        $(".invoice-box select").initSelect();
        if (options.status === "add") {
            getProvinceFuc();
        } else {
            getProvinceFuc("edit");
        }
        $("select[name='province_code']").off().on("change", function () {
            if ($(this).val() !== "") {
                if (options.status === "add") {
                    getCityFuc({
                        id: $(this).val()
                    });
                } else {
                    getCityFuc({
                        id: $(this).val(),
                        status: "edit"
                    });
                }
            } else {
                $("select[name='city_code']").html('<option value="">请选择</option>');
                $("select[name='area_code']").html('<option value="">请选择</option>');
                $("select[name='city_code']").initSelect();
                $("select[name='area_code']").initSelect();
            }
        });
        $("select[name='city_code']").off().on("change", function () {
            if ($(this).val() !== "") {
                getAreaFuc($(this).val());
            } else {
                $("select[name='area_code']").html('<option value="">请选择</option>');
                $("select[name='area_code']").initSelect();
            }
        });
    };

    // 新增收货地址
    $(".address_add_class").off().on("click", function () {
        addressFuc({
            status: "add"
        });
    });

    // 修改收货地址、发票信息
    $("a[name='changeInfo']").off().off().on("click", function (event) {
        event.stopPropagation();
        var curEl = $(this);
        var listEl = $(".adr_list");
        var curIndex = listEl.index(curEl.parents(".adr_list"));
        if (curIndex === 0) {
            // 修改收货地址
            $.ajaxForJson('/Buyer/Address/ajaxDetail', {
                id: curEl.parents(".adr_item").attr("address_val")
            }, function (json) {
                if (json.code === 2000) {
                    var jsonData = json.data;
                    jsonData.status = "edit";
                    addressFuc(jsonData);
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                    return false;
                }
            });
        } else {
            // 修改发票信息
            $.ajaxForJson('/Buyer/Invoice/ajaxDetail ', {
                id: curEl.parents(".adr_item").attr("invoice_val")
            }, function (json) {
                if (json.code === 2000) {
                    var jsonData = json.data;
                    jsonData.status = "edit";
                    if ($(".invoice_item").eq(0).hasClass("checked")) {
                        jsonData.typeStr = $(".invoice_item").eq(0).attr("data-type");
                    } else {
                        jsonData.typeStr = $(".invoice_item").eq(1).attr("data-type");
                    }
                    invoiceFuc(jsonData);
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                    return false;
                }
            });
        }
    });

    // 输入运费
    $("input[name='transport_cost']").off().on("input", function () {
        libs.lenNumber($(this)[0], 2);
        var transportCost = $(this).val();
        if (transportCost !== "") {
            if (transportCost.length>=2) {
                if (transportCost[1] !== "." && transportCost[0] === "0") {
                    $(this).val(parseFloat(transportCost));
                }
            }
            $(".order_money span").eq(0).html(parseFloat(transportCost));
            $(".changeTotal").html("应付总额（含运费）：");
        } else {
            $(".order_money span").eq(0).html(0);
            $(".changeTotal").html("应付总额（不含运费）：");
        }
        var cost1 = $(".order_money span").eq(0).html();
        var cost2 = $(".order_money span").eq(1).html();
        cost1 = parseFloat(cost1.replace("￥", ""));
        cost2 = parseFloat(cost2.replace("￥", ""));
        $(".order_total").html("￥" + (cost1 + cost2).toFixed(2));
        $(".order_bottom_money").html("￥" + (cost1 + cost2).toFixed(2));
    });

    // 交货方式、支付方式切换
    $(".delivery_item").off().on("click", function () {
        var main = $(this);
        main.parents(".order_delivery").find(".checked").removeClass("checked");
        main.addClass("checked");
    });

    // 发票信息切换
    $(".invoice_item").off().on("click", function () {
        var main = $(this);
        var num = $(".invoice_item").index(main);
        main.parents(".order_invoice").find(".checked").removeClass("checked");
        main.addClass("checked");
        $(".order_invoice_con").css("display", "none");
        $(".order_invoice_con").eq(num).css("display", "block");
    });

    // 新增发票
    $(".invoice_add_class").off().on("click", function () {
        if ($(".invoice_item").eq(0).hasClass("checked")) {
            invoiceFuc({
                status: "add",
                typeStr: $(".invoice_item").eq(0).attr("data-type")
            });
        } else {
            invoiceFuc({
                status: "add",
                typeStr: $(".invoice_item").eq(1).attr("data-type")
            });
        }
    });

    // 提交订单
    var shopcartId = libs.getUrlParam("shopcart_id");// 立即获取，避免用户擅自更改
    $(".order_confirm").off().on("click", function () {
        var main = $(this);
        var projectId = projectName = null;
        // 验证数据是否完整
        // if ($("input[name='delivery_date']").val() === "") {
        //     $.msgTips({
        //         type: "warning",
        //         content: "请选择到货截止日期"
        //     });
        //     return false;
        // } else 
        if ($(".adr_list").eq(0).find(".adr_item").length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请选择收货地址"
            });
            return false;
        }
        if ($(".invoice_item").eq(0).hasClass("checked")) {
            if ($(".adr_list").eq(1).find(".checked").length <= 0) {
                $.msgTips({
                    type: "warning",
                    content: "请选择发票抬头"
                });
                return false;
            }
        } else {
            if ($(".adr_list").eq(2).find(".checked").length <= 0) {
                $.msgTips({
                    type: "warning",
                    content: "请选择发票抬头"
                });
                return false;
            }
        }
        if ($("select[name='project_id']").val() !== "0") {
            projectId = $("select[name='project_id']").val();
            projectName = $("select[name='project_id'] option:selected").html();
        } else {
            projectId = '';
            projectName = '';
        }
        var reqData = {
            shopcart_id: shopcartId,
            project_id: projectId,
            project_name: projectName,
            delivery_method: $(".order_delivery").eq(0).find(".checked").attr("delivery_method_val"),
            delivery_date: $("input[name='delivery_date']").val(),
            transport_cost: $("input[name='transport_cost']").val(),
            pay_method: $(".order_delivery").eq(1).find(".checked").attr("pay_method_val"),
            address: $(".adr_list").eq(0).find(".checked").attr("address_val"),
            remark: $("textarea[name='remark']").val()
        };
        if ($(".invoice_item").eq(0).hasClass("checked")) {
            reqData.invoice = $(".adr_list").eq(1).find(".checked").attr("invoice_val");
        } else {
            reqData.invoice = $(".adr_list").eq(2).find(".checked").attr("invoice_val");
        }
        $.ajaxForJson('/Buyer/Order/addPost', reqData, function (json) {
            if (json.code === 2000) {
                $.msgTips({
                    type: "success",
                    content: json.data.msg,
                    callback: function () {
                        location.href = json.data.redirect;
                    }
                });
                return false;
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });
});