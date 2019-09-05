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
                    $.ajaxForJson(config.wwwPath + 'supplierList', {
                        tenderId: $(".exportCon").attr("tender-id"),
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

    //发布招标
    var webPullKey = true;
    $(".edit_btn").unbind().bind("click", function () {
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '确认发布后将不可更改，请仔细核对招标信息！'],
            content: '',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if (webPullKey) {
                        $.ajaxForJson("/ajaxChangeBidStatus", {
                            tenderId: $(".exportCon").attr("tender-id")
                        }, function(dataObj){
                            if (dataObj.code == "2000") {
                                $.msgTips({
                                    type: "success",
                                    content: "发布成功！",
                                    callback: function () {
                                        location.href = dataObj.data.data;
                                    }
                                });
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                            webPullKey = true;
                        });
                    }
                    webPullKey = false;
                    return false;
                });
            }
        });
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