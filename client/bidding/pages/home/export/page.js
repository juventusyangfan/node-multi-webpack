require('cp');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
// import JSZip from 'jszip';
// import {saveAs} from 'file-saver/FileSaver';

const config = require('configModule');
const libs = require('libs');

$(() => {
    // 邀请的供应商
    if ($("#inviteGys").length > 0) {
        var vm = new Vue({
            el: '#inviteGys',
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
                this.getInvitSupplier(1);
            },
            methods: {
                getInvitSupplier(currentPage) {
                    var that = this;
                    that.loading = true;
                    that.current = currentPage || that.current;
                    $.ajaxForJson(config.wwwPath + 'ajaxInvitSupplier', {
                        tenderId: $(".exportCon").attr("tender-id"),
                        p: that.current
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.count = dataObj.data.data.count;
                            that.list = dataObj.data.data.data;
                        }
                        that.loading = false;
                    });
                }
            }
        });
    }

    // 供应商报名信息
    if ($("#enroll").length > 0) {
        var vm2 = new Vue({
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
                        tenderId: $(".exportCon").attr("tender-id"),
                        p: that.current
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.count = dataObj.data.count;
                            that.list = dataObj.data.data;
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
    }

    //导出pdf
    var webPullKey = true;
    $(".export_btn").unbind().bind("click", function () {
        var main = this;
        if (webPullKey) {
            $.ajaxForJson("/printRecord", {
                tenderId: $(".exportCon").attr("tender-id")
            }, null);
            var pull = new libs.webPull({
                channel: $("input[name='channel']").val(),
                signUrl: $("input[name='sign_url']").val(),
                subUrl: $("input[name='sub_url']").val(),
                callback: function (content, type) {
                    try {
                        content = eval('(' + content + ')');
                    } catch (ex) {
                        content = content;
                    }
                    $(main).html("导出中" + content.pro + "...");
                    if (content.pro == "100%") {
                        window.location.href = content.name;
                        webPullKey = true;
                        $(main).html("导出完成");
                    }
                }
            });
        }
        $(main).html("导出中0%...");
        webPullKey = false;
    });

    // 标书收款记录
    if ($("#receiptBook").length > 0) {
        var vm3 = new Vue({
            el: '#receiptBook',
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
                this.getReceiptBook(1);
            },
            methods: {
                getReceiptBook(currentPage) {
                    var that = this;
                    that.loading = true;
                    that.current = currentPage || that.current;
                    $.ajaxForJson(config.wwwPath + 'ajaxReceiptArr', {
                        tenderId: $(".exportCon").attr("tender-id"),
                        type: 'book',
                        p: that.current
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.count = dataObj.data.count;
                            that.list = dataObj.data.data;
                            $(".book_money").html('标书价格：' + dataObj.data.money + '元');
                        }
                        that.loading = false;
                    });
                },
                viewPhoto(sUrl) {
                    $.showPhoto(config.filePath + '/' + sUrl);
                }
            }
        });
    }

    // 投标保证金收款记录
    if ($("#receiptMargin").length > 0) {
        var vm3 = new Vue({
            el: '#receiptMargin',
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
                this.getReceiptMargin(1);
            },
            methods: {
                getReceiptMargin(currentPage) {
                    var that = this;
                    that.loading = true;
                    that.current = currentPage || that.current;
                    $.ajaxForJson(config.wwwPath + 'ajaxReceiptArr', {
                        tenderId: $(".exportCon").attr("tender-id"),
                        type: 'margin',
                        p: that.current
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.count = dataObj.data.count;
                            that.list = dataObj.data.data;
                            $(".margin_money").html('投标保证金金额：' + dataObj.data.money + '元');
                        }
                        that.loading = false;
                    });
                },
                viewPhoto(sUrl) {
                    $.showPhoto(config.filePath + '/' + sUrl);
                }
            }
        });
    }
});