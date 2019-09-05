require('cp');
require('elem');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
require('../../../public-resource/css/tender-timeline.css');
require('./page.css');
import Vue from 'vue';

const libs = require('libs');
const config = require('configModule');

$(() => {
    var tenderId = $("input[name='tenderId']").val(),
        supplierId = $("input[name='supplierId']").val();

    // 报价单
    var getQuotationFuc = function (options) {
        var addOrEdit = "addPrice";
        $.ajaxForJson(config.wwwPath + "getQuotation", {
            tender_id: tenderId,
            supplier_id: supplierId
        }, function (dataObj) {
            if (dataObj.code == "2000") {
                for (var i = 0; i < dataObj.data.length; i++) {
                    var html = '<div class="tenderListDialog"><form><input type="hidden" name="supplier_id" value="' + supplierId + '"><input type="hidden" name="type" value="' + dataObj.data[i].type + '"><div class="purchase_list"><div class="purchase_title">【包件1】</div><div class="other_table js_right"><a class="move_table move_left iconfont icon-huadong-zuo"></a><a class="move_table move_right iconfont icon-huadong-you"></a><table><thead><tr><th style="width: 90px;" rowspan="2">序号</th><th style="width: 250px;" rowspan="2">物资名称</th><th style="width: 180px;" rowspan="2">规格型号</th><th style="width: 150px;" rowspan="2">计量单位</th><th style="width: 150px;">数量</th><th style="width: 150px;">税前单价</th><th style="width: 150px;">增值税率（%）</th><th style="width: 150px;">含税单价</th><th style="width: 150px;">税前合价</th><th style="width: 150px;">税金</th><th style="width: 150px;">含税合价</th><th style="width: 180px;" rowspan="2">描述（选填）</th></tr><tr><th>N</th><th>a</th><th>t</th><th>b=a*（1+t）</th><th>S1=a*N</th><th>T=(b-a)*N</th><th>S=b*N</th></tr></thead>';
                    html += '<tbody>';
                    var total_price = "",
                        total_price_cn = "";
                    for (var j = 0; j < dataObj.data[i].product_data.length; j++) {
                        addOrEdit = typeof (dataObj.data[i].product_data[j].quotation_product_id) == "undefined" ? "addPrice" : "editPrice";
                        var pretax_unit_price = dataObj.data[i].product_data[j].pretax_unit_price ? dataObj.data[i].product_data[j].pretax_unit_price : "",
                            add_tax_rate = dataObj.data[i].product_data[j].add_tax_rate ? dataObj.data[i].product_data[j].add_tax_rate : "",
                            tax_unit_price = dataObj.data[i].product_data[j].tax_unit_price ? dataObj.data[i].product_data[j].tax_unit_price : "",
                            pretax_total = dataObj.data[i].product_data[j].pretax_total ? dataObj.data[i].product_data[j].pretax_total : "",
                            tax = dataObj.data[i].product_data[j].tax ? dataObj.data[i].product_data[j].tax : "",
                            tax_total_price = dataObj.data[i].product_data[j].tax_total_price ? dataObj.data[i].product_data[j].tax_total_price : "";

                        total_price = dataObj.data[i].product_data[j].total_price ? dataObj.data[i].product_data[j].total_price : "";
                        total_price_cn = dataObj.data[i].product_data[j].total_price_cn ? dataObj.data[i].product_data[j].total_price_cn : "";

                        if (options === "add") {
                            html += '<tr><input type="hidden" name="id[]" value="' + dataObj.data[i].product_data[j].id + '"><td>1</td><td>' + dataObj.data[i].product_data[j].product_name + '</td><td>' + dataObj.data[i].product_data[j].gg + '</td><td>' + dataObj.data[i].product_data[j].unit + '</td><input type="hidden" name="product_num[]" value="' + dataObj.data[i].product_data[j].product_num + '"><td class="js_product_num">' + dataObj.data[i].product_data[j].product_num + '</td><td><input type="text" name="pretax_unit_price[]" class="cjy-input-" value="' + pretax_unit_price + '" style="width: 100px;"></td><td><input type="text" name="add_tax_rate[]" class="cjy-input-" value="' + add_tax_rate + '" style="width: 100px;"></td><td><input type="text" name="tax_unit_price[]" class="cjy-input-" value="' + tax_unit_price + '" style="width: 100px;"></td><input type="hidden" name="pretax_total[]" value="' + pretax_total + '"><td class="js_pretax_total">' + pretax_total + '</td><input type="hidden" name="tax[]" value="' + tax + '"><td class="js_tax">' + tax + '</td><input type="hidden" name="tax_total_price[]" value="' + tax_total_price + '"><td class="js_tax_total_price">' + tax_total_price + '</td><td>' + dataObj.data[i].product_data[j].describe + '</td></tr>';
                        } else {
                            html += '<tr><input type="hidden" name="id[]" value="' + dataObj.data[i].product_data[j].id + '"><td>1</td><td>' + dataObj.data[i].product_data[j].product_name + '</td><td>' + dataObj.data[i].product_data[j].gg + '</td><td>' + dataObj.data[i].product_data[j].unit + '</td><input type="hidden" name="product_num[]" value="' + dataObj.data[i].product_data[j].product_num + '"><td class="js_product_num">' + dataObj.data[i].product_data[j].product_num + '</td><td>' + pretax_unit_price + '</td><td>' + add_tax_rate + '</td><td>' + tax_unit_price + '</td><input type="hidden" name="pretax_total[]" value="' + pretax_total + '"><td class="js_pretax_total">' + pretax_total + '</td><input type="hidden" name="tax[]" value="' + tax + '"><td class="js_tax">' + tax + '</td><input type="hidden" name="tax_total_price[]" value="' + tax_total_price + '"><td class="js_tax_total_price">' + tax_total_price + '</td><td>' + dataObj.data[i].product_data[j].describe + '</td></tr>';
                        }
                    }
                    var item = dataObj.data[i].item ? dataObj.data[i].item : "";
                    html += '<tr><td colspan="4">总计</td><td colspan="9" class="js_total js_total-quotation">' + total_price + '</td></tr><tr><td colspan="4">总计（大写）</td><td colspan="9" class="js_total_ch">' + total_price_cn + '</td></tr><tr><td colspan="4">其他报价事项（选填）</td><td colspan="9">' + item + '</td></tr></tbody></table></div></div></form></div>';
                }
            }
            var confirmOpt = {};
            if (options === "add") {
                confirmOpt = {
                    show: true,
                    allow: true,
                    name: "确定"
                }
            } else {
                confirmOpt = {
                    show: false,
                    allow: false,
                    name: "确定"
                }
            }
            $.dialog({
                title: '在线填写报价单信息',
                content: html,
                width: 1200,
                confirm: confirmOpt,
                callback: function () {
                    //输入税前单价
                    $("input[name='pretax_unit_price[]']").unbind().bind("input", function () {
                        libs.lenNumber(this, 2);
                        var rate = $(this).parents("tr").find("input[name='add_tax_rate[]']").val();
                        if ($(this).val() != "" && rate != "") {
                            $(this).parents("tr").find("input[name='tax_unit_price[]']").val(($(this).val() * (parseFloat(rate) + 1)).toFixed(2));
                        } else {
                            $(this).parents("tr").find("input[name='tax_unit_price[]']").val();
                        }
                        setTotal($(this).parents("tr"));
                    });
                    //输入增值税率
                    $("input[name='add_tax_rate[]']").unbind().bind("input", function () {
                        libs.lenNumber(this, 2);
                        var pretax = $(this).parents("tr").find("input[name='pretax_unit_price[]']").val(),
                            tax = $(this).parents("tr").find("input[name='tax_unit_price[]']").val(),
                            rate = $(this).val();
                        if (rate != "" && pretax != "") {
                            $(this).parents("tr").find("input[name='tax_unit_price[]']").val(((parseFloat(rate) + 1) * pretax).toFixed(2));
                        } else if (rate != "" && tax != "") {
                            $(this).parents("tr").find("input[name='pretax_unit_price[]']").val(((parseFloat(rate) + 1) * tax).toFixed(2));
                        }
                        setTotal($(this).parents("tr"));
                    });
                    //输入含税单价
                    $("input[name='tax_unit_price[]']").unbind().bind("input", function () {
                        libs.lenNumber(this, 2);
                        var rate = $(this).parents("tr").find("input[name='add_tax_rate[]']").val();
                        if ($(this).val() != "" && rate != "") {
                            $(this).parents("tr").find("input[name='pretax_unit_price[]']").val(($(this).val() / (parseFloat(rate) + 1)).toFixed(2));
                        } else {
                            $(this).parents("tr").find("input[name='pretax_unit_price[]']").val(0);
                        }
                        setTotal($(this).parents("tr"));
                    });

                    function setTotal(trObj) {
                        var pretax = trObj.find("input[name='pretax_unit_price[]']").val() == "" ? 0 : parseFloat(trObj.find("input[name='pretax_unit_price[]']").val()),
                            tax = trObj.find("input[name='tax_unit_price[]']").val() == "" ? 0 : parseFloat(trObj.find("input[name='tax_unit_price[]']").val()),
                            rate = trObj.find("input[name='add_tax_rate[]']").val() == "" ? 0 : parseFloat(trObj.find("input[name='add_tax_rate[]']").val()),
                            num = trObj.find(".js_product_num").html() == "" ? 0 : parseFloat(trObj.find(".js_product_num").html());

                        trObj.find(".js_pretax_total").html((pretax * num).toFixed(2));
                        trObj.find("input[name='pretax_total[]']").val((pretax * num).toFixed(2));
                        trObj.find(".js_tax").html(((tax - pretax) * num).toFixed(2));
                        trObj.find("input[name='tax[]']").val(((tax - pretax) * num).toFixed(2));
                        trObj.find(".js_tax_total_price").html((tax * num).toFixed(2));
                        trObj.find("input[name='tax_total_price[]']").val((tax * num).toFixed(2));

                        var totalPrice = 0;
                        $(".js_tax_total_price").each(function () {
                            var price = $(this).html() == "" ? 0 : parseFloat($(this).html());
                            totalPrice += price;
                        });
                        $(".js_total").html(totalPrice.toFixed(2));
                        $(".js_total_ch").html(libs.changeMoneyToChinese(totalPrice.toFixed(2)));
                    }


                    $(".tenderListDialog").find(".move_right").css("left", "1110px");

                    /*
                     * 包件操作
                     * */
                    //点击右箭头滑动
                    $(".move_right").unbind().bind({
                        "mousedown": function () {
                            move("right", $(this));
                            return false;
                        },
                        "mouseup": function () {
                            $(this).parents(".other_table").stop();
                            return false;
                        }
                    });
                    //点击左箭头滑动
                    $(".move_left").unbind().bind({
                        "mousedown": function () {
                            move("left", $(this));
                            return false;
                        },
                        "mouseup": function () {
                            $(this).parents(".other_table").stop();
                            return false;
                        }
                    });

                    function move(type, obj) {
                        if (type == "left") {
                            var time = obj.parents(".other_table").scrollLeft();
                            obj.parents(".other_table").animate({
                                scrollLeft: 0
                            }, time);

                        } else if (type == "right") {
                            var time = obj.parents(".other_table").find("table").width() - obj.parents(".other_table").width() - obj.parents(".other_table").scrollLeft();
                            obj.parents(".other_table").animate({
                                scrollLeft: obj.parents(".other_table").find("table").width() - obj.parents(".other_table").width()
                            }, time);
                        }
                    }

                    $(".other_table").unbind().bind("scroll", function () {
                        var main = $(this);
                        var scrollX = main.scrollLeft();

                        if (scrollX <= 0) {
                            main.removeClass("js_left");
                        } else {
                            main.addClass("js_left");
                        }
                        if (scrollX >= main.find("table").width() - main.width()) {
                            main.removeClass("js_right");
                        } else {
                            main.addClass("js_right");
                        }

                        $(".move_left").css("left", scrollX + "px");
                        $(".move_right").css("left", main.width() + scrollX - 48 + "px");
                    });

                    //表单提交
                    $(".cjy-confirm-btn").unbind().bind("click", function () {
                        var reqUrl = config.wwwPath + addOrEdit;
                        var reqData = $(".tenderListDialog form").serialize();
                        $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                            if (dataObj.code == 2000) {
                                $(".total-quotation").html($(".js_total-quotation").html() + '元');
                                $("input[name='price']").val($(".js_total-quotation").html());
                                $(".cjy-bg").css("z-index", "99");
                                $(".cjy-poplayer").eq(1).remove();
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
                    });
                }
            });
        });
    };

    // 在线投标方法
    var onlineBidFuc = function (options) {
        var settings = {
            file: [],
            price: ''
        };
        $.extend(settings, options || {});
        var contentHtml = '<div class="online-bid-box"><form class="online-bid-form"><div class="online-bid-item clearfix"><label class="bid-item-title">截止时间：</label><div class="online-bid-block"><span class="dead-time">' + $("input[name='bidEndTimes']").val() + '</span></div></div>';
        // if ($("input[name='quotation']").val() === "0") {
        //     contentHtml += '<div class="online-bid-item clearfix"><label class="bid-item-title">总价：</label><div class="online-bid-block"><input type="text" name="price" class="cjy-input-" placeholder="请输入总价" value="' + settings.price + '" autocomplete="off" /><span> 元</span></div></div>';
        // }
        contentHtml += '<div class="online-bid-item clearfix"><label class="bid-item-title">投标文件：</label><div class="online-bid-block"><span class="js_upload2"></span><span class="upload-tips" style="line-height:1.5;"><i class="iconfont icon-i"></i>单个附件不超过100M,最多可上传8个附件,支持jpg、png、jpeg、bmp、pdf、xls、xlsx、docx、doc、txt、zip、rar</span><div id="process-files2"></div></div></div><div class="online-bid-item clearfix"><label class="bid-item-title"></label><div class="online-bid-block"><div class="showFileCon';//<label for="uploadFile2" class="upfile_btn2">上传投标文件</label><input type="file" id="uploadFile2" name="uploadFile" />
        if (settings.file.length > 0) {
            contentHtml += '" style="display: block;"><ul>';
        } else {
            contentHtml += '"><ul>';
        }
        for (let fi = 0; fi < settings.file.length; fi++) {
            contentHtml += '<li><input type="hidden" name="file[name][]" value="' + settings.file[fi].name + '"><input type="hidden" name="file[path][]" value="' + settings.file[fi].path + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + settings.file[fi].name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
        }
        contentHtml += '</ul></div></div></div>';
        if ($("input[name='quotation']").val() !== "0") {
            contentHtml += '<a class="go-encroll" href="javascript:;">前往在线填写报价单</a><div class="online-bid-item clearfix"><label class="bid-item-title">总价：</label><div class="online-bid-block"><strong class="total-quotation">' + settings.price + '</strong><input type="hidden" name="price" value="' + settings.price + '" /></div></div>';
        }
        contentHtml += '</form>';
        if ($("input[name='quotation']").val() === "0") {
            contentHtml += '<p>请确保您已支付投标保证金，并已在【供应商中心&gt;企业全部投标】中上传支付凭证哦~</p>';
        }
        contentHtml += '<button class="online-bid-btn">确定投标/报价</button></div>';
        $.dialog({
            title: '在线投标/报价',
            content: contentHtml,
            width: 650,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            }
        });

        if (settings.file.length > 0) {
            //删除附件
            $(".showFileCon").find("li a").unbind().bind("click", function () {
                $(this).parents("li").remove();
                if ($(".showFileCon li").length <= 0) {
                    $(".showFileCon").hide();
                }
                return false;
            });
        }

        // 填写报价单
        if ($(".go-encroll").length > 0) {
            $(".go-encroll").off().on("click", function () {
                getQuotationFuc("add");
            });
        } else {
            // 总价
            $("input[name='price']").off().on("input", function () {
                var main = $(this);
                libs.lenNumber(main[0], 2);
            });
        }

        // 确定报价
        $(".online-bid-btn").off().on("click", function () {
            var that = $(this);
            // if ($("input[name='price']").attr("type") !== "hidden") {
            //     if ($.trim($("input[name='price']").val()) === "") {
            //         $.msgTips({
            //             type: "warning",
            //             content: "请输入总价"
            //         });
            //         return false;
            //     }
            // } else {
            //     if ($(".total-quotation").html() === "") {
            //         $.msgTips({
            //             type: "warning",
            //             content: "请填写报价单"
            //         });
            //         return false;
            //     }
            // }
            if ($(".total-quotation").html() === "") {
                $.msgTips({
                    type: "warning",
                    content: "请填写报价单"
                });
                return false;
            }
            if ($("input[name='file[name][]']").length === 0) {
                $.msgTips({
                    type: "warning",
                    content: "请上传投标文件"
                });
                return false;
            }

            var reqData = that.parents(".online-bid-box").find("form").serialize() + '&tenderId=' + $("input[name='tenderId']").val();

            $.ajaxForJson(config.wwwPath + 'ajaxBid', reqData, function (json) {
                if (json.code === 2000) {
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
                }
            });
        });

        //附件上传
        $(".js_upload2").uppyUpload(".js_upload2", function (name, url) {
            var html = '<li><input type="hidden" name="file[name][]" value="' + name + '"><input type="hidden" name="file[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
            $(".showFileCon").show();
            $(".showFileCon ul").append(html);

            //删除附件
            $(".showFileCon").find("li a").unbind().bind("click", function () {
                $(this).parents("li").remove();
                if ($(".showFileCon li").length <= 0) {
                    $(".showFileCon").hide();
                }
                return false;
            });
        },{
            processCon: "#process-files2",
            extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
        });
    };

    // 查看报名信息
    $(".view_a").off().on("click", function () {
        var main = $(this);
        if (main.attr("name") === "enroll") {
            var enrollHtml = '<div class="cgs-content"><div class="cgs-p"><p><span>已报名单位：</span><span class="marginR25 total_invite_compay"></span>';
            if (main.attr("type") === "invit") {
                enrollHtml += '<span>已邀请单位：</span><span class="marginR25 invite_type"></span>';
            }
            enrollHtml += '</p></div><div id="enroll" class="cgs-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>报名状态</th><th>报名时间</th><th>标书支付凭证</th><th>保证金支付凭证</th></tr></thead><tbody class="page_list"><tr v-if="loading"><td colspan="8"><div class="page_loading"></div></td></tr><template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index + 1}}</td><td><p class="ellipsis"><a :href="\'/supply/detail/\'+item.companyId+\'.html\'" target="_blank">{{item.companyName}}</a></p></td><td>{{item.source}}</td><td>{{item.level}}</td><td v-html="item.isAcceptHTML"></td><td>{{item.enrollTime}}</td><td v-html="item.bookHTML"></td><td v-html="item.marginHTML"></td></tr></template><tr v-else><td colspan="8"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr></tbody></table><div id="pages"><vue-page @get-list="getEnrollInfo" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>';
            $.dialog({
                title: '报名信息',
                content: enrollHtml,
                width: 1110,
                confirm: {
                    show: false,
                    allow: true,
                    name: "确定"
                }
            });
            var vm = new Vue({
                el: '#enroll',
                data() {
                    return {
                        loading: true,
                        list: [],
                        count: 0,
                        limit: 10,
                        current: 1
                    }
                },
                mounted() {
                    this.getEnrollInfo(1);
                },
                methods: {
                    getEnrollInfo(currentPage) {
                        var that = this;
                        that.loading = true;
                        that.current = currentPage || that.current;
                        $.ajaxForJson(config.wwwPath + 'ajaxEnrollInfo', {
                            tenderId: $("input[name='tenderId']").val(),
                            p: that.current
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                that.count = dataObj.data.count;
                                that.list = dataObj.data.data;
                                for (let i = 0; i < that.list.length; i++) {
                                    if (that.list[i].isAcceptKey == "1") {
                                        that.list[i].isAcceptHTML = '<span class="textGreen">' + that.list[i].isAccept + '</span>';
                                    } else if (that.list[i].isAcceptKey == "-1") {
                                        that.list[i].isAcceptHTML = '<span class="textRed">' + that.list[i].isAccept + '</span>';
                                    } else {
                                        that.list[i].isAcceptHTML = that.list[i].isAccept;
                                    }
                                    if (that.list[i].bookKey == "1") {
                                        that.list[i].bookHTML = '<a href="/receipt/tender.html" target="_blank" class="textGreen">' + that.list[i].bookTitle + '</a>';
                                    } else if (that.list[i].bookKey == "0") {
                                        that.list[i].bookHTML = '<a href="/receipt/tender.html" target="_blank" class="textRed">' + that.list[i].bookTitle + '</a>';
                                    } else {
                                        that.list[i].bookHTML = that.list[i].bookTitle;
                                    }
                                    if (that.list[i].marginKey == "1") {
                                        that.list[i].marginHTML = '<a href="/receipt/margin.html" target="_blank" class="textGreen">' + that.list[i].marginTitle + '</a>';
                                    } else if (that.list[i].marginKey == "0") {
                                        that.list[i].marginHTML = '<a href="/receipt/margin.html" target="_blank" class="textRed">' + that.list[i].marginTitle + '</a>';
                                    } else {
                                        that.list[i].marginHTML = that.list[i].marginTitle;
                                    }
                                }

                                $(".total_invite_compay").html(dataObj.data.enrollCount + '家');
                                if (dataObj.data.type === "invit") {
                                    $(".invite_type").html(that.count + '家');
                                }
                            }
                            that.loading = false;
                        });
                    }
                }
            });
        } else if (main.attr("name") === "backBid") {
            $.dialog({
                title: '回标详情',
                content: '<div class="cgs-content"><div class="cgs-p"><p><span>回标进度：</span><span class="marginR25 isBid_pro"></span></p></div><div id="backBidInfo" class="cgs-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>参与投标次数</th><th>中标次数</th><th>投标/报价时间</th><th>状态</th></tr></thead><tbody class="page_list"><tr v-if="loading"><td colspan="8"><div class="page_loading"></div></td></tr><template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index + 1}}</td><td><p class="ellipsis">{{item.companyName}}</p></td><td>{{item.source}}</td><td>{{item.level}}</td><td>{{item.bidCount}}</td><td>{{item.winCount}}</td><td>{{item.bidTime}}</td><td><span :class="item.isBidTitleClass">{{item.isBidTitle}}</span></td></tr></template><tr v-else><td colspan="8"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr></tbody></table><div id="pages"><vue-page @get-list="getBackBidInfo" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>',
                width: 1110,
                confirm: {
                    show: false,
                    allow: true,
                    name: "确定"
                }
            });
            var vm = new Vue({
                el: '#backBidInfo',
                data() {
                    return {
                        loading: true,
                        list: [],
                        count: 0,
                        limit: 10,
                        current: 1
                    }
                },
                mounted() {
                    this.getBackBidInfo(1);
                },
                methods: {
                    getBackBidInfo(currentPage) {
                        var that = this;
                        that.loading = true;
                        that.current = currentPage || that.current;
                        $.ajaxForJson(config.wwwPath + 'ajaxBackBidInfo', {
                            tenderId: $("input[name='tenderId']").val(),
                            p: that.current
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                that.count = dataObj.data.count;
                                that.list = dataObj.data.data;
                                $(".isBid_pro").html(dataObj.data.isBidPro + '家');
                            }
                            that.loading = false;
                        });
                    }
                }
            });
        } else if (main.attr("name") === "openBid") {
            $.get(config.wwwPath + 'ajaxCheckOn', {
                tenderId: tenderId
            }, function (jsonData) {
                var jsonData = JSON.parse(jsonData);
                if (jsonData.code === 2000) {
                    var mailDialog = '<div class="image" style="display: none;"><div class="animated-mail"><div class="letter"><p class="openbid-forth">投标单位：<span class="online_count"></span></p><div class="table_con"><table class="openbid-table" id="openBidLetter"><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>投标文件</th></tr></thead><tbody class="page_list"><tr v-if="loading"><td colspan="5"><div class="page_loading"></div></td></tr><template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index + 1}}</td><td><p class="ellipsis">{{item.companyName}}</p></td><td>{{item.source}}</td><td>{{item.level}}</td><td><a class="download-link" :href="\'/batchDownloadDoc?enrollId=\'+item.enrollId" :enroll-id="item.enrollId">下载</a><template v-if="item.packgeHtml !== 0"><span>-</span><a class="view-link" :supplier-id="item.supplierId" :enroll-id="item.enrollId" href="javascript:;">查看物资清</a></template></td></tr></template><tr v-else><td colspan="5"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr></tbody></table></div></div><div class="top-fold"><p class="openbid-fisrt">在线开标<span class="textRed">仅能操作1次</span>，且<span class="textRed">操作不可逆</span>！请务必保证当前环境适合进行开标操作。</p><div class="openBid_block"><span class="js_upfile"></span><div id="process-upfile"></div></div><div class="showFileCon"><ul></ul></div><div class="input_block"><input type="password" name="bidPassword" class="cjy-input-" placeholder="请输入开标口令"></div></div><div class="body"></div><a href="javascript:;" class="button"></a></div></div><div class="mail-bg" style="height: ' + $(document).height() + 'px;display: none;"></div>';//<label for="uploadFile" class="upfile_btn">上传秘钥文件</label><input type="file" id="uploadFile" name="uploadFile">
                    $("body").append(mailDialog);
                    $(".image").fadeIn();
                    $(".mail-bg").fadeIn();

                    $(".mail-bg").unbind().bind("click", function () {
                        $(".image").removeClass("open");
                        $(".image").fadeOut().remove();
                        $(".mail-bg").fadeOut().remove();
                        return false;
                    });
                    var bidvm = new Vue({
                        el: '#openBidLetter',
                        data() {
                            return {
                                loading: true,
                                list: [],
                                count: 0,
                                limit: 1000,
                                current: 1
                            }
                        },
                        methods: {
                            getOpenBidTable(currentPage) {
                                var that = this;
                                that.loading = true;
                                that.current = currentPage || that.current;
                                $.ajaxForJson(config.wwwPath + 'ajaxOpenBidTable', {
                                    tenderId: $("input[name='tenderId']").val(),
                                    p: that.current,
                                    limit: 1000
                                }, function (dataObj) {
                                    if (dataObj.code == 2000) {
                                        that.count = dataObj.data.count;
                                        that.list = dataObj.data.data;
                                        $(".image").addClass("open");
                                        $(".animated-mail").find(".online_count").html(that.count + '家');
                                        that.$nextTick(function () {
                                            $(".table_con").on("click", ".view-link", function () {
                                                getQuotationFuc("view");
                                            });
                                            $(".animated-mail").find(".button").unbind().bind("click", function () {
                                                $(".image").removeClass("open");
                                                window.location.reload();
                                                return false;
                                            });
                                        });
                                    }
                                    that.loading = false;
                                });
                            }
                        }
                    });

                    // 校验秘钥及口令信息，进行在线开标
                    $(".animated-mail").find(".button").unbind().bind("click", function () {
                        var main = $(this);

                        if ($("input[name='filePath']").length === 0) {
                            $.msgTips({
                                type: "warning",
                                content: "请上传秘钥文件"
                            });
                            return false;
                        } else if ($.trim($("input[name='bidPassword']").val()) == "") {
                            $("input[name='bidPassword']").initInput("error", "请填写口令");
                            $("input[name='bidPassword']").unbind().bind("blur", function () {
                                $("input[name='bidPassword']").initInput();
                            });
                            return false;
                        }

                        $.ajaxForJson(config.wwwPath + "ajaxOpenBid", {
                            tenderId: $("input[name='tenderId']").val(),
                            filePath: $("input[name='filePath']").val(),
                            bidPassword: $("input[name='bidPassword']").val(),
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                bidvm.getOpenBidTable(1);
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    });

                    //附件上传
                    $(".js_upfile").uppyUpload(".js_upfile", function (name, url) {
                        var html = '<li><input type="hidden" name="filePath" value="' + url + '"><span class="ellipsis">' + name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
                        $(".showFileCon").show();
                        $(".showFileCon ul").html(html);

                        //删除附件
                        $(".showFileCon").find("li a").unbind().bind("click", function () {
                            $(this).parents("li").remove();
                            if ($(".showFileCon li").length <= 0) {
                                $(".showFileCon").hide();
                            }
                            return false;
                        });
                    },{
                        processCon: "#process-upfile",
                        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
                    });
                } else {
                    $.dialog({
                        title: '提示',
                        content: '<p style="font-size: 16px;color: #333;padding: 0 30px;">' + jsonData.msg + '</p>',
                        confirm: {
                            show: true,
                            allow: true,
                            name: "确定"
                        },
                        callback: function () {
                            $(".cjy-confirm-btn").off().on("click", function () {
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                            });
                        }
                    });
                }
            });
        } else if (main.attr("name") === "haveBid") {
            $.dialog({
                title: '已开标',
                content: '<div id="openBid" class="openbid-box"><p class="openbid-forth">投标单位：<span class="online_count"></span></p><table class="openbid-table"><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>投标文件</th></tr></thead><tbody class="page_list"><tr v-if="loading"><td colspan="5"><div class="page_loading"></div></td></tr><template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index + 1}}</td><td><p class="ellipsis">{{item.companyName}}</p></td><td>{{item.source}}</td><td>{{item.level}}</td><td><a class="download-link" :href="\'/batchDownloadDoc?enrollId=\'+item.enrollId" :enroll-id="item.enrollId">下载</a><template v-if="item.packgeHtml !== 0"><span>-</span><a class="view-link" :supplier-id="item.supplierId" :enroll-id="item.enrollId" href="javascript:;">查看物资清</a></template></td></tr></template><tr v-else><td colspan="5"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr></tbody></table><div id="pages"><vue-page @get-list="getOpenBidTable" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>',
                width: 1110,
                confirm: {
                    show: false,
                    allow: true,
                    name: "确定"
                }
            });
            var vm = new Vue({
                el: '#openBid',
                data() {
                    return {
                        loading: true,
                        list: [],
                        count: 0,
                        limit: 10,
                        current: 1
                    }
                },
                mounted() {
                    this.getOpenBidTable(1);
                },
                methods: {
                    getOpenBidTable(currentPage) {
                        var that = this;
                        that.loading = true;
                        that.current = currentPage || that.current;
                        $.ajaxForJson(config.wwwPath + 'ajaxOpenBidTable', {
                            tenderId: $("input[name='tenderId']").val(),
                            p: that.current
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                that.count = dataObj.data.count;
                                that.list = dataObj.data.data;
                                $(".online_count").html(that.count + '家');
                                $(".openbid-table").on("click", ".view-link", function () {
                                    getQuotationFuc("view");
                                });
                            }
                            that.loading = false;
                        });
                    }
                }
            });
            $(".openbid-forth").css("display", "block");
            $(".openbid-table").css("display", "inline-table");
        } else if (main.attr("name") === "bidResult") {
            var dHTML = '<div class="cgs-content" id="tenderInfo"><div class="cgs-p"><p><span>回标进度：</span><span class="marginR25 online_count"></span></p><p><span>招标/报价有效性：</span><select name="status"><option value="">请选择</option><option value="4">有效</option><option value="5">无效</option></select></p><p class="discard_box" style="display: none;"><span style="vertical-align: top;">废标说明：</span><textarea class="cjy-textarea" maxlen="200" rows="3" name="discardExplain" style="width: 600px;"></textarea></p></div><div class="cgs-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>选择中标/成交候选人</th><th v-if="proType !== 1">中标金额（元）</th><template v-else><th>中标金额-钢筋类（元）</th><th>中标金额-非钢筋类（元）</th></template><th>备注</th></tr></thead>';
            dHTML += '<tbody class="page_list">';
            dHTML += '<tr v-if="loading"><td colspan="6"><div class="page_loading"></div></td></tr>';
            dHTML += '<template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index+1}}</td><td><p class="ellipsis">{{item.companyName}}</p></td><td><input type="checkbox" name="winSupplier" :value="item.supplierId" v-model="item.checked" title="" /></td><td v-if="proType !== 1"><input type="text" name="fgprice" :supplier-id="item.supplierId" class="cjy-input-" :value="item.fgprice" :supplierId="item.supplierId" placeholder="中标金额" autocomplete="off"></td><template v-else><td><input type="text" name="gprice" :supplier-id="item.supplierId" class="cjy-input-" :value="item.gprice" :supplierId="item.supplierId" placeholder="钢筋类" autocomplete="off"></td><td><input type="text" name="fgprice" :supplier-id="item.supplierId" class="cjy-input-" :value="item.fgprice" :supplierId="item.supplierId" placeholder="非钢筋类" autocomplete="off"></td></template><td><textarea type="text" name="note" :supplier-id="item.supplierId" class="cjy-input-" :value="item.note" placeholder="备注" :supplierId="item.supplierId" maxlen="50" rows="3" style="width: 200px;"></textarea></td></tr></template>';
            dHTML += '<tr v-else><td colspan="6"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr>';
            dHTML += '</tbody>';
            dHTML += '</table></div><div class="cgs-p"><p><input type="checkbox" name="pulicPrice" title="公开最终总价" checked/></p><p class="color333">公示期限：<select name="winDate"><option value="">请选择</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option></select>天。（自发布之日起）</p></div>';
            dHTML += '<div id="pages" class="page_container_wrap"><vue-page @get-list="getTender" :count="count" :limit="10" v-if="list.length>0"></vue-page></div>';
            dHTML += '</div>';
            $.dialog({
                title: '录入招标结果',
                content: dHTML,
                width: 1110,
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
                    $(".cjy-cancel-btn").unbind().bind("click", function () {
                        $(".cjy-poplayer").remove();
                        $(".cjy-bg").remove();
                        return false;
                    });
                    $(".cjy-confirm-btn").off().on("click", function () {
                        var reqData = null;
                        if ($("select[name='status']").val() === "") {
                            $.msgTips({
                                type: "warning",
                                content: "请选择招标有效性"
                            });
                            return false;
                        }
                        if ($("select[name='status']").val() === "4") {
                            // 有效
                            var supplierArr = vm.selectIdArr;
                            var gpriceArr = vm.gprice;
                            var fgpriceArr = vm.fgprice;
                            var noteArr = vm.note;
                            var pulic_price = null;
                            var isBreak = false;
                            if (supplierArr.length === 0) {
                                $.msgTips({
                                    type: "warning",
                                    content: "请选择中标/成交候选人"
                                });
                                return false;
                            }
                            for (let i = 0; i < supplierArr.length; i++) {
                                if ($("input[name='gprice']").length > 0) {
                                    if ($("input[supplierid='" + supplierArr[i] + "']").eq(0).val() === "") {
                                        isBreak = true;
                                        break;
                                    }
                                    if ($("input[supplierid='" + supplierArr[i] + "']").eq(1).val() === "") {
                                        isBreak = true;
                                        break;
                                    }
                                } else {
                                    if ($("input[supplierid='" + supplierArr[i] + "']").eq(0).val() === "") {
                                        isBreak = true;
                                        break;
                                    }
                                }
                            }
                            if (isBreak) {
                                $.msgTips({
                                    type: "warning",
                                    content: "请输入中标金额"
                                });
                                return false;
                            }
                            if ($("select[name='winDate']").val() === "") {
                                $.msgTips({
                                    type: "warning",
                                    content: "请选择公示期限"
                                });
                                return false;
                            }
                            if ($("input[name='pulicPrice']").is(":checked")) {
                                pulic_price = 1;
                            } else {
                                pulic_price = -1;
                            }
                            reqData = 'tenderId=' + $("input[name='tenderId']").val() + '&status=' + $("select[name='status']").val() + '&pulicPrice=' + pulic_price + '&winDate=' + $("select[name='winDate']").val();
                            for (let i = 0; i < supplierArr.length; i++) {
                                reqData += ('&winArr[supplierId][' + i + ']=' + supplierArr[i]);
                                if ($("input[name='gprice']").length > 0) {
                                    reqData += ('&winArr[gprice][' + i + ']=' + (gpriceArr[supplierArr[i]] ? gpriceArr[supplierArr[i]] : 0));
                                    reqData += ('&winArr[fgprice][' + i + ']=' + (fgpriceArr[supplierArr[i]] ? fgpriceArr[supplierArr[i]] : 0));
                                    reqData += ('&winArr[note][' + i + ']=' + (noteArr[supplierArr[i]] ? noteArr[supplierArr[i]] : ""));
                                } else {
                                    reqData += ('&winArr[gprice][' + i + ']=0');
                                    reqData += ('&winArr[fgprice][' + i + ']=' + (fgpriceArr[supplierArr[i]] ? fgpriceArr[supplierArr[i]] : 0));
                                    reqData += ('&winArr[note][' + i + ']=' + (noteArr[supplierArr[i]] ? noteArr[supplierArr[i]] : ""));
                                }
                            }
                        } else {
                            // 无效
                            if ($.trim($("textarea[name='discardExplain']").val()) === "") {
                                $.msgTips({
                                    type: "warning",
                                    content: "请填写废标说明"
                                });
                                return false;
                            }
                            reqData = {
                                tenderId: $("input[name='tenderId']").val(),
                                status: $("select[name='status']").val(),
                                discardExplain: $("textarea[name='discardExplain']").val()
                            };
                        }
                        $.ajaxForJson(config.wwwPath + 'ajaxInputBidResult', reqData, function (json) {
                            if (json.code == 2000) {
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
                            }
                        });
                    });
                }
            });

            var vm = new Vue({
                el: '#tenderInfo',
                data() {
                    return {
                        loading: true,
                        list: [],
                        count: 0,
                        limit: 10,
                        current: 1,
                        selectIdArr: [],
                        gprice: [],
                        fgprice: [],
                        note: [],
                        proType: 0,
                        unitPrice: false
                    }
                },
                mounted() {
                    this.getTender(1);
                },
                methods: {
                    getTender(currentPage) {
                        var that = this;
                        that.loading = true;
                        that.current = currentPage || that.current;
                        $.ajaxForJson(config.wwwPath + 'ajaxTenderResultInfo', {
                            tenderId: $("input[name='tenderId']").val(),
                            bidType: main.attr("bid-type"),
                            p: that.current
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                that.proType = dataObj.data.proType;
                                that.count = dataObj.data.count;
                                for (var i = 0; i < dataObj.data.data.length; i++) {
                                    let id = dataObj.data.data[i].supplierId;
                                    dataObj.data.data[i]['checked'] = that.selectIdArr.indexOf(id) > -1 ? true : false;
                                    dataObj.data.data[i]['gprice'] = typeof (that.gprice[id]) != "undefined" ? that.gprice[id] : "";
                                    dataObj.data.data[i]['fgprice'] = typeof (that.fgprice[id]) != "undefined" ? that.fgprice[id] : "";
                                    dataObj.data.data[i]['note'] = typeof (that.note[id]) != "undefined" ? that.note[id] : "";
                                }
                                that.list = dataObj.data.data;
                                that.$nextTick(function () {
                                    $(".online_count").html(that.count + '家');
                                    $(".cgs-content input[type='checkbox']").initCheckbox();
                                    // $(".cgs-content textarea").initTextarea();
                                    $("select[name='status']").off().on("change", function () {
                                        var main = $(this);
                                        if (main.val() === "5") {
                                            $(".discard_box").css("display", "block");
                                            $(".cgs-table").css("display", "none");
                                            $(".cgs-p").eq(1).css("display", "none");
                                            $("#pages").css("display", "none");
                                        } else {
                                            $(".discard_box").css("display", "none");
                                            $(".cgs-table").css("display", "block");
                                            $(".cgs-p").eq(1).css("display", "block");
                                            $("#pages").css("display", "block");
                                        }
                                    });
                                    $(".cgs-table").on("input", "input[name='gprice'],input[name='fgprice']", function () {
                                        var main = $(this);
                                        libs.lenNumber(main[0], 2);
                                        let id = main.attr("supplierId");
                                        if (main.attr("name") == "gprice") {
                                            that.gprice[id] = main.val();
                                        } else if (main.attr("name") == "fgprice") {
                                            that.fgprice[id] = main.val();
                                        }
                                    });
                                    $(".cgs-table").on("input", "textarea[name='note']", function () {
                                        var main = $(this);
                                        let id = main.attr("supplierId");
                                        that.note[id] = main.val();
                                    });
                                    $("input[name='winSupplier']").unbind().bind("change", function () {
                                        let id = $(this).val();
                                        if ($(this).is(":checked")) {
                                            that.selectIdArr.push(id);
                                        } else {
                                            that.selectIdArr.remove(id);
                                        }
                                    });
                                });
                            }
                            that.loading = false;
                        });
                    }
                }

            });


            $(".cgs-content select").initSelect();
            $(".cgs-content textarea").initTextarea();
        } else if (main.attr("name") === "mybid") {
            // 查看我的投标
            $.get(config.wwwPath + 'ajaxMyBid', {
                tenderId: $("input[name='tenderId']").val()
            }, function (json) {
                var json = JSON.parse(json);
                if (json.code == 2000) {
                    var aHtml = '';
                    for (let i = 0; i < json.data.data.length; i++) {
                        aHtml += '<a class="download_bid" href="/downloadDoc.html?filepath=' + json.data.data[i].path + '&filename=' + json.data.data[i].name + '&tenderId=' + tenderId + '">' + json.data.data[i].name + '</a><br />'
                    }
                    aHtml += '</div></div>';
                    if (json.data.quotation === 1) {
                        aHtml += '<a class="view-encroll" href="javascript:;">查看报价单</a>';
                    }
                    if (json.data.edit === 1) {
                        aHtml += '<a class="edit-encroll" href="javascript:;">修改投标/报价</a>';
                    }
                    $.dialog({
                        title: '我的投标',
                        content: '<div class="online-bid-box"><form class="online-bid-form"><div class="online-bid-item clearfix"><label class="bid-item-title">截止时间：</label><div class="online-bid-block"><span class="dead-time">' + $("input[name='bidEndTimes']").val() + '</span></div></div><div class="online-bid-item clearfix"><label class="bid-item-title">投标文件：</label><div class="online-bid-block">' + aHtml + '</form></div>',
                        width: 650,
                        confirm: {
                            show: false,
                            allow: true,
                            name: "确定"
                        },
                        callback: function () {
                            $(".view-encroll").off().on("click", function () {
                                getQuotationFuc("view");
                            });

                            $(".edit-encroll").off().on("click", function () {
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                                onlineBidFuc({
                                    file: json.data.data,
                                    price: json.data.price
                                });
                            });
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                }
            });
        }
    });

    // // 附件上传
    // $(document).on("click", ".upfile_btn", function () {
    //     $("#uploadFile").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.wwwPath + 'ajaxUploadTenderFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var html = '<li><input type="hidden" name="filePath" value="' + dataObj.data + '"><span class="ellipsis">' + dataObj.name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
    //                     $(".showFileCon").show();
    //                     $(".showFileCon ul").html(html);

    //                     //删除附件
    //                     $(".showFileCon").find("li a").unbind().bind("click", function () {
    //                         $(this).parents("li").remove();
    //                         if ($(".showFileCon li").length <= 0) {
    //                             $(".showFileCon").hide();
    //                         }
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

    // 切换选项卡
    $(".zb_tabs_li").off().on("click", function () {
        var main = $(this);
        var oLi = $(".zb_tabs_li");
        var num = oLi.index(main);
        var oWrap = $(".zb_tabs_wrap");
        var oParent = main.parents(".zb_tabs_list");
        oParent.find(".active").removeClass("active");
        main.addClass("active");
        if (num == 1) {
            $(".js_edit").show();
            $(".js_upload").hide();
        } else if (num == 2) {
            $(".js_edit").hide();
            $(".js_upload").show();
        } else {
            $(".js_edit").hide();
            $(".js_upload").hide();
        }
        $(".display-block").removeClass("display-block").addClass("display-none");
        oWrap.eq(num).addClass("display-block").removeClass("display-none");
    });

    // 招标排序
    var vm2 = new Vue({
        el: '#tenderList',
        data() {
            return {
                loading: true,
                list: [],
                count: 0,
                limit: 10,
                current: 1
            }
        },
        mounted() {
            this.getTenderList(1);
        },
        methods: {
            getTenderList(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + 'ajaxTenderListForItem', {
                    itemId: $(".zb_tabs_wrap").eq(4).attr("item-id"),
                    sort: $(".tender_select .active").attr("sorttype"),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            }
        }
    });
    $(".tender_select span").off().on("click", function () {
        var main = $(this);
        var oSelect = main.parents(".tender_select");
        if (!main.hasClass("active")) {
            oSelect.find(".active").removeClass("active");
            main.addClass("active");
            vm2.getTenderList(1);
        }
        return false;
    });

    // 报名
    $(".takepart_btn,#showSignBox").off().on("click", function () {
        var main = $(this);
        if (main.attr("data-name") === "enroll") {
            // 报名
            $.get(config.wwwPath + 'ajaxEnrollPopup', {
                tenderId: $("input[name='tenderId']").val()
            }, function (json) {
                var json = JSON.parse(json);
                if (json.code == 2000) {
                    if (json.data.word === "") {
                        $.cueDialog({
                            title: "报名",
                            content: '<div class="zhaobiao-pop"><p>招标名称：<span>' + json.data.tender_name + '</span></p><p>招标单位：<span>' + json.data.buyer_name + '</span></p></div>',
                            callback: function () {
                                $(".cjy-confirm-btn").unbind().bind("click", function () {
                                    $.ajaxForJson(config.wwwPath + 'ajaxTenderEnroll', {
                                        tenderId: $("input[name='tenderId']").val()
                                    }, function (dataObj) {
                                        if (dataObj.code === 2000) {
                                            $.msgTips({
                                                type: "success",
                                                content: dataObj.msg,
                                                callback: function () {
                                                    location.reload();
                                                }
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
                    }
                    if (json.data.word === "notVip") {
                        var strHtml = '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div><div class="sign_box"><i class="cjy-close iconfont icon-cha1" style="cursor: pointer;"></i><div class="sign_head">' + json.data.tender_name + '</div><div class="sign_body"><div class="sign_tips clearfix"><i class="iconfont icon-i"></i><p>营造公平、公正、公开的集采环境，提高采购效率和采购质量，根据<a class="textOrange" href="https://www.materialw.com/news/48.html" target="_blank">《生材网会员服务协议》</a> ，针对当前招标您需要缴纳信息服务保证金。若您成功中标，则按协议约定及实际成交金额收取相应信息服务费；若您未中标，生材网将全额返还您的信息服务保证金。</p></div><div class="sign_con"><span class="sign_price"><span class="fontSize30">' + json.data.service_fee + '</span>元</span><span class="sign_info"><span>账户名称：' + json.data.account.name + '</span><span>开户银行：' + json.data.account.bank + '</span><span>账户号码：' + json.data.account.account + '</span></span></div><div class="sign_des">信息服务费保证金注意事项：<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果投标单位（付款人）是公司法人的，信息服务费保证金一律不收取个人账户代付保证金，请以单位账户公对公网银转账支付，转账时请备注投标单位全称、拟报名招标项目名称。如果投标单位是个体户的，也需按以上方式办理对公账户网银转账。如需按其他方式付款的特殊情况，请在付款前咨询生材网财务电话：<span class="textRed">027-82812605</span>，请征得同意后再行办理。生材网退保证金时按原付款账户原路退回。</div></div>';
                        if (main.attr("id") != "showSignBox") {
                            strHtml += '<div class="sign_foot clearfix"><a href="javascript:;" class="sign_confirm">确认报名</a><a href="javascript:;" class="sign_cancel">取消</a></div>';
                        }
                        strHtml += '</div>';
                        $("body").eq(0).append(strHtml);
                        var ele = $(".sign_box");
                        ele.css({
                            "left": ($(window).outerWidth() - ele.outerWidth()) / 2 + "px",
                            "top": $(document).scrollTop() + ($(window).outerHeight() - ele.outerHeight()) > 0 ? $(document).scrollTop() + ($(window).outerHeight() - ele.outerHeight()) / 2 + "px" : "0px",
                            "z-index": 100
                        });
                        ele.fadeIn(400);

                        $(".sign_confirm").unbind().bind("click", function () {
                            $.ajaxForJson(config.wwwPath + 'ajaxTenderEnroll', {
                                tenderId: $("input[name='tenderId']").val(),
                                enrollConfirm: 1
                            }, function (dataObj) {
                                if (dataObj.code === 2000) {
                                    $.msgTips({
                                        type: "success",
                                        content: dataObj.msg,
                                        callback: function () {
                                            location.reload();
                                        }
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

                        $(".sign_cancel,.cjy-close ").unbind().bind("click", function () {
                            $(".cjy-bg").remove();
                            $(".sign_box").remove();
                            return false;
                        });
                        return false;
                    }
                    if (json.data.word === "notInvit") {
                        $.cueDialog({
                            allow: false,
                            title: "报名",
                            topWords: ["icon-i", '抱歉，贵单位不在本次邀请招标的单位之中，无法报名。'],
                            content: '<div class="zhaobiao-pop"><p>招标名称：<span>' + json.data.tender_name + '</span></p><p>招标单位：<span>' + json.data.buyer_name + '</span></p></div>'
                        });
                        return false;
                    }
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                }
            });
        } else if (main.attr("data-name") === "bid") {
            // 在线投标
            if (main.attr("check-name") === "1") {
                $.msgTips({
                    type: "warning",
                    content: '未成功报名，无法进行在线投标'
                });
                return false;
            }
            if (main.attr("check-name") === "2") {
                $.msgTips({
                    type: "warning",
                    content: '您未在受邀之列'
                });
                return false;
            }
            if (main.attr("check-name") === "3") {
                $.dialog({
                    title: '提示',
                    content: '<p style="font-size: 16px;color: #333;line-height: 1.75;padding: 0 30px;">请前往“供应商中心-企业全部投标”页面完成支付凭证上传，如已上传，请等待采购商审核完成</p>',
                    width: 500,
                    confirm: {
                        show: true,
                        allow: true,
                        name: "确认"
                    },
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            return false;
                        });
                    }
                });
                return false;
            }
            onlineBidFuc();
        }
    });

    //上传付款凭证
    $(".voucher_btn").off().on("click", function () {
        var fileName = $("input[name='voucherName']").val(),
            filePath = $("input[name='voucherPath']").val();
        var voucherHTML = '<div class="payment-box clearfix"><div class="payment-content"><div class="payment-region clearfix"><div class="payment-area"><span class="uploadVoucher"></span><div id="process-uploadVoucher"></div></div><p><i class="iconfont icon-i"></i>支持jpg/jpeg/png等格式文件</p></div>';//<label class="upload-payment">上传文件<input type="file" name="uploadFile" id="uploadVoucher" accept="image/*" style="position: absolute;width: 100%;height: 100%;top: 0;right: 0;opacity: 0;cursor: pointer;"></label>
        if (fileName != "") {
            voucherHTML += '<ul class="payment-list"><li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" href="javascript:;" title="' + fileName + '">' + fileName + '</a></li></ul>';
        } else {
            voucherHTML += '<ul class="payment-list" style="display:none;"></ul>';
        }
        voucherHTML += '</div></div>'

        $.dialog({
            title: "信息服务保证金付款凭证",
            content: voucherHTML,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                //查看图片
                $(".payment-content ul").find("li a").unbind().bind("click", function () {
                    $.showPhoto(config.filePath + filePath);
                    return false;
                });
                //附件图片
                $(".uploadVoucher").uppyUpload(".uploadVoucher", function (name, url) {
                    fileName = name, filePath = url;
                    $("input[name='voucherName']").val(fileName);
                    $("input[name='voucherPath']").val(filePath);
                    var html = '<li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" href="javascript:;" title="' + name + '">' + name + '</a></li>';
                    $(".payment-content ul").show().html(html);

                    //查看图片
                    $(".payment-content ul").find("li a").unbind().bind("click", function () {
                        $.showPhoto(config.filePath + filePath);
                        return false;
                    });
                },{
                    allowedFileTypes: ['image/*'],
                    processCon: "#process-uploadVoucher",
                    extArr: ['jpg', 'png', 'jpeg', 'bmp']
                });
                // $(document).on("click", "#uploadVoucher", function () {
                //     $("#uploadVoucher").unbind().bind("change", function () {
                //         var id = $(this).attr("id");
                //         document.domain = config.domainStr;
                //         $.ajaxFileUpload({
                //             url: config.wwwPath + 'ajaxUploadTenderFile',
                //             secureuri: config.domainStr,
                //             fileElementId: id,
                //             data: {
                //                 name: "uploadFile"
                //             },
                //             success: function success(data) {
                //                 var dataObj = eval('(' + data + ')');
                //                 if (dataObj.code == 2000) {
                //                     fileName = dataObj.name, filePath = dataObj.data;
                //                     $("input[name='voucherName']").val(fileName);
                //                     $("input[name='voucherPath']").val(filePath);
                //                     var html = '<li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" href="javascript:;" title="' + dataObj.name + '">' + dataObj.name + '</a></li>';
                //                     $(".payment-content ul").show().html(html);

                //                     //查看图片
                //                     $(".payment-content ul").find("li a").unbind().bind("click", function () {
                //                         $.showPhoto(config.filePath + filePath);
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
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + 'ajaxEnrollVoucher', {
                        name: fileName,
                        path: filePath,
                        tenderId: $("input[name='tenderId']").val()
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

    // // 附件上传
    // var uploadKey = true; //上传开关
    // $(document).on("click", ".upfile_btn2", function () {
    //     if (uploadKey) {
    //         if ($("input[name='file[name][]']").length >= 8) {
    //             $.msgTips({
    //                 type: "warning",
    //                 content: "最多上传8个附件"
    //             });
    //             return false;
    //         }
    //         $("#uploadFile2").unbind().bind("change", function () {
    //             uploadKey = false;
    //             $(".upfile_btn2").html("上传中...");
    //             var id = $(this).attr("id");
    //             document.domain = config.domainStr;
    //             $.ajaxFileUpload({
    //                 url: config.wwwPath + 'ajaxUploadTenderFile',
    //                 secureuri: config.domainStr,
    //                 fileElementId: id,
    //                 data: {
    //                     name: "uploadFile"
    //                 },
    //                 success: function success(data) {
    //                     var dataObj = eval('(' + data + ')');
    //                     if (dataObj.code == 2000) {
    //                         var html = '<li><input type="hidden" name="file[name][]" value="' + dataObj.name + '"><input type="hidden" name="file[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + dataObj.name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
    //                         $(".showFileCon").show();
    //                         $(".showFileCon ul").append(html);

    //                         //删除附件
    //                         $(".showFileCon").find("li a").unbind().bind("click", function () {
    //                             $(this).parents("li").remove();
    //                             if ($(".showFileCon li").length <= 0) {
    //                                 $(".showFileCon").hide();
    //                             }
    //                             return false;
    //                         });
    //                     } else {
    //                         $.msgTips({
    //                             type: "warning",
    //                             content: dataObj.message
    //                         });
    //                     }
    //                     uploadKey = true;
    //                     $(".upfile_btn2").html("上传附件");
    //                 },
    //                 error: function error(data, status) {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: "文件过大或格式不正确"
    //                     });
    //                     uploadKey = true;
    //                     $(".upfile_btn2").html("上传附件");
    //                 }
    //             });
    //         });
    //     }
    // });

    /*
     * 渲染包件查看
     * */
    $.ajaxForJson(config.wwwPath + "getQuotation", {
        tender_id: tenderId,
        supplier_id: supplierId
    }, function (dataObj) {
        if (dataObj.code == "2000") {
            for (var i = 0; i < dataObj.data.length; i++) {
                var html = '<a class="move_table move_left iconfont icon-huadong-zuo"></a><a class="move_table move_right iconfont icon-huadong-you"></a><table><thead><tr><th style="width: 90px;" rowspan="2">序号</th><th style="width: 250px;" rowspan="2">物资名称</th><th style="width: 180px;" rowspan="2">规格型号</th><th style="width: 150px;" rowspan="2">计量单位</th><th style="width: 150px;">数量</th><th style="width: 150px;">税前单价</th><th style="width: 150px;">增值税率（%）</th><th style="width: 150px;">含税单价</th><th style="width: 150px;">税前合价</th><th style="width: 150px;">税金</th><th style="width: 150px;">含税合价</th><th style="width: 180px;" rowspan="2">描述（选填）</th></tr><tr><th>N</th><th>a</th><th>t</th><th>b=a*（1+t）</th><th>S1=a*N</th><th>T=(b-a)*N</th><th>S=b*N</th></tr></thead>';
                html += '<tbody>';
                var total_price = "",
                    total_price_cn = "";
                for (var j = 0; j < dataObj.data[i].product_data.length; j++) {
                    html += '<tr><td>' + (j + 1) + '</td><td>' + dataObj.data[i].product_data[j].product_name + '</td><td>' + dataObj.data[i].product_data[j].gg + '</td><td>' + dataObj.data[i].product_data[j].unit + '</td><td class="js_product_num">' + dataObj.data[i].product_data[j].product_num + '</td><td></td><td></td><td></td><td class="js_pretax_total"></td><td class="js_tax"></td><td class="js_tax_total_price"></td><td>' + dataObj.data[i].product_data[j].describe + '</td></tr>';
                }
                var item = dataObj.data[i].item ? dataObj.data[i].item : "";
                html += '<tr><td colspan="4">总计</td><td colspan="9" class="js_total">' + total_price + '</td></tr><tr><td colspan="4">总计（大写）</td><td colspan="9" class="js_total_ch"></td></tr><tr><td colspan="4">其他报价事项（选填）</td><td colspan="9">' + item + '</td></tr></tbody></table>';
                $(".other_table").html(html);
            }

            //点击右箭头滑动
            $(".move_right").unbind().bind({
                "mousedown": function () {
                    move("right", $(this));
                    return false;
                },
                "mouseup": function () {
                    $(this).parents(".other_table").stop();
                    return false;
                }
            });
            //点击左箭头滑动
            $(".move_left").unbind().bind({
                "mousedown": function () {
                    move("left", $(this));
                    return false;
                },
                "mouseup": function () {
                    $(this).parents(".other_table").stop();
                    return false;
                }
            });

            function move(type, obj) {
                if (type == "left") {
                    var time = obj.parents(".other_table").scrollLeft();
                    obj.parents(".other_table").animate({
                        scrollLeft: 0
                    }, time);

                } else if (type == "right") {
                    var time = obj.parents(".other_table").find("table").width() - obj.parents(".other_table").width() - obj.parents(".other_table").scrollLeft();
                    obj.parents(".other_table").animate({
                        scrollLeft: obj.parents(".other_table").find("table").width() - obj.parents(".other_table").width()
                    }, time);
                }
            }

            $(".other_table").unbind().bind("scroll", function () {
                var main = $(this);
                var scrollX = main.scrollLeft();

                if (scrollX <= 0) {
                    main.removeClass("js_left");
                } else {
                    main.addClass("js_left");
                }
                if (scrollX >= main.find("table").width() - main.width()) {
                    main.removeClass("js_right");
                } else {
                    main.addClass("js_right");
                }

                $(".move_left").css("left", scrollX + "px");
                $(".move_right").css("left", main.width() + scrollX - 48 + "px");
            });
        }
    });

    //获取短信验证码
    var setCode = true;
    $(".sendCode").unbind().bind("click", function () {
        if ($.trim($("input[name='tel']").val()) == "" || !libs.checkMobile($("input[name='tel']").val())) {
            $("input[name='tel']").initInput("error", "请填写正确的联系电话");
            $("input[name='tel']").unbind().bind("blur", function () {
                $("input[name='tel']").initInput();
            });
            return false;
        }
        var main = $(this);
        var timeObj = null;
        if (setCode) {
            var time = 60;
            setCode = false;
            main.removeClass("sendCode").addClass("wait_code").html(time + "秒");
            timeObj = setInterval(function () {
                time--;
                if (time <= 0) {
                    main.removeClass("sendCode").addClass("set_code").html("获取验证码");
                    clearInterval(timeObj);
                    setCode = true;
                } else {
                    main.html(time + "秒");
                }
            }, 1000);
            $.ajaxForJson(config.accountPath + "user/sendUserSms", {
                user_mobile: $("input[name='tel']").val(),
                use_type: "DEFAULT"
            }, function (dataObj) {
                if (dataObj.code != 2000) {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    main.removeClass("wait_code").addClass("sendCode").html("获取验证码");
                    clearInterval(timeObj);
                    setCode = true;
                }
            });
        }
        return false;
    });

    // 确定接收
    $(".btn_confirm").off().on("click", function () {
        var main = $(this);
        if ($.trim($("input[name='rpeople']").val()) == "") {
            $("input[name='rpeople']").initInput("error", "请填写接收人");
            $("input[name='rpeople']").unbind().bind("blur", function () {
                $("input[name='rpeople']").initInput();
            });
            return false;
        } else if ($.trim($("input[name='tel']").val()) == "" || !libs.checkMobile($("input[name='tel']").val())) {
            $("input[name='tel']").initInput("error", "请填写正确的联系电话");
            $("input[name='tel']").unbind().bind("blur", function () {
                $("input[name='tel']").initInput();
            });
            return false;
        } else if ($.trim($("input[name='vcode']").val()) == "") {
            $("input[name='vcode']").initInput("error", "请填写验证码");
            $("input[name='vcode']").unbind().bind("blur", function () {
                $("input[name='vcode']").initInput();
            });
            return false;
        }

        var reqUrl = config.wwwPath + 'ajaxReceiveBookConfirm';
        var reqData = {
            tenderId: $("input[name='tenderId']").val(),
            tel: $.trim($("input[name='tel']").val()),
            vcode: $.trim($("input[name='vcode']").val()),
            rpeople: $.trim($("input[name='rpeople']").val())
        };
        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code === 2000) {
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
            }
        });
    });

    // 附件上传
    $(document).on("click", ".js_upload", function () {
        var contentHtml = '<div class="online-bid-box"><form class="online-bid-form">';
        contentHtml += '<div class="online-bid-item clearfix"><div class="online-bid-block"><span class="js_upload2"></span><span class="upload-tips" style="line-height:1.5;vertical-align:0;"><i class="iconfont icon-i"></i>单个附件不超过100M,最多可上传8个附件,支持jpg、png、jpeg、bmp、pdf、xls、xlsx、docx、doc、txt、zip、rar</span><div id="process-files2"></div></div></div><div class="online-bid-item clearfix"><div class="online-bid-block"><div class="showFileCon"><ul></ul></div></div></div></form></div>';//<label for="uploadFile2" class="upfile_btn2">选择文件</label><input type="file" id="uploadFile2" name="uploadFile" />
        $.dialog({
            title: '澄清文件',
            content: contentHtml,
            width: 650,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            }
        });

        //删除附件
        $(".showFileCon").find("li a").unbind().bind("click", function () {
            $(this).parents("li").remove();
            if ($(".showFileCon li").length <= 0) {
                $(".showFileCon").hide();
            }
            return false;
        });

        // 确定
        $(".cjy-confirm-btn").off().on("click", function () {
            var _fileArr = [];
            for (var i = 0; i < $(".showFileCon").find("li").length; i++) {
                var obj = {
                    file_name: $(".showFileCon").find("li").eq(i).find("input[name='file[name][]']").val(),
                    file_path: $(".showFileCon").find("li").eq(i).find("input[name='file[path][]']").val(),
                }
                _fileArr.push(obj);
            }
            $.ajaxForJson(config.wwwPath + 'ajaxSaveTenderDoc', {
                file: _fileArr,
                tender_id: tenderId
            }, function (json) {
                if (json.code === 2000) {
                    $("#pages_three").ajxForPage(config.wwwPath + 'ajaxTenderDocList', {
                        tender_id: tenderId
                    });
                    $(".cjy-cancel-btn").trigger("click");
                } else {
                    $.msgTips({
                        type: "warning",
                        content: json.msg
                    });
                }
            });
        });

        //附件上传
        $(".js_upload2").uppyUpload(".js_upload2", function (name, url) {
            var html = '<li><input type="hidden" name="file[name][]" value="' + name + '"><input type="hidden" name="file[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><a href="javascript:;" class="textBlue">删除</a></li>';
            $(".showFileCon").show();
            $(".showFileCon ul").append(html);

            //删除附件
            $(".showFileCon").find("li a").unbind().bind("click", function () {
                $(this).parents("li").remove();
                if ($(".showFileCon li").length <= 0) {
                    $(".showFileCon").hide();
                }
                return false;
            });
        }, {
            processCon: "#process-files2",
            extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
        });
    });

    $("#pages_three").ajxForPage(config.wwwPath + 'ajaxTenderDocList', {
        tender_id: tenderId
    });

    //查看更新
    $(".js_showUpdate").unbind().bind("click", function () {
        $.ajaxForJson(config.wwwPath + "getTenderRecord", {
            tenderId: tenderId,
            type: $("input[name='recordType']").val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var dialogHTML = '<div class="changeList_dialog"><div class="changeList_head"><span>报名截止时间：' + dataObj.data.enrollEndTime + '</span><span style="margin-left:100px;">投标截止时间：' + dataObj.data.bidEndTime + '</span></div><div class="material_list"><table><colgroup><col width="100"><col width="100"><col width="100"><col width="160"><col width="100"><col width="100"></colgroup><thead><tr><th>操作时间</th><th>报名截止时间</th><th>投标截止时间</th><th>更新说明</th><th>附件说明</th></tr></thead>';
                for (var i = 0; i < dataObj.data.recordList.length; i++) {
                    dialogHTML += '<tr><td>' + dataObj.data.recordList[i].actTime + '</td><td>' + dataObj.data.recordList[i].enrollEndTime + '</td><td>' + dataObj.data.recordList[i].bidEndTime + '</td><td title="' + dataObj.data.recordList[i].noteTitle + '">' + dataObj.data.recordList[i].note + '</td><td>';
                    for (var j = 0; j < dataObj.data.recordList[i].file.length; j++) {
                        dialogHTML += '<a href="' + dataObj.data.recordList[i].file[j].path + '" class="block textBlue" title="' + dataObj.data.recordList[i].file[j].title + '">' + dataObj.data.recordList[i].file[j].name + '</a>';
                    }
                    dialogHTML += '</td></tr>';
                }
                dialogHTML += '</tbody></table><div class="clear"></div></div></div>';
                $.dialog({
                    title: '变更记录',
                    content: dialogHTML,
                    width: 1200,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    },
                    cancel: {
                        show: true,
                        allow: true,
                        name: "关闭"
                    },
                    callback: function () {
                        $(".cjy-cancel-btn").unbind().bind("click", function () {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            return false;
                        });
                    }
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
});