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
        } else {
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
                    var reqUrl = '/invoice/add';
                    if (options.status !== "add") {
                        reqData.id = opts.id;
                        reqUrl = '/invoice/edit';
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

    // 修改收货地址、发票信息
    $("a[name='changeInfo']").off().off().on("click", function (event) {
        event.stopPropagation();
        var curEl = $(this);
        // 修改发票信息
        $.ajaxForJson('/invoice/detail', {
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
    $(".order_confirm").off().on("click", function () {
        var main = $(this);
        if ($("input[name='link_man']").val() == "") {
            $("input[name='link_man']").initInput("error", "请填写联系人");
            $("input[name='link_man']").unbind().bind("blur", function () {
                $("input[name='link_man']").initInput();
            });
            return false;
        }
        if ($("input[name='link_phone']").val() == "") {
            $("input[name='link_phone']").initInput("error", "请填写联系方式");
            $("input[name='link_phone']").unbind().bind("blur", function () {
                $("input[name='link_phone']").initInput();
            });
            return false;
        }
        if ($(".adr_list").find(".checked").length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请选择收票地址"
            });
            return false;
        }
        if ($(".adr_list").find(".checked").length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请选择收票地址"
            });
            return false;
        }
        var reqData = {
            link_man: $("input[name='link_man']").val(),
            link_phone: $("input[name='link_phone']").val(),
            inquiry_id: $("input[name='inquiry_id']").val(),
            quote_id: $("input[name='quote_id']").val(),
            quote_company_id: $("input[name='quote_company_id']").val(),
            quote_company_name: $("input[name='quote_company_name']").val(),
            total_price: $("input[name='total_price']").val(),
            invoice_id: $(".adr_list").find(".checked").attr("invoice_val")
        };
        $.ajaxForJson('/purchaser/order/addPost', reqData, function (json) {
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