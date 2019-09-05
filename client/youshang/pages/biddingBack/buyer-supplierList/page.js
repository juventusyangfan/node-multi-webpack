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
                current: 1,
                youshang_type_id: libs.getUrlParam('youshang_type_id') || 1, //友商分类ID
                group_id: libs.getUrlParam('group_id') || 0, //友商分类ID
                sort_type: 'time',
                order_by_time: 1,
                order_by_level: 1
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
                var key = $.trim($("input[name='company_name']").val()),
                    remark = $.trim($("input[name='remark_name']").val());
                var reqObj = null;
                if (that.sort_type == "time") {
                    reqObj = {
                        supplier_name: key,
                        remark: remark,
                        youshang_type_id: that.youshang_type_id,
                        group_id: that.group_id,
                        relation_status: $("select[name='status']").val(),
                        supplier_level: $("select[name='level']").val(),
                        order_by_time: that.order_by_time,
                        p: that.current
                    }
                } else {
                    reqObj = {
                        supplier_name: key,
                        remark: remark,
                        youshang_type_id: that.youshang_type_id,
                        group_id: that.group_id,
                        relation_status: $("select[name='status']").val(),
                        supplier_level: $("select[name='level']").val(),
                        order_by_level: that.order_by_level,
                        p: that.current
                    }
                }
                let hashVal = 'youshang_type_id=' + that.youshang_type_id + "&group_id=" + that.group_id;
                window.history.replaceState({}, "分类供应商", window.location.origin + window.location.pathname + '?' + hashVal);
                $(".keyUl").find("li").removeClass("act");
                $(".keyUl").find("li[data-id='" + that.youshang_type_id + "']").addClass("act");
                $.ajaxForJson(config.youshangPath + 'purchaser/index/indexPost', reqObj, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        for (var i = 0; i < that.list.length; i++) {
                            let groupStr = '',
                                _index = 0;
                            for (var key in that.list[i].group) {
                                if (_index == 0) {
                                    groupStr += that.list[i].group[key];
                                } else {
                                    groupStr += "，" + that.list[i].group[key];
                                }
                                _index++;
                            }
                            that.$set(that.list[i], "groupStr", groupStr);
                        }
                    }
                    that.loading = false;
                });
            },
            purchaserDel(id, circleId) {
                $.cueDialog({
                    title: "确认框",
                    topWords: ["icon-i", '确认删除？'],
                    content: '<div style="padding:20px 30px;">删除后，该供应商需要重新审批才能再次加入。</div>',
                    callback: function () {
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            $.ajaxForJson(config.youshangPath + "purchaser/index/delete", {
                                id: id,
                                circle_id: circleId
                            }, function (dataObj) {
                                if (dataObj.code == "2000") {
                                    $.msgTips({
                                        type: "success",
                                        content: dataObj.msg
                                    });
                                    setTimeout(function () {
                                        window.location.reload();
                                    }, 1000);
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
            },
            changeSort(type) {
                this.sort_type = type;
                if (type == "time") {
                    this.order_by_level = 1;
                    if (this.order_by_time != 1) {
                        this.order_by_time = 1;
                    } else {
                        this.order_by_time = 2;
                    }
                } else {
                    this.order_by_time = 1;
                    if (this.order_by_level != 1) {
                        this.order_by_level = 1;
                    } else {
                        this.order_by_level = 2;
                    }
                }
                this.getSupplier(1);
            }
        }

    });

    //切换类型
    $(".keyUl").find("a").unbind().bind("click", function () {
        $(".keyUl").find("li").removeClass("act");
        $(this).parent().addClass("act");
        var typeId = vm.youshang_type_id = $(this).parent().attr("data-id");
        $(".js_group").hide();
        vm.getSupplier(1);
        let hashVal = 'youshang_type_id=' + vm.youshang_type_id + "&group_id=0";
        window.history.replaceState({}, "分类供应商", window.location.origin + window.location.pathname + '?' + hashVal);
        //获取分组
        $.ajaxForJson(config.youshangPath + "purchaser/group/getGroupByCompanyId", {
            youshang_type_id: typeId
        }, function (dataObj) {
            var groupHTML = '<li class="act" data-id="0"><a href="javascript:;">不限分组</a><i class="iconfont icon-gou"></i></li>';
            if (dataObj.code == 2000) {
                for (var i = 0; i < dataObj.data.length; i++) {
                    groupHTML += '<li data-id="' + dataObj.data[i].id + '"><a href="javascript:;" title="' + dataObj.data[i].name + '">' + dataObj.data[i].name + '</a><i class="iconfont icon-gou"></i></li>';
                }
            }
            $(".back_main_group").find("ul").html(groupHTML);
        });
        return false;
    });
    //选择分组
    $(".back_main_group").on("click", "ul a", function () {
        $(".back_main_group").find("ul li").removeClass("act");
        $(this).parent().addClass("act");
        vm.group_id = $(this).parent().attr("data-id");
        if ($(this).parent().attr("data-id") == "0") {
            $(".js_group").hide();
        } else {
            $(".js_group").show();
        }
        vm.getSupplier(1);
    });
    //初始化分组
    var _typeId = libs.getUrlParam('youshang_type_id') || 1;
    $.ajaxForJson(config.youshangPath + "purchaser/group/getGroupByCompanyId", {
        youshang_type_id: _typeId
    }, function (dataObj) {
        var _groupId = libs.getUrlParam('group_id') || 0,
            _act0 = _groupId == 0 ? "act" : "";
        var groupHTML = '<li class="' + _act0 + '" data-id="0"><a href="javascript:;">不限分组</a><i class="iconfont icon-gou"></i></li>';
        if (dataObj.code == 2000) {
            for (var i = 0; i < dataObj.data.length; i++) {
                let _act = _groupId == dataObj.data[i].id ? "act" : "";
                groupHTML += '<li class="' + _act + '" data-id="' + dataObj.data[i].id + '"><a href="javascript:;" title="' + dataObj.data[i].name + '">' + dataObj.data[i].name + '</a><i class="iconfont icon-gou"></i></li>';
            }
        }
        $(".back_main_group").find("ul").html(groupHTML);
    });
    //搜索
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getSupplier(1);
        return false;
    });
    //输入名称回车事件
    $("input[name='company_name'],input[name='remark_name']").unbind().bind("keyup", function () {
        if (event.keyCode == "13") {
            vm.getSupplier(1);
            return false;
        }
    });
    //清除
    $(".btn_clear").unbind().bind("click", function () {
        $("select[name='status']").val("").initSelect();
        $("select[name='level']").val("").initSelect();
        $("input[name='company_name']").val("")
        vm.getSupplier(1);
        return false;
    });

    //维护分组供应商
    var openDlg = false;
    $(".js_group").unbind().bind("click", function () {
        $.dialog({
            title: '维护分组供应商',
            content: '<div class="zjChoose-content" id="gysDlg"><div style="margin-bottom:20px;">' + $(".keyUl").find("li.act a").html() + '：' + $(".back_main_group").find("li.act a").html() + '（{{selectNum}} ）</div><div class="zjChoose-search"><input type="text" name="zhuanjia_input" placeholder="请输入供应商名称" @keyup.enter="getGys(1)"><input type="text" name="remark" class="marginL10" placeholder="请输入备注信息" @keyup.enter="getGys(1)"><a href="javascript:;" class="zjChoose-search-btn" @click="getGys(1)">搜索</a><a href="javascript:;" class="zjChoose-clear" @click="goClear">清空</a></div><div class="material_list clearfix"><table><colgroup><col width="50"><col width="150"><col width="50"><col width="50"><col width="50"><col width="80"><col width="150"><col width="50"></colgroup><thead><tr><th>序号</th><th>供应商名称</th><th>状态</th><th>供应商等级</th><th>联系人</th><th>联系电话</th><th>备注信息</th><th>操作</th></tr></thead><tbody><tr v-if="loading"><td colspan="8"><div class="page_loading"></div></td></tr><template v-if="list.length>0"><tr v-for="(item,index) in list"><td>{{index+1}}<input type="hidden" name="circle_id" :value="item.circle_id"></td><td>{{item.supplier_name}}</td><td>{{item.relation_status_name}}</td><td>{{item.supplier_level_name}}</td><td>{{item.real_name}}</td><td>{{item.user_mobile}}</td><td><span :title="item.remark" class="ellipsis" style="width:200px;">{{item.remark}}</span></td><td><a href="javascript:;" class="textRed" :dataId="item.circle_id" v-if="zjArr.indexOf(item.circle_id)>-1" @click="chooseCancel(item.circle_id)">移除</a><a href="javascript:;" class="textBlue" :dataId="item.circle_id" v-if="zjArr.indexOf(item.circle_id)<=-1" @click="chooseConfirm(item.circle_id)">选择</a></td></tr></template><tr v-else><td colspan="8"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr></tbody></table><div class="clear"></div><div id="pages" class="page_container_wrap marginT20"><vue-page @get-list="getGys" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "提交"
            },
            cancel: {
                show: true,
                allow: true,
                name: "取消"
            },
            callback: function () {
                var vmDlg = new Vue({
                    el: '#gysDlg',
                    data() {
                        return {
                            loading: true,
                            list: [],
                            zjArr: [],
                            count: 0,
                            selectNum: 0,
                            limit: 10,
                            current: 1
                        }
                    },
                    mounted() {
                        this.getGys(1);
                    },
                    methods: {
                        getGys(currentPage) {
                            var that = this;
                            that.loading = true;
                            that.current = currentPage || that.current;
                            var key = $.trim($("input[name='zhuanjia_input']").val()),
                                _remark = $.trim($("input[name='remark']").val());
                            $.ajaxForJson(config.youshangPath + "purchaser/group/groupMember", {
                                youshang_type_id: $(".keyUl").find("li.act").attr("data-id"),
                                group_id: $(".back_main_group").find("li.act").attr("data-id"),
                                company_name: key,
                                remark: _remark,
                                limit: that.limit,
                                p: that.current
                            }, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    that.count = dataObj.data.count;
                                    that.list = dataObj.data.data;

                                    for (var i = 0; i < that.list.length; i++) {
                                        if (that.list[i].is_selected && !openDlg) {
                                            that.zjArr.push(that.list[i].circle_id);
                                            that.selectNum++;
                                        }
                                    }
                                    openDlg = true;
                                }
                                that.loading = false;
                            });
                        },
                        goClear() {
                            $("input[name='zhuanjia_input']").val("");
                            this.getGys(1);
                        },
                        chooseCancel(circleId) {
                            this.zjArr.remove(circleId);
                            this.selectNum--;
                        },
                        chooseConfirm(circleId) {
                            this.zjArr.push(circleId);
                            this.selectNum++;
                        }
                    }
                });


                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    var _params = vmDlg.zjArr.length > 0 ? vmDlg.zjArr : "null";
                    $.ajaxForJson(config.youshangPath + "purchaser/group/addGroupMember", {
                        group_id: $(".back_main_group").find("li.act").attr("data-id"),
                        circle_id: _params
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
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
                });
            }
        });
        return false;
    });
});