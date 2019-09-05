require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    var vm = new Vue({
        el: '#orderList',
        data: {
            loading: true, //loading图
            list: [], //商品列表
            count: 0, //商品总数
            createdStart: "", //开始时间
            createdEnd: "", //结束时间
            isInvoice: "", //是否开票
            totalNum: 0, //选中的总数量
            totalMoney: 0, //选中的总金额
            allNum: 0, //全部的总数量
            allMoney: 0, //全部的总金额
            btnActive: false, //按钮激活状态
            selectIdArr: [], //选中的id数组
            idInfoArr: [] //选中的信息数组
        },
        mounted() {
            this.getOrder(1);
        },
        methods: {
            getOrder() {
                var vueObj = this;
                vueObj.createdStart = $("input[name='start_time']").val();
                vueObj.createdEnd = $("input[name='end_time']").val();
                vueObj.isInvoice = $("input[name='is_invoice']").is("checked") ? "0" : "";
                var reqUrl = config.inquiryPath + "/supplier/invoice/indexAjax",
                    reqData = {
                        start_time: vueObj.createdStart,
                        end_time: vueObj.createdEnd,
                        is_invoice: vueObj.isInvoice
                    };
                $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                    if (dataObj.code == 2000) {
                        vueObj.count = dataObj.data.count;
                        vueObj.list = dataObj.data.data;
                        vueObj.loading = false;
                        vueObj.allNum = 0;
                        vueObj.allMoney = 0;
                        for (let i = 0; i < vueObj.list.length; i++) {
                            vueObj.allNum += parseInt(vueObj.list[i].quote_time);
                            vueObj.allMoney += parseFloat(vueObj.list[i].total_price);
                        }

                        vueObj.$nextTick(function () {
                            $(".material_list").find(".cjy-checkbox").remove();
                            $(".material_list input[type='checkbox']").initCheckbox();
                            //全选
                            $("input.js_checkAll").unbind().bind("change", function () {
                                vueObj.selectIdArr = [];
                                if ($(this).is(":checked")) {
                                    $(".material_list input[type='checkbox']").prop("checked", true);
                                    $("input.js_checkSingle").each(function () {
                                        let id = $(this).val();
                                        vueObj.selectIdArr.push(id);
                                    });
                                } else {
                                    $(".material_list input[type='checkbox']").prop("checked", false);
                                }
                                $(".material_list input[type='checkbox']").initCheckbox();
                                vueObj.getTotal();
                            });
                            //单选
                            $("input.js_checkSingle").unbind().bind("change", function () {
                                let id = $(this).val();
                                if ($(this).is(":checked")) {
                                    vueObj.selectIdArr.push(id);
                                } else {
                                    vueObj.selectIdArr.remove(id);
                                    $("input.js_checkAll").prop("checked", false).initCheckbox();
                                }
                                vueObj.getTotal();
                            });
                        });


                    }
                }, function () {
                    vueObj.loading = false;
                    vueObj.list = [];
                    vueObj.count = 0;
                });
            },
            getTotal() {
                var vueObj = this;
                vueObj.totalNum = 0;
                vueObj.totalMoney = 0;
                vueObj.idInfoArr = [];
                for (let i = 0; i < vueObj.list.length; i++) {
                    if (vueObj.selectIdArr.indexOf(vueObj.list[i].id) > -1) {
                        vueObj.totalNum ++;
                        vueObj.totalMoney += parseFloat(vueObj.list[i].total_price);
                        let _obj = {
                            id: vueObj.list[i].id,
                            price: vueObj.list[i].total_price
                        }
                        vueObj.idInfoArr.push(_obj);
                    }
                }
                if (vueObj.totalMoney >= 300) {
                    vueObj.btnActive = true;
                } else {
                    vueObj.btnActive = false;
                }
            },
            applayCheck() {
                var vueObj = this;
                if (vueObj.btnActive) {
                    $.cueDialog({
                        title: "确认框",
                        topWords: ["icon-i", ''],
                        content: '您本次选择的待开票记录' + vueObj.totalNum + '条，金额合计' + vueObj.totalMoney + '元，请先核对信息',
                        callback: function () {
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

                            var invoiceFuc = function (options) {
                                var opts = null;
                                if (options.status === "add") {
                                    opts = {
                                        dialogTitle: "填写发票信息",
                                        type: '1',
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
                                        dialogTitle: "填写发票信息",
                                        type: options.invoice_type,
                                        title: options.invoice_title,
                                        tax_id: options.taxpayer_identity_number,
                                        register_addr: options.register_address,
                                        register_phone: options.register_phone,
                                        bank: options.bank_deposit,
                                        bank_account: options.bank_account,
                                        province: options.province,
                                        province_code: options.province_code,
                                        city: options.city,
                                        city_code: options.city_code,
                                        area: options.area,
                                        area_code: options.area_code,
                                        recive_addr: options.receive_address,
                                        recive_name: options.receiver,
                                        recive_phone: options.receiver_phone
                                    };
                                }
                                var checked1 = opts.type == "1" ? "checked" : "",
                                    checked2 = opts.type == "2" ? "checked" : "";
                                var invocieHtml = '<div class="invoice-box"><div class="invoice-item clearfix"><input type="radio" name="invoice_type" title="增值税专用发票" value="1" ' + checked1 + '><input type="radio" name="invoice_type" title="增值税普通发票" value="2" ' + checked2 + '></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>发票抬头：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="title" value="' + opts.title + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>纳税人识别号：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="tax_id" value="' + opts.tax_id + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>注册地址：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="register_addr" value="' + opts.register_addr + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>注册电话：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="register_phone" value="' + opts.register_phone + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>开户银行：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="bank" value="' + opts.bank + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>开户银行账号：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="bank_account" value="' + opts.bank_account + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>邮寄地址：</label><div class="invoice-input"><select name="province_code" value="' + opts.province_code + '"><option value="">请选择</option></select><select name="city_code" value="' + opts.city_code + '"><option value="">请选择</option></select><select name="area_code" value="' + opts.area_code + '"><option value="">请选择</option></select></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>详细收票地址：</label><div class="invoice-input"><input type="text"class="cjy-input-" name="recive_addr" value="' + opts.recive_addr + '"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>收票人：</label><div class="invoice-input"><input type="text"class="cjy-input-" id="receipts-name" name="recive_name" placeholder="收票人姓名" value="' + opts.recive_name + '"><input type="text"class="cjy-input-" placeholder="联系手机号" id="receipts-phone" name="recive_phone" value="' + opts.recive_phone + '"></div></div></div>';
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
                                                invoice_info: {
                                                    invoice_type: $("input[name='invoice_type']:checked").val(),
                                                    invoice_title: $.trim($("input[name='title']").val()),
                                                    taxpayer_identity_number: $.trim($("input[name='tax_id']").val()),
                                                    register_address: $.trim($("input[name='register_addr']").val()),
                                                    register_phone: $.trim($("input[name='register_phone']").val()),
                                                    bank_deposit: $.trim($("input[name='bank']").val()),
                                                    bank_account: $.trim($("input[name='bank_account']").val()),
                                                    province: $("select[name='province_code'] option:selected").html(),
                                                    province_code: $("select[name='province_code']").val(),
                                                    city: $("select[name='city_code'] option:selected").html(),
                                                    city_code: $("select[name='city_code']").val(),
                                                    area: $("select[name='area_code'] option:selected").html(),
                                                    area_code: $("select[name='area_code']").val(),
                                                    receive_address: $.trim($("input[name='recive_addr']").val()),
                                                    receiver: $.trim($("input[name='recive_name']").val()),
                                                    receiver_phone: $.trim($("input[name='recive_phone']").val())
                                                },
                                                id_info: vueObj.idInfoArr
                                            };
                                            var reqUrl = config.inquiryPath + '/supplier/invoice/supplyInvoiceAjax';
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
                                $("input[name='invoice_type']").initRadio();
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
                            $.ajaxForJson(config.inquiryPath + "/supplier/invoice/getLastInvoiceInfoAjax", {}, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    if(dataObj.data){
                                        invoiceFuc(dataObj.data);
                                    }
                                    else{
                                        invoiceFuc({
                                            status: "add"
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
    });

    // 搜索
    $(".back_btn_search").off().on("click", function () {
        vm.getOrder();
    });

    // 清空
    $(".back_btn_clear").off().on("click", function () {
        $(".back_main_search").find("input").val("");
        $("select[name='order_status']").attr("value", "").initSelect();
    });
});