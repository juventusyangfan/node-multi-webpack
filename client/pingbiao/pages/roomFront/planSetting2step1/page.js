require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {

    //专家列表渲染
    var vmList = new Vue({
        el: '#zjList',
        data() {
            return {
                loading: true,
                list: []
            }
        },
        mounted() {
            this.getList();
        },
        methods: {
            getList() {
                var that = this;
                that.loading = true;
                $.ajaxForJson(config.pingbiaoPath + "evaluation/teamList", {
                    tenderId: $("input[name='tenderId']").val(),
                    packageId: $("input[name='packageId']").val()
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.list = dataObj.data;
                        for (var i = 0; i < that.list.length; i++) {
                            var areaStr = '全部',
                                areaAll = '',
                                areaNum = 0;
                            for (var key in that.list[i].area) {
                                if (areaNum == 0) {
                                    areaStr = that.list[i].area[key];
                                    areaAll += that.list[i].area[key];
                                } else if (areaNum == 1) {
                                    areaStr += "，" + that.list[i].area[key];
                                    areaAll += "，" + that.list[i].area[key];
                                } else {
                                    areaAll += "，" + that.list[i].area[key];
                                }
                                areaNum++;
                            }
                            if (areaNum > 2) {
                                areaStr = areaStr + '...';
                            }
                            that.$set(that.list[i], "areaStr", areaStr);
                            that.$set(that.list[i], "areaAll", areaAll);
                        }
                    }
                    that.loading = false;
                });
            },
            exportEdit(index) {
                var that = this;
                var citys = '',
                    ctiyArr = [],
                    selectedArr = [];
                for (var key in that.list[index].area) {
                    ctiyArr.push({
                        id: key,
                        name: that.list[index].area[key]
                    })
                }
                for (var i = 0; i < that.list[index].team.length; i++) {
                    selectedArr.push({
                        id: that.list[index].team[i].expert_id,
                        name: that.list[index].team[i].name
                    });
                }
                citys = JSON.stringify(ctiyArr);
                settingDialog({
                    isEdit: true,
                    batchId: that.list[index].batch_id,
                    majorId: that.list[index].major_id,
                    source: that.list[index].source,
                    area: citys,
                    selectExpert: that.list[index].select_type,
                    num: that.list[index].expert_num,
                    selected: selectedArr
                });
            },
            delone(batchId, expertId, expertName) {
                var that = this;
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '确定移除<span class="textRed">' + expertName + '</span>专家？'],
                    content: '',
                    callback: function () {
                        $.ajaxForJson(config.pingbiaoPath + "evaluation/delone", {
                            batchId: batchId,
                            expertId: expertId,
                            tenderId: $("input[name='tenderId']").val(),
                        }, function (dataObj) {
                            if (dataObj.code == "2000") {
                                $.msgTips({
                                    type: "success",
                                    content: dataObj.msg,
                                    callback: function () {
                                        window.location.reload();
                                    }
                                });
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    }
                });
            },
            changeOne(index, expertId) {
                var that = this;
                var ctiyArr = [];
                for (var key in that.list[index].area) {
                    ctiyArr.push({
                        id: key,
                        name: that.list[index].area[key]
                    })
                }
                $.ajaxForJson(config.pingbiaoPath + "evaluation/changeOne", {
                    batchId: that.list[index].batch_id,
                    majorId: that.list[index].major_id,
                    source: that.list[index].source,
                    area: ctiyArr,
                    tenderId: $("input[name='tenderId']").val(),
                    packageId: $("input[name='packageId']").val(),
                    expertId: expertId
                }, function (dataObj) {
                    if (dataObj.code == "2000") {
                        $.msgTips({
                            type: "success",
                            content: dataObj.msg
                        });
                        that.getList();
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: dataObj.msg
                        });
                    }
                });
            },
            expertAffirm(index, expertId, expertName) {
                var that = this;
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '确定已联系<span class="textRed">' + expertName + '</span>专家会准时参加评标？'],
                    content: '',
                    callback: function () {
                        $.ajaxForJson(config.pingbiaoPath + "evaluation/expertAffirm", {
                            affirm: 1,
                            batchId: that.list[index].batch_id,
                            majorId: that.list[index].major_id,
                            tenderId: $("input[name='tenderId']").val(),
                            expertId: expertId
                        }, function (dataObj) {
                            if (dataObj.code == "2000") {
                                $.msgTips({
                                    type: "success",
                                    content: dataObj.msg
                                });
                                that.getList();
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    }
                });
            }
        }
    });

    //新增评标专家
    $(".setting_add").unbind().bind("click", function () {
        settingDialog();
        return false;
    });

    //评标小组设置完成
    $(".setting_btn_confirm").unbind().bind("click", function () {
        $.cueDialog({
            title: "提示",
            topWords: ["icon-i", '评标小组设置完成后将不可再修改，确认完成设置？'],
            content: "",
            allow: true,
            callback: function () {
                var batchIds = [];
                for (var i = 0; i < vmList.list.length; i++) {
                    batchIds.push(vmList.list[i].batch_id);
                }
                $.ajaxForJson(config.pingbiaoPath + "evaluation/finishSet", {
                    tenderId: $("input[name='tenderId']").val(),
                    batchIds: batchIds
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        $.msgTips({
                            type: "success",
                            content: dataObj.msg,
                            callback: function () {
                                window.location.href = dataObj.data.data;
                            }
                        });
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: dataObj.msg
                        });
                    }
                });
            }
        });
        return false;
    });

    function settingDialog(options) {
        var settings = {
            isEdit: false,
            batchId: '',
            majorId: '',
            source: '0',
            area: '""',
            selectExpert: '1',
            num: '',
            selected: []
        }
        $.extend(settings, options || {});

        var _html = '<div class="zjSelect-content"><div class="zjSelect-search"><div class="zjSelect-block clearfix"><label><span class="textRed">*</span>专业分类：</label><div class="zjSelect-item">';
        if (settings.isEdit) {
            _html += '<span style="display:inline-block;height:40px;line-height:40px;">' + expertGroup[settings.majorId] + '</span><input type="hidden" id="majorId" value="' + settings.majorId + '">';
        } else {
            _html += '<select id="majorId" value="' + settings.majorId + '"><option value="">设置你要选取的专家专业分类</option>';
            for (var key in expertGroup) {
                _html += '<option value="' + key + '">' + expertGroup[key] + '</option>';
            }
            _html += '</select>';
        }
        _html += '</div><label><span class="textRed">*</span>专业来源：</label><div class="zjSelect-item"><select id="source" value="' + settings.source + '"><option value="0">全部</option><option value="1">公司内部</option><option value="2">外聘</option></select></div></div><div class="zjSelect-block clearfix"><label>专家选取方式：</label><div class="zjSelect-item"><select id="selectExpert" value="' + settings.selectExpert + '"><option value="1">随机抽取</option><option value="2">手动选取</option></select></div><label><span class="textRed">*</span>专家数量：</label><div class="zjSelect-item"><input type="text" class="cjy-input-" id="num" value="' + settings.num + '"></div></div><div class="zjSelect-block clearfix"><label>所在地区：</label><div class="zjSelect-item">';
        _html += '<div cjy-areaMulti style="width:700px;height:40px;" citys=' + settings.area + ' placeholder="设置你要选取的专家所在地区"></div>';
        _html += '</div></div></div><div class="zjSelect-block clearfix"><label></label><div class="zjSelect-item"><a href="javascript:;" class="setting_complete">完成设置，开始选取专家</a></div></div><div class="material_list clearfix" id="selectList" style="display:none;"><div class="zjChoose_wrap clearfix" v-if="selected.length>0"><label>已选专家：</label><span v-for="(cell,index) in selected" class="cjy-multiCity-cell" :target_id="cell.id">{{cell.name}}<input type="hidden" name="selected_id[]" :value="cell.id"><i class="iconfont icon-cha1" @click="delCell(index)"></i></span></div><table><colgroup><col width="6%"><col width="10%"><col width="10%"><col width="12%"><col width="10%"><col width="10%"><col width="25%"><col width="7%"></colgroup><thead><tr><th>序号</th><th>专家姓名</th><th>专业分类</th><th>所在地区</th><th>来源</th><th>联系方式</th><th>备注信息</th><th>操作</th></tr></thead><tbody><tr v-if="loading"><td colspan="8"><div class="page_loading"></div></td></tr><tr v-for="(item,index) in list"><td>{{index+1}}</td><td>{{item.name}}</td><td>{{item.majorTitle}}</td><td>{{item.city}}</td><td>{{item.source}}</td><td>{{item.phone}}</td><td>{{item.remarks}}</td><td v-if="item.selectStatus==2"><span class="tdGreen">已选择</span></td><td v-if="item.selectStatus==1"><a href="javascript:;" class="tdPurple" @click="chooseDone(index)">选择</a></td><td v-if="item.selectStatus==0"><a href="javascript:;" class="tdRed" @click="chooseNone(index)">取消选择</a></td></tr><tr v-if="list.length<=0" ><td colspan="8"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr></tbody></table><div id="pages"><vue-page @get-list="getList" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>';
        $.dialog({
            title: '选择评标专家',
            content: _html,
            width: 1110,
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
                $("select").initSelect();
                $("[cjy-areaMulti]").initAreaMulti();
                $(".cjy-layer-foot").hide();
                //数量输入
                $("input#num").unbind().bind("input", function () {
                    libs.lenNumber(this, 0);
                });
                //选择选取方式
                $("#selectExpert").unbind().bind("change", function () {
                    if ($(this).val() == "1") {
                        $("#selectList").hide();
                        $(".cjy-layer-foot").hide();
                        $("input#num").parent().show();
                        $("input#num").parent().prev().show();
                    } else if ($(this).val() == "2") {
                        $("input#num").parent().hide();
                        $("input#num").parent().prev().hide();
                    }
                });
                //点击完成设置
                $(".setting_complete").unbind().bind("click", function () {
                    if ($("#majorId").val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择专业分类"
                        });
                        return false;
                    }
                    if ($("#selectExpert").val() == "1") {
                        if ($("input#num").val() == "") {
                            $.msgTips({
                                type: "warning",
                                content: "请填写专家数量"
                            });
                            return false;
                        }
                        var _areaArr = [];
                        $("[cjy-areamulti]").find(".cjy-multiCity-cell").each(function () {
                            var _areaObj = $(this),
                                obj = {
                                    id: _areaObj.find("input[name='city_id[]']").val(),
                                    name: _areaObj.find("input[name='city_name[]']").val()
                                };
                            _areaArr.push(obj);
                        });
                        $.ajaxForJson(config.pingbiaoPath + "evaluation/selectExpertSj", {
                            batchId: settings.batchId,
                            majorId: $("#majorId").val(),
                            source: $("#source").val(),
                            area: _areaArr,
                            tenderId: $("input[name='tenderId']").val(),
                            packageId: $("input[name='packageId']").val(),
                            num: $("input#num").val()
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                                vmList.getList();
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
                    } else if ($("#selectExpert").val() == "2") {
                        $("#selectList").show();
                        $(".cjy-layer-foot").show();
                        vm.getList(1);
                    }
                    return false;
                });
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    var _areaArr = [],
                        _expertIds = [];
                    $("[cjy-areamulti]").find(".cjy-multiCity-cell").each(function () {
                        var _areaObj = $(this),
                            obj = {
                                id: _areaObj.find("input[name='city_id[]']").val(),
                                name: _areaObj.find("input[name='city_name[]']").val()
                            };
                        _areaArr.push(obj);
                    });
                    for (var i = 0; i < vm.selected.length; i++) {
                        _expertIds.push(vm.selected[i].id);
                    }
                    $.ajaxForJson(config.pingbiaoPath + 'evaluation/confirmSd', {
                        batchId: settings.batchId,
                        majorId: $("#majorId").val(),
                        source: $("#source").val(),
                        area: _areaArr,
                        tenderId: $("input[name='tenderId']").val(),
                        packageId: $("input[name='packageId']").val(),
                        expertIds: _expertIds
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
                            });
                            vmList.getList();
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
        var vm = new Vue({
            el: '#selectList',
            data() {
                return {
                    loading: true,
                    list: [],
                    selected: settings.selected,
                    count: 0,
                    limit: 10,
                    current: 1
                }
            },
            methods: {
                getList(currentPage) {
                    var that = this;
                    that.loading = true;
                    that.current = currentPage || that.current;
                    var _areaArr = [];
                    $("[cjy-areamulti]").find(".cjy-multiCity-cell").each(function () {
                        var _areaObj = $(this),
                            obj = {
                                id: _areaObj.find("input[name='city_id[]']").val(),
                                name: _areaObj.find("input[name='city_name[]']").val()
                            };
                        _areaArr.push(obj);
                    });
                    $.ajaxForJson(config.pingbiaoPath + 'evaluation/selectExpertSd', {
                        batchId: settings.batchId,
                        majorId: $("#majorId").val(),
                        source: $("#source").val(),
                        area: _areaArr,
                        tenderId: $("input[name='tenderId']").val(),
                        packageId: $("input[name='packageId']").val(),
                        p: that.current
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.list = dataObj.data.data;
                            that.count = dataObj.data.count;
                            for (var i = 0; i < that.list.length; i++) {
                                for (var j = 0; j < that.selected.length; j++) {
                                    if (that.list[i].expertId == that.selected[j].id) {
                                        that.list[i].selectStatus = 0;
                                    }
                                }
                            }
                        }
                        that.loading = false;
                    });
                },
                chooseDone(index) { //选择
                    var that = this;
                    that.selected.push({
                        id: that.list[index].expertId,
                        name: that.list[index].name
                    });
                    that.list[index].selectStatus = 0;
                },
                chooseNone(index) { //取消选择
                    var that = this,
                        idx = 0;
                    for (var i = 0; i < that.selected.length; i++) {
                        if (that.selected[i].id == that.list[index].expertId) {
                            idx = i;
                        }
                    }
                    that.selected.splice(idx, 1);
                    that.list[index].selectStatus = 1;
                },
                delCell(index) { //删除
                    var that = this,
                        idx = 0;
                    for (var i = 0; i < that.list.length; i++) {
                        if (that.list[i].expertId == that.selected[index].id) {
                            idx = i;
                        }
                    }
                    that.selected.splice(index, 1);
                    that.list[idx].selectStatus = 1;
                }
            }
        });
        //如果修改为手动抽取初始化数据
        if ($("#selectExpert").val() == "2") {
            $("#selectExpert").trigger("change");
            $(".setting_complete").trigger("click");
        }
    }
});