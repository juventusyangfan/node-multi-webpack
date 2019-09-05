require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const wangEditor = require("wangeditor");
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

import Vue from 'vue';

$(() => {

    //富文本编辑器
    tinymce.init({
        selector: '#myEditor',
        width: 670,
        height: 420,
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

    // $("head").append('<link href="' + config.staticPath + 'ueditor/themes/default/css/umeditor.css" type="text/css" rel="stylesheet">');

    // var um = UM.getEditor('myEditor', {
    //     toolbar: ['bold italic underline strikethrough |', 'insertorderedlist insertunorderedlist paragraph | fontfamily fontsize justifyleft justifycenter justifyright justifyjustify | forecolor backcolor |', 'link unlink horizontal | image removeformat cleardoc'],
    //     fontsize: [10, 12, 16, 18, 24, 32],
    //     initialFrameHeight: 360,
    //     zIndex: 90
    // });
    // um.setContent(um.getContent());//修改初始化form传值

    //金额的限制
    $("input[name='tenderBookMoney'],input[name='marginMoney']").unbind().bind("input", function () {
        libs.lenNumber(this, 2);
    });

    //填写预算金额
    $("input[name='budgetMoney']").unbind().bind("input", function () {
        libs.lenNumber(this, 2);
        if ($("select[name='budget']").val() != "" && $("select[name='budget']").val() != "0") {
            var money = parseFloat($(this).val());
            if (money < 1000000) {
                $("select[name='budgetInterval']").attr("value", "1").initSelect();
            } else if (money >= 1000000 && money <= 10000000) {
                $("select[name='budgetInterval']").attr("value", "2").initSelect();
            } else if (money > 10000000) {
                $("select[name='budgetInterval']").attr("value", "3").initSelect();
            }
        }
    });

    //通过项目id搜索名字
    $(".js_check").unbind().bind("click", function () {
        if ($.trim($("input[name='itemId']").val()) == "") {
            $.msgTips({
                type: "warning",
                content: "请输入完整的企业项目编号/平台项目编号"
            });
        } else {
            $("input[name='item_id']").val("");
            $("input[name='item_name']").val("");
            $("span[name='itemName']").html("");
            $.ajaxForJson(config.wwwPath + "/ajaxGetItemInfo", {
                code: $("input[name='itemId']").val()
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    $("input[name='item_id']").val(dataObj.data.item_id);
                    $("input[name='item_name']").val(dataObj.data.item_name);
                    $("span[name='itemName']").html(dataObj.data.item_name);
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
            });
        }
    });

    //移除供应商事件
    $(".material_list").off().on("click", ".js_remove", function () {
        $(this).parents("tr").remove();
        showEvaluate();
        initIndex();
        return false;
    });

    //选择供应商
    $(".js_search").unbind().bind("click", function () {
        var supplierIdArr = [];
        $(".material_list").find("tr[supplierId]").each(function () {
            let id = $(this).attr("supplierId");
            if (supplierIdArr.indexOf(id) <= -1) {
                supplierIdArr.push(id);
            }
        });

        var youshangType = JSON.parse($("input[name='youShang']").val());

        var dialogHTML = '<div class="txgys-box"><div class="txgys-form"><select name="type" value="2"><option value="1">全平台供应商</option><option value="2">企业供应商</option></select><select name="youshang_type" value="1">';
        for (var youshangId in youshangType) {
            dialogHTML += '<option value="' + youshangId + '">' + youshangType[youshangId] + '</option>';
        }
        dialogHTML += '</select><select name="group_type" value="0"><option value="0">不限分组</option></select><input type="text" name="keyWord" class="cjy-input-" placeholder="请输入供应商的名称/公司关键字" /><button class="js_goSearch">确定</button><p>已选择<span class="textRed js_total">0家</span>供应商单位<span class="groupAllWrap floatR" style="display:none;"><input type="checkbox" name="groupAll" title="全选"></span></p></div><div id="tenderAdd"><div class="txgys-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>参与投标次数</th><th>中标次数</th><th v-if="type==2">备注信息</th><th>操作</th></tr></thead><tbody class="page_list">';
        dialogHTML += '<tr v-if="loading"><td colspan="8"><div class="page_loading"></div></td></tr>';
        dialogHTML += '<template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index + 1}}</td><td><p class="ellipsis">{{item.companyName}}</p></td><td>{{item.source}}</td><td>{{item.level}}</td><td>{{item.bidCount}}</td><td>{{item.winCount}}</td><td v-if="type==2"><span class="ellipsis" style="max-width:180px;" :title="item.remark">{{item.remark}}</span></td><td><input type="checkbox" name="supplier" title="" v-model="item.checked" /></td><input type="hidden" :own="item.own" :tel="item.tel" :supplier-id="item.supplierId"></tr></template>';
        dialogHTML += '<tr v-else><td colspan="8"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr>';
        dialogHTML += '</tbody></table></div><div id="pages"><vue-page @get-list="getTenderAdd" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>';
        $.dialog({
            title: '选择供应商',
            content: dialogHTML,
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "完成选择"
            },
            callback: function () {
                let tenderClass = $("select[name='tenderClass']").val() == "0" ? "1" : $("select[name='tenderClass']").val();
                $("select[name='youshang_type']").attr("value", tenderClass);
                $(".txgys-form select").initSelect();
                $(".groupAllWrap input").initCheckbox();
                $.ajaxForJson(config.wwwPath + "ajaxGroupList", {
                    youShangTypeId: $("select[name='youshang_type']").val()
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        var _option = '<option value="0">不限分组</option>';
                        for (var i = 0; i < dataObj.data.length; i++) {
                            _option += '<option value="' + dataObj.data[i].id + '">' + dataObj.data[i].name + '</option>';
                        }
                        $("select[name='group_type']").html(_option).initSelect();
                    }
                });
                var vm = new Vue({
                    el: '#tenderAdd',
                    data() {
                        return {
                            loading: true,
                            type: $("select[name='type']").val(),
                            list: [],
                            count: 0,
                            limit: 10,
                            current: 1
                        }
                    },
                    mounted() {
                        this.getTenderAdd(1);
                    },
                    methods: {
                        getTenderAdd(currentPage) {
                            var that = this;
                            that.loading = true;
                            that.current = currentPage || that.current;
                            var key = $.trim($("input[name='keyWord']").val()),
                                type = $("select[name='type']").val(),
                                youshangType = $("select[name='youshang_type']").val(),
                                groupId = $("select[name='group_type']").val();
                            $.ajaxForJson(config.wwwPath + 'ajaxSelectSupplier', {
                                keyWord: key,
                                type: type,
                                youshang_type: youshangType,
                                group_id: groupId,
                                p: that.current
                            }, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    that.count = dataObj.data.count;
                                    for (var i = 0; i < dataObj.data.data.length; i++) {
                                        dataObj.data.data[i]['checked'] = false;
                                    }
                                    that.list = dataObj.data.data;
                                    that.$nextTick(function () {
                                        $(".txgys-table input[type='checkbox']").initCheckbox();
                                        $(".page_list").find("input[supplier-id]").each(function () {
                                            var trObj = $(this).parents("tr");
                                            let supplierId = $(this).attr("supplier-id");
                                            if (supplierIdArr.indexOf(supplierId) > -1) {
                                                trObj.find("input[type='checkbox']").prop("checked", true);
                                                trObj.find(".cjy-checkbox").addClass("cjy-checked");
                                                trObj.find("i.icon-checkbox").removeClass("icon-checkbox").addClass("icon-checkbox-");
                                            }
                                        });
                                    });
                                    $(".js_total").html($(".material_list").find("tr[supplierid]").length + "家");
                                    //选择供应商分组
                                    if ($("select[name='group_type']").val() == "0") {
                                        $(".groupAllWrap").hide();
                                    } else {
                                        $(".groupAllWrap").show();
                                    }
                                    if ($("select[name='type']").val() != "2") {
                                        $(".groupAllWrap").hide();
                                    }
                                    $(".groupAllWrap").find("input[type='checkbox']").prop("checked", false);
                                    $(".groupAllWrap").find(".cjy-checkbox").removeClass("cjy-checked");
                                    $(".groupAllWrap").find("i.icon-checkbox-").removeClass("icon-checkbox-").addClass("icon-checkbox");
                                }
                                that.loading = false;
                            });
                        }
                    }
                });

                //选择供应商类型
                $("select[name='type']").unbind().bind("change", function () {
                    vm.type = $(this).val();
                    if ($(this).val() == "2") {
                        $("select[name='youshang_type']").next().show();
                        $("select[name='group_type']").next().show();
                    } else {
                        $("select[name='youshang_type']").next().hide();
                        $("select[name='group_type']").next().hide();
                    }
                });

                //选择供应商分类
                $("select[name='youshang_type']").unbind().bind("change", function () {
                    var _typeId = $(this).val();
                    $.ajaxForJson(config.wwwPath + "ajaxGroupList", {
                        youShangTypeId: _typeId
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            var _option = '<option value="0">不限分组</option>';
                            for (var i = 0; i < dataObj.data.length; i++) {
                                _option += '<option value="' + dataObj.data[i].id + '">' + dataObj.data[i].name + '</option>';
                            }
                            $("select[name='group_type']").html(_option).initSelect();
                        }
                    });
                });

                //筛选列表
                $(".js_goSearch").unbind().bind("click", function () {
                    vm.getTenderAdd(1);
                    return false;
                });

                //选中分组下所有供应商
                $(".txgys-form").on("change", "input[name='groupAll']", function () {
                    var main = $(this);
                    $.ajaxForJson(config.wwwPath + "ajaxGroupSupplierIds", {
                        youShangTypeId: $("select[name='youshang_type']").val(),
                        groupId: $("select[name='group_type']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            for (var i = 0; i < dataObj.data.data.length; i++) {
                                if (main.prop("checked")) {
                                    $(".js_none").show();
                                    if (supplierIdArr.indexOf(dataObj.data.data[i].supplierId) <= -1) {
                                        supplierIdArr.push(dataObj.data.data[i].supplierId);
                                        var index = $(".material_list").find("tbody").find("tr").length;
                                        var trHTML = '<tr own="' + dataObj.data.data[i].own + '" supplierId="' + dataObj.data.data[i].supplierId + '"><input type="hidden" name="supplier_id[]" value="' + dataObj.data.data[i].supplierId + '"><td>' + (index + 1) + '</td><td>' + dataObj.data.data[i].companyName + '</td><td>' + dataObj.data.data[i].level + '</td><td>' + dataObj.data.data[i].bidCount + '</td><td>' + dataObj.data.data[i].winCount + '</td><td>' + dataObj.data.data[i].tel + '</td><td><a href="javascript:;" class="textRed js_remove"><i class="iconfont icon-huishouxiang"></i></a></td></tr>';
                                        $(".material_list").find("tbody").append(trHTML);
                                    }
                                    $(".page_list").find("input[supplier-id]").each(function () {
                                        var trObj = $(this).parents("tr");
                                        trObj.find("input[type='checkbox']").prop("checked", true);
                                        trObj.find(".cjy-checkbox").addClass("cjy-checked");
                                        trObj.find("i.icon-checkbox").removeClass("icon-checkbox").addClass("icon-checkbox-");
                                    });
                                } else {
                                    supplierIdArr.remove(dataObj.data.data[i].supplierId);
                                    $(".material_list").find("tr[supplierId='" + dataObj.data.data[i].supplierId + "']").remove();
                                    $(".page_list").find("input[supplier-id]").each(function () {
                                        var trObj = $(this).parents("tr");
                                        trObj.find("input[type='checkbox']").prop("checked", false);
                                        trObj.find(".cjy-checkbox").removeClass("cjy-checked");
                                        trObj.find("i.icon-checkbox-").removeClass("icon-checkbox-").addClass("icon-checkbox");
                                    });
                                    initIndex();
                                }
                            }
                            $(".js_total").html($(".material_list").find("tr[supplierid]").length + "家");
                        }
                    });
                });

                //选中中标单位
                $(".page_list").off().on("change", "input[name='supplier']", function () {
                    var trObj = $(this).parents("tr");
                    var supplierId = trObj.find("input[supplier-id]").attr("supplier-id"),
                        companyName = trObj.find("td").eq(1).text(),
                        companyLevel = trObj.find("td").eq(3).text(),
                        addCount = trObj.find("td").eq(4).text(),
                        doneCount = trObj.find("td").eq(5).text(),
                        tel = trObj.find("input[tel]").attr("tel"),
                        own = trObj.find("input[own]").attr("own");
                    if ($(this).prop("checked")) {
                        if (supplierIdArr.indexOf(supplierId) <= -1) {
                            $(".js_none").show();
                            supplierIdArr.push(supplierId);
                            var index = $(".material_list").find("tbody").find("tr").length;
                            var trHTML = '<tr own="' + own + '" supplierId="' + supplierId + '"><input type="hidden" name="supplier_id[]" value="' + supplierId + '"><td>' + (index + 1) + '</td><td>' + companyName + '</td><td>' + companyLevel + '</td><td>' + addCount + '</td><td>' + doneCount + '</td><td>' + tel + '</td><td><a href="javascript:;" class="textRed js_remove"><i class="iconfont icon-huishouxiang"></i></a></td></tr>';
                            $(".material_list").find("tbody").append(trHTML);
                        }
                    } else {
                        supplierIdArr.remove(supplierId);
                        $(".material_list").find("tr[supplierId='" + supplierId + "']").remove();
                        initIndex();
                    }
                    $(".js_total").html($(".material_list").find("tr[supplierid]").length + "家");
                });

                //确认事件
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    showEvaluate();
                });
            }
        });
    });

    //选择采购内容
    $("select[name='proType']").unbind().bind("change", function () {
        if ($(this).val() == "3") {
            $("input[name='budgetMoneyHH']").parent().show();
        } else {
            $("input[name='budgetMoneyHH']").parent().hide();
        }
    });

    //请选择招标类型
    $("select[name='tenderClass']").unbind().bind("change", function () {
        if ($(this).val() == "2" && $("input[name='collectType']").val() == "price") {
            $(".js_gld").show();
        } else {
            $(".js_gld").hide();
        }
        showEvaluate();
    });
    $(".back_main_content").on("click", ".js_gld", function () {
        var defaultId = "";
        var dialogHTML = '<div class="txgys-box"><div class="txgys-form"><input type="text" name="keyWord" class="cjy-input-" placeholder="请输入询比价主题" /><button class="js_goSearch">搜索</button></div><div id="gldAdd"><div class="txgys-table"><table><thead><tr><th>单据编号</th><th>单据名称</th><th>询比价主题</th><th>询比价申请金额</th><th>审批状态</th><th>询比价说明</th><th>编制日期</th><th>审批时间</th><th>选择</th></tr></thead><tbody class="page_list">';
        dialogHTML += '<tr v-if="loading"><td colspan="9"><div class="page_loading"></div></td></tr>';
        dialogHTML += '<template v-if="list.length>0"><tr v-for="(item,index) in list"><td><p class="ellipsis" style="width:100px;" :title="item.code">{{item.code}}</p></td><td><p class="ellipsis" style="width:100px;" :title="item.cname">{{item.cname}}</p></td><td><p class="ellipsis" style="width:100px;" :title="item.zt">{{item.zt}}</p></td><td>{{item.je}}</td><td>{{item.status}}</td><td><p class="ellipsis" style="width:300px;" :title="item.sm">{{item.sm}}</p></td><td>{{item.bzDate}}</td><td>{{item.spDate}}</td><td><input type="checkbox" name="supplier" title="" v-model="item.checked" /></td><input type="hidden" :supplier-id="item.id"></tr></template>';
        dialogHTML += '<tr v-else><td colspan="9"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr>';
        dialogHTML += '</tbody></table></div><div id="pages"><vue-page @get-list="getGldInfo" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>';
        $.dialog({
            title: '选择广联达数据源',
            content: dialogHTML,
            width: 1180,
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
                $(".txgys-form select").initSelect();
                var vm = new Vue({
                    el: '#gldAdd',
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
                        this.getGldInfo(1);
                    },
                    methods: {
                        getGldInfo(currentPage) {
                            var that = this;
                            that.loading = true;
                            that.current = currentPage || that.current;
                            var key = $.trim($("input[name='keyWord']").val());
                            $.ajaxForJson(config.wwwPath + 'ajaxGldList', {
                                zt: key,
                                p: that.current
                            }, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    that.count = dataObj.data.count;
                                    for (var i = 0; i < dataObj.data.data.length; i++) {
                                        if (dataObj.data.data[i]['id'] == defaultId) {
                                            dataObj.data.data[i]['checked'] = true;
                                        } else {
                                            dataObj.data.data[i]['checked'] = false;
                                        }
                                    }
                                    that.list = dataObj.data.data;
                                    that.$nextTick(function () {
                                        $(".txgys-table input[type='checkbox']").initCheckbox();
                                    });
                                }
                                that.loading = false;
                            });
                        }
                    }
                });

                //筛选列表
                $(".js_goSearch").unbind().bind("click", function () {
                    vm.getGldInfo(1);
                    return false;
                });

                //选中中标单位
                $(".page_list").off().on("change", "input[name='supplier']", function () {
                    var trObj = $(this).parents("tr");
                    var supplierId = trObj.find("input[supplier-id]").attr("supplier-id");
                    if ($(this).prop("checked")) {
                        $(".page_list").find("input[name='supplier']").prop("checked", false);
                        $(this).prop("checked", true);
                        $(".page_list").find("input[name='supplier']").initCheckbox();
                        defaultId = supplierId;
                    } else {
                        defaultId = "";
                    }
                });

                //确认事件
                $(".cjy-confirm-btn").off().on("click", function () {
                    if (defaultId == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择一条询比价"
                        });
                    } else {
                        $.ajaxForJson(config.wwwPath + 'ajaxGldOne', {
                            id: defaultId
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                                gldInfoDialog(dataObj.data);
                            }
                        });
                    }
                });
            }
        });
    });

    function gldInfoDialog(json) {
        var html = '<div class="gldInfo_con clearfix"><div class="gldInfo_item"><label>单据编号：</label><div class="gldInfo_block">' + json.code + '</div></div><div class="gldInfo_item"><label>单据名称：</label><div class="gldInfo_block">' + json.cname + '</div></div><div class="gldInfo_item"><label>询比价主题：</label><div class="gldInfo_block">' + json.zt + '</div></div><div class="gldInfo_item"><label>询比价申请金额：</label><div class="gldInfo_block">' + json.je + '</div></div><div class="gldInfo_item"><label>审批状态：</label><div class="gldInfo_block">' + json.status + '</div></div><div class="gldInfo_item"><label>询比价说明：</label><div class="gldInfo_block">' + json.sm + '</div></div><div class="gldInfo_item"><label>附件信息：</label><div class="gldInfo_block"><div>附件将作为生材网-招投标平台的<span class="textOrange">询比价公告附件</span>，请勾选需要同步的文件</div>';
        for (var i = 0; i < json.attachment.length; i++) {
            if (json.attachment[i].right === 1) {
                html += '<div><input type="checkbox" title="" fid="' + json.attachment[i].fid + '" furl="' + json.attachment[i].url + '"><a href="' + json.attachment[i].url + '" target="_blank"><i class="iconfont icon-fujian"></i>' + json.attachment[i].fname + '</a></div>';
            } else {
                html += '<div><input type="checkbox" title="" fid="' + json.attachment[i].fid + '" furl="' + json.attachment[i].url + '" disabled><a href="javascript:;" title="文件过大，暂不支持选择"><i class="iconfont icon-fujian"></i>' + json.attachment[i].fname + '</a></div>';
            }
        }
        html += '</div></div></div>';
        $.dialog({
            title: '确认询比价信息',
            content: html,
            width: 800,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "返回"
            },
            callback: function () {
                $(".gldInfo_item").find("input[type='checkbox']").initCheckbox();
                //确认事件
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var fidEl = $("input[fid]");
                    var fidArr = [];
                    for (let i = 0; i < fidEl.length; i++) {
                        if (fidEl.eq(i).is(":checked")) {
                            fidArr.push(fidEl.eq(i).attr("fid"));
                        }
                    }
                    $.ajaxForJson(config.wwwPath + 'ajaxGldDataBack', {
                        zt: json.zt,
                        je: json.je,
                        code: json.code,
                        fid: fidArr
                    }, function (jsonSon) {
                        if (jsonSon.code == 2000) {
                            var simpleJson = jsonSon.data;
                            $("input[name='extId']").val(json.id);
                            $("input[name='tenderName']").val(simpleJson.tenderName);
                            $("input[name='tenderCode']").val(simpleJson.tenderCode);
                            $("select[name='budget']").attr("value", simpleJson.budget);
                            $("input[name='budgetMoney']").val(simpleJson.je);
                            $(".affixCon").html("").hide();
                            if (simpleJson.tenderFile.length !== 0) {
                                var jHtml = '';
                                for (let j = 0; j < simpleJson.tenderFile.length; j++) {
                                    jHtml += '<div class="affix_item"><input type="hidden" name="tenderFile[name][]" value="' + simpleJson.tenderFile[j].name + '"><input type="hidden" name="tenderFile[path][]" value="' + simpleJson.tenderFile[j].path + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + simpleJson.tenderFile[j].name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
                                }
                                $(".affixCon").show().append(jHtml);

                                //删除附件
                                $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
                                    $(this).parents(".affix_item").remove();
                                    if ($(".affix_item").length <= 0) {
                                        $(".affixCon").hide();
                                    }
                                    return false;
                                });
                            }
                            $("select[name='budget']").initSelect();
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                        }
                    });
                });
                //返回事件
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    $(".js_gld").trigger("click");
                });
            }
        });
    }

    //选择招标方式
    $("select[name='tenderType']").unbind().bind("change", function () {
        if ($(this).val() == "2") {
            $(".js_none").show();
        } else {
            $(".js_none").hide();
        }
        showEvaluate();
    });
    //选择询价方式
    $("select[name='collectTypeKey']").unbind().bind("change", function () {
        if ($(this).val() == "3") {
            $(".js_none").show();
        } else {
            $(".js_none").hide();
        }
        showEvaluate();
    });

    //购买标书选择
    $("select[name='payTenderBook']").unbind().bind("change", function () {
        if ($(this).val() == "-1") {
            $(".js_book").hide();
        } else {
            $(".js_book").show();
        }
    });
    //支付投标保证金选择
    $("select[name='payMargin']").unbind().bind("change", function () {
        if ($(this).val() == "-1") {
            $(".js_margin").hide();
        } else {
            $(".js_margin").show();
        }
    });

    //选择招标方式
    $("select[name='bidType']").unbind().bind("change", function () {
        if ($(this).val() == "1") {
            $("select[name='openBidType']").html('<option value="1">在线开标</option>').attr("value", "1");
            $("select[name='evaluationType']").parents(".back_main_item").show();
        } else if ($(this).val() == "2") {
            $("select[name='openBidType']").html('<option value="2">线下开标</option>').attr("value", "2");
            $("select[name='evaluationType']").attr("value", "0").parents(".back_main_item").hide();
        } else {
            $("select[name='openBidType']").html('<option value="0">请设置开标方式</option><option value="1">在线开标</option><option value="2">线下开标</option>').attr("value", "0");
            $("select[name='evaluationType']").attr("value", "0").parents(".back_main_item").hide();
        }
        $("select[name='openBidType']").initSelect();
        $("select[name='evaluationType']").initSelect();
        showEvaluate();
    });

    //附件上传
    //删除附件
    $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
        $(this).parents(".affix_item").remove();
        if ($(".affix_item").length <= 0) {
            $(".affixCon").hide();
        }
        return false;
    });
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        if ($(".affix_item").length >= 8) {
            $.msgTips({
                type: "warning",
                content: "最多上传8个附件"
            });
            return false;
        }
        var html = '<div class="affix_item"><input type="hidden" name="tenderFile[name][]" value="' + name + '"><input type="hidden" name="tenderFile[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
        $(".affixCon").show().append(html);

        //删除附件
        $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
            $(this).parents(".affix_item").remove();
            if ($(".affix_item").length <= 0) {
                $(".affixCon").hide();
            }
            return false;
        });
    }, {
        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
    });
    // var uploadKey = true; //上传开关
    // $(document).on("click", "#uploadAccess", function () {
    //     if (uploadKey) {
    //         if ($(".affix_item").length >= 8) {
    //             $.msgTips({
    //                 type: "warning",
    //                 content: "最多上传8个附件"
    //             });
    //             return false;
    //         }
    //         $("#uploadAccess").unbind().bind("change", function () {
    //             uploadKey = false;
    //             $(".js_upload").find("span").html("上传中...");
    //             var id = "uploadAccess";
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
    //                         var html = '<div class="affix_item"><input type="hidden" name="tenderFile[name][]" value="' + dataObj.name + '"><input type="hidden" name="tenderFile[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><span class="ellipsis">' + dataObj.name + '</span><i class="iconfont icon-huishouxiang textRed"></i></div>';
    //                         $(".affixCon").show().append(html);

    //                         //删除附件
    //                         $(".affix_item").find("i.icon-huishouxiang").unbind().bind("click", function () {
    //                             $(this).parents(".affix_item").remove();
    //                             if ($(".affix_item").length <= 0) {
    //                                 $(".affixCon").hide();
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
    //                     $(".js_upload").find("span").html("上传附件");
    //                 },
    //                 error: function error(data, status) {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: "文件过大或格式不正确"
    //                     });
    //                     uploadKey = true;
    //                     $(".js_upload").find("span").html("上传附件");
    //                 }
    //             });
    //         });
    //     }
    // });

    //发布招标公告
    $(".btn_confirm").unbind().bind("click", function () {
        var main = $(this);
        var reqData = $("form").serialize() + "&editorValue=" + encodeURIComponent(tinymce.activeEditor.getContent());
        $.ajaxForJson(config.wwwPath + "/ajaxEditTender", reqData, function (dataObj) {
            if (dataObj.code == 2000) {
                // $.msgTips({
                //     type: "success",
                //     content: dataObj.msg
                // });
                // setTimeout(function () {
                window.location.href = "/tender/file/" + $("input[name='collectType']").val() + ".html?id=" + dataObj.data;
                // }, 1000);
            } else {
                var obj = $("[name='" + dataObj.data + "']");
                if (obj.length > 0 && obj[0].tagName.toUpperCase() == "INPUT") {
                    obj.focus();
                } else if (obj.length > 0 && obj[0].tagName.toUpperCase() == "SELECT") {
                    obj.next(".cjy-select").find("input.cjy-select-input").focus().trigger("click");
                }
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });

    //时间控件的处理
    // var days = 0;
    // if ($("input[name='collectType']").val() == "normal" || $("input[name='collectType']").val() == "negotiation") {
    //     days = 20;
    // }
    var startDate = getToday();
    $("input[calendar]").calendar({
        format: 'yyyy-MM-dd HH:mm',
        minDate: startDate
    });
    // $("input[time='1']").calendar({
    //     format: 'yyyy-MM-dd HH:mm',
    //     minDate: libs.dateADD(getToday(), days)
    // });

    function getToday() {
        function formatDate(num) {
            return parseInt(num) < 10 ? "0" + num : num;
        }

        var today = new Date(); //获得当前日期
        var year = today.getFullYear(); //获得年份
        var month = today.getMonth() + 1; //此方法获得的月份是从0---11，所以要加1才是当前月份
        var day = today.getDate(); //获得当前日期
        return formatDate(year) + '-' + formatDate(month) + '-' + formatDate(day);
    }

    //是否显示投标机器人
    function showEvaluate() {
        if ($("select[name='tenderClass']").val() == "1" && $("select[name='tenderType']").val() == "2" && $("tr[own='0']").length <= 0 && $("tr[own='1']").length > 0 && $("select[name='bidType']").val() == "1") {
            $(".js_evaluate").show();
        } else {
            $(".js_evaluate").hide();
        }
    }
    showEvaluate(); //初始化调用

    //列表序号初始化
    function initIndex() {
        $(".material_list").find("tbody").find("tr").each(function (n) {
            $(this).find("td").eq(0).html(n + 1);
        });
    }
});