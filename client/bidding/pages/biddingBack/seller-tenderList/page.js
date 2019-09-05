require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#bidList',
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
            this.getBidList(1);
        },
        methods: {
            getBidList(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + 'ajaxBidList', {
                    partakeType: $("select[name='partakeType']").val(),
                    isWinTender: $("select[name='isWinTender']").val(),
                    tenderType: $("select[name='tenderType']").val(),
                    time: $("input[name='time']").val(),
                    keyword: $("input[name='keyword']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        $(".back_list_info").find("span").html("共" + that.count + "条数据");
                    }
                    that.loading = false;
                });
            }
        }
    });

    //搜索确认事件
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getBidList(1);
        return false;
    });

    //上传、查看事件弹框
    $(".back_list_con").on("click", "a[name='view'],a[name='upload']", function () {
        var main = $(this);
        var status = '';
        switch (main.attr("data-status")) {
            case "待审核":
                status = '<span>待审核</span>';
                break;
            case "未通过":
                status = '<span class="textBlue">未通过</span>';
                break;
            case "已通过":
                status = '<span class="textGreen">已通过</span>';
                break;
        }
        var dialogHTML = '<div class="upload-item"><label>状态：</label><div class="upload-block">' + status + '</div></div><div class="upload-item"><label>上传标书支付凭证：</label><div class="upload-block"><span class="js_upload"></span><span class="msgCon"><span class="noticeBg"><i class="iconfont icon-i"></i></span>格式为jpg，jpeg，png</span><div id="process-files"></div></div></div><div class="upload-item"><label></label><div class="upload-block">';//<a href="javascript:;" class="uploadBtn js_upload"><span>上传文件</span><input type="file" id="uploadFile" name="uploadFile" accept="image/jpeg, image/png" style="position: absolute;width: 100%;height: 100%;top: 0;right: 0;opacity: 0;cursor: pointer;"></a>
        var fileShow = main.attr("data-path") != "" ? "block" : "none";
        dialogHTML += '<div class="fileCon" style="display: ' + fileShow + ';"><i class="iconfont icon-fujian"></i><a class="showImg ellipsis" href="javascript:;" data-path="' + main.attr("data-path") + '">' + main.attr("data-name") + '</a></div>';
        dialogHTML += '</div></div>';
        $.dialog({
            title: '上传标书支付凭证',
            content: dialogHTML,
            confirm: {
                show: true,
                allow: true,
                changeCss: true,
                name: "确定"
            },
            callback: function () {
                //附件上传
                $(".js_upload").uppyUpload(".js_upload", function (name, url) {
                    $.ajaxForJson(config.wwwPath + 'ajaxUploadVoucher', {
                        fileName: name,
                        filePath: url,
                        type: main.attr("data-type"),
                        enrollId: main.attr("data-enrollId"),
                        tenderId: main.attr("data-tenderId")
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $(".fileCon").show();
                            $("a.showImg").html(name); 
                            $("a.showImg").attr("data-path", url);
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                }, {
                    extArr: ['jpg', 'png', 'jpeg', 'bmp']
                });
                // //图片上传
                // var uploadKey = true; //上传开关
                // $(document).on("click", "input[name='uploadFile']", function () {
                //     $("input[name='uploadFile']").unbind().bind("change", function () {
                //         uploadKey = false;
                //         $(".js_upload").find("span").html("上传中...");
                //         var id = $(this).attr("id");
                //         document.domain = config.domainStr;
                //         $.ajaxFileUpload({
                //             url: config.wwwPath + 'ajaxUploadVoucher ',
                //             secureuri: config.domainStr,
                //             fileElementId: id,
                //             data: {
                //                 name: "uploadFile",
                //                 type: main.attr("data-type"),
                //                 enrollId: main.attr("data-enrollId"),
                //                 tenderId: main.attr("data-tenderId")
                //             },
                //             success: function success(data) {
                //                 var dataObj = eval('(' + data + ')');
                //                 if (dataObj.code == 2000) {
                //                     $(".fileCon").show();
                //                     $("a.showImg").html(dataObj.name);
                //                     $("a.showImg").attr("data-path", dataObj.data);
                //                 } else {
                //                     $.msgTips({
                //                         type: "warning",
                //                         content: dataObj.msg
                //                     });
                //                 }
                //                 uploadKey = true;
                //                 $(".js_upload").find("span").html("上传附件");
                //             },
                //             error: function error(data, status) {
                //                 $.msgTips({
                //                     type: "warning",
                //                     content: "文件过大或格式不正确"
                //                 });
                //                 uploadKey = true;
                //                 $(".js_upload").find("span").html("上传附件");
                //             }
                //         });
                //     });
                // });

                //查看图片
                $("a.showImg").unbind().bind("click", function () {
                    $.showPhoto(config.filePath + $("a.showImg").attr("data-path"));
                    return false;
                });

                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    vm.getBidList();
                });
            }
        });
        return false;
    });

    //查看图片
    $(".back_list_con").on("click", "a[name='pic']", function () {
        $.showPhoto(config.filePath + $(this).attr("data-path"));
        return false;
    });
});