require('cp');
require('elem');
require('../../../public-resource/css/componentPublish.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';
const config = require('configModule');

$(() => {
    //初始化全部包件数据
    $("input[name='pName']").each(function () {
        var main = $(this),
            list = [];
        $.ajaxForJson(config.wwwPath + "/buyer/tender/applyList", {
            package_id: main.val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                list = dataObj.data;
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        var _typeStr = list[i].supplier_type == 1 ? "我的供应商" : "生材网供应商";
                        list[i].typeStr = _typeStr;
                    }
                    main.attr("listObj", JSON.stringify(list));
                }
            }
        });
    });

    //获取包件供应商
    var vmList = new Vue({
        el: '#supplierList',
        data() {
            return {
                loading: true,
                list: []
            }
        },
        mounted() {
            this.getSupplier();
        },
        methods: {
            getSupplier() {
                var that = this;
                var inputObj = $("input[name='pName']:checked").length > 0 ? $("input[name='pName']:checked") : $("input[name='packageId']");
                if (inputObj.attr("listObj")) {
                    that.list = JSON.parse(inputObj.attr("listObj"));
                } else {
                    that.loading = true;
                    $.ajaxForJson(config.wwwPath + "/buyer/tender/applyList", {
                        package_id: inputObj.val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.list = dataObj.data;
                            if (that.list.length > 0) {
                                for (var i = 0; i < that.list.length; i++) {
                                    var _typeStr = that.list[i].supplier_type == 1 ? "我的供应商" : "生材网供应商";
                                    that.$set(that.list[i], "typeStr", _typeStr);
                                }
                                inputObj.attr("listObj", JSON.stringify(that.list));
                            }
                        }
                        that.loading = false;
                    });
                }
            },
            removeItem(index) {
                var that = this;
                var inputObj = $("input[name='pName']:checked").length > 0 ? $("input[name='pName']:checked") : $("input[name='packageId']");
                that.list.splice(index, 1);
                inputObj.attr("listObj", JSON.stringify(that.list));
            }
        }
    });

    //切换包件
    $("input[name='pName']").unbind().bind("change", function () {
        vmList.getSupplier();
    });

    //邀请供应商
    $(".publish_add").unbind().bind("click", function () {
        var _html = '<div class="invite_dialog">';
        _html += '<div class="invite_nav"><ul class="keyUl"><li class="act" data-value="1"><a href="javascript:;">我的供应商</a></li><li data-value="2"><a href="javascript:;">生材网供应商</a></li></ul></div>';
        _html += '<div class="invite_search">';
        _html += '<select name="tenderType" value="0"><option value="0">全部类别</option><option value="1">物资/设备采购</option><option value="3">劳务分包</option><option value="4">专业分包</option><option value="2">设备/物资租赁</option><option value="5">施工总承包</option><option value="6</option><option value="其他">其他</option></select>';
        _html += '<select name="groupType" value="0"><option value="0">全部分组</option></select>';
        _html += '<input type="text" name="company_name" class="cjy-input-" placeholder="请输入供应商名称">';
        _html += '<a href="javascript:;" class="invite_btn_search">搜索</a><a href="javascript:;" class="invite_btn_clear">取消</a>';
        _html += '</div>';
        _html += '<div class="material_list" id="companyList"><table><colgroup><col width="70"><col width="400"><col width="170"><col width="150"><col width="150"><col width="170"><col width="150"></colgroup>';
        _html += '<thead><tr><th>序号</th><th>供应商名称</th><th>供应商来源</th><th>供应商等级</th><th>联系人</th><th>联系方式</th><th>操作</th></tr></thead>';
        _html += '<tbody>';
        _html += '<tr v-if="loading"><td colspan="7" styele="text"><div class="page_loading"></div></td></tr>';
        _html += '<tr v-for="(item,index) in list"><td>{{index+1}}</td><td>{{item.supplier_name}}</td><td>{{item.typeStr}}</td><td>{{item.supplier_level}}</td><td>{{item.real_name}}</td><td>{{item.user_mobile}}</td><td><a href="javascript:;" class="textBlue" v-if="!item.checked" @click="chageCheck(index)">邀请</a><a href="javascript:;" class="textRed" v-else @click="chageCheck(index)">取消邀请</a></td></tr>';
        _html += '<tr v-if="list.length<=0"><td colspan="7"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr></tbody>';
        _html += '</table><div id="pages" class="page_container_wrap"><vue-page @get-list="getCompany" :count="count" :limit="10" v-if="list.length>0"></vue-page></div></div>';
        _html += '</div>';
        $.dialog({
            title: '邀请供应商',
            content: _html,
            width: 1190,
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
                $(".invite_dialog").find("select").initSelect();

                var vm = new Vue({
                    el: '#companyList',
                    data() {
                        return {
                            loading: true,
                            list: [],
                            result: [],
                            count: 0,
                            limit: 10,
                            current: 1
                        }
                    },
                    mounted() {
                        var inputObj = $("input[name='pName']:checked").length > 0 ? $("input[name='pName']:checked") : $("input[name='packageId']");
                        if (inputObj.attr("listObj")) {
                            this.result = JSON.parse(inputObj.attr("listObj"));
                        }
                        this.getCompany(1);
                    },
                    methods: {
                        getCompany(currentPage) {
                            var that = this;
                            var inputObj = $("input[name='pName']:checked").length > 0 ? $("input[name='pName']:checked") : $("input[name='packageId']");
                            that.loading = true;
                            that.current = currentPage || that.current;
                            $.ajaxForJson(config.wwwPath + "/buyer/tender/getSupplier", {
                                package_id: inputObj.val(),
                                supplier_type: $(".keyUl").find("li.act").attr("data-value"),
                                youshang_type_id: $("select[name='tenderType']").val(),
                                group_id: $("select[name='groupType']").val(),
                                company_name: $("input[name='company_name']").val(),
                                p: that.current
                            }, function (dataObj) {
                                if (dataObj.code == 2000) {
                                    that.list = dataObj.data.data;
                                    that.count = dataObj.data.count;
                                    for (var i = 0; i < that.list.length; i++) {
                                        var _typeStr = that.list[i].supplier_type == 1 ? "我的供应商" : "生材网供应商";
                                        that.$set(that.list[i], "typeStr", _typeStr);
                                        var _checked = false;
                                        for (var j = 0; j < that.result.length; j++) {
                                            if (that.result[j].supplier_id == that.list[i].supplier_id) {
                                                _checked = true;
                                                break;
                                            }
                                        }
                                        if (_checked) {
                                            that.$set(that.list[i], "checked", true);
                                        } else {
                                            that.$set(that.list[i], "checked", false);
                                        }
                                    }
                                }
                                that.loading = false;
                            });
                        },
                        chageCheck(index) {
                            var that = this;
                            that.list[index].checked = !that.list[index].checked;
                            if (that.list[index].checked) {
                                that.result.push(that.list[index]);
                            } else {
                                for (var j = 0; j < that.result.length; j++) {
                                    if (that.result[j].supplier_id == that.list[index].supplier_id) {
                                        that.result.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });

                //切换供应商类型
                $(".keyUl").find("a").unbind().bind("click", function () {
                    $(".keyUl").find("li").removeClass("act");
                    $(this).parent().addClass("act");
                    vm.getCompany(1);
                    return false;
                });

                //选择分类
                $("select[name='tenderType']").unbind().bind('change', function () {
                    $.ajaxForJson(config.wwwPath + "/buyer/tender/groupList", {
                        youshang_type_id: $(this).val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            var _sel = '<option value="0">全部分组</option>';
                            if (dataObj.data) {
                                for (var key in dataObj.data) {
                                    _sel += '<option value="' + key + '">' + dataObj.data[key] + '</option>';
                                }
                            }
                            $("select[name='groupType']").val("0").html(_sel).initSelect();
                        } else {
                            $("select[name='groupType']").val("0").html('<option value="0">全部分组</option>').initSelect();
                        }
                    });
                });

                //搜索事件
                $(".invite_dialog").find(".invite_btn_search").unbind().bind("click", function () {
                    vm.getCompany(1);
                    return false;
                });

                //清除事件
                $(".invite_dialog").find(".invite_btn_clear").unbind().bind("click", function () {
                    $("select[name='tenderType']").val("0").initSelect();
                    $("select[name='groupType']").val("0").initSelect();
                    $("input[name='company_name']").val("");
                    vm.getCompany(1);
                    return false;
                });

                //确认事件
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var inputObj = $("input[name='pName']:checked").length > 0 ? $("input[name='pName']:checked") : $("input[name='packageId']");
                    inputObj.attr("listObj", JSON.stringify(vm.result));
                    vmList.getSupplier();
                    $(".cjy-cancel-btn").trigger("click");
                    return false;
                });
            }
        });
        return false;
    });

    //发布下一步
    $(".btn_next").unbind().bind("click", function () {
        if ($(this).attr("type") == "no") {
            var _href = $(this).attr("href");
            window.location.href = _href;
        } else {
            var _data = null;

            var _supplierArr = []
            var inputObj = $("input[name='pName']").length > 0 ? $("input[name='pName']") : $("input[name='packageId']");
    
            inputObj.each(function () {
                var _val = $(this).val(),
                    _list = $(this).attr("listObj"),
                    _idArr = [];
                if (_list) {
                    var _listArr = JSON.parse(_list)
                    for (var i = 0; i < _listArr.length; i++) {
                        _idArr.push(_listArr[i].supplier_id);
                    }
                }
                _supplierArr.push({
                    package_id: _val,
                    supplier_id: _idArr
                });
            });
            _data = {
                cType: $("input[name='cType']").val(),
                step: $("input[name='step']").val(),
                draft: $("input[name='draft']").val(),
                edit: $("input[name='edit']").val(),
                tId: $("input[name='tId']").val(),
                supplier: _supplierArr
            }
            $.ajaxForJson(config.wwwPath + "buyer/tender/addajax", _data, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: "成功",
                        callback: function () {
                            window.location.href = dataObj.data.url;
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
        return false;
    });
    //保存为草稿
    $(".btn_draft").unbind().bind("click", function () {
        $("input[name='draft']").val(1);
        $(".btn_next").trigger("click");
        return false;
    });
});