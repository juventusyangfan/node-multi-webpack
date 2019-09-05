require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    var vm = new Vue({
        el: '#supplier',
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
            this.getSupplier(1);
        },
        methods: {
            getSupplier(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + 'invitSupplierList', {
                    tenderId: $("input[name='tenderId']").attr("tender-id"),
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

    //变更时间
    $(".change_btn").unbind().bind("click", function () {
        var dialogHTML = '<div class="addCompany_dialog"><form><input type="hidden" name="tenderId" value="' + $("input[name='tenderId']").attr("tender-id") + '"><div class="addCompany_item clearfix"><label class="addCompany_name">报名截止时间：</label><div class="addCompany_block"><label>' + $("input[name='eEndTimeOld']").val() + '</label>';
        if ($("input[name='eEndTimeStatus']").val() == "1") {
            dialogHTML += '<label class="textRed marginL40">报名已截止，不得更改！</label>'
        } else {
            dialogHTML += '<label class="marginL40">更新为：</label><input type="text" name="eEndTime" calendar placeholder="请选择日期" format="yyyy-MM-dd HH:mm:ss" class="cjy-calendar-input" readonly>';
        }
        dialogHTML += '</div></div><div class="addCompany_item clearfix"><label class="addCompany_name">投标截止时间：</label><div class="addCompany_block"><label>' + $("input[name='bEndTimeOld']").val() + '</label>';
        if ($("input[name='bEndTimeStatus']").val() == "1") {
            dialogHTML += '<label class="textRed marginL40">投标已截止，不得更改！</label>'
        } else {
            dialogHTML += '<label class="marginL40">更新为：</label><input type="text" name="bEndTime" calendar placeholder="请选择日期" format="yyyy-MM-dd HH:mm:ss" class="cjy-calendar-input" readonly>';
        }
        dialogHTML += '</div></div><div class="addCompany_item clearfix"><label class="addCompany_name">更新说明：</label><div class="addCompany_block"><textarea name="note" class="cjy-textarea" maxlen="50"></textarea></div></div><div class="addCompany_item clearfix"><label class="addCompany_name"></label><div class="addCompany_block"><ul class="payment-list" style="display:none;"></ul><div class="upload-area"><span class="js_upload"></span></div><div id="process-files"></div></div></div></form></div>';//<label class="addCompany_upload" for="uploadFile">+附件说明</label><input type="file" name="uploadFile" id="uploadFile" style="display:none;">
        $.dialog({
            title: '变更时间',
            content: dialogHTML,
            width: 800,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
                name: "取消"
            },
            callback: function () {
                $("[calendar]").initCalendar();
                $("textarea.cjy-textarea").initTextarea();

                // 附件上传
                $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                    var html = '<li class="payment-item"><input type="hidden" name="file[name][]" value="' + name + '"><input type="hidden" name="file[path][]" value="' + url + '"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" href="javascript:;" title="' + name + '">' + name + '</a><a class="textRed marginL30">删除</a></li>';
                    $(".addCompany_dialog ul.payment-list").show();
                    $(".addCompany_dialog ul.payment-list").append(html);

                    //删除附件
                    $("ul.payment-list").find("li a.textRed").unbind().bind("click", function () {
                        $(this).parents("li").remove();
                        if ($("ul.payment-list li").length <= 0) {
                            $("ul.payment-list").hide();
                        }
                        return false;
                    });
                }, {
                    extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
                });
                // // 附件上传
                // var uploadKey = true; //上传开关
                // $(document).on("click", ".addCompany_upload", function () {
                //     if (uploadKey) {
                //         if ($("input[name='file[name][]']").length >= 8) {
                //             $.msgTips({
                //                 type: "warning",
                //                 content: "最多上传8个附件"
                //             });
                //             return false;
                //         }
                //         $("#uploadFile").unbind().bind("change", function () {
                //             uploadKey = false;
                //             $(".uploadFile").html("上传中...");
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
                //                         var html = '<li class="payment-item"><input type="hidden" name="file[name][]" value="' + dataObj.name + '"><input type="hidden" name="file[path][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis" href="javascript:;" title="' + dataObj.name + '">' + dataObj.name + '</a><a class="textRed marginL30">删除</a></li>';
                //                         $(".addCompany_dialog ul.payment-list").show();
                //                         $(".addCompany_dialog ul.payment-list").append(html);

                //                         //删除附件
                //                         $("ul.payment-list").find("li a").unbind().bind("click", function () {
                //                             $(this).parents("li").remove();
                //                             if ($("ul.payment-list li").length <= 0) {
                //                                 $("ul.payment-list").hide();
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
                //                     $(".addCompany_upload").html("+附件说明");
                //                 },
                //                 error: function error(data, status) {
                //                     $.msgTips({
                //                         type: "warning",
                //                         content: "文件过大或格式不正确"
                //                     });
                //                     uploadKey = true;
                //                     $(".addCompany_upload").html("+附件说明");
                //                 }
                //             });
                //         });
                //     }
                // });

                $(".cjy-confirm-btn").off().on("click", function () {
                    var requestData = $(".addCompany_dialog").find("form").serialize();
                    $.ajaxForJson(config.wwwPath + 'changeTender', requestData, function (obj) {
                        if (obj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: obj.msg,
                                callback: function () {
                                    location.reload();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: obj.msg
                            });
                        }
                    });
                });
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
        return false;
    });

    //变更记录弹框
    $(".change_list").unbind().bind("click", function () {
        $.ajaxForJson(config.wwwPath + "getTenderRecord", {
            tenderId: $("input[name='tenderId']").attr("tender-id"),
            type: $("input[name='recordType']").val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                var dialogHTML = '<div class="changeList_dialog"><div class="changeList_head"><span>报名截止时间：' + dataObj.data.enrollEndTime + '</span><span style="margin-left:100px;">投标截止时间：' + dataObj.data.bidEndTime + '</span></div><div class="material_list"><table><colgroup><col width="15%"><col width="10%"><col width="15%"><col width="15%"><col width="25%"><col width="20%"></colgroup><thead><tr><th>操作时间</th><th>操作人</th><th>报名截止时间</th><th>投标截止时间</th><th>更新说明</th><th>附件说明</th></tr></thead>';
                for (var i = 0; i < dataObj.data.recordList.length; i++) {
                    dialogHTML += '<tr><td>' + dataObj.data.recordList[i].actTime + '</td><td>' + dataObj.data.recordList[i].userName + '</td><td>' + dataObj.data.recordList[i].enrollEndTime + '</td><td>' + dataObj.data.recordList[i].bidEndTime + '</td><td title="' + dataObj.data.recordList[i].noteTitle + '">' + dataObj.data.recordList[i].note + '</td><td>';
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

    //新增受邀单位
    $(".addCompany_btn").unbind().bind("click", function () {
        var youshangType = JSON.parse($("input[name='youShang']").val());

        var dialogHTML = '<div class="txgys-box"><div class="txgys-form"><select name="type" value="2"><option value="1">全平台供应商</option><option value="2">企业供应商</option></select><select name="youshang_type" value="1">';
        for (var youshangId in youshangType) {
            dialogHTML += '<option value="' + youshangId + '">' + youshangType[youshangId] + '</option>';
        }
        dialogHTML += '</select><select name="group_type" value="0"><option value="0">不限分组</option></select><input type="text" name="keyWord" class="cjy-input-" placeholder="请输入供应商的名称/公司关键字" /><button class="js_goSearch">确定</button></div><div id="tenderAdd"><div class="txgys-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>参与投标次数</th><th>中标次数</th><th v-if="type==2">备注信息</th><th>操作</th></tr></thead><tbody class="page_list">';
        dialogHTML += '<tr v-if="loading"><td colspan="8"><div class="page_loading"></div></td></tr>';
        dialogHTML += '<template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index + 1}}</td><td><p class="ellipsis">{{item.companyName}}</p></td><td>{{item.source}}</td><td>{{item.level}}</td><td>{{item.bidCount}}</td><td>{{item.winCount}}</td><td v-if="type==2"><span class="ellipsis" style="max-width:180px;" :title="item.remark">{{item.remark}}</span></td><td><a href="javascript:;" class="textBlue" @click="sendInvit(index)" v-if="item.isInvit==0">{{item.isInvitTitle}}</a><span v-else>{{item.isInvitTitle}}</span></td><input type="hidden" :own="item.own" :tel="item.tel" :supplier-id="item.supplierId"></tr></template>';
        dialogHTML += '<tr v-else><td colspan="8"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr>';
        dialogHTML += '</tbody></table></div><div id="pages"><vue-page @get-list="getTenderAdd" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>';
        $.dialog({
            title: '新增受邀单位',
            content: dialogHTML,
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "关闭"
            },
            callback: function () {
                let tenderClass = $("select[name='tenderClass']").val() == "0" ? "1" : $("select[name='tenderClass']").val();
                $("select[name='youshang_type']").attr("value", tenderClass);
                $(".txgys-form select").initSelect();
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
                            $.ajaxForJson(config.wwwPath + 'supplierPopList', {
                                tenderId: $("input[name='tenderId']").attr("tender-id"),
                                keyWord: key,
                                type: type,
                                youshang_type: youshangType,
                                group_id: groupId,
                                p: that.current
                            }, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    that.count = dataObj.data.count;
                                    that.list = dataObj.data.data;
                                }
                                that.loading = false;
                            });
                        },
                        sendInvit(index) {
                            var that = this;
                            $.ajaxForJson(config.wwwPath + "sendInvit", {
                                tenderId: $("input[name='tenderId']").attr("tender-id"),
                                supplierId: that.list[index].supplierId
                            }, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    that.list[index].isInvit = 1;
                                    that.list[index].isInvitTitle = "已邀请";
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

                //确认事件
                $(".cjy-confirm-btn,.cjy-close").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    window.location.reload();
                });
            }
        });
        return false;
    });
});