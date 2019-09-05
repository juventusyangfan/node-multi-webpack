require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');

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
                key: ""
            }
        },
        mounted() {

        },
        methods: {
            getSupplier(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.youshangPath + 'supplier/apply/applyAjax', {
                    buyer_name: that.key,
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            },
            goSearch() {
                $(".findgys_table").show();
                this.getSupplier(1);
            },
            goInvite(companyId, name, mobile) {
                $.ajaxForJson(config.youshangPath + "supplier/apply/demandList", {
                    buyer_id: companyId
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        var _html = '<div style="padding:20px;">';
                        for (var i = 0; i < dataObj.data.length; i++) {
                            _html += '<div><input type="radio" name="typeRadio" value="' + dataObj.data[i].id + '" title="' + dataObj.data[i].title + '"></div>';
                        }
                        _html += '</div>'
                        $.dialog({
                            title: '选择适用类别',
                            content: _html,
                            width: 400,
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
                                $("input[type='radio']").initRadio();

                                //确定按钮
                                $(".cjy-confirm-btn").unbind().bind("click", function () {
                                    var _id = $("input[name='typeRadio']:checked").val()
                                    if ($("input[name='typeRadio']:checked").length > 0) {
                                        window.location.href = "/supplier/apply/applyDetail?id=" + _id + "&buyer_id=" + companyId;
                                    } else {
                                        $.msgTips({
                                            type: "warning",
                                            content: "请选择适用类型！"
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        $.dialog({
                            title: '提示',
                            topWords: ["icon-i", '采购商还没有设置加入要求o(╯□╰)o'],
                            content: '<div style="padding:20px 30px;font-size:16px;">提醒采购商完善准入要求（' + name + '  ' + mobile + '）</div>',
                            width: 540,
                            confirm: {
                                show: false,
                                allow: false,
                                name: "确认"
                            },
                            cancel: {
                                show: false,
                                name: "取消"
                            },
                            button: {
                                show: false,
                                html: ""
                            },
                            callback: function callback() {
                                $(".cjy-cancel-btn").unbind().bind("click", function () {
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                    return false;
                                });
                                $(".cjy-confirm-btn").unbind().bind("click", function () {
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                    return false;
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});